"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { JsonSchemaProperty } from "@/src/app/(dashboard)/sequencing/sequencing-processing-types";
import { isGroupRelevant, isParamHidden } from "./submission-relevance-map";

export type ParamValues = Record<string, unknown>;

/**
 * The live paramsSchema nests objects arbitrarily (11 of ont-lsdv's 14
 * top-level properties are themselves `type: "object"` with their own
 * `properties`). `sequencing-processing-types.ts` isn't ours to edit, so we
 * extend its `JsonSchemaProperty` locally with the handful of JSON Schema
 * keywords recursion needs — the base type's index signature already allows
 * this shape, so nothing upstream has to change.
 */
export interface ParamSchema {
  type?: string | string[];
  title?: string;
  description?: string | null;
  properties?: Record<string, ParamSchemaProperty>;
  required?: string[];
  [key: string]: unknown;
}

export interface ParamSchemaProperty extends JsonSchemaProperty {
  properties?: Record<string, ParamSchemaProperty>;
  required?: string[];
}

// Real schemas nest 1-2 levels deep (a top-level object group, occasionally a
// group inside a group). This caps recursion well above that so a
// pathological or malformed schema can't blow the stack or render forever.
const MAX_DEPTH = 4;

function normalizePropType(prop: ParamSchemaProperty): string {
  if (Array.isArray(prop.type)) return prop.type[0] || "string";
  return prop.type || "string";
}

function isGroupSchema(prop: ParamSchemaProperty): boolean {
  return (
    normalizePropType(prop) === "object" &&
    !!prop.properties &&
    Object.keys(prop.properties).length > 0
  );
}

/**
 * A group's `enabled: boolean` property, if it has one — the general
 * convention (never a hardcoded group name) behind the "enabled gate": a
 * section whose schema shapes up as `{enabled: boolean, ...rest}` (e.g.
 * ont-lsdv's `primer` and `nanofilt`) means the pipeline ignores `rest`
 * entirely while `enabled` isn't `true`. Detected structurally, exactly like
 * `flattenSingleFieldGroup` detects its own shape, so a new pipeline whose
 * schema happens to shape up the same way is gated automatically.
 */
function findEnabledGate(schema: ParamSchema): ParamSchemaProperty | null {
  const prop = schema.properties?.enabled;
  if (!prop || normalizePropType(prop) !== "boolean") return null;
  return prop;
}

function isEqualValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === undefined || a === null || b === undefined || b === null)
    return false;
  if (typeof a === "object" || typeof b === "object") {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }
  return false;
}

/** True when `value` is whatever "nothing set" looks like for this property. */
function isAtNaturalDefault(
  prop: ParamSchemaProperty,
  value: unknown,
): boolean {
  if (prop.default !== undefined) return isEqualValue(value, prop.default);
  if (normalizePropType(prop) === "boolean") return value === false;
  return value === undefined || value === null || value === "";
}

function asValueRecord(value: unknown): ParamValues {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as ParamValues)
    : {};
}

/**
 * Builds an initial value map from a pipeline's paramsSchema, seeding every
 * scalar property with its `default` (or a type-appropriate empty value) and
 * every nested object property with its own recursively-built default tree,
 * so the form is fully controlled — and shaped exactly like the schema —
 * from the first render.
 */
export function buildDefaultParamValues(
  schema: ParamSchema | undefined | null,
  depth = 0,
): ParamValues {
  if (depth > MAX_DEPTH || !schema?.properties) return {};
  const values: ParamValues = {};
  for (const [key, prop] of Object.entries(schema.properties)) {
    if (isGroupSchema(prop)) {
      values[key] = buildDefaultParamValues(prop, depth + 1);
      continue;
    }
    if (prop.default !== undefined) {
      values[key] = prop.default;
      continue;
    }
    values[key] = normalizePropType(prop) === "boolean" ? false : "";
  }
  return values;
}

/**
 * Prunes a fully-populated value tree (shaped like `buildDefaultParamValues`)
 * down to only the leaves that differ from the schema's own default — so a
 * user who only touched two settings out of fourteen groups submits a
 * two-key payload, not the whole defaulted tree. Nested objects are included
 * only when they end up with at least one such leaf, preserving the schema's
 * shape (e.g. `{"qc":{"tool":"fastp"}}`) without ever sending an empty group.
 */
export function buildSubmitParams(
  schema: ParamSchema | undefined | null,
  values: ParamValues,
  depth = 0,
): ParamValues {
  if (depth > MAX_DEPTH || !schema?.properties) return {};
  const result: ParamValues = {};
  for (const [key, prop] of Object.entries(schema.properties)) {
    if (isGroupSchema(prop)) {
      const nested = buildSubmitParams(
        prop,
        asValueRecord(values[key]),
        depth + 1,
      );
      if (Object.keys(nested).length > 0) result[key] = nested;
      continue;
    }
    const value = values[key];
    if (!isAtNaturalDefault(prop, value)) result[key] = value;
  }
  return result;
}

/** Field-level message (no label) — shared by inline blur validation and submit-time validation. */
function fieldValidationMessage(
  prop: ParamSchemaProperty,
  value: unknown,
  required: boolean,
): string | null {
  const isEmpty =
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "");
  if (isEmpty) return required ? "is required" : null;

  const type = normalizePropType(prop);

  if (prop.enum && prop.enum.length > 0) {
    const matches = prop.enum.some((opt) => String(opt) === String(value));
    if (!matches) return "must be one of the listed options";
  } else if (type === "number" || type === "integer") {
    const num = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(num)) return "must be a number";
    if (type === "integer" && !Number.isInteger(num))
      return "must be a whole number";
    if (prop.minimum !== undefined && num < prop.minimum)
      return `must be at least ${prop.minimum}`;
    if (prop.maximum !== undefined && num > prop.maximum)
      return `must be at most ${prop.maximum}`;
  } else if (type === "string") {
    const str = String(value);
    if (prop.minLength !== undefined && str.length < prop.minLength)
      return `must be at least ${prop.minLength} characters`;
    if (prop.maxLength !== undefined && str.length > prop.maxLength)
      return `must be at most ${prop.maxLength} characters`;
    if (prop.pattern) {
      try {
        if (!new RegExp(prop.pattern).test(str))
          return "doesn't match the expected format";
      } catch {
        // an unparseable pattern from the backend shouldn't block the user
      }
    }
  }
  return null;
}

/**
 * Validates a (possibly nested) paramsSchema against the current values,
 * recursing into every group. Returns human-readable messages prefixed with
 * the field's own label so an error surfaced at the top (e.g. in a toast)
 * still says which nested setting is the problem — e.g. "Quality control >
 * QC tool is required".
 *
 * When `pipelineId` is given, a top-level group hidden by the relevance map
 * (see submission-relevance-map.ts) is skipped entirely — a group the user
 * can't see and didn't touch should never block their submit, even if the
 * live schema still marks one of its leaves `required` (e.g. clair3's
 * infra-only model_path/platform before the backend finishes stripping
 * them).
 *
 * Same idea for the "enabled gate" (see `findEnabledGate`): once a group's
 * own `enabled` is not `true`, every sibling of it is skipped too — those
 * controls are hidden by `SchemaFields`, so a stale or leftover value in one
 * (e.g. a `tool` picked before the user unticked `enabled`) must never block
 * submit. `enabled` itself is still validated.
 */
export function validateParamValues(
  schema: ParamSchema | undefined | null,
  values: ParamValues,
  depth = 0,
  groupLabel = "",
  pipelineId?: string,
  rootValues?: ParamValues,
): string[] {
  if (depth > MAX_DEPTH || !schema?.properties) return [];
  const errors: string[] = [];
  const required = new Set(schema.required || []);
  const effectiveRoot = rootValues ?? values;
  const enabledGate = findEnabledGate(schema);
  const gateOff = !!enabledGate && values.enabled !== true;
  for (const [key, prop] of Object.entries(schema.properties)) {
    // A hidden top-level param (submission-relevance-map's hidden-params
    // list) never gets a control the user could fix, so it must never block
    // submit even if the live schema still marks it required — same
    // rationale as skipping a relevance-hidden group below.
    if (depth === 0 && pipelineId && isParamHidden(pipelineId, key)) continue;
    // The enabled gate: everything but `enabled` itself is hidden (and thus
    // unfixable by the user) while the gate is off.
    if (gateOff && key !== "enabled") continue;
    const label = prop.title || key;
    const path = groupLabel ? `${groupLabel} > ${label}` : label;
    if (isGroupSchema(prop)) {
      if (
        depth === 0 &&
        pipelineId &&
        !isGroupRelevant(pipelineId, key, effectiveRoot)
      )
        continue;
      errors.push(
        ...validateParamValues(
          prop,
          asValueRecord(values[key]),
          depth + 1,
          path,
          pipelineId,
          effectiveRoot,
        ),
      );
      continue;
    }
    const message = fieldValidationMessage(
      prop,
      values[key],
      required.has(key),
    );
    if (message) errors.push(`${path} ${message}`);
  }
  return errors;
}

/**
 * Resets every top-level group hidden by the relevance map back to the
 * schema's own defaults, so a group the user edited before switching it out
 * of relevance (e.g. filled in bcftools settings, then changed variant.tool
 * away from "bcftools") never leaks a stale non-default value into
 * `buildSubmitParams`. Groups that stay relevant are left exactly as they
 * are; irrelevant-group leaves have no default reopen at that default,
 * matching a first-time render of that group.
 */
export function pruneIrrelevantGroups(
  schema: ParamSchema | undefined | null,
  values: ParamValues,
  pipelineId: string,
  depth = 0,
  rootValues?: ParamValues,
): ParamValues {
  if (depth > MAX_DEPTH || !schema?.properties) return values;
  const effectiveRoot = rootValues ?? values;
  const result: ParamValues = { ...values };
  for (const [key, prop] of Object.entries(schema.properties)) {
    if (!isGroupSchema(prop)) {
      // Hidden top-level scalars (e.g. ont-lsdv's `reference` — see
      // submission-relevance-map.ts) never get an editable control, so
      // nothing should ever be able to leave them off their schema default.
      // Reset defensively on every change, mirroring the treatment an
      // irrelevant group's leaves get below.
      if (depth === 0 && isParamHidden(pipelineId, key))
        result[key] = prop.default;
      continue;
    }
    if (depth === 0 && !isGroupRelevant(pipelineId, key, effectiveRoot)) {
      result[key] = buildDefaultParamValues(prop, depth + 1);
      continue;
    }
    result[key] = pruneIrrelevantGroups(
      prop,
      asValueRecord(values[key]),
      pipelineId,
      depth + 1,
      effectiveRoot,
    );
  }
  return result;
}

/** Total leaf (non-group) settings under a schema — used for the group summary badge. */
function countLeaves(
  schema: ParamSchema | undefined | null,
  depth = 0,
): number {
  if (depth > MAX_DEPTH || !schema?.properties) return 0;
  let count = 0;
  for (const prop of Object.values(schema.properties)) {
    count += isGroupSchema(prop) ? countLeaves(prop, depth + 1) : 1;
  }
  return count;
}

/** Leaves whose current value differs from the schema default — "N of M changed". */
function countChangedLeaves(
  schema: ParamSchema | undefined | null,
  values: ParamValues,
  depth = 0,
): number {
  if (depth > MAX_DEPTH || !schema?.properties) return 0;
  let count = 0;
  for (const [key, prop] of Object.entries(schema.properties)) {
    if (isGroupSchema(prop)) {
      count += countChangedLeaves(prop, asValueRecord(values[key]), depth + 1);
    } else if (!isAtNaturalDefault(prop, values[key])) {
      count += 1;
    }
  }
  return count;
}

type Props = {
  /** Which pipeline this schema belongs to — drives the relevance map so
   *  groups that don't apply to the user's current choices (e.g. medaka
   *  settings while variant.tool is "clair3") stay hidden. */
  pipelineId: string;
  schema: ParamSchema | undefined | null;
  values: ParamValues;
  onChange: (values: ParamValues) => void;
  disabled?: boolean;
  /** Set once the user has attempted to submit with invalid params, so every
   *  field (not just blurred ones) shows its error and groups holding an
   *  error auto-expand. */
  showAllErrors?: boolean;
  /** The pipeline's own stage rail (fetch -> ... -> publish), used only to
   *  order top-level controls the same way — see `sortByStage`. Omit or
   *  pass an empty array and every control just falls back to schema order. */
  stages?: string[];
  /** Extra content (e.g. an upload modal's file picker) a caller wants
   *  rendered inside a specific top-level collapsible section, keyed by that
   *  section's top-level param key — see `SectionExtras` and
   *  `sectionForParamPaths`. Only top-level sections can receive extras;
   *  nested groups don't look this up. */
  sectionExtras?: SectionExtras;
};

/**
 * Orders a list of top-level [key, schema] entries to read in the same
 * fetch -> prepare -> qc -> ... -> publish order as the pipeline's own stage
 * rail, instead of raw schema-declaration order.
 *
 * An entry whose key exactly matches one of `stages`' names (e.g. the "qc"
 * group matching a "qc" stage) is ranked by that stage's position. Anything
 * that doesn't match — including a schema's own detail groups like
 * "bcftools", which are a sub-tool's settings rather than a stage in their
 * own right — falls back to its original position in the schema and always
 * sorts after every matched entry (the comparator's tie-break on
 * `schemaIndex` makes this a stable sort, so unmatched entries keep their
 * relative order). Entirely derived from `stages` and schema order, so an
 * unmatched or unknown pipeline (or one with no `stages` at all) still
 * renders every control, just in schema order.
 */
function sortByStage<Prop>(
  entries: [string, Prop][],
  stages: string[] | undefined,
): [string, Prop][] {
  const stageIndex = new Map((stages || []).map((stage, i) => [stage, i]));
  return entries
    .map((entry, schemaIndex) => ({
      entry,
      schemaIndex,
      stageRank: stageIndex.get(entry[0]),
    }))
    .sort((a, b) => {
      const aRank = a.stageRank ?? Number.MAX_SAFE_INTEGER;
      const bRank = b.stageRank ?? Number.MAX_SAFE_INTEGER;
      return aRank !== bRank ? aRank - bRank : a.schemaIndex - b.schemaIndex;
    })
    .map((x) => x.entry);
}

/**
 * User-facing label overrides for parameters whose schema `title` is
 * accurate to a bioinformatician but opaque to everyone else — keyed
 * pipelineId -> top-level param key (same scope as the hidden-params list).
 * The schema's own `description` is untouched and still renders as helper
 * text underneath; only the label changes.
 *
 * Deliberately a tiny explicit table, not a generic "humanize this title"
 * transform: there's no reliable way to derive "Keep aligned reads file
 * (BAM)" from "Publish BAM" without a human deciding the wording — this is
 * copy, not something the schema can express.
 */
const PARAM_LABEL_OVERRIDES: Record<string, Record<string, string>> = {
  "ont-lsdv": {
    // "Publish BAM" means nothing outside bioinformatics — this is the
    // choice to keep the aligned-reads file as a downloadable artifact.
    keep_alignment: "Keep aligned reads file (BAM)",
  },
};

function labelFor(
  pipelineId: string,
  key: string,
  prop: ParamSchemaProperty,
): string {
  return PARAM_LABEL_OVERRIDES[pipelineId]?.[key] || prop.title || key;
}

/** A group whose schema has exactly one property, e.g. `{"qc":{"tool":{...}}}` — see `flattenSingleFieldGroup`. */
type FlattenedGroup = {
  groupKey: string;
  group: ParamSchemaProperty;
  innerKey: string;
  innerProp: ParamSchemaProperty;
  /** True if the parent schema requires the group, or the group itself requires its one property. */
  required: boolean;
};

/**
 * A group with exactly one property is pure accordion overhead — a click to
 * reveal a single dropdown or checkbox — so it flattens into a plain
 * top-level control instead of a collapsible section. This is purely
 * structural (counts `Object.keys(group.properties).length === 1`, never a
 * hardcoded group name), so a new pipeline whose schema happens to shape up
 * the same way benefits automatically.
 *
 * Only flattens when that one property is itself a leaf: a group whose sole
 * property is *another* group (real schemas nest at most one level deep
 * today, per buildDefaultParamValues' own note) has no single scalar control
 * to collapse down to, so it keeps its normal collapsible treatment instead.
 */
function flattenSingleFieldGroup(
  groupKey: string,
  group: ParamSchemaProperty,
  parentRequired: Set<string>,
): FlattenedGroup | null {
  const entries = Object.entries(group.properties || {});
  if (entries.length !== 1) return null;
  const [innerKey, innerProp] = entries[0];
  if (isGroupSchema(innerProp)) return null;
  const required =
    parentRequired.has(groupKey) || (group.required || []).includes(innerKey);
  return { groupKey, group, innerKey, innerProp, required };
}

/**
 * Extra content a caller renders at the end of a top-level collapsible
 * section, keyed by that section's top-level param key (e.g. "primer") — how
 * the sequencing modal slots its primer-file picker into the "Primer
 * trimming" section instead of maintaining its own duplicate section chrome.
 */
export type SectionExtras = Record<
  string,
  { content: React.ReactNode; hasError: boolean }
>;

/**
 * The top-level key of the collapsible section the form renders right now
 * that owns every one of `paths` (dot paths from the params root, e.g.
 * ["primer.enabled", "primer.tool"]), or null.
 *
 * This is what lets a caller (the upload modal) ask "will my extra file
 * picker actually land inside a rendered section?" instead of guessing —
 * it reuses the exact predicates `PipelineParamsForm` itself renders with
 * (`isParamHidden`, `isGroupRelevant`, `flattenSingleFieldGroup`), so the
 * two can never disagree: hidden, irrelevant, or flattened-away groups
 * return null here too, and the modal falls back to its own top-level file
 * list rather than a picker that silently never appears.
 */
export function sectionForParamPaths(
  pipelineId: string,
  schema: ParamSchema | undefined | null,
  values: ParamValues,
  paths: string[],
): string | null {
  if (!schema?.properties || paths.length === 0) return null;

  const segmented = paths.map((path) => path.split("."));
  if (segmented.some((segments) => segments.length < 2)) return null;

  const groupKey = segmented[0][0];
  if (!segmented.every((segments) => segments[0] === groupKey)) return null;

  const prop = schema.properties[groupKey];
  if (!prop || !isGroupSchema(prop)) return null;
  if (isParamHidden(pipelineId, groupKey)) return null;
  if (!isGroupRelevant(pipelineId, groupKey, values)) return null;

  const rootRequired = new Set(schema.required || []);
  if (flattenSingleFieldGroup(groupKey, prop, rootRequired) !== null)
    return null;

  return groupKey;
}

/**
 * Renders a form driven entirely by a pipeline's paramsSchema (JSON Schema
 * Draft 2020-12) — no parameter is hardcoded here. Scalar/enum/boolean
 * properties render directly; `type: "object"` properties with their own
 * `properties` render as labelled, collapsible groups (recursively, so a
 * group can itself contain groups) — except at the top level, where a group
 * with exactly one property flattens into a plain control instead (see
 * `flattenSingleFieldGroup`). Anything else (array, or an
 * unrecognized/typeless property) falls back to a raw-JSON field rather than
 * being silently dropped.
 *
 * Top-level groups the relevance map marks as not applicable right now, and
 * top-level params the hidden-params list pins to their default
 * (submission-relevance-map.ts), are skipped entirely — they contribute
 * nothing to `values` beyond their own schema defaults, kept that way by
 * `pruneIrrelevantGroups` on every change here.
 *
 * The top level renders in three parts, in this order:
 *   1. every flattened single-field group, as a plain control grid;
 *   2. every remaining (2+ field) group, as the original collapsible list;
 *   3. every top-level scalar (never a group — e.g. `keep_alignment`) under
 *      "Output options", since a scalar sitting alongside stage-named
 *      groups at the schema root is structurally a run-wide toggle rather
 *      than one stage's analysis setting.
 * Parts 1 and 2 are each ordered via `sortByStage` against the pipeline's
 * own `stages`, so controls read in the same fetch -> ... -> publish order
 * as the stage rail elsewhere on this page.
 *
 * `sectionExtras` (see that type and `sectionForParamPaths`) lets a caller
 * slot extra content — e.g. the upload modal's primer-file picker — at the
 * end of one of part 2's collapsible sections, keyed by its top-level param
 * key; only those top-level sections look it up, nested groups don't.
 *
 * Inside any group body (nested groups included), a group whose own schema
 * has an `enabled: boolean` property gates the rest of that body — see
 * `findEnabledGate` and `SchemaFields` — hiding its other fields, nested
 * groups, and any `sectionExtras` content until `enabled` is `true`.
 */
export default function PipelineParamsForm({
  pipelineId,
  schema,
  values,
  onChange,
  disabled,
  showAllErrors,
  stages,
  sectionExtras,
}: Props) {
  if (!schema?.properties || Object.keys(schema.properties).length === 0)
    return null;

  const handleChange = (next: ParamValues) => {
    onChange(pruneIrrelevantGroups(schema, next, pipelineId));
  };

  const rootRequired = new Set(schema.required || []);
  const visibleEntries = Object.entries(schema.properties).filter(
    ([key]) => !isParamHidden(pipelineId, key),
  );
  if (visibleEntries.length === 0) return null;

  const relevantGroupEntries = sortByStage(
    visibleEntries.filter(([, prop]) => isGroupSchema(prop)),
    stages,
  ).filter(([key]) => isGroupRelevant(pipelineId, key, values));
  const leafEntries = sortByStage(
    visibleEntries.filter((entry) => !isGroupSchema(entry[1])),
    stages,
  );

  const flattenedGroups: FlattenedGroup[] = [];
  const detailGroups: [string, ParamSchemaProperty][] = [];
  for (const [key, prop] of relevantGroupEntries) {
    const flattened = flattenSingleFieldGroup(key, prop, rootRequired);
    if (flattened) flattenedGroups.push(flattened);
    else detailGroups.push([key, prop]);
  }

  const setGroupLeaf = (groupKey: string, innerKey: string, value: unknown) => {
    const currentGroup = asValueRecord(values[groupKey]);
    handleChange({
      ...values,
      [groupKey]: { ...currentGroup, [innerKey]: value },
    });
  };
  const setTopLevel = (key: string, value: unknown) => {
    handleChange({ ...values, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-grey-90 text-sm font-semibold">Pipeline parameters</p>

      {flattenedGroups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {flattenedGroups.map(
            ({ groupKey, group, innerKey, innerProp, required }) => (
              <ParamField
                key={groupKey}
                fieldKey={`${groupKey}-${innerKey}`}
                prop={{
                  ...innerProp,
                  title: group.title || innerProp.title || innerKey,
                  description:
                    group.description ?? innerProp.description ?? undefined,
                }}
                required={required}
                value={asValueRecord(values[groupKey])[innerKey]}
                onChange={(v) => setGroupLeaf(groupKey, innerKey, v)}
                disabled={disabled}
                showError={showAllErrors}
              />
            ),
          )}
        </div>
      )}

      {detailGroups.length > 0 && (
        <div className="flex flex-col gap-3">
          {detailGroups.map(([key, prop]) => (
            <ParamGroup
              key={key}
              pipelineId={pipelineId}
              fieldKey={key}
              schema={prop}
              values={asValueRecord(values[key])}
              rootValues={values}
              onChange={(v) => setTopLevel(key, v)}
              disabled={disabled}
              required={rootRequired.has(key)}
              showAllErrors={showAllErrors}
              depth={1}
              sectionExtras={sectionExtras}
            />
          ))}
        </div>
      )}

      {leafEntries.length > 0 && (
        <div className="flex flex-col gap-4 rounded-xl border border-grey-20 bg-white p-4">
          <p className="text-grey-90 text-sm font-semibold">Output options</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {leafEntries.map(([key, prop]) => (
              <ParamField
                key={key}
                fieldKey={key}
                prop={{ ...prop, title: labelFor(pipelineId, key, prop) }}
                required={rootRequired.has(key)}
                value={values[key]}
                onChange={(v) => setTopLevel(key, v)}
                disabled={disabled}
                showError={showAllErrors}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SchemaFields({
  pipelineId,
  schema,
  values,
  rootValues,
  onChange,
  disabled,
  showAllErrors,
  depth,
}: {
  pipelineId: string;
  schema: ParamSchema;
  values: ParamValues;
  rootValues: ParamValues;
  onChange: (values: ParamValues) => void;
  disabled?: boolean;
  showAllErrors?: boolean;
  depth: number;
}) {
  if (depth > MAX_DEPTH) {
    return (
      <p className="text-grey-70 text-xs italic">
        {schema.title || "This section"} nests too deeply to display here.
      </p>
    );
  }

  const properties = schema.properties;
  if (!properties || Object.keys(properties).length === 0) return null;

  const required = new Set(schema.required || []);
  const entries = Object.entries(properties);

  // The "enabled gate" convention (see `findEnabledGate`): a group whose own
  // schema has `enabled: boolean` means the pipeline ignores the rest of
  // that group while `enabled` isn't `true`. `enabled` always renders first
  // (so it's the one visible control while gated off); every other field,
  // nested group, and that section's `sectionExtras` content (handled by
  // `ParamGroup`) is hidden — never reset, so re-enabling brings back
  // whatever the user had set before.
  const enabledGate = findEnabledGate(schema);
  const gateOff = !!enabledGate && values.enabled !== true;
  const restEntries = entries.filter(([key]) => key !== "enabled");

  const fieldEntries: [string, ParamSchemaProperty][] = [
    ...(enabledGate
      ? [["enabled", enabledGate] as [string, ParamSchemaProperty]]
      : []),
    ...(gateOff ? [] : restEntries.filter(([, prop]) => !isGroupSchema(prop))),
  ];
  // SchemaFields only ever renders group *internals* (depth >= 1) — the top
  // level is PipelineParamsForm's own job now (flattening, stage ordering,
  // hidden params, Output options). Relevance-hiding is depth-0-only by
  // submission-relevance-map's documented scope, so nothing here is ever
  // filtered; the `depth > 0` guard is kept as a defensive no-op in case
  // this is ever reused at depth 0 again.
  const groupEntries = gateOff
    ? []
    : restEntries
        .filter(([, prop]) => isGroupSchema(prop))
        .filter(
          ([key]) => depth > 0 || isGroupRelevant(pipelineId, key, rootValues),
        );

  const setValue = (key: string, value: unknown) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      {fieldEntries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fieldEntries.map(([key, prop]) => (
            <ParamField
              key={key}
              fieldKey={key}
              prop={prop}
              required={required.has(key)}
              value={values[key]}
              onChange={(v) => setValue(key, v)}
              disabled={disabled}
              showError={showAllErrors}
            />
          ))}
        </div>
      )}
      {groupEntries.length > 0 && (
        <div className="flex flex-col gap-3">
          {groupEntries.map(([key, prop]) => (
            <ParamGroup
              key={key}
              pipelineId={pipelineId}
              fieldKey={key}
              schema={prop}
              values={asValueRecord(values[key])}
              rootValues={rootValues}
              onChange={(v) => setValue(key, v)}
              disabled={disabled}
              required={required.has(key)}
              showAllErrors={showAllErrors}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ParamGroup({
  pipelineId,
  fieldKey,
  schema,
  values,
  rootValues,
  onChange,
  disabled,
  required,
  showAllErrors,
  depth,
  sectionExtras,
}: {
  pipelineId: string;
  fieldKey: string;
  schema: ParamSchemaProperty;
  values: ParamValues;
  rootValues: ParamValues;
  onChange: (values: ParamValues) => void;
  disabled?: boolean;
  required?: boolean;
  showAllErrors?: boolean;
  depth: number;
  /** Only passed down for the top-level sections `PipelineParamsForm` itself
   *  renders — nested groups (via `SchemaFields`) never receive it, so they
   *  never look themselves up here. */
  sectionExtras?: SectionExtras;
}) {
  const [expanded, setExpanded] = useState(false);
  const label = schema.title || fieldKey;
  const total = countLeaves(schema, depth);
  const changed = countChangedLeaves(schema, values, depth);
  // The enabled gate (see `findEnabledGate`): while this section's own
  // `enabled` isn't `true`, its extras aren't shown either (there's nothing
  // for them to attach to), so they must not be allowed to force the
  // section open or read as an error badge.
  const gateOff = !!findEnabledGate(schema) && values.enabled !== true;
  const extras = sectionExtras?.[fieldKey];
  const paramsHaveErrors =
    !!showAllErrors &&
    validateParamValues(schema, values, depth, "", pipelineId, rootValues)
      .length > 0;
  const extrasHaveError = !gateOff && !!extras?.hasError;
  const hasErrors = paramsHaveErrors || extrasHaveError;
  const isOpen = expanded || hasErrors;
  const groupId = `param-group-${fieldKey}-${depth}`;

  return (
    <div
      className={`rounded-xl border bg-grey-10 overflow-hidden ${hasErrors ? "border-red-30" : "border-grey-20"}`}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={groupId}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronRight
            className={`h-4 w-4 shrink-0 text-grey-70 transition-transform duration-200 motion-reduce:transition-none ${
              isOpen ? "rotate-90" : ""
            }`}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-grey-90 text-sm font-semibold truncate">
              {label}
              {required && <span className="text-red-30"> *</span>}
            </p>
            {schema.description && (
              <p className="text-grey-70 text-xs truncate">
                {schema.description}
              </p>
            )}
          </div>
        </div>
        <span
          className={`shrink-0 text-xs px-2 py-1 rounded-full border ${
            hasErrors
              ? "bg-red-10 border-red-30 text-red-30"
              : changed > 0
                ? "bg-teal-10 border-teal-20 text-teal-70"
                : "bg-white border-grey-20 text-grey-70"
          }`}
        >
          {hasErrors
            ? "Needs attention"
            : changed > 0
              ? `${changed} of ${total} changed`
              : `${total} setting${total === 1 ? "" : "s"}`}
        </span>
      </button>
      {isOpen && (
        <div
          id={groupId}
          className="px-4 pb-4 pt-1 border-t border-grey-20 bg-white"
        >
          <SchemaFields
            pipelineId={pipelineId}
            schema={schema}
            values={values}
            rootValues={rootValues}
            onChange={onChange}
            disabled={disabled}
            showAllErrors={showAllErrors}
            depth={depth}
          />
          {!gateOff && extras?.content && (
            <div className="mt-4">{extras.content}</div>
          )}
        </div>
      )}
    </div>
  );
}

function ParamField({
  fieldKey,
  prop,
  required,
  value,
  onChange,
  disabled,
  showError,
}: {
  fieldKey: string;
  prop: ParamSchemaProperty;
  required: boolean;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  showError?: boolean;
}) {
  const [blurred, setBlurred] = useState(false);
  const label = prop.title || fieldKey;
  const type = normalizePropType(prop);
  const inputId = `param-${fieldKey}`;
  const errorId = `${inputId}-error`;

  const message = fieldValidationMessage(prop, value, required);
  const showMessage = (blurred || showError) && !!message;
  const errorText =
    showMessage && message
      ? message.charAt(0).toUpperCase() + message.slice(1)
      : null;

  const controlClass = `h-11 px-4 rounded-lg border bg-white outline-none text-grey-90 text-base disabled:bg-grey-10 disabled:text-grey-50 focus-visible:ring-2 focus-visible:ring-blue-40/30 ${
    errorText ? "border-red-30" : "border-grey-20 focus-visible:border-blue-40"
  }`;

  const fieldWrapper = (control: React.ReactNode) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-grey-90 text-sm font-semibold">
        {label}
        {required && <span className="text-red-30"> *</span>}
      </label>
      {control}
      {errorText ? (
        <p id={errorId} className="text-red-30 text-xs">
          {errorText}
        </p>
      ) : (
        prop.description && (
          <p className="text-grey-70 text-xs">{prop.description}</p>
        )
      )}
    </div>
  );

  const commonAria = {
    "aria-invalid": !!errorText,
    "aria-describedby": errorText ? errorId : undefined,
    onBlur: () => setBlurred(true),
  } as const;

  if (prop.enum && prop.enum.length > 0) {
    return fieldWrapper(
      <select
        id={inputId}
        className={controlClass}
        value={value === undefined || value === null ? "" : String(value)}
        disabled={disabled}
        {...commonAria}
        onChange={(e) => {
          const raw = e.target.value;
          const matched = prop.enum?.find((opt) => String(opt) === raw);
          onChange(matched ?? raw);
        }}
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {prop.enum.map((opt) => (
          <option key={String(opt)} value={String(opt)}>
            {String(opt)}
          </option>
        ))}
      </select>,
    );
  }

  if (type === "boolean") {
    return fieldWrapper(
      <label className="flex h-11 items-center gap-2 px-1">
        <input
          id={inputId}
          type="checkbox"
          className="h-4 w-4 rounded border-grey-40 focus-visible:ring-2 focus-visible:ring-blue-40/30"
          checked={Boolean(value)}
          disabled={disabled}
          onBlur={commonAria.onBlur}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-grey-70 text-sm">Enabled</span>
      </label>,
    );
  }

  if (type === "number" || type === "integer") {
    return fieldWrapper(
      <input
        id={inputId}
        type="number"
        step={type === "integer" ? 1 : "any"}
        min={prop.minimum}
        max={prop.maximum}
        className={controlClass}
        value={value === undefined || value === null ? "" : String(value)}
        disabled={disabled}
        {...commonAria}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onChange("");
            return;
          }
          const parsed =
            type === "integer" ? parseInt(raw, 10) : parseFloat(raw);
          onChange(Number.isNaN(parsed) ? raw : parsed);
        }}
      />,
    );
  }

  if (type === "string") {
    return fieldWrapper(
      <input
        id={inputId}
        type="text"
        minLength={prop.minLength}
        maxLength={prop.maxLength}
        pattern={prop.pattern}
        className={controlClass}
        value={value === undefined || value === null ? "" : String(value)}
        disabled={disabled}
        {...commonAria}
        onChange={(e) => onChange(e.target.value)}
      />,
    );
  }

  // array, or a type we don't otherwise recognize — round-trip as raw JSON
  // rather than silently dropping the field.
  return fieldWrapper(
    <JsonFallbackField
      inputId={inputId}
      value={value}
      onChange={onChange}
      disabled={disabled}
      commonAria={commonAria}
    />,
  );
}

function JsonFallbackField({
  inputId,
  value,
  onChange,
  disabled,
  commonAria,
}: {
  inputId: string;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  commonAria: {
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
    onBlur: () => void;
  };
}) {
  const [text, setText] = useState<string>(() =>
    value === undefined ? "" : JSON.stringify(value, null, 2),
  );
  const [parseError, setParseError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <textarea
        id={inputId}
        rows={3}
        className={`px-4 py-2 rounded-lg border bg-white outline-none text-grey-90 text-sm font-mono disabled:bg-grey-10 disabled:text-grey-50 focus-visible:ring-2 focus-visible:ring-blue-40/30 ${
          parseError
            ? "border-red-30"
            : "border-grey-20 focus-visible:border-blue-40"
        }`}
        value={text}
        disabled={disabled}
        aria-invalid={commonAria["aria-invalid"]}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          commonAria.onBlur();
          if (text.trim() === "") {
            setParseError(null);
            onChange(undefined);
            return;
          }
          try {
            onChange(JSON.parse(text));
            setParseError(null);
          } catch {
            setParseError("Enter valid JSON for this field.");
          }
        }}
      />
      <p className={`text-xs ${parseError ? "text-red-30" : "text-grey-70"}`}>
        {parseError ||
          "This setting isn't a simple value — edit it as raw JSON."}
      </p>
    </div>
  );
}

/**
 * Declarative relevance rules for a pipeline's dynamic parameters, plus
 * helpers for a pipeline's own extra-file-input relevance.
 *
 * WHY THIS FILE EXISTS: a pipeline's paramsSchema (JSON Schema draft
 * 2020-12) has no way to express "group X only matters when field Y equals
 * Z" — there is no `if`/`then`/`dependentSchemas` in what the pipeline API
 * publishes today. Without this map, a schema like ont-lsdv's (11 nested
 * parameter groups) renders all of them at once, and most are noise:
 * `variant.tool` picks exactly ONE of bcftools/medaka/clair3 as the active
 * variant caller, `qc.tool` only makes the fastp settings relevant once
 * fastp is the chosen QC tool, and `filter.mode: "recommended"` makes the
 * manual nanofilt thresholds irrelevant.
 *
 * If a pipeline ever starts publishing `if`/`then` or `dependentSchemas`,
 * a renderer should derive param-group relevance from *that* instead of the
 * hand-maintained rules in section 1 below — it's a stopgap for schemas
 * that don't.
 *
 * Extra-file-input relevance (section 2) is NOT that kind of stopgap: the
 * pipeline publishes its own condition directly as a `when` field on each
 * extraInputs entry (e.g. ont-lsdv's primer_bed only being in use for
 * `primer.tool: "align_trim"`, primer_bedpe for `"bamclipper"`), so this
 * file only evaluates that condition rather than hand-maintaining the link.
 *
 * SCOPE: every condition and group key below refers to the schema's
 * top-level properties only (a dot path such as "qc.tool" is resolved
 * against the params root). Every real dependency today is one level deep.
 * If a pipeline ever needs a rule among its own nested siblings two levels
 * down, extend the callers below rather than reshaping this map.
 */

import type { PipelineExtraInput } from "@/src/app/(dashboard)/sequencing/sequencing-processing-types";

export type RelevanceScalar = string | number | boolean;

export interface RelevanceCondition {
  /** Dot path from the params root, e.g. "qc.tool" reads `values.qc.tool`. */
  path: string;
  equals: RelevanceScalar;
}

// ---------------------------------------------------------------------------
// 1. Parameter group visibility — pipelineId -> top-level group key -> the
//    conditions under which that group is shown. Conditions within one
//    group's list are OR'd (the group shows if ANY of them hold).
// ---------------------------------------------------------------------------
export type PipelineGroupRelevance = Record<string, RelevanceCondition[]>;

export const PIPELINE_PARAM_GROUP_RELEVANCE: Record<
  string,
  PipelineGroupRelevance
> = {
  "ont-lsdv": {
    // The other qc.tool option, nanoplot, has no configurable settings of
    // its own — fastp's only matter once fastp is actually the QC tool.
    fastp: [{ path: "qc.tool", equals: "fastp" }],
    // Manual filtering thresholds only apply once filter.mode opts out of
    // the pipeline's recommended defaults.
    nanofilt: [{ path: "filter.mode", equals: "manual" }],
    // bcftools and medaka each do double duty as EITHER the variant caller
    // or the consensus caller, so either role makes their settings relevant.
    bcftools: [
      { path: "variant.tool", equals: "bcftools" },
      { path: "consensus.tool", equals: "bcftools" },
    ],
    medaka: [
      { path: "variant.tool", equals: "medaka" },
      { path: "consensus.tool", equals: "medaka" },
    ],
    // clair3 is only ever a variant caller — consensus.tool has no clair3 option.
    clair3: [{ path: "variant.tool", equals: "clair3" }],
  },
};

/**
 * Whether a top-level group should render for this pipeline given the
 * current (root-level) param values.
 *
 * - An unmapped pipeline id: every group is relevant.
 * - A mapped pipeline with no entry for this group key: also relevant —
 *   a newly-added group on an already-mapped pipeline still shows up
 *   rather than vanishing until someone remembers to add a rule for it.
 */
export function isGroupRelevant(
  pipelineId: string,
  groupKey: string,
  rootValues: Record<string, unknown>,
): boolean {
  const conditions = PIPELINE_PARAM_GROUP_RELEVANCE[pipelineId]?.[groupKey];
  if (!conditions || conditions.length === 0) return true;
  return conditions.some(
    (condition) =>
      getValueAtPath(rootValues, condition.path) === condition.equals,
  );
}

// ---------------------------------------------------------------------------
// 2. Extra-input relevance — whether a pipeline.extraInputs entry is even in
//    use right now given the current param choices, and if it's in use,
//    whether it's required. This links params values to pipeline.extraInputs
//    (a different part of the pipeline shape than the groups above), but the
//    link itself is published by the pipeline as each entry's own `when`
//    field rather than hand-maintained here — see PipelineExtraInput["when"].
//
//    "In use" matters separately from "required" because two extra inputs
//    can fill the same role under mutually exclusive conditions (ont-lsdv's
//    primer_bed for align_trim vs primer_bedpe for bamclipper): an
//    out-of-use input must be hidden and left out of the submission
//    entirely — the pipeline rejects a key for one — not just optional.
// ---------------------------------------------------------------------------

/**
 * Whether a pipeline.extraInputs entry is relevant to the current param
 * choices. `when`'s conditions are AND'd — every path's value must equal
 * what's given. Missing or empty `when` (including an older pipeline
 * version that never sends the field) means always in use.
 */
export function isExtraInputInUse(
  input: Pick<PipelineExtraInput, "when">,
  rootValues: Record<string, unknown>,
): boolean {
  const when = input.when;
  if (!when || Object.keys(when).length === 0) return true;
  return Object.entries(when).every(
    ([path, expected]) => getValueAtPath(rootValues, path) === expected,
  );
}

/**
 * Whether a pipeline.extraInputs entry must be uploaded before submit: in
 * use (see isExtraInputInUse) AND the pipeline's own `required` flag.
 */
export function isExtraInputRequired(
  input: Pick<PipelineExtraInput, "required" | "when">,
  rootValues: Record<string, unknown>,
): boolean {
  return input.required && isExtraInputInUse(input, rootValues);
}

function getValueAtPath(
  values: Record<string, unknown>,
  path: string,
): unknown {
  return path.split(".").reduce<unknown>((acc, segment) => {
    if (
      acc &&
      typeof acc === "object" &&
      segment in (acc as Record<string, unknown>)
    ) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, values);
}

// ---------------------------------------------------------------------------
// 3. Hidden top-level params — pipelineId -> top-level param keys that never
//    render an editable control at all and stay pinned to their schema
//    default (the same treatment buildSubmitParams already gives an
//    irrelevant group's leaves: contributes nothing to the submitted
//    params). Scope matches the group-relevance map above: top-level
//    (depth 0) keys only.
//
//    WHY THIS EXISTS, and ONLY for ont-lsdv's "reference" today: the schema
//    publishes it as free text —
//      {"type":"string","default":"lsdv_reference_sequence.fasta",
//       "title":"Reference genome",
//       "description":"Filename within the shared references directory."}
//    — naming a file inside a server-side directory the user has no way to
//    browse or validate against. There's no `enum` of the references that
//    actually exist, so a text box here can only ever produce a silent typo
//    that fails the run minutes later; ont-lsdv is LSDV-specific, so the
//    shipped default is also the only correct value today. Hiding the field
//    is strictly better than offering a free-text box with exactly one
//    right answer and no way to discover it.
//
//    DELETE THIS ENTRY the moment the pipeline starts publishing `reference`
//    as an `enum` of the references actually available server-side — at
//    that point it should render like any other enum field (flattened or
//    not, per the params form's own single-field-group rule), not stay
//    hidden.
//
// 2. ont-lsdv `snpeff` — hidden for a related but sharper reason. After the
//    backend strips `snpeff.config` (a fixed filesystem path), the group's
//    only remaining field is `database`, published as free text with
//    default "LSDV" and the description:
//
//      "Which snpEff database annotates the variants. It must derive from
//       the same accession as the reference genome."
//
//    That is a hard constraint tying it to `reference` — which is itself
//    hidden and pinned above. So exactly one value is correct, and every
//    edit the user could make is necessarily wrong.
//
//    The failure modes are not symmetric, which is what settles it. A wrong
//    `reference` filename fails fast and loudly: the file isn't there, the
//    run dies. A wrong snpEff database can SUCCEED and emit plausible-looking
//    annotations — gene names, hgvs_p, impact levels — computed against the
//    wrong genome. Silently incorrect variant annotations are far worse than
//    a failed run, because nothing signals the error to the person reading
//    them.
//
//    REVISIT THIS ENTRY if the pipeline adds a genuinely user-facing field to
//    the snpeff group: hiding the whole group would swallow it. The real fix
//    upstream is for `reference` and `database` to become a single "reference
//    genome" enum, since they are one decision, not two.
// ---------------------------------------------------------------------------
export const PIPELINE_HIDDEN_PARAMS: Record<string, string[]> = {
  "ont-lsdv": ["reference", "snpeff"],
};

/**
 * Whether a top-level schema property should be hidden entirely for this
 * pipeline. An unlisted pipeline, or a param not named in its list, is
 * never hidden.
 */
export function isParamHidden(pipelineId: string, paramKey: string): boolean {
  return !!PIPELINE_HIDDEN_PARAMS[pipelineId]?.includes(paramKey);
}

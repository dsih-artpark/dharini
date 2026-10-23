/**
 * Presentation-only filter applied to a pipeline's `paramsSchema` before it
 * is returned from `GET /sequencing/pipelines`. It strips infrastructure
 * knobs — thread/CPU/RAM counts, fixed filesystem paths (e.g.
 * `clair3.model_path`, `snpeff.config`), single-option enums with no real
 * choice to make (e.g. `clair3.platform: ["ont"]`) — so the submission form
 * doesn't surface controls that are not scientific decisions.
 *
 * This is purely cosmetic: it never runs on the way to the pipeline. A
 * caller (or a future UI) can still pass any of these params explicitly in
 * `params` on submit, and `PipelineApiService.submitRun` /
 * `POST /v1/runs` forward whatever `params` they're given untouched. The
 * pipeline applies its own defaults for anything omitted here, so trimming
 * the schema carries no behavioural risk.
 */

const RESOURCE_PARAM_NAMES = new Set([
  'threads',
  'cpu',
  'cpus',
  'ram',
  'ram_gb',
  'memory',
  'mem_gb',
  'nproc',
  'workers',
]);

function isResourceParamName(name: string): boolean {
  return RESOURCE_PARAM_NAMES.has(name.toLowerCase());
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** A string-typed property whose default is an absolute filesystem path, e.g. `/opt/models/ont`. */
function isAbsolutePathDefault(schema: Record<string, unknown>): boolean {
  return (
    schema.type === 'string' &&
    typeof schema.default === 'string' &&
    schema.default.startsWith('/')
  );
}

/** An enum with exactly one possible value — there is no choice for the UI to offer. */
function isSingleOptionEnum(schema: Record<string, unknown>): boolean {
  return Array.isArray(schema.enum) && schema.enum.length === 1;
}

/** True when stripping emptied a group that previously had properties. */
function becameEmptyGroup(before: unknown, after: unknown): boolean {
  if (!isPlainObject(before) || !isPlainObject(after)) return false;
  const hadProps =
    isPlainObject(before.properties) &&
    Object.keys(before.properties).length > 0;
  const hasProps =
    isPlainObject(after.properties) && Object.keys(after.properties).length > 0;
  return hadProps && !hasProps;
}

function isResourceParam(name: string, propSchema: unknown): boolean {
  if (isResourceParamName(name)) return true;
  if (!isPlainObject(propSchema)) return false;
  return isAbsolutePathDefault(propSchema) || isSingleOptionEnum(propSchema);
}

/**
 * Recursively strips resource params from a JSON Schema's `properties` (and
 * matching names from `required` at every level), returning a new schema.
 * Applies generically by shape/name rather than a per-pipeline hardcoded
 * list, so a new pipeline's schema is filtered sensibly without a code
 * change here.
 */
export function stripResourceParams(schema: unknown): unknown {
  if (!isPlainObject(schema)) return schema;

  const result: Record<string, unknown> = { ...schema };
  const properties = schema.properties;

  if (isPlainObject(properties)) {
    const filteredProps: Record<string, unknown> = {};
    for (const [name, propSchema] of Object.entries(properties)) {
      if (isResourceParam(name, propSchema)) continue;

      const stripped = stripResourceParams(propSchema);

      // A group whose every property was stripped has nothing left to
      // configure — e.g. clair3, which is only model_path (a fixed path) and
      // platform (a single-option enum). Keeping it would render an empty
      // titled box in the form. Dropped only when it HAD properties before
      // stripping, so a deliberately free-form object schema survives.
      if (becameEmptyGroup(propSchema, stripped)) continue;

      filteredProps[name] = stripped;
    }
    result.properties = filteredProps;

    if (Array.isArray(schema.required)) {
      result.required = schema.required.filter(
        (name) => typeof name === 'string' && name in filteredProps,
      );
    }
  }

  return result;
}

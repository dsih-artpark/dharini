import { stripResourceParams } from './strip-resource-params.util';

describe('stripResourceParams', () => {
  it('strips top-level resource param names, case-insensitively', () => {
    const schema = {
      type: 'object',
      properties: {
        threads: { type: 'integer', default: 4 },
        CPU: { type: 'integer', default: 2 },
        ram_gb: { type: 'integer', default: 8 },
        memory: { type: 'integer', default: 16 },
        workers: { type: 'integer', default: 1 },
        minDepth: { type: 'integer', default: 10 },
      },
      required: ['threads', 'minDepth'],
    };

    const result: any = stripResourceParams(schema);

    expect(Object.keys(result.properties)).toEqual(['minDepth']);
    expect(result.required).toEqual(['minDepth']);
  });

  it('strips a string property whose default is an absolute filesystem path', () => {
    const schema = {
      type: 'object',
      properties: {
        model_path: { type: 'string', default: '/opt/models/ont' },
        label: { type: 'string', default: 'ont-lsdv' },
      },
      required: ['model_path', 'label'],
    };

    const result: any = stripResourceParams(schema);

    expect(result.properties).toEqual({
      label: { type: 'string', default: 'ont-lsdv' },
    });
    expect(result.required).toEqual(['label']);
  });

  it('strips an enum with exactly one option but keeps a multi-option enum', () => {
    const schema = {
      type: 'object',
      properties: {
        platform: { type: 'string', enum: ['ont'] },
        strand: { type: 'string', enum: ['forward', 'reverse'] },
      },
      required: ['platform', 'strand'],
    };

    const result: any = stripResourceParams(schema);

    expect(result.properties).toEqual({
      strand: { type: 'string', enum: ['forward', 'reverse'] },
    });
    expect(result.required).toEqual(['strand']);
  });

  it('applies recursively through nested groups, e.g. clair3.model_path / clair3.platform / snpeff.config', () => {
    const schema = {
      type: 'object',
      properties: {
        clair3: {
          type: 'object',
          properties: {
            model_path: { type: 'string', default: '/opt/models/ont' },
            platform: { type: 'string', enum: ['ont'] },
            min_qual: { type: 'number', default: 20 },
          },
          required: ['model_path', 'platform', 'min_qual'],
        },
        snpeff: {
          type: 'object',
          properties: {
            config: { type: 'string', default: '/snpEff/snpEff.config' },
            genome: { type: 'string', default: 'ASM_v1' },
          },
          required: ['config', 'genome'],
        },
      },
      required: ['clair3', 'snpeff'],
    };

    const result: any = stripResourceParams(schema);

    expect(result.properties.clair3.properties).toEqual({
      min_qual: { type: 'number', default: 20 },
    });
    expect(result.properties.clair3.required).toEqual(['min_qual']);

    expect(result.properties.snpeff.properties).toEqual({
      genome: { type: 'string', default: 'ASM_v1' },
    });
    expect(result.properties.snpeff.required).toEqual(['genome']);

    // The nested groups themselves are real science-relevant params, so
    // they stay at the top level — only their resource-ish children go.
    expect(Object.keys(result.properties)).toEqual(['clair3', 'snpeff']);
    expect(result.required).toEqual(['clair3', 'snpeff']);
  });

  it('does not mutate the input schema', () => {
    const schema = {
      type: 'object',
      properties: {
        threads: { type: 'integer' },
        minDepth: { type: 'integer' },
      },
      required: ['threads', 'minDepth'],
    };
    const original = JSON.parse(JSON.stringify(schema));

    stripResourceParams(schema);

    expect(schema).toEqual(original);
  });

  it('passes through a schema with no properties (or a non-object) unchanged', () => {
    expect(stripResourceParams({ type: 'string' })).toEqual({ type: 'string' });
    expect(stripResourceParams(null)).toBeNull();
    expect(stripResourceParams(undefined)).toBeUndefined();
  });

  it('keeps a deliberately free-form object even though it has no properties', () => {
    const result = stripResourceParams({
      type: 'object',
      properties: {
        threads: { type: 'integer', default: 4 },
        freeform: { type: 'object' },
      },
    }) as any;

    // `freeform` never had properties to begin with, so it was not *emptied*
    // by stripping and must survive.
    expect(Object.keys(result.properties)).toEqual(['freeform']);
  });
});

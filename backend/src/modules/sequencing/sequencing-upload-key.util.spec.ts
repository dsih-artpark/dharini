import {
  MAX_UPLOAD_FILENAME_LENGTH,
  buildUploadKey,
  isOwnedUploadKey,
  sanitizeUploadFilename,
} from './sequencing-upload-key.util';

describe('sanitizeUploadFilename', () => {
  it('replaces characters outside [A-Za-z0-9.-] with underscores', () => {
    expect(sanitizeUploadFilename('Sample 42 (R1).fastq')).toBe(
      'Sample_42__R1_.fastq',
    );
  });

  it('strips path separators so a filename cannot escape its folder', () => {
    expect(sanitizeUploadFilename('../../etc/passwd')).toBe('.._.._etc_passwd');
  });

  it('preserves a double extension when truncating a long stem', () => {
    const longStem = 'a'.repeat(400);

    const result = sanitizeUploadFilename(`${longStem}.fastq.gz`);

    expect(result).toHaveLength(MAX_UPLOAD_FILENAME_LENGTH);
    expect(result.endsWith('.fastq.gz')).toBe(true);
  });

  it('throws when the filename is empty', () => {
    expect(() => sanitizeUploadFilename('   ')).toThrow('filename is required');
  });
});

describe('buildUploadKey', () => {
  const params = {
    folder: 'SDS004-ES_App_Data',
    userId: '11111111-1111-4111-8111-111111111111',
    uploadId: '22222222-2222-4222-8222-222222222222',
  };

  it('nests the upload under the configured folder, prefix, user and upload id', () => {
    expect(buildUploadKey({ ...params, filename: 'reads.fastq.gz' })).toBe(
      'SDS004-ES_App_Data/genomic-sequencing/uploads/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222/reads.fastq.gz',
    );
  });

  it('omits the folder segment when no folder is configured', () => {
    expect(
      buildUploadKey({ ...params, folder: '', filename: 'reads.fastq' }),
    ).toBe(
      'genomic-sequencing/uploads/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222/reads.fastq',
    );
  });

  it('sanitizes the filename it is given', () => {
    const key = buildUploadKey({ ...params, filename: 'my reads/../x.fastq' });

    expect(key.endsWith('/my_reads_.._x.fastq')).toBe(true);
  });
});

describe('isOwnedUploadKey', () => {
  const owner = {
    folder: 'SDS004-ES_App_Data',
    userId: '11111111-1111-4111-8111-111111111111',
  };
  const uploadId = '22222222-2222-4222-8222-222222222222';

  it('accepts a key this user was presigned for', () => {
    const key = buildUploadKey({
      ...owner,
      uploadId,
      filename: 'reads.fastq.gz',
    });

    expect(isOwnedUploadKey(key, owner)).toBe(true);
  });

  it('rejects a key nested under a different user id', () => {
    const key = buildUploadKey({
      ...owner,
      userId: '99999999-9999-4999-8999-999999999999',
      uploadId,
      filename: 'reads.fastq.gz',
    });

    expect(isOwnedUploadKey(key, owner)).toBe(false);
  });

  it('rejects a key that walks back out of the upload folder', () => {
    const key = `${owner.folder}/uploads/${owner.userId}/../../../etc/passwd`;

    expect(isOwnedUploadKey(key, owner)).toBe(false);
  });

  it('rejects a key outside the uploads prefix', () => {
    const key = `${owner.folder}/runs/${owner.userId}/${uploadId}/reads.fastq`;

    expect(isOwnedUploadKey(key, owner)).toBe(false);
  });

  it('rejects a key with extra segments after the filename', () => {
    const key = `${owner.folder}/uploads/${owner.userId}/${uploadId}/nested/reads.fastq`;

    expect(isOwnedUploadKey(key, owner)).toBe(false);
  });

  it('rejects a bare traversal filename', () => {
    const key = `${owner.folder}/uploads/${owner.userId}/${uploadId}/..`;

    expect(isOwnedUploadKey(key, owner)).toBe(false);
  });

  // The pipeline validates input_key against its own copy of this prefix and
  // rejects anything outside it, so the two must be alignable by config.
  it('honours a configured prefix, on both the builder and the ownership check', () => {
    const folder = 'SDS004-ES_App_Data';
    const userId = '11111111-1111-4111-8111-111111111111';
    const prefix = 'genomic-sequencing/uploads';

    const key = buildUploadKey({
      folder,
      userId,
      uploadId: '22222222-2222-4222-8222-222222222222',
      filename: 'reads.fastq',
      prefix: '/custom/place/',
    });

    expect(key).toBe(
      'SDS004-ES_App_Data/custom/place/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222/reads.fastq',
    );
    expect(
      isOwnedUploadKey(key, { folder, userId, prefix: 'custom/place' }),
    ).toBe(true);
    // A key minted under a different prefix is not ours.
    expect(isOwnedUploadKey(key, { folder, userId, prefix })).toBe(false);
  });
});

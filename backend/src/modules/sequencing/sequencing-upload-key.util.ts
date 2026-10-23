/**
 * Prefix every sequencing upload is written under, between S3_FOLDER and the
 * user id. The pipeline service validates submitted keys against its own copy
 * of this value and rejects anything outside it, so the two MUST agree — which
 * is why it's overridable via SEQUENCING_UPLOAD_PREFIX rather than fixed here.
 */
export const DEFAULT_UPLOAD_PREFIX = 'genomic-sequencing/uploads';

/** Tolerates leading/trailing slashes in a configured prefix. */
export function normalizeUploadPrefix(prefix?: string): string {
  const trimmed = (prefix ?? '').trim().replace(/^\/+|\/+$/g, '');
  return trimmed || DEFAULT_UPLOAD_PREFIX;
}
export const MAX_UPLOAD_FILENAME_LENGTH = 200;

/** Trailing extension group, e.g. `.fastq` or `.fastq.gz`. */
const EXTENSION_SUFFIX = /(\.[A-Za-z0-9]+){1,2}$/;

/**
 * Reduces a user-supplied filename to the character set S3 keys use here,
 * keeping the extension intact because the pipeline matches on it.
 */
export function sanitizeUploadFilename(filename: string): string {
  const trimmed = (filename ?? '').trim();
  if (!trimmed) throw new Error('filename is required');

  const safe = trimmed.replace(/[^a-zA-Z0-9.-]/g, '_');
  if (safe.length <= MAX_UPLOAD_FILENAME_LENGTH) return safe;

  const suffix = safe.match(EXTENSION_SUFFIX)?.[0] ?? '';
  if (suffix.length >= MAX_UPLOAD_FILENAME_LENGTH) {
    return safe.slice(0, MAX_UPLOAD_FILENAME_LENGTH);
  }

  const stem = safe.slice(0, safe.length - suffix.length);
  return stem.slice(0, MAX_UPLOAD_FILENAME_LENGTH - suffix.length) + suffix;
}

/**
 * Builds the S3 key an upload is written to. The user id is baked into the
 * key so ownership can be re-checked at submit time without a lookup.
 */
export function buildUploadKey(params: {
  folder: string;
  userId: string;
  uploadId: string;
  filename: string;
  prefix?: string;
}): string {
  const { folder, userId, uploadId, filename, prefix } = params;
  const segments = [
    ...(folder ? [folder] : []),
    normalizeUploadPrefix(prefix),
    userId,
    uploadId,
    sanitizeUploadFilename(filename),
  ];
  return segments.join('/');
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SAFE_FILENAME = /^[A-Za-z0-9._-]+$/;

/**
 * True only for keys this service would itself have minted for `owner`.
 * The submit endpoint receives the key back from the browser, so this is what
 * stops one user submitting a run against another user's upload.
 */
export function isOwnedUploadKey(
  key: string,
  owner: { folder: string; userId: string; prefix?: string },
): boolean {
  const uploadPrefix = normalizeUploadPrefix(owner.prefix);
  const prefix = owner.folder
    ? `${owner.folder}/${uploadPrefix}/`
    : `${uploadPrefix}/`;
  if (!key.startsWith(prefix)) return false;

  const segments = key.slice(prefix.length).split('/');
  if (segments.length !== 3) return false;

  const [userId, uploadId, filename] = segments;
  return (
    userId === owner.userId &&
    UUID.test(uploadId) &&
    SAFE_FILENAME.test(filename) &&
    filename !== '.' &&
    filename !== '..'
  );
}

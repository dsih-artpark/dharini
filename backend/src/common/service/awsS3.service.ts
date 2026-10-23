import { S3Client } from '@aws-sdk/client-s3';
import { configDotenv } from 'dotenv';

configDotenv();

// Use a default region if none is provided to prevent startup crashes
const region = process.env.S3_REGION || 'us-east-1';

export const s3 = new S3Client({
  region,
  credentials:
    process.env.S3_ACCESSKEYID && process.env.S3_SECRETACCESSKEY
      ? {
          accessKeyId: process.env.S3_ACCESSKEYID,
          secretAccessKey: process.env.S3_SECRETACCESSKEY,
        }
      : undefined,
  endpoint: process.env.S3_ENDPOINT || undefined, // LocalStack S3 endpoint
  forcePathStyle: true, // Needed for LocalStack/Garage compatibility
  // Disable automatic CRC32 checksums — Garage does not support them
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

/**
 * Rewrites an internally-resolvable S3 endpoint to the one a browser can
 * reach. A no-op when S3_ENDPOINT is already public (as on AWS); needed for
 * the local `garage` compose profile, where the SDK signs against
 * http://garage:3900 but the browser must PUT to the published address.
 */
export function formatPublicS3Url(url: string): string {
  const internalEndpoint = process.env.S3_ENDPOINT?.replace(/\/$/, '');
  const publicEndpoint = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');

  if (internalEndpoint && publicEndpoint && url.startsWith(internalEndpoint)) {
    return url.replace(internalEndpoint, publicEndpoint);
  }
  return url;
}

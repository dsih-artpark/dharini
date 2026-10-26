export type PresignedTarget = {
  key: string;
  uploadUrl: string;
  contentType: string;
  expiresIn: number;
};

/**
 * PUTs a file straight to S3 using a presigned URL, bypassing the backend
 * entirely so multi-gigabyte genomic files never stream through NestJS.
 *
 * Uses XMLHttpRequest (not fetch) because only XHR exposes upload progress
 * events. The Content-Type is taken from `target.contentType` — the type the
 * URL was signed with — never from `file.type`; a mismatch there causes an
 * opaque 403 from S3. No Authorization header is attached: the presigned URL
 * carries its own credentials in the query string, and an app auth header
 * would invalidate the signature.
 *
 * Pass `signal` (a standard `AbortController().signal`) to let a caller
 * abandon this specific upload mid-flight — e.g. sequencing's submission
 * modal uploads a file the moment it's picked, and aborts it via
 * `XMLHttpRequest.abort()` if the user swaps in a different file before the
 * first PUT finishes.
 */
export function uploadViaPresignedUrl(
  file: File,
  target: PresignedTarget,
  onProgress?: (fractionComplete: number) => void,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("Upload was aborted"));
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", target.uploadUrl, true);
    xhr.setRequestHeader("Content-Type", target.contentType);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(event.loaded / event.total);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(
          new Error(
            `Upload failed with status ${xhr.status}: ${xhr.statusText || "unknown error"}`,
          ),
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed due to a network error"));
    };

    xhr.onabort = () => {
      reject(new Error("Upload was aborted"));
    };

    if (signal) {
      signal.addEventListener("abort", () => xhr.abort());
    }

    xhr.send(file);
  });
}

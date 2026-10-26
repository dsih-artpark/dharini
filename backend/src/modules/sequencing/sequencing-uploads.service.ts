import { randomUUID } from 'crypto';
import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { formatPublicS3Url, s3 } from '../../common/service/awsS3.service';
import { PresignUploadDto } from './dto/presign-upload.dto';
import {
  buildUploadKey,
  isOwnedUploadKey,
  normalizeUploadPrefix,
} from './sequencing-upload-key.util';

/**
 * Pinned rather than taken from the browser: a presigned PUT signs the content
 * type, browsers assign inconsistent ones to .fastq/.fastq.gz, and a mismatch
 * surfaces as an opaque 403 from S3.
 */
export const UPLOAD_CONTENT_TYPE = 'application/octet-stream';

const DEFAULT_MAX_UPLOAD_BYTES = 5 * 1024 * 1024 * 1024; // S3 single-PUT ceiling
const DEFAULT_SIGNED_URL_EXPIRY = 3600;

export interface UploadTarget {
  key: string;
  uploadUrl: string;
  contentType: string;
  expiresIn: number;
}

@Injectable()
export class SequencingUploadsService {
  private readonly bucket: string;
  private readonly folder: string;
  private readonly uploadPrefix: string;
  private readonly runsPrefix: string;
  private readonly maxUploadBytes: number;
  private readonly expiresIn: number;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.getOrThrow<string>('S3_BUCKET');
    this.folder = this.configService.get<string>('S3_FOLDER') || '';
    this.uploadPrefix = normalizeUploadPrefix(
      this.configService.get<string>('SEQUENCING_UPLOAD_PREFIX'),
    );
    this.runsPrefix = (
      this.configService.get<string>('SEQUENCING_RUNS_PREFIX') ||
      'genomic-sequencing/runs'
    ).replace(/^\/+|\/+$/g, '');
    this.maxUploadBytes =
      Number(this.configService.get<string>('SEQUENCING_MAX_UPLOAD_BYTES')) ||
      DEFAULT_MAX_UPLOAD_BYTES;
    this.expiresIn =
      Number(this.configService.get<string>('SIGNED_URL_EXPIRY')) ||
      DEFAULT_SIGNED_URL_EXPIRY;
  }

  /**
   * Where the pipeline publishes a run's outputs.
   *
   * GET /v1/runs/{id} returns each artifact with a `url` pointing at the
   * pipeline's OWN address (http://localhost:8000/...) and carries no
   * bucket/key, so on the reconciliation path there is nothing to presign
   * from. The objects are in our bucket under a stable layout, so the key is
   * derived instead. A bucket/key supplied by the webhook always wins.
   */
  buildRunArtifactKey(runId: string, filename: string): string {
    return [
      ...(this.folder ? [this.folder] : []),
      this.runsPrefix,
      runId,
      filename,
    ].join('/');
  }

  /** Bucket run artifacts live in, for entries that carry no bucket of their own. */
  get artifactBucket(): string {
    return this.bucket;
  }
  /**
   * Mints a presigned PUT for a key this service chooses. The caller never
   * supplies the key — it is derived from the authenticated user id.
   */
  async createUploadTarget(
    userId: string,
    dto: PresignUploadDto,
  ): Promise<UploadTarget> {
    if (dto.contentLength > this.maxUploadBytes) {
      throw new PayloadTooLargeException(
        `File exceeds the maximum upload size of ${this.maxUploadBytes} bytes`,
      );
    }

    const key = buildUploadKey({
      folder: this.folder,
      prefix: this.uploadPrefix,
      userId,
      uploadId: randomUUID(),
      filename: dto.filename,
    });

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: UPLOAD_CONTENT_TYPE,
      }),
      { expiresIn: this.expiresIn },
    );

    return {
      key,
      uploadUrl: formatPublicS3Url(uploadUrl),
      contentType: UPLOAD_CONTENT_TYPE,
      expiresIn: this.expiresIn,
    };
  }

  /** Guards the submit path, where the key comes back from the browser. */
  assertOwnedKey(userId: string, key: string): void {
    if (
      !isOwnedUploadKey(key, {
        folder: this.folder,
        userId,
        prefix: this.uploadPrefix,
      })
    ) {
      throw new BadRequestException('Unknown or unauthorised upload key');
    }
  }

  /**
   * Server-side write, for sources where Dharini produces the bytes itself
   * rather than receiving them from the browser (currently: NCBI FASTA
   * fetches). Writes directly via the S3 SDK instead of a presigned URL —
   * there is no client round trip to hand a URL to.
   *
   * Deliberately NOT the deleted ExternalSequencingApiService client: this
   * writes into the same `uploads/<userId>/<uploadId>/<filename>` layout as
   * the presigned browser path (via buildUploadKey) so both are ordinary,
   * ownable upload keys from the pipeline's point of view.
   */
  async putServerObject(params: {
    userId: string;
    filename: string;
    body: Buffer;
    contentType?: string;
  }): Promise<{ key: string }> {
    const key = buildUploadKey({
      folder: this.folder,
      prefix: this.uploadPrefix,
      userId: params.userId,
      uploadId: randomUUID(),
      filename: params.filename,
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: params.body,
        ContentType: params.contentType ?? UPLOAD_CONTENT_TYPE,
      }),
    );

    return { key };
  }

  /**
   * Mints a presigned GET for a finished run's result file. The pipeline
   * serves no result files itself and deletes its local copies after 6
   * hours — S3 (the {bucket, key} recorded on the job's `artifacts`) is the
   * durable store, and bytes are never proxied through this service.
   */
  /**
   * @param inline render in the browser (the interactive plot) rather than
   * force a download. An `attachment` disposition makes an iframe download
   * the file instead of displaying it, so the plot must be presigned inline.
   */
  async presignArtifactDownload(
    bucket: string,
    key: string,
    filename?: string,
    inline = false,
  ): Promise<string> {
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
        ...(filename && {
          ResponseContentDisposition: inline
            ? `inline; filename="${filename}"`
            : `attachment; filename="${filename}"`,
        }),
      }),
      { expiresIn: this.expiresIn },
    );

    return formatPublicS3Url(url);
  }
}

import { ConfigService } from '@nestjs/config';
import { PayloadTooLargeException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  SequencingUploadsService,
  UPLOAD_CONTENT_TYPE,
} from './sequencing-uploads.service';
import { isOwnedUploadKey } from './sequencing-upload-key.util';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(
    async () => 'https://s3.example/bucket/key?X-Amz-Signature=abc',
  ),
}));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const FOLDER = 'SDS004-ES_App_Data';
const USER_ID = '11111111-1111-4111-8111-111111111111';
const MAX_BYTES = 1000;

const config: Record<string, string> = {
  S3_BUCKET: 'dsih-artpark-04-staging-data',
  S3_FOLDER: FOLDER,
  SEQUENCING_MAX_UPLOAD_BYTES: String(MAX_BYTES),
  SIGNED_URL_EXPIRY: '3600',
};

describe('SequencingUploadsService', () => {
  let service: SequencingUploadsService;

  beforeEach(async () => {
    (getSignedUrl as jest.Mock).mockClear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SequencingUploadsService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => config[key],
            getOrThrow: (key: string) => config[key],
          },
        },
      ],
    }).compile();

    service = module.get(SequencingUploadsService);
  });

  it('issues a key the same user is allowed to submit against', async () => {
    const target = await service.createUploadTarget(USER_ID, {
      filename: 'reads.fastq.gz',
      contentLength: 500,
    });

    expect(
      isOwnedUploadKey(target.key, { folder: FOLDER, userId: USER_ID }),
    ).toBe(true);
  });

  it('issues a different key for every upload of the same filename', async () => {
    const first = await service.createUploadTarget(USER_ID, {
      filename: 'reads.fastq.gz',
      contentLength: 500,
    });
    const second = await service.createUploadTarget(USER_ID, {
      filename: 'reads.fastq.gz',
      contentLength: 500,
    });

    expect(first.key).not.toBe(second.key);
  });

  it('refuses an upload larger than the configured maximum', async () => {
    await expect(
      service.createUploadTarget(USER_ID, {
        filename: 'reads.fastq.gz',
        contentLength: MAX_BYTES + 1,
      }),
    ).rejects.toBeInstanceOf(PayloadTooLargeException);
  });

  it('signs the same content type it tells the browser to send', async () => {
    const target = await service.createUploadTarget(USER_ID, {
      filename: 'reads.fastq.gz',
      contentLength: 500,
    });

    const signedCommand = (getSignedUrl as jest.Mock).mock.calls[0][1];
    expect(target.contentType).toBe(UPLOAD_CONTENT_TYPE);
    expect(signedCommand.input.ContentType).toBe(UPLOAD_CONTENT_TYPE);
    expect(signedCommand.input.Key).toBe(target.key);
  });

  it('rejects a key minted for a different user', () => {
    const otherUsersKey = `${FOLDER}/uploads/99999999-9999-4999-8999-999999999999/22222222-2222-4222-8222-222222222222/reads.fastq`;

    expect(() => service.assertOwnedKey(USER_ID, otherUsersKey)).toThrow(
      BadRequestException,
    );
  });
});

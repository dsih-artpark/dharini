import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { configDotenv } from 'dotenv';
import { s3 } from './../../common/service/awsS3.service'; // Import updated S3Client instance
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from 'src/entities/region.entity';
import { Repository } from 'typeorm';
import { Media } from 'src/entities/media.entity';

configDotenv();
@Injectable()
// export class MulterConfigService implements MulterOptionsFactory {
export class MulterConfigService {
  // Kept to its original three dependencies on purpose: thirteen modules
  // re-provide this service, so every constructor argument added here must be
  // registered in all of them. File-ownership resolution therefore lives in
  // MediaAccessService, which only MediaModule provides.
  constructor(
    private configService: ConfigService,
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  private formatPublicUrl(url: string): string {
    const internalEndpoint = process.env.S3_ENDPOINT?.replace(/\/$/, '');
    const publicS3Url = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');

    if (internalEndpoint && publicS3Url && url.startsWith(internalEndpoint)) {
      return url.replace(internalEndpoint, publicS3Url);
    }
    return url;
  }

  async getSignedUrl(filename: string, fileType: string): Promise<string> {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_'); // Remove invalid characters
    const fileKey = `${process.env.S3_FOLDER}/${process.env.NODE_ENV}/${timestamp}_${sanitizedFilename}`;
    // console.log(fileKey);
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: Number(process.env.SIGNED_URL_EXPIRY),
    });
    return this.formatPublicUrl(url);
  }

  async getSignedUrlForSpecificPath(
    filename: string,
    fileType: string,
    path: string,
  ): Promise<string> {
    const fileKey = `${process.env.S3_FOLDER}/${path}/${filename}`;
    // console.log(fileKey);
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: Number(process.env.SIGNED_URL_EXPIRY),
    });
    return this.formatPublicUrl(url);
  }

  async deleteObject(fileKey: string): Promise<void> {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
      }),
    );
  }

  async getSignedFileUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
      ResponseContentDisposition: 'inline',
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: Number(process.env.SIGNED_URL_EXPIRY),
    });
    return this.formatPublicUrl(url);
  }

  async uploadToS3UsingSignedUrl(
    signedUrl: string,
    fileBuffer: Buffer,
    fileType: string,
  ): Promise<boolean> {
    try {
      // 1. Try to upload directly using AWS SDK S3 client (much more robust inside Docker network)
      try {
        const bucketName = process.env.S3_BUCKET;
        const cleanUrl = signedUrl.split('?')[0];
        const urlParts = cleanUrl.split(`${bucketName}/`);
        const fileKey = decodeURIComponent(
          urlParts.length > 1
            ? urlParts[1]
            : cleanUrl.split('/').slice(-3).join('/'),
        );

        if (fileKey) {
          const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            Body: fileBuffer,
            ContentType: fileType,
          });
          await s3.send(command);
          return true;
        }
      } catch (sdkError) {
        console.warn(
          'S3 SDK Direct Upload failed, falling back to Axios:',
          sdkError.message,
        );
      }

      // 2. Fallback to Axios PUT request if SDK upload failed or could not parse key
      await axios.put(signedUrl, fileBuffer, {
        headers: {
          'Content-Type': fileType,
        },
      });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('S3 Upload Error Status:', error.response?.status);
        console.error('S3 Upload Error Data:', error.response?.data);
        console.error('S3 Upload Error Message:', error.message);
        console.error('S3 Upload Error Code:', error.code);
        console.error('S3 Upload URL attempted:');
      } else {
        console.error('Error uploading to S3:', error);
      }
      return false;
    }
  }

  async uploadMultipleFiles(files: Express.Multer.File[]) {
    const uploadResults = [];

    for (const file of files) {
      const signedUrl = await this.getSignedUrl(
        file.originalname,
        file.mimetype,
      );
      const success = await this.uploadToS3UsingSignedUrl(
        signedUrl,
        file.buffer,
        file.mimetype,
      );

      const fileKey = signedUrl
        .split('?')[0]
        .split(`${process.env.S3_BUCKET}/`)[1];

      // ✅ Step 4: Generate a temporary public URL (valid for 5 minutes)
      const publicUrl = success
        ? await this.getTemporaryPublicUrl(fileKey)
        : null;

      uploadResults.push({
        filename: file.originalname,
        uploaded: success,
        fileUrl: success ? signedUrl.split('?')[0] : null,
        publicUrl,
      });
    }

    return uploadResults;
  }

  async getTemporaryPublicUrl(fileKey: string): Promise<string> {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
      ResponseContentDisposition: 'inline',
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 300 seconds (5 min)
    return this.formatPublicUrl(url);
  }

  async uploadMultipleStaticFilesForSpecificPath(
    files: Express.Multer.File[],
    path: string,
    isStateFile: boolean,
  ) {
    const uploadResults = [];

    for (const file of files) {
      console.log(file.originalname);
      if (isStateFile) {
        const stateName = file.originalname
          .replace('.geojson', '')
          .replace('_DISTRICTS', '')
          .split(' ')
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(' ');
        console.log(stateName);
        const region = await this.regionRepository.findOne({
          where: { name: stateName },
          select: ['name', 'lgdCode'],
        });
        console.log(region);
        if (region && region.lgdCode) {
          const signedUrl = await this.getSignedUrlForSpecificPath(
            file.originalname,
            file.mimetype,
            path + `/state_${region.lgdCode}`,
          );
          const success = await this.uploadToS3UsingSignedUrl(
            signedUrl,
            file.buffer,
            file.mimetype,
          );

          uploadResults.push({
            filename: file.originalname,
            uploaded: success,
            fileUrl: success ? signedUrl.split('?')[0] : null,
          });
        }
      } else {
        const signedUrl = await this.getSignedUrlForSpecificPath(
          file.originalname,
          file.mimetype,
          path,
        );
        const success = await this.uploadToS3UsingSignedUrl(
          signedUrl,
          file.buffer,
          file.mimetype,
        );

        uploadResults.push({
          filename: file.originalname,
          uploaded: success,
          fileUrl: success ? signedUrl.split('?')[0] : null,
        });
      }
    }

    return uploadResults;
  }

  async updateMediaPaths() {
    const environment = process.env.NODE_ENV;
    const medias = await this.mediaRepository.find();

    for (const media of medias) {
      if (media.key.includes('SDS004-ES_App_Data')) {
        // Modify key
        const updatedKey = media.key.replace(
          'SDS004-ES_App_Data',
          `SDS004-ES_App_Data/${environment}`,
        );

        // Modify path
        const updatedPath = media.path.replace(
          'SDS004-ES_App_Data',
          `SDS004-ES_App_Data/${environment}`,
        );

        // Update record
        await this.mediaRepository.update(media.id, {
          key: updatedKey,
          path: updatedPath,
        });
      }
    }

    return { message: `Media paths updated with environment: ${environment}` };
  }
}

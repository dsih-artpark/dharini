import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  SerializeOptions,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MulterConfigService } from './media.service';
import { MediaAccessService } from './media-access.service';
import { UploadMultipleFilesResponse } from './dto/response.dto';
import * as multer from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadImageDto } from './dto/upload-image.dto';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MulterConfigService,
    private readonly mediaAccessService: MediaAccessService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: UploadMultipleFilesResponse })
  @Post('upload-images')
  @ServiceScoped(
    'writes a new object under a freshly generated timestamped key; reads no existing tenant-owned row, so there is nothing to leak',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'media'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @UseInterceptors(
    FilesInterceptor('files', Number(process.env.MAX_FILE_ALLOW_UPLOAD) || 10, {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 25 * 1024 * 1024, // 25 MB limit
      },
    }),
  )
  async uploadImages(
    @UploadedFiles() files: Express.MulterS3.File[],
  ): Promise<UploadMultipleFilesResponse> {
    try {
      if (!files || files.length === 0) {
        throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
      }
      const uploadResults = await this.mediaService.uploadMultipleFiles(files);
      const allUploaded = uploadResults.every((r) => r.uploaded);
      return {
        success: allUploaded,
        message: allUploaded
          ? 'Files uploaded successfully'
          : 'Some files failed to upload',
        data: uploadResults,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while uploading images',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // A13: `getSignedFileUrl` used to be called here directly on a
  // client-supplied `fileUrl` with no ownership check - any authenticated
  // user could mint a signed URL for any object in the bucket, and the S3
  // key pattern is predictable. `resolveAndSignFileUrl` resolves the file's
  // owning project (via Media/Sample/Site/Visit/LabTest/Team references) and
  // requires the caller be able to reach it; System scope bypasses the
  // check. See MediaAccessService for the full rationale.
  @Get('signed-url')
  @ServiceScoped(
    'resolves the owning project via Media/Sample/Site/Visit/LabTest/Team lookups and requires canReachProject before signing; System scope bypasses',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'media'))
  async getSignedUrl(
    @Req() req,
    @Query('fileUrl') fileUrl: string,
  ): Promise<{ success: boolean; data: string }> {
    try {
      if (!fileUrl) {
        throw new HttpException(
          'fileUrl query parameter is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const signedUrl = await this.mediaAccessService.resolveAndSignFileUrl(
        fileUrl,
        req.user,
      );
      return {
        success: true,
        data: signedUrl,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while generating signed URL',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @SerializeOptions({ type: UploadMultipleFilesResponse })
  // @Post('upload-files')
  // @UseInterceptors(
  //   FilesInterceptor('files', Number(process.env.MAX_FILE_ALLOW_UPLOAD), {
  //     storage: multer.memoryStorage(),
  //   }),
  // )
  // async uploadShapeFiles(
  //   @UploadedFiles() files: Express.MulterS3.File[],
  //   @Body() body: any, // Handles other form-data field
  // ) {
  //   try {
  //     if (!files || files.length === 0) {
  //       throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
  //     }
  //     const formData = { ...body };

  //     console.log('Received form-data:', formData); // Debugging
  //     const { path, isStateFile } = formData;
  //     let isState = false;
  //     console.log(typeof isStateFile);
  //     if (typeof isStateFile === 'string') {
  //       isState = isStateFile === 'true' ? true : false;
  //     } else if (typeof isStateFile === 'boolean') {
  //       isState = isStateFile;
  //     }
  //     const uploadResults =
  //       await this.mediaService.uploadMultipleStaticFilesForSpecificPath(
  //         files,
  //         path,
  //         isState,
  //       );

  //     return {
  //       success: true,
  //       message: 'Files uploaded successfully',
  //       data: uploadResults,
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       error.message || 'An error occurred while uploading images',
  //       error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}

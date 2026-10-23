import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LabTestResponseData } from 'src/common/dto/response/lab-test.response';
import { LabTest } from 'src/entities/lab-test.entity';
import { Media } from 'src/entities/media.entity';
import { Sample } from 'src/entities/sample.entity';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import { MulterConfigService } from '../media/media.service';
import { CreateMultipleLabTestDto } from './dto/create-lab-test.dto';
import { UpdateMultipleLabTestDto } from './dto/update-lab-test.dto';

@Injectable()
export class LabTestsService {
  constructor(
    @InjectRepository(LabTest)
    private readonly labTestRepository: Repository<LabTest>,
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly mediaService: MulterConfigService,
  ) {}
  async create(
    createMultipleLabTestDto: CreateMultipleLabTestDto,
    user?: User,
  ): Promise<LabTestResponseData[]> {
    const userData = await this.userRepository.findOne({
      where: { id: user?.id },
    });
    // console.log('CreateMultipleLabTestDto', createMultipleLabTestDto);
    const sampleData = createMultipleLabTestDto.sample
      ? await this.sampleRepository.findOne({
          where: { id: createMultipleLabTestDto.sample },
          relations: ['team', 'site', 'visit', 'project'],
        })
      : null;
    if (createMultipleLabTestDto.sample && !sampleData)
      throw new BadRequestException('Sample not found');

    const { team, site, visit, project } = sampleData;

    if (createMultipleLabTestDto.labTests.length > 0) {
      createMultipleLabTestDto.labTests = await Promise.all(
        createMultipleLabTestDto.labTests.map(async (labTest) => {
          const testedById =
            typeof labTest.testedBy === 'string'
              ? labTest.testedBy
              : labTest.testedBy?.id;
          const testedByUser = testedById
            ? await this.userRepository.findOne({ where: { id: testedById } })
            : userData;

          if (!testedByUser) {
            throw new BadRequestException('Tested by user not found');
          }

          let testResultReport = labTest.testResultReport;
          if (labTest.testResultReport) {
            const arr = labTest.testResultReport.split('/');
            const key = arr[arr.length - 1];
            const file = await this.mediaRepository.create({
              key: `${process.env.S3_FOLDER}/${process.env.NODE_ENV}/${key}`,
              path: labTest.testResultReport,
            });

            await this.mediaRepository.save(file);
            testResultReport = file.id;
          }

          return {
            ...labTest,
            testResultReport,
            sample: sampleData,
            team,
            site,
            visit,
            project,
            testedBy: testedByUser,
          };
        }),
      );
      return await this.labTestRepository.save(
        createMultipleLabTestDto.labTests,
      );
    }
    return;
  }

  // A9: `projectId` is the caller's route-validated `:projectId` (e.g.
  // /projects/:projectId/samples/:sampleId/lab-tests) and, when supplied,
  // wins over anything the client put in `query.projectId` - otherwise a
  // caller could smuggle a foreign project id through the query string.
  // Optional only so existing call sites that don't yet thread the route
  // param keep compiling; callers with a validated :projectId should pass it.
  async findAll(
    query: any,
    projectId?: string,
  ): Promise<LabTestResponseData[]> {
    const { siteId, diseaseId, sampleId } = query;
    const scopedProjectId = projectId ?? query.projectId;
    const whereConditions: any = {};

    // Add conditions only if values are provided
    if (scopedProjectId) whereConditions.project = { id: scopedProjectId };
    if (sampleId) whereConditions.sample = { id: sampleId };
    if (siteId) whereConditions.site = { id: siteId };
    if (diseaseId) whereConditions.disease = { id: diseaseId };

    const results = await this.labTestRepository.find({
      where: whereConditions,
      relations: ['project', 'sample', 'disease', 'site', 'testedBy'],
    });

    // Batch-fetch every lab test's media in a single query instead of one
    // mediaRepository lookup per row.
    const mediaIds = results
      .filter((result) => result.testResultReport)
      .map((result) => result.testResultReport);
    const media = mediaIds.length
      ? await this.mediaRepository.findBy({ id: In(mediaIds) })
      : [];
    const mediaById = new Map(media.map((m) => [m.id, m]));

    const updatedResults = await Promise.all(
      results.map(async (result) => {
        if (!result.testResultReport) {
          return { ...result, testResultReport: null };
        }

        const photo = mediaById.get(result.testResultReport);
        if (!photo) {
          return { ...result, testResultReport: null };
        }

        const signedUrl = await this.mediaService.getSignedFileUrl(photo.key);
        return { ...result, testResultReport: signedUrl };
      }),
    );

    return updatedResults;
  }

  // A9: same route-vs-leaf binding as findAll - see comment there.
  async findOne(query: any, projectId?: string): Promise<LabTestResponseData> {
    // console.log('Query', query);
    const where = projectId ? { ...query, project: { id: projectId } } : query;
    const result = await this.labTestRepository.findOne({
      where,
      relations: ['project', 'sample', 'disease', 'testedBy'],
    });
    if (!result) {
      throw new NotFoundException('Lab test not found');
    }
    if (!result.testResultReport) {
      return { ...result, testResultReport: null };
    }

    const photo = await this.mediaRepository.findOne({
      where: { id: result.testResultReport },
    });
    if (!photo) {
      return { ...result, testResultReport: null };
    }

    const signedUrl = await this.mediaService.getSignedFileUrl(photo.key);
    return { ...result, testResultReport: signedUrl };
  }

  async update(
    updateMultipleLabTestDto: UpdateMultipleLabTestDto,
    user?: User,
  ): Promise<LabTestResponseData[]> {
    const userData = await this.userRepository.findOne({
      where: { id: user?.id },
    });
    // console.log('UpdateMultipleLabTestDto', updateMultipleLabTestDto);

    if (
      !updateMultipleLabTestDto.labTests ||
      updateMultipleLabTestDto.labTests.length === 0
    ) {
      throw new BadRequestException('No lab tests provided for update');
    }

    // Fetch sample data if provided
    let sampleData = null;
    if (updateMultipleLabTestDto.sample) {
      sampleData = await this.sampleRepository.findOne({
        where: { id: updateMultipleLabTestDto.sample },
        relations: ['team', 'site', 'visit', 'project'],
      });

      if (!sampleData) {
        throw new BadRequestException('Sample not found');
      }
    }

    // Extract project-related data if available
    const { team, site, visit, project } = sampleData || {};

    // Retrieve existing lab tests
    const labTestIds = updateMultipleLabTestDto.labTests.map((lt) => lt.id);
    const existingLabTests = await this.labTestRepository.find({
      where: { id: In(labTestIds) },
      relations: ['sample', 'team', 'site', 'visit', 'project', 'testedBy'],
    });

    if (existingLabTests.length !== updateMultipleLabTestDto.labTests.length) {
      throw new BadRequestException('One or more lab test records not found');
    }

    // Map and update records
    const updatedLabTests = await Promise.all(
      updateMultipleLabTestDto.labTests.map(async (labTest) => {
        // Find the existing lab test
        const existingLabTest = existingLabTests.find(
          (lt) => lt.id === labTest.id,
        );
        if (!existingLabTest) return null;

        // Handle test result report (S3 file storage)
        if (labTest.testResultReport) {
          const arr = labTest.testResultReport.split('/');
          const key = arr[arr.length - 1];

          const file = await this.mediaRepository.create({
            key: `${process.env.S3_FOLDER}/${process.env.NODE_ENV}/${key}`,
            path: labTest.testResultReport,
          });

          await this.mediaRepository.save(file);
          labTest.testResultReport = file.id;
        }

        return {
          ...existingLabTest,
          ...labTest, // Apply updates
          sample: sampleData || existingLabTest.sample, // Keep existing if not updated
          team: team || existingLabTest.team,
          site: site || existingLabTest.site,
          visit: visit || existingLabTest.visit,
          project: project || existingLabTest.project,
          testedBy: userData || existingLabTest.testedBy,
        };
      }),
    );

    // Remove null values from array
    const filteredLabTests = updatedLabTests.filter(Boolean);

    // Save updated lab tests
    const results = await this.labTestRepository.save(filteredLabTests);

    const updatedResults = await Promise.all(
      results.map(async (result) => {
        if (!result.testResultReport) {
          return { ...result, testResultReport: null };
        }

        const photo = await this.mediaRepository.findOne({
          where: { id: result.testResultReport },
        });
        if (!photo) {
          return { ...result, testResultReport: null };
        }

        const signedUrl = await this.mediaService.getSignedFileUrl(photo.key);
        return { ...result, testResultReport: signedUrl };
      }),
    );

    return updatedResults;
  }

  async remove(id: number) {
    await this.findOne(id);
    console.log('deleted labTest');
    // await this.update(sampleType.id, { status: StatusType.DELETED });
  }
}

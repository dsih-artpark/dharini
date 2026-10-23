import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabTest } from 'src/entities/lab-test.entity';
import { Media } from 'src/entities/media.entity';
import { Sample } from 'src/entities/sample.entity';
import { Site } from 'src/entities/site.entity';
import { Team } from 'src/entities/team.entity';
import { Visit } from 'src/entities/visit.entity';
import { TenantScopeService } from 'src/common/authorization/tenant-scope.service';
import { canReachProject } from 'src/common/functions/tenant-scope';
import { MulterConfigService } from './media.service';

/**
 * Ownership resolution for uploaded files.
 *
 * Deliberately a separate provider from `MulterConfigService`, which thirteen
 * modules re-provide for its upload/signing helpers. Adding the six
 * repositories this walk needs to that constructor broke every one of those
 * modules at boot, because each would have had to register the same entities.
 * Keeping the concern here means `MediaModule` is the only module that needs
 * them — and it is the only place that serves `GET /media/signed-url`.
 */
@Injectable()
export class MediaAccessService {
  constructor(
    private readonly multerConfigService: MulterConfigService,
    private readonly tenantScopeService: TenantScopeService,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    @InjectRepository(LabTest)
    private readonly labTestRepository: Repository<LabTest>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  /**
   * A13: `GET /media/signed-url` used to call `getSignedFileUrl` directly on a
   * client-supplied `fileUrl` with no ownership check at all — any
   * authenticated user could mint a working signed GET URL for any object in
   * the bucket.
   *
   * `Media` rows carry no owning project/sample/site FK of their own (they are
   * referenced *from* `Sample.photos` / `Site.photos` / `Visit.photos` /
   * `Team.logo`, or via a raw URL stored directly on
   * `LabTest.testResultReport` / `Sample.batchReferenceDocument` — there is no
   * Media row id available to callers for those, so requiring one outright
   * would break the existing lab-accession report/document preview flows).
   * Instead this resolves ownership by walking those same references back to a
   * project and requires the caller be able to reach it.
   *
   * Unresolvable URLs (no matching reference anywhere) fail closed for
   * non-System callers — deny-by-default, not just "known leaks are patched".
   */
  async resolveAndSignFileUrl(fileUrl: string, user: any): Promise<string> {
    const tenant = await this.tenantScopeService.forUser(user);

    if (!tenant.isSystem) {
      const projectIds = await this.resolveOwningProjectIds(fileUrl);
      const reachable = projectIds.some((projectId) =>
        canReachProject(tenant, projectId),
      );
      if (!reachable) {
        throw new ForbiddenException('You do not have access to this file');
      }
    }

    return this.multerConfigService.getSignedFileUrl(
      this.extractFileKey(fileUrl),
    );
  }

  private extractFileKey(fileUrl: string): string {
    const bucketName = process.env.S3_BUCKET;
    const urlParts = fileUrl.split(`${bucketName}/`);
    return urlParts.length > 1
      ? urlParts[1]
      : fileUrl.split('/').slice(-3).join('/');
  }

  /**
   * Every project id that could plausibly own `fileUrl`, via any of the places
   * the app stores a reference to an uploaded file.
   */
  private async resolveOwningProjectIds(fileUrl: string): Promise<string[]> {
    const projectIds = new Set<string>();

    // Fields that store the raw uploaded file URL directly (no Media row).
    const [labTest, sampleDoc] = await Promise.all([
      this.labTestRepository.findOne({
        where: { testResultReport: fileUrl },
        relations: ['project'],
      }),
      this.sampleRepository.findOne({
        where: { batchReferenceDocument: fileUrl },
        relations: ['project'],
      }),
    ]);
    if (labTest?.project?.id) projectIds.add(labTest.project.id);
    if (sampleDoc?.project?.id) projectIds.add(sampleDoc.project.id);

    // Fields that reference a Media row id inside a `photos`/`logo` column.
    // `Media.path` is the exact URL recorded when the row was created (see
    // e.g. SamplesService.create), so it round-trips back to `fileUrl`.
    const media = await this.mediaRepository.findOne({
      where: { path: fileUrl },
    });
    if (media) {
      const [samplePhoto, sitePhoto, visitPhoto, team] = await Promise.all([
        this.sampleRepository
          .createQueryBuilder('sample')
          .leftJoinAndSelect('sample.project', 'project')
          .where(':mediaId = ANY(sample.photos)', { mediaId: media.id })
          .getOne(),
        this.siteRepository
          .createQueryBuilder('site')
          .leftJoinAndSelect('site.project', 'project')
          .where(':mediaId = ANY(site.photos)', { mediaId: media.id })
          .getOne(),
        this.visitRepository
          .createQueryBuilder('visit')
          .leftJoinAndSelect('visit.project', 'project')
          .where(':mediaId = ANY(visit.photos)', { mediaId: media.id })
          .getOne(),
        this.teamRepository
          .createQueryBuilder('team')
          .leftJoinAndSelect('team.projects', 'project')
          .where('team.logo = :mediaId', { mediaId: media.id })
          .getOne(),
      ]);
      if (samplePhoto?.project?.id) projectIds.add(samplePhoto.project.id);
      if (sitePhoto?.project?.id) projectIds.add(sitePhoto.project.id);
      if (visitPhoto?.project?.id) projectIds.add(visitPhoto.project.id);
      for (const project of team?.projects ?? []) projectIds.add(project.id);
    }

    return [...projectIds];
  }
}

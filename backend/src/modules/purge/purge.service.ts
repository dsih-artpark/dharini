import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, In } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Site } from '../../entities/site.entity';
import { Visit } from '../../entities/visit.entity';
import { Sample } from '../../entities/sample.entity';
import { LabTest } from '../../entities/lab-test.entity';
import { SampleAudit } from '../../entities/sample-audit.entity';
import { Invite } from '../../entities/invite.entity';
import { UserRole } from '../../entities/user-role.entity';
import { User } from '../../entities/user.entity';
import { TenantScopeService } from '../../common/authorization/tenant-scope.service';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import {
  CacheKeys,
  USER_AUTH_CACHE_PREFIX,
} from '../../common/cache/cache-keys';

/**
 * Purge is irreversible and, unchecked, cross-tenant destructive (see
 * FINDINGS.md §2 / FIX-PLAN A4): a workspace-admin of workspace A could call
 * DELETE /purge/project/<workspace B's project id> and it would succeed,
 * because none of these routes carried :projectId and nothing here checked
 * the caller against the target's tenant.
 *
 * Every entrypoint below now resolves the target's owning project and
 * requires the caller to have System scope or reach that project via
 * TenantScopeService.canReachProject() - independent of whatever
 * AbilityFactory decides at the route layer, since that's owned by a
 * different lane and purge is destructive enough to defend twice.
 *
 * Deliberately NOT narrowed to System scope only: the repo owner has not
 * made that product call (workspace-admins purging their own workspace's
 * data is an intentional, existing capability) - see FIX-PLAN A4.
 */
@Injectable()
export class PurgeService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly cacheService: RedisCacheService,
    private readonly tenantScopeService: TenantScopeService,
  ) {}

  private async assertCanPurgeProject(
    user: any,
    projectId: string | null | undefined,
    resourceLabel: string,
  ): Promise<void> {
    if (!(await this.tenantScopeService.canReachProject(user, projectId))) {
      throw new ForbiddenException(
        `You do not have access to purge this ${resourceLabel}`,
      );
    }
  }

  /**
   * Deletes the given samples and every row that references them, in
   * foreign-key-safe order. The id list is expanded to include replicate
   * samples (samples whose originalSampleId points at one of the inputs).
   *
   * FK behaviour on `samples(id)` (see 1755598844281-init migration):
   *   - lab_tests.sampleId           ON DELETE NO ACTION -> must delete first
   *   - sample_audits.sampleId       ON DELETE NO ACTION -> must delete first
   *   - samples_diseases_diseases    ON DELETE CASCADE    -> also deleted here, explicitly
   *   - sample_pools.sample_id_1/2   ON DELETE CASCADE    -> also deleted here, explicitly
   *   - samples.originalSampleId     ON DELETE CASCADE    -> self-ref cleared before delete
   *
   * The CASCADE rows would be removed by the DB anyway, but they are deleted
   * here too so the cleanup is explicit and consistent with the other join
   * tables, and resilient to environments where the schema was built without
   * the cascade (e.g. dev `synchronize`).
   */
  private async purgeSamplesWithDependencies(
    manager: EntityManager,
    sampleIds: string[],
  ): Promise<void> {
    if (sampleIds.length === 0) {
      return;
    }

    // Include replicate samples that point back to any of these samples.
    const replicates = await manager.find(Sample, {
      where: { originalSample: { id: In(sampleIds) } },
      select: { id: true },
    });
    const ids = [...new Set([...sampleIds, ...replicates.map((r) => r.id)])];

    // 1. Lab tests (FK NO ACTION)
    await manager
      .createQueryBuilder()
      .delete()
      .from(LabTest)
      .where('sampleId IN (:...ids)', { ids })
      .execute();

    // 2. Sample audits (FK NO ACTION)
    await manager
      .createQueryBuilder()
      .delete()
      .from(SampleAudit)
      .where('sampleId IN (:...ids)', { ids })
      .execute();

    // 3. Sample <-> disease join table (FK CASCADE; deleted explicitly)
    await manager
      .createQueryBuilder()
      .delete()
      .from('samples_diseases_diseases')
      .where('"samplesId" IN (:...ids)', { ids })
      .execute();

    // 4. Sample pooling join table (FK CASCADE; deleted explicitly)
    await manager
      .createQueryBuilder()
      .delete()
      .from('sample_pools')
      .where('sample_id_1 IN (:...ids) OR sample_id_2 IN (:...ids)', { ids })
      .execute();

    // 5. Clear self references to originalSampleId to prevent key constraints
    await manager
      .createQueryBuilder()
      .update(Sample)
      .set({ originalSample: null })
      .where('id IN (:...ids)', { ids })
      .execute();

    // 6. Delete the samples themselves (replicates and primaries together)
    await manager
      .createQueryBuilder()
      .delete()
      .from(Sample)
      .where('id IN (:...ids)', { ids })
      .execute();
  }

  async deleteSample(sampleId: string, user: any): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const sample = await manager.findOne(Sample, {
        where: { id: sampleId },
        relations: ['project'],
      });
      if (!sample) {
        throw new NotFoundException(`Sample with ID ${sampleId} not found`);
      }
      await this.assertCanPurgeProject(user, sample.project?.id, 'sample');

      await this.purgeSamplesWithDependencies(manager, [sample.id]);
    });
  }

  async deleteVisit(visitId: string, user: any): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const visit = await manager.findOne(Visit, {
        where: { id: visitId },
        relations: ['project', 'site', 'site.project'],
      });
      if (!visit) {
        throw new NotFoundException(`Visit with ID ${visitId} not found`);
      }
      // visits.projectId may be null for older rows; fall back to the
      // visit's site's project when so.
      const projectId = visit.project?.id ?? visit.site?.project?.id;
      await this.assertCanPurgeProject(user, projectId, 'visit');

      // 1. Delete all samples associated with this visit (+ their dependencies)
      const samples = await manager.find(Sample, {
        where: { visit: { id: visitId } },
        select: { id: true },
      });
      await this.purgeSamplesWithDependencies(
        manager,
        samples.map((s) => s.id),
      );

      // 2. Delete any remaining lab tests pointing directly to this visit
      //    (lab_tests.visitId is NO ACTION)
      await manager
        .createQueryBuilder()
        .delete()
        .from(LabTest)
        .where('visitId = :visitId', { visitId })
        .execute();

      // 3. Delete the visit (animal_metadata.visit_id cascades automatically)
      await manager
        .createQueryBuilder()
        .delete()
        .from(Visit)
        .where('id = :id', { id: visitId })
        .execute();
    });
  }

  async deleteSite(siteId: string, user: any): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const site = await manager.findOne(Site, {
        where: { id: siteId },
        relations: ['project'],
      });
      if (!site) {
        throw new NotFoundException(`Site with ID ${siteId} not found`);
      }
      await this.assertCanPurgeProject(user, site.project?.id, 'site');

      // 1. Delete every sample of this site. samples.siteId is NOT NULL, so a
      //    site filter covers both visit-linked and standalone samples.
      const samples = await manager.find(Sample, {
        where: { site: { id: siteId } },
        select: { id: true },
      });
      await this.purgeSamplesWithDependencies(
        manager,
        samples.map((s) => s.id),
      );

      // 2. Delete lab tests hanging off the site (lab_tests.siteId is NO ACTION)
      await manager
        .createQueryBuilder()
        .delete()
        .from(LabTest)
        .where('siteId = :siteId', { siteId })
        .execute();

      // 3. Delete visits of this site (visits.siteId is NO ACTION)
      await manager
        .createQueryBuilder()
        .delete()
        .from(Visit)
        .where('siteId = :siteId', { siteId })
        .execute();

      // 4. Delete site diseases association (CASCADE; deleted explicitly)
      await manager
        .createQueryBuilder()
        .delete()
        .from('site_diseases')
        .where('site_id = :siteId', { siteId })
        .execute();

      // 5. Delete the site itself (animal_metadata.site_id cascades automatically)
      await manager
        .createQueryBuilder()
        .delete()
        .from(Site)
        .where('id = :id', { id: siteId })
        .execute();
    });
  }

  async deleteProject(projectId: string, user: any): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const project = await manager.findOne(Project, {
        where: { id: projectId },
        relations: ['workspace'],
      });
      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }
      await this.assertCanPurgeProject(user, project.id, 'project');

      // 1. Delete every sample of this project (+ dependencies).
      //    samples.projectId is NOT NULL, so this reaches all of them.
      const samples = await manager.find(Sample, {
        where: { project: { id: projectId } },
        select: { id: true },
      });
      await this.purgeSamplesWithDependencies(
        manager,
        samples.map((s) => s.id),
      );

      // 2. Delete lab tests of this project (lab_tests.projectId is NO ACTION).
      //    Must run before visits/sites are removed.
      await manager
        .createQueryBuilder()
        .delete()
        .from(LabTest)
        .where('projectId = :projectId', { projectId })
        .execute();

      // 3. Delete visits. Cover both project-scoped visits and any visit still
      //    attached to a site of this project (visits.siteId is NO ACTION and
      //    visits.projectId may be null for older rows).
      const sites = await manager.find(Site, {
        where: { project: { id: projectId } },
        select: { id: true },
      });
      const siteIds = sites.map((s) => s.id);
      const visitQb = manager
        .createQueryBuilder()
        .delete()
        .from(Visit)
        .where('projectId = :projectId', { projectId });
      if (siteIds.length > 0) {
        visitQb.orWhere('siteId IN (:...siteIds)', { siteIds });
      }
      await visitQb.execute();

      // 4. Delete sites (site_diseases + animal_metadata.site_id cascade).
      await manager
        .createQueryBuilder()
        .delete()
        .from(Site)
        .where('projectId = :projectId', { projectId })
        .execute();

      // 5. Detach users from the project (users.projectId is NO ACTION)
      await manager
        .createQueryBuilder()
        .update(User)
        .set({ project: null })
        .where('projectId = :projectId', { projectId })
        .execute();

      // 6. Delete user roles scoped to this project (project is a plain column)
      await manager
        .createQueryBuilder()
        .delete()
        .from(UserRole)
        .where('project = :projectId', { projectId })
        .execute();

      // 7. Delete invites for this project (projectId is a plain column)
      await manager
        .createQueryBuilder()
        .delete()
        .from(Invite)
        .where('projectId = :projectId', { projectId })
        .execute();

      // 8. Delete project from ManyToMany join tables (CASCADE; deleted explicitly)
      const joinTables = [
        'project_admins',
        'project_diseases',
        'project_surveillance_types',
        'project_regions',
        'project_teams',
      ];
      for (const table of joinTables) {
        await manager
          .createQueryBuilder()
          .delete()
          .from(table)
          .where('project_id = :projectId', { projectId })
          .execute();
      }

      // 9. Delete project itself
      await manager
        .createQueryBuilder()
        .delete()
        .from(Project)
        .where('id = :id', { id: projectId })
        .execute();
    });

    // Step 6 above removed every UserRole scoped to this project, and the
    // project itself (with its workspace mapping) no longer exists - both
    // are read on the authenticated-request hot path, so invalidate both
    // caches rather than let them serve stale data for up to their TTL.
    await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
    await this.cacheService.del(CacheKeys.projectTenant(projectId));
  }
}

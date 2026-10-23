import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchResponseData } from 'src/common/dto/response/search.response';
import { Project } from 'src/entities/project.entity';
import { Site } from 'src/entities/site.entity';
import { User } from 'src/entities/user.entity';
import { Disease } from 'src/entities/disease.entity';
import { Repository } from 'typeorm';
import { applyProjectScope } from 'src/common/functions/tenant-scope';
import { TenantScopeService } from 'src/common/authorization/tenant-scope.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    private readonly tenantScopeService: TenantScopeService,
  ) {}

  async searchAll(query: any, user?: User): Promise<SearchResponseData> {
    // A13/21h: previously derived `accessibleProjectIds` from
    // `userRole.project` alone (the direct project-scoped FK), so a
    // workspace-admin - who reaches projects only via a workspace-scoped
    // UserRole - always fell into the "no accessible project" branch and
    // got zero results despite legitimately owning a workspace's worth of
    // projects. It also gave System scope a bizarre `createdBy: user.id`
    // restriction instead of the unrestricted access System means
    // everywhere else. resolveTenantScope/applyProjectScope (the shared
    // helper - see common/functions/tenant-scope.ts) replace all of this
    // with the same System / Workspace-expanded / Project / Team resolution
    // used elsewhere, still failing closed (never "no predicate") when the
    // caller reaches nothing.
    //
    // `user` is req.user, already eager-loaded by UserService.findOne with
    // roles/roles.role/roles.role.permissions/roles.workspace - re-fetching
    // it here was a redundant query.
    const tenant = await this.tenantScopeService.forUser(user);

    const [projects, sites, diseases] = await Promise.all([
      applyProjectScope(
        this.projectRepository
          .createQueryBuilder('project')
          .select(['project.id AS "id"', 'project.name AS "name"'])
          .where('LOWER(project.name) LIKE LOWER(:name)', {
            name: `%${query.searchText}%`,
          }),
        tenant,
        'project.id',
      ).getRawMany(),
      applyProjectScope(
        this.siteRepository
          .createQueryBuilder('site')
          .leftJoin('site.project', 'project')
          .select([
            'site.id AS "id"',
            'site.name AS "name"',
            'project.id AS "projectId"',
          ])
          .where('LOWER(site.name) LIKE LOWER(:name)', {
            name: `%${query.searchText}%`,
          }),
        tenant,
        'project.id',
      ).getRawMany(),
      // Diseases are global reference data, owned by no tenant.
      this.diseaseRepository
        .createQueryBuilder('disease')
        .select(['disease.id AS "id"', 'disease.name AS "name"'])
        .where('LOWER(disease.name) LIKE LOWER(:name)', {
          name: `%${query.searchText}%`,
        })
        .getRawMany(),
    ]);

    return { projects, sites, diseases };
  }
}

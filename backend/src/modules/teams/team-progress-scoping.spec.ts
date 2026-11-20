import { NotFoundException } from '@nestjs/common';
import { Action } from '../../common/enums/action.enum';
import { Resource } from '../../common/enums/resource.enum';
import { RoleType } from '../../common/enums/user-type.enum';
import { VisitStatus } from '../../common/enums/visitStatus.enum';
import { TeamsService } from './teams.service';

/**
 * Regression cover for the mobile Team Progress screen showing a collector's
 * sites and visits from another workspace's project.
 *
 * A collector added to project Y (workspace B) while still collecting for
 * project X (workspace A) was listed on Y's Team Progress with X's sites and
 * visit counts, because the counts came from `user.sites` - every site the
 * user collects for, in any project.
 */
describe('TeamsService - Team Progress is scoped to the project', () => {
  const PROJECT = 'PROJ-Y';
  const OTHER_PROJECT = 'PROJ-X';
  const TEAM = 'team-y';

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const sampleCreate = [{ action: Action.Create, subject: Resource.Sample }];

  const role = (name: string, project: string, permissions = sampleCreate) => ({
    project,
    role: { name, permissions },
  });

  const upcomingVisit = (id: string) => ({
    id,
    visitScheduledAt: tomorrow,
    visitStatus: VisitStatus.UPCOMING,
    isCompleted: false,
    visitedAt: null,
  });

  const site = (
    id: string,
    name: string,
    project: string,
    collectorId: string,
    visitCount: number,
  ) => ({
    id,
    name,
    address: `${name} address`,
    project: { id: project },
    collectorIds: [collectorId],
    location: { region: { name: 'District', parentRegion: { name: 'State' } } },
    visits: Array.from({ length: visitCount }, (_, i) =>
      upcomingVisit(`${id}-v${i}`),
    ),
  });

  // Collects in both projects. `sites` mimics the old `user.sites` relation,
  // which held the other workspace's site too - it must not be read.
  const otherWorkspaceSite = site(
    's-x',
    'Other Workspace Farm',
    OTHER_PROJECT,
    'u-dual',
    3,
  );
  const dual = {
    id: 'u-dual',
    firstName: 'Dual',
    lastName: 'Collector',
    roles: [
      role(RoleType.COLLECTOR, PROJECT),
      role(RoleType.COLLECTOR, OTHER_PROJECT),
    ],
    sites: [otherWorkspaceSite],
  };
  // Two `user_roles` rows in this team (team-admin + project-viewer).
  const lead = {
    id: 'u-lead',
    firstName: 'Team',
    lastName: 'Lead',
    roles: [
      role(RoleType.TEAM_ADMIN, PROJECT),
      role('project-viewer', PROJECT, []),
    ],
  };
  // Only a viewer here; a collector somewhere else.
  const viewer = {
    id: 'u-viewer',
    firstName: 'Viewer',
    lastName: 'Here',
    roles: [
      role('project-viewer', PROJECT, []),
      role(RoleType.COLLECTOR, OTHER_PROJECT),
    ],
  };

  const sites = [
    site('s-y', 'Here Farm', PROJECT, 'u-dual', 1),
    otherWorkspaceSite,
  ];
  const userRoleRows = [
    { team: TEAM, project: PROJECT, user: dual },
    { team: TEAM, project: PROJECT, user: lead },
    { team: TEAM, project: PROJECT, user: lead },
    { team: TEAM, project: PROJECT, user: viewer },
  ];

  let siteQuery: any;
  let createSiteQuery: jest.Mock;
  let sampleFind: jest.Mock;

  const build = () => {
    // A site query that applies the project + collector filter the way
    // Postgres would.
    const params: { projectId?: string; userIds?: string[] } = {};
    const filter = (_sql: string, values: typeof params) => {
      Object.assign(params, values);
      return siteQuery;
    };
    siteQuery = {
      leftJoinAndSelect: jest.fn(() => siteQuery),
      leftJoin: jest.fn(() => siteQuery),
      addSelect: jest.fn(() => siteQuery),
      where: jest.fn(filter),
      andWhere: jest.fn(filter),
      getMany: jest.fn(async () =>
        sites.filter(
          (s) =>
            s.project.id === params.projectId &&
            s.collectorIds.some((id) => params.userIds.includes(id)),
        ),
      ),
    };
    createSiteQuery = jest.fn(() => siteQuery);
    sampleFind = jest.fn().mockResolvedValue([]);

    const dataSource = {
      getRepository: jest.fn(() => ({ createQueryBuilder: createSiteQuery })),
    };
    const userRoleRepository = {
      find: jest.fn(async ({ where }) =>
        userRoleRows.filter(
          (r) =>
            r.team === where.team &&
            (where.project === undefined || r.project === where.project),
        ),
      ),
    };
    const teamRepository = {
      findOne: jest.fn(async ({ where }) =>
        where.id === TEAM && where.projects?.id === PROJECT
          ? { id: TEAM, members: [] }
          : null,
      ),
    };

    const noop = {} as never;
    return new TeamsService(
      dataSource as never,
      userRoleRepository as never,
      noop,
      teamRepository as never,
      noop,
      noop,
      noop,
      { find: sampleFind } as never,
      noop,
      noop,
      noop,
      noop,
    );
  };

  describe('getTeamMembersVisitActivity', () => {
    it("counts only this project's sites and visits for a collector in two workspaces", async () => {
      const activity = await build().getTeamMembersVisitActivity(
        {},
        TEAM,
        PROJECT,
      );
      const member = activity.find((m) => m.id === 'u-dual');

      expect(member.totalNumberOfVisitsAssigned).toBe(1);
      expect(member.totalNumberOfVisitsPending).toBe(1);
      expect(member.visits.map((v) => v.siteName)).toEqual(['Here Farm']);
      expect(siteQuery.where).toHaveBeenCalledWith(
        'site.project = :projectId',
        { projectId: PROJECT },
      );
    });

    it('lists a member with several role rows in the team once', async () => {
      const activity = await build().getTeamMembersVisitActivity(
        {},
        TEAM,
        PROJECT,
      );

      expect(activity.filter((m) => m.id === 'u-lead')).toHaveLength(1);
    });

    it('does not list someone who collects only in another project', async () => {
      const activity = await build().getTeamMembersVisitActivity(
        {},
        TEAM,
        PROJECT,
      );

      expect(activity.map((m) => m.id)).not.toContain('u-viewer');
    });

    it('treats a call without a project as team not found', async () => {
      const service = build();

      await expect(
        service.getTeamMembersVisitActivity({}, TEAM, undefined),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(createSiteQuery).not.toHaveBeenCalled();
    });
  });

  describe('getTeamMembersFieldView', () => {
    it("counts only this project's sites per collector", async () => {
      const result = await build().getTeamMembersFieldView(
        { team: TEAM },
        PROJECT,
      );

      expect(result.docs).toEqual([
        expect.objectContaining({ id: 'u-dual', siteCount: 1 }),
      ]);
      expect(result.total).toBe(1);
    });

    it('rejects a call without a project', async () => {
      await expect(
        build().getTeamMembersFieldView({ team: TEAM }, undefined),
      ).rejects.toThrow('Team not found');
    });
  });

  describe('getTeamActivityOverview', () => {
    it("counts each active member once, by their roles in this project, and this project's samples", async () => {
      const overview = await build().getTeamActivityOverview({}, TEAM, PROJECT);

      expect(overview.activeMembers).toBe(2); // dual + lead; not the viewer
      expect(sampleFind).toHaveBeenCalledWith({
        where: { team: { id: TEAM }, project: { id: PROJECT } },
      });
    });

    it('treats a call without a project as team not found', async () => {
      await expect(
        build().getTeamActivityOverview({}, TEAM, undefined),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});

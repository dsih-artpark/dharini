import { Scope } from '../enums/scope.enum';
import {
  applyProjectScope,
  canReachProject,
  collectRoleTenantIds,
  narrowToRequestedProject,
  resolveTenantScope,
} from './tenant-scope';

const role = (scope: Scope, extras: Record<string, unknown> = {}) => ({
  role: { scope, permissions: [] },
  project: null,
  team: null,
  workspace: null,
  ...extras,
});

describe('resolveTenantScope', () => {
  let projectRepository: { find: jest.Mock };

  beforeEach(() => {
    projectRepository = { find: jest.fn().mockResolvedValue([]) };
  });

  it('reports System scope as unrestricted without querying projects', async () => {
    const tenant = await resolveTenantScope(
      { roles: [role(Scope.System)] },
      projectRepository as any,
    );

    expect(tenant.isSystem).toBe(true);
    expect(projectRepository.find).not.toHaveBeenCalled();
  });

  it('expands a workspace-scoped role into that workspace projects', async () => {
    projectRepository.find.mockResolvedValue([{ id: 'p1' }, { id: 'p2' }]);

    const tenant = await resolveTenantScope(
      { roles: [role(Scope.Workspace, { workspace: { id: 'w1' } })] },
      projectRepository as any,
    );

    expect(tenant.isSystem).toBe(false);
    expect(tenant.workspaceIds).toEqual(['w1']);
    expect(tenant.projectIds.sort()).toEqual(['p1', 'p2']);
  });

  it('unions project-scoped roles with workspace-derived projects, without duplicates', async () => {
    projectRepository.find.mockResolvedValue([{ id: 'p1' }, { id: 'p2' }]);

    const tenant = await resolveTenantScope(
      {
        roles: [
          role(Scope.Project, { project: 'p1' }),
          role(Scope.Project, { project: 'p9' }),
          role(Scope.Workspace, { workspace: { id: 'w1' } }),
        ],
      },
      projectRepository as any,
    );

    expect(tenant.projectIds.sort()).toEqual(['p1', 'p2', 'p9']);
  });

  it('resolves to no projects for a user with no roles at all', async () => {
    const tenant = await resolveTenantScope(
      { roles: [] },
      projectRepository as any,
    );

    expect(tenant.isSystem).toBe(false);
    expect(tenant.projectIds).toEqual([]);
  });
});

describe('collectRoleTenantIds', () => {
  it('folds in the legacy singular user.project / user.team columns', async () => {
    const ids = collectRoleTenantIds({
      roles: [role(Scope.Project, { project: 'p1', team: 't1' })],
      project: { id: 'p-legacy' },
      team: { id: 't-legacy' },
    });

    expect(ids.projectIds.sort()).toEqual(['p-legacy', 'p1']);
    expect(ids.teamIds.sort()).toEqual(['t-legacy', 't1']);
  });

  it('can be asked to ignore the legacy columns, for the Phase D cleanup', () => {
    const ids = collectRoleTenantIds(
      {
        roles: [role(Scope.Project, { project: 'p1' })],
        project: { id: 'p-legacy' },
      },
      false,
    );

    expect(ids.projectIds).toEqual(['p1']);
  });
});

describe('applyProjectScope', () => {
  const builder = () => ({ andWhere: jest.fn().mockReturnThis() });

  it('adds no predicate at all for System scope', () => {
    const qb = builder();
    applyProjectScope(qb as any, { isSystem: true, projectIds: [] } as any);

    expect(qb.andWhere).not.toHaveBeenCalled();
  });

  it('emits 1 = 0 rather than no filter when the caller reaches nothing', () => {
    // The whole point of the helper: an empty id list must return nothing,
    // never everything. Omitting the predicate here is the cross-tenant leak
    // that this branch exists to close.
    const qb = builder();
    applyProjectScope(qb as any, { isSystem: false, projectIds: [] } as any);

    expect(qb.andWhere).toHaveBeenCalledWith('1 = 0');
  });

  it('binds the reachable project ids to the given column', () => {
    const qb = builder();
    applyProjectScope(
      qb as any,
      { isSystem: false, projectIds: ['p1', 'p2'] } as any,
      'sample.project_id',
    );

    expect(qb.andWhere).toHaveBeenCalledWith(
      'sample.project_id IN (:...tenantProjectIds)',
      { tenantProjectIds: ['p1', 'p2'] },
    );
  });
});

describe('narrowToRequestedProject / canReachProject', () => {
  const tenant = { isSystem: false, projectIds: ['p1'] } as any;

  it('accepts a requested project the caller can reach', () => {
    expect(narrowToRequestedProject(tenant, 'p1')).toBe('p1');
  });

  it('rejects a foreign project id instead of trusting it', () => {
    expect(narrowToRequestedProject(tenant, 'p-other')).toBeNull();
  });

  it('takes the first entry when the query param arrives as an array', () => {
    expect(narrowToRequestedProject(tenant, ['p1', 'p2'])).toBe('p1');
  });

  it('treats a missing project id as unreachable, not as a wildcard', () => {
    expect(canReachProject(tenant, undefined)).toBe(false);
    expect(canReachProject(tenant, null)).toBe(false);
  });

  it('lets System scope reach any project, including one it never listed', () => {
    const system = { isSystem: true, projectIds: [] } as any;
    expect(canReachProject(system, 'anything')).toBe(true);
  });
});

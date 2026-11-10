import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Scope } from 'src/common/enums/scope.enum';
import { User } from 'src/entities/user.entity';
import {
  attachCollectionCollectors,
  normalizeCollectorIds,
  projectTeamIdOf,
  sameCollectorIds,
  validateSiteCollectors,
} from './site-collectors';

/**
 * A site's collectors are a uuid[] with no foreign key behind it, so these
 * checks are what keeps it to real, active project members of one team.
 */
describe('site collectors', () => {
  const PROJECT_ID = 'p1';

  const user = (id: string, over: Record<string, unknown> = {}) => ({
    id,
    firstName: id.toUpperCase(),
    lastName: '',
    status: 'active',
    team: { id: 't1', teamName: 'North' },
    roles: [],
    ...over,
  });

  // The user query returns the users asked for; the project has teams t1, t2.
  const managerWith = (users: any[]) => {
    const builder = (rows: () => unknown) => {
      let ids: string[] = [];
      const qb: any = {
        leftJoinAndSelect: () => qb,
        innerJoin: () => qb,
        select: () => qb,
        where: (_sql: string, params?: { ids?: string[] }) => {
          if (params?.ids) ids = params.ids;
          return qb;
        },
        getMany: async () => users.filter((u) => ids.includes(u.id)),
        getRawMany: async () => rows(),
      };
      return qb;
    };
    return {
      createQueryBuilder: jest.fn((entity: unknown) =>
        builder(() => (entity === User ? [] : [{ id: 't1' }, { id: 't2' }])),
      ),
      find: jest.fn(async (_entity: unknown, options: any) =>
        users.filter((u) => options.where.id.value.includes(u.id)),
      ),
    } as any;
  };

  describe('normalizeCollectorIds', () => {
    it('trims, drops blanks and repeats, and keeps the order', () => {
      expect(normalizeCollectorIds([' b ', 'a', '', 'b'])).toEqual(['b', 'a']);
    });

    it('treats a missing or empty list as no change', () => {
      expect(normalizeCollectorIds(undefined)).toBeUndefined();
      expect(normalizeCollectorIds(null)).toBeUndefined();
      expect(normalizeCollectorIds([])).toBeUndefined();
      expect(normalizeCollectorIds(['', ' '])).toBeUndefined();
    });
  });

  it('compares collector lists in order', () => {
    expect(sameCollectorIds(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(sameCollectorIds(['a', 'b'], ['b', 'a'])).toBe(false);
    expect(sameCollectorIds([], null)).toBe(true);
  });

  describe('validateSiteCollectors', () => {
    it('returns the collectors in the order given', async () => {
      const manager = managerWith([user('u1'), user('u2')]);

      const collectors = await validateSiteCollectors(manager, ['u2', 'u1'], {
        projectId: PROJECT_ID,
      });

      expect(collectors.map((c) => c.id)).toEqual(['u2', 'u1']);
    });

    it('accepts a collector who is in the team only through a user role', async () => {
      const manager = managerWith([
        user('u1'),
        user('u2', {
          team: { id: 't9' },
          roles: [{ status: 'active', team: 't1', project: PROJECT_ID }],
        }),
      ]);

      await expect(
        validateSiteCollectors(manager, ['u1', 'u2'], {
          projectId: PROJECT_ID,
        }),
      ).resolves.toHaveLength(2);
    });

    it('refuses an unknown user', async () => {
      const manager = managerWith([user('u1')]);

      await expect(
        validateSiteCollectors(manager, ['u1', 'ghost'], {
          projectId: PROJECT_ID,
        }),
      ).rejects.toThrow(new NotFoundException('Collector not found: ghost'));
    });

    it('accepts collectors from different teams of the project', async () => {
      const manager = managerWith([
        user('u1'),
        user('u2', { team: { id: 't2', teamName: 'South' } }),
      ]);

      const collectors = await validateSiteCollectors(manager, ['u1', 'u2'], {
        projectId: PROJECT_ID,
      });

      expect(collectors.map((c) => [c.id, c.team.id])).toEqual([
        ['u1', 't1'],
        ['u2', 't2'],
      ]);
    });

    it('accepts a first collector who is in the project only through a user role', async () => {
      // Their own team is null (or another project's): their visits go under
      // the role's team, see projectTeamIdOf.
      const manager = managerWith([
        user('u1', {
          team: null,
          roles: [{ status: 'active', team: 't1', project: PROJECT_ID }],
        }),
        user('u2'),
      ]);

      await expect(
        validateSiteCollectors(manager, ['u1', 'u2'], {
          projectId: PROJECT_ID,
        }),
      ).resolves.toHaveLength(2);
    });

    it('checks a collector the site already has when they become the first', async () => {
      // u2 has been deactivated since; moving them first would hand them the
      // site's visits.
      const manager = managerWith([
        user('u1'),
        user('u2', { status: 'inactive' }),
      ]);

      await expect(
        validateSiteCollectors(manager, ['u2', 'u1'], {
          projectId: PROJECT_ID,
          existingIds: ['u1', 'u2'],
        }),
      ).rejects.toThrow(
        new BadRequestException(
          "U2 is not an active user and can't be a collector",
        ),
      );
    });

    describe('for a new site (dropInvalid)', () => {
      it('leaves out collectors who cannot be one and keeps the rest in order', async () => {
        const manager = managerWith([
          user('u1', { status: 'inactive' }),
          user('u2'),
          user('u3', { team: { id: 't9' } }),
          user('u4'),
        ]);

        const collectors = await validateSiteCollectors(
          manager,
          ['u1', 'ghost', 'u2', 'u3', 'u4'],
          { projectId: PROJECT_ID, dropInvalid: true, fallbackId: 'u4' },
        );

        // u2 becomes the first.
        expect(collectors.map((c) => c.id)).toEqual(['u2', 'u4']);
      });

      it('makes the user creating the site its collector when none of the chosen can be', async () => {
        const manager = managerWith([
          user('u1', { status: 'inactive' }),
          user('creator'),
        ]);

        const collectors = await validateSiteCollectors(manager, ['u1'], {
          projectId: PROJECT_ID,
          dropInvalid: true,
          fallbackId: 'creator',
        });

        expect(collectors.map((c) => c.id)).toEqual(['creator']);
      });

      it('refuses the site when neither the chosen nor its creator can collect', async () => {
        const manager = managerWith([
          user('u1', { status: 'inactive' }),
          user('creator', { team: { id: 't9' } }),
        ]);

        await expect(
          validateSiteCollectors(manager, ['u1'], {
            projectId: PROJECT_ID,
            dropInvalid: true,
            fallbackId: 'creator',
          }),
        ).rejects.toThrow(
          new BadRequestException(
            'None of the chosen collectors can collect for this project',
          ),
        );
      });

      it('still saves a site without collectors', async () => {
        const manager = managerWith([user('creator')]);

        await expect(
          validateSiteCollectors(manager, [], {
            projectId: PROJECT_ID,
            dropInvalid: true,
            fallbackId: 'creator',
          }),
        ).resolves.toEqual([]);
      });
    });

    it.each([
      [
        'an inactive user',
        { status: 'inactive' },
        "U2 is not an active user and can't be a collector",
      ],
      [
        'a user outside the project',
        { team: { id: 't9' } },
        'U2 is not a member of a team in this project',
      ],
      [
        'a super admin',
        { roles: [{ status: 'active', role: { scope: Scope.System } }] },
        'super-admin can not be collector',
      ],
    ])('refuses adding %s', async (_label, over, message) => {
      const manager = managerWith([user('u1'), user('u2', over)]);

      await expect(
        validateSiteCollectors(manager, ['u1', 'u2'], {
          projectId: PROJECT_ID,
          existingIds: ['u1'],
        }),
      ).rejects.toThrow(new BadRequestException(message));
    });

    it('does not check a collector the site already has again', async () => {
      // u1 has since left the project; the edit keeps them.
      const manager = managerWith([user('u1', { team: { id: 't9' } })]);

      await expect(
        validateSiteCollectors(manager, ['u1'], {
          projectId: PROJECT_ID,
          existingIds: ['u1'],
        }),
      ).resolves.toHaveLength(1);
    });
  });

  describe('projectTeamIdOf', () => {
    const teams = new Set(['t1', 't2']);

    it('is the user’s own team when it takes part in the project', () => {
      expect(
        projectTeamIdOf(
          user('u1', {
            roles: [{ status: 'active', team: 't2', project: PROJECT_ID }],
          }) as unknown as User,
          PROJECT_ID,
          teams,
        ),
      ).toBe('t1');
    });

    it('is their active role’s team in the project when their own team is another project’s', () => {
      expect(
        projectTeamIdOf(
          user('u1', {
            team: { id: 't9' },
            roles: [
              { status: 'inactive', team: 't1', project: PROJECT_ID },
              { status: 'active', team: 't8', project: 'p2' },
              { status: 'active', team: 't2', project: PROJECT_ID },
            ],
          }) as unknown as User,
          PROJECT_ID,
          teams,
        ),
      ).toBe('t2');
    });

    it('is null for a user in none of the project’s teams', () => {
      expect(
        projectTeamIdOf(
          user('u1', { team: null }) as unknown as User,
          PROJECT_ID,
          teams,
        ),
      ).toBeNull();
    });
  });

  describe('attachCollectionCollectors', () => {
    it('sets each site’s collectors in order with one query, leaving out users that are gone', async () => {
      const manager = managerWith([user('u1'), user('u2')]);
      const a: any = { collectorIds: ['u2', 'u1'] };
      const b: any = { collectorIds: ['u1', 'gone'] };
      const c: any = { collectorIds: [] };

      await attachCollectionCollectors(manager, [a, b, c, null]);

      expect(manager.find).toHaveBeenCalledTimes(1);
      expect(a.collectionCollectors.map((u) => u.id)).toEqual(['u2', 'u1']);
      expect(b.collectionCollectors.map((u) => u.id)).toEqual(['u1']);
      expect(c.collectionCollectors).toEqual([]);
    });

    it('does not query when no site has collectors', async () => {
      const manager = managerWith([]);

      await attachCollectionCollectors(manager, [{ collectorIds: [] }]);

      expect(manager.find).not.toHaveBeenCalled();
    });
  });
});

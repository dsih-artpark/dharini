import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Scope } from 'src/common/enums/scope.enum';
import { StatusType } from 'src/common/enums/status.enum';
import { getUserScope } from 'src/common/functions/get-user-role';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { EntityManager, In } from 'typeorm';

// A site's collectors are stored in `sites.collector_id` as a uuid[], first
// one first. Arrays can't carry a foreign key, so validateSiteCollectors
// stands in for one. The first collector is the primary: plan visits are
// created under them and their team. Every collector sees the site's visits,
// and a visit submitted by any of them is completed for all.

type CollectorSite = {
  collectorIds?: string[] | null;
  collectionCollectors?: User[];
};

// The user fields a site's collectors are returned with.
const COLLECTOR_FIELDS: (keyof User)[] = [
  'id',
  'firstName',
  'lastName',
  'profilePicture',
  'designation',
  'contactNumber',
  'address',
  'email',
  'status',
  'createdAt',
  'updatedAt',
];

// The ids a request assigns, trimmed and without blanks or repeats, in their
// order. A request that names none leaves the site's collectors as they are,
// as an empty `collectionCollector` used to.
export const normalizeCollectorIds = (
  ids?: string[] | null,
): string[] | undefined => {
  if (!Array.isArray(ids)) return undefined;
  const clean = [
    ...new Set(
      ids
        .filter((id): id is string => typeof id === 'string')
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ];
  return clean.length ? clean : undefined;
};

export const sameCollectorIds = (
  a?: string[] | null,
  b?: string[] | null,
): boolean => {
  const left = a ?? [];
  const right = b ?? [];
  return left.length === right.length && left.every((id, i) => id === right[i]);
};

export const primaryCollectorId = (site: CollectorSite): string | null =>
  site.collectorIds?.[0] ?? null;

const nameOf = (user: User): string =>
  `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
  user.email ||
  user.id;

/**
 * Checks the collectors a save assigns to a site and returns them in the
 * given order, with their teams.
 *
 * Each collector must exist. One the site doesn't already have must also be
 * active, not a super admin, and a member of one of the project's teams, as
 * the collector picker lists them. Collectors kept from before are not
 * checked again, so an edit still saves after one of them has left.
 *
 * The collectors may come from different teams of the project. Visits are
 * created under the first one's team, so with several collectors the first
 * must have a team.
 */
export async function validateSiteCollectors(
  manager: EntityManager,
  ids: string[],
  {
    projectId,
    existingIds,
  }: { projectId: string; existingIds?: string[] | null },
): Promise<User[]> {
  if (!ids.length) return [];

  // A query builder rather than find(): Team.members is eager, and find()
  // would load every member of each collector's team.
  const users = await manager
    .createQueryBuilder(User, 'user')
    .leftJoinAndSelect('user.team', 'team')
    .leftJoinAndSelect('user.roles', 'userRole')
    .leftJoinAndSelect('userRole.role', 'role')
    .leftJoinAndSelect('role.permissions', 'permission')
    .where('user.id IN (:...ids)', { ids })
    .getMany();
  const usersById = new Map(users.map((user) => [user.id, user]));

  const missing = ids.filter((id) => !usersById.has(id));
  if (missing.length) {
    throw new NotFoundException(`Collector not found: ${missing.join(', ')}`);
  }
  const collectors = ids.map((id) => usersById.get(id));

  const kept = new Set(existingIds ?? []);
  const added = collectors.filter((user) => !kept.has(user.id));
  if (added.length) {
    const teamRows = await manager
      .createQueryBuilder(Team, 'team')
      .innerJoin('team.projects', 'project', 'project.id = :projectId', {
        projectId,
      })
      .select('team.id', 'id')
      .getRawMany<{ id: string }>();
    const projectTeamIds = new Set(teamRows.map((row) => row.id));

    for (const user of added) {
      if (getUserScope(user) === Scope.System) {
        throw new BadRequestException('super-admin can not be collector');
      }
      if (user.status !== StatusType.ACTIVE) {
        throw new BadRequestException(
          `${nameOf(user)} is not an active user and can't be a collector`,
        );
      }
      const isMember =
        (user.team && projectTeamIds.has(user.team.id)) ||
        (user.roles ?? []).some(
          (userRole) =>
            userRole.status === StatusType.ACTIVE &&
            userRole.project === projectId &&
            !!userRole.team &&
            projectTeamIds.has(userRole.team),
        );
      if (!isMember) {
        throw new BadRequestException(
          `${nameOf(user)} is not a member of a team in this project`,
        );
      }
    }
  }

  if (collectors.length > 1 && !collectors[0].team) {
    throw new BadRequestException(
      `${nameOf(collectors[0])} has no team. The first collector of a site with several collectors needs one, as its visits are created under that team.`,
    );
  }

  return collectors;
}

// Sets `collectionCollectors` on each site to its collectors, in order, with
// one query for all of them. A collector whose user is gone is left out.
export async function attachCollectionCollectors(
  manager: EntityManager,
  sites: (CollectorSite | null | undefined)[],
): Promise<void> {
  const present = sites.filter((site): site is CollectorSite => !!site);
  const ids = [...new Set(present.flatMap((site) => site.collectorIds ?? []))];
  const users = ids.length
    ? await manager.find(User, {
        where: { id: In(ids) },
        select: COLLECTOR_FIELDS,
      })
    : [];
  const usersById = new Map(users.map((user) => [user.id, user]));
  for (const site of present) {
    site.collectionCollectors = (site.collectorIds ?? [])
      .map((id) => usersById.get(id))
      .filter((user): user is User => !!user);
  }
}

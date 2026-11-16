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

// The user fields a site's collectors, and a visit's visitors, are returned
// with.
export const COLLECTOR_FIELDS: (keyof User)[] = [
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

// The ids of the teams taking part in a project.
export async function projectTeamIds(
  manager: EntityManager,
  projectId: string,
): Promise<Set<string>> {
  const teamRows = await manager
    .createQueryBuilder(Team, 'team')
    .innerJoin('team.projects', 'project', 'project.id = :projectId', {
      projectId,
    })
    .select('team.id', 'id')
    .getRawMany<{ id: string }>();
  return new Set(teamRows.map((row) => row.id));
}

// The team a user collects under in a project: their own team when it takes
// part in the project, otherwise the team of an active role they have on the
// project with one of its teams. Null when they are in none of its teams.
// `users.teamId` is the team a user was created with - addTeamMember leaves
// it alone when an existing user joins another project's team - so it can
// belong to another project. Needs the user's `team` and `roles`.
export const projectTeamIdOf = (
  user: User,
  projectId: string,
  teamIds: Set<string>,
): string | null => {
  if (user.team && teamIds.has(user.team.id)) return user.team.id;
  const role = (user.roles ?? []).find(
    (userRole) =>
      userRole.status === StatusType.ACTIVE &&
      userRole.project === projectId &&
      !!userRole.team &&
      teamIds.has(userRole.team),
  );
  return role?.team ?? null;
};

// Whether a user belongs to one of a project's teams, as the collector
// picker lists them. Needs the user's `team` and `roles`.
export const isProjectTeamMember = (
  user: User,
  projectId: string,
  teamIds: Set<string>,
): boolean => projectTeamIdOf(user, projectId, teamIds) !== null;

/**
 * A collector as plan visits are given to them: the user, and the team in
 * the project their visits go under (see projectTeamIdOf), or null for that
 * team when they are in none of its teams. Null for a user who is gone, as
 * the collector ids have no foreign key behind them.
 */
export async function loadProjectCollector(
  manager: EntityManager,
  userId: string,
  projectId: string,
): Promise<{ user: User; teamId: string | null } | null> {
  // A query builder rather than find(): Team.members is eager.
  const user = await manager
    .createQueryBuilder(User, 'user')
    .leftJoinAndSelect('user.team', 'team')
    .leftJoinAndSelect('user.roles', 'userRole')
    .where('user.id = :userId', { userId })
    .getOne();
  if (!user) return null;
  const teamIds = await projectTeamIds(manager, projectId);
  return { user, teamId: projectTeamIdOf(user, projectId, teamIds) };
}

/**
 * Checks the collectors a save assigns to a site and returns them in the
 * given order, with their teams.
 *
 * Each collector must exist. One the site doesn't already have must also be
 * active, not a super admin, and a member of one of the project's teams, as
 * the collector picker lists them. Collectors kept from before are not
 * checked again, so an edit still saves after one of them has left - except
 * the first, whenever it becomes the first: plan visits are given to them.
 *
 * The collectors may come from different teams of the project. Visits go
 * under the first one's team in the project (see projectTeamIdOf), which a
 * checked collector always has.
 *
 * With `dropInvalid`, as a new site's collectors are checked, a collector
 * who fails these checks is left out and logged rather than refused: a site
 * created offline is checked only when the phone syncs it, perhaps days
 * later, and the phone resends a refused site forever. The first one left
 * becomes the first. When none is left, `fallbackId` (the user creating the
 * site), checked the same way, is the collector; without one that passes,
 * the save is refused.
 */
export async function validateSiteCollectors(
  manager: EntityManager,
  ids: string[],
  {
    projectId,
    existingIds,
    dropInvalid = false,
    fallbackId,
  }: {
    projectId: string;
    existingIds?: string[] | null;
    dropInvalid?: boolean;
    fallbackId?: string | null;
  },
): Promise<User[]> {
  if (!ids.length) return [];

  const fallback = dropInvalid && fallbackId ? fallbackId : null;
  const lookupIds = fallback ? [...new Set([...ids, fallback])] : ids;

  // A query builder rather than find(): Team.members is eager, and find()
  // would load every member of each collector's team.
  const users = await manager
    .createQueryBuilder(User, 'user')
    .leftJoinAndSelect('user.team', 'team')
    .leftJoinAndSelect('user.roles', 'userRole')
    .leftJoinAndSelect('userRole.role', 'role')
    .leftJoinAndSelect('role.permissions', 'permission')
    .where('user.id IN (:...ids)', { ids: lookupIds })
    .getMany();
  const usersById = new Map(users.map((user) => [user.id, user]));

  let teamIds: Set<string> | undefined;
  // Why a collector the save adds can't be one, or null when they can.
  const refusalOf = async (user: User): Promise<string | null> => {
    if (getUserScope(user) === Scope.System) {
      return 'super-admin can not be collector';
    }
    if (user.status !== StatusType.ACTIVE) {
      return `${nameOf(user)} is not an active user and can't be a collector`;
    }
    teamIds ??= await projectTeamIds(manager, projectId);
    if (!isProjectTeamMember(user, projectId, teamIds)) {
      return `${nameOf(user)} is not a member of a team in this project`;
    }
    return null;
  };

  const kept = new Set(existingIds ?? []);
  const firstBefore = existingIds?.[0] ?? null;
  const isChecked = (id: string, index: number) =>
    !kept.has(id) || (index === 0 && id !== firstBefore);

  if (!dropInvalid) {
    const missing = ids.filter((id) => !usersById.has(id));
    if (missing.length) {
      throw new NotFoundException(`Collector not found: ${missing.join(', ')}`);
    }
    const collectors = ids.map((id) => usersById.get(id));
    for (const [index, user] of collectors.entries()) {
      if (!isChecked(user.id, index)) continue;
      const refusal = await refusalOf(user);
      if (refusal) throw new BadRequestException(refusal);
    }
    return collectors;
  }

  // A new site: every collector is checked.
  const collectors: User[] = [];
  const dropped: string[] = [];
  for (const id of ids) {
    const user = usersById.get(id);
    const refusal = user ? await refusalOf(user) : 'not found';
    if (refusal) {
      dropped.push(`${id} (${refusal})`);
    } else {
      collectors.push(user);
    }
  }
  if (dropped.length) {
    console.warn(
      `[siteCollectors] Left out collectors of a new site in project ${projectId}: ${dropped.join('; ')}`,
    );
  }
  if (collectors.length) return collectors;

  const fallbackUser =
    fallback && !ids.includes(fallback) ? usersById.get(fallback) : undefined;
  if (fallbackUser && !(await refusalOf(fallbackUser))) {
    console.warn(
      `[siteCollectors] None of the new site's collectors can collect in project ${projectId}; ${fallbackUser.id}, who created it, is its collector instead.`,
    );
    return [fallbackUser];
  }
  throw new BadRequestException(
    'None of the chosen collectors can collect for this project',
  );
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

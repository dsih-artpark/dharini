import { User } from 'src/entities/user.entity';
import { EntityManager, In } from 'typeorm';
import {
  COLLECTOR_FIELDS,
  isProjectTeamMember,
  projectTeamIds,
} from '../sites/site-collectors';

// Everyone who was at a visit is stored in `visits."visitedById"` as a
// uuid[], the submitter first. Arrays can't carry a foreign key, so the ids
// are checked on the way in (resolveVisitedByIds) and turned back into users
// on the way out (attachVisitedBy). Who the visit belongs to - `collector`
// and its team - is unchanged.

type VisitedByVisit = {
  visitedByIds?: string[] | null;
  visitedBy?: User[];
};

// The ids a submission names: one id, as an app from before visits had
// several visitors still sends from its offline queue and the spreadsheet
// import sends, or a list of them. Trimmed, without blanks or repeats, in
// their order.
export const normalizeVisitedByIds = (value: unknown): string[] => {
  const ids =
    typeof value === 'string' ? [value] : Array.isArray(value) ? value : [];
  return [
    ...new Set(
      ids
        .filter((id): id is string => typeof id === 'string')
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ];
};

// Whether a user was at a visit: one of who it lists was there, or - for a
// visit recorded before visits listed that - its collector. Needs the
// visit's `visitedByIds` and its `collector`'s id.
export const wasAtVisit = (
  visit: {
    visitedByIds?: string[] | null;
    collector?: Pick<User, 'id'> | null;
  },
  userId: string,
): boolean =>
  visit.visitedByIds?.length
    ? visit.visitedByIds.includes(userId)
    : visit.collector?.id === userId;

// The visitors a visit already has, then the ones a later submission adds.
export const mergeVisitedByIds = (
  existing: string[] | null | undefined,
  added: string[],
): string[] => [...new Set([...(existing ?? []), ...added])];

/**
 * The visitors a submission records: its submitter, then each other user it
 * names who is a member of a team in the project, in order.
 *
 * Anyone else - an id with no user, or a user outside the project's teams -
 * is left out and logged rather than refused. The phone resends a refused
 * submission forever, and the checklist it was picked from may be a stale
 * offline copy of the site's collectors.
 */
export async function resolveVisitedByIds(
  manager: EntityManager,
  submitterId: string,
  named: unknown,
  projectId: string | null | undefined,
): Promise<string[]> {
  const others = normalizeVisitedByIds(named).filter(
    (id) => id !== submitterId,
  );
  if (!others.length) return [submitterId];

  const users = await manager
    .createQueryBuilder(User, 'user')
    .leftJoinAndSelect('user.team', 'team')
    .leftJoinAndSelect('user.roles', 'userRole')
    .where('user.id IN (:...ids)', { ids: others })
    .getMany();
  const usersById = new Map(users.map((user) => [user.id, user]));
  const teamIds = projectId
    ? await projectTeamIds(manager, projectId)
    : new Set<string>();

  const kept: string[] = [];
  const dropped: string[] = [];
  for (const id of others) {
    const user = usersById.get(id);
    if (user && projectId && isProjectTeamMember(user, projectId, teamIds)) {
      kept.push(id);
    } else {
      dropped.push(id);
    }
  }
  if (dropped.length) {
    console.warn(
      `[visitedBy] Left out visitors who are not members of project ${projectId}: ${dropped.join(', ')}`,
    );
  }
  return [submitterId, ...kept];
}

// Sets `visitedBy` on each visit to its visitors, in order, with one query
// for all of them. A visitor whose user is gone is left out.
export async function attachVisitedBy(
  manager: EntityManager,
  visits: (VisitedByVisit | null | undefined)[],
): Promise<void> {
  const present = visits.filter((visit): visit is VisitedByVisit => !!visit);
  const ids = [
    ...new Set(present.flatMap((visit) => visit.visitedByIds ?? [])),
  ];
  const users = ids.length
    ? await manager.find(User, {
        where: { id: In(ids) },
        select: COLLECTOR_FIELDS,
      })
    : [];
  const usersById = new Map(users.map((user) => [user.id, user]));
  for (const visit of present) {
    visit.visitedBy = (visit.visitedByIds ?? [])
      .map((id) => usersById.get(id))
      .filter((user): user is User => !!user);
  }
}

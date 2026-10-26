import { RoleType } from '../../common/enums/user-type.enum';
import { TeamsService } from './teams.service';

/**
 * Regression cover for the "adding an existing user to another project renames
 * them everywhere" bug.
 *
 * `users.firstName` / `users.lastName` are a person's identity across every
 * project they belong to, not a per-team label. The add-member form used to
 * send whatever the admin typed and this service applied it unconditionally,
 * so adding "A. Kumar" to a second project silently rewrote "Anil Kumar" for
 * everyone.
 *
 * Constructed directly rather than through Nest's DI - this exercises one
 * method, and the module's provider graph is far larger than that.
 */
describe('TeamsService.addTeamMember - existing user identity', () => {
  const TEAM = { id: 'team-1', teamName: 'Team A', members: [] };
  const ROLE = { id: 'role-1', name: RoleType.TEAM_ADMIN };
  const PROJECT = { id: 'project-1', members: [] };

  let userRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let service: TeamsService;

  const buildService = (existingUser: Record<string, unknown> | null) => {
    userRepository = {
      findOne: jest.fn(async (options: { where: unknown }) => {
        // The find-or-create lookup is the only one passing an array of
        // predicates (email OR contactNumber).
        if (Array.isArray(options.where)) return existingUser;
        const where = options.where as { id?: string };
        // The final re-read after the role is attached.
        if (where?.id) return existingUser ?? { id: 'user-new' };
        // The super-admin guard lookup.
        return null;
      }),
      create: jest.fn((payload) => ({ id: 'user-new', ...payload })),
      save: jest.fn(async (payload) => payload),
    };

    service = new TeamsService(
      {} as never, // dataSource
      {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((p) => p),
        save: jest.fn(async (p) => p),
      } as never, // userRoleRepository
      {} as never, // userService
      { findOne: jest.fn().mockResolvedValue(TEAM) } as never, // teamRepository
      userRepository as never,
      { findOne: jest.fn().mockResolvedValue(PROJECT) } as never, // projectRepository
      { findOne: jest.fn().mockResolvedValue(ROLE) } as never, // roleRepository
      {} as never, // sampleRepository
      {} as never, // mediaRepository
      {} as never, // mediaService
      { sendMail: jest.fn() } as never, // mailerService
      { delByPrefix: jest.fn() } as never, // cacheService
    );
  };

  const addMember = (overrides: Record<string, unknown> = {}) =>
    service.addTeamMember({
      project: 'project-1',
      teamId: 'team-1',
      role: 'role-1',
      email: 'anil@example.com',
      firstName: 'A.',
      lastName: 'K.',
      ...overrides,
    } as never);

  it('does not rename a user who already has a name', async () => {
    buildService({
      id: 'user-1',
      firstName: 'Anil',
      lastName: 'Kumar',
      email: 'anil@example.com',
    });

    await addMember();

    // The whole point: no write to `users` at all for an already-named
    // account, so the name cannot be clobbered.
    expect(userRepository.save).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('fills in a blank name on a stub account', async () => {
    buildService({
      id: 'user-1',
      firstName: '',
      lastName: null,
      email: 'anil@example.com',
    });

    await addMember({ firstName: 'Anil', lastName: 'Kumar' });

    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user-1',
        firstName: 'Anil',
        lastName: 'Kumar',
      }),
    );
  });

  it('keeps a real first name while filling only the blank last name', async () => {
    buildService({
      id: 'user-1',
      firstName: 'Anil',
      lastName: '',
      email: 'anil@example.com',
    });

    await addMember({ firstName: 'Something Else', lastName: 'Kumar' });

    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: 'Anil', lastName: 'Kumar' }),
    );
  });

  it('still creates a brand-new user with the supplied name', async () => {
    buildService(null);

    await addMember({ firstName: 'New', lastName: 'Person' });

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: 'New', lastName: 'Person' }),
    );
  });
});

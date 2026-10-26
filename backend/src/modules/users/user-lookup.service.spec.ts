import { BadRequestException } from '@nestjs/common';
import { StatusType } from '../../common/enums/status.enum';
import { UserService } from './users.service';

/**
 * Covers `GET /users/lookup`, the identity check the "add a user" forms run
 * before showing any detail fields.
 *
 * Built by calling the constructor directly rather than through Nest's DI:
 * only `userRepository` is exercised here, and the module-level spec in this
 * folder needs a much larger provider graph than this behaviour warrants.
 */
describe('UserService.lookupByIdentity', () => {
  let service: UserService;
  let getOne: jest.Mock;
  let where: jest.Mock;
  let andWhere: jest.Mock;

  beforeEach(() => {
    getOne = jest.fn().mockResolvedValue(null);
    const qb: Record<string, jest.Mock> = {};
    where = jest.fn(() => qb);
    andWhere = jest.fn(() => qb);
    Object.assign(qb, { where, andWhere, getOne });

    const userRepository = {
      createQueryBuilder: jest.fn(() => qb),
    };

    service = new UserService(
      userRepository as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );
  });

  it('rejects a query with neither identifier', async () => {
    await expect(service.lookupByIdentity({})).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('reports a miss as a normal result, not an error', async () => {
    getOne.mockResolvedValue(null);

    await expect(
      service.lookupByIdentity({ email: 'nobody@example.com' }),
    ).resolves.toEqual({ exists: false });
  });

  it('returns only the display fields for a match', async () => {
    getOne.mockResolvedValue({
      id: 'user-1',
      firstName: 'Anil',
      lastName: 'Kumar',
      email: 'anil@example.com',
      contactNumber: '9876543210',
      // Present on the entity, and deliberately not returned: this route must
      // not disclose which tenants a user belongs to.
      roles: [{ id: 'role-1' }],
      team: { id: 'team-1' },
      projects: [{ id: 'project-1' }],
    });

    const result = await service.lookupByIdentity({
      email: 'anil@example.com',
    });

    expect(result).toEqual({
      exists: true,
      user: {
        id: 'user-1',
        firstName: 'Anil',
        lastName: 'Kumar',
        email: 'anil@example.com',
        contactNumber: '9876543210',
      },
    });
  });

  it('matches email case-insensitively and only on the supplied identifier', async () => {
    await service.lookupByIdentity({ email: 'Anil@Example.com' });

    expect(andWhere).toHaveBeenCalledWith('LOWER(user.email) = LOWER(:email)', {
      email: 'Anil@Example.com',
    });
    // Passing a known-good email alongside a guessed phone must not turn into
    // an OR, or the caller could not tell which one produced the hit.
    expect(andWhere).not.toHaveBeenCalledWith(
      expect.stringContaining('contactNumber'),
      expect.anything(),
    );
  });

  it('falls back to the phone number when no email is supplied', async () => {
    await service.lookupByIdentity({ contactNumber: '9876543210' });

    expect(andWhere).toHaveBeenCalledWith(
      'user.contactNumber = :contactNumber',
      { contactNumber: '9876543210' },
    );
  });

  it('never matches a deactivated account', async () => {
    await service.lookupByIdentity({ email: 'anil@example.com' });

    expect(where).toHaveBeenCalledWith('user.status = :status', {
      status: StatusType.ACTIVE,
    });
  });
});

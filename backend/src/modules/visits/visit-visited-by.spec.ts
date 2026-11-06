import {
  attachVisitedBy,
  mergeVisitedByIds,
  normalizeVisitedByIds,
  resolveVisitedByIds,
} from './visit-visited-by';

describe('visit visitors', () => {
  describe('normalizeVisitedByIds', () => {
    it('takes a list, trimmed and without blanks or repeats, in order', () => {
      expect(
        normalizeVisitedByIds([' u1 ', 'u2', '', 'u1', null, 'u3']),
      ).toEqual(['u1', 'u2', 'u3']);
    });

    it('takes one id, as an app from before visits had several visitors sends', () => {
      expect(normalizeVisitedByIds('u1')).toEqual(['u1']);
    });

    it('takes nothing as no one', () => {
      expect(normalizeVisitedByIds(undefined)).toEqual([]);
      expect(normalizeVisitedByIds(null)).toEqual([]);
      expect(normalizeVisitedByIds({})).toEqual([]);
    });
  });

  describe('mergeVisitedByIds', () => {
    it('keeps the visitors a visit has first and adds only the new ones', () => {
      expect(mergeVisitedByIds(['u1', 'u2'], ['u3', 'u2'])).toEqual([
        'u1',
        'u2',
        'u3',
      ]);
      expect(mergeVisitedByIds(null, ['u1'])).toEqual(['u1']);
    });
  });

  describe('resolveVisitedByIds', () => {
    it('looks nobody up when the submitter is the only one named', async () => {
      const manager = { createQueryBuilder: jest.fn() };

      await expect(
        resolveVisitedByIds(manager as any, 'u1', ['u1'], 'p1'),
      ).resolves.toEqual(['u1']);
      expect(manager.createQueryBuilder).not.toHaveBeenCalled();
    });
  });

  describe('attachVisitedBy', () => {
    it("sets each visit's visitors in order with one query, leaving out users that are gone", async () => {
      const users = [
        { id: 'u2', firstName: 'Two' },
        { id: 'u1', firstName: 'One' },
      ];
      const manager = { find: jest.fn().mockResolvedValue(users) };
      const visits: any[] = [
        { visitedByIds: ['u1', 'gone', 'u2'] },
        { visitedByIds: [] },
        null,
      ];

      await attachVisitedBy(manager as any, visits);

      expect(manager.find).toHaveBeenCalledTimes(1);
      expect(visits[0].visitedBy.map((user) => user.id)).toEqual(['u1', 'u2']);
      expect(visits[1].visitedBy).toEqual([]);
    });

    it('queries nothing for visits nobody has visited', async () => {
      const manager = { find: jest.fn() };
      const visits: any[] = [{ visitedByIds: [] }];

      await attachVisitedBy(manager as any, visits);

      expect(manager.find).not.toHaveBeenCalled();
      expect(visits[0].visitedBy).toEqual([]);
    });
  });
});

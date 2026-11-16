import { ProjectsService } from './projects.service';

/**
 * Team Allocation & Progress (/:projectId/team-member-progress).
 *
 * DHR-500:
 *  - the AI / FMD / LSD tabs listed the same rows, because rows came from
 *    every site the team visits regardless of disease;
 *  - "Showing data for" never changed Pending or Completed.
 * Follow-ups on the same table:
 *  - rows and visit counts were per team, so every member showed the same
 *    sites and numbers;
 *  - overdue visits were not counted as pending;
 *  - sample columns only counted samples currently sitting at that stage, so
 *    they dropped as samples moved on;
 *  - "Report Generated" was returned under a different key and always read 0;
 *  - row order depended on which query finished first.
 */
describe('ProjectsService.teamMemberProgress', () => {
  const PROJECT_ID = 'P0I9KN';
  const DISEASE_ID = '516a48f3-c708-4aea-b1fb-36c47e3d4c6e';
  const START = '2026-09-30T18:30:00.000Z';
  const END = '2026-10-31T18:29:59.999Z';

  const zara = { id: 'u-zara', firstName: 'Zara', lastName: 'Collector' };
  const amit = { id: 'u-amit', firstName: 'Amit', lastName: 'Lab' };
  const lead = { id: 'u-lead', firstName: 'Team', lastName: 'Lead' };

  const makeQueryBuilder = (rows: any[] = []) => {
    const qb: Record<string, jest.Mock> = {};
    for (const method of [
      'select',
      'addSelect',
      'where',
      'andWhere',
      'orWhere',
      'innerJoin',
      'leftJoin',
      'setParameter',
      'setParameters',
      'groupBy',
      'addGroupBy',
    ]) {
      qb[method] = jest.fn().mockReturnValue(qb);
    }
    qb.getRawMany = jest.fn().mockResolvedValue(rows);
    return qb;
  };

  const run = (
    query: Record<string, unknown>,
    {
      pendingRows = [],
      completedRows = [],
      sampleRowsByMember = {},
      members = [zara, amit, lead],
    }: {
      pendingRows?: any[];
      completedRows?: any[];
      sampleRowsByMember?: Record<string, any[]>;
      members?: { id: string; firstName: string; lastName: string }[];
    } = {},
  ) => {
    const pendingQb = makeQueryBuilder(pendingRows);
    const completedQb = makeQueryBuilder(completedRows);
    const sampleQbs: Record<string, ReturnType<typeof makeQueryBuilder>> = {};
    const ctx = {
      resolveProjectTeamMembers: jest.fn().mockResolvedValue({
        members,
        memberTeamMap: new Map(members.map((m) => [m.id, 'team-1'])),
      }),
      visitRepository: {
        createQueryBuilder: jest
          .fn()
          .mockReturnValueOnce(pendingQb)
          .mockReturnValueOnce(completedQb),
      },
      sampleRepository: {
        createQueryBuilder: jest.fn().mockImplementation(() => {
          // The member id arrives via setParameters, so resolve rows lazily.
          const qb = makeQueryBuilder();
          qb.setParameters.mockImplementation((params) => {
            sampleQbs[params.memberId] = qb;
            qb.getRawMany.mockResolvedValue(
              sampleRowsByMember[params.memberId] ?? [],
            );
            return qb;
          });
          return qb;
        }),
      },
    };
    const result = ProjectsService.prototype.teamMemberProgress.call(ctx, {
      projectId: PROJECT_ID,
      ...query,
    });
    return { result, pendingQb, completedQb, sampleQbs };
  };

  const selectSql = (qb: Record<string, jest.Mock>, alias: string) =>
    qb.addSelect.mock.calls.find(([, a]) => a === alias)?.[0] as string;

  describe('member-wise rows and counts', () => {
    it('credits pending visits to the assigned collector', async () => {
      const { result, pendingQb } = run({ diseaseId: DISEASE_ID });
      await result;

      expect(pendingQb.select).toHaveBeenCalledWith(
        'visit.collectorId',
        'memberId',
      );
      expect(pendingQb.andWhere).toHaveBeenCalledWith(
        'visit.collectorId IN (:...memberIds)',
        // Name order: Amit Lab, Team Lead, Zara Collector.
        { memberIds: [amit.id, lead.id, zara.id] },
      );
      expect(pendingQb.groupBy).toHaveBeenCalledWith('visit.collectorId');
    });

    it('credits completed visits to whoever did them, else the assigned collector', async () => {
      const { result, completedQb } = run({ diseaseId: DISEASE_ID });
      await result;

      const doneBy = '"doneBy"."memberId"';
      expect(completedQb.innerJoin).toHaveBeenCalledWith(
        '(SELECT unnest(ARRAY[:...memberIds]::uuid[]) AS "memberId")',
        'doneBy',
        `${doneBy} = ANY (CASE WHEN cardinality("visit"."visitedById") > 0 THEN "visit"."visitedById" ELSE ARRAY["visit"."collectorId"] END)`,
        // Name order: Amit Lab, Team Lead, Zara Collector.
        { memberIds: [amit.id, lead.id, zara.id] },
      );
      expect(completedQb.select).toHaveBeenCalledWith(doneBy, 'memberId');
      expect(completedQb.groupBy).toHaveBeenCalledWith(doneBy);
    });

    it("gives each member only their own sites, and 'No site assigned' when they have none", async () => {
      const { result } = run(
        { diseaseId: DISEASE_ID },
        {
          pendingRows: [
            { memberId: zara.id, siteId: 's1', siteName: 'Baanu', count: '5' },
          ],
          completedRows: [
            { memberId: zara.id, siteId: 's1', siteName: 'Baanu', count: '2' },
          ],
          sampleRowsByMember: {
            [amit.id]: [
              {
                siteId: 's2',
                siteName: 'Kokorakoo',
                totalCollected: '0',
                totalReceived: '0',
                totalExtracted: '1',
                totalTested: '1',
                totalReportGenerated: '1',
              },
            ],
          },
        },
      );

      expect((await result).docs).toEqual([
        expect.objectContaining({
          userId: amit.id,
          siteName: 'Kokorakoo',
          pendingVisitCount: 0,
          totalExtracted: 1,
          totalReportGenerated: 1,
        }),
        expect.objectContaining({
          userId: lead.id,
          siteName: 'No site assigned',
          pendingVisitCount: 0,
        }),
        expect.objectContaining({
          userId: zara.id,
          siteName: 'Baanu',
          pendingVisitCount: 5,
          completedVisitCount: 2,
        }),
      ]);
    });
  });

  it('counts overdue visits as pending', async () => {
    const { result, pendingQb } = run({});
    await result;

    expect(selectSql(pendingQb, 'count')).toContain(
      "visit.visitStatus IN ('upcoming', 'overdue')",
    );
  });

  describe('sample columns', () => {
    it('count a step once the sample has reached it, not only while it sits there', async () => {
      const { result, sampleQbs } = run({});
      await result;
      const qb = sampleQbs[zara.id];

      const received = selectSql(qb, 'totalReceived');
      expect(received).toContain('sample.receivedById = :memberId');
      expect(received).toContain("'received'");
      expect(received).toContain("'test-report-generated'");
      expect(received).not.toContain("'picked-up'");

      const tested = selectSql(qb, 'totalTested');
      expect(tested).toContain(
        "sample.sampleStatus IN ('tested', 'test-report-generated')",
      );
    });

    it('do not count a step the sample was moved back from', async () => {
      const { result, sampleQbs } = run({});
      await result;

      // An extracted-by actor on a sample that is back at `received` must
      // not count: the extracted column requires extracted-or-later.
      expect(selectSql(sampleQbs[zara.id], 'totalExtracted')).not.toContain(
        "'received'",
      );
    });

    it('count every sample the member collected, whatever happened next', async () => {
      const { result, sampleQbs } = run({});
      await result;

      expect(selectSql(sampleQbs[zara.id], 'totalCollected')).toBe(
        'COUNT(DISTINCT CASE WHEN sample.collectedById = :memberId THEN sample.id END)',
      );
    });

    it('return Report Generated under the key the table and CSV read', async () => {
      const { result, sampleQbs } = run({});
      await result;

      expect(selectSql(sampleQbs[zara.id], 'totalReportGenerated')).toContain(
        'sample.reportGeneratedById = :memberId',
      );
      expect(selectSql(sampleQbs[zara.id], 'totalTestReportGenerated')).toBe(
        undefined,
      );
    });
  });

  describe('disease tab', () => {
    it('limits every query to sites configured for the disease', async () => {
      const { result, pendingQb, completedQb, sampleQbs } = run({
        diseaseId: DISEASE_ID,
      });
      await result;

      for (const qb of [pendingQb, completedQb, sampleQbs[zara.id]]) {
        expect(qb.innerJoin).toHaveBeenCalledWith(
          'site.diseases',
          'siteDisease',
          'siteDisease.id = :diseaseId',
          { diseaseId: DISEASE_ID },
        );
      }
    });

    it('does not restrict sites when no disease is selected', async () => {
      const { result, pendingQb } = run({});
      await result;

      expect(pendingQb.innerJoin).not.toHaveBeenCalledWith(
        'site.diseases',
        expect.anything(),
        expect.anything(),
        expect.anything(),
      );
    });
  });

  describe('"Showing data for" date range', () => {
    it('dates pending by schedule and completed by the visit', async () => {
      const { result, pendingQb, completedQb } = run({
        diseaseId: DISEASE_ID,
        startDate: START,
        endDate: END,
      });
      await result;

      expect(selectSql(pendingQb, 'count')).toContain(
        'visit.visitScheduledAt BETWEEN :startDate AND :endDate',
      );
      expect(selectSql(completedQb, 'count')).toContain(
        'COALESCE(visit.visitedAt, visit.visitScheduledAt) BETWEEN :startDate AND :endDate',
      );
      expect(pendingQb.setParameters).toHaveBeenCalledWith({
        startDate: START,
        endDate: END,
      });
    });

    it('dates each sample column by when that step happened', async () => {
      const { result, sampleQbs } = run({ startDate: START, endDate: END });
      await result;
      const qb = sampleQbs[zara.id];

      for (const [alias, column] of [
        ['totalCollected', 'sample.collectionTime'],
        ['totalReceived', 'sample.receivedAt'],
        ['totalExtracted', 'sample.extractionDateTime'],
        ['totalTested', 'sample.testedAt'],
        ['totalReportGenerated', 'sample.reportGeneratedAt'],
      ]) {
        expect(selectSql(qb, alias)).toContain(
          `${column} BETWEEN :startDate AND :endDate`,
        );
      }
    });

    it('applies no date condition for All Time', async () => {
      const { result, pendingQb, completedQb, sampleQbs } = run({
        diseaseId: DISEASE_ID,
      });
      await result;

      expect(selectSql(pendingQb, 'count')).not.toContain('BETWEEN');
      expect(selectSql(completedQb, 'count')).not.toContain('BETWEEN');
      expect(selectSql(sampleQbs[zara.id], 'totalReceived')).not.toContain(
        'BETWEEN',
      );
    });
  });

  describe('row order', () => {
    it('orders members by name and their sites by name, whatever order the data arrives in', async () => {
      const { result } = run(
        {},
        {
          pendingRows: [
            { memberId: zara.id, siteId: 's2', siteName: 'Selvas', count: '1' },
            {
              memberId: zara.id,
              siteId: 's1',
              siteName: 'amu farm',
              count: '1',
            },
            { memberId: amit.id, siteId: 's3', siteName: 'Gopal', count: '1' },
          ],
        },
      );

      expect(
        (await result).docs.map((d) => `${d.firstName}:${d.siteName}`),
      ).toEqual([
        'Amit:Gopal',
        'Team:No site assigned',
        'Zara:amu farm',
        'Zara:Selvas',
      ]);
    });

    it('paginates the name-ordered member list', async () => {
      const { result } = run({ page: 2, limit: 2 });

      expect((await result).docs.map((d) => d.userId)).toEqual([zara.id]);
    });

    it('applies an explicit column sort on top', async () => {
      const { result } = run(
        { sort: 'pendingVisitCount', sortOrder: 'desc' },
        {
          pendingRows: [
            { memberId: amit.id, siteId: 's3', siteName: 'Gopal', count: '1' },
            { memberId: zara.id, siteId: 's1', siteName: 'Baanu', count: '9' },
          ],
        },
      );

      expect((await result).docs[0]).toEqual(
        expect.objectContaining({ userId: zara.id, pendingVisitCount: 9 }),
      );
    });
  });
});

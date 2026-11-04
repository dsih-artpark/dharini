import { StatusType } from 'src/common/enums/status.enum';
import { siteTestStatusSql } from '../sites/site-test-status';
import { ProjectsService } from './projects.service';

/**
 * DHR-491: the project Sites cards (Total / Pending / Positive / Negative)
 * ignored the selected disease tab - Total was every site in the project for
 * AI, FMD and LSD alike - and disagreed with the site list below them. The
 * cards now count exactly the list's site set (sites configured for the
 * disease, active, reachable, same date filter), bucketed by the same
 * per-site status the list rows show.
 */
describe('ProjectsService.getSitesStatisticsByStatus', () => {
  const PROJECT_ID = 'P0I9KN';
  const DISEASE_ID = '16e0243d-8c91-414d-8fa0-606555467256';
  const user = { id: 'u1' } as any;

  const makeQueryBuilder = (rows: { status: string }[]) => {
    const qb: Record<string, jest.Mock> = {};
    for (const method of [
      'select',
      'addSelect',
      'where',
      'andWhere',
      'innerJoin',
    ]) {
      qb[method] = jest.fn().mockReturnValue(qb);
    }
    qb.getRawMany = jest.fn().mockResolvedValue(rows);
    return qb;
  };

  const run = (
    {
      rows = [],
      reachable = true,
    }: { rows?: { status: string }[]; reachable?: boolean },
    diseaseId?: string,
    startDate?: string,
    endDate?: string,
  ) => {
    const qb = makeQueryBuilder(rows);
    const ctx = {
      siteRepository: { createQueryBuilder: jest.fn().mockReturnValue(qb) },
      tenantScopeService: {
        canReachProject: jest.fn().mockResolvedValue(reachable),
      },
    };
    const result = ProjectsService.prototype.getSitesStatisticsByStatus.call(
      ctx,
      PROJECT_ID,
      user,
      diseaseId,
      startDate,
      endDate,
    );
    return { result, qb, ctx };
  };

  it('counts only sites configured for the selected disease, scored on that disease', async () => {
    const { result, qb } = run({}, DISEASE_ID);
    await result;

    expect(qb.innerJoin).toHaveBeenCalledWith(
      'site.diseases',
      'disease',
      'disease.id = :diseaseId',
      { diseaseId: DISEASE_ID },
    );
    expect(qb.addSelect).toHaveBeenCalledWith(
      siteTestStatusSql('site.id', 'diseaseId'),
      'status',
    );
  });

  it('matches the site list: project, active sites only', async () => {
    const { result, qb } = run({}, DISEASE_ID);
    await result;

    expect(qb.where).toHaveBeenCalledWith('site."projectId" = :projectId', {
      projectId: PROJECT_ID,
    });
    expect(qb.andWhere).toHaveBeenCalledWith('site.status = :activeStatus', {
      activeStatus: StatusType.ACTIVE,
    });
  });

  it('applies the date range to site creation, as the site list does', async () => {
    const { result, qb } = run(
      {},
      DISEASE_ID,
      '2026-08-01T00:00:00.000Z',
      '2026-11-01T00:00:00.000Z',
    );
    await result;

    expect(qb.andWhere).toHaveBeenCalledWith(
      'DATE(site.createdAt) BETWEEN :startDate AND :endDate',
      {
        startDate: '2026-08-01T00:00:00.000Z',
        endDate: '2026-11-01T00:00:00.000Z',
      },
    );
  });

  it('buckets every counted site exactly once so the cards add up to Total', async () => {
    const { result } = run(
      {
        rows: [
          { status: 'positive' },
          { status: 'positive' },
          { status: 'negative' },
          { status: 'pending' },
          { status: 'pending' },
          { status: 'pending' },
        ],
      },
      DISEASE_ID,
    );

    expect(await result).toEqual({
      total: 6,
      positive: 2,
      negative: 1,
      pending: 3,
    });
  });

  it('without a disease, counts every active site scored across all diseases', async () => {
    const { result, qb } = run({ rows: [{ status: 'pending' }] });

    expect(await result).toEqual({
      total: 1,
      positive: 0,
      negative: 0,
      pending: 1,
    });
    expect(qb.innerJoin).not.toHaveBeenCalled();
    expect(qb.addSelect).toHaveBeenCalledWith(
      siteTestStatusSql('site.id', undefined),
      'status',
    );
  });

  it('returns zeros without querying for a project the caller cannot reach', async () => {
    const { result, ctx } = run({ reachable: false }, DISEASE_ID);

    expect(await result).toEqual({
      total: 0,
      positive: 0,
      negative: 0,
      pending: 0,
    });
    expect(ctx.tenantScopeService.canReachProject).toHaveBeenCalledWith(
      user,
      PROJECT_ID,
    );
    expect(ctx.siteRepository.createQueryBuilder).not.toHaveBeenCalled();
  });
});

describe('siteTestStatusSql', () => {
  it('scopes lab tests to the disease parameter when given', () => {
    const sql = siteTestStatusSql('site.id', 'diseaseId');
    expect(sql).toContain('lt."diseaseId" = :diseaseId');
    expect(sql).toContain(`s."siteId" = site.id`);
  });

  it('considers every disease when no parameter is given', () => {
    expect(siteTestStatusSql('site.id')).not.toContain('diseaseId');
  });

  it('only trusts results on samples that reached testing', () => {
    expect(siteTestStatusSql('site.id')).toContain(
      `s."sampleStatus" IN ('tested', 'test-report-generated')`,
    );
  });
});

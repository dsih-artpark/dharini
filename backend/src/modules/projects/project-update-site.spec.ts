import { DateTime, Settings } from 'luxon';
import { ProjectsController } from './projects.controller';

/**
 * The mobile app edits a collection plan without sending its start date. The
 * update used to treat that as "no start date" and recalculate one from the
 * first preferred day on the server's UTC clock, which moved the stored start
 * date (to yesterday's date for an edit made between 00:00 and 05:30 IST) and
 * counted the expiry from it. An edit without a start date now keeps the
 * stored one and counts the expiry from it.
 */
describe('ProjectsController.updateSite collection start date', () => {
  const SITE_ID = '4d60e8fc-604f-4c10-8da3-c79a65964832';
  const PROJECT_ID = 'P4TOD6';

  const originalNow = Settings.now;
  afterEach(() => {
    Settings.now = originalNow;
  });
  const setClock = (iso: string) => {
    const millis = DateTime.fromISO(iso).toMillis();
    Settings.now = () => millis;
  };

  const updateSite = async (storedStartDate: Date | null, dto: any) => {
    const siteService = {
      getCollectionStartDate: jest.fn().mockResolvedValue(storedStartDate),
      update: jest.fn(async (...args: any[]) => ({ id: args[0] })),
      getSignedUrlForSingleSite: jest.fn().mockResolvedValue([]),
    };
    const userRepository = {
      findOne: jest.fn().mockResolvedValue({ id: 'admin' }),
    };

    await ProjectsController.prototype.updateSite.call(
      { siteService, userRepository },
      PROJECT_ID,
      SITE_ID,
      dto,
      { user: { id: 'admin' } },
    );

    const collectionObj = siteService.update.mock.calls[0][3];
    return { collectionObj, siteService };
  };

  // Saturday 2026-10-10, as node-postgres returns the stored start date.
  const storedSaturday = new Date(2026, 9, 10);

  // What the mobile app sends when only the plan changed.
  const mobilePlanEdit = {
    collectionFrequencyInterval: 7,
    collectionFrequency: 1,
    collectionDayOfWeek: ['Monday'],
    collectionTime: '09:00:00',
    collectionDuration: 30,
  };

  it.each([
    // Tue 13 Oct 02:00 IST: the UTC clock still says Monday the 12th.
    ['between 00:00 and 05:30 IST', '2026-10-12T20:30:00.000Z'],
    // Wed 14 Oct 11:00 IST.
    ['during the day', '2026-10-14T05:30:00.000Z'],
  ])('keeps the stored start date for an edit made %s', async (_, now) => {
    setClock(now);

    const { collectionObj, siteService } = await updateSite(
      storedSaturday,
      mobilePlanEdit,
    );

    expect(siteService.getCollectionStartDate).toHaveBeenCalledWith(
      SITE_ID,
      PROJECT_ID,
    );
    // Left null, so SitesService.update() keeps the stored value.
    expect(collectionObj.collectionStartDate).toBeNull();
    // 30 days from the stored Saturday, not from a recalculated Monday.
    expect(collectionObj.collectionExpiryDate).toBe('2026-11-09 23:59:59');
  });

  it('counts the expiry from the stored start date when only the duration changes', async () => {
    setClock('2026-10-14T05:30:00.000Z');

    const { collectionObj } = await updateSite(storedSaturday, {
      collectionDuration: 60,
    });

    expect(collectionObj.collectionStartDate).toBeNull();
    expect(collectionObj.collectionExpiryDate).toBe('2026-12-09 23:59:59');
  });

  it('still uses an explicit new start date as before', async () => {
    setClock('2026-10-14T05:30:00.000Z');

    const { collectionObj, siteService } = await updateSite(storedSaturday, {
      ...mobilePlanEdit,
      collectionStartDate: '2026-10-15',
    });

    expect(siteService.getCollectionStartDate).not.toHaveBeenCalled();
    expect(collectionObj.collectionStartDate).toBe('2026-10-15 00:00:00');
    expect(collectionObj.collectionExpiryDate).toBe('2026-11-14 23:59:59');
  });

  it('still calculates a start date for a site that has none stored', async () => {
    setClock('2026-10-14T05:30:00.000Z'); // Wednesday in both UTC and IST

    const { collectionObj } = await updateSite(null, mobilePlanEdit);

    expect(collectionObj.collectionStartDate).toBe('2026-10-19 00:00:00');
    expect(collectionObj.collectionExpiryDate).toBe('2026-11-18 23:59:59');
  });
});

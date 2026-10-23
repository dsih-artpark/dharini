"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FeatureCollection } from "geojson";
import { Maximize2, Minimize2 } from "lucide-react";
import Loader from "@/src/components/ui/loader";
import MapPeriodFilter, {
  DateRange,
  PeriodSelection,
  getMapMonthBounds,
  getMapYearOptions,
  parseDateRange,
} from "./map-period-filter";

const SiteMap = dynamic(() => import("./leaflet-map-renderer"), { ssr: false });
import {
  ExploreSitesPeriod,
  getSiteStatByTestResultAndDiseaseApi,
} from "@/src/app/(dashboard)/monitor/loader";
import type { ExploreSite } from "@/src/types/site";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";
import { FilterType } from "@/src/types/statistics";

const INDIA_GEOJSON_URL = "/maps/india.geojson";

// Refreshes faster than this show no loading indicator at all
const REFRESH_INDICATOR_DELAY_MS = 400;

// How long the main Start/End dates must stay unchanged before the map
// follows them (see `mainRange`)
const DATE_RANGE_SETTLE_MS = 400;

// Map size outside full screen (the renderer shrinks the width to fit)
const MAP_WIDTH = 1200;
const MAP_HEIGHT = 600;

export default function ExploreSites({
  filters,
  workspaceId,
}: {
  filters: FilterType;
  workspaceId?: string;
}) {
  const [geoJson, setGeoJson] = useState<FeatureCollection>();
  const [exploreSiteData, setExploreSiteData] = useState<ExploreSite>();
  const [loadingMap, setLoadingMap] = useState<boolean>(false);
  const [updateMap, setUpdateMap] = useState<boolean>(false);
  // Starts true so the first paint shows the loaders, not an empty "0" state
  const [loading, setLoading] = useState<boolean>(true);
  const [periodSelection, setPeriodSelection] = useState<PeriodSelection>({
    year: null,
    month: null,
  });

  // The main Start/End dates as a usable range, once they've settled. The
  // date input reports partial years while a year is typed (0002, 0020, ...),
  // so waiting keeps those from resetting the year tabs or refetching.
  const [mainRange, setMainRange] = useState<DateRange | null>(() =>
    parseDateRange(filters.startDate, filters.endDate),
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = parseDateRange(filters.startDate, filters.endDate);
      setMainRange((prev) =>
        prev?.startDate === next?.startDate && prev?.endDate === next?.endDate
          ? prev
          : next,
      );
    }, DATE_RANGE_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [filters.startDate, filters.endDate]);

  // Year tabs and the selected year's months follow the main range. A
  // selected year that's no longer offered goes back to Overall; a month
  // that's no longer offered goes back to the whole year.
  const yearOptions = useMemo(() => getMapYearOptions(mainRange), [mainRange]);
  const monthBounds = useMemo(
    () => getMapMonthBounds(mainRange, periodSelection.year),
    [mainRange, periodSelection.year],
  );
  useEffect(() => {
    const { year, month } = periodSelection;
    if (year !== null && !yearOptions.includes(year)) {
      setPeriodSelection({ year: null, month: null });
    } else if (
      month !== null &&
      (month < monthBounds.first || month > monthBounds.last)
    ) {
      setPeriodSelection({ year, month: null });
    }
  }, [yearOptions, monthBounds, periodSelection]);

  // Refreshes keep the current cards and map on screen. A small "Updating"
  // pill shows only if a refresh is slow, so quick switches (month/year
  // clicks, playback steps) don't flash anything.
  const [showRefreshing, setShowRefreshing] = useState(false);
  // A failed refresh clears the old data rather than leaving the previous
  // selection's numbers under the new one
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShowRefreshing(false);
      return;
    }
    const timer = setTimeout(
      () => setShowRefreshing(true),
      REFRESH_INDICATOR_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [loading]);
  // Id of the latest explore-sites request; older responses are dropped so a
  // slow earlier request can't overwrite the map after a quick filter change
  const latestRequestRef = useRef(0);

  // Full screen covers the whole map frame, so the overlays (layers, period
  // filter) come along. The map itself has a fixed pixel size, so it gets
  // the screen size while in full screen.
  const mapFrameRef = useRef<HTMLDivElement>(null);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [fullscreenSize, setFullscreenSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    // Checked after mount: not available on the server or on iPhone Safari
    setCanFullscreen(document.fullscreenEnabled);

    const syncSize = () => {
      const frame = mapFrameRef.current;
      setFullscreenSize(
        frame && document.fullscreenElement === frame
          ? { width: frame.clientWidth, height: frame.clientHeight }
          : null,
      );
    };
    document.addEventListener("fullscreenchange", syncSize);
    window.addEventListener("resize", syncSize);
    return () => {
      document.removeEventListener("fullscreenchange", syncSize);
      window.removeEventListener("resize", syncSize);
    };
  }, []);

  const toggleFullscreen = () => {
    const request = document.fullscreenElement
      ? document.exitFullscreen()
      : mapFrameRef.current?.requestFullscreen();
    request?.catch((error) => console.error("Full screen failed:", error));
  };

  const fetchGeoJson = async () => {
    try {
      setLoadingMap(true);
      const response = await fetch(INDIA_GEOJSON_URL);
      const data = await response.json();
      setGeoJson(data);
    } catch (error) {
      console.error("Error fetching geojson:", error);
    } finally {
      setLoadingMap(false);
    }
  };

  const fetchExploreSiteData = async () => {
    const requestId = ++latestRequestRef.current;
    try {
      setLoading(true);
      setUpdateMap(true);

      // Collect all selected disease IDs — backend now supports multiple via IN
      const diseaseIds = Array.isArray(filters.diseaseId)
        ? filters.diseaseId
        : filters.diseaseId
          ? [filters.diseaseId]
          : [];

      // Combine districtIds and stateIds — backend resolves sub-regions for each
      const districtIds = Array.isArray(filters.districtId)
        ? filters.districtId
        : filters.districtId
          ? [filters.districtId]
          : [];
      const stateIds = Array.isArray(filters.stateId)
        ? filters.stateId
        : filters.stateId
          ? [filters.stateId]
          : [];
      // Prefer districts (more specific); fall back to states if no districts selected
      const resolvedRegionIds = districtIds.length > 0 ? districtIds : stateIds;

      // Normalise remaining multi-select filters
      const siteIds = Array.isArray(filters.siteId)
        ? filters.siteId
        : filters.siteId
          ? [filters.siteId]
          : [];
      const sampleTypeIds = Array.isArray(filters.sampleTypeId)
        ? filters.sampleTypeId
        : filters.sampleTypeId
          ? [filters.sampleTypeId]
          : [];
      const testResults = Array.isArray(filters.testResult)
        ? filters.testResult
        : filters.testResult
          ? [filters.testResult]
          : [];
      const variants = Array.isArray(filters.variant)
        ? filters.variant
        : filters.variant
          ? [filters.variant]
          : [];

      const { year, month } = periodSelection;
      const period: ExploreSitesPeriod =
        year === null ? "overall" : month === null ? "year" : "month";
      // The main Start/End dates apply only on Overall; a picked year or
      // month is the map's own window
      const overallRange = year === null ? mainRange : null;

      const params = {
        disease: diseaseIds,
        regionId: resolvedRegionIds,
        startDate: overallRange?.startDate ?? "",
        endDate: overallRange?.endDate ?? "",
        surveillanceType: "",
        siteId: siteIds,
        sampleTypeId: sampleTypeIds,
        testResult: testResults,
        variant: variants,
        projectId: filters.projectId || "",
        workspaceId: workspaceId || "",
        period,
        // undefined params are dropped by axios
        year: year !== null ? String(year) : undefined,
        month: month !== null ? String(month) : undefined,
      };

      const { data } = await getSiteStatByTestResultAndDiseaseApi(params);
      if (requestId !== latestRequestRef.current) return;

      data.siteData = data.siteData
        .filter((s) => s.diseaseId)
        .map((s, i) => {
          s.color = DISEASE_COLOR_CODE.COLOR_HEX[(s?.diseaseIndex ?? i) % 6];
          return s;
        });
      setExploreSiteData(data);
      setLoadError(false);
    } catch (error) {
      console.log("Error fetching explore site data:", error);
      if (requestId === latestRequestRef.current) {
        setExploreSiteData(undefined);
        setLoadError(true);
      }
    } finally {
      if (requestId === latestRequestRef.current) {
        setUpdateMap(false);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchGeoJson();
  }, []);

  // Refetch on the shared non-date filters and the period. The main dates
  // count only on Overall, via the settled `mainRange`, so changing them
  // while a year is picked doesn't refetch the map.
  const sharedFiltersKey = JSON.stringify({
    ...filters,
    startDate: undefined,
    endDate: undefined,
  });
  const overallRangeKey =
    periodSelection.year === null && mainRange
      ? `${mainRange.startDate}|${mainRange.endDate}`
      : "";

  useEffect(() => {
    fetchExploreSiteData();
  }, [sharedFiltersKey, workspaceId, periodSelection, overallRangeKey]);

  return (
    <div className="mt-6 bg-white rounded-xl border border-grey-20 shadow-sm p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-grey-90">
          Geospatial Distribution
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        {/* Top: Stats Legend */}
        <div className="w-full flex flex-col gap-4">
          {loading && !exploreSiteData ? (
            <div className="py-10 flex justify-center">
              <Loader />
            </div>
          ) : loadError ? (
            <p className="py-6 text-sm text-red-30">
              Couldn&apos;t load site data for this selection.
            </p>
          ) : (
            <>
              {exploreSiteData?.siteData &&
                exploreSiteData.siteData.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-grey-70">
                      Sites with Confirmed Positives
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {exploreSiteData.siteData.map((site, i) => (
                        <div key={i} className="rounded-xl bg-grey-10 p-3.5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-grey-90">
                              {site.shortName}
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: site.color }}
                            />
                          </div>
                          <div className="flex items-center gap-3 text-sm text-grey-70">
                            <div>
                              <div className="text-xs text-grey-60">Total</div>
                              <div className="text-base font-semibold text-grey-90">
                                {site.totalSites}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-grey-60">
                                Positive
                              </div>
                              <div className="text-base font-semibold text-red-30">
                                {site.positiveSites}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Always rendered (0 when none) so the map below doesn't jump
                  as the count changes, e.g. during month playback */}
              <div className="rounded-xl bg-green-10 border border-green-20 p-4 flex items-center justify-between w-full sm:w-auto sm:max-w-xs">
                <span className="text-green-30 font-medium text-sm">
                  Sites with No Positive Detection
                </span>
                <span className="text-2xl font-bold text-green-30">
                  {exploreSiteData?.diseaseFreeSiteCount ?? 0}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Bottom: Map */}
        <div
          ref={mapFrameRef}
          className="w-full h-[600px] bg-grey-10 rounded-xl border border-grey-20 overflow-hidden relative isolate [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
        >
          <SiteMap
            geoJson={geoJson}
            width={fullscreenSize?.width ?? MAP_WIDTH}
            height={fullscreenSize?.height ?? MAP_HEIGHT}
            exploreSiteData={exploreSiteData}
            loading={loadingMap || loading}
            rerenderMap={updateMap}
          />
          {(loadingMap || (loading && !exploreSiteData)) && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <Loader />
            </div>
          )}
          {canFullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={fullscreenSize ? "Exit full screen" : "Full screen"}
              title={fullscreenSize ? "Exit full screen" : "Full screen"}
              className="absolute top-4 right-4 z-20 bg-white p-2 rounded shadow-md border border-grey-20 hover:bg-gray-50"
            >
              {fullscreenSize ? (
                <Minimize2 size={20} className="text-grey-70" />
              ) : (
                <Maximize2 size={20} className="text-grey-70" />
              )}
            </button>
          )}
          {loading && exploreSiteData && showRefreshing && (
            <div
              className={`absolute top-4 z-20 rounded-full bg-surface border border-border shadow-md px-3 py-1.5 flex items-center gap-2 text-xs text-text-secondary ${
                canFullscreen ? "right-16" : "right-4"
              }`}
            >
              <Loader />
              Updating…
            </div>
          )}
          {loadError && !loading && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 rounded-full bg-surface border border-red-20 shadow-md pl-3 pr-1.5 py-1 flex items-center gap-2 text-xs text-red-30 whitespace-nowrap">
              Couldn&apos;t load map data
              <button
                type="button"
                onClick={fetchExploreSiteData}
                className="rounded-full border border-red-20 px-2 py-0.5 font-medium hover:bg-red-10"
              >
                Retry
              </button>
            </div>
          )}

          {/* Year tabs + month slider float over the bottom of the map, above
              the loading overlay so they stay usable while data reloads.
              right-14 / sm:right-20 keep clear of the bottom-right zoom
              control; the wrapper ignores pointer events so the map can still
              be dragged beside the bar. */}
          <div className="absolute bottom-5 left-3 right-14 sm:inset-x-20 z-20 flex justify-center pointer-events-none">
            <MapPeriodFilter
              value={periodSelection}
              years={yearOptions}
              months={monthBounds}
              onChange={setPeriodSelection}
              loading={loading}
              error={loadError}
              // Capped in full screen so the slider doesn't stretch across
              // a whole monitor
              className={`pointer-events-auto ${fullscreenSize ? "max-w-4xl" : ""}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Menu } from "lucide-react";
import type * as Leaflet from "leaflet";

import {
  haversineKm,
  findNearestWetland,
  isFeatureWithinRadius,
  clipFeatureToCircle,
} from "@/src/app/(dashboard)/geolens/utils/geo";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardMap } from "./DashboardMap";
import { SiteComparisonPanel } from "./SiteComparisonPanel";
import { TemporaryLocationPanel } from "./TemporaryLocationPanel";
import {
  getAllCattleMarkets,
  getAllPoultryFarms,
  getAllWetlands,
  getBirdObservations,
  getInitialDashboardData,
  getStateDashboardData,
  getWeatherData,
  getWaterBoundaries,
  getBufferBounds,
} from "@/src/app/(dashboard)/geolens/loader";
import type { WeatherData } from "@/src/app/(dashboard)/geolens/loader";
import type {
  BirdObservation,
  CustomGeoJson,
  CustomGeoJsonFeature,
  FlyTarget,
  LeafletRefType,
  CattleMarket,
  PoultryFarm,
  Site,
  SurveillanceSite,
  ViewportBounds,
  Wetland,
} from "@/src/app/(dashboard)/geolens/types";

import { getSiteStatByTestResultAndDiseaseApi } from "@/src/app/(dashboard)/monitor/loader";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";
import { useSurveillanceFilters } from "./filters/useSurveillanceFilters";
import { SurveillanceFilters } from "./filters/SurveillanceFilters";

// --- ICONS ---
const makeIcon = (L: typeof Leaflet, color: string, label: string) =>
  L.divIcon({
    className: "",
    html: `<div style="position:relative;width:28px;height:38px">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 38" width="28" height="38">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 24 14 24S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="14" cy="14" r="6" fill="white"/>
      <text x="14" y="18" text-anchor="middle" font-size="9" fill="${color}" font-weight="bold" font-family="monospace">${label}</text>
    </svg>
  </div>`,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    tooltipAnchor: [0, -40],
  });

// Unused makeWetlandIcon and makeSourceIcon helper definitions removed.

// Helper functions for point-in-polygon state detection
const isPointInPolygon = (lat: number, lng: number, polygon: number[][]) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0],
      yi = polygon[i][1];
    const xj = polygon[j][0],
      yj = polygon[j][1];
    const intersect =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

const detectStateFromCoords = (
  lat: number,
  lng: number,
  geojson: CustomGeoJson | null | undefined,
) => {
  if (!geojson || !geojson.features) return null;
  for (const feature of geojson.features) {
    const geom = feature.geometry;
    const stateName = feature.properties?.name || feature.properties?.NAME;
    if (!geom || !stateName) continue;
    if (geom.type === "Polygon") {
      const coords = geom.coordinates as number[][][];
      if (isPointInPolygon(lat, lng, coords[0])) {
        return stateName.toUpperCase();
      }
    } else if (geom.type === "MultiPolygon") {
      const coords = geom.coordinates as number[][][][];
      for (const polyCoords of coords) {
        if (isPointInPolygon(lat, lng, polyCoords[0])) {
          return stateName.toUpperCase();
        }
      }
    }
  }
  return null;
};

const detectStateFromLabel = (label: string, statesList: string[]) => {
  const cleanLabel = label.toUpperCase();
  for (const s of statesList) {
    if (cleanLabel.includes(s)) {
      return s;
    }
  }
  return null;
};

// --- MAIN APP ---
export default function App() {
  const [leafletReady, setLeafletReady] = useState(false);
  const leafletRef = useRef<LeafletRefType | null>(null);

  // Layout State
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");
  const [activeTab, setActiveTab] = useState<"overview" | "birds" | "farms">(
    "overview",
  );
  const [headerSearch, setHeaderSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarClosing, setSidebarClosing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const filtersPanelRef = useRef<HTMLDivElement>(null);
  const filtersButtonRef = useRef<HTMLButtonElement>(null);

  // Layer Visibility State
  const showWetlandLayer = false;
  const [showBufferWetlands, setShowBufferWetlands] = useState(false);
  const [showPoultryLayer, setShowPoultryLayer] = useState(false);
  const [showCattleMarketLayer, setShowCattleMarketLayer] = useState(false);
  const [showBufferPoultry, setShowBufferPoultry] = useState(false);
  const showBirdsLayer = true;
  const [activeBaseMap, setActiveBaseMap] = useState("osm");

  // Analysis Visibility State
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showBuffer, setShowBuffer] = useState(false);

  // Data State
  const [radius, setRadius] = useState(15);
  const [siteA, setSiteA] = useState<Site | null>(null);
  const [siteB, setSiteB] = useState<Site | null>(null);
  const [birdsA, setBirdsA] = useState<BirdObservation[]>([]);
  const [birdsB, setBirdsB] = useState<BirdObservation[]>([]);
  const [weatherA, setWeatherA] = useState<WeatherData | null>(null);
  const [weatherB, setWeatherB] = useState<WeatherData | null>(null);
  const [searchPin, setSearchPin] = useState<Site | null>(null);
  const [searchBirds, setSearchBirds] = useState<BirdObservation[]>([]);
  const [searchWeather, setSearchWeather] = useState<WeatherData | null>(null);
  const [panelSearchA, setPanelSearchA] = useState("");
  const [panelSearchB, setPanelSearchB] = useState("");
  const [allCsvData, setAllCsvData] = useState<{
    wetlands: Wetland[];
    poultry: PoultryFarm[];
  }>({ wetlands: [], poultry: [] });
  const allPoultryCacheRef = useRef<PoultryFarm[] | null>(null);
  const [allCattleMarkets, setAllCattleMarkets] = useState<CattleMarket[]>([]);
  const allCattleMarketsCacheRef = useRef<CattleMarket[] | null>(null);
  const [globalWetlandsCache, setGlobalWetlandsCache] = useState<Wetland[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedWetland, setSelectedWetland] = useState("");
  const [indiaGeoJson, setIndiaGeoJson] = useState<CustomGeoJson | null>(null);

  // Dynamic Viewport and Water Boundary State
  const [viewportBounds, setViewportBounds] = useState<ViewportBounds | null>(
    null,
  );
  const [viewportZoom, setViewportZoom] = useState<number>(5);
  const [waterBoundariesData, setWaterBoundariesData] =
    useState<CustomGeoJson | null>(null);
  const [isWaterLoading, setIsWaterLoading] = useState(false);
  // A toggled-on layer fetches before it can draw anything; these drive the
  // sidebar spinner and the map's loading chip so the click is acknowledged.
  const [isPoultryLoading, setIsPoultryLoading] = useState(false);
  const [isCattleMarketLoading, setIsCattleMarketLoading] = useState(false);
  const [isWetlandLoading, setIsWetlandLoading] = useState(false);

  // Custom memoized state setters to prevent infinite identity-comparison loops
  const updateViewportBounds = useCallback((newBounds: ViewportBounds) => {
    setViewportBounds((prev) => {
      if (!prev) return newBounds;
      if (
        prev.minLng === newBounds.minLng &&
        prev.minLat === newBounds.minLat &&
        prev.maxLng === newBounds.maxLng &&
        prev.maxLat === newBounds.maxLat
      ) {
        return prev; // prevents unnecessary state updates and re-renders
      }
      return newBounds;
    });
  }, []);

  const updateViewportZoom = useCallback((newZoom: number) => {
    setViewportZoom((prev) => (prev === newZoom ? prev : newZoom));
  }, []);

  const handleStateDropdownChange = useCallback(
    (stateName: string) => {
      setSelectedState(stateName);
      if (stateName && indiaGeoJson && leafletRef.current) {
        const stateFeature = (indiaGeoJson.features || []).find(
          (f: CustomGeoJsonFeature) =>
            f.properties?.name?.toUpperCase() === stateName.toUpperCase(),
        );
        if (stateFeature) {
          const L = leafletRef.current.L;
          const bounds = L.geoJSON(
            stateFeature as unknown as Parameters<typeof L.geoJSON>[0],
          ).getBounds();
          let zoom = 7;
          if (stateName.toUpperCase() === "GOA") zoom = 10;
          else if (stateName.toUpperCase() === "DELHI") zoom = 10;
          else if (stateName.toUpperCase() === "PUDUCHERRY") zoom = 10;
          setFlyTarget({
            lat: bounds.getCenter().lat,
            lng: bounds.getCenter().lng,
            zoom,
          });
        }
      } else {
        setFlyTarget({ lat: 20.59, lng: 78.96, zoom: 5 });
      }
    },
    [indiaGeoJson],
  );

  // Analysis State
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null);

  // Surveillance filters (project-scoped, mirrors the disease dashboard)
  const [showFilters, setShowFilters] = useState(false);
  const [showSurveillanceSites, setShowSurveillanceSites] = useState(false);
  const [surveillanceSites, setSurveillanceSites] = useState<
    SurveillanceSite[]
  >([]);

  const {
    resetKey,
    filters,
    handleFilterChange,
    resetFilters,
    selectedProjectId,
    setSelectedProjectId,
    showProjectSelector,
    projectOptions,
    stateOptions,
    districtOptions,
    diseaseOptions,
    siteOptions,
    sampleTypeOptions,
    activeFilterCount,
    selectedStateRegion,
  } = useSurveillanceFilters();

  // Memoized Icons
  const iconA = useMemo(
    () =>
      leafletReady && leafletRef.current
        ? makeIcon(leafletRef.current.L, "#3498db", "A")
        : null,
    [leafletReady],
  );
  const iconB = useMemo(
    () =>
      leafletReady && leafletRef.current
        ? makeIcon(leafletRef.current.L, "#27ae60", "B")
        : null,
    [leafletReady],
  );
  const searchIcon = useMemo(
    () =>
      leafletReady && leafletRef.current
        ? makeIcon(leafletRef.current.L, "#f39c12", "S")
        : null,
    [leafletReady],
  );

  // Load Leaflet
  useEffect(() => {
    let mounted = true;
    const emergencyTimer = setTimeout(() => {
      if (mounted && !leafletReady) {
        console.warn("Leaflet load timed out, forcing ready state");
        setLeafletReady(true);
      }
    }, 3000);

    async function loadLeaflet() {
      if (typeof window === "undefined") return;
      try {
        const L = (await import("leaflet")).default;
        // @ts-expect-error - leaflet css does not have TS definitions
        await import("leaflet/dist/leaflet.css");
        try {
          // @ts-expect-error - leaflet-geosearch css does not have TS definitions
          await import("leaflet-geosearch/dist/geosearch.css");
        } catch {}
        interface CustomWindow extends Window {
          L?: typeof Leaflet;
        }
        (window as CustomWindow).L = L;

        try {
          // @ts-expect-error - leaflet.heat has no typings
          await import("leaflet.heat");
        } catch {}
        try {
          // @ts-expect-error - leaflet.markercluster has no bundled TS definitions
          await import("leaflet.markercluster");
        } catch {}
        try {
          // @ts-expect-error - markercluster css does not have TS definitions
          await import("leaflet.markercluster/dist/MarkerCluster.css");
        } catch {}

        const [rl, mc, rlc] = await Promise.all([
          import("react-leaflet"),
          import("./MapComponents").catch(() => ({
            MapClickHandler: () => null,
            FlyToLocation: () => null,
            SearchBar: () => null,
            HeatmapLayer: () => null,
            LayerTracker: () => null,
          })),
          import("react-leaflet-cluster").catch(() => ({
            default: ({ children }: { children: React.ReactNode }) => (
              <>{children}</>
            ),
          })),
        ]);

        if (mounted) {
          const mcObj = mc as Record<string, React.ElementType>;
          leafletRef.current = {
            L,
            MapContainer: rl.MapContainer,
            TileLayer: rl.TileLayer,
            ZoomControl: rl.ZoomControl,
            GeoJSON: rl.GeoJSON,
            Marker: rl.Marker,
            Circle: rl.Circle,
            CircleMarker: rl.CircleMarker,
            Tooltip: rl.Tooltip,
            LayerGroup: rl.LayerGroup,
            useMap: rl.useMap,
            useMapEvents: rl.useMapEvents,
            MapClickHandler: mcObj.MapClickHandler || (() => null),
            FlyToLocation: mcObj.FlyToLocation || (() => null),
            SearchBar: mcObj.SearchBar || (() => null),
            HeatmapLayer: mcObj.HeatmapLayer || (() => null),
            LayerTracker: mcObj.LayerTracker || (() => null),
            MarkerClusterGroup: rlc.default || rlc,
          };
          setLeafletReady(true);
        }
      } catch (err) {
        console.error("Leaflet load failed:", err);
        if (mounted) setLeafletReady(true);
      }
    }
    loadLeaflet();
    return () => {
      mounted = false;
      clearTimeout(emergencyTimer);
    };
  }, [leafletReady]);

  // Fetch initial data on mount
  useEffect(() => {
    let mounted = true;
    const loadInitial = async () => {
      try {
        const { states, indiaGeoJson: indiaGeo } =
          await getInitialDashboardData();

        if (!mounted) return;

        if (indiaGeo) setIndiaGeoJson(indiaGeo);
        setAvailableStates(states);
      } catch (err) {
        console.warn("Initial data load warning:", err);
      }
    };
    loadInitial();
    return () => {
      mounted = false;
    };
  }, []);

  // Bridge the project-scoped selected state (region id) to geolens's state-name
  // flow so wetland/poultry fetching and fly-to keep working.
  // Intentionally keyed only on the selected state filter — not on
  // handleStateDropdownChange's identity (which changes when indiaGeoJson loads),
  // to avoid a spurious fly-to when the GeoJSON finishes loading.
  useEffect(() => {
    if (selectedStateRegion?.name) {
      handleStateDropdownChange(selectedStateRegion.name.toUpperCase());
    } else {
      setSelectedState("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStateRegion]);

  // Fetch filtered surveillance sites and flatten into map markers.
  useEffect(() => {
    let mounted = true;
    const fetchSurveillance = async () => {
      try {
        const diseaseIds = Array.isArray(filters.diseaseId)
          ? filters.diseaseId
          : filters.diseaseId
            ? [filters.diseaseId]
            : [];
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
        const resolvedRegionIds =
          districtIds.length > 0 ? districtIds : stateIds;
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

        const { data } = await getSiteStatByTestResultAndDiseaseApi({
          disease: diseaseIds,
          regionId: resolvedRegionIds,
          startDate: "",
          endDate: "",
          surveillanceType: "",
          siteId: siteIds,
          sampleTypeId: sampleTypeIds,
          testResult: testResults,
        });

        if (!mounted) return;

        const sites: SurveillanceSite[] = [];

        (data.siteData || [])
          .filter((s) => s.diseaseId)
          .forEach((s, i) => {
            const color =
              DISEASE_COLOR_CODE.COLOR_HEX[(s.diseaseIndex ?? i) % 6];
            (s.positiveSitesCoordinates || []).forEach((c) => {
              const lat = c.coordinates?.coordinates?.[1];
              const lng = c.coordinates?.coordinates?.[0];
              if (typeof lat === "number" && typeof lng === "number") {
                sites.push({
                  lat,
                  lng,
                  color,
                  siteName: c.siteName,
                  totalSampleCount: c.totalSampleCount,
                  totalPositiveSampleCount: c.totalPositiveSampleCount,
                  totalNegativeSampleCount: c.totalNegativeSampleCount,
                  totalUnclearSampleCount: c.totalUnclearSampleCount,
                  diseaseShortName: s.shortName,
                  farmType: c.farmType,
                });
              }
            });
          });

        (data.diseaseFreeSitesCoordinates || []).forEach((c) => {
          const lat = c.coordinates?.coordinates?.[1];
          const lng = c.coordinates?.coordinates?.[0];
          if (typeof lat === "number" && typeof lng === "number") {
            sites.push({
              lat,
              lng,
              color: "#B7BDC2",
              siteName: c.siteName,
              totalSampleCount: c.totalSampleCount,
              totalPositiveSampleCount: c.totalPositiveSampleCount,
              totalNegativeSampleCount: c.totalNegativeSampleCount,
              totalUnclearSampleCount: c.totalUnclearSampleCount,
              farmType: c.farmType,
            });
          }
        });

        setSurveillanceSites(sites);
      } catch (error) {
        console.error("Error fetching surveillance sites", error);
        if (mounted) setSurveillanceSites([]);
      }
    };
    fetchSurveillance();
    return () => {
      mounted = false;
    };
  }, [filters]);

  // Fetch wetlands and poultry farms filtered by state when selectedState, siteA, siteB, or searchPin changes
  useEffect(() => {
    let mounted = true;

    // Detect states of active sites/searchPin
    const statesToFetch = new Set<string>();
    if (selectedState) {
      statesToFetch.add(selectedState.toUpperCase());
    }

    if (indiaGeoJson) {
      if (siteA) {
        const sA = detectStateFromCoords(
          siteA.end[0],
          siteA.end[1],
          indiaGeoJson,
        );
        if (sA) statesToFetch.add(sA.toUpperCase());
      }
      if (siteB) {
        const sB = detectStateFromCoords(
          siteB.end[0],
          siteB.end[1],
          indiaGeoJson,
        );
        if (sB) statesToFetch.add(sB.toUpperCase());
      }
      if (searchPin) {
        const sP = detectStateFromCoords(
          searchPin.end[0],
          searchPin.end[1],
          indiaGeoJson,
        );
        if (sP) statesToFetch.add(sP.toUpperCase());
      }
    }

    if (statesToFetch.size === 0) {
      setAllCsvData({ wetlands: [], poultry: [] });
      return;
    }

    const fetchAllStatesData = async () => {
      try {
        const promises = Array.from(statesToFetch).map((st) =>
          getStateDashboardData(st),
        );
        const results = await Promise.all(promises);

        if (!mounted) return;

        // Merge and de-duplicate wetlands and poultry
        const allWetlands = new Map<string, Wetland>();
        const allPoultry = new Map<string, PoultryFarm>();

        results.forEach((res) => {
          if (res.wetlands) {
            res.wetlands.forEach((w) =>
              allWetlands.set(w.id || `${w.lat}_${w.lng}`, w),
            );
          }
          if (res.poultry) {
            res.poultry.forEach((p) =>
              allPoultry.set(p.id || `${p.lat}_${p.lng}`, p),
            );
          }
        });

        setAllCsvData({
          wetlands: Array.from(allWetlands.values()),
          poultry: Array.from(allPoultry.values()),
        });
      } catch (err) {
        console.warn("Error loading multi-state data:", err);
      }
    };

    fetchAllStatesData();
    return () => {
      mounted = false;
    };
  }, [selectedState, siteA, siteB, searchPin, indiaGeoJson]);

  // Load all wetlands once on mount as a global fallback for nearest-wetland calculation.
  // This ensures the nearest wetland is always shown even when the state-specific query
  // returns 0 results (e.g. states not yet in the DB).
  useEffect(() => {
    let mounted = true;
    getAllWetlands()
      .then((wetlands) => {
        if (mounted && wetlands.length > 0) setGlobalWetlandsCache(wetlands);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // When showPoultryLayer (National) is toggled ON, fetch ALL poultry farms from the backend
  useEffect(() => {
    if (!showPoultryLayer) return;

    let mounted = true;
    const fetchAll = async () => {
      setIsPoultryLoading(true);
      try {
        const allFarms =
          allPoultryCacheRef.current ?? (await getAllPoultryFarms());
        allPoultryCacheRef.current = allFarms;
        if (!mounted) return;
        setAllCsvData((prev) => {
          // Merge national farms with any state-specific data already loaded
          const merged = new Map<string, PoultryFarm>();
          prev.poultry.forEach((p) =>
            merged.set(p.id || `${p.lat}_${p.lng}`, p),
          );
          allFarms.forEach((p) => merged.set(p.id || `${p.lat}_${p.lng}`, p));
          return { ...prev, poultry: Array.from(merged.values()) };
        });
      } catch (err) {
        console.warn("Error loading all poultry farms:", err);
      } finally {
        if (mounted) setIsPoultryLoading(false);
      }
    };
    fetchAll();
    return () => {
      mounted = false;
    };
  }, [showPoultryLayer]);

  // When the Cattle markets layer is toggled ON, fetch every market once and
  // cache it - the dataset is small (~800 rows) and has no state filter in the
  // UI, so a single national fetch is cheaper than refetching per state.
  useEffect(() => {
    if (!showCattleMarketLayer) return;

    let mounted = true;
    const fetchAll = async () => {
      setIsCattleMarketLoading(true);
      try {
        const markets =
          allCattleMarketsCacheRef.current ?? (await getAllCattleMarkets());
        allCattleMarketsCacheRef.current = markets;
        if (!mounted) return;
        setAllCattleMarkets(markets);
      } catch (err) {
        console.warn("Error loading cattle markets:", err);
      } finally {
        if (mounted) setIsCattleMarketLoading(false);
      }
    };
    fetchAll();
    return () => {
      mounted = false;
    };
  }, [showCattleMarketLayer]);

  // When National Wetlands is toggled ON, fetch all wetland centroids so the
  // map still gives country-wide wetland coverage even where polygons are sparse.
  useEffect(() => {
    if (!showWetlandLayer) return;

    let mounted = true;
    const fetchAll = async () => {
      setIsWetlandLoading(true);
      try {
        const allWetlands = await getAllWetlands();
        if (!mounted) return;
        setAllCsvData((prev) => {
          const merged = new Map<string, Wetland>();
          prev.wetlands.forEach((w) =>
            merged.set(w.id || `${w.lat}_${w.lng}`, w),
          );
          allWetlands.forEach((w) =>
            merged.set(w.id || `${w.lat}_${w.lng}`, w),
          );
          return { ...prev, wetlands: Array.from(merged.values()) };
        });
      } catch (err) {
        console.warn("Error loading all wetlands:", err);
      } finally {
        if (mounted) setIsWetlandLoading(false);
      }
    };
    fetchAll();
    return () => {
      mounted = false;
    };
  }, [showWetlandLayer]);

  // Dynamically fetch water boundaries based on viewport or site buffer bounding boxes
  useEffect(() => {
    let active = true;

    // Check if we need to fetch
    const shouldFetchViewport = showWetlandLayer && viewportBounds;
    const shouldFetchBuffer =
      showBufferWetlands && (siteA || siteB || searchPin);

    if (!shouldFetchViewport && !shouldFetchBuffer) {
      setWaterBoundariesData(null);
      return;
    }

    // Debounce the fetch slightly to prevent rapid multiple fetches on zoom/pan
    const timer = setTimeout(() => {
      const fetchWaterBoundaries = async () => {
        setIsWaterLoading(true);
        try {
          if (shouldFetchViewport && viewportBounds) {
            const { minLng, minLat, maxLng, maxLat } = viewportBounds;
            const queryParams = `?minLng=${minLng}&minLat=${minLat}&maxLng=${maxLng}&maxLat=${maxLat}&zoom=${viewportZoom}`;
            const data = await getWaterBoundaries(queryParams);
            if (active && data) {
              if (data.features) {
                data.features = data.features.filter(
                  (f: CustomGeoJsonFeature) => f && f.geometry,
                );
              }
              setWaterBoundariesData(data);
            }
          } else if (shouldFetchBuffer) {
            const fetchPromises: Promise<CustomGeoJson | null>[] = [];

            if (siteA) {
              const bboxA = getBufferBounds(siteA.end[0], siteA.end[1], radius);
              const qA = `?minLng=${bboxA.minLng}&minLat=${bboxA.minLat}&maxLng=${bboxA.maxLng}&maxLat=${bboxA.maxLat}&zoom=13`;
              fetchPromises.push(getWaterBoundaries(qA));
            }
            if (siteB) {
              const bboxB = getBufferBounds(siteB.end[0], siteB.end[1], radius);
              const qB = `?minLng=${bboxB.minLng}&minLat=${bboxB.minLat}&maxLng=${bboxB.maxLng}&maxLat=${bboxB.maxLat}&zoom=13`;
              fetchPromises.push(getWaterBoundaries(qB));
            }
            if (searchPin) {
              const bboxSP = getBufferBounds(
                searchPin.end[0],
                searchPin.end[1],
                radius,
              );
              const qSP = `?minLng=${bboxSP.minLng}&minLat=${bboxSP.minLat}&maxLng=${bboxSP.maxLng}&maxLat=${bboxSP.maxLat}&zoom=13`;
              fetchPromises.push(getWaterBoundaries(qSP));
            }

            const results = await Promise.all(fetchPromises);

            if (active) {
              const mergedFeatures: CustomGeoJsonFeature[] = [];
              const seenOsmIds = new Set<string | number>();

              results.forEach((res) => {
                if (res && res.features) {
                  res.features.forEach((f: CustomGeoJsonFeature) => {
                    if (!f || !f.geometry) return;
                    const osmId = f.properties?.osm_id;
                    if (osmId !== undefined && osmId !== null) {
                      if (seenOsmIds.has(osmId)) return;
                      seenOsmIds.add(osmId);
                    }
                    mergedFeatures.push(f);
                  });
                }
              });

              setWaterBoundariesData({
                type: "FeatureCollection",
                features: mergedFeatures,
              } as CustomGeoJson);
            }
          }
        } catch (err) {
          console.warn("Error fetching water boundaries:", err);
        } finally {
          if (active) setIsWaterLoading(false);
        }
      };
      fetchWaterBoundaries();
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [
    showWetlandLayer,
    showBufferWetlands,
    siteA,
    siteB,
    searchPin,
    radius,
    viewportBounds,
    viewportZoom,
  ]);

  // Memoized filter and clip for wetlands to display only those within the circular boundary (or all if national layer is on)
  const displayWaterBoundariesData = useMemo(() => {
    if (!waterBoundariesData) return null;

    // If we have active sites or search pin, we MUST filter strictly within radius
    const hasActiveLocation = !!(siteA || siteB || searchPin);

    if (hasActiveLocation) {
      // Only filter if reference layers or national layer is enabled
      if (!showWetlandLayer && !showBufferWetlands) return null;

      const clippedFeatures: CustomGeoJsonFeature[] = [];
      (waterBoundariesData.features || []).forEach(
        (f: CustomGeoJsonFeature) => {
          // If national layer is on, we don't clip, just keep the feature
          if (showWetlandLayer) {
            clippedFeatures.push(f);
            return;
          }

          // Otherwise, clip the feature geometry to each active circular buffer
          let clippedFeat = null;
          if (siteA && isFeatureWithinRadius(f, siteA.end, radius)) {
            clippedFeat = clipFeatureToCircle(f, siteA.end, radius);
          }
          if (clippedFeat) {
            clippedFeatures.push(clippedFeat);
            return;
          }

          if (siteB && isFeatureWithinRadius(f, siteB.end, radius)) {
            clippedFeat = clipFeatureToCircle(f, siteB.end, radius);
          }
          if (clippedFeat) {
            clippedFeatures.push(clippedFeat);
            return;
          }

          if (searchPin && isFeatureWithinRadius(f, searchPin.end, radius)) {
            clippedFeat = clipFeatureToCircle(f, searchPin.end, radius);
          }
          if (clippedFeat) {
            clippedFeatures.push(clippedFeat);
          }
        },
      );

      return {
        ...waterBoundariesData,
        features: clippedFeatures,
      };
    }

    // If no active location, only show if the general national layer is enabled
    if (showWetlandLayer) {
      return waterBoundariesData;
    }

    return null;
  }, [
    waterBoundariesData,
    showWetlandLayer,
    showBufferWetlands,
    siteA,
    siteB,
    searchPin,
    radius,
  ]);

  // Use state-specific wetlands when available, fall back to global cache for nearest calculations
  const wetlandsForNearest =
    allCsvData.wetlands.length > 0 ? allCsvData.wetlands : globalWetlandsCache;

  const nearestA = useMemo(
    () =>
      siteA
        ? findNearestWetland(siteA.end[0], siteA.end[1], wetlandsForNearest)
        : null,
    [siteA, wetlandsForNearest],
  );
  const nearestB = useMemo(
    () =>
      siteB
        ? findNearestWetland(siteB.end[0], siteB.end[1], wetlandsForNearest)
        : null,
    [siteB, wetlandsForNearest],
  );

  // Unused weather, nearest farm, and wetland density state/memo variables removed to satisfy ESLint.

  const wetlandAreaA = useMemo(() => {
    if (!siteA) return 0;
    return allCsvData.wetlands
      .filter(
        (w) =>
          w.lat &&
          w.lng &&
          haversineKm(siteA.end[0], siteA.end[1], w.lat, w.lng) <= radius,
      )
      .reduce((sum, w) => sum + (w.areaHa || 0), 0);
  }, [siteA, allCsvData.wetlands, radius]);

  const wetlandAreaB = useMemo(() => {
    if (!siteB) return 0;
    return allCsvData.wetlands
      .filter(
        (w) =>
          w.lat &&
          w.lng &&
          haversineKm(siteB.end[0], siteB.end[1], w.lat, w.lng) <= radius,
      )
      .reduce((sum, w) => sum + (w.areaHa || 0), 0);
  }, [siteB, allCsvData.wetlands, radius]);

  const farmsA = useMemo(() => {
    if (!siteA) return [];
    return allCsvData.poultry.filter(
      (p) => haversineKm(p.lat, p.lng, siteA.end[0], siteA.end[1]) <= radius,
    );
  }, [siteA, allCsvData.poultry, radius]);

  const farmsB = useMemo(() => {
    if (!siteB) return [];
    return allCsvData.poultry.filter(
      (p) => haversineKm(p.lat, p.lng, siteB.end[0], siteB.end[1]) <= radius,
    );
  }, [siteB, allCsvData.poultry, radius]);

  const searchFarms = useMemo(() => {
    if (!searchPin) return [];
    return allCsvData.poultry.filter(
      (p) =>
        haversineKm(p.lat, p.lng, searchPin.end[0], searchPin.end[1]) <= radius,
    );
  }, [searchPin, allCsvData.poultry, radius]);

  const nearestSearch = useMemo(() => {
    return searchPin
      ? findNearestWetland(
          searchPin.end[0],
          searchPin.end[1],
          wetlandsForNearest,
        )
      : null;
  }, [searchPin, wetlandsForNearest]);

  const searchWetlandArea = useMemo(() => {
    if (!searchPin) return 0;
    return allCsvData.wetlands
      .filter(
        (w) =>
          w.lat &&
          w.lng &&
          haversineKm(searchPin.end[0], searchPin.end[1], w.lat, w.lng) <=
            radius,
      )
      .reduce((sum, w) => sum + (w.areaHa || 0), 0);
  }, [searchPin, allCsvData.wetlands, radius]);

  const poultryDensityA = farmsA.length;
  const poultryDensityB = farmsB.length;

  const totalBirdsA = useMemo(
    () => birdsA.reduce((sum, b) => sum + (b.howMany || 1), 0),
    [birdsA],
  );
  const totalBirdsB = useMemo(
    () => birdsB.reduce((sum, b) => sum + (b.howMany || 1), 0),
    [birdsB],
  );

  const speciesListA = useMemo(() => {
    const map = new Map<string, number>();
    birdsA.forEach((b) => {
      const count = b.howMany || 1;
      map.set(b.comName, (map.get(b.comName) || 0) + count);
    });
    const total = Array.from(map.values()).reduce((sum, v) => sum + v, 0);
    return Array.from(map.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [birdsA]);

  const speciesListB = useMemo(() => {
    const map = new Map<string, number>();
    birdsB.forEach((b) => {
      const count = b.howMany || 1;
      map.set(b.comName, (map.get(b.comName) || 0) + count);
    });
    const total = Array.from(map.values()).reduce((sum, v) => sum + v, 0);
    return Array.from(map.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [birdsB]);

  const handleSiteSelection = useCallback(
    (lat: number, lng: number, name: string) => {
      const res: Site = { end: [lat, lng], name };
      if (activeSlot === "A") setSiteA(res);
      else setSiteB(res);
      setFlyTarget({ lat, lng, zoom: 13 });

      if (indiaGeoJson) {
        const stateName = detectStateFromCoords(lat, lng, indiaGeoJson);
        if (stateName) {
          setSelectedState(stateName);
        }
      }
    },
    [activeSlot, indiaGeoJson],
  );

  const handleHeaderLocationSelection = useCallback(
    (lat: number, lng: number, name: string) => {
      const res: Site = { end: [lat, lng], name };

      if (showComparison) {
        if (activeSlot === "A") setSiteA(res);
        else setSiteB(res);
        setFlyTarget({ lat, lng, zoom: 13 });

        if (indiaGeoJson) {
          const stateName = detectStateFromCoords(lat, lng, indiaGeoJson);
          if (stateName) {
            setSelectedState(stateName);
          }
        }
      } else {
        setSearchPin(res);
        setShowComparison(false);
        setFlyTarget({ lat, lng, zoom: 13 });

        if (indiaGeoJson) {
          const stateName = detectStateFromCoords(lat, lng, indiaGeoJson);
          if (stateName) {
            setSelectedState(stateName);
          }
        }
      }
    },
    [showComparison, activeSlot, indiaGeoJson],
  );

  const handleSurveillanceSiteClick = useCallback(
    (site: SurveillanceSite) => {
      const res: Site = { end: [site.lat, site.lng], name: site.siteName };
      setSearchPin(res);
      setShowComparison(false);
      setFlyTarget({ lat: site.lat, lng: site.lng, zoom: 13 });
      if (indiaGeoJson) {
        const stateName = detectStateFromCoords(
          site.lat,
          site.lng,
          indiaGeoJson,
        );
        if (stateName) setSelectedState(stateName);
      }
    },
    [indiaGeoJson],
  );

  const fetchBirds = useCallback(
    async (
      coords: [number, number] | null,
      setBirds: React.Dispatch<React.SetStateAction<BirdObservation[]>>,
    ) => {
      if (!coords) return;
      try {
        const data = await getBirdObservations(
          coords[0],
          coords[1],
          radius,
          30,
        );
        console.log("Fetched bird data:", data);
        setBirds(Array.isArray(data) ? data : []);
      } catch {
        setBirds([]);
      }
    },
    [radius],
  );

  const fetchWeatherInfo = useCallback(
    async (
      coords: [number, number] | null,
      setWeather: React.Dispatch<React.SetStateAction<WeatherData | null>>,
    ) => {
      if (!coords) return;
      try {
        const data = await getWeatherData(coords[0], coords[1]);
        setWeather(data);
      } catch {
        setWeather(null);
      }
    },
    [],
  );

  useEffect(() => {
    fetchBirds(siteA?.end || null, setBirdsA);
  }, [siteA, radius, fetchBirds]);
  useEffect(() => {
    fetchBirds(siteB?.end || null, setBirdsB);
  }, [siteB, radius, fetchBirds]);

  useEffect(() => {
    fetchWeatherInfo(siteA?.end || null, setWeatherA);
  }, [siteA, fetchWeatherInfo]);
  useEffect(() => {
    fetchWeatherInfo(siteB?.end || null, setWeatherB);
  }, [siteB, fetchWeatherInfo]);

  useEffect(() => {
    if (searchPin) {
      fetchBirds(searchPin.end, setSearchBirds);
      fetchWeatherInfo(searchPin.end, setSearchWeather);
    } else {
      setSearchBirds([]);
      setSearchWeather(null);
    }
  }, [searchPin, fetchBirds, fetchWeatherInfo]);

  useEffect(() => {
    if (!siteA && !siteB) {
      fetchBirds([20.5937, 78.9629], setBirdsA);
      fetchWeatherInfo([20.5937, 78.9629], setWeatherA);
    }
  }, [siteA, siteB, fetchBirds, fetchWeatherInfo]);

  const resetSiteA = () => {
    setSiteA(null);
    setBirdsA([]);
    setWeatherA(null);
  };
  const resetSiteB = () => {
    setSiteB(null);
    setBirdsB([]);
    setWeatherB(null);
  };
  const resetAll = () => {
    resetSiteA();
    resetSiteB();
    setPanelSearchA("");
    setPanelSearchB("");
    setShowPoultryLayer(false);
    setShowCattleMarketLayer(false);
    setShowSurveillanceSites(false);
    setShowBuffer(false);
    setShowBufferWetlands(false);
    setShowBufferPoultry(false);
    setShowHeatmap(false);
    setRadius(15);
  };
  const closeSidebar = useCallback(() => {
    setSidebarClosing(true);
    setTimeout(() => {
      setShowSidebar(false);
      setSidebarClosing(false);
    }, 300);
  }, []);
  const openSidebar = useCallback(() => {
    setSidebarClosing(true);
    setShowSidebar(true);
    requestAnimationFrame(() => {
      setSidebarClosing(false);
    });
  }, []);

  const handleHeaderSearch = async (
    e: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if ("key" in e && e.key !== "Enter") return;
    if (!headerSearch.trim()) return;
    setIsSearching(true);
    try {
      const { OpenStreetMapProvider } = await import("leaflet-geosearch");
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: headerSearch });
      if (results && results.length > 0) {
        const r = results[0];
        handleHeaderLocationSelection(r.y, r.x, r.label);

        const stateFromLabel = detectStateFromLabel(r.label, availableStates);
        if (stateFromLabel) {
          setSelectedState(stateFromLabel);
        }
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePanelSearch = async (
    e: React.KeyboardEvent,
    slot: "A" | "B",
    query: string,
    setQuery: (val: string) => void,
  ) => {
    if (e.key !== "Enter") return;
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const { OpenStreetMapProvider } = await import("leaflet-geosearch");
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query });
      if (results && results.length > 0) {
        const r = results[0];
        const res: Site = { end: [r.y, r.x], name: r.label };
        if (slot === "A") setSiteA(res);
        else setSiteB(res);
        setFlyTarget({ lat: r.y, lng: r.x, zoom: 13 });
        setQuery("");

        if (indiaGeoJson) {
          const stateName = detectStateFromCoords(r.y, r.x, indiaGeoJson);
          if (stateName) setSelectedState(stateName);
        } else {
          const stateFromLabel = detectStateFromLabel(r.label, availableStates);
          if (stateFromLabel) setSelectedState(stateFromLabel);
        }
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const memoizedWetlandOptions = useMemo(() => {
    return allCsvData.wetlands
      .filter((w) => !selectedState || w.state === selectedState)
      .slice(0, 500)
      .map((w) => ({ label: w.name, value: w.id }));
  }, [allCsvData.wetlands, selectedState]);

  // filteredGeoJson removed in favor of direct dynamic backend-filtered waterBoundariesData

  const downloadComparisonReport = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.text("Site Comparison Report", 14, 22);

      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      const head = [["Metric", "Site A", "Site B"]];
      const countBirds = (birds: BirdObservation[]) =>
        birds.reduce((sum, b) => sum + (b.howMany || 1), 0);

      const pCountA = siteA
        ? allCsvData.poultry.filter(
            (p) =>
              haversineKm(p.lat, p.lng, siteA.end[0], siteA.end[1]) <= radius,
          ).length
        : 0;
      const pCountB = siteB
        ? allCsvData.poultry.filter(
            (p) =>
              haversineKm(p.lat, p.lng, siteB.end[0], siteB.end[1]) <= radius,
          ).length
        : 0;
      const wDistA = siteA
        ? findNearestWetland(
            siteA.end[0],
            siteA.end[1],
            allCsvData.wetlands,
          )?.distKm.toFixed(1) || "N/A"
        : "N/A";
      const wDistB = siteB
        ? findNearestWetland(
            siteB.end[0],
            siteB.end[1],
            allCsvData.wetlands,
          )?.distKm.toFixed(1) || "N/A"
        : "N/A";
      const wAreaA = siteA
        ? allCsvData.wetlands
            .filter(
              (w) =>
                w.lat &&
                w.lng &&
                haversineKm(siteA.end[0], siteA.end[1], w.lat, w.lng) <= radius,
            )
            .reduce((sum, w) => sum + (w.areaHa || 0), 0)
        : 0;
      const wAreaB = siteB
        ? allCsvData.wetlands
            .filter(
              (w) =>
                w.lat &&
                w.lng &&
                haversineKm(siteB.end[0], siteB.end[1], w.lat, w.lng) <= radius,
            )
            .reduce((sum, w) => sum + (w.areaHa || 0), 0)
        : 0;

      const tempA = weatherA
        ? `${weatherA.temp}°C (${weatherA.description})`
        : "N/A";
      const tempB = weatherB
        ? `${weatherB.temp}°C (${weatherB.description})`
        : "N/A";
      const humA = weatherA ? `${weatherA.humidity}%` : "N/A";
      const humB = weatherB ? `${weatherB.humidity}%` : "N/A";
      const windA = weatherA ? `${weatherA.windSpeed} m/s` : "N/A";
      const windB = weatherB ? `${weatherB.windSpeed} m/s` : "N/A";

      const body = [
        ["Name", siteA?.name || "N/A", siteB?.name || "N/A"],
        [
          "Bird Density",
          siteA
            ? birdsA.length > 50
              ? "High"
              : birdsA.length > 10
                ? "Med"
                : "Low"
            : "N/A",
          siteB
            ? birdsB.length > 50
              ? "High"
              : birdsB.length > 10
                ? "Med"
                : "Low"
            : "N/A",
        ],
        [
          "Species Count",
          siteA ? new Set(birdsA.map((b) => b.comName)).size.toString() : "0",
          siteB ? new Set(birdsB.map((b) => b.comName)).size.toString() : "0",
        ],
        [
          "Total Bird Count",
          siteA ? countBirds(birdsA).toString() : "0",
          siteB ? countBirds(birdsB).toString() : "0",
        ],
        ["Nearest Wetland", `${wDistA} km`, `${wDistB} km`],
        [
          `Total Wetland Area (${radius}km)`,
          siteA ? `${wAreaA.toFixed(1)} Ha` : "0.0 Ha",
          siteB ? `${wAreaB.toFixed(1)} Ha` : "0.0 Ha",
        ],
        [`Poultry Farms (${radius}km)`, pCountA.toString(), pCountB.toString()],
        ["Temperature", tempA, tempB],
        ["Humidity", humA, humB],
        ["Wind Speed", windA, windB],
      ];

      autoTable(doc, {
        startY: 40,
        head: head,
        body: body,
        theme: "striped",
        headStyles: { fillColor: [52, 152, 219] },
      });

      // Page 2: Birds breakdown
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Bird Species Breakdown", 14, 20);

      const birdsHead = [["Site A Birds", "Site B Birds"]];
      const mapA = new Map<string, number>();
      birdsA.forEach((b) =>
        mapA.set(b.comName, (mapA.get(b.comName) || 0) + (b.howMany || 1)),
      );
      const sortedA = Array.from(mapA.entries()).sort((a, b) => b[1] - a[1]);

      const mapB = new Map<string, number>();
      birdsB.forEach((b) =>
        mapB.set(b.comName, (mapB.get(b.comName) || 0) + (b.howMany || 1)),
      );
      const sortedB = Array.from(mapB.entries()).sort((a, b) => b[1] - a[1]);

      const maxLen = Math.max(sortedA.length, sortedB.length);
      const birdsBody = [];
      for (let i = 0; i < maxLen; i++) {
        const itemA = sortedA[i] ? `${sortedA[i][0]} (${sortedA[i][1]})` : "";
        const itemB = sortedB[i] ? `${sortedB[i][0]} (${sortedB[i][1]})` : "";
        birdsBody.push([itemA, itemB]);
      }

      autoTable(doc, {
        startY: 25,
        head: birdsHead,
        body: birdsBody,
        theme: "grid",
        headStyles: { fillColor: [52, 152, 219] },
      });

      // Page 3: Poultry farms breakdown
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Poultry Farms Breakdown", 14, 20);

      const farmsHead = [["Site A Poultry Farms", "Site B Poultry Farms"]];
      const activeFarmsA = siteA
        ? allCsvData.poultry.filter(
            (p) =>
              haversineKm(p.lat, p.lng, siteA.end[0], siteA.end[1]) <= radius,
          )
        : [];
      const activeFarmsB = siteB
        ? allCsvData.poultry.filter(
            (p) =>
              haversineKm(p.lat, p.lng, siteB.end[0], siteB.end[1]) <= radius,
          )
        : [];

      const maxFarmsLen = Math.max(activeFarmsA.length, activeFarmsB.length);
      const farmsBody = [];
      for (let i = 0; i < maxFarmsLen; i++) {
        const itemA = activeFarmsA[i] ? activeFarmsA[i].name : "";
        const itemB = activeFarmsB[i] ? activeFarmsB[i].name : "";
        farmsBody.push([itemA, itemB]);
      }

      autoTable(doc, {
        startY: 25,
        head: farmsHead,
        body: farmsBody,
        theme: "grid",
        headStyles: { fillColor: [52, 152, 219] },
      });

      doc.save("comparison_report.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF report.");
    }
  };

  // Close filters panel on click outside
  useEffect(() => {
    if (!showFilters) return;
    const timer = setTimeout(() => {
      const handleMouseDown = (e: MouseEvent) => {
        if (
          filtersPanelRef.current &&
          !filtersPanelRef.current.contains(e.target as Node) &&
          filtersButtonRef.current &&
          !filtersButtonRef.current.contains(e.target as Node)
        ) {
          setShowFilters(false);
        }
      };
      document.addEventListener("mousedown", handleMouseDown);
      return () => document.removeEventListener("mousedown", handleMouseDown);
    }, 0);
    return () => clearTimeout(timer);
  }, [showFilters, setShowFilters]);

  const mapReady = !!(
    leafletReady &&
    leafletRef.current &&
    leafletRef.current.MapContainer
  );

  return (
    <div className="dashboard-layout">
      <DashboardHeader
        headerSearch={headerSearch}
        setHeaderSearch={setHeaderSearch}
        isSearching={isSearching}
        handleHeaderSearch={handleHeaderSearch}
        showComparison={showComparison}
        setShowComparison={setShowComparison}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeFilterCount={activeFilterCount}
        filtersButtonRef={filtersButtonRef}
      />

      <div ref={filtersPanelRef}>
        <SurveillanceFilters
          resetKey={resetKey}
          show={showFilters}
          filters={filters}
          handleFilterChange={handleFilterChange}
          resetFilters={resetFilters}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          showProjectSelector={showProjectSelector}
          projectOptions={projectOptions}
          stateOptions={stateOptions}
          districtOptions={districtOptions}
          diseaseOptions={diseaseOptions}
          siteOptions={siteOptions}
          sampleTypeOptions={sampleTypeOptions}
          selectedWetland={selectedWetland}
          setSelectedWetland={setSelectedWetland}
          wetlandOptions={memoizedWetlandOptions}
          wetlands={allCsvData.wetlands}
          handleSiteSelection={handleHeaderLocationSelection}
        />
      </div>

      <main className="dashboard-main">
        {(showSidebar || sidebarClosing) && (
          <DashboardSidebar
            activeBaseMap={activeBaseMap}
            setActiveBaseMap={setActiveBaseMap}
            showPoultryLayer={showPoultryLayer}
            setShowPoultryLayer={setShowPoultryLayer}
            showCattleMarketLayer={showCattleMarketLayer}
            setShowCattleMarketLayer={setShowCattleMarketLayer}
            isPoultryLoading={isPoultryLoading}
            isCattleMarketLoading={isCattleMarketLoading}
            showBuffer={showBuffer}
            setShowBuffer={setShowBuffer}
            radius={radius}
            setRadius={setRadius}
            showBufferWetlands={showBufferWetlands}
            setShowBufferWetlands={setShowBufferWetlands}
            showBufferPoultry={showBufferPoultry}
            setShowBufferPoultry={setShowBufferPoultry}
            showHeatmap={showHeatmap}
            setShowHeatmap={setShowHeatmap}
            resetAll={resetAll}
            setShowSidebar={closeSidebar}
            showSurveillanceSites={showSurveillanceSites}
            setShowSurveillanceSites={setShowSurveillanceSites}
            closed={sidebarClosing}
          />
        )}

        {!showSidebar && !sidebarClosing && (
          <button
            type="button"
            aria-label="Open sidebar"
            onClick={openSidebar}
            className="absolute left-4 top-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-md transition-colors hover:border-blue-300 hover:text-blue-600"
          >
            <Menu size={19} />
          </button>
        )}

        <DashboardMap
          mapReady={mapReady}
          leafletRef={leafletRef}
          activeBaseMap={activeBaseMap}
          showBirdsLayer={showBirdsLayer}
          showWetlandLayer={showWetlandLayer}
          showBufferWetlands={showBufferWetlands}
          showPoultryLayer={showPoultryLayer}
          showBufferPoultry={showBufferPoultry}
          showCattleMarketLayer={showCattleMarketLayer}
          showHeatmap={showHeatmap}
          showBuffer={showBuffer}
          viewportZoom={viewportZoom}
          setViewportZoom={updateViewportZoom}
          setViewportBounds={updateViewportBounds}
          isWaterLoading={isWaterLoading}
          loadingLayerLabels={[
            ...(isWetlandLoading ? ["wetlands"] : []),
            ...(isPoultryLoading ? ["poultry farms"] : []),
            ...(isCattleMarketLoading ? ["cattle markets"] : []),
          ]}
          indiaGeoJson={indiaGeoJson}
          waterBoundariesData={displayWaterBoundariesData}
          flyTarget={flyTarget}
          handleSiteSelection={handleSiteSelection}
          allPoultry={allCsvData.poultry}
          allCattleMarkets={allCattleMarkets}
          birdsA={birdsA}
          birdsB={birdsB}
          siteA={siteA}
          siteB={siteB}
          searchPin={searchPin}
          radius={radius}
          selectedState={selectedState}
          iconA={iconA}
          iconB={iconB}
          searchIcon={searchIcon}
          searchBirds={searchBirds}
          showSurveillanceSites={showSurveillanceSites}
          surveillanceSites={surveillanceSites}
          onSurveillanceSiteClick={handleSurveillanceSiteClick}
        />

        {showComparison && (
          <SiteComparisonPanel
            activeSlot={activeSlot}
            setActiveSlot={setActiveSlot}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            siteA={siteA}
            siteB={siteB}
            birdsA={birdsA}
            birdsB={birdsB}
            weatherA={weatherA}
            weatherB={weatherB}
            panelSearchA={panelSearchA}
            panelSearchB={panelSearchB}
            setPanelSearchA={setPanelSearchA}
            setPanelSearchB={setPanelSearchB}
            handlePanelSearch={handlePanelSearch}
            resetAll={resetAll}
            setShowComparison={setShowComparison}
            nearestA={nearestA}
            nearestB={nearestB}
            wetlandAreaA={wetlandAreaA}
            wetlandAreaB={wetlandAreaB}
            poultryDensityA={poultryDensityA}
            poultryDensityB={poultryDensityB}
            totalBirdsA={totalBirdsA}
            totalBirdsB={totalBirdsB}
            speciesListA={speciesListA}
            speciesListB={speciesListB}
            farmsA={farmsA}
            farmsB={farmsB}
            radius={radius}
            downloadComparisonReport={downloadComparisonReport}
          />
        )}

        {searchPin && (
          <TemporaryLocationPanel
            searchPin={searchPin}
            searchWeather={searchWeather}
            searchBirds={searchBirds}
            searchFarms={searchFarms}
            nearestWetland={nearestSearch}
            searchWetlandArea={searchWetlandArea}
            radius={radius}
            onClose={() => setSearchPin(null)}
            onAssignToSite={(slot) => {
              if (slot === "A") {
                setSiteA(searchPin);
              } else {
                setSiteB(searchPin);
              }
              setSearchPin(null);
              setShowComparison(true);
            }}
          />
        )}
      </main>
    </div>
  );
}

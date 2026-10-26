import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import type React from "react";
import type * as Leaflet from "leaflet";
import type {
  BirdObservation,
  CattleMarket,
  CustomGeoJson,
  LeafletRefType,
  PoultryFarm,
  Site,
  SurveillanceSite,
  ViewportBounds,
} from "@/src/app/(dashboard)/geolens/types";
import { haversineKm } from "@/src/app/(dashboard)/geolens/utils/geo";

// Nested-circle marker: outer ring = disease colour (grey for disease-free),
// yellow ring if any negatives, red core if any positives. Sized by sample count.
const makeSurveillanceIcon = (L: typeof Leaflet, site: SurveillanceSite) => {
  const total = site.totalSampleCount || 0;
  const neg = site.totalNegativeSampleCount || 0;
  const pos = site.totalPositiveSampleCount || 0;

  const minSize = 10;
  const maxSize = 24;
  const size = Math.min(
    Math.max(minSize + Math.log(total + 1) * 8, minSize),
    maxSize,
  );
  const yellowSize = size * 0.7;
  const redSize = size * 0.4;

  let html = `<div style="position:relative;border-radius:9999px;background:${site.color};border:1.5px solid rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;box-shadow:0 1px 3px rgba(0,0,0,0.3)">`;
  if (neg > 0) {
    html += `<div style="border-radius:9999px;background:#facc15;border:1px solid #eab308;display:flex;align-items:center;justify-content:center;width:${yellowSize}px;height:${yellowSize}px">`;
  }
  if (pos > 0) {
    html += `<div style="border-radius:9999px;background:#dc2626;border:1px solid #b91c1c;width:${redSize}px;height:${redSize}px"></div>`;
    if (neg > 0) html += `</div>`;
  } else if (neg > 0) {
    html += `</div>`;
  }
  html += `</div>`;

  return L.divIcon({
    className: "geolens-surveillance-marker",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

function ViewportTracker({
  useMapEvents,
  onViewportChange,
}: {
  useMapEvents: (handlers: {
    moveend: () => void;
    zoomend: () => void;
  }) => Leaflet.Map;
  onViewportChange: (bounds: Leaflet.LatLngBounds, zoom: number) => void;
}) {
  const handlerRef = useRef(onViewportChange);

  useEffect(() => {
    handlerRef.current = onViewportChange;
  });

  const map = useMapEvents({
    moveend() {
      handlerRef.current(map.getBounds(), map.getZoom());
    },
    zoomend() {
      handlerRef.current(map.getBounds(), map.getZoom());
    },
  });

  useEffect(() => {
    handlerRef.current(map.getBounds(), map.getZoom());
  }, [map]);

  return null;
}

function RecenterControl({
  L,
  useMap,
}: {
  L: typeof Leaflet;
  useMap: () => Leaflet.Map;
}) {
  const map = useMap();

  useEffect(() => {
    const control = new L.Control({ position: "topright" });

    control.onAdd = () => {
      const container = L.DomUtil.create(
        "div",
        "leaflet-control dashboard-recenter-control",
      );
      const button = L.DomUtil.create("button", "", container);
      button.type = "button";
      button.title = "Recenter map";
      button.setAttribute("aria-label", "Recenter map");
      button.innerText = "⌖";

      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.on(button, "click", (event) => {
        L.DomEvent.preventDefault(event);
        map.setView([20.59, 78.96], 5, { animate: true });
      });

      return container;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [L, map]);

  return null;
}

function FitBoundsComponent({
  L,
  useMap,
  siteA,
  siteB,
  searchPin,
}: {
  L: typeof Leaflet;
  useMap: () => Leaflet.Map;
  siteA: Site | null;
  siteB: Site | null;
  searchPin?: Site | null;
}) {
  const map = useMap();
  const lastCoordsRef = useRef<string>("");

  useEffect(() => {
    const points = [];
    if (siteA) points.push(siteA.end);
    if (siteB) points.push(siteB.end);
    if (searchPin) points.push(searchPin.end);

    const coordsKey = points.map((p) => p.join(",")).join("|");
    if (coordsKey === lastCoordsRef.current) return;
    lastCoordsRef.current = coordsKey;

    if (points.length >= 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [map, L, siteA, siteB, searchPin]);

  return null;
}

function createClusterIcon(
  L: typeof Leaflet,
  color: string,
  borderColor: string,
  count: number,
  emoji?: string,
) {
  // `emoji` keeps a clustered bubble readable as the same thing as the
  // individual markers it collapses (see createEmojiIcon), rather than a
  // bare number whose meaning depends on remembering the colour.
  const label = emoji
    ? `<span style="font-size: 14px;">${emoji}</span>${count}`
    : `${count}`;
  return L.divIcon({
    html: `<div style="background-color: ${color}; color: white; border: 2px solid ${borderColor}; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; gap: 2px; font-weight: bold; font-family: sans-serif; box-shadow: 0 2px 5px rgba(0,0,0,0.4); font-size: 13px;">${label}</div>`,
    className: "custom-marker-cluster",
    iconSize: L.point(40, 40, true),
  });
}

/**
 * A map pin drawn as an emoji instead of a coloured dot - a cow for cattle
 * markets, a chicken for poultry farms - so a marker says what it is without
 * a trip to the legend.
 *
 * One icon instance is shared by every marker in a layer (Leaflet allows
 * that), so a 30k-farm layer adds one object, not 30k. Passing `className`
 * replaces Leaflet's default `leaflet-div-icon`, which would otherwise draw a
 * white box behind each glyph. The drop shadow keeps the glyph legible over
 * pale terrain, and the anchor centres it on the coordinate exactly as the
 * circle markers were centred.
 */
const EMOJI_MARKER_FONT_PX = 24;
// The box is a little larger than the glyph so descenders and the drop shadow
// aren't clipped; the anchor is its centre, putting the glyph on the
// coordinate exactly as the circle markers used to sit.
const EMOJI_MARKER_BOX_PX = 30;

function createEmojiIcon(L: typeof Leaflet, emoji: string, label: string) {
  return L.divIcon({
    html: `<div role="img" aria-label="${label}" style="font-size: ${EMOJI_MARKER_FONT_PX}px; line-height: ${EMOJI_MARKER_BOX_PX}px; width: ${EMOJI_MARKER_BOX_PX}px; height: ${EMOJI_MARKER_BOX_PX}px; text-align: center; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.45));">${emoji}</div>`,
    className: "geolens-emoji-marker",
    iconSize: L.point(EMOJI_MARKER_BOX_PX, EMOJI_MARKER_BOX_PX, true),
    iconAnchor: L.point(EMOJI_MARKER_BOX_PX / 2, EMOJI_MARKER_BOX_PX / 2),
  });
}

function NativePoultryClusterLayer({
  L,
  useMap,
  farms,
  handleSiteSelection,
}: {
  L: typeof Leaflet;
  useMap: () => Leaflet.Map;
  farms: PoultryFarm[];
  handleSiteSelection: (lat: number, lng: number, name: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!farms.length) return;

    const markerClusterFactory = (
      L as unknown as {
        markerClusterGroup?: (
          options: Record<string, unknown>,
        ) => Leaflet.LayerGroup & {
          addLayers?: (layers: Leaflet.Layer[]) => void;
        };
      }
    ).markerClusterGroup;

    if (!markerClusterFactory) {
      console.warn("Leaflet markercluster plugin is not available.");
      return;
    }

    const clusterGroup = markerClusterFactory({
      chunkedLoading: true,
      chunkInterval: 100,
      chunkDelay: 10,
      maxClusterRadius: 60,
      disableClusteringAtZoom: 10,
      iconCreateFunction: (cluster: { getChildCount: () => number }) =>
        createClusterIcon(
          L,
          "#9b59b6",
          "#8e44ad",
          cluster.getChildCount(),
          "🐔",
        ),
    });

    const icon = createEmojiIcon(L, "🐔", "Poultry farm");
    const markers = farms
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .map((p) => {
        const marker = L.marker([p.lat, p.lng], { icon });

        marker.bindTooltip(
          `
          <div style="font-family: 'Inter', sans-serif; font-size: 11px; padding: 4px 6px; min-width: 140px;">
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 3px;">
              <span style="color: #9b59b6; font-size: 13px;">Farm</span>
              <strong style="color: #2c3e50;">${p.name}</strong>
            </div>
            ${p.district && p.state ? `<div style="color: #7f8c8d; font-size: 10px;">${p.district}, ${p.state}</div>` : ""}
            <div style="color: #bdc3c7; font-size: 9px; margin-top: 2px;">${p.lat.toFixed(4)}N, ${p.lng.toFixed(4)}E</div>
          </div>
        `,
          { sticky: true },
        );

        marker.on("click", () =>
          handleSiteSelection(p.lat, p.lng, `[Farm] ${p.name}`),
        );
        return marker;
      });

    if (clusterGroup.addLayers) {
      clusterGroup.addLayers(markers);
    } else {
      markers.forEach((marker) => clusterGroup.addLayer(marker));
    }
    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [L, farms, handleSiteSelection, map]);

  return null;
}

function NativeCattleMarketClusterLayer({
  L,
  useMap,
  markets,
  handleSiteSelection,
}: {
  L: typeof Leaflet;
  useMap: () => Leaflet.Map;
  markets: CattleMarket[];
  handleSiteSelection: (lat: number, lng: number, name: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!markets.length) return;

    const markerClusterFactory = (
      L as unknown as {
        markerClusterGroup?: (
          options: Record<string, unknown>,
        ) => Leaflet.LayerGroup & {
          addLayers?: (layers: Leaflet.Layer[]) => void;
        };
      }
    ).markerClusterGroup;

    if (!markerClusterFactory) {
      console.warn("Leaflet markercluster plugin is not available.");
      return;
    }

    const clusterGroup = markerClusterFactory({
      chunkedLoading: true,
      chunkInterval: 100,
      chunkDelay: 10,
      maxClusterRadius: 60,
      disableClusteringAtZoom: 10,
      iconCreateFunction: (cluster: { getChildCount: () => number }) =>
        createClusterIcon(
          L,
          "#e67e22",
          "#d35400",
          cluster.getChildCount(),
          "🐄",
        ),
    });

    const icon = createEmojiIcon(L, "🐄", "Cattle market");
    const markerLayers = markets
      .filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng))
      .map((m) => {
        const marker = L.marker([m.lat, m.lng], { icon });

        marker.bindTooltip(
          `
          <div style="font-family: 'Inter', sans-serif; font-size: 11px; padding: 4px 6px; min-width: 140px;">
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 3px;">
              <span style="color: #e67e22; font-size: 13px;">Market</span>
              <strong style="color: #2c3e50;">${m.name}</strong>
            </div>
            ${m.district && m.state ? `<div style="color: #7f8c8d; font-size: 10px;">${m.district}, ${m.state}</div>` : ""}
            ${m.operatingDay ? `<div style="color: #7f8c8d; font-size: 10px;">Operates: ${m.operatingDay}</div>` : ""}
            <div style="color: #bdc3c7; font-size: 9px; margin-top: 2px;">${m.lat.toFixed(4)}N, ${m.lng.toFixed(4)}E</div>
          </div>
        `,
          { sticky: true },
        );

        marker.on("click", () =>
          handleSiteSelection(m.lat, m.lng, `[Market] ${m.name}`),
        );
        return marker;
      });

    if (clusterGroup.addLayers) {
      clusterGroup.addLayers(markerLayers);
    } else {
      markerLayers.forEach((marker) => clusterGroup.addLayer(marker));
    }
    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [L, markets, handleSiteSelection, map]);

  return null;
}

function NativeSurveillanceClusterLayer({
  L,
  useMap,
  sites,
  onSurveillanceSiteClick,
}: {
  L: typeof Leaflet;
  useMap: () => Leaflet.Map;
  sites: SurveillanceSite[];
  onSurveillanceSiteClick?: (site: SurveillanceSite) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!sites.length) return;

    const markerClusterFactory = (
      L as unknown as {
        markerClusterGroup?: (
          options: Record<string, unknown>,
        ) => Leaflet.LayerGroup & {
          addLayers?: (layers: Leaflet.Layer[]) => void;
        };
      }
    ).markerClusterGroup;

    if (!markerClusterFactory) {
      console.warn("Leaflet markercluster plugin is not available.");
      return;
    }

    const clusterGroup = markerClusterFactory({
      chunkedLoading: true,
      chunkInterval: 100,
      chunkDelay: 10,
      maxClusterRadius: 50,
      disableClusteringAtZoom: 11,
      iconCreateFunction: (cluster: { getChildCount: () => number }) =>
        createClusterIcon(L, "#0f766e", "#115e59", cluster.getChildCount()),
    });

    const markers = sites
      .filter((site) => Number.isFinite(site.lat) && Number.isFinite(site.lng))
      .map((site) => {
        const marker = L.marker([site.lat, site.lng], {
          icon: makeSurveillanceIcon(L, site),
        });

        marker.bindTooltip(
          `
          <div style="font-family: 'Inter', sans-serif; font-size: 11px; padding: 4px 6px; min-width: 160px;">
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 4px; border-bottom: 1px solid #ecf0f1; padding-bottom: 3px;">
              <strong style="color: #2c3e50;">${site.siteName}</strong>
            </div>
            ${(site.totalPositiveSampleCount || 0) > 0 ? `<div style="color: #e74c3c; font-size: 10px;">Positive: <strong>${site.totalPositiveSampleCount}</strong></div>` : ""}
            ${(site.totalNegativeSampleCount || 0) > 0 ? `<div style="color: #f39c12; font-size: 10px;">Negative: <strong>${site.totalNegativeSampleCount}</strong></div>` : ""}
            ${(site.totalUnclearSampleCount || 0) > 0 ? `<div style="color: #95a5a6; font-size: 10px;">Inconclusive: <strong>${site.totalUnclearSampleCount}</strong></div>` : ""}
            ${site.diseaseShortName ? `<div style="color: #bdc3c7; font-size: 9px; margin-top: 2px;">${site.diseaseShortName}</div>` : ""}
          </div>
        `,
          { direction: "top", offset: [0, -10], sticky: true },
        );

        marker.on("click", () => onSurveillanceSiteClick?.(site));
        return marker;
      });

    if (clusterGroup.addLayers) {
      clusterGroup.addLayers(markers);
    } else {
      markers.forEach((marker) => clusterGroup.addLayer(marker));
    }
    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [L, map, onSurveillanceSiteClick, sites]);

  return null;
}

interface DashboardMapProps {
  mapReady: boolean | null;
  leafletRef: React.MutableRefObject<LeafletRefType | null>;
  activeBaseMap: string;
  showBirdsLayer: boolean;
  showWetlandLayer: boolean;
  showBufferWetlands: boolean;
  showPoultryLayer: boolean;
  showBufferPoultry: boolean;
  showCattleMarketLayer: boolean;
  showHeatmap: boolean;
  showBuffer: boolean;
  viewportZoom: number;
  setViewportZoom: (zoom: number) => void;
  setViewportBounds: (bounds: ViewportBounds) => void;
  isWaterLoading: boolean;
  /** Human-readable names of the layers currently being fetched, e.g.
   *  ["cattle markets"]. Rendered in the map's loading chip. */
  loadingLayerLabels?: string[];
  indiaGeoJson: CustomGeoJson | null;
  waterBoundariesData: CustomGeoJson | null;
  flyTarget: { lat: number; lng: number; zoom: number } | null;
  handleSiteSelection: (lat: number, lng: number, name: string) => void;
  allPoultry: PoultryFarm[];
  allCattleMarkets: CattleMarket[];
  birdsA: BirdObservation[];
  birdsB: BirdObservation[];
  siteA: Site | null;
  siteB: Site | null;
  searchPin?: Site | null;
  searchBirds?: BirdObservation[];
  radius: number;
  selectedState: string;
  iconA: Leaflet.DivIcon | null;
  iconB: Leaflet.DivIcon | null;
  searchIcon?: Leaflet.DivIcon | null;
  surveillanceSites?: SurveillanceSite[];
  showSurveillanceSites?: boolean;
  onSurveillanceSiteClick?: (site: SurveillanceSite) => void;
}

export function DashboardMap(props: DashboardMapProps) {
  const {
    mapReady,
    leafletRef,
    activeBaseMap,
    showBirdsLayer,
    showWetlandLayer,
    showBufferWetlands,
    showPoultryLayer,
    showBufferPoultry,
    showCattleMarketLayer,
    showHeatmap,
    showBuffer,
    // viewportZoom, removed to satisfy ESLint
    setViewportZoom,
    setViewportBounds,
    isWaterLoading,
    loadingLayerLabels = [],
    indiaGeoJson,
    waterBoundariesData,
    flyTarget,
    handleSiteSelection,
    allPoultry,
    allCattleMarkets,
    birdsA,
    birdsB,
    siteA,
    siteB,
    searchPin,
    searchBirds,
    radius,
    selectedState,
    iconA,
    iconB,
    searchIcon,
    surveillanceSites = [],
    showSurveillanceSites = false,
    onSurveillanceSiteClick,
  } = props;

  // Memoize filtered poultry farms to prevent expensive haversine calculation on every render
  const filteredPoultry = useMemo(() => {
    return allPoultry.filter((p) => {
      if (showPoultryLayer) return true;
      if (showBufferPoultry && (siteA || siteB || searchPin)) {
        const distA = siteA
          ? haversineKm(p.lat, p.lng, siteA.end[0], siteA.end[1])
          : Infinity;
        const distB = siteB
          ? haversineKm(p.lat, p.lng, siteB.end[0], siteB.end[1])
          : Infinity;
        const distSearch = searchPin
          ? haversineKm(p.lat, p.lng, searchPin.end[0], searchPin.end[1])
          : Infinity;
        return distA <= radius || distB <= radius || distSearch <= radius;
      }
      return false;
    });
  }, [
    allPoultry,
    showPoultryLayer,
    showBufferPoultry,
    siteA,
    siteB,
    searchPin,
    radius,
  ]);

  // Memoize valid birds observations to prevent double filter/map execution on every render
  const validBirdsList = useMemo(() => {
    return [...birdsA, ...birdsB, ...(searchBirds || [])].filter(
      (b) =>
        b &&
        typeof b.lat === "number" &&
        typeof b.lng === "number" &&
        !isNaN(b.lat) &&
        !isNaN(b.lng),
    );
  }, [birdsA, birdsB, searchBirds]);

  // Memoize mapped heatmap coordinates
  const heatmapPoints = useMemo(() => {
    return validBirdsList.map((b) => ({
      lat: b.lat,
      lng: b.lng,
      intensity: Math.min((b.howMany || 1) * 0.1, 1),
    }));
  }, [validBirdsList]);

  return (
    <section className="map-viewport" style={{ position: "relative" }}>
      {(isWaterLoading || loadingLayerLabels.length > 0) && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            background: "rgba(44, 62, 80, 0.95)",
            color: "white",
            padding: "8px 15px",
            borderRadius: "6px",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          }}
        >
          <RefreshCw
            size={12}
            className="animate-spin"
            style={{ color: "#3498db" }}
          />
          <span>
            Loading{" "}
            {[...(isWaterLoading ? ["boundaries"] : []), ...loadingLayerLabels]
              .join(", ")
              .replace(/, ([^,]*)$/, " and $1")}
            ...
          </span>
        </div>
      )}

      {!mapReady && (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f0f0f0",
            color: "#7f8c8d",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <RefreshCw
              className="animate-spin"
              size={24}
              style={{ marginBottom: "10px" }}
            />
            <p>Initializing Map System...</p>
          </div>
        </div>
      )}

      {mapReady &&
        (() => {
          const {
            MapContainer,
            TileLayer,
            ZoomControl,
            GeoJSON,
            Marker,
            Circle,
            CircleMarker,
            Tooltip,
            MapClickHandler,
            FlyToLocation,
            HeatmapLayer,
            SearchBar,
            MarkerClusterGroup,
            L,
            useMap,
            useMapEvents,
          } = leafletRef.current!;

          return (
            <MapContainer
              center={[20.59, 78.96]}
              zoom={5}
              zoomControl={false}
              preferCanvas
              style={{ height: "100%", width: "100%" }}
            >
              <ZoomControl position="topright" />
              <RecenterControl L={L} useMap={useMap} />
              {activeBaseMap === "satellite" && (
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                />
              )}
              {activeBaseMap === "osm" && (
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              )}
              {activeBaseMap === "light" && (
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
              )}
              {activeBaseMap === "topo" && (
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
                />
              )}

              {indiaGeoJson && (
                <GeoJSON
                  key="india-state-borders"
                  data={indiaGeoJson}
                  // SimpleMaps state outlines, CC BY 4.0 (see DATA_SOURCES.md)
                  attribution='State boundaries: <a href="https://simplemaps.com">simplemaps.com</a>'
                  style={{ color: "#2c3e50", weight: 1.5, fillOpacity: 0 }}
                  interactive={false}
                />
              )}

              <FlyToLocation target={flyTarget} />
              <FitBoundsComponent
                L={L}
                useMap={useMap}
                siteA={siteA}
                siteB={siteB}
                searchPin={searchPin}
              />
              <MapClickHandler
                onClick={(lat: number, lng: number) =>
                  handleSiteSelection(lat, lng, "Custom Location")
                }
              />

              {(showWetlandLayer || showBufferWetlands) &&
                waterBoundariesData && (
                  <GeoJSON
                    key={`wetlands-${siteA?.name}-${siteB?.name}-${radius}-${selectedState}-${showWetlandLayer}-${showBufferWetlands}-${waterBoundariesData.features?.length || 0}`}
                    data={waterBoundariesData}
                    // The outlines are OpenStreetMap data (ODbL), which must be
                    // credited whichever base map is showing.
                    attribution='Water and wetland outlines &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    style={{
                      color: "#2980b9",
                      weight: 2,
                      opacity: 0.8,
                      fillColor: "#3498db",
                      fillOpacity: 0.3,
                    }}
                    interactive={true}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onEachFeature={(feature: any, layer: any) => {
                      const name = feature.properties?.name;
                      const fclass = feature.properties?.fclass || "";
                      const osmId = feature.properties?.osm_id || "";
                      const area = feature.properties?.areaHa
                        ? `${feature.properties.areaHa.toFixed(1)} Ha`
                        : "";
                      const displayName =
                        name ||
                        (fclass
                          ? fclass.charAt(0).toUpperCase() + fclass.slice(1)
                          : "Water Body");
                      const tooltipContent = `
                    <div style="font-family: 'Inter', sans-serif; font-size: 11px; padding: 4px 6px; min-width: 120px;">
                      <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 3px;">
                        <span style="color: #3498db; font-size: 13px;">💧</span>
                        <strong style="color: #2c3e50;">${displayName}</strong>
                      </div>
                      ${fclass ? `<div style="color: #7f8c8d; font-size: 10px;">Type: ${fclass}</div>` : ""}
                      ${area ? `<div style="color: #7f8c8d; font-size: 10px;">Area: ${area}</div>` : ""}
                      ${osmId ? `<div style="color: #bdc3c7; font-size: 9px; margin-top: 2px;">OSM ID: ${osmId}</div>` : ""}
                    </div>
                  `;
                      layer.bindTooltip(tooltipContent, {
                        sticky: true,
                        className: "custom-tooltip",
                      });

                      layer.on({
                        mouseover: (e: {
                          target: { setStyle: (s: object) => void };
                        }) => {
                          const l = e.target;
                          l.setStyle({
                            weight: 3.5,
                            color: "#1abc9c",
                            fillOpacity: 0.55,
                          });
                        },
                        mouseout: (e: {
                          target: { setStyle: (s: object) => void };
                        }) => {
                          const l = e.target;
                          l.setStyle({
                            weight: 2,
                            color: "#2980b9",
                            fillOpacity: 0.3,
                          });
                        },
                      });
                    }}
                  />
                )}

              {(showPoultryLayer || showBufferPoultry) && (
                <NativePoultryClusterLayer
                  L={L}
                  useMap={useMap}
                  farms={filteredPoultry}
                  handleSiteSelection={handleSiteSelection}
                />
              )}

              {showCattleMarketLayer && (
                <NativeCattleMarketClusterLayer
                  L={L}
                  useMap={useMap}
                  markets={allCattleMarkets}
                  handleSiteSelection={handleSiteSelection}
                />
              )}

              {showSurveillanceSites && surveillanceSites.length > 0 && (
                <NativeSurveillanceClusterLayer
                  L={L}
                  useMap={useMap}
                  sites={surveillanceSites}
                  onSurveillanceSiteClick={onSurveillanceSiteClick}
                />
              )}

              {false && (showPoultryLayer || showBufferPoultry) && (
                <MarkerClusterGroup
                  chunkedLoading
                  maxClusterRadius={60}
                  disableClusteringAtZoom={10}
                  iconCreateFunction={(cluster: {
                    getChildCount: () => number;
                  }) => {
                    const count = cluster.getChildCount();
                    return L.divIcon({
                      html: `<div style="background-color: #9b59b6; color: white; border: 2px solid #8e44ad; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: sans-serif; box-shadow: 0 2px 5px rgba(0,0,0,0.4); font-size: 13px;">${count}</div>`,
                      className: "custom-marker-cluster",
                      iconSize: L.point(40, 40, true),
                    });
                  }}
                >
                  {filteredPoultry.map((p) => (
                    <CircleMarker
                      key={p.id}
                      center={[p.lat, p.lng]}
                      radius={5}
                      pathOptions={{
                        color: "#8e44ad",
                        fillColor: "#9b59b6",
                        fillOpacity: 0.8,
                        weight: 1.5,
                      }}
                      eventHandlers={{
                        click: () =>
                          handleSiteSelection(p.lat, p.lng, `[Farm] ${p.name}`),
                      }}
                    >
                      <Tooltip sticky>
                        <div
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "11px",
                            padding: "4px 6px",
                            minWidth: "140px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              marginBottom: "3px",
                            }}
                          >
                            <span
                              style={{ color: "#9b59b6", fontSize: "13px" }}
                            >
                              🐔
                            </span>
                            <strong style={{ color: "#2c3e50" }}>
                              {p.name}
                            </strong>
                          </div>
                          {p.district && p.state ? (
                            <div style={{ color: "#7f8c8d", fontSize: "10px" }}>
                              📍 {p.district}, {p.state}
                            </div>
                          ) : null}
                          <div
                            style={{
                              color: "#bdc3c7",
                              fontSize: "9px",
                              marginTop: "2px",
                            }}
                          >
                            {p.lat.toFixed(4)}°N, {p.lng.toFixed(4)}°E
                          </div>
                        </div>
                      </Tooltip>
                    </CircleMarker>
                  ))}
                </MarkerClusterGroup>
              )}

              {false &&
                showSurveillanceSites &&
                surveillanceSites.length > 0 && (
                  <MarkerClusterGroup
                    chunkedLoading
                    maxClusterRadius={50}
                    disableClusteringAtZoom={11}
                    iconCreateFunction={(cluster: {
                      getChildCount: () => number;
                    }) => {
                      const count = cluster.getChildCount();
                      return L.divIcon({
                        html: `<div style="background-color: #0f766e; color: white; border: 2px solid #115e59; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: sans-serif; box-shadow: 0 2px 5px rgba(0,0,0,0.4); font-size: 13px;">${count}</div>`,
                        className: "custom-marker-cluster",
                        iconSize: L.point(40, 40, true),
                      });
                    }}
                  >
                    {surveillanceSites.map((site, i) => (
                      <Marker
                        key={`surv_${i}_${site.lat}_${site.lng}`}
                        position={[site.lat, site.lng]}
                        icon={makeSurveillanceIcon(L, site)}
                        eventHandlers={{
                          click: () => onSurveillanceSiteClick?.(site),
                        }}
                      >
                        <Tooltip direction="top" offset={[0, -10]} sticky>
                          <div
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "11px",
                              padding: "4px 6px",
                              minWidth: "160px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                marginBottom: "4px",
                                borderBottom: "1px solid #ecf0f1",
                                paddingBottom: "3px",
                              }}
                            >
                              <span style={{ fontSize: "13px" }}>📍</span>
                              <strong style={{ color: "#2c3e50" }}>
                                {site.siteName}
                              </strong>
                            </div>
                            {(site.totalPositiveSampleCount || 0) > 0 && (
                              <div
                                style={{ color: "#e74c3c", fontSize: "10px" }}
                              >
                                Positive:{" "}
                                <strong>{site.totalPositiveSampleCount}</strong>
                              </div>
                            )}
                            {(site.totalNegativeSampleCount || 0) > 0 && (
                              <div
                                style={{ color: "#f39c12", fontSize: "10px" }}
                              >
                                Negative:{" "}
                                <strong>{site.totalNegativeSampleCount}</strong>
                              </div>
                            )}
                            {(site.totalUnclearSampleCount || 0) > 0 && (
                              <div
                                style={{ color: "#95a5a6", fontSize: "10px" }}
                              >
                                Inconclusive:{" "}
                                <strong>{site.totalUnclearSampleCount}</strong>
                              </div>
                            )}
                            {site.diseaseShortName ? (
                              <div
                                style={{
                                  color: "#bdc3c7",
                                  fontSize: "9px",
                                  marginTop: "2px",
                                }}
                              >
                                {site.diseaseShortName}
                              </div>
                            ) : null}
                          </div>
                        </Tooltip>
                      </Marker>
                    ))}
                  </MarkerClusterGroup>
                )}

              {(showBirdsLayer || showHeatmap) && (
                <>
                  {showHeatmap && <HeatmapLayer points={heatmapPoints} />}
                  {validBirdsList.map((b, i) => {
                    const count = b.howMany || 1;
                    return (
                      <CircleMarker
                        key={`hm_${i}`}
                        center={[b.lat, b.lng]}
                        radius={25}
                        pathOptions={{
                          stroke: false,
                          fillColor: showHeatmap ? "#e74c3c" : "transparent",
                          fillOpacity: showHeatmap ? 0.01 : 0,
                        }}
                        interactive={true}
                      >
                        <Tooltip sticky direction="top" offset={[0, -10]}>
                          <div
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "11px",
                              padding: "4px 6px",
                              minWidth: "150px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                marginBottom: "3px",
                              }}
                            >
                              <span style={{ fontSize: "14px" }}>🐦</span>
                              <strong style={{ color: "#2c3e50" }}>
                                {b.comName}
                              </strong>
                            </div>
                            <div style={{ color: "#7f8c8d", fontSize: "10px" }}>
                              Count:{" "}
                              <span
                                style={{ color: "#e74c3c", fontWeight: "bold" }}
                              >
                                {count}
                              </span>
                            </div>
                            {b.obsDt ? (
                              <div
                                style={{
                                  color: "#95a5a6",
                                  fontSize: "9px",
                                  marginTop: "2px",
                                }}
                              >
                                📅{" "}
                                {new Date(b.obsDt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            ) : null}
                            <div
                              style={{
                                color: "#bdc3c7",
                                fontSize: "9px",
                                marginTop: "1px",
                              }}
                            >
                              {b.lat.toFixed(4)}°N, {b.lng.toFixed(4)}°E
                            </div>
                          </div>
                        </Tooltip>
                      </CircleMarker>
                    );
                  })}
                </>
              )}

              {showBuffer && siteA && (
                <Circle
                  center={siteA.end}
                  radius={radius * 1000}
                  pathOptions={{
                    color: "#3498db",
                    fillColor: "#3498db",
                    fillOpacity: 0.1,
                    dashArray: "5, 10",
                  }}
                  interactive={false}
                />
              )}
              {showBuffer && siteB && (
                <Circle
                  center={siteB.end}
                  radius={radius * 1000}
                  pathOptions={{
                    color: "#27ae60",
                    fillColor: "#27ae60",
                    fillOpacity: 0.1,
                    dashArray: "5, 10",
                  }}
                  interactive={false}
                />
              )}
              {showBuffer && searchPin && (
                <Circle
                  center={searchPin.end}
                  radius={radius * 1000}
                  pathOptions={{
                    color: "#e74c3c",
                    fillColor: "#e74c3c",
                    fillOpacity: 0.1,
                    dashArray: "5, 10",
                  }}
                  interactive={false}
                />
              )}

              {siteA && iconA && (
                <Marker position={siteA.end} icon={iconA}>
                  <Tooltip permanent>Site A: {siteA.name}</Tooltip>
                </Marker>
              )}
              {siteB && iconB && (
                <Marker position={siteB.end} icon={iconB}>
                  <Tooltip permanent>Site B: {siteB.name}</Tooltip>
                </Marker>
              )}
              {searchPin && searchIcon && (
                <Marker position={searchPin.end} icon={searchIcon}>
                  <Tooltip permanent>Searched: {searchPin.name}</Tooltip>
                </Marker>
              )}

              <SearchBar
                onLocationFound={(lat: number, lng: number, label: string) =>
                  handleSiteSelection(lat, lng, label)
                }
              />

              <ViewportTracker
                useMapEvents={useMapEvents}
                onViewportChange={(bounds, zoom) => {
                  setViewportZoom(zoom);
                  const ne = bounds.getNorthEast();
                  const sw = bounds.getSouthWest();
                  setViewportBounds({
                    minLng: sw.lng,
                    minLat: sw.lat,
                    maxLng: ne.lng,
                    maxLat: ne.lat,
                  });
                }}
              />
            </MapContainer>
          );
        })()}
    </section>
  );
}

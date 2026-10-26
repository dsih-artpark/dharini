import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import type * as Leaflet from "leaflet";
import type {
  BirdObservation,
  CattleMarket,
  CustomGeoJson,
  LeafletRefType,
  PoultryFarm,
  Site,
  SurveillanceCounts,
  SurveillanceSite,
  ViewportBounds,
} from "@/src/app/(dashboard)/geolens/types";
import { haversineKm } from "@/src/app/(dashboard)/geolens/utils/geo";
import {
  RISK_STATUS,
  type RiskMapGrid,
  type RiskMapPoint,
  type RiskOutline,
} from "./risk/useRiskPrediction";
import { ACCENT, formatPercent } from "./prediction/utils";
import {
  CHANCE_BINS,
  GRID_BINS,
  gridColor,
  type ForecastGridCell,
  type ForecastGridLayerData,
} from "./compare/forecastGrid";
import { createSiteDotIcon } from "@/src/components/monitor/diseases/site-dot-icon";

// Site names are typed in by users; escape them before they go into HTML
const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

// Same content and classes as the dot tooltip on the Monitor Geospatial
// Distribution map (leaflet-map-renderer.tsx): Total always, the other
// counts only when non-zero. A positive site has these per disease, each
// under the disease's short name.
const surveillanceCountsHtml = (counts: SurveillanceCounts) => {
  const pos = counts.totalPositiveSampleCount || 0;
  const neg = counts.totalNegativeSampleCount || 0;
  const unclear = counts.totalUnclearSampleCount || 0;
  const row = (label: string, count: number, color: string) =>
    `<span class="${color}">${label}:</span><span class="font-semibold text-right ${color}">${count}</span>`;

  return `<div class="grid grid-cols-2 gap-x-2 text-xs">
      <span class="text-gray-600">Total:</span><span class="font-semibold text-right">${counts.totalSampleCount || 0}</span>
      ${pos > 0 ? row("Positive", pos, "text-red-600") : ""}
      ${neg > 0 ? row("Negative", neg, "text-yellow-500") : ""}
      ${unclear > 0 ? row("Unclear", unclear, "text-gray-500") : ""}
    </div>`;
};

const surveillanceTooltipHtml = (site: SurveillanceSite) => {
  const body = site.diseases?.length
    ? site.diseases
        .map(
          (d) =>
            `<div class="text-xs font-semibold text-gray-700">${escapeHtml(d.shortName)}</div>${surveillanceCountsHtml(d)}`,
        )
        .join("")
    : surveillanceCountsHtml(site);

  return `<div class="flex flex-col gap-1 min-w-[150px]">
    <div class="font-bold text-sm border-b pb-1">${escapeHtml(site.siteName)}</div>
    ${body}
  </div>`;
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

// lucide's maximize-2 / minimize-2, drawn into the Leaflet control.
const FULLSCREEN_ICON_ATTRS =
  'xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;margin:auto"';
const ENTER_FULLSCREEN_ICON = `<svg ${FULLSCREEN_ICON_ATTRS}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;
const EXIT_FULLSCREEN_ICON = `<svg ${FULLSCREEN_ICON_ATTRS}><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;

function paintFullscreenButton(button: HTMLButtonElement, active: boolean) {
  const label = active ? "Exit full screen" : "Full screen";
  button.title = label;
  button.setAttribute("aria-label", label);
  button.innerHTML = active ? EXIT_FULLSCREEN_ICON : ENTER_FULLSCREEN_ICON;
}

// Under the recenter button. The page decides what goes full screen (the map
// frame with its overlays); this only shows the toggle.
function FullscreenControl({
  L,
  useMap,
  active,
  onToggle,
}: {
  L: typeof Leaflet;
  useMap: () => Leaflet.Map;
  active: boolean;
  onToggle: () => void;
}) {
  const map = useMap();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Read when the control is built and on click, so the control isn't
  // rebuilt (and doesn't lose focus) on every toggle.
  const latest = useRef({ active, onToggle });
  useEffect(() => {
    latest.current = { active, onToggle };
  });

  useEffect(() => {
    const control = new L.Control({ position: "topright" });

    control.onAdd = () => {
      const container = L.DomUtil.create(
        "div",
        "leaflet-control dashboard-fullscreen-control",
      );
      const button = L.DomUtil.create("button", "", container);
      button.type = "button";
      paintFullscreenButton(button, latest.current.active);
      buttonRef.current = button;

      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.on(button, "click", (event) => {
        L.DomEvent.preventDefault(event);
        latest.current.onToggle();
      });

      return container;
    };

    control.addTo(map);

    return () => {
      control.remove();
      buttonRef.current = null;
    };
  }, [L, map]);

  useEffect(() => {
    if (buttonRef.current) paintFullscreenButton(buttonRef.current, active);
  }, [active]);

  return null;
}

// The map's container changes size when the side panel opens or closes, and
// Leaflet only measures it on window resize; re-measure on any size change.
function ResizeWatcher({ useMap }: { useMap: () => Leaflet.Map }) {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}

// Below this many screen pixels a grid cell can't be seen, so each site's
// forecast is shown as one halo instead.
const MIN_GRID_CELL_PX = 4;

const RISK_OUTLINE_STYLE = {
  color: ACCENT,
  weight: 2,
  fillColor: ACCENT,
  fillOpacity: 0.06,
};

/**
 * Risk Map: a district's or sub-district's 6 km cells, each in its
 * prediction's colour with the answer on hover, and the region's outline
 * over them. Drawn together so the outline stays on top as cells are
 * redrawn with new answers.
 */
function RiskGridLayer({
  L,
  useMap,
  grid,
  outline,
}: {
  L: typeof Leaflet;
  useMap: () => Leaflet.Map;
  grid: RiskMapGrid;
  outline: RiskOutline | null;
}) {
  const map = useMap();
  useEffect(() => {
    const group = L.layerGroup(
      grid.cells.map((cell) => {
        const { label, color } = RISK_STATUS[cell.status];
        return L.rectangle(cell.bounds, {
          color: "#ffffff",
          weight: 0.5,
          fillColor: color,
          fillOpacity: cell.status === "pending" ? 0.12 : 0.5,
        }).bindTooltip(
          cell.probability === undefined
            ? label
            : `${label} · ${formatPercent(cell.probability)}`,
          { sticky: true },
        );
      }),
    );
    if (outline)
      group.addLayer(
        L.geoJSON(outline.geometry, {
          style: RISK_OUTLINE_STYLE,
          interactive: false,
        }),
      );
    group.addTo(map);
    return () => {
      group.remove();
    };
  }, [L, map, grid, outline]);
  return null;
}

// Compare forecast: squares of `spacingKm` around each sample point,
// coloured by how many species clear the minimum chance there (or by a
// picked species' chance), drawn in a pane of their own that is blurred so
// the squares blend into one smooth surface. Zoomed out too far to see them
// (two far-apart sites fit on one map), each site gets a halo around its pin
// in the colour of its busiest cell instead. Raw Leaflet (react-leaflet has
// no non-interactive Rectangle in our bundle), so the squares never swallow
// the map clicks that place sites; the value under the cursor comes from the
// map's own mouse moves instead.
const FORECAST_PANE = "forecastGrid";

function ForecastGridLayer({
  L,
  useMap,
  grid,
}: {
  L: typeof Leaflet;
  useMap: () => Leaflet.Map;
  grid: ForecastGridLayerData;
}) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useEffect(() => {
    const onZoom = () => setZoom(map.getZoom());
    map.on("zoomend", onZoom);
    return () => {
      map.off("zoomend", onZoom);
    };
  }, [map]);

  useEffect(() => {
    // Screen size of a cell at this zoom (Web Mercator metres per pixel)
    const lat = grid.areas[0]?.lat ?? grid.cells[0]?.lat ?? 20;
    const metresPerPx =
      (40075016.686 * Math.cos((lat * Math.PI) / 180)) / 2 ** (zoom + 8);
    const cellPx = (grid.spacingKm * 1000) / metresPerPx;
    // A picked species: coloured by its chance, not by a species count
    const bins = grid.species ? CHANCE_BINS : GRID_BINS;

    if (cellPx < MIN_GRID_CELL_PX) {
      const halos = L.layerGroup(
        grid.areas
          .filter((area) => area.maxCount > 0)
          .map((area) =>
            L.circleMarker([area.lat, area.lng], {
              radius: 14,
              color: "#ffffff",
              weight: 2,
              fillColor: gridColor(area.maxCount, bins),
              fillOpacity: 0.85,
              interactive: false,
            }),
          ),
      );
      halos.addTo(map);
      return () => {
        halos.remove();
      };
    }

    // Under the overlay pane, so buffers, outlines, pins and tooltips stay
    // sharp on top. globals.css gives every Leaflet pane the same z-index, so
    // panes stack in page order: this one goes just before the overlay pane.
    // Opaque squares, see-through pane: no seams where they meet.
    let pane = map.getPane(FORECAST_PANE);
    if (!pane) {
      pane = map.createPane(FORECAST_PANE);
      const overlayPane = map.getPane("overlayPane");
      overlayPane?.parentNode?.insertBefore(pane, overlayPane);
    }
    pane.style.pointerEvents = "none";
    pane.style.opacity = "0.65";
    // About half a cell, so neighbouring cells blend and the edges fade
    pane.style.filter = `blur(${Math.min(cellPx / 2, 40)}px)`;
    const renderer = L.canvas({ pane: FORECAST_PANE });

    const boxes = grid.cells.map((cell) => {
      // Each site's grid has its own cell size
      const spacingKm = cell.spacingKm ?? grid.spacingKm;
      const dLat = spacingKm / 2 / 110.574;
      const dLng =
        spacingKm / 2 / (111.32 * Math.cos((cell.lat * Math.PI) / 180));
      return { cell, dLat, dLng };
    });
    const group = L.layerGroup(
      boxes.map(({ cell, dLat, dLng }) =>
        L.rectangle(
          [
            [cell.lat - dLat, cell.lon - dLng],
            [cell.lat + dLat, cell.lon + dLng],
          ],
          {
            renderer,
            stroke: false,
            fillColor: gridColor(cell.count, bins),
            fillOpacity: 1,
            interactive: false,
          },
        ),
      ),
    );
    group.addTo(map);

    // The cell under the cursor: a picked species' chance there, or how many
    // species clear the minimum chance and which, with their chances. Built
    // once per cell entered, not on every mouse move.
    const tooltip = L.tooltip({ direction: "top", offset: [0, -8] });
    const contentOf = (cell: ForecastGridCell): string | HTMLElement => {
      if (grid.species)
        return `${grid.species.name}: ${cell.count}% chance it's here`;
      const box = document.createElement("div");
      const title = document.createElement("div");
      title.className = "mb-0.5 font-semibold";
      title.textContent = `${cell.count} species ≥ ${grid.minChance}% here`;
      box.append(title);
      for (const { name, chance } of cell.species?.() ?? []) {
        const row = document.createElement("div");
        row.className = "flex justify-between gap-3";
        const label = document.createElement("span");
        label.textContent = name;
        const value = document.createElement("span");
        value.className = "font-semibold tabular-nums";
        value.textContent = `${chance}%`;
        row.append(label, value);
        box.append(row);
      }
      return box;
    };
    let shown: ForecastGridCell | null = null;
    const onMove = (e: Leaflet.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const hit = boxes.find(
        ({ cell, dLat, dLng }) =>
          Math.abs(lat - cell.lat) <= dLat && Math.abs(lng - cell.lon) <= dLng,
      );
      if (!hit) {
        map.closeTooltip(tooltip);
        return;
      }
      if (hit.cell !== shown) {
        shown = hit.cell;
        tooltip.setContent(contentOf(hit.cell));
      }
      tooltip.setLatLng(e.latlng);
      if (!map.hasLayer(tooltip)) map.openTooltip(tooltip);
    };
    const onOut = () => map.closeTooltip(tooltip);
    map.on("mousemove", onMove);
    map.on("mouseout", onOut);
    return () => {
      map.off("mousemove", onMove);
      map.off("mouseout", onOut);
      map.closeTooltip(tooltip);
      group.remove();
      renderer.remove();
    };
  }, [L, map, grid, zoom]);

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

/**
 * Surveillance sites as individual dots, drawn the same as on the Monitor
 * Geospatial Distribution map (no clustering into count bubbles).
 */
function NativeSurveillanceLayer({
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

    const markers = sites
      .filter((site) => Number.isFinite(site.lat) && Number.isFinite(site.lng))
      .map((site) => {
        const marker = L.marker([site.lat, site.lng], {
          icon: createSiteDotIcon(L, site),
        });
        marker.bindTooltip(surveillanceTooltipHtml(site), {
          direction: "top",
          offset: [0, -12],
          opacity: 1,
        });
        marker.on("click", () => onSurveillanceSiteClick?.(site));
        return marker;
      });

    const layer = L.layerGroup(markers);
    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
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
  /** A click on empty map space; DashboardApp routes it by the active tab. */
  onMapClick: (lat: number, lng: number) => void;
  /** "risk" draws that tab's layer and hides site pins/buffers. */
  mode?: "default" | "risk";
  /** Compare: the bird-forecast grid for the selected week, or null. */
  forecastGrid?: ForecastGridLayerData | null;
  /** Risk Map: the place being predicted, coloured by its result. */
  riskPoint?: RiskMapPoint | null;
  /** Risk Map: the outline of the region picked, if one is. */
  riskOutline?: RiskOutline | null;
  /** Risk Map: a district's or sub-district's cells, when one is picked. */
  riskGrid?: RiskMapGrid | null;
  /** Full-screen toggle in the map controls; null where the browser can't
   *  do full screen. */
  fullscreen?: { active: boolean; onToggle: () => void } | null;
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
    onMapClick,
    mode = "default",
    forecastGrid = null,
    riskPoint = null,
    riskOutline = null,
    riskGrid = null,
    fullscreen = null,
  } = props;

  // Site pins, buffers and eBird points belong to the site tools; the
  // risk tab shows its own layer instead.
  const showSiteTools = mode === "default";

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
    <section className="map-viewport">
      {(isWaterLoading || loadingLayerLabels.length > 0) && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "50%",
            transform: "translateX(-50%)",
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
              {fullscreen && (
                <FullscreenControl
                  L={L}
                  useMap={useMap}
                  active={fullscreen.active}
                  onToggle={fullscreen.onToggle}
                />
              )}
              <ResizeWatcher useMap={useMap} />
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
              <MapClickHandler onClick={onMapClick} />

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
                <NativeSurveillanceLayer
                  L={L}
                  useMap={useMap}
                  sites={surveillanceSites}
                  onSurveillanceSiteClick={onSurveillanceSiteClick}
                />
              )}

              {showSiteTools && (showBirdsLayer || showHeatmap) && (
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

              {showSiteTools && showBuffer && siteA && (
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
              {showSiteTools && showBuffer && siteB && (
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
              {showSiteTools && showBuffer && searchPin && (
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

              {showSiteTools && siteA && iconA && (
                <Marker position={siteA.end} icon={iconA}>
                  <Tooltip>Site A: {siteA.name}</Tooltip>
                </Marker>
              )}
              {showSiteTools && siteB && iconB && (
                <Marker position={siteB.end} icon={iconB}>
                  <Tooltip>Site B: {siteB.name}</Tooltip>
                </Marker>
              )}
              {showSiteTools && searchPin && searchIcon && (
                <Marker position={searchPin.end} icon={searchIcon}>
                  <Tooltip permanent>Searched: {searchPin.name}</Tooltip>
                </Marker>
              )}

              {/* Compare: the forecast grid, under the buffers and pins */}
              {forecastGrid && (
                <ForecastGridLayer L={L} useMap={useMap} grid={forecastGrid} />
              )}

              {mode === "risk" && riskGrid ? (
                <RiskGridLayer
                  L={L}
                  useMap={useMap}
                  grid={riskGrid}
                  outline={riskOutline}
                />
              ) : (
                // Remounted per region: GeoJSON doesn't redraw when its data changes
                mode === "risk" &&
                riskOutline && (
                  <GeoJSON
                    key={`risk-outline-${riskOutline.key}`}
                    data={riskOutline.geometry}
                    style={RISK_OUTLINE_STYLE}
                    interactive={false}
                  />
                )
              )}

              {/* Keyed by its result too: re-added after its cell is
                  redrawn with the answer, so it stays on top of it */}
              {mode === "risk" && riskPoint && (
                <CircleMarker
                  key={`${riskPoint.lat},${riskPoint.lng},${riskPoint.status},${riskPoint.probability}`}
                  center={[riskPoint.lat, riskPoint.lng]}
                  radius={10}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 3,
                    fillColor: RISK_STATUS[riskPoint.status].color,
                    fillOpacity: 1,
                  }}
                >
                  <Tooltip permanent direction="top" offset={[0, -10]}>
                    <strong>{riskPoint.name}</strong>
                    {riskPoint.status !== "pending" &&
                      riskPoint.probability !== undefined && (
                        <>
                          {" · "}
                          {RISK_STATUS[riskPoint.status].label} (
                          {formatPercent(riskPoint.probability)})
                        </>
                      )}
                  </Tooltip>
                </CircleMarker>
              )}

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

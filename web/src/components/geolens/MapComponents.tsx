import { useEffect, useRef, useCallback } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "leaflet.heat";

// --- CUSTOM TYPES FOR PLUGINS ---
interface GeoSearchEvent extends L.LeafletEvent {
  location?: {
    x: number;
    y: number;
    label: string;
    lat?: number;
    lng?: number;
  };
  results?: Array<{
    x: number;
    y: number;
    label: string;
  }>;
  x?: number;
  y?: number;
  label?: string;
  lat?: number;
  lng?: number;
}

interface LayersControlEvent extends L.LeafletEvent {
  name: string;
}

interface MapClickHandlerProps {
  onClick: (lat: number, lng: number) => void;
}

export function MapClickHandler({ onClick }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      const target = e.originalEvent?.target as HTMLElement;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "a" || tag === "button" || tag === "input") return;
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface LayerTrackerProps {
  onToggle: (name: string, visible: boolean) => void;
}

export function LayerTracker({ onToggle }: LayerTrackerProps) {
  const map = useMap();
  useEffect(() => {
    const onAdd = (e: L.LeafletEvent) =>
      onToggle((e as LayersControlEvent).name, true);
    const onRemove = (e: L.LeafletEvent) =>
      onToggle((e as LayersControlEvent).name, false);
    map.on("overlayadd", onAdd);
    map.on("overlayremove", onRemove);
    return () => {
      map.off("overlayadd", onAdd);
      map.off("overlayremove", onRemove);
    };
  }, [map, onToggle]);
  return null;
}

interface FlyToLocationProps {
  target:
    | {
        lat: number;
        lng: number;
        zoom?: number;
      }
    | null
    | undefined;
}

export function FlyToLocation({ target }: FlyToLocationProps) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lng], target.zoom || 13, { duration: 1.4 });
  }, [map, target]);
  return null;
}

interface SearchBarProps {
  onLocationFound: (lat: number, lng: number, label: string) => void;
}

export function SearchBar({ onLocationFound }: SearchBarProps) {
  const map = useMap();
  const callbackRef = useRef(onLocationFound);
  useEffect(() => {
    callbackRef.current = onLocationFound;
  }, [onLocationFound]);
  const providerRef = useRef(new OpenStreetMapProvider());

  const fireResult = useCallback(
    (
      lat: number | null | undefined,
      lng: number | null | undefined,
      label?: string,
    ) => {
      if (lat == null || lng == null) return;
      callbackRef.current(lat, lng, label || "Searched Location");
      map.setView([lat, lng], Math.max(map.getZoom(), 13));
    },
    [map],
  );

  useEffect(() => {
    const provider = providerRef.current;
    const searchControl = new (
      GeoSearchControl as unknown as new (opts: Record<string, unknown>) => {
        addTo: (map: L.Map) => void;
        remove: () => void;
      }
    )({
      provider,
      style: "button",
      position: "topleft",
      showMarker: false,
      autoClose: true,
      searchLabel: "Search address or city...",
      keepResult: true,
    });
    map.addControl(searchControl as unknown as L.Control);

    const onShow = (e: L.LeafletEvent) => {
      const loc = (e as GeoSearchEvent).location || (e as GeoSearchEvent);
      fireResult(loc.y ?? loc.lat, loc.x ?? loc.lng, loc.label);
    };
    map.on("geosearch/showlocation", onShow);

    const onResults = (e: L.LeafletEvent) => {
      const results = (e as GeoSearchEvent).results;
      if (results && results.length > 0) {
        const r = results[0];
        fireResult(r.y, r.x, r.label);
      }
    };
    map.on("geosearch/results", onResults);

    let inputEl:
      | (HTMLInputElement & {
          _gsKeyDown?: (e: KeyboardEvent) => void;
          _gsClick?: () => void;
        })
      | null = null;
    const attachInput = () => {
      inputEl = map
        .getContainer()
        .querySelector(
          ".geosearch input, input.glass-search-input, .leaflet-bar input",
        );
      if (!inputEl) return;
      const onKeyDown = async (e: KeyboardEvent) => {
        if (e.key !== "Enter") return;
        const query = inputEl?.value.trim();
        if (!query) return;
        try {
          const results = await provider.search({ query });
          if (results?.length > 0)
            fireResult(results[0].y, results[0].x, results[0].label);
        } catch (err) {
          console.error("Search fallback error:", err);
        }
      };
      const onClick = async () => {
        setTimeout(async () => {
          const query = inputEl?.value.trim();
          if (!query) return;
          try {
            const results = await provider.search({ query });
            if (results?.length > 0)
              fireResult(results[0].y, results[0].x, results[0].label);
          } catch {}
        }, 300);
      };
      inputEl.addEventListener("keydown", onKeyDown);
      const suggestionContainer = map
        .getContainer()
        .querySelector(".geosearch .results, .leaflet-bar .results");
      if (suggestionContainer)
        suggestionContainer.addEventListener("click", onClick);
      inputEl._gsKeyDown = onKeyDown;
      inputEl._gsClick = onClick;
    };
    setTimeout(attachInput, 500);

    return () => {
      map.off("geosearch/showlocation", onShow);
      map.off("geosearch/results", onResults);
      if (inputEl) {
        if (inputEl._gsKeyDown)
          inputEl.removeEventListener("keydown", inputEl._gsKeyDown);
        const sc = map
          .getContainer()
          .querySelector(".geosearch .results, .leaflet-bar .results");
        if (sc && inputEl._gsClick)
          sc.removeEventListener("click", inputEl._gsClick);
      }
      map.removeControl(searchControl as unknown as L.Control);
    };
  }, [map, fireResult]);

  return null;
}

interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

interface HeatmapLayerProps {
  points: HeatmapPoint[];
}

export function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();
  const heatRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    // Cleanup existing layer
    if (heatRef.current) {
      map.removeLayer(heatRef.current);
      heatRef.current = null;
    }

    if (!points || points.length === 0) return;

    // @ts-expect-error - L.heatLayer is a plugin
    const heatLayer = L.heatLayer(
      points.map((p) => [p.lat, p.lng, p.intensity]),
      {
        radius: 20,
        blur: 15,
        maxZoom: 10,
      },
    ).addTo(map);
    heatRef.current = heatLayer;

    // Make the heatmap canvas pass-through for pointer events so CircleMarker hovers trigger
    if (heatLayer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hl = heatLayer as any;
      if (hl._canvas) {
        hl._canvas.style.pointerEvents = "none";
      }
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hlAsync = heatLayer as any;
        if (hlAsync._canvas) {
          hlAsync._canvas.style.pointerEvents = "none";
        }
      }, 0);
    }

    return () => {
      if (heatRef.current) {
        map.removeLayer(heatRef.current);
        heatRef.current = null;
      }
    };
  }, [map, points]);

  return null;
}

interface AnimatedRouteLineProps {
  from: [number, number] | null | undefined;
  to: [number, number] | null | undefined;
}

export function AnimatedRouteLine({ from, to }: AnimatedRouteLineProps) {
  const map = useMap();
  const lineRef = useRef<L.Polyline | null>(null);
  useEffect(() => {
    if (lineRef.current) {
      map.removeLayer(lineRef.current);
      lineRef.current = null;
    }
    if (!from || !to) return;
    lineRef.current = L.polyline([from, to], {
      color: "#f39c12",
      weight: 2.5,
      opacity: 0.9,
      dashArray: "10 8",
    }).addTo(map);
    return () => {
      if (lineRef.current) {
        map.removeLayer(lineRef.current);
        lineRef.current = null;
      }
    };
  }, [map, from, to]);
  return null;
}

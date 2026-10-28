import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

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

interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

interface HeatmapLayerProps {
  points: HeatmapPoint[];
  /** leaflet.heat options; defaults to the bird-density look. */
  options?: Record<string, unknown>;
}

const DEFAULT_HEAT_OPTIONS = { radius: 20, blur: 15, maxZoom: 10 };

export function HeatmapLayer({
  points,
  options = DEFAULT_HEAT_OPTIONS,
}: HeatmapLayerProps) {
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
      options,
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
  }, [map, points, options]);

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

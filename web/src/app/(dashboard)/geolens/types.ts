import type * as Leaflet from "leaflet";
import type React from "react";

export interface Wetland {
  id: string;
  state: string;
  district: string;
  name: string;
  lat: number;
  lng: number;
  areaHa?: number;
}
export interface PoultryFarm {
  id: string;
  state: string;
  district: string;
  name: string;
  lat: number;
  lng: number;
}
export interface CattleMarket {
  id: string;
  state: string;
  district: string;
  name: string;
  lat: number;
  lng: number;
  /** Weekday(s) the market trades, or null when the source doesn't record it. */
  operatingDay: string | null;
}
export interface BirdObservation {
  lat: number;
  lng: number;
  howMany?: number;
  comName: string;
  obsDt: string;
}
export interface Site {
  id?: string;
  name: string;
  state?: string;
  lat?: number;
  lng?: number;
  end: [number, number];
}
export interface Disease {
  id: string;
  name: string;
}
export interface SurveillanceSite {
  lat: number;
  lng: number;
  color: string;
  siteName: string;
  totalSampleCount?: number;
  totalPositiveSampleCount?: number;
  totalNegativeSampleCount?: number;
  totalUnclearSampleCount?: number;
  diseaseShortName?: string;
  farmType?: string;
}
export interface FlyTarget {
  lat: number;
  lng: number;
  zoom: number;
}

export interface CustomGeoJsonFeature {
  geometry?: {
    type: string;
    coordinates: unknown;
  };
  properties?: {
    name?: string;
    NAME?: string;
    osm_id?: string | number;
    code?: number;
    fclass?: string;
  };
}

export interface CustomGeoJson {
  features?: CustomGeoJsonFeature[];
}

export interface ViewportBounds {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

export interface LeafletRefType {
  L: typeof Leaflet;
  MapContainer: React.ElementType;
  TileLayer: React.ElementType;
  ZoomControl: React.ElementType;
  GeoJSON: React.ElementType;
  Marker: React.ElementType;
  Circle: React.ElementType;
  CircleMarker: React.ElementType;
  Tooltip: React.ElementType;
  LayerGroup: React.ElementType;
  useMap: () => Leaflet.Map;
  useMapEvents: (handlers: {
    moveend: () => void;
    zoomend: () => void;
  }) => Leaflet.Map;
  MapClickHandler: React.ElementType;
  FlyToLocation: React.ElementType;
  SearchBar: React.ElementType;
  HeatmapLayer: React.ElementType;
  LayerTracker: React.ElementType;
  MarkerClusterGroup: React.ElementType;
}

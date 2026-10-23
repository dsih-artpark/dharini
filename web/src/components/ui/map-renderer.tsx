"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { DEFAULT_CENTER, isValidCoordinate } from "@/src/components/ui/map.utils";

type RecenterMapProps = {
  center: [number, number];
};

const RecenterMap: React.FC<RecenterMapProps> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    // Remove default attribution prefix
    map.attributionControl?.setPrefix?.("");
    map.attributionControl?.addAttribution?.(
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    );
    // Set zoom control to bottom right
    const zoomControl = L.control.zoom({ position: "bottomright" });
    zoomControl.addTo(map);

    return () => {
      map.removeControl(zoomControl); // Cleanup to prevent duplicate zoom controls
    };
  }, [map]);

  const [lat, lng] = center;
  useEffect(() => {
    if (isValidCoordinate(center)) {
      map.setView(center, map.getZoom(), { animate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, map]);

  return null;
};

// Component to capture map ref for cleanup
const MapRefSetter = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<L.Map | null>;
}) => {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
};

type MapComponentProps = {
  location?: [number, number];
  dragMarker?: boolean;
  onLocationUpdate?: (newLocation: [number, number]) => void;
};

const markerIcon = L.divIcon({
  className: "custom-svg-icon",
  html: `<svg
            width="30"
            height="37"
            viewBox="0 0 30 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                d="M25.6067 25.9405L15 36.5472L4.39334 25.9405C2.29557 23.8427 0.866978 21.17 0.288214 18.2603C-0.290549 15.3506 0.00651141 12.3346 1.14183 9.59369C2.27715 6.85281 4.19974 4.51014 6.66647 2.86193C9.13321 1.21371 12.0333 0.333984 15 0.333984C17.9667 0.333984 20.8668 1.21371 23.3335 2.86193C25.8003 4.51014 27.7229 6.85281 28.8582 9.59369C29.9935 12.3346 30.2906 15.3506 29.7118 18.2603C29.133 21.17 27.7044 23.8427 25.6067 25.9405ZM15 18.6672C15.8841 18.6672 16.7319 18.316 17.357 17.6909C17.9822 17.0658 18.3333 16.2179 18.3333 15.3339C18.3333 14.4498 17.9822 13.602 17.357 12.9768C16.7319 12.3517 15.8841 12.0005 15 12.0005C14.116 12.0005 13.2681 12.3517 12.643 12.9768C12.0179 13.602 11.6667 14.4498 11.6667 15.3339C11.6667 16.2179 12.0179 17.0658 12.643 17.6909C13.2681 18.316 14.116 18.6672 15 18.6672Z"
                fill="#D85040"
            />
        </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapRenderer: React.FC<MapComponentProps> = ({
  location = DEFAULT_CENTER,
  dragMarker = false,
  onLocationUpdate,
}) => {
  // Generate unique key to prevent "Map container is already initialized" error
  const [mapKey] = useState(
    () => `map-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const mapRef = useRef<L.Map | null>(null);

  const validLocation: [number, number] = isValidCoordinate(location)
    ? location
    : DEFAULT_CENTER;

  // Handle marker drag event
  const handleMarkerDrag = (event: L.LeafletEvent) => {
    const newLatLng = event.target.getLatLng();
    if (onLocationUpdate) onLocationUpdate([newLatLng.lat, newLatLng.lng]);
  };

  // Cleanup on unmount - wrapped in try-catch to prevent navigation crashes
  useEffect(() => {
    const currentMapRef = mapRef.current;
    return () => {
      try {
        if (currentMapRef) {
          currentMapRef.off();
          currentMapRef.remove();
        }
      } catch (e) {
        console.warn("[MapRenderer] Cleanup warning:", e);
      }
      mapRef.current = null;
    };
  }, []);

  return (
    <MapContainer
      key={mapKey}
      center={validLocation}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      zoomControl={false}
      touchZoom={false}
      doubleClickZoom={false}
    >
      <MapRefSetter mapRef={mapRef} />
      <RecenterMap center={validLocation} />
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        position={validLocation}
        icon={markerIcon}
        draggable={dragMarker}
        eventHandlers={{ dragend: handleMarkerDrag }}
      >
        {/* <Popup>{location}</Popup> */}
      </Marker>
    </MapContainer>
  );
};

export default MapRenderer;

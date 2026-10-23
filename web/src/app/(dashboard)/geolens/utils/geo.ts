export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function bearingDeg(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function bearingToCompass(deg: number): string {
  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return dirs[Math.round(deg / 22.5) % 16];
}

import type { Wetland, CustomGeoJsonFeature } from "../types";

export interface NearestWetlandResult {
  wetland: Wetland;
  distKm: number;
  bearing: number;
  compass: string;
}

export function findNearestWetland(
  lat: number,
  lng: number,
  allWetlands: Wetland[],
): NearestWetlandResult | null {
  if (!allWetlands || allWetlands.length === 0) return null;

  // First pass: check if the point lies within any wetland's estimated boundary.
  // We approximate each wetland as a circle whose area matches its areaHa value.
  for (const w of allWetlands) {
    if (!w.lat || !w.lng) continue;
    const areaHa = w.areaHa || 0;
    if (areaHa > 0) {
      // Convert Ha → m² → estimated radius in km
      const radiusKm = Math.sqrt((areaHa * 10000) / Math.PI) / 1000;
      const distToCenter = haversineKm(lat, lng, w.lat, w.lng);
      if (distToCenter <= radiusKm) {
        // Location is inside this wetland → distance is 0
        return { wetland: w, distKm: 0, bearing: 0, compass: "N" };
      }
    }
  }

  // Second pass: find nearest wetland by centroid distance
  let best: Wetland | null = null,
    bestDist = Infinity;
  for (const w of allWetlands) {
    if (!w.lat || !w.lng) continue;
    const d = haversineKm(lat, lng, w.lat, w.lng);
    if (d < bestDist) {
      bestDist = d;
      best = w;
    }
  }
  if (!best) return null;
  const bearing = bearingDeg(lat, lng, best.lat, best.lng);
  return {
    wetland: best,
    distKm: bestDist,
    bearing,
    compass: bearingToCompass(bearing),
  };
}

export function findNearestPoultryFarm<
  T extends { lat?: number | null; lng?: number | null },
>(lat: number, lng: number, allFarms: T[]) {
  if (!allFarms || allFarms.length === 0) return null;
  let best: T | null = null,
    bestDist = Infinity;
  for (const f of allFarms) {
    if (!f.lat || !f.lng) continue;
    const d = haversineKm(lat, lng, f.lat, f.lng);
    if (d < bestDist) {
      bestDist = d;
      best = f;
    }
  }
  return best ? { farm: best, distKm: bestDist } : null;
}

export function getDensityCount(
  lat: number,
  lng: number,
  data: { lat?: number | null; lng?: number | null }[],
  radiusKm: number,
): number {
  if (!data) return 0;
  return data.filter((item) => {
    if (!item.lat || !item.lng) return false;
    return haversineKm(lat, lng, item.lat, item.lng) <= radiusKm;
  }).length;
}
export function isFeatureWithinRadius(
  feature: CustomGeoJsonFeature,
  center: [number, number],
  radiusKm: number,
): boolean {
  if (!feature || !feature.geometry) return false;
  const { type, coordinates } = feature.geometry;
  const [centerLat, centerLng] = center;

  const isPointWithin = (pt: unknown) => {
    if (!Array.isArray(pt) || pt.length < 2) return false;
    return haversineKm(centerLat, centerLng, pt[1], pt[0]) <= radiusKm;
  };

  if (type === "Point") {
    return isPointWithin(coordinates);
  }
  if (type === "LineString" || type === "MultiPoint") {
    return (coordinates as unknown[]).some(isPointWithin);
  }
  if (type === "Polygon" || type === "MultiLineString") {
    return (coordinates as unknown[][]).some(
      (ring: unknown[]) => Array.isArray(ring) && ring.some(isPointWithin),
    );
  }
  if (type === "MultiPolygon") {
    return (coordinates as unknown[][][]).some(
      (polygon: unknown[][]) =>
        Array.isArray(polygon) &&
        polygon.some(
          (ring: unknown[]) => Array.isArray(ring) && ring.some(isPointWithin),
        ),
    );
  }
  return false;
}

function getSegmentCircleIntersection(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  R: number,
): number[] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const a = dx * dx + dy * dy;
  if (a === 0) return [];
  const b = 2 * (x1 * dx + y1 * dy);
  const c = x1 * x1 + y1 * y1 - R * R;
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return [];
  const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const roots = [];
  if (t1 >= 0 && t1 <= 1) roots.push(t1);
  if (t2 >= 0 && t2 <= 1) roots.push(t2);
  return roots.sort((x, y) => x - y);
}

function clipRingToCircle(
  ring: [number, number][],
  cLat: number,
  cLng: number,
  R: number,
  isClosed: boolean,
): [number, number][] {
  if (ring.length === 0) return [];
  const clipped: [number, number][] = [];
  const latCos = Math.cos((cLat * Math.PI) / 180);

  const toKm = (pt: [number, number]) => {
    return {
      x: (pt[0] - cLng) * 111 * latCos,
      y: (pt[1] - cLat) * 111,
    };
  };

  const fromKm = (x: number, y: number): [number, number] => {
    return [cLng + x / (111 * latCos), cLat + y / 111];
  };

  const numPoints = ring.length;
  const loopCount = isClosed ? numPoints : numPoints - 1;

  for (let i = 0; i < loopCount; i++) {
    const p1 = ring[i];
    const p2 = ring[isClosed && i === numPoints - 1 ? 0 : i + 1];

    const km1 = toKm(p1);
    const km2 = toKm(p2);

    const dist1 = Math.sqrt(km1.x * km1.x + km1.y * km1.y);
    const dist2 = Math.sqrt(km2.x * km2.x + km2.y * km2.y);

    if (i === 0 && dist1 <= R) {
      clipped.push(p1);
    }

    if (dist1 <= R) {
      if (dist2 <= R) {
        clipped.push(p2);
      } else {
        const roots = getSegmentCircleIntersection(
          km1.x,
          km1.y,
          km2.x,
          km2.y,
          R,
        );
        if (roots.length > 0) {
          const t = roots[0];
          clipped.push(
            fromKm(km1.x + t * (km2.x - km1.x), km1.y + t * (km2.y - km1.y)),
          );
        }
      }
    } else {
      if (dist2 <= R) {
        const roots = getSegmentCircleIntersection(
          km1.x,
          km1.y,
          km2.x,
          km2.y,
          R,
        );
        if (roots.length > 0) {
          const t = roots[0];
          clipped.push(
            fromKm(km1.x + t * (km2.x - km1.x), km1.y + t * (km2.y - km1.y)),
          );
        }
        clipped.push(p2);
      } else {
        const roots = getSegmentCircleIntersection(
          km1.x,
          km1.y,
          km2.x,
          km2.y,
          R,
        );
        if (roots.length >= 2) {
          const t1 = roots[0];
          const t2 = roots[1];
          clipped.push(
            fromKm(km1.x + t1 * (km2.x - km1.x), km1.y + t1 * (km2.y - km1.y)),
          );
          clipped.push(
            fromKm(km1.x + t2 * (km2.x - km1.x), km1.y + t2 * (km2.y - km1.y)),
          );
        }
      }
    }
  }

  const result: [number, number][] = [];
  for (const pt of clipped) {
    if (result.length === 0) {
      result.push(pt);
    } else {
      const prev = result[result.length - 1];
      if (
        Math.abs(prev[0] - pt[0]) > 1e-7 ||
        Math.abs(prev[1] - pt[1]) > 1e-7
      ) {
        result.push(pt);
      }
    }
  }

  if (isClosed && result.length >= 3) {
    const first = result[0];
    const last = result[result.length - 1];
    if (
      Math.abs(first[0] - last[0]) > 1e-7 ||
      Math.abs(first[1] - last[1]) > 1e-7
    ) {
      result.push(first);
    }
  }

  return result;
}

export function clipFeatureToCircle(
  feature: CustomGeoJsonFeature,
  center: [number, number],
  radiusKm: number,
): CustomGeoJsonFeature | null {
  if (!feature || !feature.geometry) return null;
  const { type, coordinates } = feature.geometry;
  const [centerLat, centerLng] = center;

  const clipRing = (ring: unknown[]) =>
    clipRingToCircle(
      ring as [number, number][],
      centerLat,
      centerLng,
      radiusKm,
      true,
    );
  const clipLine = (line: unknown[]) =>
    clipRingToCircle(
      line as [number, number][],
      centerLat,
      centerLng,
      radiusKm,
      false,
    );

  if (type === "Point") {
    const coords = coordinates as [number, number];
    const lat = coords[1];
    const lng = coords[0];
    if (haversineKm(centerLat, centerLng, lat, lng) <= radiusKm) {
      return feature;
    }
    return null;
  }

  if (type === "LineString") {
    const coords = coordinates as [number, number][];
    const clipped = clipLine(coords);
    if (clipped.length < 2) return null;
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: clipped,
      },
    };
  }

  if (type === "MultiLineString") {
    const coords = coordinates as [number, number][][];
    const clipped = coords
      .map(clipLine)
      .filter((r: [number, number][]) => r.length >= 2);
    if (clipped.length === 0) return null;
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: clipped,
      },
    };
  }

  if (type === "Polygon") {
    const coords = coordinates as [number, number][][];
    const clipped = coords
      .map(clipRing)
      .filter((r: [number, number][]) => r.length >= 3);
    if (clipped.length === 0) return null;
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: clipped,
      },
    };
  }

  if (type === "MultiPolygon") {
    const coords = coordinates as [number, number][][][];
    const clipped = coords
      .map((poly: [number, number][][]) =>
        poly.map(clipRing).filter((r: [number, number][]) => r.length >= 3),
      )
      .filter((poly: [number, number][][]) => poly.length > 0);
    if (clipped.length === 0) return null;
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: clipped,
      },
    };
  }

  return feature;
}

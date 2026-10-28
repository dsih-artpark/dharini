import type { RegionOutline } from "./lgdRegions";

/**
 * The 6 km × 6 km cells a district or sub-district is predicted on: one
 * fixed grid for all of India, so a cell is the same cell (same id, same
 * centre) whether it is reached through Hassan or through Arkalgud, and a
 * prediction made for one is reused for the other.
 *
 * Rows are bands 6 km tall from the equator up; within a row, cells are
 * 6 km wide at that row's latitude.
 */

export const CELL_KM = 6;

const ROW_DEG = CELL_KM / 110.574;
const rowWidthDeg = (row: number) =>
  CELL_KM / (111.32 * Math.cos(((row + 0.5) * ROW_DEG * Math.PI) / 180));

export interface GridCell {
  /** "row:col" on the India-wide grid. */
  id: string;
  /** The cell's centre, which is sent to the prediction API. */
  lat: number;
  lng: number;
  /** [[south, west], [north, east]] */
  bounds: [[number, number], [number, number]];
}

/**
 * The 6 km × 6 km square centred on a point: what one prediction there
 * covers. A site or a searched place is predicted at its own point, so its
 * cell is centred on it rather than taken from the grid.
 */
export function cellAround(lat: number, lng: number): GridCell["bounds"] {
  const dLat = CELL_KM / 2 / 110.574;
  const dLng = CELL_KM / 2 / (111.32 * Math.cos((lat * Math.PI) / 180));
  return [
    [lat - dLat, lng - dLng],
    [lat + dLat, lng + dLng],
  ];
}

type Position = number[]; // [lng, lat]

function inRing([lng, lat]: Position, ring: Position[]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
}

/** Every cell that intersects the outline, in row then column order. */
export function gridCells(outline: RegionOutline): GridCell[] {
  const polygons =
    outline.type === "Polygon" ? [outline.coordinates] : outline.coordinates;
  const hit = new Map<string, [number, number]>();
  const add = (row: number, col: number) =>
    hit.set(`${row}:${col}`, [row, col]);

  // Cells the border passes through: each edge, clipped to each row band
  // it crosses, covers the columns between its ends in that band
  let south = Infinity;
  let north = -Infinity;
  let west = Infinity;
  let east = -Infinity;
  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (let i = 1; i < ring.length; i++) {
        const [x1, y1] = ring[i - 1];
        const [x2, y2] = ring[i];
        south = Math.min(south, y2);
        north = Math.max(north, y2);
        west = Math.min(west, x2);
        east = Math.max(east, x2);
        const firstRow = Math.floor(Math.min(y1, y2) / ROW_DEG);
        const lastRow = Math.floor(Math.max(y1, y2) / ROW_DEG);
        for (let row = firstRow; row <= lastRow; row++) {
          let t0 = 0;
          let t1 = 1;
          if (y1 !== y2) {
            const ta = (row * ROW_DEG - y1) / (y2 - y1);
            const tb = ((row + 1) * ROW_DEG - y1) / (y2 - y1);
            t0 = Math.max(0, Math.min(ta, tb));
            t1 = Math.min(1, Math.max(ta, tb));
            if (t0 > t1) continue;
          }
          const xa = x1 + (x2 - x1) * t0;
          const xb = x1 + (x2 - x1) * t1;
          const width = rowWidthDeg(row);
          const lastCol = Math.floor(Math.max(xa, xb) / width);
          for (
            let col = Math.floor(Math.min(xa, xb) / width);
            col <= lastCol;
            col++
          ) {
            add(row, col);
          }
        }
      }
    }
  }

  // Cells wholly inside: the border doesn't touch them, so their centre is
  // inside an outer ring and not in a hole
  const isInside = (p: Position) =>
    polygons.some(
      ([outer, ...holes]) =>
        inRing(p, outer) && !holes.some((h) => inRing(p, h)),
    );
  for (
    let row = Math.floor(south / ROW_DEG);
    row <= Math.floor(north / ROW_DEG);
    row++
  ) {
    const width = rowWidthDeg(row);
    const lat = (row + 0.5) * ROW_DEG;
    for (
      let col = Math.floor(west / width);
      col <= Math.floor(east / width);
      col++
    ) {
      if (!hit.has(`${row}:${col}`) && isInside([(col + 0.5) * width, lat])) {
        add(row, col);
      }
    }
  }

  return Array.from(hit.values())
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .map(([row, col]) => {
      const width = rowWidthDeg(row);
      const s = row * ROW_DEG;
      const w = col * width;
      return {
        id: `${row}:${col}`,
        lat: +(s + ROW_DEG / 2).toFixed(4),
        lng: +(w + width / 2).toFixed(4),
        bounds: [
          [s, w],
          [s + ROW_DEG, w + width],
        ],
      };
    });
}

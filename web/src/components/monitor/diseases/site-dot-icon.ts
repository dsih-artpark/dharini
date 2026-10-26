import type * as Leaflet from "leaflet";

// Sample counts a site's dot is drawn from
export type SiteDotCounts = {
  totalSampleCount?: number;
  totalPositiveSampleCount?: number;
  totalNegativeSampleCount?: number;
};

/**
 * A site's dot on the Geospatial Distribution map, shared with the GeoLens
 * surveillance layer so both maps draw sites the same way: a light-blue
 * ring sized by total samples, a yellow disc inside when the site has
 * negatives and a red core when it has positives. Leaflet is passed in
 * because GeoLens loads it on the client only.
 */
export const createSiteDotIcon = (L: typeof Leaflet, site: SiteDotCounts) => {
  const total = site.totalSampleCount || 0;
  const neg = site.totalNegativeSampleCount || 0;
  const pos = site.totalPositiveSampleCount || 0;

  const minSize = 8;
  const maxSize = 20;
  const scaleFactor = Math.log(total + 1) * 8;
  const size = Math.min(Math.max(minSize + scaleFactor, minSize), maxSize);

  const yellowSize = size * 0.7;
  const redSize = size * 0.4;

  let html = `<div class="relative rounded-full bg-blue-200 border border-blue-400 flex items-center justify-center shadow-sm" style="width: ${size}px; height: ${size}px;">`;

  if (neg > 0) {
    html += `<div class="rounded-full bg-yellow-400 border border-yellow-500 flex items-center justify-center" style="width: ${yellowSize}px; height: ${yellowSize}px;">`;
  }

  if (pos > 0) {
    if (neg > 0) {
      html += `<div class="rounded-full bg-red-600 border border-red-700" style="width: ${redSize}px; height: ${redSize}px;"></div>`;
      html += `</div>`;
    } else {
      html += `<div class="rounded-full bg-red-600 border border-red-700" style="width: ${redSize}px; height: ${redSize}px;"></div>`;
    }
  } else if (neg > 0) {
    html += `</div>`;
  }

  html += `</div>`;

  return L.divIcon({
    className: "custom-nested-marker",
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

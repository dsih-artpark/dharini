"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { FeatureCollection } from "geojson";
import { ExploreSite } from "@/src/types/site";
import Spinner from "@/src/components/ui/spinner";

type MapProps = {
  width: number;
  height: number;
  geoJson?: FeatureCollection;
  mapData: { zoom: number; x: number; y: number };
  exploreSiteData?: ExploreSite;
  loading: boolean;
  rerenderMap: boolean;
};

export default function SiteMap({
  width,
  height,
  geoJson,
  mapData,
  exploreSiteData,
  loading,
  rerenderMap,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const ZOOM_FACTOR = mapData.zoom ?? 1.2;
  const SHIFT_X = (mapData.x ?? 0) * ZOOM_FACTOR;
  const SHIFT_Y = (mapData.y ?? 0) * ZOOM_FACTOR;

  useEffect(() => {
    if (!svgRef.current || rerenderMap) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!geoJson) return;

    // Append tooltip div
    const tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("color", "#fff")
      .style("padding", "8px")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    // Fit projection to the container size
    const projection = d3.geoMercator().fitSize([width, height], geoJson);

    // Apply zoom by increasing the scale
    const [x, y] = projection.translate()!;
    projection
      .scale(projection.scale() * ZOOM_FACTOR)
      .translate([x - SHIFT_X, y - SHIFT_Y]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Draw paths
    svg
      .selectAll("path")
      .data(geoJson.features)
      .join("path")
      .attr("d", pathGenerator)
      .attr("fill-opacity", 0)
      .attr("stroke", "#889096")
      .attr("strokeWidth", 1);

    const regions: {
      lat: number;
      lng: number;
      color: string;
      siteName: string;
      totalSampleCount?: number;
      totalPositiveSampleCount?: number;
      shortName?: string;
    }[] = [];
    // For each disease
    exploreSiteData?.siteData.forEach((site) => {
      if (site) {
        site.positiveSitesCoordinates?.map((c) => {
          regions.push({
            lat: c.coordinates?.coordinates[1],
            lng: c.coordinates?.coordinates[0],
            color: site.color ?? "",
            totalPositiveSampleCount: c.totalPositiveSampleCount,
            totalSampleCount: c.totalSampleCount,
            siteName: c.siteName,
            shortName: site.shortName,
          });
        });
      }
    });

    exploreSiteData?.diseaseFreeSitesCoordinates.forEach((c) => {
      if (c) {
        regions.push({
          lat: c.coordinates?.coordinates[1],
          lng: c.coordinates?.coordinates[0],
          color: "#B7BDC2",
          siteName: c.siteName,
          totalPositiveSampleCount: c.totalPositiveSampleCount,
          totalSampleCount: c.totalSampleCount,
        });
      }
    });

    // Draw points
    svg
      .selectAll("circle")
      .data(regions)
      .enter()
      .append("circle")
      .attr("cx", (d) => {
        const projected = projection([d.lng, d.lat]) || [0, 0];
        return projected[0];
      })
      .attr("cy", (d) => {
        const projected = projection([d.lng, d.lat]) || [0, 0];
        return projected[1];
      })
      .attr("r", 5)
      .attr("fill", (d) => d.color ?? "red")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 8);
        tooltip
          .style("visibility", "visible")
          .style("left", `${event.offsetX + 10}px`)
          .style("top", `${event.offsetY - 20}px`).html(`
            <div style="width: 200px; background-color: #11181c; padding: 12px; border-radius: 4px; display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                <h4 style="color: white; font-size: 16px; font-family: 'Noto Serif', serif; font-weight: 600; line-height: 1.25;">
                  ${d.siteName ?? ""}
                </h4>
                ${
                  d.shortName
                    ? `<div
                      style="display: flex; justify-content: center; align-items: center; padding: 4px 8px; border-radius: 4px; background-color: ${d.color};"
                    >
                      <p style="color: #fff; font-size: 10px; text-transform: uppercase; line-height: 15px; letter-spacing: -0.5px;">
                        ${d.shortName}
                      </p>
                    </div>`
                    : ""
                }
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%;">
                <p style="color: white; font-size: 14px; line-height: 21px;">
                  ${d.totalPositiveSampleCount ?? 0} Positive Samples
                </p>
                <p style="color: #666; font-size: 12px; line-height: 18px;">
                  ${d.totalSampleCount ?? 0} Total
                </p>
              </div>
            </div>
          `);
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("r", 5)
          .attr("fill", (d) => (d as { color?: string }).color ?? "red");
        tooltip.style("visibility", "hidden");
      });
  }, [geoJson, width, height, rerenderMap]);

  return (
    <div className="relative flex items-center justify-center grow">
      {!geoJson ? (
        loading ? (
          <Spinner />
        ) : (
          <p className="text-center">
            Map not available for the selected location
          </p>
        )
      ) : (
        <>
          <svg ref={svgRef} width={width} height={height} />
          <div ref={tooltipRef} className="absolute z-10"></div>
        </>
      )}
    </div>
  );
}

import { Minus, Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { CHANCE_BINS, GRID_BINS } from "../compare/forecastGrid";
import { RISK_STATUS, type RiskStatus } from "../risk/useRiskPrediction";
import { SITE_COLORS } from "../tabs/CompareTab";

export type LegendMode = "default" | "risk";

interface MapLegendProps {
  mode: LegendMode;
  showSurveillance: boolean;
  showPoultry: boolean;
  showCattle: boolean;
  showBufferWetlands: boolean;
  showHeatmap: boolean;
  bufferActive: boolean;
  hasSiteA: boolean;
  hasSiteB: boolean;
  hasSearchPin: boolean;
  /** Compare: the forecast grid is on the map, thresholded at this chance,
   *  for every species (of one group, when named) or only the one named. */
  forecastGrid?: {
    minChance: number;
    species: string | null;
    guild: string | null;
  } | null;
  /** Risk Map: the results drawn (a place's, or a region's cells'). */
  riskStatuses?: RiskStatus[];
}

function Dot({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3 w-3 flex-shrink-0 rounded-full"
      style={{ background: color }}
    />
  );
}

function Row({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex w-4 justify-center">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

/**
 * Bottom-left map legend (the map's bottom overlay places it). Lists only
 * what is drawn on the map right now.
 */
export function MapLegend(props: MapLegendProps) {
  const {
    mode,
    showSurveillance,
    showPoultry,
    showCattle,
    showBufferWetlands,
    showHeatmap,
    bufferActive,
    hasSiteA,
    hasSiteB,
    hasSearchPin,
    forecastGrid = null,
    riskStatuses = [],
  } = props;
  const [open, setOpen] = useState(true);

  const title = mode === "risk" ? "Predicted risk" : "Legend";

  // Layers picked in the Layers tab; listed wherever they are drawn.
  const layerRows: React.ReactNode[] = [];
  if (showSurveillance) {
    layerRows.push(
      <Row
        key="surv"
        // Same dot as the map's (see site-dot-icon.ts)
        icon={
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-blue-400 bg-blue-200 shadow-sm">
            <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full border border-yellow-500 bg-yellow-400">
              <span className="h-1.5 w-1.5 rounded-full border border-red-700 bg-red-600" />
            </span>
          </span>
        }
      >
        Surveillance site
        <span className="block text-[11px] text-grey-60">
          Yellow: negative · red: positive · size: samples
        </span>
      </Row>,
    );
  }
  if (showPoultry)
    layerRows.push(
      <Row key="farm" icon="🐔">
        Poultry farm
      </Row>,
    );
  if (showCattle)
    layerRows.push(
      <Row key="cattle" icon="🐄">
        Cattle market
      </Row>,
    );

  const rows: React.ReactNode[] = [];
  if (mode === "risk") {
    for (const s of riskStatuses)
      rows.push(
        <Row key={s} icon={<Dot color={RISK_STATUS[s].color} />}>
          {RISK_STATUS[s].label}
        </Row>,
      );
  } else {
    // Compare forecast grid: species clearing the minimum chance per cell,
    // or one picked species' chance, as one colour ramp labelled at its ends
    // (each step's own label on hover). A chance's ends are in words, the
    // species card's (Unlikely below 30%, Very likely from 90%).
    if (forecastGrid) {
      const bins = [
        ...(forecastGrid.species ? CHANCE_BINS : GRID_BINS),
      ].reverse();
      const [low, high] = forecastGrid.species
        ? ["Unlikely", "Very likely"]
        : [bins[0].label, bins[bins.length - 1].label];
      rows.push(
        <div key="grid" className="flex flex-col gap-1">
          <span className="font-semibold">
            {forecastGrid.species
              ? `${forecastGrid.species} · chance ≥ ${forecastGrid.minChance}%`
              : `${forecastGrid.guild ? `${forecastGrid.guild} · species` : "Species"} ≥ ${forecastGrid.minChance}%`}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] tabular-nums text-grey-70">
            <span>{low}</span>
            <span className="flex gap-0.5">
              {bins.map((bin) => (
                <span
                  key={bin.label}
                  title={bin.label}
                  className="h-2 w-5 rounded-full"
                  style={{ background: bin.color }}
                />
              ))}
            </span>
            <span>{high}</span>
          </div>
        </div>,
      );
    }
    rows.push(...layerRows);
    if (bufferActive && showBufferWetlands) {
      rows.push(
        <Row
          key="wet"
          icon={
            <span className="h-3 w-4 rounded-full border-[1.5px] border-[#2980b9] bg-[#3498db]/30" />
          }
        >
          Wetland in buffer
        </Row>,
      );
    }
    if (bufferActive && showHeatmap) {
      rows.push(
        <div key="heat" className="flex flex-col gap-0.5">
          <span>Bird density</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Low</span>
            <span className="h-2 flex-1 rounded bg-gradient-to-r from-[#3498db] via-[#f1c40f] to-[#e74c3c]" />
            <span className="text-[11px]">High</span>
          </div>
        </div>,
      );
    }
    // Both sites share one line
    if (hasSiteA || hasSiteB)
      rows.push(
        <div key="sites" className="flex flex-wrap gap-x-3 gap-y-1">
          {(
            [
              ["A", hasSiteA],
              ["B", hasSiteB],
            ] as const
          )
            .filter(([, has]) => has)
            .map(([slot]) => (
              <span key={slot} className="flex items-center gap-1.5">
                <Dot color={SITE_COLORS[slot]} />
                Site {slot}
                {bufferActive ? " + buffer" : ""}
              </span>
            ))}
        </div>,
      );
    if (hasSearchPin)
      rows.push(
        <Row key="s" icon={<Dot color="#f39c12" />}>
          Searched location
        </Row>,
      );
  }

  return (
    <div className="pointer-events-auto flex max-w-[240px] flex-col gap-1.5 rounded-xl border border-grey-20 bg-white px-3 py-2.5 text-xs text-grey-80 shadow-md">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wide text-grey-60">
          {title}
        </span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Hide legend" : "Show legend"}
          className="text-grey-60 hover:text-grey-80"
        >
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </button>
      </div>
      {open &&
        (rows.length > 0 ? (
          rows
        ) : (
          <span className="text-grey-60">
            {mode === "risk"
              ? "Choose a place to see it here."
              : "Turn on a layer to see it here."}
          </span>
        ))}
    </div>
  );
}

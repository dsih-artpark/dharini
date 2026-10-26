"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Activity,
  ArrowRight,
  BarChart2,
  Download,
  Dna,
  RefreshCw,
  Search,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type {
  DynamicGeneInfo,
  ImpactLevel,
  ParsedVcfDataset,
  ParsedVcfVariant,
} from "./vcf-parser";

interface Props {
  dataset: ParsedVcfDataset;
  sampleId?: string;
  seqId?: string;
  runId?: string | null;
  onClose?: () => void;
  isModal?: boolean;
}

export function prettyEffectName(effectName: string): string {
  if (!effectName) return "Unknown";
  const name = effectName.replace(/_variant$/, "").replace(/_/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function isNoncodingEffect(effectName: string): boolean {
  const e = (effectName || "").toLowerCase();
  const noncodingKeywords = [
    "upstream",
    "downstream",
    "intergenic",
    "utr",
    "intron",
    "non_coding",
    "noncoding",
    "regulatory_region",
    "splice_region",
  ];
  return noncodingKeywords.some((k) => e.includes(k));
}

// Calmer, sophisticated, low-fatigue color palette
const SEVERITY_CONFIG: Record<
  ImpactLevel,
  {
    label: string;
    shortLabel: string;
    subtext: string;
    color: string;
    bgSubtle: string;
    borderSubtle: string;
    textSubtle: string;
    badge: string;
  }
> = {
  HIGH: {
    label: "Critical / Disruptive",
    shortLabel: "Critical",
    subtext: "Breaks or truncates viral proteins (frameshift / stop codon)",
    color: "#FB7185", // Soft Rose
    bgSubtle: "bg-rose-500/10",
    borderSubtle: "border-rose-500/20",
    textSubtle: "text-rose-300",
    badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  },
  MODERATE: {
    label: "Protein Altering",
    shortLabel: "Altered",
    subtext: "Changes amino acids (missense); may affect antibody binding",
    color: "#818CF8", // Soft Indigo
    bgSubtle: "bg-indigo-500/10",
    borderSubtle: "border-indigo-500/20",
    textSubtle: "text-indigo-300",
    badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  },
  LOW: {
    label: "Silent / Harmless",
    shortLabel: "Silent",
    subtext: "Natural background drift; does not change the protein",
    color: "#34D399", // Soft Mint / Emerald
    bgSubtle: "bg-emerald-500/10",
    borderSubtle: "border-emerald-500/20",
    textSubtle: "text-emerald-300",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  MODIFIER: {
    label: "Non-Coding",
    shortLabel: "Non-Coding",
    subtext: "Located in regions outside active genes",
    color: "#94A3B8", // Cool Slate
    bgSubtle: "bg-slate-500/10",
    borderSubtle: "border-slate-700/50",
    textSubtle: "text-slate-400",
    badge: "bg-slate-800/60 text-slate-400 border-slate-700",
  },
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";

type ViewTab = "summary" | "map";

export default function NativeGenomicVisualizer({
  dataset,
  sampleId,
  seqId,
  runId,
  onClose,
  isModal = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const minimapSvgRef = useRef<SVGSVGElement>(null);

  // Active Tab: default to simplified executive summary
  const [activeTab, setActiveTab] = useState<ViewTab>("summary");

  // Viewport zoom range [startBp, endBp]
  const [viewportRange, setViewportRange] = useState<[number, number]>([
    0,
    dataset.genomeLength || 150773,
  ]);

  // Selected filter (single severity or all)
  const [severityFilter, setSeverityFilter] = useState<ImpactLevel | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGeneName, setSelectedGeneName] = useState<string>("ALL");

  // Selection & Hover
  const [selectedVariant, setSelectedVariant] = useState<ParsedVcfVariant | null>(null);
  const [hoveredVariant, setHoveredVariant] = useState<ParsedVcfVariant | null>(null);
  const [hoveredGene, setHoveredGene] = useState<DynamicGeneInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Dimensions
  const [chartWidth, setChartWidth] = useState(1100);
  const chartHeight = 290;
  const minimapHeight = 42;
  const margin = { top: 28, right: 28, bottom: 48, left: 48 };

  // Observe container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 200) {
          setChartWidth(Math.floor(entry.contentRect.width));
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Filtered dataset
  const filteredVariants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return dataset.variants.filter((v) => {
      if (severityFilter !== "ALL" && v.primaryAnnotation.impact !== severityFilter) {
        return false;
      }
      if (selectedGeneName !== "ALL" && v.primaryAnnotation.geneName !== selectedGeneName) {
        return false;
      }
      if (q) {
        const gene = (v.primaryAnnotation.geneName || "").toLowerCase();
        const effect = (v.primaryAnnotation.effect || "").toLowerCase();
        const hgvsP = (v.primaryAnnotation.hgvsP || "").toLowerCase();
        const posStr = String(v.pos);
        return (
          gene.includes(q) ||
          effect.includes(q) ||
          hgvsP.includes(q) ||
          posStr.includes(q)
        );
      }
      return true;
    });
  }, [dataset.variants, severityFilter, selectedGeneName, searchQuery]);

  // Ranked genes (sorted by critical disruptions first)
  const rankedGenes = useMemo(() => {
    return [...dataset.genes].sort((a, b) => {
      if (b.impactCounts.HIGH !== a.impactCounts.HIGH) {
        return b.impactCounts.HIGH - a.impactCounts.HIGH;
      }
      if (b.impactCounts.MODERATE !== a.impactCounts.MODERATE) {
        return b.impactCounts.MODERATE - a.impactCounts.MODERATE;
      }
      return b.variantCount - a.variantCount;
    });
  }, [dataset.genes]);

  // Zoom handlers
  const handleZoom = useCallback(
    (factor: number) => {
      setViewportRange(([start, end]) => {
        const span = end - start;
        const center = (start + end) / 2;
        const newSpan = Math.max(300, Math.min(dataset.genomeLength, span * factor));
        const newStart = Math.max(0, center - newSpan / 2);
        const newEnd = Math.min(dataset.genomeLength, newStart + newSpan);
        return [Math.round(newStart), Math.round(newEnd)];
      });
    },
    [dataset.genomeLength]
  );

  const handleResetZoom = useCallback(() => {
    setViewportRange([0, dataset.genomeLength]);
    setSelectedGeneName("ALL");
  }, [dataset.genomeLength]);

  const handleZoomToGene = useCallback(
    (geneName: string) => {
      setSelectedGeneName(geneName);
      if (geneName === "ALL") {
        handleResetZoom();
        return;
      }
      const gene = dataset.genes.find((g) => g.name === geneName);
      if (gene) {
        const padding = Math.max(400, (gene.end - gene.start) * 0.5);
        const newStart = Math.max(0, gene.start - padding);
        const newEnd = Math.min(dataset.genomeLength, gene.end + padding);
        setViewportRange([Math.round(newStart), Math.round(newEnd)]);
      }
    },
    [dataset.genes, dataset.genomeLength, handleResetZoom]
  );

  // Scales
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain(viewportRange)
      .range([margin.left, chartWidth - margin.right]);
  }, [viewportRange, chartWidth, margin.left, margin.right]);

  const minimapScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, dataset.genomeLength])
      .range([margin.left, chartWidth - margin.right]);
  }, [dataset.genomeLength, chartWidth, margin.left, margin.right]);

  const maxVisibleDepth = useMemo(() => {
    return Math.max(
      20,
      dataset.stats.maxDepth || 30,
      ...filteredVariants.map((v) => v.depth || 0)
    );
  }, [dataset.stats.maxDepth, filteredVariants]);

  const yScale = useMemo(() => {
    const plotTop = margin.top + 10;
    const plotBottom = chartHeight - margin.bottom - 20;
    return d3
      .scaleLinear()
      .domain([0, maxVisibleDepth * 1.15])
      .range([plotBottom, plotTop]);
  }, [maxVisibleDepth, margin.top, margin.bottom, chartHeight]);

  const baselineY = chartHeight - margin.bottom - 20;

  // D3 Axis & Minimap Brush
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.max(4, Math.floor(chartWidth / 140)))
      .tickFormat((d) => {
        const n = d.valueOf();
        if (n >= 1000) return `${(n / 1000).toFixed(0)}k bp`;
        return `${n} bp`;
      });

    svg
      .select<SVGGElement>(".main-x-axis")
      .call(xAxis)
      .call((g) => g.select(".domain").attr("stroke", "#334155").attr("stroke-width", 1))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#1E293B"))
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "#64748B")
          .attr("font-size", "11px")
          .attr("font-weight", "500")
      );

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(3)
      .tickFormat((d) => `${d.valueOf()}x`);

    svg
      .select<SVGGElement>(".main-y-axis")
      .call(yAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .attr("stroke", "#1E293B")
          .attr("x2", chartWidth - margin.left - margin.right)
      )
      .call((g) =>
        g.selectAll(".tick text").attr("fill", "#475569").attr("font-size", "10px")
      );
  }, [xScale, yScale, chartWidth, margin.left, margin.right]);

  // Minimap brush
  useEffect(() => {
    if (!minimapSvgRef.current) return;
    const miniSvg = d3.select(minimapSvgRef.current);

    const brush = d3
      .brushX()
      .extent([
        [margin.left, 2],
        [chartWidth - margin.right, minimapHeight - 2],
      ])
      .on("brush end", (event) => {
        if (!event.sourceEvent || !event.selection) return;
        const [x0, x1] = event.selection;
        const newStart = Math.max(0, minimapScale.invert(x0));
        const newEnd = Math.min(dataset.genomeLength, minimapScale.invert(x1));
        if (newEnd - newStart > 50) {
          setViewportRange([Math.round(newStart), Math.round(newEnd)]);
        }
      });

    const brushG = miniSvg.select<SVGGElement>(".minimap-brush-group");
    brushG.call(brush);

    const currentX0 = minimapScale(viewportRange[0]);
    const currentX1 = minimapScale(viewportRange[1]);
    brushG.call(brush.move, [currentX0, currentX1]);
  }, [minimapScale, viewportRange, chartWidth, dataset.genomeLength, margin.left, margin.right, minimapHeight]);

  const handleExportSvg = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `genomic_variants_${sampleId || "run"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const visibleGenes = useMemo(() => {
    const [vStart, vEnd] = viewportRange;
    return dataset.genes.filter((g) => g.end >= vStart && g.start <= vEnd);
  }, [dataset.genes, viewportRange]);

  // Overall counts & percentage
  const totalVariants = dataset.stats.total || 1;
  const highCount = dataset.stats.byImpact.HIGH || 0;
  const modCount = dataset.stats.byImpact.MODERATE || 0;
  const lowCount = dataset.stats.byImpact.LOW || 0;
  const modifierCount = dataset.stats.byImpact.MODIFIER || 0;

  const highPct = Math.round((highCount / totalVariants) * 100);
  const modPct = Math.round((modCount / totalVariants) * 100);
  const lowPct = Math.round((lowCount / totalVariants) * 100);
  const modifierPct = Math.max(0, 100 - highPct - modPct - lowPct);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full flex-col bg-[#0B0F17] text-slate-200 font-sans selection:bg-indigo-500/30"
    >
      {/* 1. Header Bar: Minimal, Informative & Calm */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-[#0F172A]/70 px-6 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Dna className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-tight text-white">
                Genomic Variant Analysis
              </h2>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                {dataset.chrom} ({(dataset.genomeLength / 1000).toFixed(1)} kb)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {sampleId ? `Sample ${sampleId}` : "Sequencing Run"}
              {seqId ? ` · ${seqId}` : ""}
              {runId ? ` · Run ID: ${runId.slice(0, 8)}...` : ""}
            </p>
          </div>
        </div>

        {/* Tab Switcher: Simple vs Deep Dive */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-slate-800 bg-[#0B0F17] p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === "summary"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              Executive Summary
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === "map"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              Genome Map & Table
            </button>
          </div>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition ${FOCUS_RING}`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Prominent Ratio & Severity Header */}
      <div className="border-b border-slate-800/80 bg-[#0F172A]/70 px-6 py-3.5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Total Stat Badge */}
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                {dataset.stats.total} Total Mutations
              </span>
              <span className="rounded-lg bg-slate-800/80 border border-slate-700/60 px-2.5 py-1.5 text-xs font-medium text-slate-300">
                Confidence: <strong className="text-white font-mono">{dataset.stats.meanDepth}x</strong> coverage
              </span>
            </div>

            {/* Prominent Clickable Severity Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSeverityFilter(severityFilter === "HIGH" ? "ALL" : "HIGH");
                  setActiveTab("map");
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${
                  severityFilter === "HIGH"
                    ? "bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20"
                    : "bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span>Critical: {highCount}</span>
                <span className="text-[10px] opacity-80 font-normal">({highPct}%)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSeverityFilter(severityFilter === "MODERATE" ? "ALL" : "MODERATE");
                  setActiveTab("map");
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${
                  severityFilter === "MODERATE"
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20"
                    : "bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                <span>Altered: {modCount}</span>
                <span className="text-[10px] opacity-80 font-normal">({modPct}%)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSeverityFilter(severityFilter === "LOW" ? "ALL" : "LOW");
                  setActiveTab("map");
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${
                  severityFilter === "LOW"
                    ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20"
                    : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Silent: {lowCount}</span>
                <span className="text-[10px] opacity-80 font-normal">({lowPct}%)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSeverityFilter(severityFilter === "MODIFIER" ? "ALL" : "MODIFIER");
                  setActiveTab("map");
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${
                  severityFilter === "MODIFIER"
                    ? "bg-slate-700 text-white border-slate-500 shadow-md"
                    : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span>Non-Coding: {modifierCount}</span>
                <span className="text-[10px] opacity-80 font-normal">({modifierPct}%)</span>
              </button>
            </div>
          </div>

          {/* Clean Segmented Proportion Bar */}
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-800/90 shadow-inner">
            {highCount > 0 && (
              <div
                style={{ width: `${highPct}%`, backgroundColor: SEVERITY_CONFIG.HIGH.color }}
                title={`Critical: ${highCount} (${highPct}%)`}
                className="transition-all hover:opacity-90"
              />
            )}
            {modCount > 0 && (
              <div
                style={{ width: `${modPct}%`, backgroundColor: SEVERITY_CONFIG.MODERATE.color }}
                title={`Altered: ${modCount} (${modPct}%)`}
                className="transition-all hover:opacity-90"
              />
            )}
            {lowCount > 0 && (
              <div
                style={{ width: `${lowPct}%`, backgroundColor: SEVERITY_CONFIG.LOW.color }}
                title={`Silent: ${lowCount} (${lowPct}%)`}
                className="transition-all hover:opacity-90"
              />
            )}
            {modifierCount > 0 && (
              <div
                style={{ width: `${modifierPct}%`, backgroundColor: SEVERITY_CONFIG.MODIFIER.color }}
                title={`Non-Coding: ${modifierCount} (${modifierPct}%)`}
                className="transition-all hover:opacity-90"
              />
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Workspace */}
      <div className="relative flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* TAB 1: Executive Plain-Language Summary */}
        {activeTab === "summary" && (
          <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
            {/* Key Clinical Takeaways */}
            <div className="rounded-xl border border-slate-800 bg-[#0F172A]/80 p-5 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Key Findings at a Glance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-rose-300">Disrupted Genes</span>
                      <span className="text-base font-bold text-rose-200 font-mono">{highCount}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      {highCount > 0
                        ? `${highCount} mutations significantly disrupt viral protein reading frames (frameshifts / stops).`
                        : "No critical protein disruption detected."}
                    </p>
                  </div>
                  {highCount > 0 && (
                    <div className="mt-3 pt-2 border-t border-rose-500/15 text-[11px] text-rose-300/80">
                      Primary targets: {rankedGenes.filter((g) => g.impactCounts.HIGH > 0).slice(0, 3).map((g) => g.name).join(", ")}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-indigo-300">Altered Proteins</span>
                      <span className="text-base font-bold text-indigo-200 font-mono">{modCount}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      {modCount} missense mutations alter amino acid sequences, which may modify viral behavior or antigenicity.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-indigo-500/15 text-[11px] text-indigo-300/80">
                    Spans {dataset.genes.length} distinct viral genes
                  </div>
                </div>

                <div className="rounded-lg border border-slate-700/60 bg-slate-800/30 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-300">Sequencing Quality</span>
                      <span className="text-base font-bold text-slate-100 font-mono">{dataset.stats.meanDepth}x</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      High-confidence sequencing verified across {dataset.stats.snpCount} SNPs and {dataset.stats.indelCount} Indels.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-700/40 text-[11px] text-slate-400">
                    Genome span: 150,773 base pairs
                  </div>
                </div>
              </div>
            </div>

            {/* Most Mutated Viral Genes */}
            <div className="rounded-xl border border-slate-800 bg-[#0F172A]/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Impacted Viral Genes Leaderboard
                  </h3>
                  <p className="text-xs text-slate-400">
                    Genes with the highest concentration of functional changes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("map")}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                >
                  View on Genome Map <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {rankedGenes.slice(0, 8).map((gene) => {
                  const hasHigh = gene.impactCounts.HIGH > 0;
                  const hasMod = gene.impactCounts.MODERATE > 0;

                  return (
                    <div
                      key={gene.name}
                      onClick={() => {
                        handleZoomToGene(gene.name);
                        setActiveTab("map");
                      }}
                      className="group cursor-pointer rounded-lg border border-slate-800 bg-[#0B0F17] p-3.5 hover:border-indigo-500/50 hover:bg-[#0F172A] transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-white group-hover:text-indigo-300 transition">
                          {gene.name}
                        </span>
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                          {gene.variantCount} mut
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] text-slate-500 font-mono">
                        {gene.start.toLocaleString()} – {gene.end.toLocaleString()} bp
                      </p>

                      <div className="mt-3 flex items-center gap-1.5 text-[10px]">
                        {hasHigh && (
                          <span className="rounded px-1.5 py-0.5 bg-rose-500/15 text-rose-300 border border-rose-500/20 font-medium">
                            {gene.impactCounts.HIGH} Critical
                          </span>
                        )}
                        {hasMod && (
                          <span className="rounded px-1.5 py-0.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 font-medium">
                            {gene.impactCounts.MODERATE} Altered
                          </span>
                        )}
                        {!hasHigh && !hasMod && (
                          <span className="rounded px-1.5 py-0.5 bg-slate-800 text-slate-400">
                            {gene.variantCount} Silent
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Clean Genome Map & Synchronized Table */}
        {activeTab === "map" && (
          <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full">
            {/* Filter & Zoom Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#0F172A]/80 p-3 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
                {/* Search */}
                <div className="relative flex-1 min-w-[160px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search gene, mutation, position..."
                    className={`w-full rounded-lg border border-slate-700/60 bg-[#0B0F17] pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 ${FOCUS_RING}`}
                  />
                </div>

                {/* Severity Filter */}
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as ImpactLevel | "ALL")}
                  className={`rounded-lg border border-slate-700/60 bg-[#0B0F17] px-3 py-1.5 text-xs font-medium text-slate-200 ${FOCUS_RING}`}
                >
                  <option value="ALL">All Severities ({dataset.stats.total})</option>
                  <option value="HIGH">Critical ({highCount})</option>
                  <option value="MODERATE">Altered ({modCount})</option>
                  <option value="LOW">Silent ({lowCount})</option>
                  <option value="MODIFIER">Non-Coding ({modifierCount})</option>
                </select>

                {/* Jump to Gene */}
                <select
                  value={selectedGeneName}
                  onChange={(e) => handleZoomToGene(e.target.value)}
                  className={`rounded-lg border border-slate-700/60 bg-[#0B0F17] px-3 py-1.5 text-xs font-medium text-slate-200 ${FOCUS_RING}`}
                >
                  <option value="ALL">Jump to Gene ({dataset.genes.length})</option>
                  {dataset.genes.map((g) => (
                    <option key={g.name} value={g.name}>
                      {g.name} ({g.variantCount} mut)
                    </option>
                  ))}
                </select>
              </div>

              {/* Zoom & Export */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 rounded-lg border border-slate-800 bg-[#0B0F17] p-0.5">
                  <button
                    type="button"
                    onClick={() => handleZoom(0.6)}
                    title="Zoom in"
                    className={`p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white ${FOCUS_RING}`}
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleZoom(1.5)}
                    title="Zoom out"
                    className={`p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white ${FOCUS_RING}`}
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 ${FOCUS_RING}`}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleExportSvg}
                  title="Export Chart SVG"
                  className="rounded-lg border border-slate-800 bg-[#0B0F17] hover:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 flex items-center gap-1 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  SVG
                </button>
              </div>
            </div>

            {/* Interactive Scatter Genome Map Card */}
            <div className="rounded-xl border border-slate-800 bg-[#0F172A]/80 p-4 shadow-sm relative">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-medium">Legend:</span>
                  <span className="flex items-center gap-1.5 text-rose-300">
                    <span className="h-2 w-2 rounded-full bg-rose-400" /> Critical
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-300">
                    <span className="h-2 w-2 rounded-full bg-indigo-400" /> Altered
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> Silent
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-slate-500" /> Non-Coding
                  </span>
                </div>
                <span className="font-mono text-slate-400">
                  Window: {viewportRange[0].toLocaleString()} – {viewportRange[1].toLocaleString()} bp
                </span>
              </div>

              {/* Chart SVG wrapper */}
              <div className="relative w-full select-none bg-[#0B0F17] rounded-lg border border-slate-800/80">
                <svg
                  ref={svgRef}
                  width="100%"
                  height={chartHeight}
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full overflow-visible"
                  onMouseLeave={() => {
                    setHoveredVariant(null);
                    setTooltipPos(null);
                  }}
                >
                  <g className="main-y-axis" transform={`translate(${margin.left}, 0)`} />
                  <g className="main-x-axis" transform={`translate(0, ${baselineY})`} />

                  {/* Genome Track Line */}
                  <line
                    x1={margin.left}
                    x2={chartWidth - margin.right}
                    y1={baselineY}
                    y2={baselineY}
                    stroke="#334155"
                    strokeWidth="1.5"
                  />

                  {/* Gene Spans */}
                  <g className="gene-annotations-group">
                    {visibleGenes.map((gene) => {
                      const gx0 = Math.max(margin.left, xScale(gene.start));
                      const gx1 = Math.min(chartWidth - margin.right, xScale(gene.end));
                      const width = Math.max(6, gx1 - gx0);
                      const isHovered = hoveredGene?.name === gene.name;
                      const hasHigh = gene.impactCounts.HIGH > 0;
                      const hasMod = gene.impactCounts.MODERATE > 0;

                      let fill = "#1E293B";
                      let stroke = "#334155";
                      if (hasHigh) {
                        fill = "rgba(251, 113, 133, 0.15)";
                        stroke = "rgba(251, 113, 133, 0.4)";
                      } else if (hasMod) {
                        fill = "rgba(129, 140, 248, 0.15)";
                        stroke = "rgba(129, 140, 248, 0.4)";
                      }

                      return (
                        <g
                          key={gene.name}
                          className="cursor-pointer"
                          onClick={() => handleZoomToGene(gene.name)}
                          onMouseEnter={() => setHoveredGene(gene)}
                          onMouseLeave={() => setHoveredGene(null)}
                        >
                          <rect
                            x={gx0}
                            y={baselineY + 8}
                            width={width}
                            height={16}
                            rx={4}
                            fill={fill}
                            stroke={stroke}
                            strokeWidth={isHovered ? 1.5 : 1}
                          />
                          {width > 32 && (
                            <text
                              x={gx0 + width / 2}
                              y={baselineY + 20}
                              textAnchor="middle"
                              fontSize="9px"
                              fontWeight="600"
                              fill="#94A3B8"
                              className="pointer-events-none font-mono"
                            >
                              {gene.name}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {/* Clean Scatter Circles (no messy comb stems) */}
                  <g className="variants-scatter-group">
                    {filteredVariants.map((v) => {
                      const cx = xScale(v.pos);
                      if (cx < margin.left - 10 || cx > chartWidth - margin.right + 10) {
                        return null;
                      }

                      const cy = yScale(v.depth || 15);
                      const isSelected = selectedVariant?.id === v.id;
                      const isHovered = hoveredVariant?.id === v.id;
                      const config = SEVERITY_CONFIG[v.primaryAnnotation.impact];

                      return (
                        <g key={v.id}>
                          {/* Invisible larger hit target to make hovering smooth & non-flickering */}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={10}
                            fill="transparent"
                            className="cursor-pointer"
                            onClick={() => setSelectedVariant(v)}
                            onMouseEnter={() => {
                              setHoveredVariant(v);
                              setTooltipPos({ x: cx, y: cy });
                            }}
                          />
                          {/* Visual Circle */}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isSelected || isHovered ? 6.5 : 4.5}
                            fill={config.color}
                            fillOpacity={0.9}
                            stroke={isSelected || isHovered ? "#FFFFFF" : "rgba(0,0,0,0.5)"}
                            strokeWidth={isSelected || isHovered ? 2 : 0.8}
                            className="pointer-events-none transition-all duration-100"
                          />
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {/* Rock-Solid Floating Tooltip (Never cuts off, never flickers) */}
                {hoveredVariant && tooltipPos && (
                  <div
                    className="pointer-events-none absolute z-50 rounded-lg border border-slate-700 bg-[#0F172A]/95 p-3 text-xs shadow-2xl backdrop-blur-md text-slate-200 min-w-[210px]"
                    style={{
                      left: Math.max(12, Math.min(chartWidth - 250, tooltipPos.x - 105)),
                      top:
                        tooltipPos.y > 150
                          ? Math.max(8, tooltipPos.y - 145)
                          : tooltipPos.y + 16,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5 mb-1.5">
                      <span className="font-semibold text-white">
                        {hoveredVariant.pos.toLocaleString()} bp
                      </span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${SEVERITY_CONFIG[hoveredVariant.primaryAnnotation.impact].badge}`}>
                        {SEVERITY_CONFIG[hoveredVariant.primaryAnnotation.impact].shortLabel}
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <p className="flex items-center justify-between">
                        <span className="text-slate-400">Mutation:</span>
                        <span className="font-mono font-bold text-white">{hoveredVariant.ref} → {hoveredVariant.alt}</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-slate-400">Gene:</span>
                        <span className="font-semibold text-indigo-300">{hoveredVariant.primaryAnnotation.geneName}</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-slate-400">Effect:</span>
                        <span className="text-slate-300">{prettyEffectName(hoveredVariant.primaryAnnotation.effect)}</span>
                      </p>
                      {hoveredVariant.primaryAnnotation.hgvsP && (
                        <p className="flex items-center justify-between">
                          <span className="text-slate-400">Protein:</span>
                          <span className="font-mono text-indigo-300">{hoveredVariant.primaryAnnotation.hgvsP}</span>
                        </p>
                      )}
                      <p className="flex items-center justify-between pt-0.5 border-t border-slate-800/80 text-[10px] text-slate-400">
                        <span>Depth / Conf:</span>
                        <span className="font-mono font-medium text-slate-300">{hoveredVariant.depth ?? "—"}x</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Minimap Overview */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Full Genome Overview (0 — 150.8 kb)</span>
                  <span>Drag box to pan</span>
                </div>
                <div className="relative rounded-md border border-slate-800 bg-[#0B0F17] p-1">
                  <svg
                    ref={minimapSvgRef}
                    width="100%"
                    height={minimapHeight}
                    viewBox={`0 0 ${chartWidth} ${minimapHeight}`}
                    className="w-full"
                  >
                    {dataset.variants.map((v) => (
                      <circle
                        key={v.id}
                        cx={minimapScale(v.pos)}
                        cy={21}
                        r={1.8}
                        fill={SEVERITY_CONFIG[v.primaryAnnotation.impact].color}
                        opacity={0.7}
                      />
                    ))}
                    <g className="minimap-brush-group" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Clean, Readable Variant Table */}
            <div className="rounded-xl border border-slate-800 bg-[#0F172A]/80 overflow-hidden shadow-sm">
              <div className="max-h-[380px] overflow-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead className="sticky top-0 z-10 border-b border-slate-800 bg-[#0B0F17] text-slate-400 font-medium">
                    <tr>
                      <th className="p-3">Position</th>
                      <th className="p-3">Mutation</th>
                      <th className="p-3">Gene</th>
                      <th className="p-3">Severity</th>
                      <th className="p-3">Effect</th>
                      <th className="p-3">Protein Change</th>
                      <th className="p-3">Depth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredVariants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      const config = SEVERITY_CONFIG[v.primaryAnnotation.impact];

                      return (
                        <tr
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? "bg-indigo-500/10 text-white" : "hover:bg-slate-800/40"
                          }`}
                        >
                          <td className="p-3 font-mono font-medium text-slate-200">{v.pos.toLocaleString()}</td>
                          <td className="p-3 font-mono">
                            <span className="text-slate-400">{v.ref}</span> → <span className="text-white font-bold">{v.alt}</span>
                          </td>
                          <td className="p-3 font-semibold text-slate-200">{v.primaryAnnotation.geneName}</td>
                          <td className="p-3">
                            <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium border ${config.badge}`}>
                              {config.shortLabel}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">{prettyEffectName(v.primaryAnnotation.effect)}</td>
                          <td className="p-3 font-mono text-[11px] text-indigo-300">
                            {v.primaryAnnotation.hgvsP || "—"}
                          </td>
                          <td className="p-3 text-slate-400 font-mono">{v.depth ? `${v.depth}x` : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

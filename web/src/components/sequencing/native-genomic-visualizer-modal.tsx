"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Dna, RefreshCw } from "lucide-react";
import { getArtifactUrlApi } from "@/src/app/(dashboard)/sequencing/loader";
import type {
  SequencingArtifact,
  SequencingVariant,
} from "@/src/app/(dashboard)/sequencing/sequencing-processing-types";
import NativeGenomicVisualizer from "./native-genomic-visualizer";
import {
  buildDatasetFromVariants,
  enrichDatasetWithBackendVariants,
  parseAnnotatedVcf,
  type ParsedVcfDataset,
} from "./vcf-parser";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  runId?: string | null;
  seqId?: string;
  sampleId?: string;
  artifacts?: SequencingArtifact[] | null;
  fallbackVariants?: SequencingVariant[] | null;
}

type LoadState =
  | { status: "loading"; message: string }
  | { status: "ready"; dataset: ParsedVcfDataset }
  | { status: "error"; message: string };

export default function NativeGenomicVisualizerModal({
  isOpen,
  onClose,
  jobId,
  runId,
  seqId,
  sampleId,
  artifacts,
  fallbackVariants,
}: Props) {
  const [state, setState] = useState<LoadState>({
    status: "loading",
    message: "Initializing visualizer...",
  });

  const loadData = async () => {
    setState({ status: "loading", message: "Locating annotated VCF..." });

    // Prioritize annotated VCF first (e.g. annotated.vcf)
    const vcfArtifact =
      artifacts?.find(
        (a) =>
          a.filename.toLowerCase().includes("annotated") ||
          a.filename.toLowerCase().includes("snpeff")
      ) ||
      artifacts?.find(
        (a) =>
          a.filename.toLowerCase().endsWith(".vcf") ||
          a.filename.toLowerCase().endsWith(".vcf.gz") ||
          a.kind === "vcf"
      );

    if (vcfArtifact) {
      try {
        setState({
          status: "loading",
          message: `Fetching ${vcfArtifact.filename} from S3...`,
        });

        const urlRes = await getArtifactUrlApi(jobId, vcfArtifact.filename, true);
        const url = urlRes.data?.url;

        if (!url) throw new Error("No download URL returned for VCF artifact.");

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch VCF file from S3 (HTTP ${response.status})`);
        }

        const vcfText = await response.text();
        setState({
          status: "loading",
          message: "Parsing annotated VCF on the fly...",
        });

        let dataset = parseAnnotatedVcf(vcfText);

        // If the parsed VCF lacked SnpEff ANN annotations (all modifier/intergenic), enrich from backend variants
        if (
          dataset.stats.byImpact.HIGH === 0 &&
          dataset.stats.byImpact.MODERATE === 0 &&
          fallbackVariants &&
          fallbackVariants.length > 0
        ) {
          dataset = enrichDatasetWithBackendVariants(dataset, fallbackVariants);
        }

        setState({ status: "ready", dataset });
        return;
      } catch (err) {
        console.warn(
          "Direct S3 VCF fetch/parse failed; falling back to backend variants:",
          err
        );
      }
    }

    // Fallback to backend variants API if S3 VCF is unavailable
    if (fallbackVariants && fallbackVariants.length > 0) {
      const dataset = buildDatasetFromVariants(fallbackVariants);
      setState({ status: "ready", dataset });
    } else {
      setState({
        status: "error",
        message:
          "No variant or VCF data could be found for this run. If the run just completed, please try again in a few moments.",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, jobId, artifacts, fallbackVariants]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-slate-950/80 p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-150">
      <div className="flex h-[94vh] w-full max-w-7xl flex-col rounded-2xl bg-slate-950 shadow-2xl border border-slate-800 overflow-hidden">
        {state.status === "loading" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center bg-slate-950">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-950/50 text-blue-400 shadow-inner border border-blue-800/40">
              <Dna className="h-8 w-8 animate-spin text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-200">
              Loading Genomic Data
            </h3>
            <p className="text-xs text-slate-400 max-w-xs">{state.message}</p>
          </div>
        )}

        {state.status === "error" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center bg-slate-950">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-950/50 text-red-400 border border-red-800">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="max-w-md">
              <h3 className="text-base font-semibold text-white">
                Unable to Load Visualizer
              </h3>
              <p className="mt-1 text-xs text-slate-400">{state.message}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadData}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {state.status === "ready" && (
          <NativeGenomicVisualizer
            dataset={state.dataset}
            sampleId={sampleId}
            seqId={seqId}
            runId={runId}
            onClose={onClose}
            isModal={true}
          />
        )}
      </div>
    </div>
  );
}

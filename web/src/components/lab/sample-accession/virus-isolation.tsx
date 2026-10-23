"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import {
  Save,
  ArrowRight,
  SkipForward,
  FlaskConical,
  Info,
  Link2,
} from "lucide-react";

import { Sample, SampleStatusType } from "@/src/types/sample";
import { updateSampleApi } from "@/src/app/(dashboard)/lab/[sampleId]/actions";
import { sampleAtom } from "@/src/store/sampleAtom";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import { selectedProcessableSamplesAtom } from "@/src/store/processableSamplesAtom";
import { setSessionStorage } from "@/src/utils/session-storage";
import {
  H_GENE_OPTIONS,
  N_GENE_OPTIONS,
  SAMPLE_UNITS,
} from "@/src/utils/constant";
import Spinner from "@/src/components/ui/spinner";

// ─── Types ───────────────────────────────────────────────────────────────────

interface VirusIsolationProps {
  isBulkMode?: boolean;
  onBulkSuccess?: (
    action: "exit" | "proceed" | "complete" | "back" | "skip",
    nextStageOverride?: SampleStatusType,
  ) => void;
  onBack?: () => void;
}

interface VirusIsolationState {
  id: string; // pooledId or sample.id
  barcode: string;
  isAI: boolean; // only AI samples go through this step
  isPooled: boolean;
  samples: Sample[];
  // HA Test: "yes" | "no" — if "no", all fields below are disabled / N/A
  haTest: "yes" | "no" | "";
  inoculationDate: string;
  harvestingDate: string;
  haTitre: string;
  hiTitre: string;
  hValue: string; // NA | H1-H19
  nValue: string; // NA | N1-N11
  ndvPresent: "positive" | "negative" | "";
  allantoicStorage: string;
  volume: string;
  unit: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Merged volume + unit input */
function VolumeInput({
  volume,
  unit,
  onVolumeChange,
  onUnitChange,
  placeholder = "Vol",
  bg = "bg-white",
}: {
  volume: string;
  unit: string;
  onVolumeChange: (v: string) => void;
  onUnitChange: (u: string) => void;
  placeholder?: string;
  bg?: string;
}) {
  return (
    <div
      className={`flex items-stretch border border-grey-40 rounded-lg overflow-hidden focus-within:border-blue-40 focus-within:ring-2 focus-within:ring-blue-40/10 transition-all h-[36px] w-fit min-w-[110px] ${bg}`}
    >
      <input
        type="number"
        placeholder={placeholder}
        className="w-16 px-2.5 py-1.5 text-sm text-grey-80 outline-none bg-transparent border-r border-grey-20"
        value={volume}
        onChange={(e) => onVolumeChange(e.target.value)}
      />
      <select
        className="px-2 py-1.5 text-xs font-semibold text-grey-60 bg-grey-10 outline-none cursor-pointer hover:bg-grey-20 transition-colors"
        value={unit}
        onChange={(e) => onUnitChange(e.target.value)}
      >
        {SAMPLE_UNITS.map((u) => (
          <option key={u.value} value={u.value}>
            {u.value}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Constants ───────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2 border border-grey-40 rounded-lg outline-none focus:border-blue-40 focus:ring-2 focus:ring-blue-40/10 text-sm text-grey-80 bg-white transition-all placeholder:text-grey-40";
const selectCls =
  "w-full px-3 py-2 border border-grey-40 rounded-lg outline-none focus:border-blue-40 focus:ring-2 focus:ring-blue-40/10 text-sm text-grey-80 bg-white transition-all appearance-none cursor-pointer";
const disabledCls = "opacity-40 pointer-events-none";

// ─── Main Component ──────────────────────────────────────────────────────────

export default function VirusIsolation({
  isBulkMode,
  onBulkSuccess,
  onBack,
}: VirusIsolationProps) {
  const router = useRouter();
  // 4.4: workspace-admins have no user.project, so fall back to the current
  // workspace's first project.
  const { resolveProjectId } = useCurrentProjectResolver();
  const currentProjectId = resolveProjectId();
  const currentSample = useAtomValue(sampleAtom);
  const setSample = useSetAtom(sampleAtom);
  const [selectedBulkSamples, setSelectedBulkSamples] = useAtom(
    selectedProcessableSamplesAtom,
  );

  const samplesToProcess = useMemo(() => {
    if (isBulkMode) return selectedBulkSamples;
    return currentSample ? [currentSample] : [];
  }, [isBulkMode, selectedBulkSamples, currentSample]);

  // Grouping samples exactly like Extraction/Preprocessing logic
  const groupedSamples = useMemo(() => {
    const groups = new Map<
      string,
      { isPooled: boolean; pooledId?: string; samples: Sample[] }
    >();

    samplesToProcess.forEach((s) => {
      const pId = s.details?.preprocessing?.pooledId;
      if (s.isPooledSample && pId) {
        if (!groups.has(pId)) {
          groups.set(pId, { isPooled: true, pooledId: pId, samples: [] });
        }
        groups.get(pId)!.samples.push(s);
      } else {
        groups.set(s.id, { isPooled: false, samples: [s] });
      }
    });

    return Array.from(groups.values());
  }, [samplesToProcess]);

  const [states, setStates] = useState<VirusIsolationState[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState<"exit" | "proceed" | "skip">(
    "proceed",
  );

  // ── Initialise per-group state ────────────────────────────────────────────
  useEffect(() => {
    if (groupedSamples.length > 0) {
      setStates(
        groupedSamples.map((group) => {
          // Base properties on the first sample within the group
          const s = group.samples[0];
          const vi = s.details?.virusIsolation ?? {};
          // A group is AI if any of its individual constituent samples is AI
          const isAI = group.samples.some(
            (sub) =>
              sub.sampleStatus === "virus-isolation" ||
              sub.hasAI ||
              sub.diseases?.some((d) => d.shortName?.toUpperCase() === "AI"),
          );

          const id = group.isPooled ? group.pooledId! : s.id;

          return {
            id,
            barcode: s.barcode,
            isAI,
            isPooled: group.isPooled,
            samples: group.samples,
            haTest: vi.haTest ?? "",
            inoculationDate: vi.inoculationDate ?? "",
            harvestingDate: vi.harvestingDate ?? "",
            haTitre: vi.haTitre ?? "",
            hiTitre: vi.hiTitre ?? "",
            hValue: vi.hValue ?? "NA",
            nValue: vi.nValue ?? "NA",
            ndvPresent: vi.ndvPresent ?? "",
            allantoicStorage: vi.allantoicStorage ?? "",
            volume: vi.volume ?? "",
            unit:
              vi.unit ??
              s.details?.preprocessing?.pooledVolumeUnit ??
              s.receivedVolumeUnit ??
              s.unit ??
              "mL",
          };
        }),
      );
    }
  }, [groupedSamples, states.length]);

  const updateState = useCallback(
    (id: string, patch: Partial<VirusIsolationState>) => {
      setStates((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const updated = { ...s, ...patch };

          return updated;
        }),
      );
    },
    [],
  );

  // ── Validation ────────────────────────────────────────────────────────────
  const isFormValid = useMemo(() => {
    if (states.length === 0) return false;
    // All AI sample/groups must have haTest selected
    return states.filter((s) => s.isAI).every((s) => s.haTest !== "");
  }, [states]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (type: "exit" | "proceed") => {
    if (!currentProjectId) return;
    try {
      setSubmitting(true);
      setSubmitType(type);

      const promises = states.flatMap((s) => {
        const viPayload =
          s.haTest === "no"
            ? { haTest: "no" }
            : {
                haTest: s.haTest,
                inoculationDate: s.inoculationDate,
                harvestingDate: s.harvestingDate,
                haTitre: s.haTitre,
                hiTitre: s.hiTitre,
                hValue: s.hValue,
                nValue: s.nValue,
                ndvPresent: s.ndvPresent || undefined,
                allantoicStorage: s.allantoicStorage,
                volume: s.volume,
                unit: s.unit,
              };

        return s.samples.map((original) => {
          const payload: Partial<Sample> = {
            sampleStatus: "pre-processed",
            details: {
              ...(original?.details ?? {}),
              virusIsolation: viPayload,
            },
          };
          return updateSampleApi(currentProjectId, original.id, payload);
        });
      });

      const results = await Promise.all(promises);
      const allOk = results.every((r) => r.success);

      if (allOk) {
        toast.success(
          `Virus Isolation data saved for ${samplesToProcess.length} sample${samplesToProcess.length > 1 ? "s" : ""}.`,
        );

        if (isBulkMode) {
          setSelectedBulkSamples((prev) =>
            prev.map((s) => {
              const res = results.find((r) => r.success && r.data?.id === s.id);
              return res?.data ? { ...s, ...res.data } : s;
            }),
          );
          // Both Save & Exit and Proceed advance the sample to "pre-processed" now —
          // they only differ in where the user lands afterward.
          if (onBulkSuccess)
            onBulkSuccess(
              type === "exit" ? "exit" : "proceed",
              "pre-processed",
            );
        } else if (results[0].data) {
          setSample((prev) => ({ ...prev, ...results[0].data }) as Sample);
          if (type === "exit") {
            setSessionStorage("activeTab", "pre-processed");
            router.replace("/lab");
          }
        }
      }
    } catch (err) {
      toast.error("Error saving Virus Isolation data.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (!currentProjectId) return;
    try {
      setSubmitting(true);
      setSubmitType("skip");

      const promises = states.flatMap((s) => {
        return s.samples.map((original) => {
          const payload: Partial<Sample> = {
            sampleStatus: "extracted", // Skipping directly to Testing
          };
          return updateSampleApi(currentProjectId, original.id, payload);
        });
      });

      const results = await Promise.all(promises);
      const allOk = results.every((r) => r.success);

      if (allOk) {
        toast.success(
          `Skipped to Testing for ${samplesToProcess.length} sample${samplesToProcess.length > 1 ? "s" : ""}.`,
        );

        if (isBulkMode) {
          setSelectedBulkSamples((prev) =>
            prev.map((s) => {
              const res = results.find((r) => r.success && r.data?.id === s.id);
              return res?.data ? { ...s, ...res.data } : s;
            }),
          );
          if (onBulkSuccess) onBulkSuccess("skip");
        } else if (results[0].data) {
          setSample((prev) => ({ ...prev, ...results[0].data }) as Sample);
        }
      }
    } catch (err) {
      toast.error("Error skipping to Testing.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const aiSamples = states.filter((s) => s.isAI);
  const nonAISamples = states.filter((s) => !s.isAI);

  if (samplesToProcess.length > 0 && states.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full min-w-0 overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-10 text-blue-50 flex items-center justify-center shrink-0">
          <FlaskConical size={20} strokeWidth={1.6} />
        </div>
        <div>
          <h3 className="font-noto-serif font-semibold text-xl text-grey-80">
            Virus Isolation
          </h3>
          <p className="text-grey-70 text-sm">
            Perform AI-specific diagnostic isolation and titres.
          </p>
        </div>
      </div>
      {/* ── Non-AI notice ─────────────────────────────────────────────────── */}
      {nonAISamples.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-grey-10 border border-grey-20 rounded-xl text-xs text-grey-600">
          <Info size={16} className="text-blue-40 shrink-0" />
          <span>
            <strong>{nonAISamples.length}</strong> non-AI group
            {nonAISamples.length > 1 ? "s" : ""} will be skipped — no data
            required.
          </span>
        </div>
      )}

      {/* ── AI Samples table ─────────────────────────────────────────────── */}
      {aiSamples.length > 0 ? (
        <div className="bg-white border border-grey-20 rounded-2xl shadow-sm overflow-x-auto min-w-0 w-full">
          <div className="px-6 py-4 border-b border-grey-20 bg-grey-10 sticky left-0 z-10 w-full min-w-max">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-grey-80 font-noto-serif">
                Inoculation & Harvesting Details — {aiSamples.length} AI Sample
                {aiSamples.length > 1 ? "s" : ""}
              </h3>
            </div>
          </div>

          <table className="w-full text-left border-collapse min-w-[1450px]">
            <thead className="bg-grey-10 border-b border-grey-20">
              <tr>
                <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest whitespace-nowrap bg-grey-10 sticky left-0 z-10">
                  Sample ID / Pool
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest whitespace-nowrap">
                  HA Test
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest whitespace-nowrap">
                  Inoculation
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest whitespace-nowrap">
                  Harvesting
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest">
                  HA Titre
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest">
                  HI Titre
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest">
                  HA subtype
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest">
                  N subtype
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest whitespace-nowrap">
                  NDV
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest whitespace-nowrap">
                  Storage
                </th>
                <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest">
                  Volume
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-10">
              {aiSamples.map((s) => {
                const fieldsDisabled = s.haTest === "no";
                const showNDV = !fieldsDisabled;

                return (
                  <tr
                    key={s.id}
                    className="hover:bg-grey-10/30 transition-colors group"
                  >
                    {/* Sample ID / Pool */}
                    <td className="px-5 py-4 whitespace-nowrap sticky left-0 z-10 bg-white group-hover:bg-grey-10 transition-colors">
                      {s.isPooled ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-teal-700">
                            <Link2 size={14} />
                            <span className="text-sm font-bold">{s.id}</span>
                          </div>
                          <span className="text-[10px] text-grey-50 font-bold uppercase">
                            {s.samples.length} samples pooled
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-blue-50">
                          {s.barcode}
                        </span>
                      )}
                    </td>

                    {/* HA Test */}
                    <td className="px-4 py-3">
                      <div className="relative min-w-[80px]">
                        <select
                          className={selectCls}
                          value={s.haTest}
                          onChange={(e) =>
                            updateState(s.id, {
                              haTest: e.target.value as "yes" | "no" | "",
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-grey-40 text-xs">
                          ▾
                        </span>
                      </div>
                    </td>

                    {/* Inoculation Date */}
                    <td
                      className={`px-5 py-4 ${fieldsDisabled ? disabledCls : ""}`}
                    >
                      <input
                        type="date"
                        className={inputCls}
                        value={s.inoculationDate}
                        disabled={fieldsDisabled}
                        onChange={(e) =>
                          updateState(s.id, { inoculationDate: e.target.value })
                        }
                      />
                    </td>

                    {/* Harvesting Date */}
                    <td
                      className={`px-5 py-4 ${fieldsDisabled ? disabledCls : ""}`}
                    >
                      <input
                        type="date"
                        className={inputCls}
                        value={s.harvestingDate}
                        disabled={fieldsDisabled}
                        onChange={(e) =>
                          updateState(s.id, { harvestingDate: e.target.value })
                        }
                      />
                    </td>

                    {/* HA Titre */}
                    <td
                      className={`px-5 py-4 ${fieldsDisabled ? disabledCls : ""}`}
                    >
                      <input
                        type="text"
                        placeholder="HA Titre"
                        className={inputCls + " min-w-[90px]"}
                        value={s.haTitre}
                        disabled={fieldsDisabled}
                        onChange={(e) =>
                          updateState(s.id, { haTitre: e.target.value })
                        }
                      />
                    </td>

                    {/* HI Titre */}
                    <td
                      className={`px-5 py-4 ${fieldsDisabled ? disabledCls : ""}`}
                    >
                      <input
                        type="text"
                        placeholder="HI Titre"
                        className={inputCls + " min-w-[90px]"}
                        value={s.hiTitre}
                        disabled={fieldsDisabled}
                        onChange={(e) =>
                          updateState(s.id, { hiTitre: e.target.value })
                        }
                      />
                    </td>

                    {/* H Value */}
                    <td
                      className={`px-5 py-4 ${fieldsDisabled ? disabledCls : ""}`}
                    >
                      <div className="relative min-w-[80px]">
                        <select
                          className={selectCls}
                          value={s.hValue}
                          disabled={fieldsDisabled}
                          onChange={(e) =>
                            updateState(s.id, { hValue: e.target.value })
                          }
                        >
                          {H_GENE_OPTIONS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-grey-40 text-xs">
                          ▾
                        </span>
                      </div>
                    </td>

                    {/* N Value */}
                    <td
                      className={`px-5 py-4 ${fieldsDisabled ? disabledCls : ""}`}
                    >
                      <div className="relative min-w-[80px]">
                        <select
                          className={selectCls}
                          value={s.nValue}
                          disabled={fieldsDisabled}
                          onChange={(e) =>
                            updateState(s.id, { nValue: e.target.value })
                          }
                        >
                          {N_GENE_OPTIONS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-grey-40 text-xs">
                          ▾
                        </span>
                      </div>
                    </td>

                    {/* NDV Present */}
                    <td className="px-5 py-4">
                      {showNDV ? (
                        <div className="relative min-w-[110px]">
                          <select
                            className={selectCls}
                            value={s.ndvPresent}
                            onChange={(e) =>
                              updateState(s.id, {
                                ndvPresent: e.target.value as
                                  "positive" | "negative" | "",
                              })
                            }
                          >
                            <option value="">Select</option>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                          </select>
                          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-grey-40 text-xs">
                            ▾
                          </span>
                        </div>
                      ) : (
                        <span className="text-grey-30 text-sm select-none">
                          —
                        </span>
                      )}
                    </td>

                    {/* Allantoic Storage */}
                    <td
                      className={`px-5 py-4 ${fieldsDisabled ? disabledCls : ""}`}
                    >
                      <input
                        type="text"
                        placeholder="Storage"
                        className={inputCls + " min-w-[100px]"}
                        value={s.allantoicStorage}
                        disabled={fieldsDisabled}
                        onChange={(e) =>
                          updateState(s.id, {
                            allantoicStorage: e.target.value,
                          })
                        }
                      />
                    </td>

                    {/* Volume */}
                    <td
                      className={`px-5 py-4 ${fieldsDisabled ? disabledCls : ""}`}
                    >
                      <VolumeInput
                        volume={s.volume}
                        unit={s.unit}
                        onVolumeChange={(v) => updateState(s.id, { volume: v })}
                        onUnitChange={(u) => updateState(s.id, { unit: u })}
                        placeholder="Vol"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-grey-20 rounded-2xl">
          <FlaskConical size={32} className="text-grey-20 mb-4" />
          <p className="text-base font-semibold text-grey-80 font-noto-serif">
            No AI samples in this batch
          </p>
          <p className="text-sm text-grey-60 mt-1">
            You can skip directly to Extraction step.
          </p>
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-6 border-t border-grey-20">
        <button
          onClick={() => {
            if (isBulkMode && onBulkSuccess) {
              onBulkSuccess("back");
            } else if (onBack) {
              onBack();
            } else {
              router.replace("/lab");
            }
          }}
          className="px-5 py-2.5 rounded-xl border border-grey-20 text-grey-60 font-semibold text-sm hover:bg-grey-10 transition-all"
        >
          ← Back
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleSubmit("exit")}
            disabled={submitting || !isFormValid}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-grey-30 text-grey-70 font-semibold text-sm hover:bg-grey-10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting && submitType === "exit" && <Spinner disabled />}
            <Save size={14} /> Save &amp; Exit
          </button>

          <button
            onClick={handleSkip}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-grey-30 text-grey-70 text-sm hover:bg-grey-10 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting && submitType === "skip" && <Spinner disabled />}
            <SkipForward size={14} /> Skip to Testing
          </button>

          <button
            onClick={() => handleSubmit("proceed")}
            disabled={submitting || !isFormValid}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-40 text-white font-bold text-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-40/10"
          >
            {submitting && submitType === "proceed" && <Spinner darkMode />}
            Proceed to Extraction <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

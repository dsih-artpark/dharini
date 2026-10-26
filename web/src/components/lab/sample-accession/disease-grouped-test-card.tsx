"use client";

import { Plus, Upload, Link2, X, Eye, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Spinner from "@/src/components/ui/spinner";
import Select from "@/src/components/ui/select";
import { getFileNameFromS3Url } from "@/src/utils";
import {
  GENE_OPTIONS,
  OTHERS_OPTION,
  SCREENING_TARGET_OPTIONS,
} from "@/src/utils/constant";
import {
  uploadImagesApi,
  getSignedUrlApi,
} from "@/src/app/(dashboard)/home/loader";
import { Kit, Sample, TestResultType } from "@/src/types/sample";
import { Disease, User } from "@/src/types/global";
import TeamMemberSelect from "./team-member-select";

// ─── Types ──────────────────────────────────────────────────────────────────

export type CtTarget = {
  id: string;
  name: string;
  ctValue: string;
  result: string;
  viralCopies: string;
  unit: string;
};

export type SubtypeKit = {
  id: string;
  kitName: string;
  resultDate: string;
  targets: CtTarget[];
  derivedSubtype: string;
};

export type SampleTestParams = {
  sampleId: string;
  result: TestResultType | "Pending" | string;
  viralCopies: string;
  viralCopiesUnit: string;
  resultDate: string;
  subtypeKits: SubtypeKit[]; // multiple kits per sample
  variant?: string;
  ctValue?: string;
  viralLoad?: string;
};

export type CommonDiseaseParams = {
  kitOrProtocol: string;
  targetAssay: string;
  testedById: string;
  testResultReport?: string;
  customKitName?: string;
};

export type DiseaseTestState = {
  diseaseId: string;
  isSelected: boolean;
  common: CommonDiseaseParams;
  samples: Record<string, SampleTestParams>; // keyed by sample.id or pooledId
};

// A display group — either a single sample or a pool
export type SampleGroup = {
  isPooled: boolean;
  pooledId?: string;
  samples: Sample[];
};

// ─── Styling constants (same as extraction) ──────────────────────────────────

const inputCls =
  "w-full px-3 py-2 border border-grey-40 rounded-lg outline-none focus:border-blue-40 focus:ring-2 focus:ring-blue-40/10 text-sm text-grey-80 bg-white transition-all placeholder:text-grey-40 h-9";

const selectCls =
  "w-full px-3 py-2 border border-grey-40 rounded-lg outline-none focus:border-blue-40 focus:ring-2 focus:ring-blue-40/10 text-sm text-grey-80 bg-white transition-all appearance-none cursor-pointer h-9";

const VIRAL_UNITS = ["copies/ml", "copies/µl", "copies/rxn"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resultColor(result: string) {
  if (result.toLowerCase() === "positive")
    return "border-green-400 bg-green-50 text-green-700";
  if (result.toLowerCase() === "negative")
    return "border-red-300 bg-red-50 text-red-600";
  if (result.toLowerCase() === "inconclusive")
    return "border-amber-300 bg-amber-50 text-amber-700";
  return "border-grey-30 bg-grey-5 text-grey-60";
}

function ResultBadge({ result }: { result: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${resultColor(result)}`}
    >
      {result}
    </span>
  );
}

function derivedSubtype(targets: CtTarget[]) {
  const positives = targets.filter((t) => t.result === "positive");
  return positives.map((p) => p.name).join("");
}

// Per-disease validation errors (matches DiseaseError in sample-testing.tsx)
type CardErrors = {
  kitOrProtocol?: string;
  samples?: string;
};

interface DiseaseTestGroupCardProps {
  disease: Disease;
  groups: SampleGroup[]; // pre-computed pooled groups
  state: DiseaseTestState;
  onChange: (newState: DiseaseTestState) => void;
  kits: Kit[] | undefined;
  teamMembers: User[];
  loadingTeamMembers: boolean;
  currentUserId?: string;
  errors: CardErrors;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DiseaseTestGroupCard({
  disease,
  groups,
  state,
  onChange,
  kits,
  teamMembers,
  loadingTeamMembers,
  currentUserId,
  errors,
}: DiseaseTestGroupCardProps) {
  const [uploading, setUploading] = useState(false);

  const isAI =
    disease?.shortName?.toUpperCase() === "AI" ||
    disease?.name?.toLowerCase().includes("avian");

  const isFMDorLSD =
    disease?.shortName?.toUpperCase() === "FMD" ||
    disease?.shortName?.toUpperCase() === "LSD";

  // ── State helpers ──────────────────────────────────────────────────────────

  const updateCommon = (updates: Partial<CommonDiseaseParams>) => {
    const nextCommon = { ...state.common, ...updates };
    let nextSamples = state.samples;

    if (updates.kitOrProtocol !== undefined) {
      nextSamples = { ...state.samples };
      Object.keys(nextSamples).forEach((key) => {
        const sRow = nextSamples[key];
        if (sRow.subtypeKits && sRow.subtypeKits.length > 0) {
          nextSamples[key] = {
            ...sRow,
            subtypeKits: sRow.subtypeKits.map((kit) => ({
              ...kit,
              kitName: updates.kitOrProtocol || "",
            })),
          };
        }
      });
    }

    onChange({
      ...state,
      common: nextCommon,
      samples: nextSamples,
    });
  };

  // key = sample.id for individual samples, pooledId for pools
  const updateSampleRow = (key: string, updates: Partial<SampleTestParams>) =>
    onChange({
      ...state,
      samples: {
        ...state.samples,
        [key]: { ...state.samples[key], ...updates },
      },
    });

  // ── Kit management (subtyping) ─────────────────────────────────────────────

  const addKit = (key: string) => {
    const row = state.samples[key];
    const newKit: SubtypeKit = {
      id: uuidv4(),
      kitName: state.common.kitOrProtocol || "",
      resultDate: new Date().toISOString(),
      targets: [],
      derivedSubtype: "",
    };
    updateSampleRow(key, { subtypeKits: [...(row.subtypeKits || []), newKit] });
  };

  const removeKit = (key: string, kitId: string) => {
    const row = state.samples[key];
    updateSampleRow(key, {
      subtypeKits: row.subtypeKits.filter((k) => k.id !== kitId),
    });
  };

  const updateKit = (
    key: string,
    kitId: string,
    updates: Partial<SubtypeKit>,
  ) => {
    const row = state.samples[key];
    updateSampleRow(key, {
      subtypeKits: row.subtypeKits.map((k) =>
        k.id === kitId ? { ...k, ...updates } : k,
      ),
    });
  };

  // ── CT Target management ───────────────────────────────────────────────────

  const addTarget = (key: string, kitId: string) => {
    const row = state.samples[key];
    const kit = row.subtypeKits.find((k) => k.id === kitId);
    if (!kit) return;
    const newTarget: CtTarget = {
      id: uuidv4(),
      name: "",
      ctValue: "",
      result: "Pending",
      viralCopies: "",
      unit: "copies/ml",
    };
    const newTargets = [...kit.targets, newTarget];
    updateKit(key, kitId, {
      targets: newTargets,
      derivedSubtype: derivedSubtype(newTargets),
    });
  };

  const removeTarget = (key: string, kitId: string, targetId: string) => {
    const row = state.samples[key];
    const kit = row.subtypeKits.find((k) => k.id === kitId);
    if (!kit) return;
    const newTargets = kit.targets.filter((t) => t.id !== targetId);
    updateKit(key, kitId, {
      targets: newTargets,
      derivedSubtype: derivedSubtype(newTargets),
    });
  };

  const updateTarget = (
    key: string,
    kitId: string,
    targetId: string,
    updates: Partial<CtTarget>,
  ) => {
    const row = state.samples[key];
    const kit = row.subtypeKits.find((k) => k.id === kitId);
    if (!kit) return;
    const newTargets = kit.targets.map((t) =>
      t.id === targetId ? { ...t, ...updates } : t,
    );
    updateKit(key, kitId, {
      targets: newTargets,
      derivedSubtype: derivedSubtype(newTargets),
    });
  };

  // ── File upload ────────────────────────────────────────────────────────────

  const ACCEPTED_FILE_TYPES =
    "application/pdf,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File size must be less than 25 MB.");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadImagesApi({ files: [file] });
      if (res.success && res.data?.[0]?.uploaded) {
        updateCommon({
          testResultReport: res.data[0].fileUrl || "",
        });
      } else {
        toast.error(res.message || "Upload failed.");
      }
    } catch (err) {
      toast.error("Error uploading file.");
      console.error(err);
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      e.target.value = "";
    }
  };

  const handlePreview = async () => {
    if (state.common.testResultReport) {
      try {
        const res = await getSignedUrlApi(state.common.testResultReport);
        if (res.success && res.data) {
          window.open(res.data, "_blank");
        } else {
          toast.error("Failed to generate preview link");
        }
      } catch (err) {
        toast.error("Error generating preview link");
        console.error(err);
      }
    }
  };

  const clearDocument = () => {
    updateCommon({ testResultReport: "" });
  };

  // ── Kit-or-Protocol select logic ───────────────────────────────────────────

  const selectValue =
    state.common.kitOrProtocol &&
    kits?.every((k) => k.name !== state.common.kitOrProtocol)
      ? OTHERS_OPTION
      : state.common.kitOrProtocol;

  // ── Stats ──────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    let p = 0,
      n = 0,
      pend = 0;
    groups.forEach((g) => {
      const key = g.isPooled ? g.pooledId! : g.samples[0].id;
      const res = (state.samples[key]?.result || "Pending").toLowerCase();
      if (res === "positive") p++;
      else if (res === "negative") n++;
      else pend++;
    });
    return { p, n, pend };
  }, [groups, state.samples]);

  // Positive groups (for subtyping)
  const positiveGroups = groups.filter((g) => {
    const key = g.isPooled ? g.pooledId! : g.samples[0].id;
    return state.samples[key]?.result?.toLowerCase() === "positive";
  });

  // ── Collapsed (unselected) state ───────────────────────────────────────────

  if (!state.isSelected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-grey-20 shadow-sm opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer"
        onClick={() => onChange({ ...state, isSelected: true })}
      >
        <div className="p-4 flex items-center gap-3 select-none">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold bg-grey-10 text-grey-60">
            {disease?.shortName || "D"}
          </div>
          <div>
            <h3 className="font-noto-serif font-semibold text-base text-grey-70">
              {disease?.name}
            </h3>
            <p className="text-xs text-grey-50">
              Click to expand and record test data
            </p>
          </div>
          <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-grey-10 text-grey-50 border border-grey-20 font-medium">
            Not selected
          </span>
        </div>
      </motion.div>
    );
  }

  // ── Expanded (selected) state ──────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-blue-30 shadow-md transition-all duration-300"
    >
      {/* Card Header */}
      <div
        className="px-5 py-4 flex items-center gap-3 bg-gradient-to-r from-blue-10/60 to-blue-5/20 rounded-t-2xl border-b border-blue-20 cursor-pointer select-none"
        onClick={() => onChange({ ...state, isSelected: false })}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold bg-blue-40 text-white shadow-sm">
          {disease?.shortName || "D"}
        </div>
        <div>
          <h3 className="font-noto-serif font-bold text-base text-blue-90">
            {disease?.name}
          </h3>
          <p className="text-xs text-blue-50/70">
            {groups.length} sample group(s)
          </p>
        </div>
        <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-blue-10 text-blue-60 border border-blue-20 font-semibold">
          Active
        </span>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* ── Common Testing Parameters ──────────────────────────────────── */}
        <div className="bg-grey-5/60 rounded-xl border border-grey-20">
          <div className="px-4 py-3 border-b border-grey-20 bg-white">
            <h4 className="font-semibold text-grey-90 text-sm">
              Common Testing Parameters
            </h4>
            <p className="text-xs text-grey-50 mt-0.5">
              These values apply to all samples in this disease group
            </p>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kit or Protocol */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-grey-70 uppercase tracking-wider">
                Kit or Protocol <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={selectCls}
                  value={selectValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === OTHERS_OPTION) {
                      updateCommon({
                        kitOrProtocol: OTHERS_OPTION,
                        customKitName: "",
                      });
                    } else {
                      updateCommon({ kitOrProtocol: val, customKitName: "" });
                    }
                  }}
                >
                  <option value="">Select kit/protocol</option>
                  <option value={OTHERS_OPTION}>Other / Add custom kit</option>
                  {kits?.map((kit) => (
                    <option key={kit.id} value={kit.name}>
                      {kit.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-grey-40 text-xs">
                  ▾
                </span>
              </div>
              {selectValue === OTHERS_OPTION && (
                <input
                  className={inputCls + " mt-1"}
                  placeholder="Enter custom kit name"
                  value={state.common.customKitName || ""}
                  onChange={(e) =>
                    updateCommon({
                      customKitName: e.target.value,
                      kitOrProtocol: e.target.value,
                    })
                  }
                />
              )}
              {errors.kitOrProtocol && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.kitOrProtocol}
                </p>
              )}
            </div>

            {/* Primary Screening Target */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-grey-70 uppercase tracking-wider">
                Primary Screening Target
              </label>
              {isFMDorLSD ? (
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Enter screening target"
                  value={state.common.targetAssay || ""}
                  onChange={(e) =>
                    updateCommon({ targetAssay: e.target.value })
                  }
                />
              ) : (
                <Select
                  name="targetAssay"
                  isMulti={true}
                  options={SCREENING_TARGET_OPTIONS}
                  defaultValue={
                    state.common.targetAssay
                      ? state.common.targetAssay.split(", ")
                      : []
                  }
                  onChange={(e) => {
                    const values = e.target.value as unknown as string[];
                    updateCommon({ targetAssay: values.join(", ") });
                  }}
                  className="h-9"
                />
              )}
            </div>

            {/* Tested By */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <TeamMemberSelect
                value={state.common.testedById}
                onChange={(memberId) => updateCommon({ testedById: memberId })}
                teamMembers={teamMembers}
                loading={loadingTeamMembers}
                label="Tested By"
                currentUserId={currentUserId}
                defaultToCurrentUser={true}
              />
            </div>
          </div>
        </div>

        {/* ── Step 1: Target Gene Screening ─────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-grey-20 overflow-hidden">
          <div className="px-4 py-3 border-b border-grey-20 bg-grey-5/60">
            <h4 className="font-semibold text-grey-90 text-sm">
              Step 1: Target Gene Screening
            </h4>
            <p className="text-xs text-grey-50 mt-0.5">
              Set the screening result for each sample or pool. Samples marked
              positive will require subtyping below.
            </p>
          </div>

          {errors.samples && (
            <div className="px-4 py-2 bg-red-50 text-red-500 text-xs border-b border-red-100 font-medium">
              ⚠️ {errors.samples}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-grey-10 bg-grey-5/40">
                  <th className="px-4 py-3 text-[10px] font-bold text-grey-50 uppercase tracking-widest whitespace-nowrap">
                    Sample / Pool
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold text-grey-50 uppercase tracking-widest">
                    Type
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold text-grey-50 uppercase tracking-widest whitespace-nowrap">
                    Result
                  </th>
                  {/* CT Value column — shown for all diseases */}
                  <th className="px-4 py-3 text-[10px] font-bold text-grey-50 uppercase tracking-widest whitespace-nowrap">
                    CT Value
                  </th>
                  {isFMDorLSD && (
                    <>
                      <th className="px-4 py-3 text-[10px] font-bold text-grey-50 uppercase tracking-widest whitespace-nowrap">
                        Viral Load
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold text-grey-50 uppercase tracking-widest whitespace-nowrap">
                        Variant
                      </th>
                    </>
                  )}
                  {!isFMDorLSD && (
                    <th className="px-4 py-3 text-[10px] font-bold text-grey-50 uppercase tracking-widest whitespace-nowrap">
                      Viral Copies
                    </th>
                  )}
                  <th className="px-4 py-3 text-[10px] font-bold text-grey-50 uppercase tracking-widest whitespace-nowrap">
                    Result Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-10">
                {groups.map((group) => {
                  const key = group.isPooled
                    ? group.pooledId!
                    : group.samples[0].id;
                  const sRow = state.samples[key];
                  if (!sRow) return null;

                  const firstSample = group.samples[0];
                  const sampleTypeDesc = firstSample.sampleType?.name || "—";

                  return (
                    <tr
                      key={key}
                      className="hover:bg-grey-5/40 transition-colors"
                    >
                      {/* Sample ID / Pool */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {group.isPooled ? (
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 text-teal-700">
                              <Link2 size={12} />
                              <span className="text-sm font-bold">
                                {group.pooledId}
                              </span>
                            </div>
                            <span className="text-[10px] text-grey-40 font-semibold uppercase">
                              {group.samples.length} samples pooled
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-blue-50">
                              {firstSample.barcode || firstSample.sampleCode}
                            </span>
                            {firstSample.barcode && firstSample.sampleCode && (
                              <span className="text-[10px] text-grey-40">
                                {firstSample.sampleCode}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3 text-sm text-grey-70 whitespace-nowrap">
                        {sampleTypeDesc}
                      </td>

                      {/* Result select */}
                      <td className="px-4 py-3">
                        <div className="relative">
                          <select
                            className={`${selectCls} min-w-[180px] ${
                              sRow.result === "positive"
                                ? "border-green-400 bg-green-50 text-green-700"
                                : sRow.result === "negative"
                                  ? "border-red-300 bg-red-50 text-red-600"
                                  : sRow.result === "unclear"
                                    ? "border-amber-300 bg-amber-50 text-amber-700"
                                    : ""
                            }`}
                            value={sRow.result}
                            onChange={(e) => {
                              const newResult = e.target.value;
                              const updates: Partial<SampleTestParams> = {
                                result: newResult,
                              };

                              if (newResult === "positive" && isAI) {
                                const currentKits = sRow.subtypeKits || [];
                                const newKits = [...currentKits];

                                const kitName =
                                  state.common.kitOrProtocol || "";
                                const alreadyExists = newKits.some(
                                  (k) => k.kitName === kitName,
                                );
                                if (!alreadyExists) {
                                  newKits.push({
                                    id: uuidv4(),
                                    kitName: kitName,
                                    resultDate: new Date().toISOString(),
                                    targets: [],
                                    derivedSubtype: "",
                                  });
                                }
                                updates.subtypeKits = newKits;
                              }

                              updateSampleRow(key, updates);
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                            <option value="unclear">Unclear</option>
                          </select>
                          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-current text-xs">
                            ▾
                          </span>
                        </div>
                      </td>

                      {/* CT Value — shown for all diseases, right after Result */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="CT Value"
                          className={inputCls + " w-24"}
                          value={sRow.ctValue || ""}
                          onChange={(e) =>
                            updateSampleRow(key, { ctValue: e.target.value })
                          }
                        />
                      </td>

                      {/* FMD/LSD extra fields (Viral Load + Variant) */}
                      {isFMDorLSD && (
                        <>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              placeholder="Viral Load"
                              className={inputCls + " min-w-[120px]"}
                              value={sRow.viralLoad || ""}
                              onChange={(e) =>
                                updateSampleRow(key, {
                                  viralLoad: e.target.value,
                                })
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              placeholder="Variant"
                              className={inputCls + " min-w-[120px]"}
                              value={sRow.variant || ""}
                              onChange={(e) =>
                                updateSampleRow(key, {
                                  variant: e.target.value,
                                })
                              }
                            />
                          </td>
                        </>
                      )}

                      {/* Viral Copies (Non-FMD/LSD only) */}
                      {!isFMDorLSD && (
                        <td className="px-4 py-3">
                          <div className="flex items-stretch border border-grey-40 rounded-lg overflow-hidden focus-within:border-blue-40 focus-within:ring-2 focus-within:ring-blue-40/10 transition-all h-9 min-w-[170px] bg-white">
                            <input
                              type="text"
                              placeholder="Value"
                              className="w-full px-2.5 py-1.5 text-sm text-grey-80 outline-none bg-transparent border-r border-grey-20"
                              value={sRow.viralCopies}
                              onChange={(e) =>
                                updateSampleRow(key, {
                                  viralCopies: e.target.value,
                                })
                              }
                            />
                            <select
                              className="px-2 py-1 text-xs font-semibold text-grey-60 bg-grey-10 outline-none cursor-pointer hover:bg-grey-20 transition-colors"
                              value={sRow.viralCopiesUnit}
                              onChange={(e) =>
                                updateSampleRow(key, {
                                  viralCopiesUnit: e.target.value,
                                })
                              }
                            >
                              {VIRAL_UNITS.map((u) => (
                                <option key={u} value={u}>
                                  {u}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      )}

                      {/* Result Date */}
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          className={inputCls + " min-w-[140px]"}
                          value={
                            sRow.resultDate
                              ? new Date(sRow.resultDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            updateSampleRow(key, {
                              resultDate: new Date(
                                e.target.value,
                              ).toISOString(),
                            })
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Stats footer */}
          <div className="px-4 py-3 bg-grey-5/40 border-t border-grey-10 flex flex-wrap gap-3 items-center">
            <span className="inline-flex items-center gap-1.5 text-green-700 border border-green-300 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
              {stats.p} Positive
            </span>
            <span className="inline-flex items-center gap-1.5 text-red-600 border border-red-300 bg-red-50 px-3 py-1 rounded-full text-xs font-bold">
              {stats.n} Negative
            </span>
            <span className="inline-flex items-center gap-1.5 text-grey-60 border border-grey-30 bg-white px-3 py-1 rounded-full text-xs font-bold">
              {stats.pend} Pending
            </span>
          </div>
        </div>

        {/* ── Step 2: Individual Subtyping (AI + Positives only) ─────────────── */}
        {isAI && positiveGroups.length > 0 && (
          <div className="bg-white rounded-xl border border-grey-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-grey-20 bg-grey-5/60">
              <h4 className="font-semibold text-grey-90 text-sm">
                Step 2: Individual Subtyping
              </h4>
              <p className="text-xs text-grey-50 mt-0.5">
                {positiveGroups.length} positive sample(s) require individual
                subtyping. Enter kit name and add Ct values with labels and
                results for each sample.
              </p>
            </div>
            {errors.samples && (
              <div className="px-4 py-2 bg-red-50 text-red-500 text-xs border-b border-red-100 font-medium">
                ⚠️ {errors.samples}
              </div>
            )}

            <div className="p-5 flex flex-col divide-y divide-grey-10">
              {positiveGroups.map((group) => {
                const key = group.isPooled
                  ? group.pooledId!
                  : group.samples[0].id;
                const sRow = state.samples[key];
                if (!sRow) return null;
                const firstSample = group.samples[0];

                return (
                  <div
                    key={`sub-${key}`}
                    className="pt-5 pb-5 first:pt-0 last:pb-0"
                  >
                    {/* Sample header row */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {group.isPooled ? (
                        <div className="flex items-center gap-1.5 text-teal-700">
                          <Link2 size={13} />
                          <span className="font-bold text-sm">
                            {group.pooledId}
                          </span>
                          <span className="text-[10px] text-grey-40 font-semibold uppercase ml-1">
                            {group.samples.length} pooled
                          </span>
                        </div>
                      ) : (
                        <>
                          <span className="font-bold text-sm text-blue-60">
                            {firstSample.barcode || firstSample.sampleCode}
                          </span>
                          <span className="text-grey-30">•</span>
                          <span className="text-sm text-grey-60">
                            {firstSample.sampleType?.name || "—"}
                          </span>
                          <span className="text-grey-30">•</span>
                          <span className="text-sm text-grey-60">
                            {firstSample.site?.name || "—"}
                          </span>
                        </>
                      )}
                      <ResultBadge result="Positive" />
                      <button
                        type="button"
                        onClick={() => addKit(key)}
                        className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-blue-50 bg-white border border-blue-20 px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-10 transition"
                      >
                        <Plus size={13} /> Add Kit
                      </button>
                    </div>

                    {/* Kit blocks */}
                    {sRow.subtypeKits.length === 0 && (
                      <p className="text-xs text-grey-40 italic">
                        No kits added yet. Click &ldquo;Add Kit&rdquo; to start
                        subtyping.
                      </p>
                    )}

                    <div className="flex flex-col gap-4">
                      {sRow.subtypeKits.map((kit) => (
                        <div
                          key={kit.id}
                          className="border border-grey-20 rounded-xl overflow-hidden bg-white shadow-sm"
                        >
                          {/* Kit header row */}
                          <div className="px-4 py-3 bg-grey-5/50 border-b border-grey-10 flex flex-wrap items-end gap-4">
                            <div className="flex flex-col gap-1 min-w-[180px]">
                              <label className="text-[10px] font-bold text-grey-60 uppercase tracking-wider">
                                Kit <span className="text-red-500">*</span>
                              </label>
                              <div className="flex items-stretch border border-grey-40 rounded-lg overflow-hidden focus-within:border-blue-40 h-9 bg-white">
                                <input
                                  className="w-full px-3 py-1.5 text-sm text-grey-80 outline-none bg-transparent"
                                  placeholder="e.g. H5N1"
                                  value={kit.kitName}
                                  onChange={(e) =>
                                    updateKit(key, kit.id, {
                                      kitName: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-grey-60 uppercase tracking-wider">
                                Result Date
                              </label>
                              <input
                                type="date"
                                max={new Date().toISOString().split("T")[0]}
                                className={inputCls + " w-[160px]"}
                                value={
                                  kit.resultDate
                                    ? new Date(kit.resultDate)
                                        .toISOString()
                                        .split("T")[0]
                                    : ""
                                }
                                onChange={(e) =>
                                  updateKit(key, kit.id, {
                                    resultDate: new Date(
                                      e.target.value,
                                    ).toISOString(),
                                  })
                                }
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeKit(key, kit.id)}
                              className="ml-auto h-9 w-9 flex items-center justify-center text-grey-40 hover:text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg border border-grey-20 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* CT targets */}
                          <div className="px-4 py-3 flex flex-col gap-2">
                            {kit.targets.map((target) => (
                              <div
                                key={target.id}
                                className="flex flex-wrap items-center gap-2 py-1.5 border-b border-grey-10 last:border-0"
                              >
                                {/* Target name */}
                                <div className="relative">
                                  <select
                                    className={`${selectCls} w-24`}
                                    value={target.name}
                                    onChange={(e) =>
                                      updateTarget(key, kit.id, target.id, {
                                        name: e.target.value,
                                      })
                                    }
                                  >
                                    <option value="">Gene</option>
                                    {GENE_OPTIONS.map((gene) => (
                                      <option key={gene} value={gene}>
                                        {gene}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-grey-40 text-xs">
                                    ▾
                                  </span>
                                </div>

                                {/* Ct Value */}
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-grey-50 whitespace-nowrap">
                                    Ct Value:
                                  </span>
                                  <input
                                    type="number"
                                    placeholder="e.g. 3"
                                    className={inputCls + " w-20"}
                                    value={target.ctValue}
                                    onChange={(e) =>
                                      updateTarget(key, kit.id, target.id, {
                                        ctValue: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                {/* Result */}
                                <div className="relative">
                                  <select
                                    className={`${selectCls} w-32 ${
                                      target.result === "positive"
                                        ? "border-green-400 bg-green-50 text-green-700"
                                        : target.result === "negative"
                                          ? "border-red-300 bg-red-50 text-red-600"
                                          : ""
                                    }`}
                                    value={target.result}
                                    onChange={(e) =>
                                      updateTarget(key, kit.id, target.id, {
                                        result: e.target.value,
                                      })
                                    }
                                  >
                                    <option value="pending">Result</option>
                                    <option value="positive">Positive</option>
                                    <option value="negative">Negative</option>
                                  </select>
                                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-current text-xs">
                                    ▾
                                  </span>
                                </div>

                                {/* Viral Copies */}
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-grey-50 border-l border-grey-20 pl-2 whitespace-nowrap">
                                    Viral Copies:
                                  </span>
                                  <div className="flex items-stretch border border-grey-40 rounded-lg overflow-hidden h-9 bg-white min-w-[150px]">
                                    <input
                                      type="text"
                                      placeholder="Value"
                                      className="w-full px-2.5 py-1.5 text-sm text-grey-80 outline-none bg-transparent border-r border-grey-20"
                                      value={target.viralCopies}
                                      onChange={(e) =>
                                        updateTarget(key, kit.id, target.id, {
                                          viralCopies: e.target.value,
                                        })
                                      }
                                    />
                                    <select
                                      className="px-2 py-1 text-xs font-semibold text-grey-60 bg-grey-10 outline-none cursor-pointer"
                                      value={target.unit}
                                      onChange={(e) =>
                                        updateTarget(key, kit.id, target.id, {
                                          unit: e.target.value,
                                        })
                                      }
                                    >
                                      {VIRAL_UNITS.map((u) => (
                                        <option key={u} value={u}>
                                          {u}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                {/* Remove target */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeTarget(key, kit.id, target.id)
                                  }
                                  className="h-9 w-9 flex items-center justify-center text-grey-40 hover:text-red-500 rounded-lg hover:bg-red-50 border border-grey-40 hover:border-red-200 transition-colors ml-auto"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}

                            {/* Add Ct Value */}
                            <button
                              type="button"
                              onClick={() => addTarget(key, kit.id)}
                              className="flex items-center gap-1.5 text-xs font-medium text-grey-60 hover:text-blue-50 transition-colors mt-1"
                            >
                              <Plus size={13} /> Add Ct Value
                            </button>

                            {/* Derived Subtype */}
                            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-dashed border-grey-15">
                              <span className="text-xs font-semibold text-grey-60">
                                Subtype:
                              </span>
                              {kit.derivedSubtype ? (
                                <span className="px-3 py-1 bg-grey-90 text-white rounded-md text-sm font-black tracking-widest">
                                  {kit.derivedSubtype}
                                </span>
                              ) : (
                                <span className="text-xs text-grey-40 italic">
                                  Auto-generated from positive targets
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-grey-20 overflow-hidden">
          <div className="px-4 py-3 border-b border-grey-20 bg-grey-5/60">
            <h4 className="font-semibold text-grey-90 text-sm">
              Upload Test Report (Optional)
            </h4>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              {state.common.testResultReport ? (
                <div
                  className={`flex items-center gap-3 px-4 py-3 border rounded-xl transition-colors bg-green-50 border-green-200`}
                >
                  <FileText size={18} className={"text-green-600 shrink-0"} />
                  <div className="flex-1 flex flex-col min-w-0">
                    <span
                      className={`text-sm font-medium truncate text-green-700`}
                    >
                      {getFileNameFromS3Url(
                        state.common.testResultReport || "",
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">
                        Uploaded
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePreview}
                      className={`p-1.5 rounded-md transition-colors text-green-400 hover:bg-green-100 hover:text-green-600`}
                      title="Preview document"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={clearDocument}
                      className={`p-1.5 rounded-md transition-colors text-green-400 hover:bg-green-100 hover:text-red-500`}
                      title="Remove document"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[80px] px-5 py-3 flex items-center justify-center gap-3 bg-grey-10/70 border border-dashed border-grey-30 rounded-xl">
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <Spinner />
                      <span className="text-xs text-blue-600 font-medium animate-pulse">
                        Uploading file...
                      </span>
                    </div>
                  ) : (
                    <label className="text-blue-40 font-medium cursor-pointer text-sm flex items-center gap-2 hover:text-grey-60 transition-colors">
                      <Upload size={16} />
                      Click to upload (PDF, CSV, Excel — max 25 MB)
                      <input
                        type="file"
                        accept={ACCEPTED_FILE_TYPES}
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

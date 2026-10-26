"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { motion } from "framer-motion";
import { FlaskConical, Trash2, ArrowRight, Save, Link2 } from "lucide-react";

import { Sample, SampleStatusType } from "@/src/types/sample";
import { User } from "@/src/types/global";
import { updateSampleApi } from "@/src/app/(dashboard)/lab/[sampleId]/actions";
import { getTeamMembersApi } from "@/src/app/(dashboard)/lab/[sampleId]/loader";
import { sampleAtom } from "@/src/store/sampleAtom";
import { userAtom } from "@/src/store/userAtom";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import { selectedProcessableSamplesAtom } from "@/src/store/processableSamplesAtom";
import { setSessionStorage } from "@/src/utils/session-storage";
import {
  SAMPLE_UNITS,
  NUCLEIC_ACID_TYPES,
  EXTRACTION_METHODS,
} from "@/src/utils/constant";
import Spinner from "@/src/components/ui/spinner";
import TeamMemberSelect from "@/src/components/lab/sample-accession/team-member-select";

interface SampleExtractionProps {
  isBulkMode?: boolean;
  onBulkSuccess?: (
    action: "exit" | "proceed" | "complete" | "back" | "skip",
    explicitNextTab?: SampleStatusType,
  ) => void;
  onBack?: () => void;
}

interface CommonExtractionData {
  nucleicAcidType: string;
  method: string;
  customMethod: string;
  storageTemperature: string;
  storageDetails: string;
  comments: string;
}

interface RowExtractionData {
  id: string; // group id (pooledId or sampleId)
  volUsed: string;
  volUsedUnit: string;
  volRemaining: string;
  volRemainingUnit: string;
  elutionVol: string;
  conc: string;
  ratio260_280: string;
  ratio260_230: string;
  pcrVol: string;
  pcrVolUnit: string;
  extractionDate: string;
}

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
      className={`flex items-stretch border border-grey-40 rounded-lg overflow-hidden focus-within:border-blue-40 focus-within:ring-2 focus-within:ring-blue-40/10 transition-all h-[36px] w-full min-w-[110px] ${bg}`}
    >
      <input
        type="number"
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 text-sm text-grey-80 outline-none bg-transparent border-r border-grey-20"
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

const inputCls =
  "w-full px-3 py-2 border border-grey-40 rounded-lg outline-none focus:border-blue-40 focus:ring-2 focus:ring-blue-40/10 text-sm text-grey-80 bg-white transition-all placeholder:text-grey-40";
const selectCls =
  "w-full px-3 py-2 border border-grey-40 rounded-lg outline-none focus:border-blue-40 focus:ring-2 focus:ring-blue-40/10 text-sm text-grey-80 bg-white transition-all appearance-none cursor-pointer";

export default function SampleExtraction({
  isBulkMode,
  onBulkSuccess,
  onBack,
}: SampleExtractionProps) {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  // 4.4: workspace-admins have no user.project, so fall back to the current
  // workspace's first project.
  const { resolveProjectId } = useCurrentProjectResolver();
  const currentProjectId = resolveProjectId();
  const sample = useAtomValue(sampleAtom);
  const setSample = useSetAtom(sampleAtom);
  const [selectedProcessableSamples, setSelectedProcessableSamples] = useAtom(
    selectedProcessableSamplesAtom,
  );

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitType, setSubmitType] = useState<"exit" | "proceed" | "skip">(
    "proceed",
  );

  // State
  const [commonData, setCommonData] = useState<CommonExtractionData>({
    nucleicAcidType: "",
    method: "",
    customMethod: "",
    storageTemperature: "",
    storageDetails: "",
    comments: "",
  });
  const [rowStates, setRowStates] = useState<Record<string, RowExtractionData>>(
    {},
  );
  const [performedById, setPerformedById] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [extractionCustomFields, setExtractionCustomFields] = useState<
    { label: string; value: string }[]
  >([]);

  // Team members
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState<boolean>(false);

  // Grouping Logic
  const samplesToProcess = useMemo(() => {
    if (isBulkMode) return selectedProcessableSamples;
    return sample ? [sample] : [];
  }, [isBulkMode, selectedProcessableSamples, sample]);

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

  // Load team members on mount
  useEffect(() => {
    const loadTeamMembers = async () => {
      const teamId = isBulkMode
        ? selectedProcessableSamples?.[0]?.team?.id
        : sample?.team?.id;

      if (!currentProjectId || !teamId) return;

      setLoadingTeamMembers(true);
      try {
        const response = await getTeamMembersApi(currentProjectId, teamId);
        setTeamMembers(response.data || []);
      } catch (error) {
        console.error("Error loading team members:", error);
      } finally {
        setLoadingTeamMembers(false);
      }
    };
    loadTeamMembers();
  }, [
    currentProjectId,
    sample?.team?.id,
    isBulkMode,
    selectedProcessableSamples,
  ]);

  // Initialization / Prep-fill
  useEffect(() => {
    if (groupedSamples.length > 0 && Object.keys(rowStates).length === 0) {
      // Pick the very first sample to prepopulate common data
      const firstSample = groupedSamples[0].samples[0];

      let isCustomMethod = false;
      const existingMethod = firstSample.details?.extraction?.method || "";
      if (
        existingMethod &&
        !EXTRACTION_METHODS.find((m) => m.value === existingMethod)
      ) {
        isCustomMethod = true;
      }
      setShowCustomInput(isCustomMethod);

      setCommonData({
        nucleicAcidType: firstSample.details?.extraction?.nucleicAcidType || "",
        method: isCustomMethod ? "other" : existingMethod,
        customMethod: isCustomMethod ? existingMethod : "",
        storageTemperature:
          firstSample.details?.extraction?.storageTemperature || "",
        storageDetails: firstSample.details?.extraction?.storageDetails || "",
        comments: firstSample.extractionComments || "",
      });

      if (firstSample.details?.extraction?.customFields) {
        setExtractionCustomFields(firstSample.details.extraction.customFields);
      }
      if (firstSample.extractedBy?.id) {
        setPerformedById(firstSample.extractedBy.id);
      }

      // Initialize row states
      const initialRowStates: Record<string, RowExtractionData> = {};
      const today = new Date().toISOString().split("T")[0];

      groupedSamples.forEach((group) => {
        const id = group.isPooled ? group.pooledId! : group.samples[0].id;
        const s = group.samples[0];

        let initialDate = today;
        if (s.extractionDateTime) {
          const d = new Date(s.extractionDateTime);
          if (!isNaN(d.getTime()) && d.getTime() > 0) {
            initialDate = d.toISOString().split("T")[0];
          }
        }

        initialRowStates[id] = {
          id,
          volUsed: s.extractionSampleUsedValue || "",
          volUsedUnit:
            s.extractionSampleUsedUnit ||
            s.details?.preprocessing?.pooledVolumeUnit ||
            s.unit ||
            "mL",
          volRemaining: s.extractionSampleRemainingValue || "",
          volRemainingUnit:
            s.extractionSampleRemainingUnit ||
            s.details?.preprocessing?.pooledVolumeUnit ||
            s.unit ||
            "mL",
          elutionVol: s.details?.extraction?.elutionVolume || "",
          conc: s.details?.extraction?.concentration || "",
          ratio260_280: s.details?.extraction?.ratio260_280 || "",
          ratio260_230: s.details?.extraction?.ratio260_230 || "",
          pcrVol: s.details?.extraction?.pcrVolume || "",
          pcrVolUnit: s.details?.extraction?.pcrVolumeUnit || "mL",
          extractionDate: initialDate,
        };
      });
      setRowStates(initialRowStates);
    }
  }, [groupedSamples, rowStates]);

  const handleCommonChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setCommonData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (
    id: string,
    field: keyof RowExtractionData,
    value: string,
  ) => {
    setRowStates((prev) => {
      const newState = { ...prev };
      if (!newState[id]) return prev;

      const oldValue = newState[id][field];
      newState[id] = { ...newState[id], [field]: value };

      // Autofill behavior: if editing the FIRST row, explicitly copy useful fields to others
      const firstId = groupedSamples[0]?.isPooled
        ? groupedSamples[0].pooledId!
        : groupedSamples[0]?.samples[0].id;
      if (
        firstId === id &&
        ["volUsed", "volUsedUnit", "elutionVol", "extractionDate"].includes(
          field,
        )
      ) {
        // Only sync if all other rows match the current (old) value of the first row
        const allOthersMatch = Object.keys(prev).every(
          (rowId) => rowId === id || prev[rowId][field] === oldValue,
        );

        if (allOthersMatch) {
          Object.keys(newState).forEach((rowId) => {
            if (rowId !== id) {
              newState[rowId] = { ...newState[rowId], [field]: value };
            }
          });
        }
      }

      return newState;
    });
  };

  const validate = () => {
    if (!performedById) {
      toast.error("Please select who performed this step.");
      return false;
    }
    if (!commonData.nucleicAcidType) {
      toast.error("Nucleic Acid Extracted is required.");
      return false;
    }
    if (
      !commonData.method ||
      (commonData.method === "other" && !commonData.customMethod)
    ) {
      toast.error("Extraction Method/Kit is required.");
      return false;
    }

    return true;
  };

  const handleBack = () => {
    if (isBulkMode && onBulkSuccess) {
      onBulkSuccess("back");
    } else if (onBack) {
      onBack();
    } else {
      router.replace("/lab");
    }
  };

  const handleSubmit = async (type: "exit" | "proceed" | "skip") => {
    if (!currentProjectId) return;

    // Allow skip without validation if we just want to bypass
    if (type !== "skip" && !validate()) return;

    try {
      setSubmitType(type);
      setSubmitting(true);

      const resolvedMethod =
        commonData.method === "other"
          ? commonData.customMethod
          : commonData.method;
      const performedByUser = teamMembers.find(
        (member) => member.id === performedById,
      );

      // Create promises for every individual sample mapped from its group rowState
      const promises = groupedSamples.flatMap((group) =>
        group.samples.map((originalSample) => {
          if (type === "skip") {
            // Just advance the status without doing full validation saving
            return updateSampleApi(currentProjectId, originalSample.id, {
              sampleStatus: "extracted",
            });
          }

          const r =
            rowStates[group.isPooled ? group.pooledId! : originalSample.id];
          if (!r)
            return Promise.resolve({
              success: false,
              data: undefined as Sample | undefined,
            });

          const payload: Partial<Sample> = {
            sampleStatus: "extracted",
            extractionDateTime: r.extractionDate
              ? new Date(r.extractionDate).toISOString()
              : undefined,
            extractionSampleUsedValue: r.volUsed,
            extractionSampleUsedUnit: r.volUsedUnit,
            extractionSampleRemainingValue: r.volRemaining,
            extractionSampleRemainingUnit: r.volRemainingUnit,
            extractionComments: commonData.comments,
            extractedBy: performedByUser,
            details: {
              ...(originalSample.details || {}),
              extraction: {
                ...(originalSample.details?.extraction || {}),
                nucleicAcidType: commonData.nucleicAcidType,
                method: resolvedMethod,
                storageTemperature: commonData.storageTemperature,
                storageDetails: commonData.storageDetails,
                elutionVolume: r.elutionVol,
                concentration: r.conc,
                pcrVolume: r.pcrVol,
                pcrVolumeUnit: r.pcrVolUnit,
                ratio260_280: r.ratio260_280,
                ratio260_230: r.ratio260_230,
                customFields: extractionCustomFields.filter(
                  (f) => f.label || f.value,
                ),
              },
            },
          };

          return updateSampleApi(currentProjectId, originalSample.id, payload);
        }),
      );

      const results = await Promise.all(promises);
      const allOk = results.every((r) => r.success !== false); // basic check

      if (allOk) {
        toast.success(
          type === "skip"
            ? `Skipped Extraction for ${samplesToProcess.length} sample${samplesToProcess.length > 1 ? "s" : ""}.`
            : `Extraction completed for ${samplesToProcess.length} sample${samplesToProcess.length > 1 ? "s" : ""}.`,
        );

        if (isBulkMode) {
          setSelectedProcessableSamples((prev) =>
            prev.map((s) => {
              const res = results.find((r) => r.success && r.data?.id === s.id);
              return res?.data ? { ...s, ...res.data } : s;
            }),
          );
          // Both Save & Exit and Proceed advance the sample to "extracted" now —
          // they only differ in where the user lands afterward.
          if (onBulkSuccess)
            onBulkSuccess(
              type === "exit" ? "exit" : type === "skip" ? "skip" : "proceed",
              "extracted",
            );
        } else if (results[0].data) {
          setSample((prev) => ({ ...prev, ...results[0].data }) as Sample);
          if (type === "exit") {
            setSessionStorage("activeTab", "extracted");
            router.replace("/lab");
          }
        }
      }
    } catch (error) {
      toast.error(
        (error as Error)?.message || "Error updating extraction details.",
      );
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (groupedSamples.length === 0 || Object.keys(rowStates).length === 0) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8 w-full min-w-0 overflow-hidden"
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-10 text-blue-50 flex items-center justify-center shrink-0">
          <FlaskConical size={20} strokeWidth={1.6} />
        </div>
        <div>
          <h3 className="font-noto-serif font-semibold text-xl text-grey-80">
            Extraction
          </h3>
          <p className="text-grey-70 text-sm">
            Log parameters and properties post-extraction.
          </p>
        </div>
      </div>

      {/* ── Common Settings ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-grey-20 rounded-2xl shadow-sm p-6 flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-bold text-grey-80 font-noto-serif">
            Common Extraction Parameters
          </h3>
          <p className="text-xs text-grey-600 mt-1">
            These values apply to all samples in this batch
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-grey-80 font-semibold text-xs uppercase tracking-wider">
              Nucleic Acid Extracted <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="nucleicAcidType"
                className={selectCls}
                value={commonData.nucleicAcidType}
                onChange={handleCommonChange}
              >
                <option value="" disabled>
                  Select type
                </option>
                {NUCLEIC_ACID_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-grey-40 text-xs">
                ▾
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-grey-80 font-semibold text-xs uppercase tracking-wider">
              Extraction Method/Kit <span className="text-red-500">*</span>
            </label>
            {!showCustomInput ? (
              <div className="relative">
                <select
                  name="method"
                  className={selectCls}
                  value={commonData.method}
                  onChange={(e) => {
                    if (e.target.value === "other") {
                      setShowCustomInput(true);
                      setCommonData((prev) => ({
                        ...prev,
                        method: "other",
                        customMethod: "",
                      }));
                    } else {
                      handleCommonChange(e);
                    }
                  }}
                >
                  <option value="" disabled>
                    Select method
                  </option>
                  {EXTRACTION_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-grey-40 text-xs">
                  ▾
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  name="customMethod"
                  type="text"
                  className={inputCls}
                  placeholder="Enter custom method"
                  value={commonData.customMethod}
                  onChange={handleCommonChange}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCommonData((prev) => ({
                      ...prev,
                      method: "",
                      customMethod: "",
                    }));
                  }}
                  className="text-grey-50 hover:text-grey-80 text-xs font-semibold px-2"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-grey-80 font-semibold text-xs uppercase tracking-wider">
              Storage Temperature
            </label>
            <input
              name="storageTemperature"
              placeholder="e.g. -80°C"
              className={inputCls}
              value={commonData.storageTemperature}
              onChange={handleCommonChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-grey-80 font-semibold text-xs uppercase tracking-wider">
              Storage Details
            </label>
            <input
              name="storageDetails"
              className={inputCls}
              placeholder="e.g., Freezer 2, Rack A3, Box 5"
              value={commonData.storageDetails}
              onChange={handleCommonChange}
            />
          </div>

          <TeamMemberSelect
            value={performedById}
            onChange={setPerformedById}
            teamMembers={teamMembers}
            loading={loadingTeamMembers}
            label="Extracted By"
            currentUserId={user?.id}
            defaultToCurrentUser={true}
          />
        </div>

        {/* Custom Fields */}
        <div className="flex flex-col gap-3 mt-2 border-t border-grey-20 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-grey-80 font-semibold text-xs uppercase tracking-wider">
              Additional Custom Parameters
            </span>
            <button
              type="button"
              className="text-blue-50 text-xs font-bold hover:underline bg-blue-10 px-3 py-1.5 rounded-lg"
              onClick={() =>
                setExtractionCustomFields((prev) => [
                  ...prev,
                  { label: "", value: "" },
                ])
              }
            >
              + Add Parameter
            </button>
          </div>
          {extractionCustomFields.length > 0 && (
            <div className="flex flex-col gap-3">
              {extractionCustomFields.map((field, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center"
                >
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="Parameter Name"
                    value={field.label}
                    onChange={(e) => {
                      const next = [...extractionCustomFields];
                      next[index] = { ...next[index], label: e.target.value };
                      setExtractionCustomFields(next);
                    }}
                  />
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="Measured Value"
                    value={field.value}
                    onChange={(e) => {
                      const next = [...extractionCustomFields];
                      next[index] = { ...next[index], value: e.target.value };
                      setExtractionCustomFields(next);
                    }}
                  />
                  <button
                    type="button"
                    className="w-10 h-10 px-3 py-2 text-grey-50 border border-grey-20 rounded-lg hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center shrink-0"
                    onClick={() =>
                      setExtractionCustomFields((prev) =>
                        prev.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Per-Sample Details ─────────────────────────────────────────────── */}
      <div className="bg-white border border-grey-20 rounded-2xl shadow-sm overflow-x-auto min-w-0 w-full">
        <div className="px-6 py-4 border-b border-grey-20 bg-grey-10/40 sticky left-0 z-10 w-full min-w-max">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-grey-80 font-noto-serif">
              Per-Sample Extraction Details — {groupedSamples.length} group
              {groupedSamples.length > 1 ? "s" : ""}
            </h3>
            <p className="text-[10px] text-grey-40 uppercase tracking-widest font-bold ml-8">
              Scroll horizontally for more fields →
            </p>
          </div>
          <p className="text-xs text-grey-600 mt-1">
            Fill values for the first row — Volume Used, Elution Volume, and
            Date will <strong>auto-fill</strong> for the rest if they
            haven&apos;t been manually edited.
          </p>
        </div>

        <table className="w-full text-left border-collapse min-w-[1450px]">
          <thead className="bg-grey-10/60 border-b border-grey-20">
            <tr>
              <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest whitespace-nowrap bg-grey-10/60 sticky left-0 z-10">
                Sample ID / Pool
              </th>
              <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest whitespace-nowrap">
                Type
              </th>
              <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest whitespace-nowrap">
                Vol. Used
              </th>
              <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest whitespace-nowrap">
                Vol. Remaining
              </th>
              <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest">
                Elution Vol. (µl)
              </th>
              <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest">
                Conc. (ng/µl)
              </th>
              <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest">
                260/280
              </th>
              <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest">
                260/230
              </th>
              <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest whitespace-nowrap">
                PCR Vol.
              </th>
              <th className="px-5 py-4 text-[10px] font-bold text-grey-600 uppercase tracking-widest whitespace-nowrap">
                Extraction Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-10">
            {groupedSamples.map((group) => {
              const id = group.isPooled ? group.pooledId! : group.samples[0].id;
              const r = rowStates[id];
              const sampleTypeDesc = group.samples[0].sampleType?.name || "—";

              if (!r) return null;

              return (
                <tr
                  key={id}
                  className="hover:bg-grey-10/30 transition-colors group"
                >
                  <td className="px-5 py-4 whitespace-nowrap sticky left-0 z-10 bg-white group-hover:bg-grey-10/30 transition-colors">
                    {group.isPooled ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-teal-700">
                          <Link2 size={14} />
                          <span className="text-sm font-bold">{id}</span>
                        </div>
                        <span className="text-[10px] text-grey-50 font-bold uppercase">
                          {group.samples.length} samples pooled
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-blue-50">
                        {group.samples[0].barcode}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-grey-70 font-medium">
                    {sampleTypeDesc}
                  </td>

                  {/* Vol Used */}
                  <td className="px-4 py-3">
                    <VolumeInput
                      volume={r.volUsed}
                      unit={r.volUsedUnit}
                      onVolumeChange={(v) => handleRowChange(id, "volUsed", v)}
                      onUnitChange={(u) =>
                        handleRowChange(id, "volUsedUnit", u)
                      }
                      bg="bg-slate-50"
                    />
                  </td>

                  {/* Vol Remaining */}
                  <td className="px-4 py-3">
                    <VolumeInput
                      volume={r.volRemaining}
                      unit={r.volRemainingUnit}
                      onVolumeChange={(v) =>
                        handleRowChange(id, "volRemaining", v)
                      }
                      onUnitChange={(u) =>
                        handleRowChange(id, "volRemainingUnit", u)
                      }
                    />
                  </td>

                  {/* Elution Vol */}
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      className={inputCls + " min-w-[100px] bg-slate-50"}
                      placeholder="Elution"
                      value={r.elutionVol}
                      onChange={(e) =>
                        handleRowChange(id, "elutionVol", e.target.value)
                      }
                    />
                  </td>

                  {/* Conc */}
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      className={inputCls + " min-w-[90px]"}
                      placeholder="Conc."
                      value={r.conc}
                      onChange={(e) =>
                        handleRowChange(id, "conc", e.target.value)
                      }
                    />
                  </td>

                  {/* 260/280 */}
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      className={inputCls + " min-w-[90px]"}
                      placeholder="1.80"
                      value={r.ratio260_280}
                      onChange={(e) =>
                        handleRowChange(id, "ratio260_280", e.target.value)
                      }
                    />
                  </td>

                  {/* 260/230 */}
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      className={inputCls + " min-w-[90px]"}
                      placeholder="2.00"
                      value={r.ratio260_230}
                      onChange={(e) =>
                        handleRowChange(id, "ratio260_230", e.target.value)
                      }
                    />
                  </td>

                  {/* PCR Vol (optional but kept for completeness based on old properties) */}
                  <td className="px-4 py-3">
                    <VolumeInput
                      volume={r.pcrVol}
                      unit={r.pcrVolUnit}
                      onVolumeChange={(v) => handleRowChange(id, "pcrVol", v)}
                      onUnitChange={(u) => handleRowChange(id, "pcrVolUnit", u)}
                      placeholder="PCR"
                    />
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      className={inputCls + " min-w-[130px]"}
                      value={r.extractionDate}
                      onChange={(e) =>
                        handleRowChange(id, "extractionDate", e.target.value)
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 pb-2">
        <button
          onClick={handleBack}
          className="px-5 py-2.5 rounded-xl border border-grey-20 text-grey-60 font-semibold text-sm hover:bg-grey-10 transition-all"
        >
          ← Back
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleSubmit("exit")}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-grey-30 text-grey-70 font-semibold text-sm hover:bg-grey-10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting && submitType === "exit" && <Spinner disabled />}
            <Save size={14} /> Save &amp; Exit
          </button>

          <button
            onClick={() => handleSubmit("proceed")}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-40 text-white font-bold text-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-40/10"
          >
            {submitting && submitType === "proceed" && <Spinner darkMode />}
            Proceed to Testing <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

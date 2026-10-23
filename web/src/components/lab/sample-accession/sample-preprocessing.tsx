"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import {
  Blend,
  Filter,
  Split,
  Combine,
  Save,
  ArrowRight,
  FlaskConical,
  Dna,
  AlertTriangle,
  Link2,
  Pencil,
} from "lucide-react";

import {
  Sample,
  PreprocessingStep,
  PreprocessingStepType,
  SampleStatusType,
} from "@/src/types/sample";
import { User } from "@/src/types/global";
import { updateSampleApi } from "@/src/app/(dashboard)/lab/[sampleId]/actions";
import { getTeamMembersApi } from "@/src/app/(dashboard)/lab/[sampleId]/loader";
import { sampleAtom } from "@/src/store/sampleAtom";
import { userAtom } from "@/src/store/userAtom";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import { selectedProcessableSamplesAtom } from "@/src/store/processableSamplesAtom";
import { setSessionStorage } from "@/src/utils/session-storage";
import {
  HOMOGENISATION_METHODS,
  FILTRATION_METHODS,
  ALIQUOTING_METHODS,
  DISEASE_BADGE_COLORS,
  SAMPLE_UNITS,
} from "@/src/utils/constant";
import Spinner from "@/src/components/ui/spinner";
import TeamMemberSelect from "@/src/components/lab/sample-accession/team-member-select";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SamplePreprocessingProps {
  isBulkMode?: boolean;
  onBulkSuccess?: (
    action: "exit" | "proceed" | "complete" | "back" | "skip",
    nextStageOverride?: SampleStatusType,
  ) => void;
  onBack?: () => void;
}

interface SampleProcessingState {
  sampleId: string;
  method: string;
  inputVolume: string;
  inputVolumeUnit: string;
  outputVolume: string;
  outputVolumeUnit: string;
  remarks: string;
}

/** A single pool group — multiple of these can coexist so users can create
 *  any split they like (e.g. 3 water in one pool, 2 blood in another). */
interface PoolGroup {
  key: string;
  sampleIds: string[];
  volume: string;
  volumeUnit: string;
  pooledId: string;
  locked: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const DiseaseBadge = ({ name }: { name: string }) => {
  const colorClass =
    DISEASE_BADGE_COLORS[name] ?? "bg-slate-50 text-slate-500 border-slate-200";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${colorClass}`}
    >
      {name}
    </span>
  );
};

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
    {children}
  </label>
);

const inputCls =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 text-sm text-slate-700 bg-white transition-all placeholder:text-slate-400";
const selectCls =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 text-sm text-slate-700 bg-white transition-all appearance-none cursor-pointer";

/** Merged volume + unit input, matching the pattern from the receiving step */
function VolumeInput({
  volume,
  unit,
  onVolumeChange,
  onUnitChange,
  placeholder = "Vol",
  bg = "bg-white",
  disabled = false,
}: {
  volume: string;
  unit: string;
  onVolumeChange: (v: string) => void;
  onUnitChange: (u: string) => void;
  placeholder?: string;
  bg?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-stretch border rounded-lg overflow-hidden transition-all h-[36px] w-full min-w-[110px] ${disabled ? "border-slate-100 bg-slate-50 opacity-60" : "border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/10 " + bg}`}
    >
      <input
        type="number"
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 text-sm text-slate-700 outline-none bg-transparent border-r border-slate-200 disabled:cursor-not-allowed"
        value={volume}
        disabled={disabled}
        onChange={(e) => onVolumeChange(e.target.value)}
      />
      <select
        className="px-2 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 outline-none disabled:cursor-not-allowed hover:enabled:bg-slate-100 transition-colors"
        value={unit}
        disabled={disabled}
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

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SamplePreprocessing({
  isBulkMode,
  onBulkSuccess,
  onBack,
}: SamplePreprocessingProps) {
  const router = useRouter();
  const user = useAtomValue(userAtom);
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

  // ── Core State ─────────────────────────────────────────────────────────────
  const [methodType, setMethodType] = useState<PreprocessingStepType | null>(
    null,
  );
  const [testingType, setTestingType] = useState<
    "virus-isolation" | "extraction"
  >("extraction");
  const [sampleStates, setSampleStates] = useState<SampleProcessingState[]>([]);

  // Pooling-specific — an array of independent pool groups (not a single Set),
  // so any split (4+1, 2+3, 1+1+1+1+1, mixed types each in their own pool) is possible.
  //
  // Checkbox model: at most one pool is ever "active" at a time. Checking an
  // unassigned sample adds it to the active pool (creating one if none exists).
  // Clicking a checkbox that belongs to a *different*, already-committed pool
  // doesn't toggle it — it switches focus to that pool instead, so its own
  // checkboxes light up and become editable. This avoids ambiguity without a dropdown.
  const [poolGroups, setPoolGroups] = useState<PoolGroup[]>([]);
  const [activePoolKey, setActivePoolKey] = useState<string | null>(null);
  const [poolTypeError, setPoolTypeError] = useState("");

  const isAIDisease = useMemo(() => {
    return samplesToProcess.some((s) =>
      s.diseases?.some((d) => d.shortName?.toUpperCase() === "AI"),
    );
  }, [samplesToProcess]);

  const isPoolingAvailable = useMemo(() => {
    if (samplesToProcess.length < 2) return false;
    const typeCounts = new Map<string, number>();
    samplesToProcess.forEach((s) => {
      const typeId = s.sampleType?.id || "unknown";
      typeCounts.set(typeId, (typeCounts.get(typeId) || 0) + 1);
    });
    return Array.from(typeCounts.values()).some((count) => count >= 2);
  }, [samplesToProcess]);

  useEffect(() => {
    if (!isAIDisease && testingType === "virus-isolation") {
      setTestingType("extraction");
    }
  }, [isAIDisease, testingType]);

  useEffect(() => {
    if (!isPoolingAvailable && methodType === "pooling") {
      setMethodType(null);
      setPoolGroups([]);
      setActivePoolKey(null);
      setPoolTypeError("");
    }
  }, [isPoolingAvailable, methodType]);

  const formatForInput = (date: string | Date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const getCurrentDateTime = () => formatForInput(new Date());

  // Common fields
  const [preprocessingDate, setPreprocessingDate] =
    useState(getCurrentDateTime());
  const [performedById, setPerformedById] = useState<string>("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState<"exit" | "proceed">("proceed");

  // ── Initialise per-sample state ────────────────────────────────────────────
  useEffect(() => {
    if (samplesToProcess.length > 0 && sampleStates.length === 0) {
      setSampleStates(
        samplesToProcess.map((s) => {
          const lastStep =
            s.preprocessingSteps?.[s.preprocessingSteps.length - 1];
          return {
            sampleId: s.id,
            method: lastStep?.method || "",
            inputVolume:
              lastStep?.inputVolume ||
              s.receivedVolumeValue ||
              s.quantity?.toString() ||
              "",
            inputVolumeUnit:
              lastStep?.inputVolumeUnit ||
              s.receivedVolumeUnit ||
              s.unit ||
              "mL",
            outputVolume: lastStep?.outputVolume || "",
            outputVolumeUnit:
              lastStep?.outputVolumeUnit ||
              s.receivedVolumeUnit ||
              s.unit ||
              "mL",
            remarks: lastStep?.remarks || "",
          };
        }),
      );

      const first = samplesToProcess[0];
      if (first) {
        if (first.preprocessingDate) {
          setPreprocessingDate(formatForInput(first.preprocessingDate));
        }
        if (first.preprocessingPerformedBy?.id)
          setPerformedById(first.preprocessingPerformedBy.id);
        if (first.details?.preprocessing?.comment)
          setComment(first.details.preprocessing.comment);
        const lastStep =
          first.preprocessingSteps?.[first.preprocessingSteps.length - 1];
        if (lastStep?.type) setMethodType(lastStep.type);
      }
    }
  }, [samplesToProcess, sampleStates.length]);

  // ── Team Members ──────────────────────────────────────────────────────────
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);

  useEffect(() => {
    const load = async () => {
      const teamId = samplesToProcess[0]?.team?.id;
      if (!currentProjectId || !teamId) return;
      setLoadingTeamMembers(true);
      try {
        const res = await getTeamMembersApi(currentProjectId, teamId);
        setTeamMembers(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingTeamMembers(false);
      }
    };
    load();
  }, [currentProjectId, samplesToProcess]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const updateSampleState = useCallback(
    (sampleId: string, patch: Partial<SampleProcessingState>) => {
      setSampleStates((prev) =>
        prev.map((s) => (s.sampleId === sampleId ? { ...s, ...patch } : s)),
      );
    },
    [],
  );

  const getMethodOptions = (type: PreprocessingStepType | null) => {
    switch (type) {
      case "homogenisation":
        return HOMOGENISATION_METHODS;
      case "filtration":
        return FILTRATION_METHODS;
      case "aliquoting":
        return ALIQUOTING_METHODS;
      default:
        return [];
    }
  };

  // ── Pooling helpers ────────────────────────────────────────────────────────

  /** Group samples by sampleType.id for validation */
  const samplesByType = useMemo(() => {
    const map = new Map<string, typeof samplesToProcess>();
    samplesToProcess.forEach((s) => {
      const key = s.sampleType?.id || "unknown";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return map;
  }, [samplesToProcess]);

  const computePooledVolume = useCallback(
    (ids: string[]) => {
      let totalVolume = 0;
      let unit = "mL";
      let unitFound = false;

      samplesToProcess.forEach((s) => {
        if (ids.includes(s.id)) {
          if (!unitFound && (s.receivedVolumeUnit || s.unit)) {
            unit = s.receivedVolumeUnit || s.unit || "mL";
            unitFound = true;
          }
          const val = Number(s.receivedVolumeValue || s.quantity || 0);
          if (!isNaN(val)) totalVolume += val;
        }
      });

      return { volume: totalVolume > 0 ? totalVolume.toString() : "", unit };
    },
    [samplesToProcess],
  );

  const getGroupForSample = useCallback(
    (sampleId: string) =>
      poolGroups.find((g) => g.sampleIds.includes(sampleId)),
    [poolGroups],
  );

  /** Discards the active pool if it never reached 2 members, otherwise leaves it
   *  as a normal committed pool. Always clears the "active" focus. */
  const finishActivePool = () => {
    if (!activePoolKey) return;
    const group = poolGroups.find((g) => g.key === activePoolKey);
    if (group && group.sampleIds.length < 2) {
      setPoolGroups(poolGroups.filter((g) => g.key !== activePoolKey));
    } else if (group) {
      setPoolGroups(
        poolGroups.map((g) =>
          g.key === activePoolKey ? { ...g, locked: true } : g,
        ),
      );
    }
    setActivePoolKey(null);
    setPoolTypeError("");
  };

  /** Makes an existing pool the active one (its checkboxes become editable),
   *  finalizing/discarding whatever was active before. */
  const editPool = (key: string) => {
    if (activePoolKey && activePoolKey !== key) {
      const current = poolGroups.find((g) => g.key === activePoolKey);
      if (current && current.sampleIds.length < 2) {
        setPoolGroups(poolGroups.filter((g) => g.key !== activePoolKey));
      }
    }
    setPoolGroups(
      poolGroups.map((g) => (g.key === key ? { ...g, locked: false } : g)),
    );
    setActivePoolKey(key);
    setPoolTypeError("");
  };

  const removePoolGroup = (key: string) => {
    setPoolGroups(poolGroups.filter((g) => g.key !== key));
    if (activePoolKey === key) setActivePoolKey(null);
  };

  const updatePoolGroup = (
    key: string,
    patch: Partial<Pick<PoolGroup, "volume" | "volumeUnit" | "pooledId">>,
  ) => {
    setPoolGroups(
      poolGroups.map((g) => (g.key === key ? { ...g, ...patch } : g)),
    );
  };

  /** Core checkbox handler — click on any sample row's checkbox (or the row itself). */
  const toggleSampleInActivePool = (sampleId: string) => {
    const sample = samplesToProcess.find((s) => s.id === sampleId);
    if (!sample) return;

    const existingGroup = getGroupForSample(sampleId);

    // Belongs to a locked pool → do nothing; user must click Edit first
    if (existingGroup?.locked) return;

    // Belongs to a different, uncommitted pool → switch focus to it instead
    // of toggling. This lets a checkbox "tied to another pool" be edited by
    // clicking it, without silently ripping the sample out of that pool.
    if (existingGroup && existingGroup.key !== activePoolKey) {
      setActivePoolKey(existingGroup.key);
      setPoolTypeError("");
      return;
    }

    let key = activePoolKey;
    let list = poolGroups;

    // No active pool yet → this checkbox starts one
    if (!key || !list.some((g) => g.key === key)) {
      key = `pool-${Date.now()}`;
      list = [
        ...poolGroups,
        {
          key,
          sampleIds: [],
          volume: "",
          volumeUnit: "mL",
          pooledId: `POOL-${poolGroups.length + 1}`,
          locked: false,
        },
      ];
    }

    const idx = list.findIndex((g) => g.key === key);
    const group = list[idx];
    const isMember = group.sampleIds.includes(sampleId);

    if (isMember) {
      // Uncheck — remove from the active pool
      const remainingIds = group.sampleIds.filter((id) => id !== sampleId);
      if (remainingIds.length === 0) {
        setPoolGroups(list.filter((g) => g.key !== key));
        setActivePoolKey(null);
        setPoolTypeError("");
        return;
      }
      const { volume, unit } = computePooledVolume(remainingIds);
      const next = [...list];
      next[idx] = {
        ...group,
        sampleIds: remainingIds,
        volume,
        volumeUnit: unit,
      };
      setPoolGroups(next);
      setActivePoolKey(key);
      setPoolTypeError("");
      return;
    }

    // Check — add to the active pool, but only if the type matches
    const firstMember = group.sampleIds[0]
      ? samplesToProcess.find((s) => s.id === group.sampleIds[0])
      : null;
    if (firstMember && firstMember.sampleType?.id !== sample.sampleType?.id) {
      setPoolTypeError(
        `Cannot add "${sample.barcode}" — this pool already contains ${firstMember.sampleType?.name} samples.`,
      );
      return;
    }

    const newIds = [...group.sampleIds, sampleId];
    const { volume, unit } = computePooledVolume(newIds);
    const next = [...list];
    next[idx] = { ...group, sampleIds: newIds, volume, volumeUnit: unit };
    setPoolGroups(next);
    setActivePoolKey(key);
    setPoolTypeError("");
  };

  /** Quick action: group every not-yet-pooled sample of a given type into one new pool. */
  const poolAllOfType = (typeId: string) => {
    let base = poolGroups;

    // Finalize/discard whatever was being built via checkboxes first
    if (activePoolKey) {
      const current = base.find((g) => g.key === activePoolKey);
      if (current && current.sampleIds.length < 2) {
        base = base.filter((g) => g.key !== activePoolKey);
      }
      setActivePoolKey(null);
    }

    const alreadyPooled = new Set(base.flatMap((g) => g.sampleIds));
    const ids = samplesToProcess
      .filter(
        (s) =>
          (s.sampleType?.id || "unknown") === typeId &&
          !alreadyPooled.has(s.id),
      )
      .map((s) => s.id);

    if (ids.length < 2) {
      setPoolGroups(base);
      setPoolTypeError("");
      return;
    }

    const { volume, unit } = computePooledVolume(ids);
    setPoolGroups([
      ...base,
      {
        key: `pool-${Date.now()}-${typeId}`,
        sampleIds: ids,
        volume,
        volumeUnit: unit,
        pooledId: `POOL-${base.length + 1}`,
        locked: true,
      },
    ]);
    setPoolTypeError("");
  };

  /** Rows for the pooling table, grouped by sample type. Within each type,
   *  pooled samples are kept together immediately followed by their pool's
   *  summary card, then any remaining unpooled samples of that type follow —
   *  so a pool's card always lands directly under the rows it contains. */
  type PoolingRow =
    | { kind: "type-header"; typeId: string; typeName: string; count: number }
    | { kind: "sample"; sample: Sample }
    | { kind: "pool-summary"; group: PoolGroup; poolNumber: number };

  const orderedPoolingRows = useMemo(() => {
    const rows: PoolingRow[] = [];

    Array.from(samplesByType.entries()).forEach(([typeId, samples]) => {
      rows.push({
        kind: "type-header",
        typeId,
        typeName: samples[0]?.sampleType?.name || "Unknown",
        count: samples.length,
      });

      // pools belonging to this type, in the order they were created
      const poolsForType = poolGroups.filter((g) => {
        const first = samplesToProcess.find((s) => s.id === g.sampleIds[0]);
        return (first?.sampleType?.id || "unknown") === typeId;
      });
      const pooledIdsForType = new Set(
        poolsForType.flatMap((g) => g.sampleIds),
      );

      poolsForType.forEach((group) => {
        const poolNumber = poolGroups.findIndex((g) => g.key === group.key) + 1;
        group.sampleIds.forEach((id) => {
          const sample = samples.find((s) => s.id === id);
          if (sample) rows.push({ kind: "sample", sample });
        });
        rows.push({ kind: "pool-summary", group, poolNumber });
      });

      samples
        .filter((s) => !pooledIdsForType.has(s.id))
        .forEach((sample) => rows.push({ kind: "sample", sample }));
    });

    return rows;
  }, [samplesByType, poolGroups, samplesToProcess]);

  const incompletePools = useMemo(
    () => poolGroups.filter((g) => g.sampleIds.length < 2),
    [poolGroups],
  );

  // ── Validation ────────────────────────────────────────────────────────────
  // Pre-processing is optional — no method selected = skip.
  // When a method IS selected, enforce method-specific rules.
  const isFormValid = useMemo(() => {
    if (samplesToProcess.length === 0) return false;
    // No method selected → skip mode, always valid
    if (!methodType) return true;
    if (methodType === "pooling") {
      return (
        poolGroups.length > 0 &&
        poolGroups.every((g) => g.sampleIds.length >= 2)
      );
    }
    return (
      sampleStates.length > 0 && sampleStates.every((ss) => ss.method !== "")
    );
  }, [samplesToProcess.length, methodType, poolGroups, sampleStates]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (forceExit = false) => {
    if (!currentProjectId || !isFormValid || submitting) return;

    try {
      setSubmitting(true);
      setSubmitType(forceExit ? "exit" : "proceed");

      const performedByUser = teamMembers.find((m) => m.id === performedById);
      const isoDate = preprocessingDate
        ? new Date(preprocessingDate).toISOString()
        : new Date().toISOString();
      const nextStatus =
        testingType === "virus-isolation" ? "virus-isolation" : "pre-processed";

      let updatePromises: Promise<unknown>[];

      if (!methodType) {
        // Skip mode — no preprocessing, just advance the status
        updatePromises = samplesToProcess.map((s) =>
          updateSampleApi(currentProjectId, s.id, {
            sampleStatus: nextStatus,
          }),
        );
      } else if (methodType === "pooling") {
        // Each pool group produces its own step + pooledId, independent of the others,
        // so multiple simultaneous pools (of the same or different types) are supported.
        updatePromises = samplesToProcess.map((original) => {
          const group = getGroupForSample(original.id);

          if (group) {
            const poolStep: PreprocessingStep = {
              type: "pooling",
              method: "pooling",
              inputVolume: "", // individual; not really applicable for pool
              inputVolumeUnit: "mL",
              outputVolume: group.volume,
              outputVolumeUnit: group.volumeUnit,
              pooledId: group.pooledId,
              timestamp: isoDate,
            };

            const payload: Partial<Sample> = {
              sampleStatus: nextStatus,
              preprocessingSteps: [
                ...(original.preprocessingSteps || []),
                poolStep,
              ],
              preprocessingDate: isoDate,
              preprocessingPerformedBy: performedByUser,
              isPooledSample: true,
              pooledSampleIds: group.sampleIds.filter(
                (id) => id !== original.id,
              ),
              details: {
                ...(original.details || {}),
                preprocessing: {
                  ...(original.details?.preprocessing || {}),
                  comment,
                  pooledVolume: group.volume,
                  pooledVolumeUnit: group.volumeUnit,
                  pooledId: group.pooledId,
                },
              },
            };
            return updateSampleApi(currentProjectId, original.id, payload);
          } else {
            // Unassigned samples are just skipped (no pre-processing step records stored),
            // but move to next status and keep the date
            const payload: Partial<Sample> = {
              sampleStatus: nextStatus,
              preprocessingDate: isoDate,
            };
            return updateSampleApi(currentProjectId, original.id, payload);
          }
        });
      } else {
        // Non-pooling: per-sample steps
        updatePromises = sampleStates.map((ss, idx) => {
          const original = samplesToProcess[idx];
          const step: PreprocessingStep = {
            type: methodType,
            method: ss.method || methodType,
            inputVolume: ss.inputVolume,
            inputVolumeUnit: ss.inputVolumeUnit,
            outputVolume: ss.outputVolume,
            outputVolumeUnit: ss.outputVolumeUnit,
            remarks: ss.remarks || undefined,
            timestamp: isoDate,
          };
          const payload: Partial<Sample> = {
            sampleStatus: nextStatus,
            preprocessingSteps: [...(original?.preprocessingSteps || []), step],
            preprocessingDate: isoDate,
            preprocessingPerformedBy: performedByUser,
            details: {
              ...(original?.details || {}),
              preprocessing: {
                ...(original?.details?.preprocessing || {}),
                comment,
              },
            },
          };
          return updateSampleApi(currentProjectId, ss.sampleId, payload);
        });
      }

      const results = (await Promise.all(updatePromises)) as Array<{
        success: boolean;
        data?: Sample;
      }>;
      const allSucceeded = results.every((r) => r.success);

      if (allSucceeded) {
        toast.success(
          methodType
            ? `Pre-processing completed for ${samplesToProcess.length} sample${samplesToProcess.length > 1 ? "s" : ""}.`
            : `Skipped pre-processing for ${samplesToProcess.length} sample${samplesToProcess.length > 1 ? "s" : ""}.`,
        );

        if (isBulkMode) {
          setSelectedBulkSamples((prev) =>
            prev.map((s) => {
              const res = results.find((r) => r.success && r.data?.id === s.id);
              return res?.data ? { ...s, ...res.data } : s;
            }),
          );
          if (onBulkSuccess) {
            // Both Save & Exit and Proceed advance the sample to nextStatus now —
            // they only differ in where the user lands afterward.
            onBulkSuccess(forceExit ? "exit" : "proceed", nextStatus);
          }
        } else if (results[0].data) {
          setSample((prev) => ({ ...prev, ...results[0].data }) as Sample);
          if (forceExit) {
            setSessionStorage("activeTab", nextStatus);
            router.replace("/lab");
          }
        }
      }
    } catch (error) {
      toast.error("Error saving pre-processing data.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (isBulkMode && onBulkSuccess) onBulkSuccess("back");
    else if (onBack) onBack();
    else router.replace("/lab");
  };

  // Derived counts for pooling
  const pooledCount = poolGroups.reduce((n, g) => n + g.sampleIds.length, 0);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      {/* ── Method Cards ───────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pre-processing Method
            </h3>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Optional
            </span>
          </div>
          {methodType && (
            <button
              onClick={() => {
                setMethodType(null);
                setPoolGroups([]);
                setActivePoolKey(null);
                setPoolTypeError("");
              }}
              className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
            >
              ✕ Clear selection
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              id: "homogenisation",
              label: "Homogenisation",
              desc: "Break down sample",
              icon: Blend,
            },
            {
              id: "filtration",
              label: "Filtration",
              desc: "Remove particles",
              icon: Filter,
            },
            {
              id: "aliquoting",
              label: "Aliquoting",
              desc: "Divide into portions",
              icon: Split,
            },
            ...(isPoolingAvailable
              ? [
                  {
                    id: "pooling" as const,
                    label: "Pooling",
                    desc: "Combine samples",
                    icon: Combine,
                  },
                ]
              : []),
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMethodType(m.id as PreprocessingStepType);
                setPoolGroups([]);
                setActivePoolKey(null);
                setPoolTypeError("");
              }}
              className={`flex flex-col items-center justify-center gap-2 p-5 border rounded-2xl transition-all ${
                methodType === m.id
                  ? "border-teal-400 bg-teal-50/40 text-teal-700 shadow-sm ring-2 ring-teal-400/10"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <m.icon
                size={26}
                strokeWidth={methodType === m.id ? 2 : 1.5}
                className={
                  methodType === m.id ? "text-teal-600" : "text-slate-400"
                }
              />
              <div className="text-center">
                <span className="block font-bold text-sm">{m.label}</span>
                <span className="block text-[10px] opacity-60 font-medium uppercase tracking-wider">
                  {m.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Samples Table  ─────────────────────────────────────────────────── */}
      {methodType && methodType !== "pooling" && (
        // ── Normal per-sample table ──────────────────────────────────────────
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Sample ID
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Type
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Disease
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Input Vol.
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Output Vol.
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {samplesToProcess.map((sample, idx) => {
                const ss = sampleStates[idx];
                if (!ss) return null;
                return (
                  <tr
                    key={sample.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-teal-700">
                      {sample.barcode}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 font-medium">
                      {sample.sampleType?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {sample.diseases?.map((disease) => (
                        <DiseaseBadge
                          key={disease.id}
                          name={disease.shortName || "N/A"}
                        />
                      ))}
                    </td>

                    {/* Method */}
                    <td className="px-4 py-3">
                      <div className="relative min-w-[160px]">
                        <select
                          className={selectCls}
                          value={ss.method}
                          onChange={(e) =>
                            updateSampleState(sample.id, {
                              method: e.target.value,
                            })
                          }
                        >
                          <option value="">Select method</option>
                          {getMethodOptions(methodType).map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                          ▾
                        </span>
                      </div>
                    </td>

                    {/* Input Vol. */}
                    <td className="px-4 py-3">
                      <VolumeInput
                        volume={ss.inputVolume}
                        unit={ss.inputVolumeUnit}
                        onVolumeChange={(v) =>
                          updateSampleState(sample.id, { inputVolume: v })
                        }
                        onUnitChange={(u) =>
                          updateSampleState(sample.id, { inputVolumeUnit: u })
                        }
                        bg="bg-slate-50"
                      />
                    </td>

                    {/* Output Vol. */}
                    <td className="px-4 py-3">
                      <VolumeInput
                        volume={ss.outputVolume}
                        unit={ss.outputVolumeUnit}
                        onVolumeChange={(v) =>
                          updateSampleState(sample.id, { outputVolume: v })
                        }
                        onUnitChange={(u) =>
                          updateSampleState(sample.id, { outputVolumeUnit: u })
                        }
                        placeholder="Vol"
                      />
                    </td>

                    {/* Remarks */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className={inputCls + " min-w-[150px] !py-1.5"}
                        placeholder="Notes..."
                        value={ss.remarks}
                        onChange={(e) =>
                          updateSampleState(sample.id, {
                            remarks: e.target.value,
                          })
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {methodType === "pooling" && (
        // ── Pooling UI — checkbox-driven, grouped by type, supports N pools ──
        <section className="flex flex-col gap-4">
          {/* Type restriction notice */}
          {samplesByType.size > 1 && (
            <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              <AlertTriangle
                size={14}
                className="shrink-0 mt-0.5 text-amber-500"
              />
              <span>
                Multiple sample types detected. Each pool can only contain
                samples of the <strong>same type</strong>, but you can create as
                many pools as you like — just check the samples for one pool,
                then start the next.
              </span>
            </div>
          )}

          {poolTypeError && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertTriangle size={13} className="shrink-0 text-red-500" />
              {poolTypeError}
            </div>
          )}

          {incompletePools.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              <AlertTriangle size={13} className="shrink-0 text-amber-500" />
              {incompletePools.length === 1
                ? "One pool has fewer than 2 samples — add another or remove it before proceeding."
                : `${incompletePools.length} pools have fewer than 2 samples — add more or remove them before proceeding.`}
            </div>
          )}

          {/* Quick actions: one click per type with ≥2 unassigned samples */}
          {samplesByType.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs font-semibold text-slate-400">
                Quick pool:
              </span>
              {Array.from(samplesByType.entries()).map(([typeId, samples]) => {
                const alreadyPooled = new Set(
                  poolGroups.flatMap((g) => g.sampleIds),
                );
                const unassignedCount = samples.filter(
                  (s) => !alreadyPooled.has(s.id),
                ).length;
                if (unassignedCount < 2) return null;
                return (
                  <button
                    key={typeId}
                    onClick={() => poolAllOfType(typeId)}
                    className="text-xs font-semibold text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    All {samples[0]?.sampleType?.name || "Unknown"} (
                    {unassignedCount})
                  </button>
                );
              })}
            </div>
          )}

          {/* Sample table — grouped by type; each pool's summary card is inlined
              directly under the rows that belong to it. */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">
                Select Samples to Pool
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {pooledCount} of {samplesToProcess.length} pooled ·{" "}
                {poolGroups.length} pool{poolGroups.length !== 1 ? "s" : ""}
              </span>
            </div>

            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <span className="text-xs font-bold text-slate-400">
                      Pool?
                    </span>
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Sample ID
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Disease
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Received Vol.
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderedPoolingRows.map((row) => {
                  // ── Type section header ──────────────────────────────────
                  if (row.kind === "type-header") {
                    return (
                      <tr
                        key={`type-${row.typeId}`}
                        className="bg-slate-100/70"
                      >
                        <td colSpan={5} className="px-4 py-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            {row.typeName}
                          </span>
                          <span className="ml-2 text-[11px] font-semibold text-slate-400">
                            {row.count} sample{row.count !== 1 ? "s" : ""}
                          </span>
                        </td>
                      </tr>
                    );
                  }

                  // ── Inline pool summary card ─────────────────────────────
                  if (row.kind === "pool-summary") {
                    const { group, poolNumber } = row;
                    const isActive = group.key === activePoolKey;
                    const isIncomplete = group.sampleIds.length < 2;
                    const typeName = samplesToProcess.find(
                      (s) => s.id === group.sampleIds[0],
                    )?.sampleType?.name;
                    return (
                      <tr
                        key={`pool-summary-${group.key}`}
                        className={
                          isActive ? "bg-teal-50/60" : "bg-slate-50/60"
                        }
                      >
                        <td colSpan={5} className="px-4 py-3">
                          <div
                            className={`border rounded-xl p-4 flex flex-col gap-3 bg-white ${isActive ? "border-teal-300" : "border-slate-200"}`}
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <Link2
                                  size={16}
                                  className={
                                    isActive
                                      ? "text-teal-600"
                                      : "text-slate-400"
                                  }
                                />
                                <span
                                  className={`text-sm font-bold ${isActive ? "text-teal-700" : "text-slate-600"}`}
                                >
                                  Pool {poolNumber} — {group.sampleIds.length}{" "}
                                  sample
                                  {group.sampleIds.length !== 1 ? "s" : ""}{" "}
                                  combined
                                  {typeName && (
                                    <span className="ml-2 font-medium text-slate-400">
                                      ({typeName})
                                    </span>
                                  )}
                                </span>
                                {isActive && (
                                  <span className="text-[10px] font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Editing
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                {isActive ? (
                                  <button
                                    onClick={finishActivePool}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
                                  >
                                    Done
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => editPool(group.key)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors"
                                  >
                                    <Pencil size={14} /> Edit
                                  </button>
                                )}
                                <button
                                  onClick={() => removePoolGroup(group.key)}
                                  className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                                >
                                  ✕ Remove pool
                                </button>
                              </div>
                            </div>

                            {isIncomplete && (
                              <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                Select at least one more{" "}
                                {typeName || "matching"} sample to complete this
                                pool.
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <FieldLabel>Pooled Volume</FieldLabel>
                                <VolumeInput
                                  volume={group.volume}
                                  unit={group.volumeUnit}
                                  onVolumeChange={(v) =>
                                    updatePoolGroup(group.key, { volume: v })
                                  }
                                  onUnitChange={(u) =>
                                    updatePoolGroup(group.key, {
                                      volumeUnit: u,
                                    })
                                  }
                                  placeholder="Total Vol"
                                  disabled={group.locked}
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <FieldLabel>Pooled ID</FieldLabel>
                                <input
                                  type="text"
                                  placeholder="e.g., POOL-2026-001"
                                  className={
                                    inputCls +
                                    (group.locked
                                      ? " opacity-60 cursor-not-allowed bg-slate-50 border-slate-100"
                                      : "")
                                  }
                                  value={group.pooledId}
                                  disabled={group.locked}
                                  onChange={(e) =>
                                    updatePoolGroup(group.key, {
                                      pooledId: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  // ── Sample row ────────────────────────────────────────────
                  const { sample } = row;
                  const group = getGroupForSample(sample.id);
                  const isChecked = !!group;
                  const isActiveMember = group?.key === activePoolKey;
                  const isLocked = group?.locked ?? false;
                  const unit = sample.receivedVolumeUnit || sample.unit || "mL";

                  return (
                    <tr
                      key={sample.id}
                      onClick={() =>
                        !isLocked && toggleSampleInActivePool(sample.id)
                      }
                      className={`transition-colors ${
                        isLocked
                          ? "opacity-60 cursor-default"
                          : isActiveMember
                            ? "bg-teal-50/40 cursor-pointer"
                            : group
                              ? "bg-slate-50 hover:bg-slate-100/60 cursor-pointer"
                              : "hover:bg-slate-50/50 cursor-pointer"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded accent-teal-500 cursor-pointer"
                            checked={isChecked}
                            disabled={isLocked}
                            onChange={() =>
                              !isLocked && toggleSampleInActivePool(sample.id)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                          {group && !isActiveMember && (
                            <span
                              title={
                                isLocked
                                  ? "Locked — click Edit to modify"
                                  : `In Pool ${poolGroups.findIndex((g) => g.key === group.key) + 1} — click to edit`
                              }
                              className="text-[9px] font-bold text-slate-400 bg-slate-200 px-1 py-0.5 rounded whitespace-nowrap"
                            >
                              P
                              {poolGroups.findIndex(
                                (g) => g.key === group.key,
                              ) + 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-teal-700">
                        {sample.barcode}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 font-medium whitespace-nowrap">
                        {sample.sampleType?.name || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {sample.diseases?.map((d) => (
                          <DiseaseBadge
                            key={d.id}
                            name={d.shortName || "N/A"}
                          />
                        ))}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {sample.receivedVolumeValue
                          ? `${sample.receivedVolumeValue} ${unit}`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Testing Type ─────────────────────────────────────────────────── */}
      {isAIDisease && (
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Testing Type
          </h3>
          <p className="text-xs text-slate-400 px-1 -mt-1">
            Select the testing pathway for these samples
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                id: "virus-isolation" as const,
                label: "Virus Isolation",
                desc: "Proceed to Virus Isolation step",
                icon: FlaskConical,
                active:
                  "border-blue-400 bg-blue-100 text-blue-700 ring-2 ring-blue-400/10",
                iconActive: "text-blue-600",
                iconBg: "bg-blue-100",
              },
              {
                id: "extraction" as const,
                label: "Extraction",
                desc: "Proceed directly to Extraction",
                icon: Dna,
                active:
                  "border-teal-400 bg-teal-50/40 text-teal-700 ring-2 ring-teal-400/10",
                iconActive: "text-teal-600",
                iconBg: "bg-teal-100",
              },
            ].map((t) => {
              const isActive = testingType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTestingType(t.id)}
                  className={`flex items-center gap-4 p-5 border rounded-2xl transition-all shadow-sm ${
                    isActive
                      ? t.active
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${isActive ? t.iconBg : "bg-slate-100"}`}
                  >
                    <t.icon
                      size={24}
                      className={isActive ? t.iconActive : "text-slate-400"}
                    />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-sm">{t.label}</span>
                    <span className="block text-[10px] opacity-60 font-medium uppercase tracking-wider">
                      {t.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Operator & Timestamp ─────────────────────────────────────────── */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeamMemberSelect
            value={performedById}
            onChange={setPerformedById}
            teamMembers={teamMembers}
            loading={loadingTeamMembers}
            label="Performed By"
            currentUserId={user?.id}
            defaultToCurrentUser={true}
            required={false}
          />

          <div className="flex flex-col gap-1.5">
            <FieldLabel>Timestamp</FieldLabel>
            <input
              type="datetime-local"
              className={inputCls}
              value={preprocessingDate}
              onChange={(e) => setPreprocessingDate(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <FieldLabel>Additional Comments</FieldLabel>
            <textarea
              className={inputCls + " mt-1.5 min-h-[72px] resize-none"}
              placeholder="Add any additional comments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-auto mb-2 px-1">
        <span className="text-xs font-semibold text-slate-400">
          {samplesToProcess.length} sample
          {samplesToProcess.length !== 1 ? "s" : ""} selected for pre-processing
          {methodType === "pooling" && poolGroups.length > 0 && (
            <span className="ml-2 text-teal-600">
              · {pooledCount} in {poolGroups.length} pool
              {poolGroups.length !== 1 ? "s" : ""}
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          onClick={handleBack}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit(true)}
            disabled={submitting || !isFormValid}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting && submitType === "exit" && <Spinner disabled />}
            <Save size={14} /> Save &amp; Exit
          </button>

          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting || !isFormValid}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md ${
              testingType === "virus-isolation"
                ? "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20"
                : "bg-teal-500 hover:bg-teal-600 shadow-teal-500/20"
            }`}
          >
            {submitting && submitType === "proceed" && <Spinner darkMode />}
            Proceed to{" "}
            {testingType === "virus-isolation"
              ? "Virus Isolation"
              : "Extraction"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

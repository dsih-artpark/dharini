import { useAtom, useAtomValue } from "jotai";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { TestTubeDiagonal } from "lucide-react";

import {
  createKitApi,
  createLabTestApi,
  updateSampleApi,
} from "@/src/app/(dashboard)/lab/[sampleId]/actions";
import {
  getKitsApi,
  getLabTestApi,
  getTeamMembersApi,
} from "@/src/app/(dashboard)/lab/[sampleId]/loader";
import Spinner from "@/src/components/ui/spinner";
import DiseaseTestGroupCard, {
  DiseaseTestState,
  SampleTestParams,
  SampleGroup,
  CtTarget,
} from "@/src/components/lab/sample-accession/disease-grouped-test-card";
import { OTHERS_OPTION } from "@/src/utils/constant";
import { selectedProcessableSamplesAtom } from "@/src/store/processableSamplesAtom";
import { sampleAtom } from "@/src/store/sampleAtom";
import { userAtom } from "@/src/store/userAtom";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import { Disease, User } from "@/src/types/global";
import {
  Kit,
  LabTest,
  Sample,
  TestResultType,
  SampleStatusType,
} from "@/src/types/sample";

// Per-disease error shape
type DiseaseError = {
  kitOrProtocol?: string;
  samples?: string;
};
type ErrorState = {
  global?: string;
  [diseaseId: string]: string | DiseaseError | undefined;
};

interface SampleTestingProps {
  isBulkMode?: boolean;
  onBulkSuccess?: (
    action: "exit" | "proceed" | "complete" | "back",
    nextTab?: SampleStatusType,
  ) => void;
  onBack?: () => void;
}

export default function SampleTesting({
  isBulkMode,
  onBulkSuccess,
  onBack,
}: SampleTestingProps) {
  const { sampleId } = useParams<{ sampleId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRetest = searchParams.get("retest") === "1";
  const user = useAtomValue(userAtom);
  // 4.4: workspace-admins have no user.project, so fall back to the current
  // workspace's first project.
  const { resolveProjectId } = useCurrentProjectResolver();
  const currentProjectId = resolveProjectId();
  const [sample, setSample] = useAtom(sampleAtom);
  const [selectedProcessableSamples, setSelectedProcessableSamples] = useAtom(
    selectedProcessableSamplesAtom,
  );

  const [kits, setKits] = useState<Kit[]>();
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState<boolean>(false);
  const [diseaseStates, setDiseaseStates] = useState<
    Record<string, DiseaseTestState>
  >({});
  const [errors, setErrors] = useState<ErrorState>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitType, setSubmitType] = useState<"exit" | "complete">("complete");

  // All raw samples to test
  const targetSamples = useMemo<Sample[]>(() => {
    if (isBulkMode) return selectedProcessableSamples;
    const all: Sample[] = [];
    if (sample) all.push(sample as Sample);
    all.push(...selectedProcessableSamples);
    return all;
  }, [isBulkMode, sample, selectedProcessableSamples]);

  // Build pooled groups (same logic as extraction)
  const sampleGroups = useMemo<SampleGroup[]>(() => {
    const groupMap = new Map<string, SampleGroup>();
    targetSamples.forEach((s) => {
      const pId = s.details?.preprocessing?.pooledId;
      if (s.isPooledSample && pId) {
        if (!groupMap.has(pId)) {
          groupMap.set(pId, { isPooled: true, pooledId: pId, samples: [] });
        }
        groupMap.get(pId)!.samples.push(s);
      } else {
        groupMap.set(s.id, { isPooled: false, samples: [s] });
      }
    });
    return Array.from(groupMap.values());
  }, [targetSamples]);

  const filteredDiseases = useMemo(() => {
    const diseaseMap = new Map<string, Disease>();
    targetSamples.forEach((s) => {
      s.diseases?.forEach((d) => {
        if (!diseaseMap.has(d.id)) {
          diseaseMap.set(d.id, d);
        }
      });
    });
    const allDiseases = Array.from(diseaseMap.values());
    return allDiseases.filter((d) =>
      isRetest ? d.shortName?.toUpperCase() === "AI" : true,
    );
  }, [targetSamples, isRetest]);

  useEffect(() => {
    if (!kits?.length) {
      getKitsApi()
        .then((response) => {
          if (response.success) setKits(response.data);
        })
        .catch(() => toast.error("Error fetching kits"));
    }
  }, []);

  useEffect(() => {
    const loadTeamMembers = async () => {
      const teamId = targetSamples?.[0]?.team?.id;
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
  }, [currentProjectId, targetSamples]);

  // Initialise disease states (keyed by group key — pooledId or sampleId)
  useEffect(() => {
    if (!filteredDiseases.length || !sampleGroups.length) return;
    if (Object.keys(diseaseStates).length > 0) return;

    const initState: Record<string, DiseaseTestState> = {};

    filteredDiseases.forEach((d) => {
      const samplesState: Record<string, SampleTestParams> = {};

      sampleGroups.forEach((group) => {
        // Only include sample groups that have this disease
        const hasDisease = group.samples.some((s) =>
          s.diseases?.some((sd) => sd.id === d.id),
        );
        if (!hasDisease) return;

        const key = group.isPooled ? group.pooledId! : group.samples[0].id;
        samplesState[key] = {
          sampleId: key,
          result: "pending",
          viralCopies: "",
          viralCopiesUnit: "copies/ml",
          resultDate: new Date().toISOString(),
          subtypeKits: [],
          variant: "",
          ctValue: "",
          viralLoad: "",
        };
      });

      if (Object.keys(samplesState).length > 0) {
        initState[d.id] = {
          diseaseId: d.id,
          isSelected: false,
          common: {
            kitOrProtocol: "",
            targetAssay: "",
            testedById: "",
          },
          samples: samplesState,
        };
      }
    });
    setDiseaseStates(initState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredDiseases, sampleGroups]);

  const validate = () => {
    let isValid = true;
    const newErrors: ErrorState = {};

    const selectedDiseases = Object.values(diseaseStates).filter(
      (ds) => ds.isSelected,
    );
    if (selectedDiseases.length === 0) {
      newErrors.global = "Please select at least one disease to test.";
      isValid = false;
    }

    selectedDiseases.forEach((ds) => {
      const dErrors: DiseaseError = {};
      if (
        !ds.common.kitOrProtocol ||
        (ds.common.kitOrProtocol === OTHERS_OPTION && !ds.common.customKitName)
      ) {
        dErrors.kitOrProtocol = "Kit or protocol is required.";
        isValid = false;
      }

      // Check all groups have a non-pending result
      const hasPending = Object.values(ds.samples).some(
        (s) => s.result === "pending",
      );
      if (hasPending) {
        dErrors.samples =
          "All samples must have a final result before submission.";
        isValid = false;
      }

      // Step 2 Validation: Only for AI diseases and positive samples
      const disease = filteredDiseases.find((d) => d.id === ds.diseaseId);
      const isAI =
        disease?.shortName?.toUpperCase() === "AI" ||
        disease?.name?.toLowerCase().includes("avian");

      if (isAI) {
        for (const sRow of Object.values(ds.samples)) {
          if (sRow.result === "positive") {
            // Must have at least 1 kit
            if (!sRow.subtypeKits || sRow.subtypeKits.length === 0) {
              dErrors.samples =
                "Positive AI samples require at least one subtyping kit";
              isValid = false;
              break;
            }

            // Each kit must have at least 1 target
            for (const kit of sRow.subtypeKits) {
              if (!kit.kitName) {
                dErrors.samples = "Please enter kit name";
                isValid = false;
                break;
              }

              if (!kit.targets || kit.targets.length === 0) {
                dErrors.samples = `Kit "${kit.kitName || "unnamed"}" for a positive sample requires at least one Ct value entry.`;
                isValid = false;
                break;
              }

              // Each target must have gene, ctValue, and result
              for (const t of kit.targets) {
                if (
                  !t.name ||
                  !t.ctValue ||
                  !t.result ||
                  t.result === "pending"
                ) {
                  dErrors.samples =
                    "All Ct value entries must have gene, Ct value, and result.";
                  isValid = false;
                  break;
                }
              }
              if (!isValid) break;
            }
            if (!isValid) break;
          }
        }
      }

      if (Object.keys(dErrors).length > 0) {
        newErrors[ds.diseaseId] = dErrors;
      }
    });

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  const handleBack = async () => {
    if (isBulkMode && onBulkSuccess) {
      onBulkSuccess("back");
      return;
    }

    if (onBack) {
      onBack();
      return;
    }

    try {
      setSubmitType("exit");
      setSubmitting(true);
      if (!currentProjectId) throw new Error("No lab user project");

      await Promise.all(
        targetSamples.map((s) =>
          updateSampleApi(currentProjectId, s.id, {
            sampleStatus: "pre-processed",
          }),
        ),
      );

      toast.success("Returned to extraction step");
      setSample((s) => (s ? { ...s, sampleStatus: "pre-processed" } : s));
    } catch (error) {
      toast.error((error as Error)?.message || "Error updating sample");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (mode: "exit" | "complete") => {
    const { isValid, errors: validationErrors } = validate();
    if (!isValid) {
      if (validationErrors.global) {
        toast.error(validationErrors.global);
      } else {
        const firstDiseaseId = Object.keys(validationErrors).find(
          (k) => k !== "global",
        );
        if (firstDiseaseId) {
          const error = validationErrors[firstDiseaseId] as DiseaseError;
          const diseaseName = filteredDiseases.find(
            (d) => d.id === firstDiseaseId,
          )?.name;
          if (error.kitOrProtocol)
            toast.error(`${diseaseName}: ${error.kitOrProtocol}`);
          else if (error.samples)
            toast.error(`${diseaseName}: ${error.samples}`);
        }
      }
      return;
    }

    try {
      setSubmitType(mode);
      setSubmitting(true);
      if (!currentProjectId) throw new Error("No associated project");

      // Create new kits as needed
      const newKitNames: string[] = [];
      for (const ds of Object.values(diseaseStates)) {
        if (!ds.isSelected) continue;

        const kitName =
          ds.common.kitOrProtocol === OTHERS_OPTION
            ? ds.common.customKitName || ""
            : ds.common.kitOrProtocol;

        if (kitName.trim()) {
          const exists = kits?.find(
            (k) => k.name.toLowerCase() === kitName.trim().toLowerCase(),
          );
          if (!exists && !newKitNames.includes(kitName.trim())) {
            const { success, data: newKit } = await createKitApi(
              kitName.trim(),
            );
            if (success && newKit) {
              newKitNames.push(kitName.trim());
              setKits((prev) => [...(prev || []), newKit]);
            }
          }
        }
      }

      const now = new Date().toISOString();

      // For each real sample, find the group key and build lab tests
      const results = await Promise.all(
        targetSamples.map(async (samp) => {
          const groupKey =
            samp.isPooledSample && samp.details?.preprocessing?.pooledId
              ? samp.details.preprocessing.pooledId
              : samp.id;

          // Build a typed LabTest payload for each selected disease
          const sampleTests: Partial<LabTest>[] = (
            Object.values(diseaseStates) as DiseaseTestState[]
          )
            .filter((ds) => ds.isSelected)
            .flatMap((ds) => {
              const sRow = ds.samples[groupKey];
              if (!sRow) return [];

              const kitName =
                ds.common.kitOrProtocol === OTHERS_OPTION
                  ? ds.common.customKitName || ""
                  : ds.common.kitOrProtocol;

              const testedByUser = ds.common.testedById
                ? teamMembers.find((m) => m.id === ds.common.testedById)
                : undefined;

              const isFMDorLSD =
                ds.diseaseId ===
                  filteredDiseases.find(
                    (d) => d.shortName?.toUpperCase() === "FMD",
                  )?.id ||
                ds.diseaseId ===
                  filteredDiseases.find(
                    (d) => d.shortName?.toUpperCase() === "LSD",
                  )?.id;

              // ── Ct value: use the main sRow.ctValue (entered in Step 1) for all diseases.
              //    For AI, the per-kit subtype Ct values are still stored in
              //    details.testing.subtypeKits (see below).
              //    stored in lab_test.ctValue (varchar)
              const ctSummary = sRow.ctValue || undefined;

              // ── Variant: derived from positive subtype kit targets for AI,
              //    or the manual entry for FMD/LSD.
              //    stored in lab_test.variant (varchar)
              const allTargets = sRow.subtypeKits.flatMap((k) => k.targets);
              const derivedVariant = isFMDorLSD
                ? sRow.variant
                : allTargets
                    .filter((t: CtTarget) => t.result === "positive")
                    .map((t: CtTarget) => t.name)
                    .join("");

              const finalTestedAt = sRow.resultDate || now;

              const labTestEntry: Partial<LabTest> = {
                disease: ds.diseaseId,
                kitOrProtocol: kitName,
                testResult: sRow.result as TestResultType,
                // ctValue stores a summary string of all target Ct values
                ctValue: ctSummary || undefined,
                // variant stores the derived subtype (e.g. "H5N1" or manual)
                variant: derivedVariant || undefined,
                // viralLoad stored in the new column
                viralLoad: isFMDorLSD ? sRow.viralLoad : undefined,
                testedAt: finalTestedAt,
                resultDate: finalTestedAt,
                testResultReport: ds.common.testResultReport,
                testedBy: testedByUser as User,
                // Full structured details go into the JSONB details column
                details: {
                  testing: {
                    targetAssay: ds.common.targetAssay,
                    viralCopies: sRow.viralCopies,
                    viralCopiesUnit: sRow.viralCopiesUnit,
                    subtypeKits: sRow.subtypeKits,
                  },
                },
              };

              return [labTestEntry];
            });

          if (sampleTests.length > 0) {
            const createRes = await createLabTestApi(
              currentProjectId,
              samp.id,
              {
                labTests: sampleTests,
              },
            );
            if (createRes.success) {
              const finalTestedAt = sampleTests[0]?.testedAt || now;
              return await updateSampleApi(currentProjectId, samp.id, {
                testedAt: finalTestedAt,
                sampleStatus: "test-report-generated",
                testedBy: testedByFromTests(sampleTests),
                reportGeneratedAt: finalTestedAt,
                reportGeneratedBy: testedByFromTests(sampleTests),
              });
            }
          }
          return { success: true, data: null };
        }),
      );

      const allSuccess = results.every((r) => r.success);

      if (allSuccess) {
        if (!isBulkMode) {
          const { data: labTestData } = await getLabTestApi(
            currentProjectId,
            sampleId,
          );
          setSample((s) =>
            s
              ? {
                  ...s,
                  sampleStatus: "test-report-generated",
                  labTests: labTestData || [],
                }
              : s,
          );
        }

        toast.success(
          `Successfully recorded tests for ${targetSamples.length} sample(s)`,
        );

        if (selectedProcessableSamples.length > 0) {
          if (!isBulkMode || mode === "exit" || mode === "complete") {
            setSelectedProcessableSamples([]);
          }
        }

        if (isBulkMode && onBulkSuccess) {
          onBulkSuccess(
            mode === "exit" ? "exit" : "complete",
            "test-report-generated",
          );
          return;
        }
      } else {
        toast.error("Some updates failed. Please verify the entries.");
      }

      if (mode === "exit") {
        router.replace("/lab");
      } else if (isRetest || (mode === "complete" && !isBulkMode)) {
        // Force refresh state for the specific sample page to show completed screen
        const { data: latestSample } = await getLabTestApi(
          user!.project!.id,
          sampleId,
        );
        setSample((s) =>
          s
            ? {
                ...s,
                sampleStatus: "test-report-generated",
                labTests: latestSample || [],
              }
            : s,
        );
        router.replace(`/lab/${sampleId}`);
      }
    } catch (error) {
      toast.error(
        (error as Error)?.message || "Error updating sample details.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-10 text-blue-50 flex items-center justify-center shrink-0">
          <TestTubeDiagonal size={20} />
        </div>
        <div>
          <h3 className="font-noto-serif font-semibold text-xl">
            {isBulkMode ? "Bulk Test Execution" : "Test Execution"}
          </h3>
          <p className="text-grey-70 text-sm">
            Record test results, Ct values, and generate lab reports for each
            disease group.
          </p>
        </div>
      </div>

      {/* Global error */}
      {errors.global && (
        <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm border border-red-200">
          {errors.global}
        </div>
      )}

      {/* Disease cards */}
      <div className="flex flex-col gap-4">
        {filteredDiseases.map((disease) => {
          const state = diseaseStates[disease.id];
          if (!state) return null;

          const diseaseErrors = errors[disease.id];
          const cardErrors =
            diseaseErrors && typeof diseaseErrors === "object"
              ? diseaseErrors
              : {};

          return (
            <DiseaseTestGroupCard
              key={disease.id}
              disease={disease}
              groups={sampleGroups}
              state={state}
              onChange={(newState) =>
                setDiseaseStates((prev) => ({
                  ...prev,
                  [disease.id]: newState,
                }))
              }
              kits={kits}
              teamMembers={teamMembers}
              loadingTeamMembers={loadingTeamMembers}
              currentUserId={user?.id}
              errors={cardErrors}
            />
          );
        })}
      </div>

      <div className="h-px self-stretch bg-grey-20 my-2" />

      {/* Actions */}
      <div className="flex flex-wrap gap-4 py-3 items-center justify-end">
        <button
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-grey-70 text-base font-medium border border-grey-30 rounded-xl hover:border-blue-40 hover:text-blue-40 transition-colors shadow-sm mr-auto disabled:opacity-50"
          onClick={handleBack}
          disabled={submitting}
        >
          ← Back
        </button>
        <button
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-40 text-white text-base font-medium border border-blue-40 rounded-xl hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-50"
          onClick={() => handleSubmit("complete")}
          disabled={submitting}
        >
          {submitting && submitType === "complete" && <Spinner darkMode />}
          Submit Results
        </button>
      </div>
    </motion.div>
  );
}

// Extract testedBy from the first lab test (all share the same tester per disease group)
function testedByFromTests(tests: Partial<LabTest>[]): User | undefined {
  return tests[0]?.testedBy as User | undefined;
}

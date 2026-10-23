import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAtomValue } from "jotai";

import CustomModal from "@/src/components/ui/custom-modal";
import DiseaseTestGroupCard, {
  DiseaseTestState,
  SampleGroup,
} from "@/src/components/lab/sample-accession/disease-grouped-test-card";
import { userAtom } from "@/src/store/userAtom";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import {
  Kit,
  LabTest,
  Sample,
  SubtypeKitDetail,
  TestResultType,
} from "@/src/types/sample";
import { User } from "@/src/types/global";
import {
  createKitApi,
  createLabTestApi,
  updateSampleApi,
} from "@/src/app/(dashboard)/lab/[sampleId]/actions";
import {
  getKitsApi,
  getTeamMembersApi,
} from "@/src/app/(dashboard)/lab/[sampleId]/loader";
import Spinner from "@/src/components/ui/spinner";
import { OTHERS_OPTION } from "@/src/utils/constant";
interface LabTestDetails {
  testing?: {
    storageTemperature?: string;
    storageDetails?: string;
    targetAssay?: string;
    customKitFields?: { label: string; value: string }[];
    subtypeKits?: SubtypeKitDetail[];
  };
}

interface RetestModalProps {
  isOpen: boolean;
  onClose: () => void;
  sample: Sample;
}

export default function RetestModal({
  isOpen,
  onClose,
  sample,
}: RetestModalProps) {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  // 4.4: workspace-admins have no user.project, so fall back to the current
  // workspace's first project.
  const { resolveProjectId } = useCurrentProjectResolver();
  const currentProjectId = resolveProjectId();
  const [kits, setKits] = useState<Kit[]>();
  const [submitting, setSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  const [diseaseState, setDiseaseState] = useState<DiseaseTestState | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Default to AI disease if available, otherwise first disease
  const disease =
    sample.diseases?.find(
      (d) =>
        d.shortName?.toUpperCase() === "AI" ||
        d.name?.toLowerCase().includes("avian"),
    ) || sample.diseases?.[0];

  useEffect(() => {
    if (isOpen && disease && currentProjectId) {
      if (!kits?.length) {
        getKitsApi()
          .then((response) => {
            if (response.success) setKits(response.data);
          })
          .catch(() => toast.error("Error fetching kits"));
      }

      if (sample.team?.id) {
        setLoadingTeamMembers(true);
        getTeamMembersApi(currentProjectId, sample.team.id)
          .then((response) => {
            if (response.success) setTeamMembers(response.data || []);
          })
          .catch(() => toast.error("Error fetching team members"))
          .finally(() => setLoadingTeamMembers(false));
      }

      // Initialize disease state
      const key = sample.id;
      setDiseaseState({
        diseaseId: disease.id,
        isSelected: true,
        common: {
          kitOrProtocol: "",
          targetAssay: "",
          testedById: user?.id || "",
        },
        samples: {
          [key]: {
            sampleId: key,
            result: "pending",
            viralCopies: "",
            viralCopiesUnit: "copies/ml",
            resultDate: new Date().toISOString(),
            subtypeKits: [],
            variant: "",
            ctValue: "",
            viralLoad: "",
          },
        },
      });
      setError(null);
    }
  }, [isOpen, disease, currentProjectId]);

  const validate = () => {
    if (!diseaseState) return false;

    if (
      !diseaseState.common.kitOrProtocol ||
      (diseaseState.common.kitOrProtocol === OTHERS_OPTION &&
        !diseaseState.common.customKitName)
    ) {
      setError("Kit or protocol is required.");
      return false;
    }

    const sampleRow = diseaseState.samples[sample.id];
    if (sampleRow?.result === "pending") {
      setError("Please select a final test result.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validate() || !diseaseState) return;
    if (!currentProjectId || !disease || !user?.id) {
      toast.error("Missing authentication or project context.");
      return;
    }

    setSubmitting(true);
    try {
      // Create new kit if needed
      const kitName =
        diseaseState.common.kitOrProtocol === OTHERS_OPTION
          ? diseaseState.common.customKitName || ""
          : diseaseState.common.kitOrProtocol;

      if (kitName.trim()) {
        const exists = kits?.find(
          (k) => k.name.toLowerCase() === kitName.trim().toLowerCase(),
        );
        if (!exists) {
          const { success, data: newKit } = await createKitApi(kitName.trim());
          if (success && newKit) {
            setKits((prev) => [...(prev || []), newKit]);
          }
        }
      }

      const now = new Date().toISOString();
      const sRow = diseaseState.samples[sample.id];
      const testedByUser =
        teamMembers.find((m) => m.id === diseaseState.common.testedById) ||
        user;

      const isFMDorLSD =
        disease.shortName?.toUpperCase() === "FMD" ||
        disease.shortName?.toUpperCase() === "LSD";

      // Preparation logic similar to sample-testing.tsx
      const allTargets = sRow.subtypeKits.flatMap((k) => k.targets);
      const ctSummary = isFMDorLSD
        ? sRow.ctValue
        : allTargets
            .filter((t) => t.ctValue)
            .map((t) => `${t.name}:${t.ctValue}`)
            .join("/");

      const derivedVariant = isFMDorLSD
        ? sRow.variant
        : allTargets
            .filter((t) => t.result === "positive")
            .map((t) => t.name)
            .join("");

      const finalTestedAt = sRow.resultDate || now;

      const labTestEntry: Partial<LabTest> = {
        disease: disease.id,
        kitOrProtocol: kitName,
        testResult: sRow.result as TestResultType,
        ctValue: ctSummary || undefined,
        variant: derivedVariant || undefined,
        viralLoad: sRow.viralLoad || undefined,
        testedAt: finalTestedAt,
        resultDate: finalTestedAt,
        testResultReport: diseaseState.common.testResultReport,
        testedBy: testedByUser as User,
        details: {
          testing: {
            targetAssay: diseaseState.common.targetAssay,
            viralCopies: sRow.viralCopies,
            viralCopiesUnit: sRow.viralCopiesUnit,
            subtypeKits: sRow.subtypeKits,
          },
        },
      };

      const { success } = await createLabTestApi(currentProjectId, sample.id, {
        labTests: [labTestEntry],
      });

      if (success) {
        await updateSampleApi(currentProjectId, sample.id, {
          sampleStatus: "test-report-generated",
          testedAt: finalTestedAt,
          reportGeneratedAt: finalTestedAt,
          reportGeneratedBy: testedByUser as User,
        });

        toast.success("Retest submitted successfully");
        onClose();
        router.refresh();
      } else {
        toast.error("Failed to submit retest results");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting retest");
    } finally {
      setSubmitting(false);
    }
  };

  if (!disease) return null;

  return (
    <CustomModal isOpen={isOpen}>
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl transition-all duration-300">
        <div className="p-6 border-b border-grey-20 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold font-noto-serif text-grey-90">
              Retest Sample
            </h3>
            <p className="text-sm text-grey-60">
              {sample.barcode} - {disease.name}
            </p>
          </div>
          <button onClick={onClose} className="text-grey-50 hover:text-grey-80">
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Previous Tests Section */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-grey-80 text-base">
              Previous Tests
            </h4>
            {sample.labTests
              ?.filter((test) =>
                typeof test.disease === "string"
                  ? test.disease === disease.id
                  : test.disease?.id === disease.id,
              )
              .map((test, idx) => (
                <div
                  key={test.id || idx}
                  className="p-4 rounded-2xl bg-grey-10 border border-grey-20 flex flex-col gap-3 opacity-75"
                >
                  <div className="flex justify-between items-center border-b border-grey-20 pb-2">
                    <h4 className="font-semibold text-grey-80 text-sm">
                      Test {idx + 1}
                    </h4>
                    <span className="text-xs text-grey-60">
                      {test.testedAt
                        ? new Date(test.testedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  {/* ... (Existing display logic for previous tests - kept same) ... */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-grey-60 block text-xs">Result</span>
                      <span
                        className={`font-medium ${
                          test.testResult?.toLowerCase().includes("positive")
                            ? "text-red-500"
                            : test.testResult
                                  ?.toLowerCase()
                                  .includes("negative")
                              ? "text-green-600"
                              : "text-grey-80"
                        }`}
                      >
                        {test.testResult || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-grey-60 block text-xs">
                        Kit/Protocol
                      </span>
                      <span className="text-grey-80">
                        {test.kitOrProtocol || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-grey-60 block text-xs">
                        Variant
                      </span>
                      <span className="text-grey-80">
                        {test.variant || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-grey-60 block text-xs">
                        Tested By
                      </span>
                      <span className="text-grey-80">
                        {test.testedBy
                          ? `${test.testedBy.firstName} ${test.testedBy.lastName}`
                          : "N/A"}
                      </span>
                    </div>
                    {test.ctValue && (
                      <div className="col-span-2">
                        <span className="text-grey-60 block text-xs">
                          CT Value
                        </span>
                        <span className="text-grey-80">{test.ctValue}</span>
                      </div>
                    )}
                    {(test.details as LabTestDetails)?.testing?.subtypeKits && (
                      <div className="col-span-2">
                        <span className="text-grey-60 block text-xs mb-1">
                          Subtype Details
                        </span>
                        <div className="flex flex-col gap-2">
                          {(
                            test.details as LabTestDetails
                          ).testing?.subtypeKits?.map(
                            (kit: SubtypeKitDetail, i: number) => (
                              <div
                                key={i}
                                className="p-2 bg-white rounded border border-grey-20 text-xs text-grey-80"
                              >
                                <p className="font-semibold mb-1">
                                  {kit.kitName || "Unknown Kit"}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {kit.targets?.map(
                                    (
                                      target: {
                                        name: string;
                                        ctValue: string;
                                        result: string;
                                      },
                                      j: number,
                                    ) => (
                                      <div
                                        key={j}
                                        className="px-2 py-1 bg-grey-5 rounded border border-grey-10"
                                      >
                                        <span className="font-medium">
                                          {target.name}:
                                        </span>{" "}
                                        {target.ctValue} ({target.result})
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                    {(test.details as LabTestDetails)?.testing
                      ?.storageTemperature && (
                      <div>
                        <span className="text-grey-60 block text-xs">
                          Storage Temp
                        </span>
                        <span className="text-grey-80">
                          {
                            (test.details as LabTestDetails).testing
                              ?.storageTemperature
                          }
                        </span>
                      </div>
                    )}
                    {(test.details as LabTestDetails)?.testing
                      ?.storageDetails && (
                      <div>
                        <span className="text-grey-60 block text-xs">
                          Storage Details
                        </span>
                        <span className="text-grey-80">
                          {
                            (test.details as LabTestDetails).testing
                              ?.storageDetails
                          }
                        </span>
                      </div>
                    )}
                    {(test.details as LabTestDetails)?.testing?.targetAssay && (
                      <div>
                        <span className="text-grey-60 block text-xs">
                          Target Assay
                        </span>
                        <span className="text-grey-80">
                          {
                            (test.details as LabTestDetails).testing
                              ?.targetAssay
                          }
                        </span>
                      </div>
                    )}
                    {(
                      (test.details as LabTestDetails)?.testing
                        ?.customKitFields || []
                    ).length > 0 && (
                      <div>
                        <span className="text-grey-60 block text-xs mb-1">
                          CT Values
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {(
                            (test.details as LabTestDetails).testing
                              ?.customKitFields || []
                          ).map((field, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 bg-white border border-grey-20 rounded"
                            >
                              <span className="font-medium">
                                {field.label}:
                              </span>{" "}
                              {field.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {test.resultComment && (
                    <div className="text-sm">
                      <span className="text-grey-60 block text-xs">
                        Comments
                      </span>
                      <p className="text-grey-80 mt-1">{test.resultComment}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="h-px bg-grey-20" />

          {/* New Tests Section */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-grey-80 text-base">New Retest</h4>
            {error && (
              <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}

            {diseaseState && (
              <DiseaseTestGroupCard
                disease={disease}
                groups={[{ isPooled: false, samples: [sample] } as SampleGroup]}
                state={diseaseState}
                onChange={setDiseaseState}
                kits={kits}
                teamMembers={teamMembers}
                loadingTeamMembers={loadingTeamMembers}
                currentUserId={user?.id}
                errors={
                  error
                    ? { kitOrProtocol: error.includes("Kit") ? error : "" }
                    : {}
                }
              />
            )}
          </div>
        </div>

        <div className="p-6 border-t border-grey-20 flex justify-end gap-4 sticky bottom-0 bg-white z-10">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-grey-5 border border-grey-20 text-grey-70 font-semibold rounded-xl hover:bg-grey-10 transition-colors shadow-sm"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-blue-40 text-white font-semibold rounded-xl hover:bg-blue-50 disabled:bg-grey-30 disabled:cursor-not-allowed flex items-center gap-2.5 transition-all shadow-md active:scale-95"
            disabled={submitting}
          >
            {submitting && <Spinner darkMode />}
            {submitting ? "Submitting..." : "Submit Retest Results"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
}

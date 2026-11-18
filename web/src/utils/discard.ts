import type {
  DiscardStage,
  Sample,
  SampleStatusType,
} from "@/src/types/sample";

// A discarded sample keeps the status of the last step it completed; the step
// it stopped at is the one that status leads to.
export const DISCARD_STAGE_BY_STATUS: Partial<
  Record<SampleStatusType, DiscardStage>
> = {
  received: "pre-processing",
  "virus-isolation": "virus-isolation",
  "pre-processed": "extraction",
  extracted: "testing",
};

export const DISCARD_STAGES: { value: DiscardStage; label: string }[] = [
  { value: "pre-processing", label: "Pre-processing" },
  { value: "virus-isolation", label: "Virus Isolation" },
  { value: "extraction", label: "Extraction" },
  { value: "testing", label: "Testing" },
];

export const DISCARD_REASON_OTHER = "Other";

export const DISCARD_REASONS: Record<DiscardStage, string[]> = {
  "pre-processing": [
    "Insufficient sample volume",
    "Sample leaked / container damaged",
    "Label missing or mismatched",
    "Sample degraded / improper storage",
    DISCARD_REASON_OTHER,
  ],
  "virus-isolation": [
    "Bacterial / fungal contamination of culture",
    "Insufficient sample for inoculation",
    DISCARD_REASON_OTHER,
  ],
  extraction: [
    "Purity out of range (260/280)",
    "Low nucleic acid yield",
    "Aliquot used up",
    DISCARD_REASON_OTHER,
  ],
  testing: [
    "Run / control failure",
    "PCR inhibition",
    "Insufficient extract",
    DISCARD_REASON_OTHER,
  ],
};

// "13 Nov 2026, 12:30"
export const formatDateTime = (date?: string | null): string => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const getUserName = (
  user?: { firstName?: string; lastName?: string } | null,
): string =>
  user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "—" : "—";

export const getDiscardStage = (
  status?: SampleStatusType,
): DiscardStage | undefined =>
  status ? DISCARD_STAGE_BY_STATUS[status] : undefined;

export const getDiscardStageLabel = (stage?: DiscardStage): string =>
  DISCARD_STAGES.find((s) => s.value === stage)?.label ?? "—";

export type DiscardStepState = "done" | "skipped" | "discarded" | "pending";

export type DiscardStep = {
  key: "receiving" | DiscardStage;
  label: string;
  state: DiscardStepState;
};

// Virus Isolation is only part of the flow for AI samples.
const goesThroughVirusIsolation = (sample: Sample) =>
  !!sample.hasAI ||
  !!sample.diseases?.some((d) => d.shortName?.toUpperCase() === "AI") ||
  !!sample.details?.virusIsolation ||
  sample.sampleStatus === "virus-isolation";

// The lab steps of a sample at the point it is (or would be) discarded: done,
// skipped (passed with a "skip" button, so nothing was saved), the step it
// stops at, and the steps it never reaches.
export const getDiscardSteps = (sample?: Sample): DiscardStep[] => {
  const stage = getDiscardStage(sample?.sampleStatus);
  if (!sample || !stage) return [];

  const hasData: Record<DiscardStep["key"], boolean> = {
    receiving: true,
    "pre-processing": !!(
      sample.preprocessingDate || sample.preprocessingSteps?.length
    ),
    "virus-isolation": !!sample.details?.virusIsolation,
    extraction: !!sample.extractionDateTime,
    testing: false,
  };

  const steps: Omit<DiscardStep, "state">[] = [
    { key: "receiving", label: "Receiving" },
    ...DISCARD_STAGES.filter(
      (s) => s.value !== "virus-isolation" || goesThroughVirusIsolation(sample),
    ).map((s) => ({ key: s.value, label: s.label })),
  ];
  const stoppedIndex = steps.findIndex((s) => s.key === stage);

  return steps.map((step, i) => ({
    ...step,
    state:
      i < stoppedIndex
        ? hasData[step.key]
          ? "done"
          : "skipped"
        : i === stoppedIndex
          ? "discarded"
          : "pending",
  }));
};

// The last step the sample actually completed before the one it stopped at.
export const getLastCompletedStep = (sample?: Sample): string => {
  const done = getDiscardSteps(sample).filter((s) => s.state === "done");
  return done.length ? done[done.length - 1].label : "—";
};

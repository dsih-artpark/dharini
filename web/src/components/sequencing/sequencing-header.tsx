"use client";

import {
  CheckCircle2,
  Clock3,
  Dna,
  StopCircle,
  TriangleAlert,
  Upload,
} from "lucide-react";
import type { SubmittedSequenceJob } from "../../app/(dashboard)/sequencing/sequencing-processing-types";
import SequencingSummaryCard from "./sequencing-summary-card";
import UploadSequenceModal from "./upload-sequence-modal";

type SequencingHeaderProps = {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    failed: number;
    cancelled: number;
  };
  onSubmissionCreated: (submission: SubmittedSequenceJob) => void;
  isUploadModalOpen: boolean;
  onOpenUpload: () => void;
  onCloseUpload: () => void;
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-40";

// Cancelled gets its own card rather than being folded into "Failed": a
// deliberately stopped run isn't an error, and merging the two would make
// the failure count read worse (or better) than pipeline health actually
// is. Grey/stop-circle here matches the cancelled banner in the record
// detail panel, so the same outcome reads consistently everywhere it shows.
function getSummaryCards(stats: SequencingHeaderProps["stats"]) {
  return [
    {
      label: "Total submissions",
      value: String(stats.total),
      iconBg: "bg-teal-10",
      icon: <Dna className="h-7 w-7 text-teal-30" />,
    },
    {
      label: "Completed",
      value: String(stats.completed),
      iconBg: "bg-green-10",
      icon: <CheckCircle2 className="h-7 w-7 text-green-30" />,
    },
    {
      label: "Queued or in progress",
      value: String(stats.inProgress),
      iconBg: "bg-blue-10",
      icon: <Clock3 className="h-7 w-7 text-blue-40" />,
    },
    {
      label: "Failed",
      value: String(stats.failed),
      iconBg: "bg-red-10",
      icon: <TriangleAlert className="h-7 w-7 text-red-30" />,
    },
    {
      label: "Cancelled",
      value: String(stats.cancelled),
      iconBg: "bg-grey-20",
      icon: <StopCircle className="h-7 w-7 text-grey-70" />,
    },
  ];
}

export default function SequencingHeader({
  stats,
  onSubmissionCreated,
  isUploadModalOpen,
  onOpenUpload,
  onCloseUpload,
}: SequencingHeaderProps) {
  const summaryCards = getSummaryCards(stats);

  return (
    <>
      <section className="px-8 py-7 bg-grey-0 border-b border-grey-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Dna className="h-7 w-7 text-teal-30" aria-hidden="true" />
            <h1 className="text-[28px] font-semibold leading-9 text-grey-90">
              Sequencing
            </h1>
          </div>
          <button
            type="button"
            className={`h-11 px-5 py-3 bg-blue-40 rounded-lg justify-center items-center gap-2 inline-flex ${FOCUS_RING}`}
            onClick={onOpenUpload}
          >
            <Upload className="h-5 w-5 text-white" aria-hidden="true" />
            <span className="text-white text-base font-semibold leading-normal">
              Upload sequence files
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mt-7">
          {summaryCards.map((card) => (
            <SequencingSummaryCard
              key={card.label}
              label={card.label}
              value={card.value}
              iconBg={card.iconBg}
              icon={card.icon}
            />
          ))}
        </div>
      </section>
      <UploadSequenceModal
        isOpen={isUploadModalOpen}
        onClose={onCloseUpload}
        onSubmissionCreated={onSubmissionCreated}
      />
    </>
  );
}

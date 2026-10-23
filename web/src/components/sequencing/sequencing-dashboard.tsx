"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import SequencingHeader from "@/src/components/sequencing/sequencing-header";
import SequencingRecordsSection from "@/src/components/sequencing/sequencing-records-section";
import {
  getSequencingJobsApi,
  getSequencingQueueApi,
  getSequencingSubmissionsApi,
} from "../../app/(dashboard)/sequencing/loader";
import type {
  SequencingRecord,
  SequencingRecordStatus,
  SubmittedSequenceJob,
  SequencingSubmission,
  SequencingJob,
  SequencingJobMetrics,
  SequencingProcessingJob,
  QueueStatus,
} from "../../app/(dashboard)/sequencing/sequencing-processing-types";

interface Stats {
  total: number;
  completed: number;
  inProgress: number;
  failed: number;
  cancelled: number;
}

// Fallback only — used when a record has no matched job row yet (rare: a
// job is created in the same request as its submission, so this mostly
// covers the brief window before that write lands). Once a job exists,
// jobStatusMap below is the source of truth.
const submissionStatusMap: Record<string, SequencingRecordStatus> = {
  pending: "queued",
  submitted: "queued",
  processing: "in_progress",
  completed: "completed",
  failed: "failed",
};

// The job's own status is what actually walks through the full run
// lifecycle (a submission's status barely moves past "submitted"), so it's
// the preferred source for what a record's badge shows.
const jobStatusMap: Record<SequencingJob["status"], SequencingRecordStatus> = {
  submitted: "queued",
  processing: "in_progress",
  completed: "completed",
  failed: "failed",
  cancelled: "cancelled",
};

function deriveRecordStatus(
  submission: SequencingSubmission,
  job: SequencingJob | undefined,
): SequencingRecordStatus {
  if (job) return jobStatusMap[job.status] ?? "queued";
  return submissionStatusMap[submission.status] ?? "queued";
}

// Common key names a job's freeform `metrics` blob might use for the number
// of variants called — its shape isn't part of the rewritten contract.
// Anything not found renders as a dash, never a fabricated 0.
function readVariantCount(
  metrics: SequencingJobMetrics | null | undefined,
): number | null {
  if (!metrics) return null;
  for (const key of [
    "variant_count",
    "variantCount",
    "snp_count",
    "snpCount",
  ]) {
    const raw = metrics[key];
    if (raw == null) continue;
    const num = typeof raw === "number" ? raw : Number(raw);
    if (Number.isFinite(num)) return num;
  }
  return null;
}

function sortByLatestFirst(records: SequencingRecord[]) {
  return [...records].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

// A submission can now have more than one job once retry exists (the failed
// job stays around for history, retry creates a fresh one) — so a record
// has to point at whichever job is newest, not just the first one the API
// happens to return.
function latestJobForSubmission(
  rawJobs: SequencingJob[],
  submissionId: string,
): SequencingJob | undefined {
  return rawJobs
    .filter((j) => j.submissionId === submissionId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
}

export default function SequencingDashboard() {
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const [processingJobs, setProcessingJobs] = useState<
    SequencingProcessingJob[]
  >([]);
  const [sequencingRecords, setSequencingRecords] = useState<
    SequencingRecord[]
  >([]);
  const [queue, setQueue] = useState<QueueStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Fetched once on mount, then again only when something actually calls
  // this: after a successful retry (a brand new job/run this component has
  // no other way to learn about) and when the records section's live
  // /progress poll sees a job cross into a terminal state (SUCCEEDED /
  // FAILED / CANCELLED) — the only moment this list's data has genuinely
  // changed. See the design note on SequencingRecordsSection's poll effect
  // for the full tradeoff.
  const fetchData = useCallback(
    async (showLoader = false) => {
      if (showLoader) setIsLoading(true);
      try {
        const [jobsRes, submissionsRes] = await Promise.all([
          // B11: scope to the currently selected workspace so the switcher
          // actually affects this page. The backend narrows to the projects
          // the caller can reach within it; sending no workspaceId would
          // return their whole cross-workspace scope regardless of the picker.
          getSequencingJobsApi({ workspaceId: currentWorkspace?.id }),
          getSequencingSubmissionsApi({ workspaceId: currentWorkspace?.id }),
        ]);

        const submissions = (submissionsRes.data ||
          []) as SequencingSubmission[];
        const rawJobs = (jobsRes.data || []) as SequencingJob[];

        // Per-job stage/progress and results no longer live here — the
        // detail panel fetches those live from /progress, /variants and
        // /artifacts once a row is expanded. This list only needs enough to
        // identify a job and link it to its submission.
        const jobs: SequencingProcessingJob[] = rawJobs.map((job) => {
          const submission = submissions.find((s) => s.id === job.submissionId);

          return {
            id: job.id,
            seqId: submission?.seqId || "—",
            sampleId: submission?.sampleBarcode || "Unknown",
            fileName: `${submission?.fileFormat || "FASTA"} file`,
            status: job.status,
            startTime: new Date(job.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            runId: job.runId,
            metrics: job.metrics ?? null,
            errorMessage: job.errorMessage,
            pipelineId: job.pipelineId,
            pipelineVersion: job.pipelineVersion,
            durationS: job.durationS,
            finishedAt: job.finishedAt,
          };
        });

        const records: SequencingRecord[] = submissions.map((sub) => {
          // Latest job for this submission, not just the first match — a
          // retried submission now has more than one job row (the failed
          // one stays for history), and the record must track the new one.
          const matchedJob = latestJobForSubmission(rawJobs, sub.id);
          return {
            id: sub.seqId,
            sampleId: sub.sampleBarcode,
            siteName: sub.siteName,
            submissionDate: sub.submissionDate,
            createdAt: sub.createdAt,
            status: deriveRecordStatus(sub, matchedJob),
            fileFormat: sub.fileFormat,
            sequencingMethod: sub.sequencingMethod,
            pipelineId: matchedJob?.pipelineId ?? null,
            pipelineVersion: matchedJob?.pipelineVersion ?? null,
            variantCount: readVariantCount(matchedJob?.metrics),
            jobId: matchedJob?.id || undefined,
          };
        });

        setProcessingJobs(jobs);
        setSequencingRecords(sortByLatestFirst(records));

        // /queue is global pipeline state, not per-job. Fetched once here —
        // instead of the old design where every expanded row's detail panel
        // fetched it independently — and only when it's actually relevant:
        // something sitting in "submitted" (queued) or "processing".
        const hasActiveJob = rawJobs.some(
          (j) => j.status === "submitted" || j.status === "processing",
        );
        if (hasActiveJob) {
          getSequencingQueueApi()
            .then((queueRes) => setQueue(queueRes.data ?? null))
            .catch(() => {
              /* queue banner is best-effort context, not critical */
            });
        } else {
          setQueue(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load sequencing data");
      } finally {
        if (showLoader) setIsLoading(false);
      }
    },
    [currentWorkspace?.id],
  );

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // CANCELLED gets its own count rather than being folded into "failed":
  // a deliberately stopped run is a different signal from a broken one, and
  // conflating them would misrepresent pipeline health.
  const stats: Stats = useMemo(() => {
    const completed = sequencingRecords.filter(
      (r) => r.status === "completed",
    ).length;
    const inProgress = sequencingRecords.filter(
      (r) => r.status === "in_progress" || r.status === "queued",
    ).length;
    const failed = sequencingRecords.filter(
      (r) => r.status === "failed",
    ).length;
    const cancelled = sequencingRecords.filter(
      (r) => r.status === "cancelled",
    ).length;
    return {
      total: sequencingRecords.length,
      completed,
      inProgress,
      failed,
      cancelled,
    };
  }, [sequencingRecords]);

  const handleSubmissionCreated = (submission: SubmittedSequenceJob) => {
    const newRecord: SequencingRecord = {
      id: `SEQ-${Date.now()}`,
      sampleId: submission.sampleId,
      siteName: "New submission",
      submissionDate: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      status: "queued",
      fileFormat: "",
      sequencingMethod: "",
      pipelineId: submission.pipelineId,
      pipelineVersion: null,
      variantCount: null,
    };
    setSequencingRecords((prev) => [newRecord, ...prev]);

    // Reuses the same fetchData as the rest of the page (submissions +
    // jobs together) rather than a submissions-only refetch that used to
    // null out pipeline/job fields on every record — the job for this
    // submission is typically created in the same request, so this also
    // picks up its real jobId instead of leaving the row unlinked.
    setTimeout(() => {
      void fetchData(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-grey-0 flex items-center justify-center">
        <div className="text-grey-70 text-base">Loading sequencing data…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-0">
      <SequencingHeader
        stats={stats}
        onSubmissionCreated={handleSubmissionCreated}
        isUploadModalOpen={isUploadModalOpen}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onCloseUpload={() => setIsUploadModalOpen(false)}
      />
      <SequencingRecordsSection
        records={sequencingRecords}
        jobs={processingJobs}
        queue={queue}
        onUploadClick={() => setIsUploadModalOpen(true)}
        onRefetchNeeded={() => {
          void fetchData(false);
        }}
      />
    </div>
  );
}

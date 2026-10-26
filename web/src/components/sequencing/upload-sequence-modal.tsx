"use client";

import {
  ArrowLeft,
  Check,
  CirclePlus,
  CloudCheck,
  FlaskConical,
  Globe2,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";
import {
  getSequencingLabSamplesApi,
  getSequencingPipelinesApi,
  getNcbiPreviewApi,
  presignSequencingUploadApi,
  submitSequencingJobApi,
} from "@/src/app/(dashboard)/sequencing/loader";
import { uploadViaPresignedUrl } from "@/src/libs/uploadViaPresignedUrl";
import CustomModal from "@/src/components/ui/custom-modal";
import { userAtom } from "@/src/store/userAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { getWorkspaceProjects } from "@/src/app/(root)/workspaces/loader";
import type { LabSample } from "@/src/types/sample";
import type {
  PipelineExtraInput,
  SequencingPipeline,
  SourceType,
  SubmitSequencingJobPayload,
  SubmittedSequenceJob,
} from "@/src/app/(dashboard)/sequencing/sequencing-processing-types";
import PipelineParamsForm, {
  buildDefaultParamValues,
  buildSubmitParams,
  sectionForParamPaths,
  validateParamValues,
  type ParamValues,
  type SectionExtras,
} from "./pipeline-params-form";
import SubmissionPipelinePicker from "./submission-pipeline-picker";
import SubmissionFilePicker, {
  type FileUploadStatus,
} from "./submission-file-picker";
import SubmissionSummary, {
  type SubmissionStepId,
  type SubmissionUploadRow,
} from "./submission-summary";
import {
  isExtraInputInUse,
  isExtraInputRequired,
} from "./submission-relevance-map";

type UploadSequenceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmissionCreated: (submission: SubmittedSequenceJob) => void;
};

type UploadStep = SubmissionStepId; // "sample" | "pipeline" | "files"
type SampleSource = "lab" | "ncbi" | "new";

type UploadForm = {
  sampleId: string;
  sourceLabel: string;
  /** Name of the FASTA file NCBI will auto-fetch server-side, e.g. "OQ123456.fasta". */
  ncbiAutoFileName?: string;
};

const emptyUploadForm: UploadForm = { sampleId: "", sourceLabel: "" };

/**
 * A submit payload shaped like SubmitSequencingJobPayload (from
 * sequencing-processing-types.ts — not ours to edit) minus fileFormat,
 * libraryType, platform and sequencingMethod. The chosen pipeline
 * determines all four now, and a backend agent is concurrently making them
 * optional and deriving them server-side, so this modal simply stops
 * sending them. Defined locally (per this file's ownership boundary)
 * instead of touching the shared type; cast to it at the call site so
 * compilation doesn't depend on exactly when that type catches up.
 */
type UploadSlotStatus = "uploading" | "done" | "error";
type UploadSlot = {
  file: File;
  status: UploadSlotStatus;
  fraction: number;
  key: string | null;
  error: string | null;
};

function toFileUploadStatus(slot?: UploadSlot): FileUploadStatus {
  if (!slot) return { phase: "idle" };
  if (slot.status === "uploading")
    return { phase: "uploading", fraction: slot.fraction };
  if (slot.status === "done") return { phase: "done" };
  return { phase: "error", message: slot.error || "Upload failed." };
}

const sourceTabs: {
  source: SampleSource;
  label: string;
  description: string;
  icon: (active: boolean) => React.ReactNode;
}[] = [
  {
    source: "lab",
    label: "Lab sample",
    description:
      "Pick a processed sample from your lab records — details auto-fill.",
    icon: (active) => (
      <FlaskConical
        className={`h-5 w-5 ${active ? "text-white" : "text-teal-30"}`}
      />
    ),
  },
  {
    source: "ncbi",
    label: "NCBI accession",
    description: "Pull metadata from a public GenBank accession automatically.",
    icon: (active) => (
      <Globe2 className={`h-5 w-5 ${active ? "text-white" : "text-teal-30"}`} />
    ),
  },
  {
    source: "new",
    label: "New sample",
    description: "Manually enter a sample that isn't in the lab system yet.",
    icon: (active) => (
      <CirclePlus
        className={`h-5 w-5 ${active ? "text-white" : "text-teal-30"}`}
      />
    ),
  },
];

const stepCopy: Record<UploadStep, string> = {
  sample: "Which sample is this for?",
  pipeline: "Choose the pipeline that will process it.",
  files: "Add the files it needs and set any parameters.",
};

function formatSampleDate(date?: string) {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toISOString().slice(0, 10);
}

function mapSampleToLabOption(sample: LabSample) {
  return {
    labTestId: sample.labTestId,
    id: sample.barcode,
    siteName: sample.siteName,
    diseaseName: sample.diseaseName,
    collectionDate: formatSampleDate(sample.collectedAt),
  };
}

/**
 * Lowercases an extra input's title for mid-sentence use ("Choose primer
 * pairs (BEDPE)", "Retry the primer pairs (BEDPE) upload") — but only its
 * first character, and only when that doesn't mangle a leading acronym like
 * "ARTIC primer scheme (BED)". An acronym lead is detected cheaply: if the
 * second character is itself an uppercase letter, the first is presumed to
 * be part of one and the title is left alone.
 */
function decapitalizeTitle(title: string): string {
  const second = title[1];
  const secondIsUppercaseLetter =
    second !== undefined &&
    second === second.toUpperCase() &&
    second !== second.toLowerCase();
  if (secondIsUppercaseLetter) return title;
  return title.charAt(0).toLowerCase() + title.slice(1);
}

/** One muted placeholder block — a loading stand-in for a line of real text. */
function SkeletonBlock({ className }: { className: string }) {
  return (
    <span
      className={`block rounded bg-grey-20 animate-pulse motion-reduce:animate-none ${className}`}
    />
  );
}

/** Mirrors one real lab-sample row's shape (mono id, pathogen pill, "site · Collected <date>" line) so the list doesn't jump when data lands. */
function LabSampleRowSkeleton() {
  return (
    <div className="w-full p-4 flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-5 w-16 rounded-full" />
        </div>
        <SkeletonBlock className="mt-2 h-3.5 w-40" />
      </div>
      <span className="w-5 h-5 rounded-full border border-grey-20 shrink-0" />
    </div>
  );
}

/**
 * Loading placeholder for the lab-sample list — a fixed number of row
 * skeletons inside the same bordered/divided container the real rows use,
 * so the box holds its height and structure rather than shrinking to a
 * single line of "Loading…" text and then jumping once data lands.
 *
 * The rows themselves are `aria-hidden` (they're meaningless shapes, not
 * content); the announcement for assistive tech lives on this wrapper via
 * `role="status"` + `aria-busy` + `aria-label`, so a screen reader says
 * "loading lab samples" once instead of reading four blank rows.
 */
function LabSamplesSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading lab samples"
      className="divide-y divide-grey-20"
    >
      <div aria-hidden="true" className="divide-y divide-grey-20">
        {Array.from({ length: 4 }).map((_, i) => (
          <LabSampleRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Traps Tab navigation inside the modal and closes it on Escape, since
 * CustomModal (shared with several other dashboard modals — not ours to
 * edit) does neither on its own. Only engages while `isOpen`, and reads the
 * latest `onEscape` via a ref rather than depending on it directly, so a
 * re-render never re-runs this effect and steals focus back to the first
 * field mid-keystroke.
 */
function useModalAccessibility(
  isOpen: boolean,
  containerRef: React.RefObject<HTMLDivElement>,
  onEscape: () => void,
) {
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    if (!container) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((el) => el.offsetParent !== null);

    const previouslyFocused = document.activeElement as HTMLElement | null;
    (getFocusable()[0] ?? container).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscapeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = getFocusable();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      previouslyFocused?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, containerRef]);
}

export default function UploadSequenceModal({
  isOpen,
  onClose,
  onSubmissionCreated,
}: UploadSequenceModalProps) {
  const user = useAtomValue(userAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);

  // Which project this submission belongs to.
  //
  // This used to be `user.project.id` throughout — the legacy single
  // "primary membership" column. That column is null for a workspace admin,
  // which left them on "Select a project first" with no way to select one,
  // and for anyone in several projects it silently filed every run under
  // whichever project happened to be primary. The backend now rejects a
  // projectId the caller cannot reach, so this has to be a real choice.
  const [workspaceProjects, setWorkspaceProjects] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);

  const [uploadStep, setUploadStep] = useState<UploadStep>("sample");
  const [sampleSource, setSampleSource] = useState<SampleSource>("lab");
  const [labSearch, setLabSearch] = useState("");
  const [labSamples, setLabSamples] = useState<
    ReturnType<typeof mapSampleToLabOption>[]
  >([]);
  // "idle": nothing attempted yet (either the effect hasn't run, or there's
  // no project to fetch for — see the early return below). Deliberately not
  // a boolean: a boolean defaults to "not loading", which briefly painted
  // the empty state before the fetch had even started. "idle" renders the
  // same skeleton as "loading" while a project is selected, so that flash
  // never shows.
  const [labSamplesStatus, setLabSamplesStatus] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");
  // Bumped by the "Try again" retry action to re-run the fetch effect below
  // without touching its isOpen/project-id dependencies or its isCurrent
  // cancellation guard.
  const [labSamplesRetryToken, setLabSamplesRetryToken] = useState(0);
  const [genBankId, setGenBankId] = useState("");
  const [isFetchingNcbi, setIsFetchingNcbi] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadForm>(emptyUploadForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Set once the user has tried to submit — reveals every inline error (not
  // just blurred fields) so a rejected submit is never a silent dead end.
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Pipeline selection + dynamic params.
  const [pipelines, setPipelines] = useState<SequencingPipeline[]>([]);
  const [isFetchingPipelines, setIsFetchingPipelines] = useState(false);
  const [selectedPipelineId, setSelectedPipelineId] = useState("");
  const [paramValues, setParamValues] = useState<ParamValues>({});

  // Direct-to-S3 upload state, keyed "main" for the reads file and by
  // extraInputs[].name for secondary files. A slot starts uploading the
  // instant a valid file is picked (Task 3) — long before submit.
  const [uploadSlots, setUploadSlots] = useState<Record<string, UploadSlot>>(
    {},
  );
  const abortControllersRef = useRef<Record<string, AbortController>>({});

  const selectedPipeline = useMemo(
    () => pipelines.find((p) => p.id === selectedPipelineId),
    [pipelines, selectedPipelineId],
  );

  // Which of the selected pipeline's extraInputs are actually in use given
  // the current param choices (per each input's own `when`, e.g. ont-lsdv's
  // primer_bed vs primer_bedpe depending on primer.tool). Everything below —
  // which pickers render, what's required, what's sent, what blocks submit —
  // is scoped to this list. An out-of-use input's slot in `uploadSlots` is
  // deliberately left alone, so a file already uploaded for it survives
  // switching the tool away and back; it's just never shown, counted, or
  // sent while out of use. Changing pipeline still clears every slot.
  const inUseExtraInputs = useMemo(
    () =>
      selectedPipeline
        ? selectedPipeline.extraInputs.filter((input) =>
            isExtraInputInUse(input, paramValues),
          )
        : [],
    [selectedPipeline, paramValues],
  );

  const filteredLabSamples = useMemo(() => {
    const query = labSearch.trim().toLowerCase();
    if (!query) return labSamples;
    return labSamples.filter(
      (s) =>
        s.id.toLowerCase().includes(query) ||
        s.siteName.toLowerCase().includes(query) ||
        s.diseaseName.toLowerCase().includes(query),
    );
  }, [labSamples, labSearch]);

  // Projects of the workspace the switcher currently points at. The
  // backend already restricts this list to what the caller can reach, so
  // anything offered here is guaranteed to pass submitJob's check.
  useEffect(() => {
    if (!isOpen || !currentWorkspace?.id) {
      setWorkspaceProjects([]);
      return;
    }
    let isCurrent = true;

    getWorkspaceProjects(currentWorkspace.id)
      .then((projects) => {
        if (!isCurrent) return;
        const options = projects.map((p) => ({ id: p.id, name: p.name }));
        setWorkspaceProjects(options);
        // Keep a valid selection: the user's primary project when it is in
        // this workspace (so nothing changes for existing single-project
        // users), otherwise the only option, otherwise make them choose.
        setSelectedProjectId((current) => {
          if (current && options.some((o) => o.id === current)) return current;
          const primary = user?.project?.id;
          if (primary && options.some((o) => o.id === primary)) return primary;
          return options.length === 1 ? options[0].id : "";
        });
      })
      .catch(() => {
        if (!isCurrent) return;
        setWorkspaceProjects([]);
        setSelectedProjectId("");
      });

    return () => {
      isCurrent = false;
    };
  }, [isOpen, currentWorkspace?.id, user?.project?.id]);

  useEffect(() => {
    if (!isOpen || !selectedProjectId) return;
    let isCurrent = true;

    const fetchLabSamples = async () => {
      setLabSamplesStatus("loading");
      try {
        const response = await getSequencingLabSamplesApi(selectedProjectId);
        if (!isCurrent) return;
        if (response.success && response.data) {
          setLabSamples(response.data.map(mapSampleToLabOption));
          setLabSamplesStatus("loaded");
        } else {
          setLabSamplesStatus("error");
        }
      } catch (error) {
        if (!isCurrent) return;
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch lab samples.",
        );
        setLabSamplesStatus("error");
      }
    };

    fetchLabSamples();
    return () => {
      isCurrent = false;
    };
  }, [isOpen, selectedProjectId, labSamplesRetryToken]);

  // Pipelines are backend-defined; adding one is meant to require no changes
  // here, so this list — and the params form below — drive everything.
  useEffect(() => {
    if (!isOpen) return;
    let isCurrent = true;

    const fetchPipelines = async () => {
      setIsFetchingPipelines(true);
      try {
        const response = await getSequencingPipelinesApi();
        if (!isCurrent) return;
        setPipelines(response.data || []);
      } catch (error) {
        if (!isCurrent) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to load pipelines.",
        );
      } finally {
        if (isCurrent) setIsFetchingPipelines(false);
      }
    };

    fetchPipelines();
    return () => {
      isCurrent = false;
    };
  }, [isOpen]);

  const abortAllUploads = () => {
    Object.values(abortControllersRef.current).forEach((controller) =>
      controller.abort(),
    );
    abortControllersRef.current = {};
  };

  const resetUploadFlow = () => {
    setUploadStep("sample");
    setSampleSource("lab");
    setLabSearch("");
    setGenBankId("");
    setIsFetchingNcbi(false);
    setUploadForm(emptyUploadForm);
    setSelectedPipelineId("");
    setParamValues({});
    abortAllUploads();
    setUploadSlots({});
    setSubmitAttempted(false);
  };

  const handleClose = () => {
    if (isSubmitting) return; // avoid tearing down state mid-submit
    resetUploadFlow();
    onClose();
  };

  useModalAccessibility(isOpen, modalRef, handleClose);

  const handleBack = () => {
    if (isSubmitting) return;
    if (uploadStep === "files") {
      setUploadStep("pipeline");
      return;
    }
    if (uploadStep === "pipeline") {
      setUploadStep("sample");
    }
  };

  const handleStepClick = (step: UploadStep) => {
    if (isSubmitting) return;
    setUploadStep(step);
  };

  const selectSource = (source: SampleSource) => {
    if (source === sampleSource) return;
    setSampleSource(source);
    setUploadForm(emptyUploadForm);
    setLabSearch("");
    setGenBankId("");
  };

  const selectLabSample = (sample: ReturnType<typeof mapSampleToLabOption>) => {
    setUploadForm({
      sampleId: sample.labTestId,
      sourceLabel: sample.siteName,
    });
  };

  const fetchFromNcbi = async () => {
    if (!genBankId.trim()) {
      toast.error("Enter a GenBank accession first.");
      return;
    }
    setIsFetchingNcbi(true);
    try {
      const response = await getNcbiPreviewApi(genBankId.trim());
      const data = response.data;
      if (!data) {
        toast.error("GenBank ID not found. Check the accession and try again.");
        return;
      }
      const accession = data.accession || genBankId.trim();
      setUploadForm({
        sampleId: accession,
        sourceLabel: data.title || "",
        ncbiAutoFileName: `${accession}.fasta`,
      });
      toast.success(`Fetched ${accession} from NCBI`);
    } catch (error) {
      console.error(error);
      toast.error(
        "Couldn't fetch from NCBI. Check the accession and try again.",
      );
    } finally {
      setIsFetchingNcbi(false);
    }
  };

  // A run submitted with no project is visible only to whoever submitted it —
  // isAccessible's owner fallback is the only thing that admits it — so
  // colleagues would never see it. Require the choice up front rather than
  // letting someone discover that after the pipeline has already run.
  const hasProject = workspaceProjects.length === 0 || !!selectedProjectId;
  const canContinueFromSample =
    hasProject &&
    (sampleSource === "new"
      ? uploadForm.sampleId.trim().length > 0
      : uploadForm.sampleId.length > 0);

  const handlePipelineChange = (pipelineId: string) => {
    if (pipelineId === selectedPipelineId) return;
    setSelectedPipelineId(pipelineId);
    const pipeline = pipelines.find((p) => p.id === pipelineId);
    setParamValues(buildDefaultParamValues(pipeline?.paramsSchema));
    // Accepted extensions and extra inputs differ per pipeline — a file
    // picked (or mid-upload) under a previous pipeline may no longer be
    // valid, so abandon it and start clean rather than silently keeping it.
    abortAllUploads();
    setUploadSlots({});
    setSubmitAttempted(false);
  };

  // --- Background upload orchestration -------------------------------------
  // Presign + PUT starts the instant a valid file is picked, independent of
  // the rest of the form. Swapping the file for a slot aborts whatever was
  // already in flight for it before starting the new one.
  const startSlotUpload = useCallback((slotId: string, file: File) => {
    abortControllersRef.current[slotId]?.abort();
    const controller = new AbortController();
    abortControllersRef.current[slotId] = controller;

    setUploadSlots((prev) => ({
      ...prev,
      [slotId]: {
        file,
        status: "uploading",
        fraction: 0,
        key: null,
        error: null,
      },
    }));

    (async () => {
      try {
        const presign = await presignSequencingUploadApi(file.name, file.size);
        if (controller.signal.aborted) return;
        if (!presign.data)
          throw new Error("Couldn't get an upload URL. Try again.");
        await uploadViaPresignedUrl(
          file,
          presign.data,
          (fraction) => {
            setUploadSlots((prev) =>
              prev[slotId]?.file === file
                ? { ...prev, [slotId]: { ...prev[slotId], fraction } }
                : prev,
            );
          },
          controller.signal,
        );
        if (controller.signal.aborted) return;
        const key = presign.data.key;
        setUploadSlots((prev) =>
          prev[slotId]?.file === file
            ? {
                ...prev,
                [slotId]: { ...prev[slotId], status: "done", fraction: 1, key },
              }
            : prev,
        );
      } catch (error) {
        if (controller.signal.aborted) return; // an intentional swap/removal, not a failure
        setUploadSlots((prev) =>
          prev[slotId]?.file === file
            ? {
                ...prev,
                [slotId]: {
                  ...prev[slotId],
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Upload failed.",
                },
              }
            : prev,
        );
      }
    })();
  }, []);

  const removeSlot = useCallback((slotId: string) => {
    abortControllersRef.current[slotId]?.abort();
    delete abortControllersRef.current[slotId];
    setUploadSlots((prev) => {
      if (!(slotId in prev)) return prev;
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  }, []);

  // One picker render, shared between the flat extra-inputs list below the
  // reads file and any picker docked into a pipeline-params-form section via
  // `sectionExtras` (see the placement block ahead of the JSX return) — the
  // props are identical either way, only where the element ends up differs.
  const renderExtraInputPicker = (input: PipelineExtraInput) => {
    const required = isExtraInputRequired(input, paramValues);
    const slot = uploadSlots[input.name];
    return (
      <SubmissionFilePicker
        key={input.name}
        id={`extra-file-${input.name}`}
        label={input.title}
        description={input.description}
        required={required}
        acceptedExtensions={input.extensions}
        file={slot?.file ?? null}
        onSelect={(file) =>
          file ? startSlotUpload(input.name, file) : removeSlot(input.name)
        }
        uploadStatus={toFileUploadStatus(slot)}
        onRetry={
          slot ? () => startSlotUpload(input.name, slot.file) : undefined
        }
        disabled={isSubmitting}
        promptText={`Choose ${decapitalizeTitle(input.title)}`}
        showMissingError={submitAttempted && required && !slot}
      />
    );
  };

  const needsMainFile = sampleSource !== "ncbi";
  // Only the main slot and in-use extra-input slots can block "Start run" —
  // a hidden (out-of-use) slot that's still uploading in the background
  // must not disable submission, since its file isn't part of this run.
  const anyUploadPending =
    uploadSlots.main?.status === "uploading" ||
    inUseExtraInputs.some(
      (input) => uploadSlots[input.name]?.status === "uploading",
    );

  const uploadRows: SubmissionUploadRow[] = useMemo(() => {
    const rows: SubmissionUploadRow[] = [];
    const mainSlot = uploadSlots.main;
    if (mainSlot) {
      rows.push({
        key: "main",
        label: "Reads file",
        fileName: mainSlot.file.name,
        status: mainSlot.status,
        fraction: mainSlot.fraction,
        errorMessage: mainSlot.error ?? undefined,
        onRetry: () => startSlotUpload("main", mainSlot.file),
      });
    }
    for (const input of inUseExtraInputs) {
      const slot = uploadSlots[input.name];
      if (!slot) continue;
      rows.push({
        key: input.name,
        label: input.title,
        fileName: slot.file.name,
        status: slot.status,
        fraction: slot.fraction,
        errorMessage: slot.error ?? undefined,
        onRetry: () => startSlotUpload(input.name, slot.file),
      });
    }
    return rows;
  }, [uploadSlots, inUseExtraInputs, startSlotUpload]);

  const handleUploadSubmit = async () => {
    if (isSubmitting) return;
    setSubmitAttempted(true);

    if (!selectedPipeline) {
      toast.error("Choose a processing pipeline.");
      setUploadStep("pipeline");
      return;
    }

    if (needsMainFile) {
      const mainSlot = uploadSlots.main;
      if (!mainSlot) {
        toast.error("Choose a reads file to upload.");
        return;
      }
      if (mainSlot.status === "uploading") {
        toast.error("The reads file is still uploading — hang tight.");
        return;
      }
      if (mainSlot.status === "error") {
        toast.error("Retry the reads file upload before starting the run.");
        return;
      }
    }

    const missingExtra = inUseExtraInputs.find((input) => {
      if (!isExtraInputRequired(input, paramValues)) return false;
      const slot = uploadSlots[input.name];
      return !slot || slot.status !== "done";
    });
    if (missingExtra) {
      const slot = uploadSlots[missingExtra.name];
      if (slot?.status === "uploading")
        toast.error(`${missingExtra.title} is still uploading — hang tight.`);
      else if (slot?.status === "error")
        toast.error(
          `Retry the ${decapitalizeTitle(missingExtra.title)} upload before starting the run.`,
        );
      else
        toast.error(
          `Upload ${decapitalizeTitle(missingExtra.title)} before starting the run.`,
        );
      return;
    }

    const paramErrors = validateParamValues(
      selectedPipeline.paramsSchema,
      paramValues,
      0,
      "",
      selectedPipeline.id,
    );
    if (paramErrors.length > 0) {
      toast.error(paramErrors[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      const submitParams = buildSubmitParams(
        selectedPipeline.paramsSchema,
        paramValues,
      );

      const extraInputKeys: Record<string, string> = {};
      for (const input of inUseExtraInputs) {
        const slot = uploadSlots[input.name];
        if (slot?.status === "done" && slot.key)
          extraInputKeys[input.name] = slot.key;
      }

      const mainSlot = uploadSlots.main;
      const payload: SubmitSequencingJobPayload = {
        sourceType:
          sampleSource === "new" ? "manual" : (sampleSource as SourceType),
        projectId: selectedProjectId || undefined,
        pipelineId: selectedPipeline.id,
        inputKey: mainSlot?.status === "done" ? mainSlot.key : null,
        inputFilename: mainSlot?.file.name,
        extraInputKeys:
          Object.keys(extraInputKeys).length > 0 ? extraInputKeys : undefined,
        params: Object.keys(submitParams).length > 0 ? submitParams : undefined,
      };
      if (sampleSource === "lab") {
        payload.labTestId = uploadForm.sampleId;
      } else if (sampleSource === "ncbi") {
        payload.ncbiAccession = uploadForm.sampleId;
      } else {
        payload.manualSampleBarcode = uploadForm.sampleId;
        payload.manualSiteName = uploadForm.sourceLabel;
      }

      const response = await submitSequencingJobApi(payload);
      if (response.success) {
        onSubmissionCreated({
          sampleId: uploadForm.sampleId,
          fileNames: mainSlot ? [mainSlot.file.name] : [],
          pipelineId: selectedPipeline.id,
          pipelineLabel: selectedPipeline.displayName || selectedPipeline.id,
        });
        // The backend's submit response carries no `message` today, so this
        // is effectively always the literal copy — kept as a fallback in
        // case that changes.
        toast.success(response.message || "Run started");
        handleClose();
      } else {
        toast.error(
          response.message ||
            "Something went wrong starting the run. Try again.",
        );
      }
    } catch (error) {
      // A pipeline 422 arrives here as an Error whose message already
      // embeds the pipeline's own `detail` (see submitSequencingJobApi) —
      // surface it verbatim rather than a generic failure message.
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong starting the run. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitButtonLabel = anyUploadPending
    ? "Uploading files…"
    : isSubmitting
      ? "Starting run…"
      : "Start run";
  const sampleBadge =
    sampleSource === "lab" ? "Lab" : sampleSource === "ncbi" ? "NCBI" : "New";

  // --- Extra-input placement ------------------------------------------------
  // An in-use input with a `when` docks into the params-form section that
  // owns every path in it (so e.g. the primer BED/BEDPE picker sits right
  // next to the primer.tool toggle that decides which one applies), found
  // via pipeline-params-form's own sectionForParamPaths. An input with no
  // `when` (always in use) or whose `when` paths aren't all owned by one
  // section falls back to the flat list below the reads file, same as before
  // this feature.
  const sectionExtraInputs: Record<string, PipelineExtraInput[]> = {};
  const topLevelExtraInputs: PipelineExtraInput[] = [];
  if (selectedPipeline) {
    for (const input of inUseExtraInputs) {
      const whenPaths = Object.keys(input.when ?? {});
      const sectionKey =
        whenPaths.length > 0
          ? sectionForParamPaths(
              selectedPipeline.id,
              selectedPipeline.paramsSchema,
              paramValues,
              whenPaths,
            )
          : null;
      if (sectionKey) {
        (sectionExtraInputs[sectionKey] ??= []).push(input);
      } else {
        topLevelExtraInputs.push(input);
      }
    }
  }

  // Several inputs can land in the same section (stacked in one wrapper); a
  // section auto-opens and flags "Needs attention" once a required input
  // inside it is missing or failed, mirroring the flat list's own
  // showMissingError condition below.
  const sectionExtras: SectionExtras = {};
  for (const [sectionKey, inputs] of Object.entries(sectionExtraInputs)) {
    const hasError =
      submitAttempted &&
      inputs.some((input) => {
        if (!isExtraInputRequired(input, paramValues)) return false;
        const slot = uploadSlots[input.name];
        return !slot || slot.status === "error";
      });
    sectionExtras[sectionKey] = {
      hasError,
      content: (
        <div className="flex flex-col gap-4">
          {inputs.map((input) => renderExtraInputPicker(input))}
        </div>
      ),
    };
  }

  return (
    <CustomModal isOpen={isOpen}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-sequence-modal-title"
        tabIndex={-1}
        className="w-[720px] max-w-[calc(100vw-32px)] max-h-[90vh] overflow-y-auto bg-grey-0 rounded-2xl border border-grey-20 p-9 shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] outline-none"
      >
        {/* Modal header */}
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex items-center gap-2">
            {uploadStep !== "sample" && (
              <button
                type="button"
                aria-label="Go back"
                className="w-8 h-8 -ml-2 rounded flex items-center justify-center shrink-0 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-5 w-5 text-grey-90" />
              </button>
            )}
            <div className="min-w-0">
              <h2
                id="upload-sequence-modal-title"
                className="text-grey-90 text-xl font-semibold leading-7"
              >
                New sequencing submission
              </h2>
              <p className="text-grey-70 text-sm leading-5">
                {stepCopy[uploadStep]}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center shrink-0 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X className="h-6 w-6 text-grey-70" />
          </button>
        </div>

        {/* Persistent summary — stays visible across all three steps so
            earlier choices, and any file uploading in the background, are
            never out of sight. */}
        <div className="mt-6">
          <SubmissionSummary
            currentStep={uploadStep}
            sampleCaption={uploadForm.sampleId || null}
            sampleBadge={sampleBadge}
            pipelineCaption={
              selectedPipeline
                ? selectedPipeline.displayName || selectedPipeline.id
                : null
            }
            uploads={uploadRows}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Sample step */}
        {uploadStep === "sample" && (
          <div className="mt-6 flex flex-col gap-5">
            {/* Applies to all three sources: the project owns the submission's
                tenancy, and for lab sources it also decides which samples are
                listed below. */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sequencing-project"
                className="text-sm font-semibold text-grey-90"
              >
                Project
              </label>
              {workspaceProjects.length === 0 ? (
                <p className="text-grey-70 text-sm">
                  {currentWorkspace?.id
                    ? "No projects in this workspace yet."
                    : "Select a workspace to choose a project."}
                </p>
              ) : (
                <>
                  <select
                    id="sequencing-project"
                    className="h-11 rounded-lg border border-grey-20 bg-white px-3 text-base text-grey-90 outline-none focus-visible:border-blue-40"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    <option value="">Select a project…</option>
                    {workspaceProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-grey-70 text-sm">
                    This run will belong to the selected project, in{" "}
                    {currentWorkspace?.name ?? "the current workspace"}.
                  </p>
                </>
              )}
            </div>

            <div>
              <div
                className="grid grid-cols-3 gap-2"
                role="tablist"
                aria-label="Sample source"
              >
                {sourceTabs.map((tab) => {
                  const isActive = tab.source === sampleSource;
                  return (
                    <button
                      key={tab.source}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`rounded-xl border px-3 py-3 flex flex-col items-center gap-1.5 text-center transition-colors duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40 ${
                        isActive
                          ? "border-teal-30 bg-teal-10"
                          : "border-grey-20 bg-white hover:border-teal-20 hover:bg-teal-10/40"
                      }`}
                      onClick={() => selectSource(tab.source)}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          isActive ? "bg-teal-30" : "bg-teal-10"
                        }`}
                      >
                        {tab.icon(isActive)}
                      </span>
                      <span
                        className={`text-sm font-semibold ${isActive ? "text-teal-70" : "text-grey-90"}`}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-grey-70 text-sm">
                {
                  sourceTabs.find((tab) => tab.source === sampleSource)
                    ?.description
                }
              </p>
            </div>

            {sampleSource === "lab" && (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-70"
                    aria-hidden="true"
                  />
                  <input
                    className="w-full h-11 pl-11 pr-4 rounded-lg border border-grey-20 bg-white outline-none text-grey-90 text-base focus-visible:border-blue-40"
                    placeholder="Search by sample ID, site, or pathogen"
                    aria-label="Search lab samples"
                    value={labSearch}
                    onChange={(e) => setLabSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="border border-grey-20 rounded-xl divide-y divide-grey-20 max-h-[280px] overflow-y-auto bg-white">
                  {!selectedProjectId ? (
                    <div className="p-6 text-center text-grey-70 text-sm">
                      Select a project first to see its lab samples.
                    </div>
                  ) : labSamplesStatus === "idle" ||
                    labSamplesStatus === "loading" ? (
                    <LabSamplesSkeleton />
                  ) : labSamplesStatus === "error" ? (
                    <div className="p-6 flex flex-col items-center gap-2 text-center">
                      <p className="text-grey-70 text-sm">
                        Couldn&apos;t load lab samples.
                      </p>
                      <button
                        type="button"
                        className="text-teal-30 text-sm font-semibold underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40 rounded"
                        onClick={() => setLabSamplesRetryToken((t) => t + 1)}
                      >
                        Try again
                      </button>
                    </div>
                  ) : filteredLabSamples.length === 0 ? (
                    <div className="p-6 text-center text-grey-70 text-sm">
                      {labSamples.length === 0
                        ? "No test-ready samples yet — try NCBI or add one manually."
                        : "No samples match your search."}
                    </div>
                  ) : (
                    filteredLabSamples.map((sample) => {
                      const isSelected =
                        uploadForm.sampleId === sample.labTestId;
                      return (
                        <button
                          key={sample.labTestId}
                          type="button"
                          aria-pressed={isSelected}
                          className={`w-full p-4 text-left flex items-center justify-between gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-40 ${
                            isSelected ? "bg-teal-10" : "hover:bg-grey-10"
                          }`}
                          onClick={() => selectLabSample(sample)}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold text-grey-90">
                                {sample.id}
                              </span>
                              <span className="px-2 py-0.5 rounded-full border border-grey-20 text-xs text-grey-70">
                                {sample.diseaseName}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-grey-70 truncate">
                              {sample.siteName} · Collected{" "}
                              {sample.collectionDate}
                            </p>
                          </div>
                          <span
                            className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                              isSelected
                                ? "border-teal-30 bg-teal-30"
                                : "border-grey-40 bg-white"
                            }`}
                            aria-hidden="true"
                          >
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 text-white" />
                            )}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {sampleSource === "ncbi" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="genbank-id"
                    className="text-grey-90 text-sm font-semibold"
                  >
                    GenBank accession
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="genbank-id"
                      className="h-11 flex-1 px-4 rounded-lg border border-grey-20 bg-white outline-none text-grey-90 text-base focus-visible:border-blue-40"
                      placeholder="e.g., OQ123456 or NC_007362"
                      value={genBankId}
                      onChange={(e) => setGenBankId(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") fetchFromNcbi();
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="h-11 px-5 rounded-lg bg-blue-40 text-white text-base font-semibold disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40"
                      onClick={fetchFromNcbi}
                      disabled={isFetchingNcbi}
                    >
                      {isFetchingNcbi ? "Fetching…" : "Fetch"}
                    </button>
                  </div>
                  <p className="text-grey-70 text-xs">
                    We&apos;ll query NCBI&apos;s public E-utilities to pre-fill
                    sequence metadata.
                  </p>
                </div>
                {uploadForm.sampleId && (
                  <div className="rounded-xl border border-teal-20 bg-teal-10 p-4 flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-30">
                      <CloudCheck className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-semibold text-teal-70 truncate">
                        {uploadForm.sampleId}
                      </p>
                      {uploadForm.sourceLabel && (
                        <p className="mt-0.5 text-xs text-teal-60 truncate">
                          {uploadForm.sourceLabel}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {sampleSource === "new" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="new-sample-id"
                    className="text-grey-90 text-sm font-semibold"
                  >
                    Sample ID
                  </label>
                  <input
                    id="new-sample-id"
                    className="h-11 px-4 rounded-lg border border-grey-20 bg-white outline-none text-grey-90 text-base focus-visible:border-blue-40"
                    placeholder="e.g. SMP-2026-020"
                    value={uploadForm.sampleId}
                    onChange={(e) =>
                      setUploadForm((p) => ({ ...p, sampleId: e.target.value }))
                    }
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="new-sample-source"
                    className="text-grey-90 text-sm font-semibold"
                  >
                    Source / site (optional)
                  </label>
                  <input
                    id="new-sample-source"
                    className="h-11 px-4 rounded-lg border border-grey-20 bg-white outline-none text-grey-90 text-base focus-visible:border-blue-40"
                    placeholder="e.g. Poultry Farm Zeta"
                    value={uploadForm.sourceLabel}
                    onChange={(e) =>
                      setUploadForm((p) => ({
                        ...p,
                        sourceLabel: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                className="h-11 px-5 rounded-lg bg-blue-40 text-white text-base font-semibold disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40"
                disabled={!canContinueFromSample}
                onClick={() => setUploadStep("pipeline")}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Pipeline step — this list, and the params form in the next step,
            come straight from the backend so adding a pipeline never
            requires a change here. This is the most consequential choice in
            the form (it determines every field and file after it), so it
            gets a full step to itself. */}
        {uploadStep === "pipeline" && (
          <div className="mt-6 flex flex-col gap-4">
            <SubmissionPipelinePicker
              pipelines={pipelines}
              selectedPipelineId={selectedPipelineId}
              onSelect={handlePipelineChange}
              isLoading={isFetchingPipelines}
              disabled={isSubmitting}
            />
            {!selectedPipeline &&
              !isFetchingPipelines &&
              pipelines.length > 0 && (
                <p className="text-grey-50 text-xs">
                  Select a pipeline to continue.
                </p>
              )}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                className="h-11 px-5 rounded-lg bg-blue-40 text-white text-base font-semibold disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40"
                disabled={!selectedPipeline}
                onClick={() => setUploadStep("files")}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Files and options step */}
        {uploadStep === "files" && selectedPipeline && (
          <div className="mt-6 flex flex-col gap-5">
            {/* NCBI auto-fetch indicator — shown until the user opts to override it */}
            {sampleSource === "ncbi" &&
              uploadForm.ncbiAutoFileName &&
              !uploadSlots.main && (
                <div className="rounded-xl border border-teal-20 bg-teal-10 p-4 flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-30">
                    <CloudCheck className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-teal-70">
                      FASTA file will be auto-fetched from NCBI
                    </p>
                    <p className="mt-0.5 text-xs text-teal-60 truncate">
                      {uploadForm.ncbiAutoFileName} — downloaded automatically
                      when the run starts
                    </p>
                  </div>
                </div>
              )}

            {/* Reads file — starts uploading the moment it's picked, in the
                background, independent of the params below. */}
            <SubmissionFilePicker
              id="sequence-file-upload"
              label={
                sampleSource === "ncbi"
                  ? "Custom file (optional)"
                  : "Reads file"
              }
              description={
                sampleSource === "ncbi"
                  ? "Upload your own file to override the NCBI auto-fetch above."
                  : undefined
              }
              required={needsMainFile}
              acceptedExtensions={selectedPipeline.acceptedExtensions}
              file={uploadSlots.main?.file ?? null}
              onSelect={(file) =>
                file ? startSlotUpload("main", file) : removeSlot("main")
              }
              uploadStatus={toFileUploadStatus(uploadSlots.main)}
              onRetry={
                uploadSlots.main
                  ? () => startSlotUpload("main", uploadSlots.main!.file)
                  : undefined
              }
              disabled={isSubmitting}
              promptText={
                sampleSource === "ncbi"
                  ? "Choose a replacement file"
                  : "Choose a reads file"
              }
              showMissingError={
                submitAttempted && needsMainFile && !uploadSlots.main
              }
            />

            {/* Extra inputs — one picker per in-use pipeline.extraInputs
                entry (out-of-use ones, e.g. primer_bed while primer.tool is
                "bamclipper", are hidden entirely — see inUseExtraInputs).
                Vanishes entirely for a pipeline (e.g. snippy-fasta) that has
                none in use. An input whose `when` names a params-form
                section renders inside that section instead (via
                sectionExtras below) — this list is only the rest. */}
            {topLevelExtraInputs.length > 0 && (
              <div className="flex flex-col gap-4">
                {topLevelExtraInputs.map((input) =>
                  renderExtraInputPicker(input),
                )}
              </div>
            )}

            {/* Pipeline parameters — rendered entirely from paramsSchema,
                with irrelevant groups (given the schema's own choices, e.g.
                variant.tool) hidden by submission-relevance-map.ts.
                sectionExtras docks each `when`-scoped extra-input picker
                (e.g. primer BED/BEDPE) into the section that owns its
                condition. */}
            <PipelineParamsForm
              pipelineId={selectedPipeline.id}
              schema={selectedPipeline.paramsSchema}
              values={paramValues}
              onChange={setParamValues}
              disabled={isSubmitting}
              showAllErrors={submitAttempted}
              stages={selectedPipeline.stages}
              sectionExtras={sectionExtras}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 mt-1 border-t border-grey-20">
              <button
                type="button"
                className="h-11 px-5 rounded-lg border border-grey-20 bg-white text-grey-90 text-base font-semibold disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-11 px-5 rounded-lg bg-blue-40 text-white text-base font-semibold disabled:opacity-60 inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40"
                onClick={handleUploadSubmit}
                disabled={isSubmitting || anyUploadPending}
                aria-busy={isSubmitting || anyUploadPending}
              >
                {(isSubmitting || anyUploadPending) && (
                  <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                )}
                {submitButtonLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </CustomModal>
  );
}

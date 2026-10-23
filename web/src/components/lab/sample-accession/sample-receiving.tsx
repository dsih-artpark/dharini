"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import {
  CheckCircle2,
  XCircle,
  Save,
  ArrowRight,
  Upload,
  FileText,
  X,
  Eye,
} from "lucide-react";

import {
  uploadImagesApi,
  getSignedUrlApi,
} from "@/src/app/(dashboard)/home/loader";
import { Sample } from "@/src/types/sample";
import { User } from "@/src/types/global";
import { updateSampleApi } from "@/src/app/(dashboard)/lab/[sampleId]/actions";
import { getTeamMembersApi } from "@/src/app/(dashboard)/lab/[sampleId]/loader";
import { sampleAtom } from "@/src/store/sampleAtom";
import { userAtom } from "@/src/store/userAtom";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import { selectedProcessableSamplesAtom } from "@/src/store/processableSamplesAtom";
import {
  DISEASE_BADGE_COLORS,
  SAMPLE_UNITS,
  STORAGE_TEMPERATURES,
} from "@/src/utils/constant";
import Spinner from "@/src/components/ui/spinner";
import TeamMemberSelect from "@/src/components/lab/sample-accession/team-member-select";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SampleReceivingProps {
  isBulkMode?: boolean;
  onBulkSuccess?: (action: "exit" | "proceed" | "complete") => void;
}

interface SampleState {
  sampleId: string;
  status: "received" | "rejected" | null;
  volumeValue: string;
  volumeUnit: string;
  rejectReason: string;
  accessionId: string;
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

const FieldLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
    {children}
    {required && <span className="text-red-400 ml-1">*</span>}
  </label>
);

const inputCls =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 text-sm text-slate-700 bg-white transition-all placeholder:text-slate-400";
const selectCls =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 text-sm text-slate-700 bg-white transition-all appearance-none cursor-pointer";

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SampleReceiving({
  isBulkMode,
  onBulkSuccess,
}: SampleReceivingProps) {
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

  // ── Unified Sample State ──────────────────────────────────────────────────
  const samplesToProcess = useMemo(() => {
    if (isBulkMode) return selectedBulkSamples;
    return currentSample ? [currentSample] : [];
  }, [isBulkMode, selectedBulkSamples, currentSample]);

  const [sampleStates, setSampleStates] = useState<SampleState[]>([]);

  // ── Common Details State ──────────────────────────────────────────────────
  const [receivingDate, setReceivingDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [receivingTime, setReceivingTime] = useState(
    new Date().toTimeString().slice(0, 5),
  );
  const [storageTemperature, setStorageTemperature] = useState("");
  const [storageDetails, setStorageDetails] = useState("");
  const [performedById, setPerformedById] = useState<string>("");
  const [referenceBatchId, setReferenceBatchId] = useState("");
  const [batchReferenceDocument, setBatchReferenceDocument] = useState("");
  const [batchDocumentName, setBatchDocumentName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Initialize sample states when samplesToProcess change
  useEffect(() => {
    if (samplesToProcess.length > 0 && sampleStates.length === 0) {
      setSampleStates(
        samplesToProcess.map((s) => ({
          sampleId: s.id,
          status:
            s.sampleStatus === "received"
              ? "received"
              : s.sampleStatus === "rejected"
                ? "rejected"
                : null,
          volumeValue: s.receivedVolumeValue || "",
          volumeUnit: s.receivedVolumeUnit || "mL",
          rejectReason: s.rejectReason || "",
          accessionId: s.accessionId || "",
        })),
      );

      const first = samplesToProcess[0];
      if (first) {
        const receivedAtStr =
          first.receivedAt || first.details?.receiving?.receivedAt;
        if (receivedAtStr) {
          const dateObj = new Date(receivedAtStr);
          setReceivingDate(dateObj.toISOString().split("T")[0]);
          setReceivingTime(dateObj.toTimeString().slice(0, 5));
        }

        const temp =
          first.receivedStorageTemperature ||
          first.details?.receiving?.storageTemperature ||
          "";
        const storage =
          first.receivedLabStorageDetails ||
          first.details?.receiving?.storageDetails ||
          "";
        const recipientId = first.receivedBy?.id || "";
        const rBatchId =
          first.referenceBatchId ||
          first.details?.receiving?.referenceBatchId ||
          "";
        const rBatchDoc =
          first.batchReferenceDocument ||
          first.details?.receiving?.batchReferenceDocument ||
          "";

        if (temp) setStorageTemperature(temp);
        if (storage) setStorageDetails(storage);
        if (recipientId) setPerformedById(recipientId);
        if (rBatchId) setReferenceBatchId(rBatchId);
        if (rBatchDoc) {
          setBatchReferenceDocument(rBatchDoc);
          // Try to infer a displayable name from the URL
          const urlParts = rBatchDoc.split("/");
          setBatchDocumentName(
            urlParts[urlParts.length - 1] || "Uploaded document",
          );
        }
      }
    }
  }, [samplesToProcess, sampleStates.length]);

  // ── Team Members ──────────────────────────────────────────────────────────
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);

  useEffect(() => {
    const loadTeamMembers = async () => {
      const teamId = samplesToProcess[0]?.team?.id;
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
  }, [currentProjectId, samplesToProcess]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const updateSampleState = useCallback(
    (sampleId: string, patch: Partial<SampleState>) => {
      setSampleStates((prev) =>
        prev.map((s) => (s.sampleId === sampleId ? { ...s, ...patch } : s)),
      );
    },
    [],
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (
      selectedIds.size === samplesToProcess.length &&
      samplesToProcess.length > 0
    )
      setSelectedIds(new Set());
    else setSelectedIds(new Set(samplesToProcess.map((s) => s.id)));
  };

  const bulkSetStatus = (status: "received" | "rejected") => {
    setSampleStates((prev) =>
      prev.map((s) =>
        selectedIds.has(s.sampleId)
          ? {
              ...s,
              status,
              rejectReason: "",
              volumeValue: status === "received" ? s.volumeValue : "",
            }
          : s,
      ),
    );
    setSelectedIds(new Set());
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState<"exit" | "proceed">("proceed");

  const isFormValid = useMemo(() => {
    if (sampleStates.length === 0) return false;
    if (!sampleStates.every((s) => !!s.status)) return false;
    if (sampleStates.some((s) => s.status === "received")) {
      if (!receivingDate || !receivingTime || !performedById) return false;
    }
    return true;
  }, [sampleStates, receivingDate, receivingTime, performedById]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setBatchDocumentName(file.name);

    try {
      const res = await uploadImagesApi({ files: [file] });
      if (res.success && res.data?.[0]?.uploaded) {
        setBatchReferenceDocument(res.data[0].fileUrl || "");
      } else {
        toast.error("File upload failed. Please try again.");
        setBatchDocumentName("");
      }
    } catch (err) {
      toast.error("Error uploading file.");
      setBatchDocumentName("");
      console.error(err);
    } finally {
      setIsUploading(false);
      // Reset input so same file can be re-selected
      e.target.value = "";
    }
  };

  const handlePreview = async () => {
    if (batchReferenceDocument) {
      try {
        const res = await getSignedUrlApi(batchReferenceDocument);
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
    setBatchReferenceDocument("");
    setBatchDocumentName("");
  };

  const handleSubmit = async (forceExit = false) => {
    if (!currentProjectId || !isFormValid) return;

    try {
      setSubmitting(true);
      setSubmitType(forceExit ? "exit" : "proceed");

      const finalDocUrl = batchReferenceDocument;

      const receivedAtISO = new Date(
        `${receivingDate}T${receivingTime}`,
      ).toISOString();
      const performedByUser = teamMembers.find((m) => m.id === performedById);

      const updatePromises = sampleStates.map((ss, idx) => {
        const originalSample = samplesToProcess[idx];
        const payload: Partial<Sample> =
          ss.status === "received"
            ? {
                sampleStatus: "received",
                receivedAt: receivedAtISO,
                receivedVolumeValue: ss.volumeValue,
                receivedVolumeUnit: ss.volumeUnit,
                receivedStorageTemperature: storageTemperature,
                receivedLabStorageDetails: storageDetails,
                receivedBy: performedByUser,
                referenceBatchId,
                batchReferenceDocument: finalDocUrl,
                accessionId: ss.accessionId,
                rejectReason: "",
                details: {
                  ...(originalSample?.details || {}),
                  receiving: {
                    storageTemperature,
                    storageDetails,
                    receivedAt: receivedAtISO,
                    referenceBatchId,
                    batchReferenceDocument: finalDocUrl,
                    accessionId: ss.accessionId,
                  },
                },
              }
            : {
                sampleStatus: "rejected",
                rejectReason: ss.rejectReason,
                rejectedAt: new Date().toISOString(),
              };
        return updateSampleApi(currentProjectId, ss.sampleId, payload);
      });

      const results = await Promise.all(updatePromises);
      const allSucceeded = results.every((r) => r.success);

      if (allSucceeded) {
        toast.success(
          `Successfully updated ${samplesToProcess.length} sample${samplesToProcess.length > 1 ? "s" : ""}.`,
        );
        if (isBulkMode) {
          setSelectedBulkSamples((prev) =>
            prev
              .map((s) => {
                const res = results.find(
                  (r) => r.success && r.data?.id === s.id,
                );
                return res?.data ? { ...s, ...res.data } : s;
              })
              .filter((s) => s.sampleStatus === "received"),
          );
        } else if (results[0].data) {
          setSample((prev) => ({ ...prev, ...results[0].data }) as Sample);
        }

        const noneAccepted = !sampleStates.some((s) => s.status === "received");
        const allRejected = sampleStates.every((s) => s.status === "rejected");

        if (isBulkMode && onBulkSuccess) {
          onBulkSuccess(
            noneAccepted ? "complete" : forceExit ? "exit" : "proceed",
          );
        } else if (forceExit || allRejected) {
          router.replace("/lab");
        }
      }
    } catch (error) {
      toast.error("Error updating samples. Please try again.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const acceptedCount = sampleStates.filter(
    (s) => s.status === "received",
  ).length;
  const rejectedCount = sampleStates.filter(
    (s) => s.status === "rejected",
  ).length;

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto w-full">
      {/* ── Common Receiving Details ─────────────────────────────────────── */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h3 className="text-sm font-bold text-slate-700 tracking-wide">
            Common Receiving Details
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            These details apply to all accepted samples in this batch
          </p>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Row 1: Date / Time / Temp / Storage */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Receiving Date</FieldLabel>
              <input
                type="date"
                className={inputCls}
                value={receivingDate}
                onChange={(e) => setReceivingDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>Receiving Time</FieldLabel>
              <input
                type="time"
                className={inputCls}
                value={receivingTime}
                onChange={(e) => setReceivingTime(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>Storage Temperature</FieldLabel>
              <div className="relative">
                <select
                  className={selectCls}
                  value={storageTemperature}
                  onChange={(e) => setStorageTemperature(e.target.value)}
                >
                  <option value="">Select temperature</option>
                  {STORAGE_TEMPERATURES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ▾
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>Storage Details</FieldLabel>
              <input
                type="text"
                placeholder="e.g., Freezer 1, Rack B2"
                className={inputCls}
                value={storageDetails}
                onChange={(e) => setStorageDetails(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Batch ID / Batch Doc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Reference Batch ID</FieldLabel>
              <input
                type="text"
                placeholder="e.g., BATCH-2026-001"
                className={inputCls}
                value={referenceBatchId}
                onChange={(e) => setReferenceBatchId(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>Batch Reference Document</FieldLabel>
              {batchReferenceDocument || isUploading ? (
                <div
                  className={`flex items-center gap-3 px-3 py-2 border rounded-lg transition-colors ${isUploading ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"}`}
                >
                  <FileText
                    size={16}
                    className={
                      isUploading
                        ? "text-blue-600 shrink-0"
                        : "text-green-600 shrink-0"
                    }
                  />
                  <div className="flex-1 flex flex-col min-w-0">
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <Spinner />
                        <span className="text-xs text-blue-600 font-medium animate-pulse">
                          Uploading file...
                        </span>
                      </div>
                    ) : (
                      <>
                        <span
                          className={`text-sm font-medium truncate text-green-700`}
                        >
                          {batchDocumentName || "Uploaded document"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">
                            Uploaded
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  {!isUploading && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handlePreview}
                        className={`p-1.5 rounded-md transition-colors text-green-400 hover:bg-green-100 hover:text-green-600`}
                        title="Preview document"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={clearDocument}
                        className={`p-1.5 rounded-md transition-colors text-green-400 hover:bg-green-100 hover:text-red-500`}
                        title="Remove document"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    className="hidden"
                    id="batch-doc-upload"
                    onChange={handleFileSelect}
                    accept="application/pdf,image/*"
                  />
                  <label
                    htmlFor="batch-doc-upload"
                    className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50/50 hover:bg-blue-50 hover:border-blue-50 transition-all text-slate-500 hover:text-blue-600 group"
                  >
                    <Upload
                      size={14}
                      className="shrink-0 transition-colors group-hover:text-white"
                    />
                    <span className="text-sm transition-colors group-hover:text-white font-medium">
                      Click to select image or PDF
                    </span>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Row 3: Received By */}
          <div className="pt-2 border-t border-slate-100 max-w-sm">
            <TeamMemberSelect
              value={performedById}
              onChange={setPerformedById}
              teamMembers={teamMembers}
              loading={loadingTeamMembers}
              label="Received By"
              currentUserId={user?.id}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* ── Sample Table ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Bulk toolbar */}
        {isBulkMode && (
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              <span className="text-blue-600">
                {sampleStates.filter((s) => s.status).length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700">
                {samplesToProcess.length}
              </span>{" "}
              samples processed
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => bulkSetStatus("received")}
                disabled={selectedIds.size === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <CheckCircle2 size={13} /> Accept Selected
              </button>
              <button
                onClick={() => bulkSetStatus("rejected")}
                disabled={selectedIds.size === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <XCircle size={13} /> Reject Selected
              </button>
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {isBulkMode && (
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                      checked={
                        selectedIds.size === samplesToProcess.length &&
                        samplesToProcess.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Sample ID
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Accession ID
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Disease
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Site
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Volume / Reason
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {samplesToProcess.map((sample, idx) => {
                const ss = sampleStates[idx];
                if (!ss) return null;
                const isSelected = selectedIds.has(sample.id);

                return (
                  <tr
                    key={sample.id}
                    className={`transition-colors ${
                      ss.status === "received"
                        ? "bg-green-50/30"
                        : ss.status === "rejected"
                          ? "bg-red-50/20"
                          : isSelected
                            ? "bg-blue-50/20"
                            : "hover:bg-slate-50/60"
                    }`}
                  >
                    {isBulkMode && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                          checked={isSelected}
                          onChange={() => toggleSelection(sample.id)}
                        />
                      </td>
                    )}

                    {/* Sample ID */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-bold text-teal-700">
                        {sample.barcode}
                      </span>
                    </td>

                    {/* Accession ID */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Auto-generated"
                        className="w-[170px] px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 text-sm text-slate-700 bg-slate-50 transition-all italic"
                        value={ss.accessionId}
                        readOnly
                        title="Accession ID is automatically generated upon saving"
                      />
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3 text-sm text-slate-600 font-medium whitespace-nowrap">
                      {sample.sampleType?.name || "—"}
                    </td>

                    {/* Disease */}
                    <td className="px-4 py-3">
                      {sample.diseases?.map((disease) => (
                        <DiseaseBadge
                          key={disease.id}
                          name={disease.shortName || "N/A"}
                        />
                      ))}
                    </td>

                    {/* Site */}
                    <td className="px-4 py-3 text-sm text-slate-500 truncate max-w-[140px]">
                      {sample.site?.name || "—"}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <button
                          onClick={() =>
                            updateSampleState(sample.id, {
                              status:
                                ss.status === "received" ? null : "received",
                              rejectReason: "",
                            })
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            ss.status === "received"
                              ? "bg-green-600 border-green-600 text-white shadow-sm"
                              : "bg-white text-slate-400 border-slate-200 hover:border-green-400 hover:text-green-600"
                          }`}
                        >
                          <CheckCircle2 size={12} strokeWidth={2.5} />
                          {ss.status === "received" ? "Accepted" : "Accept"}
                        </button>
                        <button
                          onClick={() =>
                            updateSampleState(sample.id, {
                              status:
                                ss.status === "rejected" ? null : "rejected",
                              volumeValue: "",
                            })
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            ss.status === "rejected"
                              ? "bg-red-600 border-red-600 text-white shadow-sm"
                              : "bg-white text-slate-400 border-slate-200 hover:border-red-400 hover:text-red-600"
                          }`}
                        >
                          <XCircle size={12} strokeWidth={2.5} />
                          {ss.status === "rejected" ? "Rejected" : "Reject"}
                        </button>
                      </div>
                    </td>

                    {/* Volume / Reason */}
                    <td className="px-4 py-3">
                      {ss.status === "received" && (
                        <div className="flex items-stretch border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/10 transition-all h-[36px] w-fit">
                          <input
                            type="number"
                            placeholder="Volume"
                            className="w-20 px-3 py-1.5 text-sm text-slate-700 outline-none bg-white border-r border-slate-200"
                            value={ss.volumeValue}
                            onChange={(e) =>
                              updateSampleState(sample.id, {
                                volumeValue: e.target.value,
                              })
                            }
                          />
                          <select
                            className="px-2 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                            value={ss.volumeUnit}
                            onChange={(e) =>
                              updateSampleState(sample.id, {
                                volumeUnit: e.target.value,
                              })
                            }
                          >
                            {SAMPLE_UNITS.map((u) => (
                              <option key={u.value} value={u.value}>
                                {u.value}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {ss.status === "rejected" && (
                        <input
                          type="text"
                          name="reject_reason"
                          placeholder="Reason for rejection…"
                          className="w-full min-w-[200px] px-3 py-1.5 border border-red-200 rounded-lg outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/10 bg-red-50/30 text-sm text-slate-700 italic transition-all"
                          value={ss.rejectReason}
                          onChange={(e) =>
                            updateSampleState(sample.id, {
                              rejectReason: e.target.value,
                            })
                          }
                        />
                      )}
                      {!ss.status && (
                        <span className="text-xs text-slate-400 italic">
                          Select a status first
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        {/* Stats pill */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          {acceptedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
              <CheckCircle2 size={12} /> {acceptedCount} Accepted
            </span>
          )}
          {rejectedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
              <XCircle size={12} /> {rejectedCount} Rejected
            </span>
          )}
          {acceptedCount === 0 && rejectedCount === 0 && (
            <span className="text-slate-400">No samples processed yet</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              isBulkMode && onBulkSuccess
                ? onBulkSuccess("exit")
                : router.replace("/lab")
            }
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={() => handleSubmit(true)}
            disabled={submitting || !isFormValid}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting && submitType === "exit" && <Spinner disabled />}
            <Save size={14} /> Save & Exit
          </button>

          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting || !isFormValid}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-600/20"
          >
            {submitting && submitType === "proceed" && <Spinner darkMode />}
            Proceed to Pre-processing <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

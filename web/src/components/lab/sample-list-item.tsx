import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  RefreshCw,
  Barcode,
  MapPin,
  ImageIcon,
  Pencil,
} from "lucide-react";
import { Sample, SampleStatusType } from "@/src/types/sample";
import { formatDate, isValidUrl } from "@/src/utils";
import {
  DISEASE_COLOR_CODE,
  SAMPLE_STATUS_MAPPING,
  SAMPLE_STATUS_TO_LAB_ACTIVITY_DATE_MAP,
  NON_BULK_PROCESSABLE_STATUSES,
  SELECT_ALL_STATUSES,
} from "@/src/utils/constant";
import SampleDetailModal from "@/src/components/lab/sample-modal/sample-detail-modal";
import RetestModal from "@/src/components/lab/sample-modal/retest-modal";
import EditSampleDetailsModal from "@/src/components/lab/sample-modal/edit-sample-details-modal";
import { useHasPermission } from "@/src/hooks/check-permission";
import { useAtom, useAtomValue } from "jotai";
import { selectedProcessableSamplesAtom } from "@/src/store/processableSamplesAtom";
import { labAllProjectsAtom } from "@/src/store/labAllProjectsAtom";
import { userAtom } from "@/src/store/userAtom";

const ImagePlaceholder = () => (
  <div className="w-[64px] h-[64px] rounded-xl bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center shrink-0 border border-slate-200">
    <ImageIcon size={24} className="text-slate-300" strokeWidth={1.5} />
  </div>
);

const EDITABLE_DETAIL_TABS = [
  "picked-up",
  "received",
  "virus-isolation",
  "pre-processed",
  "extracted",
  "tested",
  "test-report-generated",
];

export type SampleTableColumnKey =
  | "sampleId"
  | "accessionId"
  | "siteName"
  | "round"
  | "disease"
  | "location"
  | "farmType"
  | "collectedBy"
  | "lastActivity";

export type SampleTableVisibleColumns = Record<SampleTableColumnKey, boolean>;

const ALL_COLUMNS_VISIBLE: SampleTableVisibleColumns = {
  sampleId: true,
  accessionId: true,
  siteName: true,
  round: true,
  disease: true,
  location: true,
  farmType: true,
  collectedBy: true,
  lastActivity: true,
};

export default function SamplesListItem({
  sample,
  activeTab,
  onSampleUpdated,
  visibleColumns = ALL_COLUMNS_VISIBLE,
}: {
  sample: Sample;
  activeTab?: SampleStatusType;
  onSampleUpdated?: () => void;
  visibleColumns?: SampleTableVisibleColumns;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [sampleId, setSampleId] = useState("");
  const [isRetestOpen, setIsRetestOpen] = useState(false);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [selectedProcessableSamples, setSelectedProcessableSamples] = useAtom(
    selectedProcessableSamplesAtom,
  );
  const hasPermission = useHasPermission();
  // Scoped to this row's own sample.project, not an ambient "current"
  // project - this list is not under /projects/:id, so without this the
  // permission hook would have no route project id to resolve against.
  const canUpdateLabTest = hasPermission(
    "update",
    "sample-test",
    sample.project?.id,
  );
  const isAll = useAtomValue(labAllProjectsAtom);
  const user = useAtomValue(userAtom);

  const anchorSample =
    selectedProcessableSamples.length > 0
      ? selectedProcessableSamples[0]
      : null;

  const isAlreadySelected = selectedProcessableSamples.some(
    (s) => s.id === sample.id,
  );

  const isSelectAllTab = SELECT_ALL_STATUSES.includes(activeTab || "");

  const isCheckboxDisabled =
    !isSelectAllTab &&
    anchorSample !== null &&
    !isAlreadySelected &&
    (anchorSample.sampleType?.id !== sample.sampleType?.id ||
      anchorSample.visit?.id !== sample.visit?.id);

  const isActionDisabled = selectedProcessableSamples.length > 0;
  const showCheckbox =
    canUpdateLabTest &&
    !isAll &&
    !NON_BULK_PROCESSABLE_STATUSES.includes(activeTab || "");

  const handleToggleSelection = () => {
    if (isCheckboxDisabled) return;
    if (isAlreadySelected) {
      setSelectedProcessableSamples(
        selectedProcessableSamples.filter((s) => s.id !== sample.id),
      );
    } else {
      setSelectedProcessableSamples([...selectedProcessableSamples, sample]);
    }
  };

  const showRetest =
    activeTab === "test-report-generated" && canUpdateLabTest && !isAll;
  const canEditSampleDetails =
    EDITABLE_DETAIL_TABS.includes(activeTab || "") &&
    !isAll &&
    user?.roles?.some((userRole) =>
      ["project-viewer", "lab-admin", "super-admin"].includes(
        userRole.role?.name,
      ),
    );

  const handleOpenModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen(true);
    setSampleId(sample?.id ?? "");
  };

  const handleRowClick = () => {
    if (showCheckbox && !isCheckboxDisabled) {
      handleToggleSelection();
    } else if (!showCheckbox) {
      setIsOpen(true);
      setSampleId(sample?.id ?? "");
    }
  };

  const statusLabel =
    SAMPLE_STATUS_MAPPING[
      sample.sampleStatus as keyof typeof SAMPLE_STATUS_MAPPING
    ] ?? sample.sampleStatus;

  const activityDate = sample?.sampleStatus
    ? formatDate(
        new Date(
          sample[
            SAMPLE_STATUS_TO_LAB_ACTIVITY_DATE_MAP[sample.sampleStatus ?? ""]
          ] as string,
        ),
      )
    : "";

  return (
    <>
      <tr
        className={`group border-b border-slate-100 transition-all duration-150 ${
          isAlreadySelected
            ? "bg-slate-50"
            : isCheckboxDisabled
              ? "bg-white opacity-50 cursor-default"
              : "bg-white hover:bg-slate-50/60 cursor-pointer"
        }`}
        onClick={handleRowClick}
      >
        {/* Checkbox */}
        <td className="w-10 py-4 pl-5 pr-3 sm:pl-6">
          {showCheckbox && (
            <div
              className="flex justify-center items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                className={`w-[18px] h-[18px] rounded border-2 text-blue-40 focus:ring-blue-40 focus:ring-offset-0 transition-all ${
                  isCheckboxDisabled
                    ? "cursor-not-allowed border-slate-200 opacity-50"
                    : "cursor-pointer border-slate-300 hover:border-blue-40"
                }`}
                checked={isAlreadySelected}
                onChange={handleToggleSelection}
                disabled={isCheckboxDisabled}
                title={
                  isCheckboxDisabled
                    ? "Only samples of the same type and visit can be selected together"
                    : undefined
                }
              />
            </div>
          )}
        </td>

        {/* Sample Info */}
        {visibleColumns.sampleId && (
          <td className="py-3 pr-6">
            <div className="flex items-center gap-4">
              {sample.photos?.length && isValidUrl(sample.photos[0]) ? (
                <div className="relative w-[64px] h-[64px] shrink-0">
                  {isLoading && <ImagePlaceholder />}
                  <Image
                    className={`w-[64px] h-[64px] rounded-xl object-cover border border-slate-200 ${
                      isLoading ? "opacity-0 absolute inset-0" : ""
                    }`}
                    src={sample.photos[0]}
                    width={64}
                    height={64}
                    alt="sample photo"
                    onLoad={() => setIsLoading(false)}
                  />
                </div>
              ) : (
                <ImagePlaceholder />
              )}
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <div className="flex items-center gap-1 min-w-0">
                    <Barcode
                      size={13}
                      className="text-slate-400 shrink-0"
                      strokeWidth={1.5}
                    />
                    <span className="text-slate-400 text-xs font-mono tracking-wide truncate">
                      {sample.barcode ?? "—"}
                    </span>
                  </div>
                  {sample.preprocessingSteps?.find((s) => s.type === "pooling")
                    ?.pooledId && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200 uppercase tracking-tight shrink-0">
                      Pooled ID:{" "}
                      {
                        sample.preprocessingSteps.find(
                          (s) => s.type === "pooling",
                        )?.pooledId
                      }
                    </span>
                  )}
                </div>
                <p className="text-slate-800 text-[15px] font-semibold leading-tight capitalize">
                  {sample.sampleType?.name}
                </p>
              </div>
            </div>
          </td>
        )}

        {/* Accession ID */}
        {visibleColumns.accessionId && (
          <td className="py-3 pr-4">
            <p
              className="text-slate-600 text-sm font-mono tracking-wide truncate"
              title={sample.accessionId ?? undefined}
            >
              {sample.accessionId ?? "—"}
            </p>
          </td>
        )}

        {/* Site Name */}
        {visibleColumns.siteName && (
          <td className="py-3 pr-4">
            <p
              className="text-slate-600 text-sm capitalize truncate max-w-[150px]"
              title={sample.site?.name}
            >
              {sample.site?.name ?? "—"}
            </p>
          </td>
        )}

        {/* Round */}
        {visibleColumns.round && (
          <td className="py-3 pr-4">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-blue-10/50 text-blue-40 text-xs font-bold rounded-lg uppercase tracking-wide border border-blue-40/10 shadow-[0_1px_2px_rgba(40,77,182,0.05)]">
              {sample.visit?.round ? `Round ${sample.visit.round}` : "—"}
            </span>
          </td>
        )}

        {/* Disease */}
        {visibleColumns.disease && (
          <td className="py-3 pr-4">
            <div className="flex flex-wrap gap-1.5">
              {sample.diseases?.length ? (
                sample.diseases.map((disease, i) => (
                  <span
                    key={disease.id}
                    className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide text-slate-700 ${
                      DISEASE_COLOR_CODE.BG_COLOR[(disease.index ?? i) % 6]
                    }`}
                  >
                    {disease.shortName}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-sm">—</span>
              )}
            </div>
          </td>
        )}

        {/* Location */}
        {visibleColumns.location && (
          <td className="py-3 pr-4">
            <div className="flex items-center gap-1.5">
              <MapPin
                size={14}
                className="text-slate-400 shrink-0"
                strokeWidth={1.5}
              />
              <p className="text-slate-600 text-sm capitalize truncate">
                {sample.site?.location?.region?.name ?? "—"}
              </p>
            </div>
          </td>
        )}

        {/* Farm Type */}
        {visibleColumns.farmType && (
          <td className="py-3 pr-4">
            <p className="text-slate-600 text-sm capitalize">
              {sample.site?.farmType ?? "—"}
            </p>
          </td>
        )}

        {/* Collected By */}
        {activeTab === "picked-up" && visibleColumns.collectedBy && (
          <td className="py-3 pr-4">
            <p className="text-slate-600 text-sm capitalize whitespace-nowrap">
              {sample.collectedBy
                ? `${sample.collectedBy.firstName} ${sample.collectedBy.lastName}`
                : "—"}
            </p>
          </td>
        )}

        {/* Last Activity */}
        {visibleColumns.lastActivity && (
          <td className="py-3 pr-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                {statusLabel} on
              </span>
              <span className="text-slate-700 text-sm font-medium whitespace-nowrap">
                {activityDate}
              </span>
            </div>
          </td>
        )}

        {/* Actions */}
        <td className="py-3 pr-4 sm:pr-6">
          <div className="flex flex-col gap-1.5 items-stretch">
            <div className="flex items-center gap-2">
              {/* View — always visible */}
              <button
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:border-blue-30 hover:text-blue-40 hover:bg-blue-10/40 transition-all duration-150 shadow-sm group-hover:border-slate-300 whitespace-nowrap"
                onClick={handleOpenModal}
                title="View sample details"
              >
                <Eye size={14} strokeWidth={2} />
                <span>View</span>
              </button>

              {/* Retest */}
              {showRetest && (
                <button
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-40 text-white text-xs font-semibold hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRetestOpen(true);
                  }}
                >
                  <RefreshCw size={12} strokeWidth={2.5} />
                  Retest
                </button>
              )}

              {/* Process / Accession */}
              {!isAll &&
                canUpdateLabTest &&
                sample?.sampleStatus &&
                !["rejected", "test-report-generated"].includes(
                  sample?.sampleStatus,
                ) &&
                (isActionDisabled ? (
                  <span
                    className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 rounded-lg text-slate-300 text-xs font-semibold uppercase tracking-wide cursor-not-allowed whitespace-nowrap"
                    title="Deselect all samples to use this action"
                  >
                    {sample?.sampleStatus === "picked-up"
                      ? "Accession"
                      : "Process"}
                  </span>
                ) : (
                  <Link
                    href={`/lab/${sample.id}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-blue-30 rounded-lg text-blue-40 text-xs font-semibold uppercase tracking-wide hover:bg-blue-10 transition-colors whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {sample?.sampleStatus === "picked-up"
                      ? "Accession"
                      : "Process"}
                  </Link>
                ))}
            </div>

            {canEditSampleDetails && (
              <button
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors whitespace-nowrap"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditDetailsOpen(true);
                }}
                title="Edit collected sample details"
              >
                <Pencil size={12} strokeWidth={2.5} />
                Edit Details
              </button>
            )}
          </div>
        </td>
      </tr>

      <SampleDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        sampleId={sampleId}
        hideProcessButton={isActionDisabled}
      />
      {showRetest && (
        <RetestModal
          isOpen={isRetestOpen}
          onClose={() => setIsRetestOpen(false)}
          sample={sample}
        />
      )}
      {canEditSampleDetails && (
        <EditSampleDetailsModal
          isOpen={isEditDetailsOpen}
          onClose={() => setIsEditDetailsOpen(false)}
          sample={sample}
          activeTab={activeTab}
          onSuccess={onSampleUpdated}
        />
      )}
    </>
  );
}

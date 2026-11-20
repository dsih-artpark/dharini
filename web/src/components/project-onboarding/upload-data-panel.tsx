import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, FileSpreadsheet, X } from "lucide-react";

import SectionToggle from "@/src/components/project-onboarding/upload-data/section-toggle";
import ImportFilePreview from "@/src/components/project-onboarding/upload-data/import-file-preview";
import ImportErrorSummary from "@/src/components/project-onboarding/upload-data/import-error-summary";
import {
  DISEASE_GROUPS,
  SECTION_LABELS,
} from "@/src/components/project-onboarding/upload-data/import-options";
import { formatFileSize } from "@/src/components/sequencing/submission-file-picker";
import {
  downloadDataImportTemplate,
  uploadDataImportFile,
  DiseaseGroup,
  ImportSection,
  ImportResult,
} from "@/src/app/(dashboard)/project-onboarding/actions";
import { getProjectDetailApi } from "@/src/app/(dashboard)/projects/[id]/loader";

type UploadDataPanelProps = {
  projectId: string;
  // Called right after a successful import, before the user clicks Done.
  onUploadSuccess?: (result: ImportResult) => void;
  // Called when the user clicks Done on the success card. When omitted the
  // panel simply resets so another file can be uploaded.
  onDone?: (result: ImportResult) => void;
  // Lets a container lock controls that would change `projectId` mid-upload.
  onUploadingChange?: (uploading: boolean) => void;
};

export default function UploadDataPanel({
  projectId,
  onUploadSuccess,
  onDone,
  onUploadingChange,
}: UploadDataPanelProps) {
  const [section, setSection] = useState<ImportSection>("collection");
  const [diseaseGroup, setDiseaseGroup] = useState<DiseaseGroup>("FMD_LSD");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  // The file that produced `result`, kept so the success card can name it
  // after the picker has been cleared.
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // The short names of the diseases the project is set up for. Null while
  // loading, or when they couldn't be loaded: every group is offered then,
  // and the backend refuses one the project doesn't have.
  const [projectDiseases, setProjectDiseases] = useState<string[] | null>(
    null
  );
  const [loadingDiseases, setLoadingDiseases] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    let isCurrent = true;
    setProjectDiseases(null);
    setLoadingDiseases(true);
    getProjectDetailApi(projectId)
      .then(({ data }) => {
        if (isCurrent) {
          setProjectDiseases(
            (data.diseases ?? []).map((disease) => disease.shortName)
          );
        }
      })
      .catch(() => {
        if (isCurrent) setProjectDiseases(null);
      })
      .finally(() => {
        if (isCurrent) setLoadingDiseases(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [projectId]);

  const diseaseGroups = useMemo(
    () =>
      projectDiseases
        ? DISEASE_GROUPS.filter((group) =>
            group.diseases.some((disease) => projectDiseases.includes(disease))
          )
        : DISEASE_GROUPS,
    [projectDiseases]
  );
  const noDiseases = diseaseGroups.length === 0;

  // Keep the chosen group one the project has; with a single group, that one.
  useEffect(() => {
    if (
      diseaseGroups.length > 0 &&
      !diseaseGroups.some((group) => group.id === diseaseGroup)
    ) {
      setDiseaseGroup(diseaseGroups[0].id);
      setResult(null);
      setUploadedFile(null);
    }
  }, [diseaseGroups, diseaseGroup]);

  const updateUploading = (value: boolean) => {
    setUploading(value);
    onUploadingChange?.(value);
  };

  const handleDownloadTemplate = async () => {
    if (!projectId) return;
    setDownloading(true);
    try {
      const blob = await downloadDataImportTemplate(
        projectId,
        diseaseGroup,
        section
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${diseaseGroup.toLowerCase()}-${section}-template.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download template. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    // Reset so picking the same filename again still fires onChange.
    e.target.value = "";
    if (!picked) return;

    if (!picked.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("Only .xlsx files generated from the template are accepted");
      return;
    }

    setFile(picked);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file || !projectId || uploading) return;

    updateUploading(true);
    setResult(null);
    try {
      const { data } = await uploadDataImportFile(
        projectId,
        section,
        diseaseGroup,
        file
      );
      setResult(data);
      if (data.success) {
        setUploadedFile(file);
        setFile(null);
        onUploadSuccess?.(data);
      } else {
        toast.error("Upload rejected — see errors below");
      }
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to upload file");
    } finally {
      updateUploading(false);
    }
  };

  const handleDone = () => {
    const finished = result;
    setResult(null);
    setUploadedFile(null);
    setFile(null);
    if (finished) onDone?.(finished);
  };

  const isSuccess = !!result?.success && !!uploadedFile;

  return (
    <div className="self-stretch px-6 flex-col justify-start items-start gap-6 inline-flex">
      <SectionToggle
        ariaLabel="Data type"
        options={[
          { id: "collection", label: "Collection Data" },
          { id: "lab", label: "Lab Data" },
        ]}
        selected={section}
        onSelect={(id) => {
          setSection(id as ImportSection);
          setResult(null);
          setUploadedFile(null);
        }}
      />

      {section === "lab" && (
        <p className="text-grey-70 text-sm -mt-2">
          Lab data can only be imported for samples that already have
          collection data uploaded (in this session or previously). Each
          sample can have one imported result per disease; to record another
          result, use Retest on the Lab page.
        </p>
      )}

      <div className="self-stretch flex-col justify-start items-start gap-2 flex">
        <label className="text-grey-80 text-sm font-semibold">
          Disease
        </label>
        {noDiseases ? (
          <p className="text-red-600 text-sm">
            No diseases are configured for this project, so no data can be
            uploaded to it.
          </p>
        ) : (
          <select
            className="self-stretch px-3 py-2 bg-blue-10 rounded border border-grey-40 text-grey-80 disabled:opacity-60"
            value={diseaseGroup}
            disabled={uploading || loadingDiseases}
            onChange={(e) => {
              setDiseaseGroup(e.target.value as DiseaseGroup);
              setResult(null);
              setUploadedFile(null);
            }}
          >
            {diseaseGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {isSuccess && result && uploadedFile ? (
        <div
          role="status"
          className="self-stretch flex flex-col gap-4 rounded-lg border border-success-200 bg-success-50 p-4"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="h-6 w-6 shrink-0 text-success-600"
              aria-hidden="true"
            />
            <div className="min-w-0 flex flex-col gap-1">
              <p className="text-success-600 text-base font-semibold">
                Upload successful
              </p>
              <p className="text-grey-80 text-sm">
                {result.importedCount} row{result.importedCount === 1 ? "" : "s"}{" "}
                of {SECTION_LABELS[section].toLowerCase()} imported from{" "}
                <span className="font-semibold break-all">
                  {uploadedFile.name}
                </span>
                .
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-grey-20 bg-white px-3 py-2.5">
            <div className="min-w-0 flex items-center gap-2">
              <FileSpreadsheet
                className="h-4 w-4 shrink-0 text-success-600"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-grey-90 text-sm truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-grey-70 text-xs">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1 text-success-600 text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Uploaded
            </span>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="p-3 bg-blue-40 rounded-lg text-white text-base leading-normal"
              onClick={handleDone}
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <>
          {file && (
            <div
              className={`self-stretch flex flex-col overflow-hidden rounded-lg border bg-white ${result && !result.success ? "border-red-200" : "border-grey-20"
                }`}
            >
              <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                <div className="min-w-0 flex items-center gap-2">
                  <FileSpreadsheet
                    className="h-4 w-4 shrink-0 text-blue-40"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-grey-90 text-sm truncate">{file.name}</p>
                    <p className="text-grey-70 text-xs">
                      {formatFileSize(file.size)}
                      {uploading ? " · Uploading..." : ""}
                    </p>
                  </div>
                </div>
                {!uploading && (
                  <button
                    type="button"
                    className="w-6 h-6 flex items-center justify-center shrink-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => {
                      setFile(null);
                      setResult(null);
                    }}
                  >
                    <X className="h-4 w-4 text-grey-70" />
                  </button>
                )}
              </div>
              <ImportFilePreview
                file={file}
                errors={result && !result.success ? result.errors : undefined}
              />
            </div>
          )}

          <div className="self-stretch flex flex-wrap justify-between items-center gap-3">
            <button
              type="button"
              className="p-3 bg-white rounded-lg border border-blue-40 text-blue-40 text-base leading-normal disabled:opacity-50"
              onClick={handleDownloadTemplate}
              disabled={downloading || loadingDiseases || noDiseases}
            >
              {downloading ? "Downloading..." : "Download template (.xlsx)"}
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <label
                className={`p-3 rounded-lg text-base leading-normal cursor-pointer ${file
                    ? "bg-white border border-blue-40 text-blue-40"
                    : "bg-blue-40 text-white"
                  } ${uploading || loadingDiseases || noDiseases ? "opacity-50 pointer-events-none" : ""}`}
              >
                {file ? "Choose another file" : "Upload File"}
                <input
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading || loadingDiseases || noDiseases}
                />
              </label>

              {file && (
                <button
                  type="button"
                  className="p-3 bg-blue-40 rounded-lg text-white text-base leading-normal disabled:opacity-50"
                  onClick={handleUpload}
                  disabled={uploading || loadingDiseases || noDiseases}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              )}
            </div>
          </div>

          {result && !result.success && (
            <ImportErrorSummary
              errors={result.errors}
              selected={{ diseaseGroup, section }}
              availableDiseaseGroups={diseaseGroups.map((group) => group.id)}
              onSwitchTemplate={(template) => {
                // The file stays selected, so Upload sends it again as the
                // template it was detected to be.
                setSection(template.section);
                setDiseaseGroup(template.diseaseGroup);
                setResult(null);
                setUploadedFile(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

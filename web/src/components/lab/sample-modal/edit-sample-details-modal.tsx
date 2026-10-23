import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useAtomValue } from "jotai";

import { updateSampleStageDetailsApi } from "@/src/app/(dashboard)/lab/[sampleId]/actions";
import {
  getLabTestApi,
  getSampleApi,
  getTeamMembersApi,
} from "@/src/app/(dashboard)/lab/[sampleId]/loader";
import CustomModal from "@/src/components/ui/custom-modal";
import Loader from "@/src/components/ui/loader";
import Spinner from "@/src/components/ui/spinner";
import { ALL_PROJECTS_ID } from "@/src/lib/super-admin-lab-flow";
import { labAllProjectsAtom } from "@/src/store/labAllProjectsAtom";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import { User } from "@/src/types/global";
import { LabTest, Sample, SampleStatusType } from "@/src/types/sample";
import {
  EXTRACTION_METHODS,
  NUCLEIC_ACID_TYPES,
  SAMPLE_UNITS,
  STORAGE_TEMPERATURES,
} from "@/src/utils/constant";

type EditSampleDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sample: Sample;
  activeTab?: SampleStatusType;
  onSuccess?: () => void;
};

type FormState = Record<string, string>;

const toDateTimeLocal = (value?: string | Date | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  );
  return offsetDate.toISOString().slice(0, 16);
};

const fromDateTimeLocal = (value?: string) =>
  value ? new Date(value).toISOString() : undefined;

const fieldClass =
  "h-10 px-3 rounded-lg border border-grey-40 bg-white text-grey-80 text-sm outline-none focus:border-blue-40 focus:ring-2 focus:ring-blue-40/10 disabled:bg-grey-10 disabled:text-grey-50";
const areaClass =
  "min-h-20 px-3 py-2 rounded-lg border border-grey-40 bg-white text-grey-80 text-sm outline-none resize-y focus:border-blue-40 focus:ring-2 focus:ring-blue-40/10";

const userLabel = (member: User) =>
  `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim();

const stageTitle: Record<string, string> = {
  "picked-up": "Edit Collection Details",
  received: "Edit Receiving Details",
  "virus-isolation": "Edit Virus Isolation Details",
  "pre-processed": "Edit Pre-processing Details",
  extracted: "Edit Extraction Details",
  tested: "Edit Testing Details",
  "test-report-generated": "Edit Testing Details",
};

const withCurrentOption = (
  options: { value: string; label: string }[],
  value?: string,
) => {
  if (!value || options.some((option) => option.value === value)) {
    return options;
  }

  return [{ value, label: value }, ...options];
};

export default function EditSampleDetailsModal({
  isOpen,
  onClose,
  sample,
  activeTab,
  onSuccess,
}: EditSampleDetailsModalProps) {
  const isAll = useAtomValue(labAllProjectsAtom);
  const { resolveProjectId } = useCurrentProjectResolver();
  // 4.4: workspace-admins have no user.project, so fall back to the current
  // workspace's first project.
  const projectId = isAll ? ALL_PROJECTS_ID : resolveProjectId();
  const stage = activeTab || sample.sampleStatus || "picked-up";
  const [form, setForm] = useState<FormState>({});
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [fullSample, setFullSample] = useState<Sample>(sample);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const memberOptions = useMemo(() => {
    const options = teamMembers.map((member) => ({
      label: userLabel(member),
      value: member.id,
    }));
    const users = [
      fullSample.collectedBy,
      fullSample.receivedBy,
      fullSample.preprocessingPerformedBy,
      fullSample.extractedBy,
      fullSample.testedBy,
      fullSample.reportGeneratedBy,
      ...(fullSample.labTests?.map((labTest) => labTest.testedBy) ?? []),
    ].filter(Boolean) as User[];

    users.forEach((existingUser) => {
      if (!options.some((option) => option.value === existingUser.id)) {
        options.unshift({
          label: userLabel(existingUser) || "Current user",
          value: existingUser.id,
        });
      }
    });

    return options;
  }, [fullSample, teamMembers]);

  useEffect(() => {
    const load = async () => {
      if (!isOpen || !projectId) return;
      setLoading(true);
      try {
        const [sampleResponse, labTestResponse] = await Promise.all([
          getSampleApi(projectId, sample.id),
          getLabTestApi(projectId, sample.id).catch(() => ({ data: [] })),
        ]);
        const nextSample = {
          ...sampleResponse.data,
          labTests: labTestResponse.data || [],
        } as Sample;
        setFullSample(nextSample);

        if (nextSample.team?.id) {
          getTeamMembersApi(projectId, nextSample.team.id)
            .then((response) => setTeamMembers(response.data || []))
            .catch(() => toast.error("Error fetching team members"));
        }

        setForm(buildInitialForm(nextSample, stage));
      } catch (error) {
        toast.error((error as Error)?.message || "Failed to load sample.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isOpen, projectId, sample.id, stage]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const setLabTestField = (id: string, field: string, value: string) => {
    setForm((prev) => ({ ...prev, [`labTest.${id}.${field}`]: value }));
  };

  const handleSubmit = async () => {
    if (!projectId) {
      toast.error("Missing project context.");
      return;
    }
    if (stage === "picked-up" && !form.barcode?.trim()) {
      toast.error("Sample ID is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload(stage, form, fullSample);
      await updateSampleStageDetailsApi(projectId, sample.id, stage, payload);
      toast.success("Sample details updated successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        (error as Error)?.message || "Failed to update sample details.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen}>
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-grey-20 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-noto-serif text-grey-90 text-xl font-semibold">
              {stageTitle[stage] || "Edit Sample Details"}
            </h3>
            <p className="text-grey-60 text-sm mt-1">
              {fullSample.sampleType?.name ?? "Sample"} -{" "}
              {fullSample.site?.name ?? "-"}
            </p>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-lg text-grey-60 hover:text-grey-90 hover:bg-grey-10 transition-colors"
            onClick={onClose}
            disabled={saving}
            aria-label="Close edit sample details modal"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="p-10 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderFields({
              stage,
              form,
              fullSample,
              memberOptions,
              handleChange,
              setLabTestField,
            })}
          </div>
        )}

        <div className="px-6 py-4 border-t border-grey-20 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-lg border border-grey-30 bg-white text-grey-70 text-sm font-semibold hover:bg-grey-10 disabled:opacity-60"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2.5 rounded-lg bg-blue-40 text-white text-sm font-semibold hover:bg-blue-50 disabled:bg-grey-30 disabled:cursor-not-allowed inline-flex items-center gap-2"
            onClick={handleSubmit}
            disabled={saving || loading}
          >
            {saving && <Spinner darkMode />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
}

function buildInitialForm(sample: Sample, stage: string): FormState {
  const vi = sample.details?.virusIsolation || {};
  const preprocessing = sample.details?.preprocessing || {};
  const extraction = sample.details?.extraction || {};
  const firstStep =
    sample.preprocessingSteps?.[sample.preprocessingSteps.length - 1];
  const form: FormState = {
    barcode: sample.barcode || "",
    collectedBy: sample.collectedBy?.id || "",
    collectionTime: toDateTimeLocal(sample.collectionTime),
    receivedAt: toDateTimeLocal(sample.receivedAt),
    receivedBy: sample.receivedBy?.id || "",
    receivedVolumeValue: sample.receivedVolumeValue || "",
    receivedVolumeUnit: sample.receivedVolumeUnit || "",
    receivedStorageTemperature: sample.receivedStorageTemperature || "",
    receivedLabStorageDetails: sample.receivedLabStorageDetails || "",
    referenceBatchId: sample.referenceBatchId || "",
    batchReferenceDocument: sample.batchReferenceDocument || "",
    accessionId: sample.accessionId || "",
    haTest: vi.haTest || "",
    inoculationDate: vi.inoculationDate || "",
    harvestingDate: vi.harvestingDate || "",
    haTitre: vi.haTitre || "",
    hiTitre: vi.hiTitre || "",
    hValue: vi.hValue || "",
    nValue: vi.nValue || "",
    ndvPresent: vi.ndvPresent || "",
    allantoicStorage: vi.allantoicStorage || "",
    viVolume: vi.volume || "",
    viUnit: vi.unit || "",
    preprocessingDate: toDateTimeLocal(sample.preprocessingDate),
    preprocessingPerformedBy: sample.preprocessingPerformedBy?.id || "",
    preprocessingMethod: firstStep?.method || "",
    preprocessingInputVolume: firstStep?.inputVolume || "",
    preprocessingInputVolumeUnit: firstStep?.inputVolumeUnit || "",
    preprocessingOutputVolume: firstStep?.outputVolume || "",
    preprocessingOutputVolumeUnit: firstStep?.outputVolumeUnit || "",
    preprocessingRemarks: firstStep?.remarks || "",
    preprocessingComment: preprocessing.comment || "",
    extractionDateTime: toDateTimeLocal(sample.extractionDateTime),
    extractedBy: sample.extractedBy?.id || "",
    extractionSampleUsedValue: sample.extractionSampleUsedValue || "",
    extractionSampleUsedUnit: sample.extractionSampleUsedUnit || "",
    extractionSampleRemainingValue: sample.extractionSampleRemainingValue || "",
    extractionSampleRemainingUnit: sample.extractionSampleRemainingUnit || "",
    extractionComments: sample.extractionComments || "",
    extractionNucleicAcidType: extraction.nucleicAcidType || "",
    extractionMethod: extraction.method || "",
    extractionStorageTemperature: extraction.storageTemperature || "",
    extractionStorageDetails: extraction.storageDetails || "",
    extractionElutionVolume: extraction.elutionVolume || "",
    extractionConcentration: extraction.concentration || "",
    extractionPcrVolume: extraction.pcrVolume || "",
    extractionPcrVolumeUnit: extraction.pcrVolumeUnit || "",
    extractionRatio260_280: extraction.ratio260_280 || "",
    extractionRatio260_230: extraction.ratio260_230 || "",
    testedAt: toDateTimeLocal(sample.testedAt),
    testedBy: sample.testedBy?.id || "",
    reportGeneratedAt: toDateTimeLocal(sample.reportGeneratedAt),
    reportGeneratedBy: sample.reportGeneratedBy?.id || "",
  };

  if (stage === "test-report-generated" || stage === "tested") {
    sample.labTests?.forEach((labTest) => {
      form[`labTest.${labTest.id}.kitOrProtocol`] = labTest.kitOrProtocol || "";
      form[`labTest.${labTest.id}.testResult`] = labTest.testResult || "";
      form[`labTest.${labTest.id}.ctValue`] = labTest.ctValue || "";
      form[`labTest.${labTest.id}.variant`] = labTest.variant || "";
      form[`labTest.${labTest.id}.viralLoad`] = labTest.viralLoad || "";
      form[`labTest.${labTest.id}.testedAt`] = toDateTimeLocal(
        labTest.testedAt,
      );
      form[`labTest.${labTest.id}.resultDate`] = toDateTimeLocal(
        labTest.resultDate,
      );
      form[`labTest.${labTest.id}.testedBy`] = labTest.testedBy?.id || "";
      form[`labTest.${labTest.id}.resultComment`] = labTest.resultComment || "";
      form[`labTest.${labTest.id}.labComment`] = labTest.labComment || "";
    });
  }

  return form;
}

function buildPayload(stage: string, form: FormState, sample: Sample) {
  switch (stage) {
    case "picked-up":
      return {
        barcode: form.barcode?.trim(),
        collectedBy: form.collectedBy || undefined,
        collectionTime: fromDateTimeLocal(form.collectionTime),
      };
    case "received":
      return {
        receivedAt: fromDateTimeLocal(form.receivedAt),
        receivedBy: form.receivedBy || undefined,
        receivedVolumeValue: form.receivedVolumeValue,
        receivedVolumeUnit: form.receivedVolumeUnit,
        receivedStorageTemperature: form.receivedStorageTemperature,
        receivedLabStorageDetails: form.receivedLabStorageDetails,
        referenceBatchId: form.referenceBatchId,
        batchReferenceDocument: form.batchReferenceDocument,
        accessionId: form.accessionId,
        details: {
          receiving: {
            receivedAt: fromDateTimeLocal(form.receivedAt),
            storageTemperature: form.receivedStorageTemperature,
            storageDetails: form.receivedLabStorageDetails,
            referenceBatchId: form.referenceBatchId,
            batchReferenceDocument: form.batchReferenceDocument,
            accessionId: form.accessionId,
          },
        },
      };
    case "virus-isolation":
      return {
        details: {
          virusIsolation: {
            haTest: form.haTest,
            inoculationDate: form.inoculationDate,
            harvestingDate: form.harvestingDate,
            haTitre: form.haTitre,
            hiTitre: form.hiTitre,
            hValue: form.hValue,
            nValue: form.nValue,
            ndvPresent: form.ndvPresent,
            allantoicStorage: form.allantoicStorage,
            volume: form.viVolume,
            unit: form.viUnit,
          },
        },
      };
    case "pre-processed": {
      const existingSteps = sample.preprocessingSteps || [];
      const currentStep = existingSteps[existingSteps.length - 1] || {};
      const nextStep = {
        ...currentStep,
        method: form.preprocessingMethod,
        inputVolume: form.preprocessingInputVolume,
        inputVolumeUnit: form.preprocessingInputVolumeUnit,
        outputVolume: form.preprocessingOutputVolume,
        outputVolumeUnit: form.preprocessingOutputVolumeUnit,
        remarks: form.preprocessingRemarks || undefined,
        timestamp: fromDateTimeLocal(form.preprocessingDate),
      };
      return {
        preprocessingDate: fromDateTimeLocal(form.preprocessingDate),
        preprocessingPerformedBy: form.preprocessingPerformedBy || undefined,
        preprocessingSteps: existingSteps.length
          ? [...existingSteps.slice(0, -1), nextStep]
          : [nextStep],
        details: {
          preprocessing: {
            comment: form.preprocessingComment,
          },
        },
      };
    }
    case "extracted":
      return {
        extractionDateTime: fromDateTimeLocal(form.extractionDateTime),
        extractedBy: form.extractedBy || undefined,
        extractionSampleUsedValue: form.extractionSampleUsedValue,
        extractionSampleUsedUnit: form.extractionSampleUsedUnit,
        extractionSampleRemainingValue: form.extractionSampleRemainingValue,
        extractionSampleRemainingUnit: form.extractionSampleRemainingUnit,
        extractionComments: form.extractionComments,
        details: {
          extraction: {
            nucleicAcidType: form.extractionNucleicAcidType,
            method: form.extractionMethod,
            storageTemperature: form.extractionStorageTemperature,
            storageDetails: form.extractionStorageDetails,
            elutionVolume: form.extractionElutionVolume,
            concentration: form.extractionConcentration,
            pcrVolume: form.extractionPcrVolume,
            pcrVolumeUnit: form.extractionPcrVolumeUnit,
            ratio260_280: form.extractionRatio260_280,
            ratio260_230: form.extractionRatio260_230,
          },
        },
      };
    case "tested":
    case "test-report-generated":
      return {
        testedAt: fromDateTimeLocal(form.testedAt),
        testedBy: form.testedBy || undefined,
        reportGeneratedAt: fromDateTimeLocal(form.reportGeneratedAt),
        reportGeneratedBy: form.reportGeneratedBy || undefined,
        labTests:
          sample.labTests?.map((labTest) => ({
            id: labTest.id,
            kitOrProtocol: form[`labTest.${labTest.id}.kitOrProtocol`],
            testResult: form[`labTest.${labTest.id}.testResult`],
            ctValue: form[`labTest.${labTest.id}.ctValue`],
            variant: form[`labTest.${labTest.id}.variant`],
            viralLoad: form[`labTest.${labTest.id}.viralLoad`],
            testedAt: fromDateTimeLocal(form[`labTest.${labTest.id}.testedAt`]),
            resultDate: fromDateTimeLocal(
              form[`labTest.${labTest.id}.resultDate`],
            ),
            testedBy: form[`labTest.${labTest.id}.testedBy`] || undefined,
            resultComment: form[`labTest.${labTest.id}.resultComment`],
            labComment: form[`labTest.${labTest.id}.labComment`],
          })) || [],
      };
    default:
      return {};
  }
}

function renderFields({
  stage,
  form,
  fullSample,
  memberOptions,
  handleChange,
  setLabTestField,
}: {
  stage: string;
  form: FormState;
  fullSample: Sample;
  memberOptions: { label: string; value: string }[];
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  setLabTestField: (id: string, field: string, value: string) => void;
}) {
  const userSelect = (name: string, label: string) => (
    <Field label={label}>
      <select
        name={name}
        value={form[name] || ""}
        onChange={handleChange}
        className={fieldClass}
      >
        <option value="">Select user</option>
        {memberOptions.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );

  if (stage === "picked-up") {
    return (
      <>
        <TextField
          name="barcode"
          label="Sample ID"
          form={form}
          onChange={handleChange}
        />
        {userSelect("collectedBy", "Collected By")}
        <TextField
          type="datetime-local"
          name="collectionTime"
          label="Collection Date"
          form={form}
          onChange={handleChange}
        />
      </>
    );
  }

  if (stage === "received") {
    return (
      <>
        <TextField
          type="datetime-local"
          name="receivedAt"
          label="Received Date"
          form={form}
          onChange={handleChange}
        />
        {userSelect("receivedBy", "Received By")}
        <TextField
          name="receivedVolumeValue"
          label="Received Volume"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="receivedVolumeUnit"
          label="Volume Unit"
          form={form}
          onChange={handleChange}
        />
        <Field label="Storage Temperature">
          <select
            name="receivedStorageTemperature"
            value={form.receivedStorageTemperature || ""}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="">Select temperature</option>
            {STORAGE_TEMPERATURES.map((temperature) => (
              <option key={temperature.value} value={temperature.value}>
                {temperature.label}
              </option>
            ))}
          </select>
        </Field>
        <TextField
          name="receivedLabStorageDetails"
          label="Storage Details"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="referenceBatchId"
          label="Batch Reference ID"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="batchReferenceDocument"
          label="Batch Reference Document"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="accessionId"
          label="Accession ID"
          form={form}
          onChange={handleChange}
        />
      </>
    );
  }

  if (stage === "virus-isolation") {
    return (
      <>
        <TextField
          name="haTest"
          label="HA Test"
          form={form}
          onChange={handleChange}
        />
        <TextField
          type="date"
          name="inoculationDate"
          label="Inoculation Date"
          form={form}
          onChange={handleChange}
        />
        <TextField
          type="date"
          name="harvestingDate"
          label="Harvesting Date"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="haTitre"
          label="HA Titre"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="hiTitre"
          label="HI Titre"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="hValue"
          label="H Value"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="nValue"
          label="N Value"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="ndvPresent"
          label="NDV Present"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="allantoicStorage"
          label="Allantoic Storage"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="viVolume"
          label="Volume"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="viUnit"
          label="Unit"
          form={form}
          onChange={handleChange}
        />
      </>
    );
  }

  if (stage === "pre-processed") {
    return (
      <>
        <TextField
          type="datetime-local"
          name="preprocessingDate"
          label="Pre-processing Date"
          form={form}
          onChange={handleChange}
        />
        {userSelect("preprocessingPerformedBy", "Pre-processed By")}
        <TextField
          name="preprocessingMethod"
          label="Method"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="preprocessingInputVolume"
          label="Input Volume"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="preprocessingInputVolumeUnit"
          label="Input Unit"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="preprocessingOutputVolume"
          label="Output Volume"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="preprocessingOutputVolumeUnit"
          label="Output Unit"
          form={form}
          onChange={handleChange}
        />
        <TextAreaField
          name="preprocessingRemarks"
          label="Remarks"
          form={form}
          onChange={handleChange}
        />
        <TextAreaField
          name="preprocessingComment"
          label="Comment"
          form={form}
          onChange={handleChange}
        />
      </>
    );
  }

  if (stage === "extracted") {
    const extractionMethodOptions = withCurrentOption(
      EXTRACTION_METHODS,
      form.extractionMethod,
    );

    return (
      <>
        <TextField
          type="datetime-local"
          name="extractionDateTime"
          label="Extraction Date"
          form={form}
          onChange={handleChange}
        />
        {userSelect("extractedBy", "Extracted By")}
        <SelectField
          name="extractionNucleicAcidType"
          label="Nucleic Acid Extracted"
          form={form}
          onChange={handleChange}
          options={NUCLEIC_ACID_TYPES}
          placeholder="Select type"
        />
        <SelectField
          name="extractionMethod"
          label="Method / Kit"
          form={form}
          onChange={handleChange}
          options={extractionMethodOptions}
          placeholder="Select method"
        />
        <TextField
          name="extractionSampleUsedValue"
          label="Sample Used"
          form={form}
          onChange={handleChange}
        />
        <SelectField
          name="extractionSampleUsedUnit"
          label="Used Unit"
          form={form}
          onChange={handleChange}
          options={SAMPLE_UNITS}
          placeholder="Select unit"
        />
        <TextField
          name="extractionSampleRemainingValue"
          label="Sample Remaining"
          form={form}
          onChange={handleChange}
        />
        <SelectField
          name="extractionSampleRemainingUnit"
          label="Remaining Unit"
          form={form}
          onChange={handleChange}
          options={SAMPLE_UNITS}
          placeholder="Select unit"
        />
        <TextField
          name="extractionElutionVolume"
          label="Elution Volume"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="extractionConcentration"
          label="Concentration"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="extractionPcrVolume"
          label="PCR Volume"
          form={form}
          onChange={handleChange}
        />
        <SelectField
          name="extractionPcrVolumeUnit"
          label="PCR Unit"
          form={form}
          onChange={handleChange}
          options={SAMPLE_UNITS}
          placeholder="Select unit"
        />
        <TextField
          name="extractionRatio260_280"
          label="260/280 Ratio"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="extractionRatio260_230"
          label="260/230 Ratio"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="extractionStorageTemperature"
          label="Storage Temperature"
          form={form}
          onChange={handleChange}
        />
        <TextField
          name="extractionStorageDetails"
          label="Storage Details"
          form={form}
          onChange={handleChange}
        />
        <TextAreaField
          name="extractionComments"
          label="Comments"
          form={form}
          onChange={handleChange}
        />
      </>
    );
  }

  if (stage === "tested" || stage === "test-report-generated") {
    return (
      <>
        <TextField
          type="datetime-local"
          name="testedAt"
          label="Tested Date"
          form={form}
          onChange={handleChange}
        />
        {userSelect("testedBy", "Tested By")}
        <TextField
          type="datetime-local"
          name="reportGeneratedAt"
          label="Report Generated Date"
          form={form}
          onChange={handleChange}
        />
        {userSelect("reportGeneratedBy", "Report Generated By")}
        {fullSample.labTests?.length ? (
          fullSample.labTests.map((labTest) => (
            <LabTestFields
              key={labTest.id}
              labTest={labTest}
              form={form}
              memberOptions={memberOptions}
              onChange={setLabTestField}
            />
          ))
        ) : (
          <p className="sm:col-span-2 text-grey-70 text-sm">
            No lab tests found.
          </p>
        )}
      </>
    );
  }

  return <p className="text-grey-70 text-sm">This stage is not editable.</p>;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-grey-70 text-xs font-semibold uppercase tracking-wide">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextField({
  name,
  label,
  form,
  onChange,
  type = "text",
}: {
  name: string;
  label: string;
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <Field label={label}>
      <input
        type={type}
        name={name}
        value={form[name] || ""}
        onChange={onChange}
        className={fieldClass}
      />
    </Field>
  );
}

function SelectField({
  name,
  label,
  form,
  onChange,
  options,
  placeholder,
}: {
  name: string;
  label: string;
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <Field label={label}>
      <select
        name={name}
        value={form[name] || ""}
        onChange={onChange}
        className={fieldClass}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function TextAreaField({
  name,
  label,
  form,
  onChange,
}: {
  name: string;
  label: string;
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <Field label={label}>
      <textarea
        name={name}
        value={form[name] || ""}
        onChange={onChange}
        className={areaClass}
      />
    </Field>
  );
}

function LabTestFields({
  labTest,
  form,
  memberOptions,
  onChange,
}: {
  labTest: LabTest;
  form: FormState;
  memberOptions: { label: string; value: string }[];
  onChange: (id: string, field: string, value: string) => void;
}) {
  const name = (field: string) => `labTest.${labTest.id}.${field}`;
  const change =
    (field: string) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      onChange(labTest.id, field, event.target.value);

  return (
    <div className="sm:col-span-2 p-4 rounded-lg border border-grey-20 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <h4 className="sm:col-span-2 text-grey-90 text-sm font-semibold">
        {typeof labTest.disease === "string"
          ? "Lab Test"
          : labTest.disease?.name || "Lab Test"}
      </h4>
      <Field label="Kit / Protocol">
        <input
          className={fieldClass}
          value={form[name("kitOrProtocol")] || ""}
          onChange={change("kitOrProtocol")}
        />
      </Field>
      <Field label="Result">
        <select
          className={fieldClass}
          value={form[name("testResult")] || ""}
          onChange={change("testResult")}
        >
          <option value="">Select result</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
          <option value="unclear">Unclear</option>
        </select>
      </Field>
      <Field label="CT Value">
        <input
          className={fieldClass}
          value={form[name("ctValue")] || ""}
          onChange={change("ctValue")}
        />
      </Field>
      <Field label="Subtype / Variant">
        <input
          className={fieldClass}
          value={form[name("variant")] || ""}
          onChange={change("variant")}
        />
      </Field>
      <Field label="Viral Load">
        <input
          className={fieldClass}
          value={form[name("viralLoad")] || ""}
          onChange={change("viralLoad")}
        />
      </Field>
      <Field label="Tested Date">
        <input
          type="datetime-local"
          className={fieldClass}
          value={form[name("testedAt")] || ""}
          onChange={change("testedAt")}
        />
      </Field>
      <Field label="Result Date">
        <input
          type="datetime-local"
          className={fieldClass}
          value={form[name("resultDate")] || ""}
          onChange={change("resultDate")}
        />
      </Field>
      <Field label="Tested By">
        <select
          className={fieldClass}
          value={form[name("testedBy")] || ""}
          onChange={change("testedBy")}
        >
          <option value="">Select user</option>
          {memberOptions.map((option) => (
            <option key={`${labTest.id}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <TextAreaField
          name={name("resultComment")}
          label="Result Comment"
          form={form}
          onChange={change("resultComment")}
        />
      </div>
      <div className="sm:col-span-2">
        <TextAreaField
          name={name("labComment")}
          label="Lab Comment"
          form={form}
          onChange={change("labComment")}
        />
      </div>
    </div>
  );
}

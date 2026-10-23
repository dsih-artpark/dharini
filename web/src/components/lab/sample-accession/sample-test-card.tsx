import {
  CheckCircle2,
  HelpCircle,
  MinusCircle,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import Select from "@/src/components/ui/select";
import Spinner from "@/src/components/ui/spinner";
import { getFileNameFromS3Url } from "@/src/utils";
import { LAB_TEST_RESULT, OTHERS_OPTION } from "@/src/utils/constant";
import {
  uploadImagesApi,
  getSignedUrlApi,
} from "@/src/app/(dashboard)/home/loader";
import { Kit, LabTest } from "@/src/types/sample";

const DEFAULT_CUSTOM_FIELD = { label: "", value: "" };

interface SampleTestCardProps {
  disease: {
    id: string;
    name: string;
    shortName: string;
  };
  labTestData: Partial<LabTest>;
  index: number;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onChange: (data: Partial<LabTest>) => void;
  errors: Record<string, string>;
  kits: Kit[] | undefined;
  isRetest?: boolean;
  onRemove?: () => void;
}

export default function SampleTestCard({
  disease,
  labTestData,
  index,
  isSelected,
  onSelect,
  onChange,
  errors,
  kits,
  isRetest,
  onRemove,
}: SampleTestCardProps) {
  const [customKitName, setCustomKitName] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const testingDetails =
    (labTestData.details as { testing?: Record<string, unknown> })?.testing ||
    {};

  const selectValue =
    labTestData.kitOrProtocol &&
    kits?.every((k) => k.name !== labTestData.kitOrProtocol)
      ? OTHERS_OPTION
      : labTestData.kitOrProtocol;

  const customKitFields =
    (testingDetails.customKitFields as Array<{
      label: string;
      value: string;
    }>) || [];

  const customTestParameters =
    (testingDetails.customTestParameters as Array<{
      label: string;
      value: string;
    }>) || [];

  const updateTestingDetails = (update: Record<string, unknown>) => {
    const currentDetails = labTestData.details || {};
    const currentTesting =
      (currentDetails as { testing?: Record<string, unknown> }).testing || {};

    onChange({
      details: {
        ...currentDetails,
        testing: {
          ...currentTesting,
          ...update,
        },
      },
    });
  };

  const handleKitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === OTHERS_OPTION) {
      setCustomKitName("");
      onChange({ kitOrProtocol: OTHERS_OPTION });
    } else {
      setCustomKitName(""); // clear custom name if selecting proper kit
      onChange({ kitOrProtocol: value });
    }
  };

  const handleCustomKitNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setCustomKitName(value);
    onChange({ kitOrProtocol: value });
  };

  const addCustomField = () => {
    updateTestingDetails({
      customKitFields: [...customKitFields, { ...DEFAULT_CUSTOM_FIELD }],
    });
  };

  const updateCustomField = (
    fieldIndex: number,
    key: "label" | "value",
    value: string,
  ) => {
    const updatedFields = customKitFields.map((field, i) =>
      i === fieldIndex ? { ...field, [key]: value } : field,
    );
    updateTestingDetails({ customKitFields: updatedFields });
  };

  const removeCustomField = (fieldIndex: number) => {
    const updatedFields = customKitFields.filter((_, i) => i !== fieldIndex);
    updateTestingDetails({ customKitFields: updatedFields });
  };

  const addCustomTestParameter = () => {
    updateTestingDetails({
      customTestParameters: [
        ...customTestParameters,
        { ...DEFAULT_CUSTOM_FIELD },
      ],
    });
  };

  const updateCustomTestParameter = (
    fieldIndex: number,
    key: "label" | "value",
    value: string,
  ) => {
    const updatedFields = customTestParameters.map((field, i) =>
      i === fieldIndex ? { ...field, [key]: value } : field,
    );
    updateTestingDetails({ customTestParameters: updatedFields });
  };

  const removeCustomTestParameter = (fieldIndex: number) => {
    const updatedFields = customTestParameters.filter(
      (_, i) => i !== fieldIndex,
    );
    updateTestingDetails({ customTestParameters: updatedFields });
  };

  const ACCEPTED_FILE_TYPES =
    "application/pdf,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const getFileTypeLabel = (url: string): string => {
    const lower = url.toLowerCase();
    if (lower.endsWith(".pdf")) return "PDF";
    if (lower.endsWith(".csv")) return "CSV";
    if (lower.endsWith(".xls") || lower.endsWith(".xlsx")) return "Excel";
    return "File";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      toast.error("File size must be less than 25MB. Please re-upload file");
      return;
    }

    if (!files.length) {
      toast.error("No files selected.");
      return;
    }

    setUploading(true);
    try {
      const response = await uploadImagesApi({ files });
      if (response.success) {
        onChange({
          testResultReport: response.data[0].uploaded
            ? response.data[0].fileUrl
            : "",
        });
      } else {
        toast.error(response.message || "Error uploading file.");
      }
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error
          ? error.message
          : "Error uploading file. Please try again.";
      toast.error(errMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleViewFile = async () => {
    if (!labTestData.testResultReport) return;
    try {
      const response = await getSignedUrlApi(labTestData.testResultReport);
      if (response.success && response.data) {
        window.open(response.data, "_blank");
      } else {
        toast.error("Unable to generate viewable URL.");
      }
    } catch {
      toast.error("Error fetching file URL. Please try again.");
    }
  };

  const removeFile = () => {
    onChange({ testResultReport: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl border transition-all duration-300 ${
        isSelected
          ? "border-blue-20 shadow-md"
          : "border-grey-20 shadow-sm opacity-85"
      }`}
    >
      <div
        className={`p-4 flex items-center gap-3 cursor-pointer select-none transition-colors ${
          isSelected ? "bg-blue-10/40" : "bg-transparent"
        }`}
        onClick={() => onSelect(!isSelected)}
      >
        {!isRetest && (
          <input
            type="checkbox"
            id={disease.id + index}
            className="accent-blue-40 w-5 h-5 cursor-pointer"
            checked={isSelected}
            readOnly
          />
        )}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
              isSelected ? "bg-blue-40 text-white" : "bg-grey-10 text-grey-70"
            }`}
          >
            {disease?.shortName || "D"}
          </div>
          <h3
            className={`font-noto-serif font-bold text-lg ${
              isSelected ? "text-blue-90" : "text-grey-60"
            }`}
          >
            {disease?.name}
          </h3>
        </div>
        {isSelected && (
          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-blue-10 text-blue-50">
            Selected
          </span>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={`p-2 rounded-lg hover:bg-red-50 text-grey-50 hover:text-red-500 transition-colors ${!isSelected ? "ml-auto" : ""}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-2 flex flex-col gap-6 border-t border-grey-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-grey-80 font-medium text-sm lg:text-base">
                    Kit or Protocol <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="kitOrProtocol"
                    options={[
                      {
                        label: "Add your kit",
                        value: OTHERS_OPTION,
                      },
                      ...(kits?.map((kit) => ({
                        label: kit.name,
                        value: kit.name,
                      })) ?? []),
                    ]}
                    defaultValue={
                      selectValue === OTHERS_OPTION
                        ? OTHERS_OPTION
                        : labTestData.kitOrProtocol
                    }
                    className="w-full"
                    placeholder="Select kit/protocol"
                    onChange={handleKitChange}
                  />
                  {selectValue === OTHERS_OPTION && (
                    <input
                      type="text"
                      name="customKit"
                      className="w-full h-10 px-3 py-2 bg-white rounded-lg border border-grey-40 text-sm font-normal outline-none focus:border-blue-40 transition-colors"
                      placeholder="Enter custom kit/protocol name"
                      value={
                        customKitName ||
                        (labTestData.kitOrProtocol === OTHERS_OPTION
                          ? ""
                          : labTestData.kitOrProtocol)
                      }
                      onChange={handleCustomKitNameChange}
                      autoFocus
                    />
                  )}
                  {(errors.kitOrProtocol || errors.customKitName) && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.kitOrProtocol || errors.customKitName}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-grey-80 font-medium text-sm lg:text-base">
                    Target Assay / Primer
                  </label>
                  <input
                    name="targetAssay"
                    className="w-full px-3 py-2 border border-grey-40 rounded-lg text-sm font-normal outline-none focus:border-blue-40 transition-colors"
                    placeholder="M-gene"
                    value={(testingDetails.targetAssay as string) || ""}
                    onChange={(e) =>
                      updateTestingDetails({ targetAssay: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 p-4 bg-grey-10/60 rounded-2xl border border-grey-20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-base text-grey-80">
                      Ct Value Entry for Selected Assay
                    </h4>
                    <p className="text-xs text-grey-60">
                      Record the Ct values generated for this sample. You may
                      add multiple Ct values as required based on the selected
                      assay or kit.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex items-center px-2 py-1 text-xs font-medium text-blue-50 bg-blue-10 rounded-lg border border-blue-20 whitespace-nowrap"
                    onClick={addCustomField}
                  >
                    <Plus size={16} /> Add CT Value
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {customKitFields.length === 0 && (
                    <p className="text-xs text-grey-60">
                      No CT values added yet.
                    </p>
                  )}
                  {customKitFields.map((field, fieldIndex) => (
                    <div
                      key={`${fieldIndex}-custom-field`}
                      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center"
                    >
                      <input
                        className="w-full px-3 py-2 border border-grey-40 rounded-lg text-sm outline-none focus:border-blue-40"
                        placeholder="(e.g., H5 CT Value)"
                        value={field.label}
                        onChange={(e) =>
                          updateCustomField(fieldIndex, "label", e.target.value)
                        }
                      />
                      <input
                        className="w-full px-3 py-2 border border-grey-40 rounded-lg text-sm outline-none focus:border-blue-40"
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) =>
                          updateCustomField(fieldIndex, "value", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="w-10 h-10 flex items-center justify-center text-grey-60 border border-grey-20 rounded-lg hover:text-red-500 hover:border-red-200"
                        onClick={() => removeCustomField(fieldIndex)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.customKitFields && (
                  <p className="text-red-500 text-sm">
                    {errors.customKitFields}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  {/* <p className="text-grey-80 font-medium text-base">Custom Fields</p> */}
                  <button
                    type="button"
                    className="text-blue-40 text-xl font-medium"
                    onClick={addCustomTestParameter}
                  >
                    + Add Test Parameter
                  </button>
                </div>
                {customTestParameters.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {customTestParameters.map((field, fieldIndex) => (
                      <div
                        key={`test-param-${fieldIndex}`}
                        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center"
                      >
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-grey-40 rounded-lg text-sm outline-none focus:border-blue-40 transition-colors"
                          placeholder="Test Parameter"
                          value={field.label}
                          onChange={(e) =>
                            updateCustomTestParameter(
                              fieldIndex,
                              "label",
                              e.target.value,
                            )
                          }
                        />
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-grey-40 rounded-lg text-sm outline-none focus:border-blue-40 transition-colors"
                          placeholder="Measured Value"
                          value={field.value}
                          onChange={(e) =>
                            updateCustomTestParameter(
                              fieldIndex,
                              "value",
                              e.target.value,
                            )
                          }
                        />
                        <button
                          type="button"
                          className="w-10 h-10 flex items-center justify-center text-grey-60 border border-grey-20 rounded-lg hover:text-red-500 hover:border-red-200 transition-colors"
                          onClick={() => removeCustomTestParameter(fieldIndex)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.customTestParameters && (
                  <p className="text-red-500 text-sm">
                    {errors.customTestParameters}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-6 border-t border-grey-10 pt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-grey-80 font-medium text-base">
                    Test Result <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {LAB_TEST_RESULT.map((option) => {
                      const normalized = option.toString().toLowerCase();
                      const isOptionSelected =
                        labTestData.testResult === option;
                      const isPositive = normalized.includes("positive");
                      const isNegative = normalized.includes("negative");

                      const stateStyles = isOptionSelected
                        ? isPositive
                          ? "border-green-30 bg-green-10/60 text-green-30"
                          : isNegative
                            ? "border-red-400 bg-red-50 text-red-600"
                            : "border-grey-50 bg-grey-10 text-grey-80"
                        : "border-grey-30 bg-white text-grey-70 hover:border-blue-30";

                      return (
                        <label
                          key={`${option}-${index}`}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${stateStyles}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${
                              isPositive
                                ? "bg-green-30/20 text-green-30"
                                : isNegative
                                  ? "bg-red-100 text-red-600"
                                  : "bg-grey-20 text-grey-70"
                            }`}
                          >
                            {isPositive ? (
                              <CheckCircle2 size={18} />
                            ) : isNegative ? (
                              <MinusCircle size={18} />
                            ) : (
                              <HelpCircle size={18} />
                            )}
                          </span>
                          <input
                            type="radio"
                            className="sr-only"
                            name={`testResult-${index}`}
                            value={option}
                            onChange={() => onChange({ testResult: option })}
                            checked={isOptionSelected}
                          />
                          <span className="font-medium text-sm capitalize">
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.testResult && (
                    <p className="text-red-500 text-sm">{errors.testResult}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2 self-stretch">
                    <label className="text-grey-80 font-medium text-base">
                      Result Date <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full flex items-center gap-2 px-3 py-2 border border-grey-40 rounded-lg bg-white focus-within:border-blue-40 transition-colors">
                      <input
                        type="date"
                        className="w-full text-base font-normal placeholder:text-grey-70 outline-none bg-transparent"
                        max={new Date().toISOString().split("T")[0]}
                        value={
                          labTestData.resultDate
                            ? new Date(labTestData.resultDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          onChange({
                            resultDate: new Date(e.target.value).toISOString(),
                          })
                        }
                      />
                    </div>
                    {errors.resultDate && (
                      <p className="text-red-500 text-sm">
                        {errors.resultDate}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 self-stretch">
                    <label className="text-grey-80 font-medium text-base">
                      Subtype/Variant <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full flex items-center gap-2 px-3 py-2 border border-grey-40 rounded-lg bg-white focus-within:border-blue-40 transition-colors">
                      <input
                        className="w-full text-base font-normal placeholder:text-grey-70 outline-none bg-transparent"
                        placeholder="Disease variant"
                        value={labTestData.variant ?? ""}
                        onChange={(e) => onChange({ variant: e.target.value })}
                      />
                    </div>
                    {errors.variant && (
                      <p className="text-red-500 text-sm">{errors.variant}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2 self-stretch">
                    <label className="text-grey-80 font-medium text-base">
                      Result Comments
                    </label>
                    <textarea
                      className="w-full min-h-[140px] p-3 bg-white rounded-lg border border-grey-40 resize-none focus:border-blue-40 transition-colors outline-none"
                      value={labTestData.resultComment ?? ""}
                      onChange={(e) =>
                        onChange({ resultComment: e.target.value })
                      }
                      placeholder="Add result comments, observations, or notes."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-grey-80 font-medium text-base">
                      Upload Test Result
                    </p>
                    <div className="min-h-[140px] px-6 py-4 flex flex-col items-center justify-center gap-2 bg-grey-10/70 border border-dashed border-grey-30 rounded-xl text-center">
                      {uploading ? (
                        <Spinner />
                      ) : labTestData.testResultReport ? (
                        <div className="flex items-center gap-2 border border-grey-20 rounded">
                          <div className="w-[55px] h-[55px] flex items-center justify-center bg-grey-0 border-r border-grey-20 rounded-l">
                            <Upload size={20} />
                          </div>
                          <div className="relative flex items-center gap-2 bg-grey-10 px-4 py-2">
                            <div className="w-[200px]">
                              <p className="text-grey-80 font-medium text-sm truncate">
                                {getFileNameFromS3Url(
                                  labTestData.testResultReport,
                                )}
                              </p>
                              <p className="text-grey-70 font-normal text-xs">
                                {getFileTypeLabel(labTestData.testResultReport)}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="w-5 h-5 p-1 bg-grey-0 border border-grey-60 rounded-full absolute right-[-6px] top-[-6px] flex items-center justify-center"
                              onClick={removeFile}
                            >
                              <Trash2 size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={handleViewFile}
                              className="text-blue-40 hover:underline cursor-pointer bg-transparent border-none"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload size={24} className="text-blue-40" />
                          <div className="flex items-center justify-center gap-1 text-sm">
                            <label className="text-blue-40 font-medium cursor-pointer">
                              Click here to upload
                              <input
                                type="file"
                                accept={ACCEPTED_FILE_TYPES}
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </label>
                            <span className="text-grey-70">
                              or drag and drop
                            </span>
                          </div>
                          <p className="text-grey-70 font-normal text-sm">
                            PDF, CSV, or Excel (max. 25MB)
                          </p>
                        </>
                      )}
                    </div>
                    {errors.testResultReport && (
                      <p className="text-red-500 text-sm">
                        {errors.testResultReport}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

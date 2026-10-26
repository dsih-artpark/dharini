"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type SelectType from "react-select";

import {
  fetchDisease,
  fetchRegions,
  fetchRegionsByRegionId,
  fetchSurveillanceTypes,
} from "@/src/app/(dashboard)/project-onboarding/loader";
import CustomModal from "@/src/components/ui/custom-modal";
import Spinner from "@/src/components/ui/spinner";
import type {
  Disease,
  ProjectDetail,
  Region,
  SurveillanceType,
} from "@/src/types/global";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
}) as unknown as typeof SelectType;

type SelectOption = { value: string; label: string };

export type EditProjectDetailsPayload = {
  name: string;
  diseases: string[];
  surveillanceTypes: string[];
  regions: string[];
};

type FormErrors = {
  name?: string;
  diseases?: string;
  surveillanceTypes?: string;
  regions?: string;
};

type Props = {
  isOpen: boolean;
  project: ProjectDetail | null;
  onClose: () => void;
  onSave: (payload: EditProjectDetailsPayload) => void | Promise<void>;
};

const SELECT_ALL_OPTION = { value: "__select_all__", label: "Select All" };

export default function EditProjectDetailsModal({
  isOpen,
  project,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState("");
  const [selectedDiseaseIds, setSelectedDiseaseIds] = useState<string[]>([]);
  const [selectedSurveillanceTypeIds, setSelectedSurveillanceTypeIds] =
    useState<string[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [surveillanceTypes, setSurveillanceTypes] = useState<
    SurveillanceType[]
  >([]);
  const [states, setStates] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [selectedStates, setSelectedStates] = useState<SelectOption[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<SelectOption[]>(
    [],
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !project) return;

    const projectStates = project.regions.filter(
      (region) => region.regionType === "state",
    );
    const projectDistricts = project.regions.filter(
      (region) => region.regionType === "district",
    );
    const stateMap = new Map<string, SelectOption>();

    projectStates.forEach((state) => {
      stateMap.set(state.id, { value: state.id, label: state.name });
    });
    projectDistricts.forEach((district) => {
      if (district.parentRegion) {
        stateMap.set(district.parentRegion.id, {
          value: district.parentRegion.id,
          label: district.parentRegion.name,
        });
      }
    });

    setName(project.name);
    setSelectedDiseaseIds(project.diseases.map((disease) => disease.id));
    setSelectedSurveillanceTypeIds(
      project.surveillanceTypes.map((type) => type.id),
    );
    setSelectedStates(Array.from(stateMap.values()));
    setSelectedDistricts(
      projectDistricts.map((district) => ({
        value: district.id,
        label: district.name,
      })),
    );
    setErrors({});
  }, [isOpen, project]);

  useEffect(() => {
    if (!isOpen) return;

    setIsLoadingOptions(true);
    Promise.all([
      fetchDisease(),
      fetchSurveillanceTypes(),
      fetchRegions({ type: "state" }),
    ])
      .then(([diseaseResponse, surveillanceResponse, regionResponse]) => {
        if (diseaseResponse.success) setDiseases(diseaseResponse.data);
        if (surveillanceResponse.success)
          setSurveillanceTypes(surveillanceResponse.data);
        if (regionResponse.success) setStates(regionResponse.data);
      })
      .finally(() => setIsLoadingOptions(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (selectedStates.length === 0) {
      setDistricts([]);
      return;
    }

    Promise.all(
      selectedStates.map((state) => fetchRegionsByRegionId(state.value)),
    ).then((responses) => {
      const availableDistricts = responses
        .filter((response) => response.success)
        .flatMap((response) => response.data.subRegions);
      setDistricts(availableDistricts);
      setSelectedDistricts((current) =>
        current.filter((selected) =>
          availableDistricts.some((district) => district.id === selected.value),
        ),
      );
    });
  }, [isOpen, selectedStates]);

  const stateOptions = useMemo(
    () => [
      SELECT_ALL_OPTION,
      ...states.map((state) => ({ value: state.id, label: state.name })),
    ],
    [states],
  );
  const districtOptions = useMemo(
    () => [
      SELECT_ALL_OPTION,
      ...districts.map((district) => ({
        value: district.id,
        label: district.name,
      })),
    ],
    [districts],
  );

  const toggleDisease = (id: string) => {
    setSelectedDiseaseIds((current) =>
      current.includes(id)
        ? current.filter((diseaseId) => diseaseId !== id)
        : [...current, id],
    );
    setErrors((current) => ({ ...current, diseases: undefined }));
  };

  const toggleSurveillanceType = (id: string) => {
    setSelectedSurveillanceTypeIds((current) =>
      current.includes(id)
        ? current.filter((typeId) => typeId !== id)
        : [...current, id],
    );
    setErrors((current) => ({
      ...current,
      surveillanceTypes: undefined,
    }));
  };

  const handleStateSelect = (value: unknown) => {
    const options = (value as SelectOption[]) ?? [];
    const nextSelectedStates = options.some(
      (option) => option.value === SELECT_ALL_OPTION.value,
    )
      ? states.map((state) => ({ value: state.id, label: state.name }))
      : options;

    setSelectedStates(nextSelectedStates);
    if (nextSelectedStates.length === 0) {
      setSelectedDistricts([]);
    }
    setErrors((current) => ({ ...current, regions: undefined }));
  };

  const handleDistrictSelect = (value: unknown) => {
    const options = (value as SelectOption[]) ?? [];
    setSelectedDistricts(
      options.some((option) => option.value === SELECT_ALL_OPTION.value)
        ? districts.map((district) => ({
            value: district.id,
            label: district.name,
          }))
        : options,
    );
    setErrors((current) => ({ ...current, regions: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = "Project name is required";
    else if (name.trim().length < 3)
      nextErrors.name = "Project name must be at least 3 characters long";
    if (selectedDiseaseIds.length === 0)
      nextErrors.diseases = "Select minimum 1 disease";
    if (selectedSurveillanceTypeIds.length === 0)
      nextErrors.surveillanceTypes = "Select minimum 1 surveillance type";
    if (selectedStates.length === 0)
      nextErrors.regions = "Select at least one state";
    else if (selectedDistricts.length === 0)
      nextErrors.regions = "Select minimum 1 district";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      await onSave({
        name: name.trim(),
        diseases: selectedDiseaseIds,
        surveillanceTypes: selectedSurveillanceTypeIds,
        regions: [
          ...selectedStates.map((state) => state.value),
          ...selectedDistricts.map((district) => district.value),
        ],
      });
    } catch (error) {
      const errorMsg = (error as Error)?.message || "";
      if (
        errorMsg.toLowerCase().includes("name") &&
        errorMsg.toLowerCase().includes("already exist")
      ) {
        setErrors((current) => ({ ...current, name: errorMsg }));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const selectClassNames = {
    control: () => "!border-grey-40",
    indicatorSeparator: () => "hidden",
    option: (state: { data: SelectOption }) =>
      state.data.value === SELECT_ALL_OPTION.value
        ? "!font-semibold !text-blue-40 !border-b !border-grey-20"
        : "",
  };

  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-full sm:w-[680px] py-6 bg-white rounded flex-col justify-start items-start gap-5 inline-flex">
        <div className="self-stretch px-7 justify-between items-center inline-flex">
          <h3 className="text-grey-80 text-xl font-semibold font-noto-serif leading-[26px]">
            Edit Project Details
          </h3>
          <button
            type="button"
            className="p-1 text-blue-40 text-2xl leading-none"
            onClick={onClose}
            aria-label="Close edit project details"
            disabled={isSaving}
          >
            &times;
          </button>
        </div>
        <div className="w-full h-px bg-grey-20" />

        <div className="max-h-[500px] self-stretch px-6 flex-col justify-start items-start gap-6 flex overflow-y-auto">
          <div className="self-stretch flex-col gap-2 flex">
            <label
              htmlFor="edit-project-name"
              className="text-grey-80 text-base"
            >
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-project-name"
              className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-40 outline-none"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((current) => ({ ...current, name: undefined }));
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <TagSelector
            label="Applicable Diseases"
            items={diseases}
            selectedIds={selectedDiseaseIds}
            onToggle={toggleDisease}
            error={errors.diseases}
          />
          <TagSelector
            label="Surveillance Type"
            items={surveillanceTypes}
            selectedIds={selectedSurveillanceTypeIds}
            onToggle={toggleSurveillanceType}
            error={errors.surveillanceTypes}
          />

          <div className="self-stretch flex-col gap-2 flex">
            <p className="text-grey-80 text-base">
              State <span className="text-red-500">*</span>
            </p>
            <Select<SelectOption, true>
              className="w-full"
              classNames={selectClassNames}
              options={stateOptions}
              onChange={handleStateSelect}
              value={selectedStates}
              isClearable={false}
              isMulti
              isLoading={isLoadingOptions}
            />
          </div>

          <div className="self-stretch flex-col gap-2 flex">
            <p className="text-grey-80 text-base">
              Active Locations (Districts){" "}
              <span className="text-red-500">*</span>
            </p>
            <Select<SelectOption, true>
              className="w-full"
              classNames={selectClassNames}
              options={districtOptions}
              onChange={handleDistrictSelect}
              value={selectedDistricts}
              isClearable={false}
              isMulti
              isDisabled={selectedStates.length === 0}
            />
            {errors.regions && (
              <p className="text-red-500 text-sm">{errors.regions}</p>
            )}
          </div>
        </div>

        <div className="w-full h-px bg-grey-20" />
        <div className="self-stretch px-6 justify-end items-center gap-3 inline-flex">
          <button
            type="button"
            className="h-12 px-6 rounded-lg border border-blue-40 text-blue-40 disabled:opacity-50"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="h-12 min-w-36 px-6 bg-blue-40 rounded-lg text-white disabled:bg-grey-50 flex justify-center items-center"
            onClick={handleSave}
            disabled={isSaving || isLoadingOptions}
          >
            {isSaving ? <Spinner darkMode /> : "Save Details"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
}

function TagSelector({
  label,
  items,
  selectedIds,
  onToggle,
  error,
}: {
  label: string;
  items: { id: string; name: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  error?: string;
}) {
  return (
    <div className="self-stretch flex-col gap-4 flex">
      <p className="text-grey-80 text-base">
        {label} <span className="text-red-500">*</span>
      </p>
      <div className="self-stretch justify-start items-center gap-2 flex flex-wrap">
        {items.map((item) => {
          const selected = selectedIds.includes(item.id);
          return (
            <button
              type="button"
              key={item.id}
              className={`h-8 px-2 py-1 rounded-full border text-grey-80 text-xs ${
                selected
                  ? "bg-blue-10 border-blue-30"
                  : "bg-white border-grey-20"
              }`}
              onClick={() => onToggle(item.id)}
            >
              {item.name}
              {selected && <span className="ml-1 text-blue-40">&times;</span>}
            </button>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

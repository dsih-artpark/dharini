import { X } from "lucide-react";
import Select from "@/src/components/ui/select";
import type { FilterType } from "@/src/types/statistics";
import type { Wetland } from "@/src/app/(dashboard)/geolens/types";
import { RESULT_OPTIONS, type SelectOption } from "./useSurveillanceFilters";

interface SurveillanceFiltersProps {
  resetKey: number;
  show: boolean;
  onClose: () => void;
  filters: FilterType;
  handleFilterChange: (name: string, value: string | string[]) => void;
  resetFilters: () => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  showProjectSelector: boolean;
  projectOptions: SelectOption[];
  stateOptions: SelectOption[];
  districtOptions: SelectOption[];
  diseaseOptions: SelectOption[];
  siteOptions: SelectOption[];
  sampleTypeOptions: SelectOption[];
  // Geolens-only wetland extra
  selectedWetland: string;
  setSelectedWetland: (value: string) => void;
  wetlandOptions: SelectOption[];
  wetlands: Wetland[];
  handleSiteSelection: (lat: number, lng: number, name: string) => void;
}

export function SurveillanceFilters(props: SurveillanceFiltersProps) {
  const {
    resetKey,
    show,
    onClose,
    filters,
    handleFilterChange,
    resetFilters,
    selectedProjectId,
    setSelectedProjectId,
    showProjectSelector,
    projectOptions,
    stateOptions,
    districtOptions,
    diseaseOptions,
    siteOptions,
    sampleTypeOptions,
    // selectedWetland,
    // setSelectedWetland,
    // wetlandOptions,
    // wetlands,
    // handleSiteSelection,
  } = props;

  if (!show) return null;

  return (
    <div
      id="geolens-filters"
      className="absolute right-3 top-3 z-[1100] flex max-h-[calc(100%-24px)] w-[300px] max-w-[calc(100%-24px)] flex-col gap-2 overflow-y-auto rounded-xl border border-grey-20 bg-white p-4 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-grey-80">Map filters</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={resetFilters}
            className="rounded px-1.5 py-1 text-xs font-semibold text-blue-40 hover:bg-blue-10"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-7 w-7 items-center justify-center rounded text-grey-60 hover:bg-grey-10 hover:text-grey-80"
          >
            <X size={15} />
          </button>
        </div>
      </div>
      <p className="-mt-1 mb-1 text-xs text-grey-60">
        Applies as you choose. Active filters show as chips on the map.
      </p>

      {showProjectSelector && (
        <Select
          key={`project-${resetKey}`}
          name="projectId"
          className="w-full"
          options={projectOptions}
          onChange={(e) => setSelectedProjectId(String(e.target.value))}
          defaultValue={selectedProjectId}
          placeholder="All Projects"
        />
      )}

      <Select
        key={`state-${resetKey}`}
        name="stateId"
        isMulti
        className="w-full"
        options={stateOptions}
        onChange={(e) => handleFilterChange("stateId", e.target.value)}
        defaultValue={filters.stateId}
        placeholder="All States"
      />

      <Select
        key={`district-${resetKey}`}
        name="districtId"
        isMulti
        className="w-full"
        options={districtOptions}
        onChange={(e) => handleFilterChange("districtId", e.target.value)}
        defaultValue={filters.districtId}
        placeholder="All Districts"
        noResultsText="Please select a state"
      />

      <Select
        key={`disease-${resetKey}`}
        name="diseaseId"
        isMulti
        className="w-full"
        options={diseaseOptions}
        onChange={(e) => handleFilterChange("diseaseId", e.target.value)}
        defaultValue={filters.diseaseId}
        placeholder="All Diseases"
      />

      <Select
        key={`site-${resetKey}`}
        name="siteId"
        isMulti
        className="w-full"
        options={siteOptions}
        onChange={(e) => handleFilterChange("siteId", e.target.value)}
        defaultValue={filters.siteId}
        placeholder="All Sites"
      />

      <Select
        key={`sampleType-${resetKey}`}
        name="sampleTypeId"
        isMulti
        className="w-full"
        options={sampleTypeOptions}
        onChange={(e) => handleFilterChange("sampleTypeId", e.target.value)}
        defaultValue={filters.sampleTypeId}
        placeholder="Sample Type"
      />

      <Select
        key={`result-${resetKey}`}
        name="testResult"
        isMulti
        className="w-full"
        options={RESULT_OPTIONS}
        onChange={(e) => handleFilterChange("testResult", e.target.value)}
        defaultValue={filters.testResult}
        placeholder="All Results"
      />

      {/* <div className="my-1 h-px bg-grey-20" />

      <Select
        name="wetland"
        className="w-full"
        options={wetlandOptions}
        defaultValue={selectedWetland}
        placeholder="All Wetlands"
        noResultsText="Select a state to load wetlands"
        onChange={(e) => {
          const val = String(e.target.value);
          setSelectedWetland(val);
          const wetland = wetlands.find((x) => x.id === val);
          if (wetland) handleSiteSelection(wetland.lat, wetland.lng, wetland.name);
        }}
      /> */}
    </div>
  );
}

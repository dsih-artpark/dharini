import Select from "@/src/components/ui/select";
import type { FilterType } from "@/src/types/statistics";
import type { Wetland } from "@/src/app/(dashboard)/geolens/types";
import type { SelectOption } from "./useSurveillanceFilters";

interface SurveillanceFiltersProps {
  resetKey: number;
  show: boolean;
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
    <div className="absolute right-4 top-[68px] z-[1100] flex w-[300px] flex-col gap-2 rounded-lg border border-grey-20 bg-white p-4 shadow-xl">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-grey-80">Filters</h3>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-medium text-blue-40 hover:text-blue-60"
        >
          Reset
        </button>
      </div>

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
        options={[
          { label: "Positive", value: "positive" },
          { label: "Negative", value: "negative" },
          { label: "Inconclusive", value: "unclear" },
        ]}
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

"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import {
  FlaskConical,
  CheckCircle2,
  Activity,
  Building2,
  Droplet,
} from "lucide-react";

import Select from "@/src/components/ui/select";
import StatCard from "@/src/components/ui/stat-card";
import Loader from "@/src/components/ui/loader";
import { useIsSuperAdmin } from "@/src/hooks/check-permission";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { getAllProjectsApi } from "@/src/app/(dashboard)/manage/loader";
import { fetchProjectRegions } from "@/src/app/(dashboard)/project-onboarding/loader";
import { getProjectSampleTypesApi } from "@/src/app/(dashboard)/monitor/loader";
import { getProjectComparisonApi } from "@/src/app/(dashboard)/comparison/loader";
import { Disease, Region } from "@/src/types/global";
import {
  ComparisonFilterType,
  ProjectComparisonData,
} from "@/src/types/statistics";

import SampleTypeBar from "@/src/components/comparison/sample-type-bar";
import ProjectTrendLine from "@/src/components/comparison/project-trend-line";
import PositiveDonut, {
  DonutItem,
} from "@/src/components/comparison/disease-donut";
import ComparisonMatrixTable from "@/src/components/comparison/comparison-matrix-table";
import DiseaseProjectTrendLine from "@/src/components/comparison/disease-project-trend-line";

const toStartOfDayISO = (date: string) =>
  new Date(`${date}T00:00:00`).toISOString();
const toEndOfDayISO = (date: string) =>
  new Date(`${date}T23:59:59`).toISOString();

const asArray = (v: string | string[]) => (Array.isArray(v) ? v : v ? [v] : []);

const emptyFilters: ComparisonFilterType = {
  projectId: [],
  stateId: [],
  districtId: [],
  diseaseId: [],
  sampleTypeId: [],
  startDate: "",
  endDate: "",
};

export default function ProjectComparison() {
  const isSuperAdmin = useIsSuperAdmin();
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProjectComparisonData>();

  const [allProjects, setAllProjects] = useState<
    { id: string; name: string }[]
  >([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [sampleTypes, setSampleTypes] = useState<
    { id: string; name: string }[]
  >([]);
  const [states, setStates] = useState<Region[]>([]);

  const [filters, setFilters] = useState<ComparisonFilterType>(emptyFilters);

  // Load filter options once.
  useEffect(() => {
    const fetchOptions = async () => {
      const [projectsResponse, sampleTypeResponse, regionsResponse] =
        await Promise.all([
          // B11: scope to the currently selected workspace so the switcher
          // actually affects this tab.
          getAllProjectsApi({ limit: 1000, workspaceId: currentWorkspace?.id }),
          getProjectSampleTypesApi(),
          fetchProjectRegions(),
        ]);

      if (projectsResponse.success) {
        setAllProjects(
          projectsResponse.data.map((p) => ({ id: p.id, name: p.name })),
        );

        const projectDiseases: Disease[] = [];
        projectsResponse.data.forEach((project) => {
          project.diseases?.forEach((disease) => {
            if (!projectDiseases.find((d) => d.id === disease.id)) {
              projectDiseases.push(disease);
            }
          });
        });
        projectDiseases.sort((a, b) => a.index - b.index);
        setDiseases(projectDiseases);
      }

      if (sampleTypeResponse.success) {
        setSampleTypes(sampleTypeResponse.data || []);
      }

      if (regionsResponse.success) {
        setStates(regionsResponse.data || []);
      }
    };

    fetchOptions().catch((error) =>
      console.error("Error fetching comparison filters", error),
    );
  }, [currentWorkspace?.id]);

  // Fetch the comparison payload whenever filters change.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const hasRange = !!(filters.startDate && filters.endDate);
        const { data: payload } = await getProjectComparisonApi({
          workspaceId: currentWorkspace?.id,
          projectId:
            isSuperAdmin && filters.projectId.length
              ? filters.projectId
              : undefined,
          diseaseId: asArray(filters.diseaseId).length
            ? asArray(filters.diseaseId)
            : undefined,
          sampleTypeId: asArray(filters.sampleTypeId).length
            ? asArray(filters.sampleTypeId)
            : undefined,
          stateId: asArray(filters.stateId).length
            ? asArray(filters.stateId)
            : undefined,
          startDate: hasRange ? toStartOfDayISO(filters.startDate) : undefined,
          endDate: hasRange ? toEndOfDayISO(filters.endDate) : undefined,
        });
        setData(payload);
      } catch (error) {
        console.error("Error fetching comparison data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, isSuperAdmin, currentWorkspace?.id]);

  const handleFilterChange = (name: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => setFilters(emptyFilters);

  const summary = data?.summary;
  const projects = data?.projects ?? [];

  // When one or more diseases are selected, the donut shows the positive-sample
  // distribution across sample types for the selected disease(s); when no
  // disease is selected, it shows the disease-wise positive distribution.
  const selectedDiseaseIds = asArray(filters.diseaseId);
  const hasDiseaseFilter = selectedDiseaseIds.length > 0;
  const diseaseLabel = selectedDiseaseIds
    .map((id) => {
      const d = diseases.find((x) => x.id === id);
      return d?.shortName || d?.name || "";
    })
    .filter(Boolean)
    .join(", ");

  const donutItems: DonutItem[] = hasDiseaseFilter
    ? (data?.sampleTypeDistribution ?? []).map((s) => ({
        id: s.sampleTypeId,
        label: s.name,
        positiveCount: s.positiveCount,
        totalCount: s.totalCount,
        percentage: s.percentage,
      }))
    : (data?.diseaseDistribution ?? []).map((d) => ({
        id: d.diseaseId,
        label: d.shortName || d.name,
        positiveCount: d.positiveCount,
        totalCount: d.totalCount,
        percentage: d.percentage,
      }));

  const donutTitle = hasDiseaseFilter
    ? `Positive Sample Distribution by Sample Type${
        diseaseLabel ? ` (${diseaseLabel})` : ""
      }`
    : "Disease-wise Positive Distribution";
  const donutSubLabel = hasDiseaseFilter
    ? `Total Positive${diseaseLabel ? ` (${diseaseLabel})` : ""}`
    : "Total Positive";

  return (
    <div className="flex flex-col gap-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {isSuperAdmin && allProjects.length > 1 && (
          <Select
            name="projectId"
            isMulti
            options={allProjects.map((p) => ({ label: p.name, value: p.id }))}
            onChange={(e) => handleFilterChange("projectId", e.target.value)}
            defaultValue={filters.projectId}
            placeholder="All Projects"
          />
        )}
        <Select
          name="stateId"
          isMulti
          options={states.map((s) => ({ label: s.name, value: s.id }))}
          onChange={(e) => handleFilterChange("stateId", e.target.value)}
          defaultValue={filters.stateId}
          placeholder="All States"
        />
        <Select
          name="diseaseId"
          isMulti
          options={diseases.map((d) => ({
            label: d.shortName || d.name,
            value: d.id,
          }))}
          onChange={(e) => handleFilterChange("diseaseId", e.target.value)}
          defaultValue={filters.diseaseId}
          placeholder="All Diseases"
        />
        <Select
          name="sampleTypeId"
          isMulti
          options={sampleTypes.map((s) => ({ label: s.name, value: s.id }))}
          onChange={(e) => handleFilterChange("sampleTypeId", e.target.value)}
          defaultValue={filters.sampleTypeId}
          placeholder="All Sample Types"
        />
        <div className="flex items-center gap-2">
          <div className="h-10 px-3 py-2 bg-white rounded-lg border border-grey-40 flex items-center">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="text-grey-80 text-sm bg-transparent outline-none"
            />
          </div>
          <span className="text-grey-60 text-xs">to</span>
          <div className="h-10 px-3 py-2 bg-white rounded-lg border border-grey-40 flex items-center">
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="text-grey-80 text-sm bg-transparent outline-none"
            />
          </div>
        </div>
        <button
          className="h-10 px-3 py-2 rounded-lg border border-blue-40 text-blue-40 text-sm font-medium hover:bg-blue-10 transition-colors"
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center min-h-[400px]">
            <Loader />
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Samples"
            value={(summary?.totalSamples ?? 0).toLocaleString()}
            icon={FlaskConical}
            color="bg-blue-400"
          />
          <StatCard
            title="Positive Samples"
            value={(summary?.positiveSamples ?? 0).toLocaleString()}
            icon={CheckCircle2}
            color="bg-green-400"
          />
          <StatCard
            title="Overall Positivity Rate"
            value={summary?.positivityRate ?? 0}
            unit="%"
            icon={Activity}
            color="bg-orange-400"
          />
          <StatCard
            title="Total Projects"
            value={summary?.totalProjects ?? 0}
            icon={Building2}
            color="bg-purple-400"
          />
          <StatCard
            title="Sample Types"
            value={summary?.sampleTypeCount ?? 0}
            icon={Droplet}
            color="bg-sky-400"
          />
        </div>

        {/* Trend + distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
          <ChartCard title="Positivity Rate Trend by Project">
            <ProjectTrendLine
              data={data?.perProjectTrend ?? []}
              projects={projects}
            />
          </ChartCard>
          <ChartCard title={donutTitle}>
            <PositiveDonut items={donutItems} centerSubLabel={donutSubLabel} />
          </ChartCard>
        </div>

        {/* Disease-wise trend (full width) */}
        <div className="pt-6">
          <ChartCard title="Positivity Rate Trend by Disease">
            <DiseaseProjectTrendLine
              data={data?.perProjectDiseaseTrend ?? []}
              perDiseaseTrend={data?.perDiseaseTrend ?? []}
              projects={projects}
              diseases={data?.diseasesInScope ?? []}
            />
          </ChartCard>
        </div>

        {/* Positivity by sample type (full width — grows with categories) */}
        <div className="pt-6">
          <ChartCard title="Positivity by Sample Type">
            <SampleTypeBar
              data={data?.sampleTypeAverages ?? []}
              totalSamples={summary?.totalSamples ?? 0}
            />
          </ChartCard>
        </div>

        {/* Matrix table */}
        <div className="pt-6">
          <div className="bg-white rounded-xl border border-grey-20 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-grey-20">
              <h2 className="text-base font-semibold text-grey-90">
                Positivity Rate (%) by Sample Type Across Projects
              </h2>
            </div>
            <ComparisonMatrixTable
              matrix={data?.matrix ?? []}
              projects={projects}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-grey-20 shadow-sm p-5 flex flex-col gap-3">
      <h2 className="text-base font-semibold text-grey-90">{title}</h2>
      {children}
    </div>
  );
}

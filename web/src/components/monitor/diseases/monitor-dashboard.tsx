"use client";

import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { ResponsiveContainer, Tooltip, Cell, PieChart, Pie } from "recharts";
import {
  Activity,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from "lucide-react";

import { userAtom } from "@/src/store/userAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import Select from "@/src/components/ui/select";
import StatCard from "@/src/components/ui/stat-card";
import Loader from "@/src/components/ui/loader";
import { getAllProjectsApi } from "@/src/app/(dashboard)/manage/loader";
import {
  fetchProjectRegions,
  fetchRegionsByRegionId,
} from "@/src/app/(dashboard)/project-onboarding/loader";
import { getProjectSitesApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import {
  getMonitorDashboardStatsApi,
  getProjectSampleTypesApi,
} from "@/src/app/(dashboard)/monitor/loader";
import { Disease, Region } from "@/src/types/global";
import { SampleType } from "@/src/types/sample";
import { FilterType, MonitorDashboardData } from "@/src/types/statistics";
import DataAnalysisTable from "@/src/components/monitor/data-analysis/data-analysis-table";

import ExploreSites from "@/src/components/monitor/diseases/explore-sites";
// import PositiveSitesStat from "@/src/components/monitor/diseases/positive-sites-stat";
import HeatmapTrend from "@/src/components/monitor/diseases/heatmap-trend";
import SampleTypeTrend from "@/src/components/monitor/diseases/sample-type-trend";
import SiteLineTrend from "@/src/components/monitor/diseases/site-wise-trend";
import TemporalTrend from "@/src/components/monitor/diseases/temporal-trend";

const RESULT_LABELS: Record<string, string> = {
  positive: "Positive",
  negative: "Negative",
  unclear: "Inconclusive",
};

const DISEASE_COLORS: Record<string, string> = {
  FMD: "#5856D6",
  LSD: "#16A34A",
};

const FALLBACK_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
];

const getColor = (diseaseShortName: string, index: number): string =>
  DISEASE_COLORS[diseaseShortName] ||
  FALLBACK_COLORS[index % FALLBACK_COLORS.length];

const toStartOfDayISO = (date: string) =>
  new Date(`${date}T00:00:00`).toISOString();

const toEndOfDayISO = (date: string) =>
  new Date(`${date}T23:59:59`).toISOString();

const asArray = (value: string | string[]): string[] =>
  Array.isArray(value) ? value : value ? [value] : [];

export default function MonitorDashboard() {
  const user = useAtomValue(userAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const { resolveProjectId, workspaceProjects } = useCurrentProjectResolver();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<MonitorDashboardData>();
  const [trendView, setTrendView] = useState<
    "temporal" | "site-wise" | "sample-wise"
  >("temporal");

  const [allProjects, setAllProjects] = useState<
    { id: string; name: string; diseases: Disease[]; regions: Region[] }[]
  >([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [allDiseases, setAllDiseases] = useState<Disease[]>([]);
  const [sampleTypes, setSampleTypes] = useState<SampleType[]>([]);
  const [allSites, setAllSites] = useState<
    { id: string; name: string; stateId?: string; districtId?: string }[]
  >([]);

  const [states, setStates] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);

  const [filters, setFilters] = useState<FilterType>({
    stateId: [],
    districtId: [],
    diseaseId: [],
    siteId: [],
    sampleTypeId: [],
    testResult: [],
    variant: [],
    startDate: "",
    endDate: "",
  });

  const resultFocusLabel =
    Array.isArray(filters.testResult) && filters.testResult.length > 0
      ? RESULT_LABELS[filters.testResult[0]] || "Positive"
      : typeof filters.testResult === "string" && filters.testResult
        ? RESULT_LABELS[filters.testResult] || "Positive"
        : "Positive";

  const aiDiseaseId = diseases.find(
    (d) => d.shortName?.toUpperCase() === "AI",
  )?.id;
  const aiSelected =
    !!aiDiseaseId &&
    (Array.isArray(filters.diseaseId)
      ? filters.diseaseId.includes(aiDiseaseId)
      : filters.diseaseId === aiDiseaseId);

  useEffect(() => {
    if (!user) return; // wait until user is loaded

    const fetchFilters = async () => {
      const [regionsResponse, sampleTypeResponse, projectsResponse] =
        await Promise.all([
          fetchProjectRegions(),
          getProjectSampleTypesApi(),
          // Backend scopes this to the user's projects automatically:
          // - Super admin gets all projects
          // - Regular users get only the projects they are members of
          // B11: also scope to the currently selected workspace so the
          // switcher actually affects this page.
          getAllProjectsApi({ limit: 1000, workspaceId: currentWorkspace?.id }),
        ]);

      if (regionsResponse.success) {
        setStates(regionsResponse.data || []);
      }

      if (sampleTypeResponse.success) {
        setSampleTypes(sampleTypeResponse.data || []);
      }

      if (projectsResponse.success) {
        const projects = projectsResponse.data.map((p) => ({
          id: p.id,
          name: p.name,
          diseases: p.diseases,
          regions: p.regions,
        }));
        setAllProjects(projects);

        const projectDiseases: Disease[] = [];
        projects.forEach((project) => {
          project.diseases.forEach((disease) => {
            if (!projectDiseases.find((d) => d.id === disease.id)) {
              projectDiseases.push(disease);
            }
          });
        });
        projectDiseases.sort((a, b) => a.index - b.index);
        setAllDiseases(projectDiseases);
        setDiseases(projectDiseases);
      }
    };

    setSelectedProjectId("");
    fetchFilters().catch((error) =>
      console.error("Error fetching filters", error),
    );
  }, [user, currentWorkspace?.id]);

  useEffect(() => {
    const isSuperAdmin = user?.roles?.[0]?.role?.scope === "system";
    // 4.4: falls back to the current workspace's first project when the
    // caller has no selection and no fixed user.project (workspace-admins).
    const projectId = resolveProjectId(selectedProjectId);

    if (!projectId && !isSuperAdmin) return;

    // Use default values for optional params if they are missing
    getProjectSitesApi(projectId, {
      disease: "",
      siteType: "",
      startDate: "",
      endDate: "",
      search: "",
      testResult: "",
    })
      .then((response) => {
        if (response.success) {
          setAllSites(
            (response.data || [])
              .filter((site) => site.id && site.name)
              .map((site) => ({
                id: site.id as string,
                name: site.name as string,
                stateId: site.location?.region?.parentRegion?.id || undefined,
                districtId: site.location?.region?.id || undefined,
              })),
          );
        }
      })
      .catch((error) => console.error("Error fetching sites", error));
  }, [user, selectedProjectId, workspaceProjects]);

  useEffect(() => {
    const stateId = Array.isArray(filters.stateId)
      ? filters.stateId[0]
      : filters.stateId;

    if (!stateId) {
      setDistricts([]);
      return;
    }

    fetchRegionsByRegionId(stateId)
      .then((response) => {
        if (response.success) {
          const allDistricts = response.data?.subRegions || [];
          // Only show districts that have at least one site
          const siteDistrictIds = new Set(
            allSites
              .filter(
                (site) =>
                  site.stateId &&
                  (Array.isArray(filters.stateId)
                    ? filters.stateId
                    : [filters.stateId]
                  ).includes(site.stateId),
              )
              .map((site) => site.districtId)
              .filter(Boolean),
          );
          const filtered = allDistricts.filter((d) =>
            siteDistrictIds.has(d.id),
          );
          setDistricts(filtered);
        }
      })
      .catch((error) => console.error("Error fetching districts", error));
  }, [filters.stateId, allSites]);

  const filteredSites = useMemo(() => {
    const selectedStates = Array.isArray(filters.stateId)
      ? filters.stateId
      : filters.stateId
        ? [filters.stateId]
        : [];

    if (selectedStates.length === 0) return allSites;

    return allSites.filter(
      (site) => site.stateId && selectedStates.includes(site.stateId),
    );
  }, [allSites, filters.stateId]);

  // When project selection changes, update states + diseases + reset downstream filters
  useEffect(() => {
    if (!selectedProjectId) {
      // No project selected — show all states and diseases
      setStates([]); // will re-fetch below
      setDistricts([]);
      setDiseases(allDiseases);
      // Re-fetch all project regions
      fetchProjectRegions()
        .then((r) => {
          if (r.success) setStates(r.data || []);
        })
        .catch(console.error);
      // Bail out with the same `prev` reference when nothing actually
      // changes — a new (even value-identical) `filters` object here
      // re-triggers every child's useEffect([...,filters]), causing
      // redundant fetches on the map and data-analysis table.
      // `variant` goes too: its selector is only shown while AI is selected,
      // so once the disease reset hides it, a kept value would still filter.
      setFilters((prev) => {
        const alreadyReset =
          prev.projectId === undefined &&
          asArray(prev.stateId).length === 0 &&
          asArray(prev.districtId).length === 0 &&
          asArray(prev.diseaseId).length === 0 &&
          asArray(prev.siteId).length === 0 &&
          asArray(prev.variant ?? []).length === 0;
        if (alreadyReset) return prev;
        return {
          ...prev,
          projectId: undefined,
          stateId: [],
          districtId: [],
          diseaseId: [],
          siteId: [],
          variant: [],
        };
      });
      return;
    }

    const project = allProjects.find((p) => p.id === selectedProjectId);
    if (!project) return;

    // States come from project.regions (top-level = states)
    const projectStates = project.regions.filter(
      (r) => r.regionType === "state" || !r.parentRegion,
    );
    setStates(projectStates);
    setDistricts([]);

    // Diseases from project
    const projectDiseases = [...project.diseases].sort(
      (a, b) => a.index - b.index,
    );
    setDiseases(projectDiseases);

    // Reset dependent filters (same no-op guard and `variant` reset as above)
    setFilters((prev) => {
      const alreadyMatches =
        prev.projectId === selectedProjectId &&
        asArray(prev.stateId).length === 0 &&
        asArray(prev.districtId).length === 0 &&
        asArray(prev.diseaseId).length === 0 &&
        asArray(prev.siteId).length === 0 &&
        asArray(prev.variant ?? []).length === 0;
      if (alreadyMatches) return prev;
      return {
        ...prev,
        projectId: selectedProjectId,
        stateId: [],
        districtId: [],
        diseaseId: [],
        siteId: [],
        variant: [],
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId, allProjects, allDiseases]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { data } = await getMonitorDashboardStatsApi({
          workspaceId: currentWorkspace?.id,
          projectId: filters.projectId || undefined,
          diseaseId: filters.diseaseId || undefined,
          siteId: filters.siteId || undefined,
          sampleTypeId: filters.sampleTypeId || undefined,
          testResult: filters.testResult || undefined,
          variant: filters.variant || undefined,
          startDate:
            filters.startDate && filters.endDate
              ? toStartOfDayISO(filters.startDate)
              : undefined,
          endDate:
            filters.startDate && filters.endDate
              ? toEndOfDayISO(filters.endDate)
              : undefined,
          stateId: filters.stateId || undefined,
          districtId: filters.districtId || undefined,
        });
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [filters, currentWorkspace?.id]);

  const summary = dashboardData?.summary;

  const handleFilterChange = (name: string, value: string | string[]) => {
    setFilters((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "stateId") {
        next.districtId = [];
        next.siteId = [];
      }
      if (name === "diseaseId") {
        const selected = Array.isArray(value) ? value : value ? [value] : [];
        if (!aiDiseaseId || !selected.includes(aiDiseaseId)) {
          next.variant = [];
        }
      }
      return next;
    });
  };

  const resetFilters = () => {
    setSelectedProjectId("");
    setFilters({
      stateId: [],
      districtId: [],
      diseaseId: [],
      siteId: [],
      sampleTypeId: [],
      testResult: [],
      variant: [],
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="sm:px-8 pt-6 pb-10 bg-subtle border-b border-grey-20 flex-col justify-start items-start gap-6 inline-flex overflow-hidden">
      <div className="self-stretch justify-between items-start inline-flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-grey-80 text-[28px] font-semibold font-noto-serif leading-[36px]">
            Disease Surveillance Dashboard
          </h1>
          <p className="text-grey-70 text-sm leading-[21px]">
            Weekly sample collection and results monitoring
          </p>
        </div>
        <div className="self-stretch justify-start items-center gap-3 flex flex-wrap">
          {/* Project selector — visible only when there are multiple projects (super admin) */}
          {allProjects.length > 1 && (
            <Select
              name="projectId"
              options={[
                { label: "All Projects", value: "" },
                ...allProjects.map((p) => ({ label: p.name, value: p.id })),
              ]}
              onChange={(e) => setSelectedProjectId(e.target.value as string)}
              defaultValue={selectedProjectId}
              placeholder="All Projects"
            />
          )}
          <Select
            name="stateId"
            isMulti
            options={states.map((state) => ({
              label: state.name,
              value: state.id,
            }))}
            onChange={(e) => handleFilterChange("stateId", e.target.value)}
            defaultValue={filters.stateId}
            placeholder="All States"
          />
          <Select
            name="districtId"
            isMulti
            options={districts.map((district) => ({
              label: district.name,
              value: district.id,
            }))}
            onChange={(e) => handleFilterChange("districtId", e.target.value)}
            defaultValue={filters.districtId}
            placeholder="All Districts"
            noResultsText="Please select a state"
          />
          <Select
            name="diseaseId"
            isMulti
            options={diseases.map((disease) => ({
              label: disease.shortName || disease.name,
              value: disease.id,
            }))}
            onChange={(e) => handleFilterChange("diseaseId", e.target.value)}
            defaultValue={filters.diseaseId}
            placeholder="All Diseases"
          />
          {aiSelected && (
            <Select
              name="variant"
              isMulti
              options={[
                { label: "H", value: "H" },
                { label: "N", value: "N" },
              ]}
              onChange={(e) => handleFilterChange("variant", e.target.value)}
              defaultValue={filters.variant}
              placeholder="H / N"
            />
          )}
          <Select
            name="siteId"
            isMulti
            options={filteredSites.map((site) => ({
              label: site.name,
              value: site.id,
            }))}
            onChange={(e) => handleFilterChange("siteId", e.target.value)}
            defaultValue={filters.siteId}
            placeholder="All Sites"
          />
          <Select
            name="sampleTypeId"
            isMulti
            options={sampleTypes.map((sampleType) => ({
              label: sampleType.name,
              value: sampleType.id,
            }))}
            onChange={(e) => handleFilterChange("sampleTypeId", e.target.value)}
            defaultValue={filters.sampleTypeId}
            placeholder="Sample Type"
          />
          <Select
            name="testResult"
            isMulti
            options={[
              { label: "Positive", value: "positive" },
              { label: "Negative", value: "negative" },
              { label: "Inconclusive", value: "unclear" },
            ]}
            onChange={(e) => handleFilterChange("testResult", e.target.value)}
            defaultValue={filters.testResult}
            placeholder="All Results"
          />
          <div className="flex items-center gap-2">
            <div className="h-10 px-3 py-2 bg-white rounded border border-grey-40 flex items-center gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                className="text-grey-80 text-sm leading-[21px] bg-transparent outline-none"
              />
            </div>
            <span className="text-grey-60 text-xs">to</span>
            <div className="h-10 px-3 py-2 bg-white rounded border border-grey-40 flex items-center gap-2">
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="text-grey-80 text-sm leading-[21px] bg-transparent outline-none"
              />
            </div>
          </div>
          <button
            className="h-10 px-3 py-2 rounded border border-blue-40 text-blue-40 text-sm leading-[21px]"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="relative self-stretch">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-[1001] flex items-center justify-center min-h-[400px]">
            <Loader />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Samples Collected"
            value={summary?.totalSamples ?? 0}
            icon={FlaskConical}
            color="bg-blue-400"
          />
          <StatCard
            title="Samples Processed"
            value={summary?.processedSamples ?? 0}
            icon={CheckCircle2}
            color="bg-green-400"
          />
          <StatCard
            title="Positivity Rate"
            value={summary?.positivityRate ?? 0}
            unit="%"
            icon={Activity}
            color="bg-orange-400"
          />
          <StatCard
            title={`${resultFocusLabel} Sites`}
            value={summary?.positiveSites ?? 0}
            icon={MapPin}
            color="bg-purple-400"
          />
          <StatCard
            title="Inconclusive Results"
            value={summary?.inconclusiveSamples ?? 0}
            icon={AlertCircle}
            color="bg-red-400"
          />
        </div>

        <div className="mt-6 bg-white rounded-xl border border-grey-20 shadow-sm">
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-grey-90">
                  {trendView === "temporal" && "Temporal Trend"}
                  {trendView === "site-wise" && "Site Trends"}
                  {trendView === "sample-wise" && "Sample Type Trend"}
                </h2>
                <p className="text-sm text-grey-70">
                  {trendView === "temporal" &&
                    "Total samples collected with positive and negative results over time"}
                  {trendView === "site-wise" &&
                    "Sample trends and activity heatmap by site"}
                  {trendView === "sample-wise" &&
                    "Total samples collected by type over time"}
                </p>
              </div>
              <div className="flex items-center bg-grey-5 rounded-lg p-0.5 border border-grey-20 shrink-0">
                <button
                  onClick={() => setTrendView("temporal")}
                  className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                    trendView === "temporal"
                      ? "bg-white text-grey-80 shadow-sm font-medium"
                      : "text-grey-60"
                  }`}
                >
                  Aggregated
                </button>
                <button
                  onClick={() => setTrendView("site-wise")}
                  className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                    trendView === "site-wise"
                      ? "bg-white text-grey-80 shadow-sm font-medium"
                      : "text-grey-60"
                  }`}
                >
                  Site-wise
                </button>
                <button
                  onClick={() => setTrendView("sample-wise")}
                  className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                    trendView === "sample-wise"
                      ? "bg-white text-grey-80 shadow-sm font-medium"
                      : "text-grey-60"
                  }`}
                >
                  Sample-wise
                </button>
              </div>
            </div>
          </div>
          <div className="px-5 pb-5">
            {trendView === "temporal" && (
              <TemporalTrend data={dashboardData?.trend || []} />
            )}
            {trendView === "site-wise" && (
              <>
                <SiteLineTrend data={dashboardData?.siteTrend || []} />
                <div className="mt-6" />
                <HeatmapTrend data={dashboardData?.siteTrend || []} />
              </>
            )}
            {trendView === "sample-wise" && (
              <SampleTypeTrend data={dashboardData?.sampleTypeTrend || []} />
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl border border-grey-20 shadow-sm p-5">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-grey-90">
              Disease-wise {resultFocusLabel} Cases
            </h2>
            <p className="text-sm text-grey-70">
              Distribution of {resultFocusLabel.toLowerCase()} samples across
              diseases
            </p>
          </div>

          {dashboardData?.diseasePositive &&
          dashboardData.diseasePositive.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Donut Chart */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-[240px] h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.diseasePositive}
                        dataKey="positiveSamples"
                        nameKey="diseaseShortName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={65}
                        stroke="none"
                        paddingAngle={2}
                      >
                        {dashboardData.diseasePositive.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getColor(entry.diseaseShortName, index)}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          `${value} cases`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-grey-90">
                      {dashboardData.diseasePositive.reduce(
                        (sum, d) => sum + d.positiveSamples,
                        0,
                      )}
                    </span>
                    <span className="text-xs text-grey-60 mt-0.5">
                      Total {resultFocusLabel} Cases
                    </span>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {dashboardData.diseasePositive.map((entry, index) => (
                    <div
                      key={entry.diseaseShortName}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: getColor(
                            entry.diseaseShortName,
                            index,
                          ),
                        }}
                      />
                      <span className="text-xs text-grey-70">
                        {entry.diseaseShortName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Table */}
              <div className="lg:col-span-2">
                <div className="overflow-hidden rounded-lg border border-grey-20">
                  <table className="w-full text-sm">
                    <thead className="bg-grey-10">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-grey-70 uppercase tracking-wider">
                          Disease
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-grey-70 uppercase tracking-wider">
                          {resultFocusLabel} Cases
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-grey-70 uppercase tracking-wider w-1/2">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-grey-20">
                      {(() => {
                        const total = dashboardData.diseasePositive.reduce(
                          (sum, d) => sum + d.positiveSamples,
                          0,
                        );
                        return dashboardData.diseasePositive.map(
                          (entry, index) => {
                            const percentage =
                              total > 0
                                ? Math.round(
                                    (entry.positiveSamples / total) * 100,
                                  )
                                : 0;
                            const color = getColor(
                              entry.diseaseShortName,
                              index,
                            );
                            return (
                              <tr
                                key={entry.diseaseShortName}
                                className="hover:bg-grey-5 transition-colors"
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <span
                                      className="w-2.5 h-2.5 rounded-full shrink-0"
                                      style={{ backgroundColor: color }}
                                    />
                                    <span className="font-medium text-grey-90">
                                      {entry.diseaseShortName}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="font-semibold text-grey-90">
                                    {entry.positiveSamples}
                                  </span>
                                  <span className="text-grey-60 ml-1">
                                    cases
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-grey-20 rounded-full overflow-hidden">
                                      <div
                                        className="h-full rounded-full"
                                        style={{
                                          width: `${percentage}%`,
                                          backgroundColor: color,
                                        }}
                                      />
                                    </div>
                                    <span className="text-sm font-semibold text-grey-90 w-10 text-right">
                                      {percentage}%
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          },
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-grey-60 text-sm">
              No disease data available
            </div>
          )}
        </div>

        <ExploreSites filters={filters} workspaceId={currentWorkspace?.id} />
        <DataAnalysisTable
          filters={filters}
          workspaceId={currentWorkspace?.id}
        />
        {/* <PositiveSitesStat filters={filters} /> */}
      </div>
    </div>
  );
}

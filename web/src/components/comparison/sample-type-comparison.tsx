"use client";

import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";

import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { userAtom } from "@/src/store/userAtom";
import Select from "@/src/components/ui/select";
import Loader from "@/src/components/ui/loader";
import { useIsSuperAdmin } from "@/src/hooks/check-permission";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import { getAllProjectsApi } from "@/src/app/(dashboard)/manage/loader";
import { getProjectSampleTypesApi } from "@/src/app/(dashboard)/monitor/loader";
import { getProjectSitesApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { fetchProjectRegions } from "@/src/app/(dashboard)/project-onboarding/loader";
import { getSampleTypeComparisonApi } from "@/src/app/(dashboard)/comparison/loader";
import { Region } from "@/src/types/global";
import { SampleTypeComparisonData } from "@/src/types/statistics";
import { PAIR_COLORS } from "@/src/components/comparison/colors";

import SampleTypeTrendLine from "@/src/components/comparison/sample-type-trend-line";
import SampleTypeCountBar from "@/src/components/comparison/sample-type-count-bar";
import SampleTypeProjectBar from "@/src/components/comparison/sample-type-project-bar";
import SampleTypeProjectTable from "@/src/components/comparison/sample-type-project-table";
import SampleTypeDiseaseTable from "@/src/components/comparison/sample-type-disease-table";

const toStartOfDayISO = (date: string) =>
  new Date(`${date}T00:00:00`).toISOString();
const toEndOfDayISO = (date: string) =>
  new Date(`${date}T23:59:59`).toISOString();

const asArray = (v: string | string[]) => (Array.isArray(v) ? v : v ? [v] : []);

type Option = { id: string; name: string };

export default function SampleTypeComparison() {
  const user = useAtomValue(userAtom);
  const isSuperAdmin = useIsSuperAdmin();
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const { resolveProjectId } = useCurrentProjectResolver();

  const [allProjects, setAllProjects] = useState<Option[]>([]);
  const [projectId, setProjectId] = useState("");
  const [sampleTypes, setSampleTypes] = useState<Option[]>([]);
  const [states, setStates] = useState<Region[]>([]);
  const [sites, setSites] = useState<Option[]>([]);

  const [type1Id, setType1Id] = useState("");
  const [type2Id, setType2Id] = useState("");
  const [siteId, setSiteId] = useState<string[]>([]);
  const [stateId, setStateId] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // The project whose sites we list: super-admin's pick (or "" = all sites),
  // otherwise the scoped user's own project, falling back (4.4) to the
  // current workspace's first project for workspace-admins with no fixed
  // user.project.
  const effectiveProjectId = isSuperAdmin ? projectId : resolveProjectId();

  const [data, setData] = useState<SampleTypeComparisonData>();
  const [loading, setLoading] = useState(false);

  // Load filter options once.
  useEffect(() => {
    if (!user) return;
    Promise.all([
      getProjectSampleTypesApi(),
      fetchProjectRegions(),
      isSuperAdmin
        ? getAllProjectsApi({ limit: 1000, workspaceId: currentWorkspace?.id })
        : Promise.resolve(null),
    ])
      .then(([typesRes, regionsRes, projectsRes]) => {
        if (typesRes.success) setSampleTypes(typesRes.data || []);
        if (regionsRes.success) setStates(regionsRes.data || []);
        if (projectsRes && projectsRes.success) {
          setAllProjects(
            projectsRes.data.map((p) => ({ id: p.id, name: p.name })),
          );
        }
      })
      .catch((e) =>
        console.error("Error loading sample-comparison filters", e),
      );
    setProjectId("");
    setSiteId([]);
    setData(undefined);
  }, [user, isSuperAdmin, currentWorkspace?.id]);

  // Default to the first two sample types for an immediate view.
  useEffect(() => {
    if (sampleTypes.length >= 2) {
      setType1Id((prev) => prev || sampleTypes[0].id);
      setType2Id((prev) => prev || sampleTypes[1].id);
    }
  }, [sampleTypes]);

  // Load sites for the "Site" filter (all by default). getProjectSitesApi("")
  // hits the scoped /sites endpoint, so "All Projects" lists every accessible
  // site; a specific project lists that project's sites.
  useEffect(() => {
    if (!user) return;
    getProjectSitesApi(effectiveProjectId, {
      disease: "",
      siteType: "",
      startDate: "",
      endDate: "",
      search: "",
      testResult: "",
    })
      .then((res) => {
        if (res.success) {
          setSites(
            (res.data || [])
              .filter((s) => s.id && s.name)
              .map((s) => ({ id: s.id as string, name: s.name as string })),
          );
        }
      })
      .catch((e) => console.error("Error loading sites", e));
    setSiteId([]);
  }, [user, effectiveProjectId]);

  // Fetch once both sample types are chosen.
  useEffect(() => {
    if (!type1Id || !type2Id) {
      setData(undefined);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const hasRange = !!(startDate && endDate);
        const { data: payload } = await getSampleTypeComparisonApi({
          projectId: isSuperAdmin && projectId ? projectId : undefined,
          sampleType1Id: type1Id,
          sampleType2Id: type2Id,
          siteId: siteId.length ? siteId : undefined,
          stateId: stateId.length ? stateId : undefined,
          startDate: hasRange ? toStartOfDayISO(startDate) : undefined,
          endDate: hasRange ? toEndOfDayISO(endDate) : undefined,
        });
        setData(payload);
      } catch (e) {
        console.error("Error fetching sample comparison", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    projectId,
    type1Id,
    type2Id,
    siteId,
    stateId,
    startDate,
    endDate,
    isSuperAdmin,
  ]);

  const nameOf = (id: string) =>
    sampleTypes.find((s) => s.id === id)?.name || "";

  const typePair = useMemo(
    () => [
      { id: type1Id, name: nameOf(type1Id) },
      { id: type2Id, name: nameOf(type2Id) },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type1Id, type2Id, sampleTypes],
  );

  const bothSelected = !!type1Id && !!type2Id;
  const sum1 = data?.summary[type1Id];
  const sum2 = data?.summary[type2Id];

  return (
    <div className="flex flex-col gap-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3">
        {isSuperAdmin && (
          <Field label="Project">
            <Select
              name="projectId"
              options={[
                { label: "All Projects", value: "" },
                ...allProjects.map((p) => ({ label: p.name, value: p.id })),
              ]}
              onChange={(e) => setProjectId(e.target.value as string)}
              defaultValue={projectId}
              placeholder="All Projects"
            />
          </Field>
        )}
        <Field label="Sample Type 1">
          <Select
            name="type1Id"
            options={sampleTypes
              .filter((s) => s.id !== type2Id)
              .map((s) => ({ label: s.name, value: s.id }))}
            onChange={(e) => setType1Id(e.target.value as string)}
            defaultValue={type1Id}
            placeholder="Select sample type"
          />
        </Field>
        <Field label="Sample Type 2">
          <Select
            name="type2Id"
            options={sampleTypes
              .filter((s) => s.id !== type1Id)
              .map((s) => ({ label: s.name, value: s.id }))}
            onChange={(e) => setType2Id(e.target.value as string)}
            defaultValue={type2Id}
            placeholder="Select sample type"
          />
        </Field>
        <Field label="State">
          <Select
            name="stateId"
            isMulti
            options={states.map((s) => ({ label: s.name, value: s.id }))}
            onChange={(e) => setStateId(asArray(e.target.value))}
            defaultValue={stateId}
            placeholder="All States"
          />
        </Field>
        <Field label="Site">
          <Select
            name="siteId"
            isMulti
            options={sites.map((s) => ({ label: s.name, value: s.id }))}
            onChange={(e) => setSiteId(asArray(e.target.value))}
            defaultValue={siteId}
            placeholder="All Sites"
          />
        </Field>
        <Field label="Date Range">
          <div className="flex items-center gap-2">
            <div className="h-10 px-3 py-2 bg-white rounded border border-grey-40 flex items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-grey-80 text-sm bg-transparent outline-none"
              />
            </div>
            <span className="text-grey-60 text-xs">to</span>
            <div className="h-10 px-3 py-2 bg-white rounded border border-grey-40 flex items-center">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-grey-80 text-sm bg-transparent outline-none"
              />
            </div>
          </div>
        </Field>
      </div>

      {!bothSelected ? (
        <div className="h-[320px] flex items-center justify-center text-grey-60 text-sm border border-dashed border-grey-30 rounded-xl bg-white">
          Select two sample types to compare their positivity.
        </div>
      ) : (
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center min-h-[400px]">
              <Loader />
            </div>
          )}

          {/* KPI cards: 3 per sample type */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <MetricCard
              label="Total Samples"
              sub={typePair[0].name}
              value={(sum1?.totalSamples ?? 0).toLocaleString()}
              accent={PAIR_COLORS[0]}
              bg="bg-blue-10"
              border="border-blue-20"
            />
            <MetricCard
              label="Positive Samples"
              sub={typePair[0].name}
              value={(sum1?.positiveSamples ?? 0).toLocaleString()}
              accent={PAIR_COLORS[0]}
              bg="bg-blue-10"
              border="border-blue-20"
            />
            <MetricCard
              label="Positivity Rate"
              sub={typePair[0].name}
              value={`${(sum1?.positivityRate ?? 0).toFixed(1)}%`}
              accent={PAIR_COLORS[0]}
              bg="bg-blue-10"
              border="border-blue-20"
            />
            <MetricCard
              label="Total Samples"
              sub={typePair[1].name}
              value={(sum2?.totalSamples ?? 0).toLocaleString()}
              accent={PAIR_COLORS[1]}
              bg="bg-green-10"
              border="border-green-20"
            />
            <MetricCard
              label="Positive Samples"
              sub={typePair[1].name}
              value={(sum2?.positiveSamples ?? 0).toLocaleString()}
              accent={PAIR_COLORS[1]}
              bg="bg-green-10"
              border="border-green-20"
            />
            <MetricCard
              label="Positivity Rate"
              sub={typePair[1].name}
              value={`${(sum2?.positivityRate ?? 0).toFixed(1)}%`}
              accent={PAIR_COLORS[1]}
              bg="bg-green-10"
              border="border-green-20"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
            <ChartCard
              title="Positivity Rate Trend Over Time (%)"
              subtitle={`${typePair[0].name} vs ${typePair[1].name}`}
            >
              <SampleTypeTrendLine
                trend={data?.trend ?? []}
                sampleTypes={typePair}
              />
            </ChartCard>
            <ChartCard
              title="Positive Samples Count Over Time"
              subtitle={`${typePair[0].name} vs ${typePair[1].name}`}
            >
              <SampleTypeCountBar
                trend={data?.trend ?? []}
                sampleTypes={typePair}
              />
            </ChartCard>
            <ChartCard title="Positivity Rate Comparison (%) by Project">
              <SampleTypeProjectBar
                byProject={data?.byProject ?? []}
                sampleTypes={typePair}
              />
            </ChartCard>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
            <TableCard
              title="Positivity Rate (%) by Project"
              subtitle="Detailed Comparison"
            >
              <SampleTypeProjectTable
                byProject={data?.byProject ?? []}
                sampleTypes={typePair}
                summary={data?.summary ?? {}}
              />
            </TableCard>
            <TableCard
              title="Disease-wise Positive Samples"
              subtitle="Comparison"
            >
              <SampleTypeDiseaseTable
                diseaseComparison={data?.diseaseComparison ?? []}
                sampleTypes={typePair}
                summary={data?.summary ?? {}}
              />
            </TableCard>
          </div>

          <div className="pt-4 text-grey-60 text-xs">
            Positivity Rate (%) = (Positive Samples / Total Samples) × 100
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-grey-70">{label}</span>
      {children}
    </div>
  );
}

function MetricCard({
  label,
  sub,
  value,
  accent,
  bg,
  border,
}: {
  label: string;
  sub: string;
  value: string;
  accent: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className={`p-4 rounded-xl ${bg} border ${border} flex flex-col gap-1`}
    >
      <span className="text-grey-70 text-xs font-medium">{label}</span>
      <span className="text-grey-50 text-[11px] truncate">{sub}</span>
      <span className="text-2xl font-bold mt-1" style={{ color: accent }}>
        {value}
      </span>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-grey-20 shadow-sm p-5 flex flex-col gap-2">
      <h2 className="text-base font-semibold text-grey-90">{title}</h2>
      {subtitle && <p className="text-xs text-grey-60">{subtitle}</p>}
      <div className="mt-1">{children}</div>
    </div>
  );
}

function TableCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-grey-20 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-grey-20">
        <h2 className="text-base font-semibold text-grey-90">{title}</h2>
        {subtitle && <p className="text-xs text-grey-60 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

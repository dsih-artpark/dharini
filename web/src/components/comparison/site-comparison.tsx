"use client";

import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { ArrowUp, ArrowDown, Minus, FlaskConical } from "lucide-react";

import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { userAtom } from "@/src/store/userAtom";
import Select from "@/src/components/ui/select";
import Loader from "@/src/components/ui/loader";
import { useIsSuperAdmin } from "@/src/hooks/check-permission";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import { getAllProjectsApi } from "@/src/app/(dashboard)/manage/loader";
import { getProjectSitesApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { getProjectSampleTypesApi } from "@/src/app/(dashboard)/monitor/loader";
import { getSiteComparisonApi } from "@/src/app/(dashboard)/comparison/loader";
import { SiteComparisonData } from "@/src/types/statistics";
import { SITE_COLORS } from "@/src/components/comparison/colors";

import SiteTrendLine from "@/src/components/comparison/site-trend-line";
import SiteSampleTypeBar from "@/src/components/comparison/site-sample-type-bar";
import SitePositiveCountBar from "@/src/components/comparison/site-positive-count-bar";
import SiteComparisonTable from "@/src/components/comparison/site-comparison-table";

const toStartOfDayISO = (date: string) =>
  new Date(`${date}T00:00:00`).toISOString();
const toEndOfDayISO = (date: string) =>
  new Date(`${date}T23:59:59`).toISOString();

type SiteOption = { id: string; name: string };

export default function SiteComparison() {
  const user = useAtomValue(userAtom);
  const isSuperAdmin = useIsSuperAdmin();
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const { resolveProjectId, workspaceProjects } = useCurrentProjectResolver();

  const [allProjects, setAllProjects] = useState<SiteOption[]>([]);
  const [projectId, setProjectId] = useState("");
  const [sites, setSites] = useState<SiteOption[]>([]);
  const [sampleTypes, setSampleTypes] = useState<SiteOption[]>([]);

  const [site1Id, setSite1Id] = useState("");
  const [site2Id, setSite2Id] = useState("");
  const [sampleTypeId, setSampleTypeId] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [data, setData] = useState<SiteComparisonData>();
  const [loading, setLoading] = useState(false);

  // Resolve the active project: super-admins choose one; others are fixed
  // (falling back, per 4.4, to the current workspace's first project for
  // workspace-admins with no fixed user.project).
  useEffect(() => {
    if (!user) return;
    if (isSuperAdmin) {
      getAllProjectsApi({ limit: 1000, workspaceId: currentWorkspace?.id })
        .then((res) => {
          if (res.success) {
            const projects = res.data.map((p) => ({ id: p.id, name: p.name }));
            setAllProjects(projects);
            const defaultProjectId = resolveProjectId() || projects[0]?.id || "";
            setProjectId(defaultProjectId);
          }
        })
        .catch((e) => console.error("Error loading projects", e));
    } else {
      setProjectId(resolveProjectId());
    }
    setSite1Id("");
    setSite2Id("");
    setData(undefined);
  }, [user, isSuperAdmin, workspaceProjects, currentWorkspace?.id]);

  // Load sample types for the "Sample Type" filter (all by default).
  useEffect(() => {
    if (!user) return;
    getProjectSampleTypesApi()
      .then((res) => {
        if (res.success) setSampleTypes(res.data || []);
      })
      .catch((e) => console.error("Error loading sample types", e));
  }, [user]);

  // Load sites for the active project; reset the chosen sites.
  useEffect(() => {
    if (!projectId) return;
    getProjectSitesApi(projectId, {
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
    setSite1Id("");
    setSite2Id("");
  }, [projectId]);

  // Fetch the comparison once both sites are chosen.
  useEffect(() => {
    if (!site1Id || !site2Id) {
      setData(undefined);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const hasRange = !!(startDate && endDate);
        const { data: payload } = await getSiteComparisonApi({
          projectId: projectId || undefined,
          site1Id,
          site2Id,
          sampleTypeId: sampleTypeId.length ? sampleTypeId : undefined,
          startDate: hasRange ? toStartOfDayISO(startDate) : undefined,
          endDate: hasRange ? toEndOfDayISO(endDate) : undefined,
        });
        setData(payload);
      } catch (e) {
        console.error("Error fetching site comparison", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [site1Id, site2Id, sampleTypeId, startDate, endDate, projectId]);

  const nameOf = (id: string) => sites.find((s) => s.id === id)?.name || "";

  // Drive site identity from the user's selection (robust to a site that has
  // zero samples in range and is therefore absent from the backend payload).
  const sitesPair = useMemo(
    () => [
      { id: site1Id, name: nameOf(site1Id) },
      { id: site2Id, name: nameOf(site2Id) },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [site1Id, site2Id, sites],
  );

  const bothSelected = !!site1Id && !!site2Id;
  const sum1 = data?.summary[site1Id];
  const sum2 = data?.summary[site2Id];
  const rate1 = sum1?.positivityRate ?? 0;
  const rate2 = sum2?.positivityRate ?? 0;
  const diff = Math.round((rate1 - rate2) * 10) / 10;
  const sampleTypesCompared = data?.sampleTypesCompared ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {isSuperAdmin && allProjects.length > 1 && (
          <div className="flex flex-col gap-1">
            <span className="text-grey-60 text-xs font-medium">Project</span>
            <Select
              name="projectId"
              options={allProjects.map((p) => ({ label: p.name, value: p.id }))}
              onChange={(e) => setProjectId(e.target.value as string)}
              defaultValue={projectId}
              placeholder="Select project"
            />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-grey-60 text-xs font-medium">Site 1</span>
          <Select
            name="site1Id"
            options={sites
              .filter((s) => s.id !== site2Id)
              .map((s) => ({ label: s.name, value: s.id }))}
            onChange={(e) => setSite1Id(e.target.value as string)}
            defaultValue={site1Id}
            placeholder="Select site 1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-grey-60 text-xs font-medium">Site 2</span>
          <Select
            name="site2Id"
            options={sites
              .filter((s) => s.id !== site1Id)
              .map((s) => ({ label: s.name, value: s.id }))}
            onChange={(e) => setSite2Id(e.target.value as string)}
            defaultValue={site2Id}
            placeholder="Select site 2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-grey-60 text-xs font-medium">Sample Type</span>
          <Select
            name="sampleTypeId"
            isMulti
            options={sampleTypes.map((s) => ({ label: s.name, value: s.id }))}
            onChange={(e) =>
              setSampleTypeId(
                Array.isArray(e.target.value)
                  ? e.target.value
                  : e.target.value
                    ? [e.target.value]
                    : [],
              )
            }
            defaultValue={sampleTypeId}
            placeholder="All Sample Types"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-grey-60 text-xs font-medium">Date Range</span>
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
        </div>
      </div>

      {!bothSelected ? (
        <div className="h-[320px] flex flex-col items-center justify-center gap-3 text-grey-60 text-sm border border-dashed border-grey-30 rounded-xl bg-white">
          <FlaskConical className="w-8 h-8 text-grey-40" />
          Select two sites to compare their sample positivity.
        </div>
      ) : (
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center min-h-[400px]">
              <Loader />
            </div>
          )}

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SiteSummaryCard
              label={`Site 1 — ${sitesPair[0].name}`}
              total={sum1?.totalSamples ?? 0}
              positive={sum1?.positiveSamples ?? 0}
              rate={rate1}
              accent={SITE_COLORS[0]}
              bg="bg-blue-10"
              border="border-blue-20"
            />
            <SiteSummaryCard
              label={`Site 2 — ${sitesPair[1].name}`}
              total={sum2?.totalSamples ?? 0}
              positive={sum2?.positiveSamples ?? 0}
              rate={rate2}
              accent={SITE_COLORS[1]}
              bg="bg-green-10"
              border="border-green-20"
            />
            <div className="p-5 rounded-xl bg-purple-10 border border-purple-20 flex flex-col gap-2">
              <span className="text-grey-70 text-sm font-medium">
                Difference in Positivity Rate
              </span>
              <span className="text-grey-90 text-3xl font-bold">
                {Math.abs(diff).toFixed(1)}%
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-purple-30">
                {diff > 0 ? (
                  <>
                    <ArrowUp className="w-4 h-4" /> Higher in{" "}
                    {sitesPair[0].name}
                  </>
                ) : diff < 0 ? (
                  <>
                    <ArrowDown className="w-4 h-4" /> Higher in{" "}
                    {sitesPair[1].name}
                  </>
                ) : (
                  <>
                    <Minus className="w-4 h-4" /> Equal
                  </>
                )}
              </span>
            </div>
            <div className="p-5 rounded-xl bg-yellow-10 border border-yellow-20 flex flex-col gap-2">
              <span className="text-grey-70 text-sm font-medium">
                Sample Types Compared
              </span>
              <span className="text-grey-90 text-3xl font-bold">
                {sampleTypesCompared.length}
              </span>
              <span className="text-grey-60 text-xs leading-relaxed">
                {sampleTypesCompared.length
                  ? `(${sampleTypesCompared.join(", ")})`
                  : "No overlapping sample types"}
              </span>
            </div>
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
            <ChartCard title="Overall Positivity Rate Trend (%)">
              <SiteTrendLine trend={data?.trend ?? []} sites={sitesPair} />
            </ChartCard>
            <ChartCard title="Positivity Rate (%) by Sample Type">
              <SiteSampleTypeBar
                matrix={data?.sampleTypeMatrix ?? []}
                sites={sitesPair}
              />
            </ChartCard>
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
            <ChartCard title="Positive Samples Count Over Time">
              <SitePositiveCountBar
                trend={data?.trend ?? []}
                sites={sitesPair}
              />
            </ChartCard>
            <div className="bg-white rounded-xl border border-grey-20 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-grey-20">
                <h2 className="text-base font-semibold text-grey-90">
                  Positivity Rate (%) by Sample Type — Detailed Comparison
                </h2>
              </div>
              <SiteComparisonTable
                matrix={data?.sampleTypeMatrix ?? []}
                sites={sitesPair}
                summary={data?.summary ?? {}}
              />
            </div>
          </div>

          <div className="pt-4 text-grey-60 text-xs">
            Positivity Rate (%) = (Positive Samples / Total Samples) × 100
          </div>
        </div>
      )}
    </div>
  );
}

function SiteSummaryCard({
  label,
  total,
  positive,
  rate,
  accent,
  bg,
  border,
}: {
  label: string;
  total: number;
  positive: number;
  rate: number;
  accent: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className={`p-5 rounded-xl ${bg} border ${border} flex flex-col gap-3`}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <span className="text-grey-70 text-sm font-medium truncate">
          {label}
        </span>
      </div>
      <div className="flex items-end gap-6">
        <div>
          <p className="text-grey-90 text-2xl font-bold leading-none">
            {total.toLocaleString()}
          </p>
          <p className="text-grey-60 text-xs mt-1">Total Samples</p>
        </div>
        <div>
          <p className="text-grey-90 text-2xl font-bold leading-none">
            {positive.toLocaleString()}
          </p>
          <p className="text-grey-60 text-xs mt-1">Positive Samples</p>
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold" style={{ color: accent }}>
          {rate.toFixed(1)}%
        </span>
        <span className="text-grey-60 text-xs">Positivity Rate</span>
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

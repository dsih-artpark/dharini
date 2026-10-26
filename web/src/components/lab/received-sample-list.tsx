"use client";

import { useState, useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  CopyPlus,
  ArrowUpDown,
  Calendar,
  Filter,
  Barcode,
  SearchIcon,
  Columns3,
  ChevronDown,
  X,
} from "lucide-react";

import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";

import { diseaseAtom } from "@/src/store/diseaseAtom";
import { selectedProcessableSamplesAtom } from "@/src/store/processableSamplesAtom";
import Tabs from "@/src/components/ui/tabs";
import Select from "@/src/components/ui/select";
import Loader from "@/src/components/ui/loader";
import Pagination from "@/src/components/ui/pagination";
import { useHasPermission } from "@/src/hooks/check-permission";
import BulkProcessModal from "@/src/components/lab/bulk-process-modal";
import {
  fetchDisease,
  fetchSampleTypes,
  fetchRegions,
} from "@/src/app/(dashboard)/project-onboarding/loader";
import { sampleTypesAtom } from "@/src/store/sampleTypesAtom";
import { SampleType } from "@/src/types/sample";
import { Region } from "@/src/types/global";
import { getProjectSitesApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { Site } from "@/src/types/site";
import {
  getAllSamplesApi,
  getMaxRoundApi,
} from "@/src/app/(dashboard)/lab/loader";
import SampleListItem, {
  type SampleTableColumnKey,
  type SampleTableVisibleColumns,
} from "@/src/components/lab/sample-list-item";
import { Sample } from "@/src/types/sample";
import { userAtom } from "@/src/store/userAtom";
import { labAllProjectsAtom } from "@/src/store/labAllProjectsAtom";
import { ALL_PROJECTS_ID } from "@/src/lib/super-admin-lab-flow";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import {
  getSessionStorage,
  setSessionStorage,
} from "@/src/utils/session-storage";
import { SampleStatusType } from "@/src/types/sample";
import {
  SAMPLE_STATUS_TO_LAB_ACTIVITY_DATE_MAP,
  SELECT_ALL_STATUSES,
} from "@/src/utils/constant";

const TABS = [
  { id: "picked-up", label: "Collected" },
  { id: "received", label: "Received" },
  { id: "virus-isolation", label: "Virus Isolation" },
  { id: "pre-processed", label: "Pre-processed" },
  { id: "extracted", label: "Extracted" },
  { id: "rejected", label: "Rejected" },
  { id: "test-report-generated", label: "Test Results" },
];

const DEFAULT_VISIBLE_COLUMNS: SampleTableVisibleColumns = {
  sampleId: true,
  accessionId: true,
  siteName: true,
  round: true,
  disease: true,
  location: true,
  farmType: true,
  collectedBy: true,
  lastActivity: true,
};

export default function ReceivedSamplesList() {
  const user = useAtomValue(userAtom);
  const isAll = useAtomValue(labAllProjectsAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const { resolveProjectId } = useCurrentProjectResolver();
  // 4.4: workspace-admins have no user.project, so fall back to the current
  // workspace's first project.
  const effectiveProjectId = isAll ? ALL_PROJECTS_ID : resolveProjectId();
  const hasPermission = useHasPermission();
  // This list is not under /projects/:id, so the permission hook has no
  // route project id to resolve against - pass the page's own resolved
  // project explicitly. ALL_PROJECTS_ID is a UI sentinel, not a real project
  // a role can be scoped to, so it's excluded here (the "all projects" view
  // is already read-only via the `!isAll` guards below regardless).
  const canUpdateLabTest = hasPermission(
    "update",
    "sample-test",
    isAll ? undefined : effectiveProjectId,
  );
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<SampleStatusType>(
    getSessionStorage("activeTab") || TABS[0].id,
  );
  const [maxRound, setMaxRound] = useState<number>(0);

  const [filter, setFilter] = useState<{
    diseaseId?: string;
    sampleTypeId?: string;
    sampleStatus?: string;
    startDate?: string;
    endDate?: string;
    sort?: keyof Sample;
    sortOrder?: "asc" | "desc";
    stateId?: string;
    round?: number;
    siteId?: string;
    testResult?: string;
  }>({
    sortOrder: "desc",
  });
  const [search, setSearch] = useState<string>("");
  const [barcodeInput, setBarcodeInput] = useState<string>("");
  const [referenceBatchId, setReferenceBatchId] = useState<string>("");
  const [batchRefInput, setBatchRefInput] = useState<string>("");
  const [accessionId, setAccessionId] = useState<string>("");
  const [accessionIdInput, setAccessionIdInput] = useState<string>("");
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [visibleColumns, setVisibleColumns] =
    useState<SampleTableVisibleColumns>(
      () => getSessionStorage("labVisibleColumns") || DEFAULT_VISIBLE_COLUMNS,
    );
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [diseases, setDiseases] = useAtom(diseaseAtom);
  const [sampleTypes, setSampleTypes] = useAtom(sampleTypesAtom);
  const [selectedProcessableSamples, setSelectedProcessableSamples] = useAtom(
    selectedProcessableSamplesAtom,
  );
  const [states, setStates] = useState<Region[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const prevFilterRef = useRef<string>("");
  const columnFiltersRef = useRef<HTMLDivElement>(null);
  const [showDateRangePopover, setShowDateRangePopover] =
    useState<boolean>(false);
  const dateRangeRef = useRef<HTMLDivElement>(null);

  // Number of samples to fetch per page
  const [limit, setLimit] = useState<number>(10);

  const isTestResultsTab = activeTab === "test-report-generated";

  const activeFilterCount = [
    barcodeInput,
    filter.diseaseId,
    filter.sampleTypeId,
    filter.siteId,
    filter.startDate,
    filter.endDate,
    filter.stateId,
    filter.round,
    batchRefInput,
    isTestResultsTab ? filter.testResult : undefined,
    accessionIdInput,
  ].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;

  const columnOptions: { key: SampleTableColumnKey; label: string }[] = [
    { key: "sampleId", label: "Sample ID" },
    { key: "accessionId" as const, label: "Accession ID" },
    { key: "siteName", label: "Site Name" },
    { key: "round", label: "Round" },
    { key: "disease", label: "Disease" },
    { key: "location", label: "Location" },
    { key: "farmType", label: "Farm Type" },
    ...(activeTab === "picked-up"
      ? [{ key: "collectedBy" as const, label: "Collected By" }]
      : []),
    { key: "lastActivity", label: "Last Activity" },
  ];
  const selectedColumnCount = columnOptions.filter(
    (column) => visibleColumns[column.key],
  ).length;
  // +2 accounts for the leading checkbox column and the trailing Actions
  // column, neither of which is toggleable.
  const visibleTableColumnCount = 2 + selectedColumnCount;

  useEffect(() => {
    if (!diseases.length) {
      fetchDisease()
        .then((response) => {
          if (response.success) {
            setDiseases(response.data);
          }
        })
        .catch((e) => console.error("Error fetching diseases", e));
    }
    if (!sampleTypes.length) {
      fetchSampleTypes()
        .then((response) => {
          if (response.success) {
            setSampleTypes(response.data);
          }
        })
        .catch((e) => console.error("Error fetching sample types", e));
    }
    fetchRegions({ type: "state" })
      .then((response) => {
        if (response.success) {
          setStates(response.data);
        }
      })
      .catch((e) => console.error("Error fetching states", e));
  }, [user?.project?.id]);

  useEffect(() => {
    if (!effectiveProjectId) return;
    getMaxRoundApi(effectiveProjectId, currentWorkspace?.id)
      .then(setMaxRound)
      .catch(() => setMaxRound(0));
  }, [effectiveProjectId, currentWorkspace?.id]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(barcodeInput), 500);
    return () => window.clearTimeout(timeout);
  }, [barcodeInput]);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setReferenceBatchId(batchRefInput),
      500,
    );
    return () => window.clearTimeout(timeout);
  }, [batchRefInput]);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setAccessionId(accessionIdInput),
      500,
    );
    return () => window.clearTimeout(timeout);
  }, [accessionIdInput]);

  useEffect(() => {
    setSessionStorage("labVisibleColumns", visibleColumns);
  }, [visibleColumns]);

  useEffect(() => {
    if (!showColumnFilters) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        columnFiltersRef.current &&
        !columnFiltersRef.current.contains(event.target as Node)
      ) {
        setShowColumnFilters(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showColumnFilters]);

  useEffect(() => {
    if (!showDateRangePopover) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dateRangeRef.current &&
        !dateRangeRef.current.contains(event.target as Node)
      ) {
        setShowDateRangePopover(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showDateRangePopover]);

  const setPresetRange = (type: "today" | "last7" | "thisMonth" | "last30") => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const toYMD = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const todayStr = toYMD(now);
    if (type === "today") {
      setFilter((prev) => ({
        ...prev,
        startDate: todayStr,
        endDate: todayStr,
      }));
    } else if (type === "last7") {
      const past = new Date(now);
      past.setDate(now.getDate() - 6);
      setFilter((prev) => ({
        ...prev,
        startDate: toYMD(past),
        endDate: todayStr,
      }));
    } else if (type === "thisMonth") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      setFilter((prev) => ({
        ...prev,
        startDate: toYMD(firstDay),
        endDate: todayStr,
      }));
    } else if (type === "last30") {
      const past = new Date(now);
      past.setDate(now.getDate() - 29);
      setFilter((prev) => ({
        ...prev,
        startDate: toYMD(past),
        endDate: todayStr,
      }));
    }
    setShowDateRangePopover(false);
  };

  useEffect(() => {
    if (!effectiveProjectId) return;
    const fetchSites = async () => {
      try {
        const projectIdParam =
          effectiveProjectId === ALL_PROJECTS_ID ? "" : effectiveProjectId;
        const response = await getProjectSitesApi(projectIdParam, {
          disease: "",
          siteType: "",
          startDate: "",
          endDate: "",
          search: "",
          testResult: "",
          workspaceId: currentWorkspace?.id,
        });
        if (response.success) {
          setSites(response.data);
        }
      } catch (e) {
        console.error("Error fetching sites:", e);
      }
    };
    fetchSites();
  }, [effectiveProjectId, currentWorkspace?.id]);

  const handleTabClick = (tab: { id: string; label: string }) => {
    setActiveTab(tab.id as SampleStatusType);
    setSelectedProcessableSamples([]);
    setSessionStorage("activeTab", tab.id);
  };

  const fetchSampleList = async (): Promise<void> => {
    setLoading(true);
    setSamples([]);
    try {
      if (!effectiveProjectId) {
        throw new Error("There is no associated project for the lab user");
      }
      const fieldName =
        SAMPLE_STATUS_TO_LAB_ACTIVITY_DATE_MAP[activeTab] ?? "updatedAt";
      const data = await getAllSamplesApi(effectiveProjectId, {
        ...filter,
        sampleStatus: activeTab,
        search,
        referenceBatchId,
        accessionId,
        page,
        limit,
        sort: filter.sortOrder ? fieldName : undefined,
        sortOrder: filter.sortOrder,
        round: filter.round,
        testResult: isTestResultsTab ? filter.testResult : undefined,
        workspaceId: currentWorkspace?.id,
      });
      if (data.success) {
        setSamples(data.data);
        setPage(Number(data.page));
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching samples:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!effectiveProjectId) return;

    const currentFilters = JSON.stringify({
      activeTab,
      diseaseId: filter.diseaseId,
      sampleTypeId: filter.sampleTypeId,
      stateId: filter.stateId,
      siteId: filter.siteId,
      startDate: filter.startDate,
      endDate: filter.endDate,
      round: filter.round,
      testResult: isTestResultsTab ? filter.testResult : undefined,
      search,
      referenceBatchId,
      accessionId,
      sortOrder: filter.sortOrder,
      limit,
      workspaceId: currentWorkspace?.id,
    });

    if (prevFilterRef.current !== currentFilters) {
      prevFilterRef.current = currentFilters;
      if (page !== 1) {
        setPage(1);
        return;
      }
    }

    fetchSampleList();
    prevFilterRef.current = currentFilters;
  }, [
    effectiveProjectId,
    currentWorkspace?.id,
    activeTab,
    filter.diseaseId,
    filter.sampleTypeId,
    filter.stateId,
    filter.siteId,
    filter.startDate,
    filter.endDate,
    filter.round,
    filter.testResult,
    page,
    search,
    referenceBatchId,
    accessionId,
    filter.sortOrder,
    limit,
  ]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortClick = () => {
    setFilter((prev) => ({
      ...prev,
      sortOrder:
        prev.sortOrder === "desc"
          ? undefined
          : prev.sortOrder === "asc"
            ? "desc"
            : "asc",
    }));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelections = samples.filter(
        (s) => !selectedProcessableSamples.some((sp) => sp.id === s.id),
      );
      setSelectedProcessableSamples([
        ...selectedProcessableSamples,
        ...newSelections,
      ]);
    } else {
      setSelectedProcessableSamples(
        selectedProcessableSamples.filter(
          (sp) => !samples.some((s) => s.id === sp.id),
        ),
      );
    }
  };

  const isAllVisibleSelected =
    samples.length > 0 &&
    samples.every((s) =>
      selectedProcessableSamples.some((sp) => sp.id === s.id),
    );

  const showBulkActions = selectedProcessableSamples.length > 0;

  return (
    <div className="flex flex-col self-stretch pb-20">
      {/* top */}
      <div className="sticky top-[76px] z-10 flex flex-col items-center justify-between gap-6 self-stretch bg-white px-5 sm:flex-row sm:px-6">
        <Tabs tabs={TABS} selected={activeTab} onTabClick={handleTabClick} />
      </div>
      {isAll && (
        <div className="border-b border-grey-20 bg-blue-10 px-5 py-2 text-xs text-grey-70 sm:px-6">
          Viewing all projects (read-only). Select a specific project to process
          samples.
        </div>
      )}

      {/* filter */}
      <div className="border-b border-grey-20 bg-grey-10 px-5 py-4 sm:px-6">
        {/* Filter header: Title & Active Count & Clear All on Left, Table Controls (Columns & Show) on Right */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-10 text-blue-40">
              <Filter className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <span className="text-sm font-bold text-grey-80">Filters</span>
            {hasActiveFilters && (
              <span className="rounded-full bg-blue-40 px-2 py-0.5 text-xs font-bold leading-none text-white">
                {activeFilterCount}
              </span>
            )}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setFilter({ sortOrder: "desc" });
                  setBarcodeInput("");
                  setBatchRefInput("");
                  setAccessionIdInput("");
                }}
                className="ml-2 h-8 rounded-lg border border-grey-40 bg-white px-3 text-xs font-semibold text-blue-40 shadow-sm transition hover:border-blue-40 hover:bg-blue-10 hover:text-blue-50"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Columns dropdown */}
            <div ref={columnFiltersRef} className="relative">
              <button
                type="button"
                className="flex h-10 items-center justify-between gap-2 whitespace-nowrap rounded-lg border border-grey-40 bg-white px-3 text-xs font-semibold text-blue-40 shadow-sm transition hover:border-blue-40 hover:bg-blue-10"
                onClick={() => setShowColumnFilters((open) => !open)}
              >
                <Columns3 className="h-4 w-4 shrink-0" />
                <span>Columns</span>
                <span className="rounded-full bg-blue-10 px-1.5 py-0.5 text-[11px] font-bold text-blue-40">
                  {selectedColumnCount}/{columnOptions.length}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-grey-60 transition ${
                    showColumnFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showColumnFilters && (
                <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-[260px] rounded-lg border border-grey-20 bg-white p-3 shadow-xl">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-grey-70 text-[10px] uppercase font-bold tracking-wider">
                      Table Columns
                    </span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-40 hover:text-blue-60"
                      onClick={() => setVisibleColumns(DEFAULT_VISIBLE_COLUMNS)}
                    >
                      Reset
                    </button>
                  </div>
                  <div className="grid gap-1.5">
                    {columnOptions.map((column) => (
                      <label
                        key={column.key}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-grey-80 transition hover:bg-blue-10"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-grey-40 text-blue-40 focus:ring-blue-40"
                          checked={visibleColumns[column.key]}
                          onChange={(event) =>
                            setVisibleColumns((prev) => ({
                              ...prev,
                              [column.key]: event.target.checked,
                            }))
                          }
                        />
                        {column.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Show dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-grey-70 text-xs uppercase font-bold tracking-wider whitespace-nowrap">
                Show
              </span>
              <Select
                name="limit"
                options={[
                  { label: "10", value: 10 },
                  { label: "25", value: 25 },
                  { label: "50", value: 50 },
                  { label: "100", value: 100 },
                ]}
                defaultValue={limit}
                isClearable={false}
                onChange={(e) => setLimit(Number(e.target.value) || 10)}
                className="!min-w-[84px] shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Row 1 — Primary Filters (Barcode, Disease, Sample Type, Site, Date Range) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-grey-70 text-xs uppercase font-bold tracking-wider">
              Sample Barcode
            </label>
            <div className="flex h-10 items-center gap-2 rounded-lg border border-grey-40 bg-white px-3 shadow-sm transition-all hover:border-blue-40 focus-within:ring-2 focus-within:ring-blue-40/10">
              <SearchIcon className="h-4 w-4 text-grey-50" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Enter barcode"
                value={barcodeInput}
                onChange={(event) => setBarcodeInput(event.target.value)}
              />
              <Barcode className="h-4 w-4 text-grey-50" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-grey-70 text-xs uppercase font-bold tracking-wider">
              Disease
            </label>
            <Select
              name="diseaseId"
              options={diseases.map((disease) => ({
                label: disease.name,
                value: disease.id,
              }))}
              onChange={handleSelect}
              defaultValue={filter.diseaseId || ""}
              placeholder="All Diseases"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-grey-70 text-xs uppercase font-bold tracking-wider">
              Sample Type
            </label>
            <Select
              name="sampleTypeId"
              options={sampleTypes.map((sampleType: SampleType) => ({
                label: sampleType.name,
                value: sampleType.id,
              }))}
              onChange={handleSelect}
              defaultValue={filter.sampleTypeId || ""}
              placeholder="All Sample Types"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-grey-70 text-xs uppercase font-bold tracking-wider">
              Site
            </label>
            <Select
              name="siteId"
              options={sites.map((site) => ({
                label: site.name || "",
                value: site.id || "",
              }))}
              onChange={handleSelect}
              defaultValue={filter.siteId || ""}
              placeholder="All Sites"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-grey-70 text-xs uppercase font-bold tracking-wider">
              Date Range
            </label>
            <div ref={dateRangeRef} className="relative">
              <button
                type="button"
                onClick={() => setShowDateRangePopover((prev) => !prev)}
                className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-grey-40 bg-white px-3 shadow-sm transition-all hover:border-blue-40 focus-within:ring-2 focus-within:ring-blue-40/10 text-left"
              >
                <div className="flex items-center gap-2 overflow-hidden min-w-0">
                  <Calendar className="h-4 w-4 shrink-0 text-grey-50" />
                  <span
                    className={`truncate text-sm ${
                      filter.startDate || filter.endDate
                        ? "font-medium text-grey-85"
                        : "text-grey-50"
                    }`}
                  >
                    {filter.startDate && filter.endDate
                      ? `${filter.startDate} → ${filter.endDate}`
                      : filter.startDate
                        ? `From ${filter.startDate}`
                        : filter.endDate
                          ? `Until ${filter.endDate}`
                          : "All Dates"}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {(filter.startDate || filter.endDate) && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilter((prev) => ({
                          ...prev,
                          startDate: undefined,
                          endDate: undefined,
                        }));
                      }}
                      className="p-0.5 rounded hover:bg-grey-20 text-grey-50 hover:text-grey-80 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </span>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 text-grey-60 transition ${
                      showDateRangePopover ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {showDateRangePopover && (
                <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-72 sm:w-80 rounded-xl border border-grey-20 bg-white p-3.5 shadow-xl">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-grey-70 text-[11px] uppercase font-bold tracking-wider">
                      Quick Presets
                    </span>
                    {(filter.startDate || filter.endDate) && (
                      <button
                        type="button"
                        className="text-xs font-semibold text-blue-40 hover:text-blue-60"
                        onClick={() =>
                          setFilter((prev) => ({
                            ...prev,
                            startDate: undefined,
                            endDate: undefined,
                          }))
                        }
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    <button
                      type="button"
                      onClick={() => setPresetRange("today")}
                      className="rounded-md border border-grey-20 bg-grey-10 px-2 py-1 text-xs font-medium text-grey-80 hover:bg-blue-10 hover:border-blue-30 hover:text-blue-50 transition-all text-center"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetRange("last7")}
                      className="rounded-md border border-grey-20 bg-grey-10 px-2 py-1 text-xs font-medium text-grey-80 hover:bg-blue-10 hover:border-blue-30 hover:text-blue-50 transition-all text-center"
                    >
                      Last 7 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetRange("thisMonth")}
                      className="rounded-md border border-grey-20 bg-grey-10 px-2 py-1 text-xs font-medium text-grey-80 hover:bg-blue-10 hover:border-blue-30 hover:text-blue-50 transition-all text-center"
                    >
                      This Month
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetRange("last30")}
                      className="rounded-md border border-grey-20 bg-grey-10 px-2 py-1 text-xs font-medium text-grey-80 hover:bg-blue-10 hover:border-blue-30 hover:text-blue-50 transition-all text-center"
                    >
                      Last 30 Days
                    </button>
                  </div>

                  <div className="border-t border-grey-20/80 pt-2.5">
                    <span className="text-grey-70 text-[11px] uppercase font-bold tracking-wider block mb-2">
                      Custom Range
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-semibold text-grey-60">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={filter.startDate || ""}
                          onChange={handleDateChange}
                          className="h-[34px] w-full cursor-pointer rounded-lg border border-grey-40 px-2 text-xs text-grey-85 outline-none hover:border-blue-40 focus:border-blue-40"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-semibold text-grey-60">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={filter.endDate || ""}
                          onChange={handleDateChange}
                          className="h-[34px] w-full cursor-pointer rounded-lg border border-grey-40 px-2 text-xs text-grey-85 outline-none hover:border-blue-40 focus:border-blue-40"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end border-t border-grey-20 pt-2.5">
                    <button
                      type="button"
                      onClick={() => setShowDateRangePopover(false)}
                      className="rounded-md bg-blue-40 px-3.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-blue-50 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2 — Secondary Filters (State, Round, Batch Ref ID, Accession ID, Test Result) */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-t border-grey-20/60 pt-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-grey-70 text-xs uppercase font-bold tracking-wider">
              State
            </label>
            <Select
              name="stateId"
              options={states.map((state) => ({
                label: state.name,
                value: state.id,
              }))}
              onChange={handleSelect}
              defaultValue={filter.stateId || ""}
              placeholder="All States"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-grey-70 text-xs uppercase font-bold tracking-wider">
              Round
            </label>
            <Select
              name="round"
              options={Array.from({ length: maxRound }, (_, i) => ({
                label: `Round ${i + 1}`,
                value: String(i + 1),
              }))}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  round: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              defaultValue={filter.round ? String(filter.round) : ""}
              placeholder="All Rounds"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-grey-70 text-xs uppercase font-bold tracking-wider">
              Batch Ref ID
            </label>
            <div className="flex h-10 items-center gap-2 rounded-lg border border-grey-40 bg-white px-3 shadow-sm transition-all hover:border-blue-40 focus-within:ring-2 focus-within:ring-blue-40/10">
              <SearchIcon className="h-4 w-4 text-grey-50" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search Batch Ref ID"
                value={batchRefInput}
                onChange={(event) => setBatchRefInput(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-grey-70 text-xs uppercase font-bold tracking-wider">
              Accession ID
            </label>
            <div className="flex h-10 items-center gap-2 rounded-lg border border-grey-40 bg-white px-3 shadow-sm transition-all hover:border-blue-40 focus-within:ring-2 focus-within:ring-blue-40/10">
              <SearchIcon className="h-4 w-4 text-grey-50" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search Accession ID"
                value={accessionIdInput}
                onChange={(event) => setAccessionIdInput(event.target.value)}
              />
            </div>
          </div>

          {isTestResultsTab && (
            <div className="flex flex-col gap-1.5">
              <label className="text-grey-70 text-xs uppercase font-bold tracking-wider">
                Test Result
              </label>
              <Select
                name="testResult"
                options={[
                  { label: "Positive", value: "positive" },
                  { label: "Negative", value: "negative" },
                  { label: "Unclear", value: "unclear" },
                ]}
                onChange={handleSelect}
                defaultValue={filter.testResult || ""}
                placeholder="All Test Results"
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {!isAll && canUpdateLabTest && showBulkActions && (
        <div className="sticky top-[135px] z-10 flex items-center justify-between bg-blue-40 px-5 py-3 text-white shadow-md transition-all self-stretch sm:px-6">
          <div className="flex items-center gap-4">
            <span className="font-medium">
              {selectedProcessableSamples.length} sample(s) selected
            </span>
            <button
              onClick={() => setSelectedProcessableSamples([])}
              className="text-white/80 hover:text-white text-sm underline underline-offset-2"
            >
              Clear selection
            </button>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-40 rounded-lg hover:bg-grey-10 transition-colors text-sm font-medium h-fit"
            onClick={() => setShowBulkModal(true)}
          >
            <CopyPlus size={16} />
            Process Selected
          </button>
        </div>
      )}

      {/* data-table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-fit border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-b border-slate-200">
              <th className="w-10 py-3 pl-5 pr-3 text-left font-normal sm:pl-6">
                {!isAll &&
                  canUpdateLabTest &&
                  SELECT_ALL_STATUSES.includes(activeTab || "") && (
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] rounded border-2 border-slate-300 text-blue-40 focus:ring-blue-40 focus:ring-offset-0 cursor-pointer"
                      checked={isAllVisibleSelected}
                      onChange={handleSelectAll}
                    />
                  )}
              </th>
              {visibleColumns.sampleId && (
                <th className="py-3 pr-6 text-left">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Sample ID
                  </span>
                </th>
              )}
              {visibleColumns.accessionId && (
                <th className="py-3 pr-4 text-left">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Accession ID
                  </span>
                </th>
              )}
              {visibleColumns.siteName && (
                <th className="py-3 pr-4 text-left">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Site Name
                  </span>
                </th>
              )}
              {visibleColumns.round && (
                <th className="py-3 pr-4 text-left">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Round
                  </span>
                </th>
              )}
              {visibleColumns.disease && (
                <th className="py-3 pr-4 text-left">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Disease
                  </span>
                </th>
              )}
              {visibleColumns.location && (
                <th className="py-3 pr-4 text-left">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Location
                  </span>
                </th>
              )}
              {visibleColumns.farmType && (
                <th className="py-3 pr-4 text-left">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Farm Type
                  </span>
                </th>
              )}
              {activeTab === "picked-up" && visibleColumns.collectedBy && (
                <th className="py-3 pr-4 text-left">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Collected By
                  </span>
                </th>
              )}
              {visibleColumns.lastActivity && (
                <th className="py-3 pr-4 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      Last Activity
                    </span>
                    <button
                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                      onClick={() => handleSortClick()}
                    >
                      <ArrowUpDown
                        size={13}
                        className={
                          filter.sortOrder ? "text-blue-40" : "text-slate-400"
                        }
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                </th>
              )}
              <th className="py-3 pr-4 sm:pr-6 text-left">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={visibleTableColumnCount} className="py-8">
                  <div className="flex justify-center items-center">
                    <Loader />
                  </div>
                </td>
              </tr>
            )}
            {samples?.length > 0
              ? samples?.map((sample, i) => (
                  <SampleListItem
                    key={i}
                    sample={sample}
                    activeTab={activeTab}
                    onSampleUpdated={fetchSampleList}
                    visibleColumns={visibleColumns}
                  />
                ))
              : !loading && (
                  <tr>
                    <td
                      colSpan={visibleTableColumnCount}
                      className="py-8 text-center text-grey-70 text-base"
                    >
                      No data found
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages ?? 0}
          goToPage={setPage}
          loading={loading}
        />
      </div>

      <BulkProcessModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        activeTab={activeTab}
        onTabChange={(nextTab) => {
          setActiveTab(nextTab);
          setPage(1);
        }}
        onSuccess={(nextTab) => {
          setSelectedProcessableSamples([]);
          setShowBulkModal(false);
          if (nextTab && nextTab !== activeTab) {
            setActiveTab(nextTab);
            setPage(1);
            setSessionStorage("activeTab", nextTab);
          } else {
            // Same tab as before (e.g. Save & Exit) — activeTab/page won't
            // change, so the fetch effect won't re-fire on its own.
            fetchSampleList();
          }
        }}
      />
    </div>
  );
}

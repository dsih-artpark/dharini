"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";
import apiClient from "@/src/libs/apiClient";
import { getAllProjectsApi } from "@/src/app/(dashboard)/manage/loader";
import { getProjectSitesApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { getPastVisitsApi } from "@/src/app/(dashboard)/projects/[id]/sites/[siteId]/loader";
import { getAllSamplesApi } from "@/src/app/(dashboard)/lab/loader";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import type { ProjectDetail } from "@/src/types/global";
import type { Site } from "@/src/types/site";
import type { Visit } from "@/src/types/visit";
import type { Sample } from "@/src/types/sample";
import Loader from "@/src/components/ui/loader";
import Select from "@/src/components/ui/select";

type EntityType = "project" | "site" | "visit" | "sample";

interface DataPurgingProps {
  workspaceId?: string;
}

export default function DataPurging({
  workspaceId: workspaceIdProp,
}: DataPurgingProps = {}) {
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const activeWorkspaceId = workspaceIdProp ?? currentWorkspace?.id;

  const [activeTab, setActiveTab] = useState<EntityType>("project");

  // Selection states
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");

  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedVisitId, setSelectedVisitId] = useState<string>("");

  const [samples, setSamples] = useState<Sample[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string>("");

  // Loading states
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  // Confirmation state
  const [confirmText, setConfirmText] = useState("");

  // Reset every selection whenever the workspace changes
  useEffect(() => {
    setSelectedProjectId("");
    setSelectedSiteId("");
    setSelectedVisitId("");
    setSelectedSampleId("");
    setSites([]);
    setVisits([]);
    setSamples([]);
    setConfirmText("");
  }, [activeWorkspaceId]);

  // Load projects for selected workspace
  useEffect(() => {
    const fetchProjects = async () => {
      if (!activeWorkspaceId) {
        setProjects([]);
        return;
      }
      setLoadingProjects(true);
      try {
        const response = await getAllProjectsApi({
          page: 1,
          limit: 1000,
          workspaceId: activeWorkspaceId,
        });
        if (response.success) {
          setProjects(response.data);
        }
      } catch (err) {
        toast.error((err as Error).message || "Failed to load projects.");
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [activeWorkspaceId]);

  // When selected project changes, reset child states and fetch sites
  useEffect(() => {
    setSelectedSiteId("");
    setSelectedVisitId("");
    setSelectedSampleId("");
    setSites([]);
    setVisits([]);
    setSamples([]);

    if (!selectedProjectId) return;

    const fetchSites = async () => {
      setLoadingSites(true);
      try {
        const response = await getProjectSitesApi(selectedProjectId, {
          disease: "",
          siteType: "",
          startDate: "",
          endDate: "",
          search: "",
          testResult: "",
        });
        if (response.success) {
          setSites(response.data);
        }
      } catch (err) {
        console.error("Failed to load sites", err);
      } finally {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [selectedProjectId]);

  // When selected site changes, reset child states and fetch visits & samples
  useEffect(() => {
    setSelectedVisitId("");
    setSelectedSampleId("");
    setVisits([]);
    setSamples([]);

    if (!selectedSiteId || !selectedProjectId) return;

    const fetchVisitsAndSamples = async () => {
      setLoadingVisits(true);
      setLoadingSamples(true);
      try {
        // Fetch visits
        const visitsResponse = await getPastVisitsApi(selectedProjectId, {
          isCompleted: true,
          siteId: selectedSiteId,
          disease: "",
          siteType: "",
          startDate: "",
          endDate: "",
          page: 1,
          limit: 100,
        });
        if (visitsResponse.success) {
          setVisits(visitsResponse.data);
        }

        // Fetch samples
        const samplesResponse = await getAllSamplesApi(selectedProjectId, {
          siteId: selectedSiteId,
          page: 1,
          limit: 100,
        });
        if (samplesResponse.success) {
          setSamples(samplesResponse.data);
        }
      } catch (err) {
        console.error("Failed to load visits or samples", err);
      } finally {
        setLoadingVisits(false);
        setLoadingSamples(false);
      }
    };

    fetchVisitsAndSamples();
  }, [selectedSiteId, selectedProjectId]);

  // Handle Tab Switch
  const handleTabChange = (tab: EntityType) => {
    setActiveTab(tab);
    setConfirmText("");
  };

  // Get selected details for preview
  const getSelectedProject = () =>
    projects.find((p) => p.id === selectedProjectId);
  const getSelectedSite = () => sites.find((s) => s.id === selectedSiteId);
  const getSelectedVisit = () => visits.find((v) => v.id === selectedVisitId);
  const getSelectedSample = () =>
    samples.find((s) => s.id === selectedSampleId);

  // Deletion Cascading Rules Message helper
  const getCascadeWarning = () => {
    switch (activeTab) {
      case "project":
        return {
          title: "Cascade Purge Project",
          desc: "Deleting this project will permanently erase all associated sites, visits, samples, lab tests, user role mappings, and project invites. This action is irreversible.",
          target: getSelectedProject()?.name || "Selected Project",
          confirmPlaceholder: getSelectedProject()?.name || "",
        };
      case "site":
        return {
          title: "Cascade Purge Site",
          desc: "Deleting this site will permanently erase all visits, samples, lab tests, and audits associated with this site. This action is irreversible.",
          target: getSelectedSite()?.name || "Selected Site",
          confirmPlaceholder: getSelectedSite()?.name || "",
        };
      case "visit":
        return {
          title: "Cascade Purge Visit",
          desc: "Deleting this visit will permanently erase all samples, lab tests, and audits collected during this visit. This action is irreversible.",
          target: getSelectedVisit()?.id || "Selected Visit",
          confirmPlaceholder: "CONFIRM DELETE VISIT",
        };
      case "sample":
        return {
          title: "Cascade Purge Sample",
          desc: "Deleting this sample will permanently erase all associated lab tests, audits, pools, and replicates. This action is irreversible.",
          target: getSelectedSample()?.barcode || "Selected Sample",
          confirmPlaceholder: getSelectedSample()?.barcode || "",
        };
    }
  };

  const warning = getCascadeWarning();

  // Execute Purge
  const handlePurge = async () => {
    if (confirmText !== warning.confirmPlaceholder) {
      toast.error("Confirmation text does not match.");
      return;
    }

    let url = "";
    let id = "";

    if (activeTab === "project") {
      url = `/purge/project/${selectedProjectId}`;
      id = selectedProjectId;
    } else if (activeTab === "site") {
      url = `/purge/site/${selectedSiteId}`;
      id = selectedSiteId;
    } else if (activeTab === "visit") {
      url = `/purge/visit/${selectedVisitId}`;
      id = selectedVisitId;
    } else if (activeTab === "sample") {
      url = `/purge/sample/${selectedSampleId}`;
      id = selectedSampleId;
    }

    if (!id) {
      toast.error("Please make a selection first.");
      return;
    }

    setIsPurging(true);
    try {
      const response = await apiClient.delete(url);
      if (response.data?.success) {
        toast.success(response.data?.message || "Data purged successfully!");
        // Reset selections
        setConfirmText("");
        if (activeTab === "project") {
          setProjects((prev) => prev.filter((p) => p.id !== id));
          setSelectedProjectId("");
        } else if (activeTab === "site") {
          setSites((prev) => prev.filter((s) => s.id !== id));
          setSelectedSiteId("");
        } else if (activeTab === "visit") {
          setVisits((prev) => prev.filter((v) => v.id !== id));
          setSelectedVisitId("");
        } else if (activeTab === "sample") {
          setSamples((prev) => prev.filter((s) => s.id !== id));
          setSelectedSampleId("");
        }
      } else {
        toast.error("Purge completed with warning/errors.");
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        error.response?.data?.message || error.message || "Purge failed.",
      );
    } finally {
      setIsPurging(false);
    }
  };

  const isSelectionMade = () => {
    if (activeTab === "project") return !!selectedProjectId;
    if (activeTab === "site") return !!selectedSiteId;
    if (activeTab === "visit") return !!selectedVisitId;
    if (activeTab === "sample") return !!selectedSampleId;
    return false;
  };

  return (
    <section className="flex w-full flex-col items-start justify-start overflow-hidden rounded-2xl border border-grey-20 bg-white shadow-card">
      {/* Dynamic Header Section inside the Main Card */}
      <div className="flex w-full flex-col gap-4 border-b border-grey-20 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-30" />
          <span className="text-base font-semibold text-grey-90 sm:text-lg">
            Super Admin Danger Zone (Cascading Purge)
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-red-20 bg-red-10 px-3 py-1.5 text-xs font-semibold text-red-30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Irreversible Action
        </div>
      </div>

      {/* Warning Description */}
      <div className="w-full border-b border-grey-20 bg-grey-10 px-5 py-4 sm:px-6">
        <p className="max-w-4xl text-sm font-medium leading-relaxed text-grey-70">
          This will permanently erase all associated sites, visits, samples, lab
          tests, user role mappings, and project invites.
        </p>
      </div>

      {/* Step Indicator Progress Bar / Horizontal Tabs */}
      <div className="flex w-full select-none items-center justify-between gap-4 overflow-x-auto border-b border-grey-20 bg-white px-5 py-4 sm:px-6">
        {/* Step 1: Project */}
        <button
          onClick={() => handleTabChange("project")}
          className="group flex flex-shrink-0 items-center gap-3 rounded-xl px-2 py-1 text-left transition hover:bg-grey-10 focus:outline-none"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
              activeTab === "project"
                ? "bg-red-30 text-white shadow-sm ring-4 ring-red-10"
                : "bg-grey-10 text-grey-50 group-hover:bg-grey-20"
            }`}
          >
            1
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm font-semibold transition-all ${
                activeTab === "project" ? "text-red-30" : "text-grey-80"
              }`}
            >
              Purge Project
            </span>
            <span className="text-[11px] text-grey-50 font-normal">
              Select project to purge
            </span>
          </div>
        </button>

        <div className="h-[1px] max-w-[80px] flex-grow bg-grey-20" />

        {/* Step 2: Site */}
        <button
          onClick={() => handleTabChange("site")}
          className="group flex flex-shrink-0 items-center gap-3 rounded-xl px-2 py-1 text-left transition hover:bg-grey-10 focus:outline-none"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
              activeTab === "site"
                ? "bg-red-30 text-white shadow-sm ring-4 ring-red-10"
                : "bg-grey-10 text-grey-50 group-hover:bg-grey-20"
            }`}
          >
            2
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm font-semibold transition-all ${
                activeTab === "site" ? "text-red-30" : "text-grey-80"
              }`}
            >
              Purge Site
            </span>
            <span className="text-[11px] text-grey-50 font-normal">
              Select site (optional)
            </span>
          </div>
        </button>

        <div className="h-[1px] max-w-[80px] flex-grow bg-grey-20" />

        {/* Step 3: Visit */}
        <button
          onClick={() => handleTabChange("visit")}
          className="group flex flex-shrink-0 items-center gap-3 rounded-xl px-2 py-1 text-left transition hover:bg-grey-10 focus:outline-none"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
              activeTab === "visit"
                ? "bg-red-30 text-white shadow-sm ring-4 ring-red-10"
                : "bg-grey-10 text-grey-50 group-hover:bg-grey-20"
            }`}
          >
            3
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm font-semibold transition-all ${
                activeTab === "visit" ? "text-red-30" : "text-grey-80"
              }`}
            >
              Purge Visit
            </span>
            <span className="text-[11px] text-grey-50 font-normal">
              Select visit (optional)
            </span>
          </div>
        </button>

        <div className="h-[1px] max-w-[80px] flex-grow bg-grey-20" />

        {/* Step 4: Sample */}
        <button
          onClick={() => handleTabChange("sample")}
          className="group flex flex-shrink-0 items-center gap-3 rounded-xl px-2 py-1 text-left transition hover:bg-grey-10 focus:outline-none"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
              activeTab === "sample"
                ? "bg-red-30 text-white shadow-sm ring-4 ring-red-10"
                : "bg-grey-10 text-grey-50 group-hover:bg-grey-20"
            }`}
          >
            4
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm font-semibold transition-all ${
                activeTab === "sample" ? "text-red-30" : "text-grey-80"
              }`}
            >
              Purge Sample
            </span>
            <span className="text-[11px] text-grey-50 font-normal">
              Select sample (optional)
            </span>
          </div>
        </button>
      </div>

      {/* Main Grid Content Panels */}
      <div className="grid w-full grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-12">
        {/* Left Side: Selectors and Item Preview */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="flex flex-col gap-5 rounded-xl border border-grey-20 bg-grey-10 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-grey-90">
              <span className="h-3 w-1.5 rounded-full bg-red-30" />
              Configure Target Purge Selection
            </h2>

            {/* Step 1: Project Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between text-sm font-semibold text-grey-80">
                <span>1. Select Project</span>
                {loadingProjects && (
                  <span className="animate-pulse text-xs text-grey-40">
                    Loading...
                  </span>
                )}
              </label>
              <Select
                name="projectId"
                options={projects.map((p) => ({
                  label: p.name,
                  value: p.id || "",
                }))}
                defaultValue={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                placeholder="-- Choose Project --"
                isClearable={false}
                disabled={loadingProjects}
                className="w-full"
              />
            </div>

            {/* Step 2: Site Dropdown */}
            {activeTab !== "project" && (
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between text-sm font-semibold text-grey-80">
                  <span>2. Select Site</span>
                  {loadingSites && (
                    <span className="animate-pulse text-xs text-grey-40">
                      Loading...
                    </span>
                  )}
                </label>
                <Select
                  name="siteId"
                  options={sites.map((s) => ({
                    label: `${s.name} (${s.siteType})`,
                    value: s.id || "",
                  }))}
                  defaultValue={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  placeholder="-- Choose Site --"
                  isClearable={false}
                  disabled={!selectedProjectId || loadingSites}
                  className="w-full"
                />
              </div>
            )}

            {/* Step 3: Visit Dropdown */}
            {activeTab === "visit" && (
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between text-sm font-semibold text-grey-80">
                  <span>3. Select Visit</span>
                  {loadingVisits && (
                    <span className="animate-pulse text-xs text-grey-40">
                      Loading...
                    </span>
                  )}
                </label>
                <Select
                  name="visitId"
                  options={visits.map((v) => ({
                    label: `Visit (${new Date(v.visitedAt).toLocaleDateString()}) - ${v.collector?.firstName} ${v.collector?.lastName}`,
                    value: v.id || "",
                  }))}
                  defaultValue={selectedVisitId}
                  onChange={(e) => setSelectedVisitId(e.target.value)}
                  placeholder="-- Choose Visit --"
                  isClearable={false}
                  disabled={!selectedSiteId || loadingVisits}
                  className="w-full"
                />
              </div>
            )}

            {/* Step 4: Sample Dropdown */}
            {activeTab === "sample" && (
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between text-sm font-semibold text-grey-80">
                  <span>3. Select Sample Barcode</span>
                  {loadingSamples && (
                    <span className="animate-pulse text-xs text-grey-40">
                      Loading...
                    </span>
                  )}
                </label>
                <Select
                  name="sampleId"
                  options={samples.map((s) => ({
                    label: `${s.barcode} - ${s.sampleType?.name} (${s.sampleStatus})`,
                    value: s.id || "",
                  }))}
                  defaultValue={selectedSampleId}
                  onChange={(e) => setSelectedSampleId(e.target.value)}
                  placeholder="-- Choose Sample --"
                  isClearable={false}
                  disabled={!selectedSiteId || loadingSamples}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Elegant Selected Detail card preview */}
          {isSelectionMade() ? (
            <div className="flex w-full flex-col gap-4 rounded-xl border border-grey-20 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-20 bg-blue-10 text-blue-40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-grey-90">
                    Selected {activeTab} Details
                  </h3>
                  <span className="text-xs font-normal text-grey-50">
                    Review information before proceeding
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-grey-20 pt-4 text-sm sm:grid-cols-2">
                {activeTab === "project" && getSelectedProject() && (
                  <>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-grey-60">
                        Name
                      </span>
                      <span className="font-medium text-grey-90">
                        {getSelectedProject()?.name}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-grey-60">
                        Project ID
                      </span>
                      <span className="font-mono text-xs text-grey-80">
                        {getSelectedProject()?.id}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-grey-60">
                        Active Type
                      </span>
                      <span className="font-medium text-grey-90">Project</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-grey-60">
                        Status
                      </span>
                      <span className="self-start rounded-full border border-green-20 bg-green-10 px-2.5 py-0.5 text-xs font-medium capitalize text-green-30">
                        Active
                      </span>
                    </div>
                  </>
                )}

                {activeTab === "site" && getSelectedSite() && (
                  <>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-grey-60 text-xs font-semibold">
                        Site Name
                      </span>
                      <span className="text-grey-90 font-medium">
                        {getSelectedSite()?.name}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-grey-60 text-xs font-semibold">
                        Site ID
                      </span>
                      <span className="text-grey-80 font-mono text-xs">
                        {getSelectedSite()?.id}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-grey-60 text-xs font-semibold">
                        Site Type
                      </span>
                      <span className="text-grey-90 font-medium capitalize">
                        {getSelectedSite()?.siteType}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-grey-60 text-xs font-semibold">
                        Status
                      </span>
                      <span className="self-start bg-green-50 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-green-200/50 capitalize">
                        Active
                      </span>
                    </div>
                  </>
                )}

                {activeTab === "visit" && getSelectedVisit() && (
                  <>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-grey-60 text-xs font-semibold">
                        Visit ID
                      </span>
                      <span className="text-grey-80 font-mono text-xs">
                        {getSelectedVisit()?.id}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-grey-60 text-xs font-semibold">
                        Visited At
                      </span>
                      <span className="text-grey-90 font-medium">
                        {new Date(
                          getSelectedVisit()!.visitedAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-grey-60 text-xs font-semibold">
                        Collector
                      </span>
                      <span className="text-grey-90 font-medium">
                        {getSelectedVisit()?.collector?.firstName}{" "}
                        {getSelectedVisit()?.collector?.lastName}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-grey-60 text-xs font-semibold">
                        Status
                      </span>
                      <span className="self-start bg-green-50 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-green-200/50 capitalize">
                        {getSelectedVisit()?.visitStatus}
                      </span>
                    </div>
                  </>
                )}

                {activeTab === "sample" && getSelectedSample() && (
                  <>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-grey-60 text-xs font-semibold">
                        Barcode
                      </span>
                      <span className="text-red-500 font-bold">
                        {getSelectedSample()?.barcode}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-grey-60 text-xs font-semibold">
                        Sample Type
                      </span>
                      <span className="text-grey-90 font-medium">
                        {getSelectedSample()?.sampleType?.name}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-grey-60 text-xs font-semibold">
                        Status
                      </span>
                      <span className="self-start bg-green-50 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-green-200/50 capitalize">
                        {getSelectedSample()?.sampleStatus}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-grey-60 text-xs font-semibold">
                        Sample ID
                      </span>
                      <span className="text-grey-80 font-mono text-xs">
                        {getSelectedSample()?.id}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-grey-20 bg-white p-8 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-grey-10 text-grey-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-grey-80">
                  No selection made yet
                </span>
                <span className="max-w-sm text-xs leading-relaxed text-grey-50">
                  Choose a project and any optional sub-entities from the
                  selector to view details and activate purging options.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: The Pink Warning Deletion Zone Card */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {isSelectionMade() ? (
            <div className="flex w-full flex-col gap-5 rounded-2xl border border-red-20 bg-red-10 p-5 shadow-sm sm:p-6">
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-red-30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-red-30">
                    {warning.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-red-30">
                    {warning.desc}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full mt-2">
                <label className="text-[13px] font-semibold text-grey-80">
                  To confirm, type{" "}
                  <span className="select-all font-mono font-bold text-red-30">
                    &quot;{warning.confirmPlaceholder}&quot;
                  </span>{" "}
                  below:
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-red-20 bg-white px-4 py-3 text-sm font-semibold text-grey-80 placeholder-grey-40 outline-none focus:ring-2 focus:ring-red-20"
                  placeholder="Type name to confirm..."
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />
              </div>

              <button
                className={`w-full py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 border shadow-sm ${
                  confirmText === warning.confirmPlaceholder && !isPurging
                    ? "bg-red-30 hover:bg-red-40 text-white cursor-pointer border-red-30"
                    : "bg-red-20 text-white cursor-not-allowed border-transparent"
                }`}
                onClick={handlePurge}
                disabled={
                  confirmText !== warning.confirmPlaceholder || isPurging
                }
              >
                {isPurging ? (
                  <>
                    <Loader />
                    Purging Data...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                    Purge Data & Cascades
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex h-full min-h-[220px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-grey-20 bg-white p-8 text-center">
              <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-grey-10 text-grey-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-grey-80">
                Review Pending Action
              </span>
              <p className="max-w-xs text-[11px] leading-relaxed text-grey-50">
                Select an item on the left to verify the cascading actions and
                unlock confirmation parameters.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

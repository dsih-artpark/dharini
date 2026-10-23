"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiClient from "@/src/libs/apiClient";
import { getAllProjectsApi } from "@/src/app/(dashboard)/manage/loader";
import { getProjectSitesApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { getPastVisitsApi } from "@/src/app/(dashboard)/projects/[id]/sites/[siteId]/loader";
import { getAllSamplesApi } from "@/src/app/(dashboard)/lab/loader";
import type { ProjectDetail } from "@/src/types/global";
import type { Site } from "@/src/types/site";
import type { Visit } from "@/src/types/visit";
import type { Sample } from "@/src/types/sample";
import Loader from "@/src/components/ui/loader";

type EntityType = "project" | "site" | "visit" | "sample";

interface WorkspaceDataPurgingProps {
  workspaceId: string;
}

export default function WorkspaceDataPurging({
  workspaceId,
}: WorkspaceDataPurgingProps) {
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

  // A8: reset every selection (and the typed confirmation) whenever the
  // workspace changes — otherwise switching workspaces on this screen keeps
  // the previous workspace's selected ids in state, and the Purge button
  // permanently deletes data.
  useEffect(() => {
    setSelectedProjectId("");
    setSelectedSiteId("");
    setSelectedVisitId("");
    setSelectedSampleId("");
    setConfirmText("");
  }, [workspaceId]);

  // Load workspace projects on initial load
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        // Pass workspaceId to scope the projects to this workspace
        const response = await getAllProjectsApi({
          page: 1,
          limit: 1000,
          workspaceId,
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
  }, [workspaceId]);

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
    if (!warning) return;
    // A8: fail closed. An empty confirmPlaceholder (e.g. the selected
    // entity's name hasn't loaded yet) previously skipped this check
    // entirely, letting the purge proceed with no typed confirmation.
    if (
      !warning.confirmPlaceholder ||
      confirmText !== warning.confirmPlaceholder
    ) {
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

  return (
    <div className="w-full bg-white rounded-2xl border border-grey-20 flex-col justify-start items-start inline-flex shadow-sm overflow-hidden">
      <div className="self-stretch p-6 border-b border-grey-20">
        <div className="flex gap-4 border-b border-grey-20 -mb-6 pb-6">
          {(["project", "site", "visit", "sample"] as EntityType[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-3 py-1 text-sm font-medium transition-all capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-blue-40 text-blue-40"
                    : "text-grey-500 hover:text-grey-700"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="self-stretch p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Project selector — always shown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-grey-70">
              Select Project
            </label>
            <select
              className="h-10 w-full rounded-lg border border-grey-20 bg-white px-3 text-sm text-grey-80 outline-none focus:border-blue-40 disabled:cursor-not-allowed disabled:opacity-60"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              disabled={loadingProjects}
            >
              <option value="">
                {loadingProjects ? "Loading…" : "Select a project"}
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Site selector */}
          {(activeTab === "site" ||
            activeTab === "visit" ||
            activeTab === "sample") &&
            selectedProjectId && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-grey-70">
                  Select Site
                </label>
                <select
                  className="h-10 w-full rounded-lg border border-grey-20 bg-white px-3 text-sm text-grey-80 outline-none focus:border-blue-40 disabled:cursor-not-allowed disabled:opacity-60"
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  disabled={loadingSites}
                >
                  <option value="">
                    {loadingSites ? "Loading…" : "Select a site"}
                  </option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {/* Visit selector */}
          {activeTab === "visit" && selectedSiteId && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-grey-70">
                Select Visit
              </label>
              <select
                className="h-10 w-full rounded-lg border border-grey-20 bg-white px-3 text-sm text-grey-80 outline-none focus:border-blue-40 disabled:cursor-not-allowed disabled:opacity-60"
                value={selectedVisitId}
                onChange={(e) => setSelectedVisitId(e.target.value)}
                disabled={loadingVisits}
              >
                <option value="">
                  {loadingVisits ? "Loading…" : "Select a visit"}
                </option>
                {visits.map((v) => (
                  <option key={v.id} value={v.id}>
                    Visit — {new Date(v.visitedAt ?? "").toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sample selector */}
          {activeTab === "sample" && selectedSiteId && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-grey-70">
                Select Sample
              </label>
              <select
                className="h-10 w-full rounded-lg border border-grey-20 bg-white px-3 text-sm text-grey-80 outline-none focus:border-blue-40 disabled:cursor-not-allowed disabled:opacity-60"
                value={selectedSampleId}
                onChange={(e) => setSelectedSampleId(e.target.value)}
                disabled={loadingSamples}
              >
                <option value="">
                  {loadingSamples ? "Loading…" : "Select a sample"}
                </option>
                {samples.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.barcode}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Confirmation Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {warning && (
            <>
              <div className="bg-red-10 border border-red-20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-30 mb-2">
                  ⚠️ {warning.title}
                </h3>
                <p className="text-sm text-grey-70 mb-3">{warning.desc}</p>
                <p className="text-xs text-grey-60">
                  Target:{" "}
                  <span className="font-semibold">{warning.target}</span>
                </p>
              </div>

              {warning.confirmPlaceholder && (
                <div>
                  <label className="text-sm font-medium text-grey-80 mb-2 block">
                    Type &ldquo;{warning.confirmPlaceholder}&rdquo; to confirm
                    deletion
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={warning.confirmPlaceholder}
                    className="w-full px-3 py-2 border border-grey-20 rounded-lg text-sm"
                  />
                </div>
              )}

              <button
                onClick={handlePurge}
                disabled={
                  isPurging ||
                  !selectedProjectId ||
                  (activeTab === "site" && !selectedSiteId) ||
                  (activeTab === "visit" && !selectedVisitId) ||
                  (activeTab === "sample" && !selectedSampleId) ||
                  !warning.confirmPlaceholder ||
                  confirmText !== warning.confirmPlaceholder
                }
                className={`w-full py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  !isPurging &&
                  selectedProjectId &&
                  warning.confirmPlaceholder &&
                  confirmText === warning.confirmPlaceholder
                    ? "bg-danger-600 hover:bg-danger-700 text-white cursor-pointer"
                    : "bg-grey-10 text-grey-40 cursor-not-allowed"
                }`}
              >
                {isPurging ? (
                  <>
                    <Loader />
                    Purging...
                  </>
                ) : (
                  "Purge Now"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

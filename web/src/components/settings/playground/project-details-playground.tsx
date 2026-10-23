"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";
import { getAllProjectsApi } from "@/src/app/(dashboard)/manage/loader";
import {
  downloadProjectDetailsCsvApi,
  getProjectDetailsApi,
  ProjectDetailsRecord,
} from "@/src/app/(dashboard)/settings/loader";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import type { ProjectDetail } from "@/src/types/global";
import Loader from "@/src/components/ui/loader";
import ProjectChecklist from "./project-checklist";
import CurlPreview from "./curl-preview";
import ResultTable from "./result-table";

type ResponseType = "json" | "csv";

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

interface ProjectDetailsPlaygroundProps {
  workspaceId?: string;
}

export default function ProjectDetailsPlayground({
  workspaceId: workspaceIdProp,
}: ProjectDetailsPlaygroundProps = {}) {
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const activeWorkspaceId = workspaceIdProp ?? currentWorkspace?.id;

  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [responseType, setResponseType] = useState<ResponseType>("json");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ProjectDetailsRecord[] | null>(null);

  useEffect(() => {
    setSelectedProjectIds([]);
    setResult(null);
  }, [activeWorkspaceId]);

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
        if (response.success) setProjects(response.data);
      } catch (error) {
        toast.error((error as Error).message || "Failed to load projects.");
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [activeWorkspaceId]);

  const toggleProject = (id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const downloadCsv = async () => {
    try {
      const blob = await downloadProjectDetailsCsvApi(selectedProjectIds);
      triggerBlobDownload(blob, "project-details.csv");
    } catch (error) {
      toast.error((error as Error).message || "Failed to download CSV.");
    }
  };

  const handleRun = async () => {
    if (!selectedProjectIds.length) {
      toast.error("Select at least one project.");
      return;
    }

    setIsRunning(true);
    setResult(null);
    try {
      if (responseType === "csv") {
        await downloadCsv();
      } else {
        const response = await getProjectDetailsApi(selectedProjectIds);
        if (response.success) setResult(response.data);
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to run request.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-grey-20 flex-col justify-start items-start inline-flex shadow-sm overflow-hidden">
      <div className="self-stretch p-6 border-b border-grey-20">
        <h2 className="text-grey-90 font-semibold text-base sm:text-lg">
          Project Data Playground
        </h2>
        <p className="text-grey-60 text-sm mt-1">
          Select one or more projects to preview the data and get a ready-to-run
          cURL command.
        </p>
      </div>

      <div className="self-stretch p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-5">
          <ProjectChecklist
            projects={projects}
            loading={loadingProjects}
            selectedProjectIds={selectedProjectIds}
            onToggle={toggleProject}
            onSelectAll={() => setSelectedProjectIds(projects.map((p) => p.id))}
            onClearAll={() => setSelectedProjectIds([])}
          />

          <div className="flex flex-col gap-2">
            <label className="text-grey-80 text-sm font-semibold">
              Response Type
            </label>
            <div className="inline-flex rounded-lg border border-grey-20 bg-grey-5/40 p-1 w-fit">
              {(["json", "csv"] as ResponseType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setResponseType(type)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium uppercase transition-all ${
                    responseType === type
                      ? "bg-blue-40 text-white shadow-sm"
                      : "text-grey-60 hover:text-grey-80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning || !selectedProjectIds.length}
            className={`w-full py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 border shadow-sm ${
              !isRunning && selectedProjectIds.length
                ? "bg-blue-40 hover:bg-blue-50 text-white cursor-pointer border-blue-50"
                : "bg-grey-10 text-grey-40 cursor-not-allowed border-transparent"
            }`}
          >
            {isRunning ? (
              <>
                <Loader />
                Running...
              </>
            ) : responseType === "csv" ? (
              "Run & Download CSV"
            ) : (
              "Run"
            )}
          </button>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <CurlPreview
            projectIds={selectedProjectIds}
            responseType={responseType}
          />
          {responseType === "json" && (
            <ResultTable records={result} onDownloadCsv={downloadCsv} />
          )}
        </div>
      </div>
    </div>
  );
}

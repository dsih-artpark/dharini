"use client";
import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";

import Link from "next/link";
import CreateProject from "@/src/components/manage/create-project";
import {
  getProjectStatisticsApi,
  downloadCsvProjectsApi,
} from "@/src/app/(dashboard)/manage/loader";
import { formatDate } from "@/src/utils";
import { projectStatisticsAtom } from "@/src/store/projectStatisticsAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import {
  useHasPermission,
  useIsSuperAdmin,
  useIsWorkspaceAdmin,
} from "@/src/hooks/check-permission";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";
import Spinner from "@/src/components/ui/spinner";
import analytics from "@/src/lib/analytics";

export default function Statistics() {
  const [statistics, setStatistics] = useAtom(projectStatisticsAtom);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const hasPermission = useHasPermission();
  const allowCreateProject = hasPermission("create", "project");
  const isSuperAdmin = useIsSuperAdmin();
  const isWorkspaceAdmin = useIsWorkspaceAdmin();
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);

  const fetchProjectStatistics = async () => {
    const { success, data } = await getProjectStatisticsApi({
      workspaceId: currentWorkspace?.id,
    });
    if (success) {
      setStatistics(data);
    }
  };

  useEffect(() => {
    fetchProjectStatistics();
    analytics.adminFlowViewed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace?.id]);

  const handleDownloadClick = async () => {
    try {
      setDownloading(true);
      const blob = await downloadCsvProjectsApi();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `projects.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      toast.error((error as Error)?.message ?? "Error downloading CSV");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 rounded-3xl bg-white px-6 py-8 sm:px-8 lg:px-12 lg:py-10 shadow-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold leading-tight text-grey-90 sm:text-[32px]">
              Projects
            </h1>
            <p className="text-base leading-normal text-grey-60">
              Details of all projects conducting disease surveillance in your
              state.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(isSuperAdmin || isWorkspaceAdmin) && (
              <>
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-40 px-4 py-2.5 text-sm font-medium leading-[21px] text-white transition-colors hover:bg-primary-700"
                  href="/manage/sample-types"
                >
                  Manage Sample Types
                </Link>
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-40 px-4 py-2.5 text-sm font-medium leading-[21px] text-white transition-colors hover:bg-primary-700"
                  href="/manage/species"
                >
                  Manage Species
                </Link>
              </>
            )}
            {allowCreateProject && (
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-40 px-4 py-2.5 text-sm font-medium leading-[21px] text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-grey-40 disabled:text-grey-0 disabled:hover:bg-grey-40"
                onClick={() => setIsOpen(true)}
                disabled={!currentWorkspace?.id}
                title={
                  !currentWorkspace?.id
                    ? "Select a workspace before creating a project."
                    : undefined
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M7.33398 7.33398V3.33398H8.66732V7.33398H12.6673V8.66732H8.66732V12.6673H7.33398V8.66732H3.33398V7.33398H7.33398Z"
                    fill="white"
                  />
                </svg>
                Create a Project
              </button>
            )}
            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium leading-[21px] text-primary-500 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:border-0 disabled:bg-grey-40 disabled:text-grey-0"
              onClick={handleDownloadClick}
              disabled={downloading}
            >
              {downloading ? (
                <Spinner />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                >
                  <path
                    d="M9.16536 6.66667H12.4987L8.4987 10.6667L4.4987 6.66667H7.83203V2H9.16536V6.66667ZM3.16536 12.6667H13.832V8H15.1654V13.3333C15.1654 13.5101 15.0951 13.6797 14.9701 13.8047C14.8451 13.9298 14.6755 14 14.4987 14H2.4987C2.32189 14 2.15232 13.9298 2.02729 13.8047C1.90227 13.6797 1.83203 13.5101 1.83203 13.3333V8H3.16536V12.6667Z"
                    fill="#284DB6"
                  />
                </svg>
              )}
              Download Data
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statistics?.map((statistic, i) => {
            const border = [
              "border-l-primary-500",
              "border-l-teal-30",
              "border-l-purple-10",
              "border-l-orange-30",
            ][i % 4];
            const pillBg =
              DISEASE_COLOR_CODE.BG_COLOR[statistic.disease?.index % 6];
            return (
              <div
                key={i}
                className={`flex flex-col justify-between gap-2 rounded-xl bg-grey-10 p-5 border-l-4 ${border} shadow-sm`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base leading-normal text-grey-80">
                    {statistic.disease
                      ? (statistic.disease?.name ?? "-")
                      : "Total"}
                  </p>
                  {statistic.disease?.name && (
                    <div
                      className={`rounded px-2 py-1 ${pillBg ?? "bg-teal-20"}`}
                    >
                      <p className="text-[10px] font-bold uppercase leading-[15px] tracking-tight text-grey-80">
                        {statistic.disease?.shortName ??
                          statistic.disease?.name
                            ?.split(" ")
                            .map((d) => d.charAt(0))}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-semibold leading-[25px] text-grey-90">
                      {statistic.totalProjects}
                    </p>
                    <p className="text-xs font-bold uppercase leading-[18px] tracking-wide text-grey-60">
                      Projects
                    </p>
                  </div>
                  <div className="h-[47px] w-px bg-grey-20" />
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-semibold leading-[25px] text-grey-90">
                      {statistic.totalProjectLocations}
                    </p>
                    <p className="text-xs font-bold uppercase leading-[18px] tracking-wide text-grey-60">
                      Locations
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <p className="text-base leading-normal text-grey-60">Last Updated</p>
          <p className="text-base font-semibold leading-normal text-grey-80">
            {formatDate(new Date())}
          </p>
        </div>
      </div>

      <CreateProject
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        workspaceId={currentWorkspace?.id}
      />
    </>
  );
}

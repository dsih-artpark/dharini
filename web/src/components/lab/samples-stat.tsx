"use client";

import { useEffect, useState } from "react";
// import Image from "next/image";
import { useAtomValue } from "jotai";
import {
  Beaker,
  FileCheck,
  FlaskConical,
  Microscope,
  PackageOpen,
  XCircle,
} from "lucide-react";

import Select from "@/src/components/ui/select";
import { getSamplesStatisticsApi } from "@/src/app/(dashboard)/lab/loader";
import { labAllProjectsAtom } from "@/src/store/labAllProjectsAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { ALL_PROJECTS_ID } from "@/src/lib/super-admin-lab-flow";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import { formatDate } from "@/src/utils";
import { SampleStatistics } from "@/src/types/sample";
import Spinner from "@/src/components/ui/spinner";

const PIPELINE_STAGES: {
  key: keyof SampleStatistics;
  label: string;
  Icon: React.ElementType;
  bg: string;
  iconBg: string;
  iconColor: string;
  bar: string;
  text: string;
}[] = [
  {
    key: "totalCollected",
    label: "Collected",
    Icon: FlaskConical,
    bg: "bg-orange-10",
    iconBg: "bg-orange-20",
    iconColor: "text-orange-50",
    bar: "bg-orange-30",
    text: "text-orange-60",
  },
  {
    key: "totalReceived",
    label: "Received",
    Icon: PackageOpen,
    bg: "bg-blue-10",
    iconBg: "bg-blue-20",
    iconColor: "text-blue-40",
    bar: "bg-blue-40",
    text: "text-blue-50",
  },
  {
    key: "totalPreprocessed",
    label: "Pre-processed",
    Icon: Beaker,
    bg: "bg-teal-10",
    iconBg: "bg-teal-20",
    iconColor: "text-teal-50",
    bar: "bg-teal-30",
    text: "text-teal-60",
  },
  {
    key: "totalRejected",
    label: "Rejected",
    Icon: XCircle,
    bg: "bg-red-10",
    iconBg: "bg-red-20",
    iconColor: "text-red-50",
    bar: "bg-red-40",
    text: "text-red-60",
  },
  {
    key: "totalExtracted",
    label: "Extracted",
    Icon: Microscope,
    bg: "bg-yellow-10",
    iconBg: "bg-yellow-20",
    iconColor: "text-yellow-50",
    bar: "bg-yellow-30",
    text: "text-yellow-60",
  },
  {
    key: "totalCompleted",
    label: "Report Generated",
    Icon: FileCheck,
    bg: "bg-green-10",
    iconBg: "bg-green-20",
    iconColor: "text-green-50",
    bar: "bg-green-30",
    text: "text-green-60",
  },
];

export default function SamplesStat() {
  const isAll = useAtomValue(labAllProjectsAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const { resolveProjectId } = useCurrentProjectResolver();
  // 4.4: workspace-admins have no user.project, so fall back to the current
  // workspace's first project.
  const effectiveProjectId = isAll ? ALL_PROJECTS_ID : resolveProjectId();
  const [filter, setFilter] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });
  const [samplesStatData, setSamplesStatData] = useState<SampleStatistics>();
  const [isLoading, setIsLoading] = useState(true);

  const handleDateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const now = new Date();
    if (e.target.value === "") {
      setFilter((prev) => ({ ...prev, startDate: "", endDate: "" }));
    }
    if (e.target.value === "this-month") {
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      ).toISOString();
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
      ).toISOString();
      setFilter((prev) => ({ ...prev, startDate, endDate }));
    }
    if (e.target.value === "last-month") {
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      ).toISOString();
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
      ).toISOString();
      setFilter((prev) => ({ ...prev, startDate, endDate }));
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (!effectiveProjectId) {
        throw new Error("There is no associated project for the lab user");
      }
      const response = await getSamplesStatisticsApi(effectiveProjectId, {
        ...filter,
        workspaceId: currentWorkspace?.id,
      });
      if (response.success) {
        setSamplesStatData(response.data);
      }
    } catch (error) {
      console.error("Error fetching samples statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveProjectId) fetchData();
  }, [
    effectiveProjectId,
    currentWorkspace?.id,
    filter.startDate,
    filter.endDate,
  ]);

  const total = samplesStatData
    ? PIPELINE_STAGES.reduce((sum, s) => sum + (samplesStatData[s.key] || 0), 0)
    : 0;

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-grey-20 bg-white p-5 shadow-card sm:p-6">
      {/* <div className="flex flex-col justify-between gap-6 self-stretch sm:flex-row">
        <div className="flex flex-col gap-4 self-stretch">
          <h1 className="text-2xl font-semibold leading-tight text-grey-90 sm:text-[32px]">
            {user?.team?.teamName ?? ""}
          </h1>
          <div className="flex flex-col gap-2 self-stretch text-sm sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.0003 18.3332C5.39783 18.3332 1.66699 14.6023 1.66699 9.99984C1.66699 5.39734 5.39783 1.6665 10.0003 1.6665C14.6028 1.6665 18.3337 5.39734 18.3337 9.99984C18.3337 14.6023 14.6028 18.3332 10.0003 18.3332ZM5.84449 15.2132C7.02412 16.1563 8.49006 16.6689 10.0003 16.6665C11.642 16.6665 13.1445 16.0732 14.3062 15.0898C13.7634 14.533 13.1145 14.0906 12.3979 13.7888C11.6812 13.4871 10.9113 13.3322 10.1337 13.3332C9.32748 13.3322 8.52991 13.4989 7.79155 13.8225C7.05318 14.1462 6.39014 14.6197 5.84449 15.2132ZM10.0003 10.8332C9.11627 10.8332 8.26842 10.482 7.6433 9.85686C7.01818 9.23174 6.66699 8.38389 6.66699 7.49984C6.66699 6.61578 7.01818 5.76794 7.6433 5.14281C8.26842 4.51769 9.11627 4.1665 10.0003 4.1665C10.8844 4.1665 11.7322 4.51769 12.3573 5.14281C12.9825 5.76794 13.3337 6.61578 13.3337 7.49984C13.3337 8.38389 12.9825 9.23174 12.3573 9.85686C11.7322 10.482 10.8844 10.8332 10.0003 10.8332Z"
                    fill="#889096"
                  />
                </svg>
              </div>
              <p className="capitalize leading-normal text-grey-70">
                {user?.roles?.length
                  ? user.roles
                      .map((role) => role.role?.name?.replace("-", " "))
                      .join(", ")
                  : "-"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold leading-normal text-grey-80">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-grey-80 underline">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-grey-20 bg-teal-10 sm:h-20 sm:w-20">
          {user?.team?.logo ? (
            <Image
              className="h-full w-full object-cover"
              src={user.team.logo}
              width={140}
              height={140}
              alt="profile photo"
            />
          ) : (
            <p className="whitespace-nowrap text-center text-xl font-semibold uppercase leading-none text-grey-80 sm:text-2xl">
              {user?.team?.teamName
                ?.split(" ")
                ?.map((name) => name?.charAt(0))
                .join("")}
            </p>
          )}
        </div>
      </div> */}

      <div className="self-stretch border-b border-grey-20" />

      <div className="flex flex-col items-start justify-between gap-6 self-stretch sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-grey-90">
            Samples in Pipeline
          </h2>
          <p className="text-sm leading-normal text-grey-60">
            Live snapshot of sample counts across each processing stage
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <p className="text-xs text-grey-60">Showing data for:</p>
          <Select
            name="region"
            options={[
              { label: "This Month", value: "this-month" },
              { label: "Last Month", value: "last-month" },
            ]}
            onChange={handleDateSelect}
            placeholder="All Time"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-grey-20 bg-grey-10 p-4 sm:p-5">
        <div className="flex items-end gap-3">
          {isLoading ? (
            <Spinner />
          ) : (
            <span className="text-4xl font-semibold leading-none text-grey-90">
              {total}
            </span>
          )}
          <span className="pb-1 text-sm leading-snug text-grey-60">
            total samples
            <br />
            in pipeline
          </span>
        </div>

        <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-grey-20">
          {isLoading ? (
            <div className="h-full w-full rounded-full bg-grey-40" />
          ) : total === 0 ? (
            <div className="h-full w-full rounded-full bg-grey-20" />
          ) : (
            PIPELINE_STAGES.map((stage, index) => {
              const value = samplesStatData?.[stage.key] || 0;
              if (value === 0) return null;
              return (
                <div
                  key={index}
                  className={`h-full transition-all duration-700 ${stage.bar}`}
                  style={{ width: `${(value / total) * 100}%` }}
                  title={`${stage.label}: ${value}`}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {PIPELINE_STAGES.map((stage, index) => {
          const value = samplesStatData?.[stage.key] || 0;
          const pct = total > 0 ? ((value / total) * 100).toFixed(0) : "0";
          const { Icon } = stage;

          return (
            <div
              key={index}
              className="rounded-xl border border-grey-20 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${stage.iconBg}`}
                >
                  <Icon size={16} className={stage.iconColor} strokeWidth={2} />
                </div>
                {!isLoading && total > 0 && (
                  <p className={`text-xs font-semibold ${stage.text}`}>
                    {pct}%
                  </p>
                )}
              </div>
              {isLoading ? (
                <div className="mt-5 flex h-8 items-center">
                  <Spinner />
                </div>
              ) : (
                <p className="mt-5 text-3xl font-semibold leading-none text-grey-90">
                  {value}
                </p>
              )}
              <p className="mt-2 text-sm font-medium leading-5 text-grey-70">
                {stage.label}
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-grey-20">
                <div
                  className={`h-full rounded-full ${stage.bar}`}
                  style={{ width: total > 0 ? `${pct}%` : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 border-t border-grey-20 pt-4 text-sm text-grey-60">
        <span>Last updated:</span>
        <span className="font-semibold text-grey-70">
          {formatDate(new Date())}
        </span>
      </div>
    </section>
  );
}

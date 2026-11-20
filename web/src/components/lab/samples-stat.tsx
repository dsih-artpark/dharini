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

const PIPELINE_STAGES: {
  key: keyof SampleStatistics;
  label: string;
  Icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  bar: string;
}[] = [
  {
    key: "totalCollected",
    label: "Collected",
    Icon: FlaskConical,
    iconBg: "bg-orange-10",
    iconColor: "text-orange-30",
    bar: "bg-orange-30",
  },
  {
    key: "totalReceived",
    label: "Received",
    Icon: PackageOpen,
    iconBg: "bg-blue-10",
    iconColor: "text-blue-40",
    bar: "bg-blue-40",
  },
  {
    key: "totalPreprocessed",
    label: "Pre-processed",
    Icon: Beaker,
    iconBg: "bg-teal-10",
    iconColor: "text-teal-30",
    bar: "bg-teal-30",
  },
  {
    key: "totalRejected",
    label: "Rejected",
    Icon: XCircle,
    iconBg: "bg-red-10",
    iconColor: "text-red-30",
    bar: "bg-red-30",
  },
  {
    key: "totalExtracted",
    label: "Extracted",
    Icon: Microscope,
    iconBg: "bg-yellow-10",
    iconColor: "text-yellow-30",
    bar: "bg-yellow-30",
  },
  {
    key: "totalCompleted",
    label: "Report Generated",
    Icon: FileCheck,
    iconBg: "bg-green-10",
    iconColor: "text-green-30",
    bar: "bg-green-30",
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
    <section className="flex flex-col gap-4 rounded-2xl border border-grey-20 bg-white p-5 shadow-card">
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

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-semibold text-grey-90">
            Samples in Pipeline
          </h2>
          <p className="text-sm text-grey-60">
            {isLoading ? (
              "Loading…"
            ) : (
              <>
                <span className="font-semibold text-grey-80">{total}</span>{" "}
                total samples
              </>
            )}{" "}
            · Updated {formatDate(new Date())}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <p className="text-xs text-grey-60">Showing data for</p>
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

      {/* Each stage's share of the total */}
      <div
        className={`flex h-2 w-full overflow-hidden rounded-full bg-grey-20 ${
          isLoading ? "animate-pulse" : ""
        }`}
      >
        {!isLoading &&
          total > 0 &&
          PIPELINE_STAGES.map((stage) => {
            const value = samplesStatData?.[stage.key] || 0;
            if (value === 0) return null;
            return (
              <div
                key={stage.key}
                className={`h-full transition-all duration-700 ${stage.bar}`}
                style={{ width: `${(value / total) * 100}%` }}
                title={`${stage.label}: ${value}`}
              />
            );
          })}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
        {PIPELINE_STAGES.map((stage) => {
          const value = samplesStatData?.[stage.key] || 0;
          const pct = total > 0 ? ((value / total) * 100).toFixed(0) : "0";
          const { Icon } = stage;

          return (
            <div
              key={stage.key}
              className="flex items-center gap-3 rounded-xl border border-grey-20 px-3 py-2.5"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stage.iconBg}`}
              >
                <Icon size={16} className={stage.iconColor} strokeWidth={2} />
              </span>
              <div className="min-w-0">
                {isLoading ? (
                  <span className="block h-5 w-10 animate-pulse rounded bg-grey-20" />
                ) : (
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-xl font-semibold leading-5 text-grey-90">
                      {value}
                    </span>
                    {total > 0 && (
                      <span className="text-xs font-medium text-grey-60">
                        {pct}%
                      </span>
                    )}
                  </p>
                )}
                <p className="mt-1 text-xs font-medium leading-4 text-grey-70">
                  {stage.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

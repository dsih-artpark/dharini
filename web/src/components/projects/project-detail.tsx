"use client";

import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  downloadCsvProjectDetailApi,
  getProjectDetailApi,
} from "@/src/app/(dashboard)/projects/[id]/loader";
import Loader from "@/src/components//ui/loader";
import Spinner from "@/src/components/ui/spinner";
import { projectAtom } from "@/src/store/projectAtom";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";

import { Region } from "@/src/types/global";

const MAX_DISTRICTS = 5;
const MAX_STATES = 2;

function LocationsDisplay({ regions }: { regions: Region[] }) {
  const groupedRegions: Record<
    string,
    { stateName: string; districts: string[] }
  > = {};

  regions?.forEach((region) => {
    if (region.regionType === "district" && region.parentRegion) {
      const stateId = region.parentRegion.id;
      if (!groupedRegions[stateId]) {
        groupedRegions[stateId] = {
          stateName: region.parentRegion.name,
          districts: [],
        };
      }
      groupedRegions[stateId].districts.push(region.name);
    } else if (region.regionType === "state") {
      if (!groupedRegions[region.id]) {
        groupedRegions[region.id] = {
          stateName: region.name,
          districts: [],
        };
      }
    }
  });

  const allStates = Object.values(groupedRegions);
  const visibleStates = allStates.slice(0, MAX_STATES);
  const hiddenStates = allStates.slice(MAX_STATES);

  return (
    <div className="flex flex-col gap-1">
      {visibleStates.map((group, index) => {
        const visibleDistricts = group.districts.slice(0, MAX_DISTRICTS);
        const hiddenDistricts = group.districts.slice(MAX_DISTRICTS);

        return (
          <p
            key={index}
            className="text-grey-80 text-base font-semibold leading-normal flex flex-wrap items-baseline gap-x-1"
          >
            <span>{group.stateName}:</span>
            <span className="font-normal text-grey-70">
              {visibleDistricts.join(", ")}
            </span>

            {hiddenDistricts.length > 0 && (
              <span className="relative group/districts inline-flex">
                <span className="cursor-pointer bg-grey-10 text-grey-70 border border-grey-20 text-xs font-semibold rounded-full px-2.5 py-0.5">
                  +{hiddenDistricts.length} more
                </span>
                {/* Tooltip */}
                <span className="hidden group-hover/districts:block absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-grey-90 text-white text-xs rounded-lg px-3 py-2 w-max max-w-[260px] leading-relaxed shadow-lg pointer-events-none">
                  {hiddenDistricts.join(", ")}
                  {/* Caret */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-grey-90" />
                </span>
              </span>
            )}
          </p>
        );
      })}

      {hiddenStates.length > 0 && (
        <span className="relative group/states inline-flex self-start mt-0.5">
          <span className="cursor-pointer bg-grey-10 text-grey-70 border border-grey-20 text-xs font-semibold rounded-full px-2.5 py-0.5">
            +{hiddenStates.length} states
          </span>
          {/* Tooltip */}
          <span className="hidden group-hover/states:block absolute top-full left-0 mt-2 z-50 bg-grey-90 text-white text-xs rounded-lg px-3 py-2 w-max max-w-[280px] leading-relaxed shadow-lg space-y-1 pointer-events-none">
            {hiddenStates.map((s, i) => (
              <p key={i}>
                <b>{s.stateName}</b>
                {s.districts.length > 0 &&
                  `: ${s.districts.slice(0, 4).join(", ")}${
                    s.districts.length > 4
                      ? ` +${s.districts.length - 4} more`
                      : ""
                  }`}
              </p>
            ))}
            {/* Caret */}
            <span className="absolute bottom-full left-4 border-[6px] border-transparent border-b-grey-90" />
          </span>
        </span>
      )}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [project, setProject] = useAtom(projectAtom);

  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      const { data } = await getProjectDetailApi(id);
      setProject(data);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, []);

  const handleDownloadClick = async () => {
    try {
      setDownloading(true);
      const blob = await downloadCsvProjectDetailApi(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `project-${project?.id}.csv`;
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
    <section className="rounded-3xl border border-grey-20 bg-white px-6 py-8 shadow-card sm:px-8 lg:px-10 lg:py-10">
      {loading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Project name + disease tags */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold leading-tight text-grey-90 sm:text-[32px]">
              {project?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {project?.diseases?.map((disease) => (
                <span
                  key={disease.id}
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-grey-80 ${
                    DISEASE_COLOR_CODE.BG_COLOR[disease.index % 6]
                  }`}
                >
                  {disease.shortName}
                </span>
              ))}
            </div>
          </div>

          {/* Team admins */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-grey-60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M2.5 4.1625C2.5 3.24417 3.24417 2.5 4.1625 2.5H15.8375C16.7558 2.5 17.5 3.24417 17.5 4.1625V15.8375C17.5 16.2784 17.3248 16.7013 17.0131 17.0131C16.7013 17.3248 16.2784 17.5 15.8375 17.5H4.1625C3.72158 17.5 3.29871 17.3248 2.98693 17.0131C2.67516 16.7013 2.5 16.2784 2.5 15.8375V4.1625ZM4.16667 4.16667V15.8333H15.8333V4.16667H4.16667ZM6.64333 15.15C6.13082 14.928 5.64196 14.655 5.18417 14.335C5.71272 13.5159 6.4383 12.8424 7.29449 12.3762C8.15068 11.91 9.11013 11.6661 10.085 11.6667C12.085 11.6667 13.8492 12.6725 14.9 14.2058C14.451 14.538 13.9697 14.8242 13.4633 15.06C13.0774 14.525 12.5698 14.0894 11.9824 13.7892C11.395 13.489 10.7447 13.3327 10.085 13.3333C8.65583 13.3333 7.39333 14.0533 6.64333 15.15ZM10 10.8333C9.61698 10.8333 9.23771 10.7579 8.88384 10.6113C8.52997 10.4647 8.20844 10.2499 7.93761 9.97906C7.66677 9.70822 7.45193 9.38669 7.30535 9.03283C7.15877 8.67896 7.08333 8.29969 7.08333 7.91667C7.08333 7.53364 7.15877 7.15437 7.30535 6.80051C7.45193 6.44664 7.66677 6.12511 7.93761 5.85427C8.20844 5.58343 8.52997 5.36859 8.88384 5.22202C9.23771 5.07544 9.61698 5 10 5C10.7735 5 11.5154 5.30729 12.0624 5.85427C12.6094 6.40125 12.9167 7.14312 12.9167 7.91667C12.9167 8.69021 12.6094 9.43208 12.0624 9.97906C11.5154 10.526 10.7735 10.8333 10 10.8333ZM10 9.16667C10.3315 9.16667 10.6495 9.03497 10.8839 8.80055C11.1183 8.56613 11.25 8.24819 11.25 7.91667C11.25 7.58515 11.1183 7.2672 10.8839 7.03278C10.6495 6.79836 10.3315 6.66667 10 6.66667C9.66848 6.66667 9.35054 6.79836 9.11612 7.03278C8.8817 7.2672 8.75 7.58515 8.75 7.91667C8.75 8.24819 8.8817 8.56613 9.11612 8.80055C9.35054 9.03497 9.66848 9.16667 10 9.16667Z"
                  fill="#889096"
                />
              </svg>
              Team Admin
            </div>

            <div className="flex flex-col gap-1">
              {project?.projectAdmins.map((projectAdmin) => (
                <div
                  className="flex flex-col sm:flex-row sm:items-center sm:gap-2"
                  key={projectAdmin.id}
                >
                  <span className="text-base font-semibold text-grey-80">
                    {projectAdmin.firstName} {projectAdmin.lastName ?? ""}
                  </span>
                  <span className="text-sm text-primary-500 underline">
                    {projectAdmin.email}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-grey-60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 17.416L14.125 13.291C14.9408 12.4751 15.4963 11.4357 15.7213 10.3042C15.9463 9.17264 15.8308 7.99978 15.3892 6.93391C14.9477 5.86805 14.2 4.95704 13.2408 4.31609C12.2815 3.67514 11.1537 3.33304 10 3.33304C8.8463 3.33304 7.71851 3.67514 6.75924 4.31609C5.79997 4.95704 5.05229 5.86805 4.61076 6.93391C4.16923 7.99978 4.05368 9.17264 4.27871 10.3042C4.50374 11.4357 5.05926 12.4751 5.875 13.291L10 17.416ZM10 19.7726L4.69667 14.4693C3.64779 13.4204 2.93349 12.084 2.64411 10.6292C2.35473 9.1743 2.50326 7.66631 3.07092 6.29587C3.63858 4.92543 4.59987 3.75409 5.83324 2.92999C7.0666 2.10588 8.51665 1.66602 10 1.66602C11.4834 1.66602 12.9334 2.10588 14.1668 2.92999C15.4001 3.75409 16.3614 4.92543 16.9291 6.29587C17.4968 7.66631 17.6453 9.1743 17.3559 10.6292C17.0665 12.084 16.3522 13.4204 15.3033 14.4693L10 19.7726ZM10 10.8326C10.442 10.8326 10.866 10.657 11.1785 10.3445C11.4911 10.0319 11.6667 9.60798 11.6667 9.16595C11.6667 8.72392 11.4911 8.3 11.1785 7.98744C10.866 7.67488 10.442 7.49928 10 7.49928C9.55798 7.49928 9.13405 7.67488 8.82149 7.98744C8.50893 8.3 8.33334 8.72392 8.33334 9.16595C8.33334 9.60798 8.50893 10.0319 8.82149 10.3445C9.13405 10.657 9.55798 10.8326 10 10.8326ZM10 12.4993C9.11595 12.4993 8.2681 12.1481 7.64298 11.523C7.01786 10.8979 6.66667 10.05 6.66667 9.16595C6.66667 8.2819 7.01786 7.43405 7.64298 6.80893C8.2681 6.18381 9.11595 5.83262 10 5.83262C10.8841 5.83262 11.7319 6.18381 12.357 6.80893C12.9821 7.43405 13.3333 8.2819 13.3333 9.16595C13.3333 10.05 12.9821 10.8979 12.357 11.523C11.7319 12.1481 10.8841 12.4993 10 12.4993Z"
                  fill="#889096"
                />
              </svg>
              Locations
            </div>

            <div className="flex flex-col items-start justify-center">
              <LocationsDisplay regions={project?.regions ?? []} />
            </div>
          </div>
        </div>
      )}

      <button
        className="hidden items-center justify-center gap-2 rounded-lg border border-primary-500 px-3 py-2 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:border-0 disabled:bg-grey-40 disabled:text-grey-0"
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
    </section>
  );
}

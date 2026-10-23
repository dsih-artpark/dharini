"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProjectWithStat } from "@/src/types/statistics";
import { getAllProjectsWithStatApi } from "@/src/app/(dashboard)/home/loader";
import Loader from "@/src/components/ui/loader";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";

const MAX_VISIBLE_REGIONS = 5;

export default function ProjectsCarousel() {
  const [projectsByPage, setProjectsByPage] = useState<{
    [key: number]: ProjectWithStat[];
  }>({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProjectList = async () => {
    if (projectsByPage[page]?.every((p) => p.id)) {
      return;
    }
    setLoading(true);
    const data = await getAllProjectsWithStatApi({ page, limit: 2 });
    if (data.success) {
      const defaultObj =
        data.total > 1
          ? Object.fromEntries(
              Array.from({ length: data.totalPages }, (_, i) => [
                i + 1,
                [{}, {}],
              ]),
            )
          : {};
      const projects =
        data.total > 1 && data.data.length === 1
          ? [...data.data, {}]
          : data.data;
      setProjectsByPage((prev) => ({
        ...defaultObj,
        ...prev,
        [data.page]: projects,
      }));
      setPage(Number(data.page));
      setTotalPages(data.totalPages);
      setTotal(data.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjectList();
  }, [page]);

  const handlePrev = () => {
    setPage((prev) => (prev === 1 ? totalPages : prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev === totalPages ? 1 : prev + 1));
  };

  return (
    <>
      {loading && <Loader />}
      {page > 0 && total > 0 && (
        <div className="w-full overflow-hidden">
          <motion.div
            key={page}
            style={{
              width: `${totalPages * 100}%`,
            }}
            className="inline-flex items-stretch justify-start gap-6"
            animate={{ x: `-${(page - 1) * (100 / totalPages)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {Object.values(projectsByPage)
              .flat()
              .map((project, index) => {
                const stateRegions = (project?.regions ?? []).filter((l) =>
                  l?.id?.startsWith("state_"),
                );

                return project.id ? (
                  <motion.div
                    key={index}
                    className={`${
                      total > 1 ? "w-full sm:w-1/2" : "w-full"
                    } h-full rounded-xl border border-grey-20 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-md`}
                  >
                    <div className="flex h-full flex-col gap-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <p className="min-w-0 flex-1 text-xl font-semibold leading-7 text-grey-90">
                            {project?.name}
                          </p>
                          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                            {project?.diseases?.length
                              ? project?.diseases.map((disease) => (
                                  <div
                                    key={disease.id}
                                    className={`flex items-center justify-center gap-1 rounded-md px-2 py-1 ${
                                      DISEASE_COLOR_CODE.BG_COLOR[
                                        disease.index % 6
                                      ]
                                    }`}
                                  >
                                    <p className="text-[10px] font-medium uppercase leading-[15px] text-grey-80">
                                      {disease.shortName}
                                    </p>
                                  </div>
                                ))
                              : "-"}
                          </div>
                        </div>

                        {/* Regions — uses div+span instead of p to avoid hydration error */}
                        <div className="flex items-start gap-2">
                          <div className="relative mt-0.5 h-5 w-5 flex-shrink-0">
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
                          </div>
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-base leading-normal text-grey-70">
                              {stateRegions
                                .slice(0, MAX_VISIBLE_REGIONS)
                                .map((l) => l?.name)
                                .join(", ")}
                              {stateRegions.length > MAX_VISIBLE_REGIONS && ","}
                            </span>
                            {stateRegions.length > MAX_VISIBLE_REGIONS && (
                              <div className="relative group inline-block">
                                <span className="cursor-pointer whitespace-nowrap rounded-full bg-blue-10 px-2 py-0.5 text-xs font-medium text-blue-40">
                                  +{stateRegions.length - MAX_VISIBLE_REGIONS}{" "}
                                  more
                                </span>
                                <div className="absolute bottom-full left-0 z-20 mb-1 hidden w-64 rounded-lg border border-grey-20 bg-white p-3 shadow-dropdown group-hover:block">
                                  <span className="text-xs leading-5 text-grey-70">
                                    {stateRegions
                                      .slice(MAX_VISIBLE_REGIONS)
                                      .map((l) => l?.name)
                                      .join(", ")}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-6">
                        <div className="flex items-start gap-6">
                          <div className="flex min-w-0 flex-1 flex-col gap-4">
                            <div className="flex items-center gap-2.5 border-b border-grey-20 py-2">
                              <p className="text-sm font-medium leading-[21px] text-grey-80">
                                Sites
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="rounded-lg bg-grey-10 p-3">
                                <div className="flex items-center gap-2">
                                  <p className="text-xl font-semibold leading-[25px] text-grey-90">
                                    {project.visitedSites ?? 0}
                                  </p>
                                </div>
                                <p className="mt-1 text-xs font-bold uppercase leading-[18px] tracking-wide text-grey-60">
                                  visited
                                </p>
                              </div>
                              <div className="rounded-lg bg-grey-10 p-3">
                                <div className="flex items-center gap-2">
                                  <p className="text-xl font-semibold leading-[25px] text-yellow-30">
                                    {project.notVisitedSites ?? 0}
                                  </p>
                                </div>
                                <p className="mt-1 text-xs font-bold uppercase leading-[18px] tracking-wide text-grey-60">
                                  pending
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2.5 border-b border-grey-20 py-2">
                            <p className="text-sm font-medium leading-[21px] text-grey-80">
                              Positive Samples
                            </p>
                          </div>
                          <div className="flex min-h-[60px] flex-col gap-2">
                            {project.diseaseStatistics?.map((ds, i) => {
                              const bgColor =
                                DISEASE_COLOR_CODE.CHART_COLOR[
                                  ds.diseaseIndex % 6
                                ];
                              const value =
                                ds.totalSamples > 0
                                  ? ((ds.positiveSamples ?? 0) /
                                      (ds.totalSamples ?? 0)) *
                                    100
                                  : 0;
                              return (
                                <div
                                  key={i}
                                  className="flex h-4 items-center gap-2"
                                >
                                  <p className="w-6 text-[10px] uppercase leading-[15px] tracking-tight text-grey-70">
                                    {ds.diseaseShortName}
                                  </p>
                                  <div className="flex w-full items-center gap-2.5 self-stretch rounded-full bg-grey-10">
                                    <div
                                      className={`self-stretch rounded-full ${bgColor}`}
                                      style={{
                                        width: `${value}%`,
                                      }}
                                    >
                                      <p className="text-center text-[10px] text-grey-0">
                                        {Number(value).toFixed(0)}%
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex w-10 items-center justify-center gap-1">
                                    <p className="whitespace-nowrap text-[10px] uppercase leading-[15px] tracking-tight text-grey-80">
                                      {ds.positiveSamples} / {ds.totalSamples}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/projects/${project?.id}`}
                        className="mt-auto inline-flex items-center justify-between rounded-lg bg-blue-10 px-3 py-2 transition hover:bg-blue-20"
                      >
                        <p className="min-w-0 flex-1 text-sm font-semibold leading-[21px] text-blue-40">
                          View Project Details
                        </p>
                        <div className="relative h-4 w-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M8.78047 8.00048L5.48047 4.70048L6.42314 3.75781L10.6658 8.00048L6.42314 12.2431L5.48047 11.3005L8.78047 8.00048Z"
                              fill="#284DB6"
                            />
                          </svg>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={index}
                    className="w-1/2 rounded-xl bg-white p-5"
                  />
                );
              })}
          </motion.div>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex w-full items-center justify-center gap-10">
          <button
            className="p-1 rounded-[999px] justify-center items-center gap-2 flex disabled:opacity-30"
            onClick={handlePrev}
            disabled={page === 1}
          >
            <div className="w-4 h-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7.21932 8.00048L10.5193 11.3005L9.57665 12.2431L5.33398 8.00048L9.57665 3.75781L10.5193 4.70048L7.21932 8.00048Z"
                  fill="#284DB6"
                />
              </svg>
            </div>
          </button>
          <div className="justify-center items-center gap-1 flex">
            {Array(totalPages)
              .fill("")
              .map((_, index) => (
                <button
                  key={index}
                  className={`h-1 rounded-[99px] transition-all ${
                    page === index + 1 ? "w-6 bg-blue-40" : "w-1 bg-grey-40"
                  }`}
                  onClick={() => setPage(index + 1)}
                />
              ))}
          </div>
          <button
            className="p-1 rounded-[999px] justify-center items-center gap-2 flex disabled:opacity-30"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            <div className="w-4 h-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8.78047 8.00048L5.48047 4.70048L6.42314 3.75781L10.6658 8.00048L6.42314 12.2431L5.48047 11.3005L8.78047 8.00048Z"
                  fill="#284DB6"
                />
              </svg>
            </div>
          </button>
        </div>
      )}
    </>
  );
}

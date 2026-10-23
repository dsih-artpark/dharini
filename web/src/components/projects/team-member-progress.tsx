import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAtom } from "jotai";

import type { TeamMemberProgress } from "@/src/types/teams";
import {
  getTeamMemberProgressApi,
  downloadCsvTeamMemberProgressApi,
  getProjectDetailApi,
} from "@/src/app/(dashboard)/projects/[id]/loader";
import Spinner from "@/src/components/ui/spinner";
import { projectAtom } from "@/src/store/projectAtom";
import Pagination from "@/src/components/ui/pagination";
import Select from "@/src/components/ui/select";
import Tabs from "@/src/components/ui/tabs";
import Loader from "@/src/components/ui/loader";

export default function TeamMemberProgress() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useAtom(projectAtom);

  const [members, setMembers] = useState<TeamMemberProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [filter, setFilter] = useState<{
    diseaseId: string;
    startDate: string;
    endDate: string;
    sort?: keyof TeamMemberProgress;
    sortOrder?: "asc" | "desc";
  }>({
    diseaseId: project?.diseases[0]?.id ?? "",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchProjectDetail = async () => {
    try {
      const { data } = await getProjectDetailApi(id);
      setProject(data);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    }
  };

  useEffect(() => {
    if (!project) fetchProjectDetail();
  }, []);

  useEffect(() => {
    if (project?.diseases?.length) {
      setFilter((prev) => ({ ...prev, diseaseId: project?.diseases[0].id }));
    }
  }, [project?.diseases]);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTeamMemberProgressApi(id, {
        ...filter,
        page,
        limit: 10,
      });
      setMembers(response.data);
      setTotalPages(response.totalPages);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [filter, page, id]);

  useEffect(() => {
    if (filter.diseaseId) fetchMembers();
  }, [
    filter.diseaseId,
    filter.startDate,
    filter.endDate,
    page,
    filter.sort,
    filter.sortOrder,
    fetchMembers,
  ]);

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

  const handleDownloadClick = async () => {
    try {
      setDownloading(true);
      const blob = await downloadCsvTeamMemberProgressApi(id, filter);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `team-member-progress.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      toast.error((error as Error)?.message ?? "Error downloading CSV");
    } finally {
      setDownloading(false);
    }
  };

  const handleSortClick = (fieldName: keyof TeamMemberProgress) => {
    setFilter((prev) => {
      if (prev.sort !== fieldName) {
        return {
          ...prev,
          sort: fieldName,
          sortOrder: "asc",
        };
      }

      let newSortOrder: "asc" | "desc" | undefined;
      if (prev.sortOrder === "asc") {
        newSortOrder = "desc";
      } else if (prev.sortOrder === "desc") {
        newSortOrder = undefined;
      } else {
        newSortOrder = "asc";
      }

      return {
        ...prev,
        sort: newSortOrder ? fieldName : undefined,
        sortOrder: newSortOrder,
      };
    });
  };

  const columns: [keyof TeamMemberProgress, string][] = [
    ["firstName", "User Name"],
    ["siteName", "Site Name"],
    ["pendingVisitCount", "Pending"],
    ["completedVisitCount", "Completed"],
    ["totalCollected", "Samples Collected"],
    ["totalReceived", "Samples Received"],
    ["totalExtracted", "Samples Extracted"],
    ["totalTested", "Samples Tested"],
    ["totalReportGenerated", "Report Generated"],
  ];

  return (
    <section className="flex flex-col gap-0 rounded-2xl border border-grey-20 bg-white shadow-card overflow-hidden">
      <div className="flex flex-col gap-4 px-6 pt-6 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold leading-tight text-grey-90">
            Team Allocation & Progress
          </h2>
          <p className="text-sm text-grey-500">
            Track member-wise progress across sites
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-500 px-3 py-2 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:border-0 disabled:bg-grey-40 disabled:text-grey-0"
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
              className="h-4 w-4"
            >
              <path
                d="M9.16536 6.66667H12.4987L8.4987 10.6667L4.4987 6.66667H7.83203V2H9.16536V6.66667ZM3.16536 12.6667H13.832V8H15.1654V13.3333C15.1654 13.5101 15.0951 13.6797 14.9701 13.8047C14.8451 13.9298 14.6755 14 14.4987 14H2.4987C2.32189 14 2.15232 13.9298 2.02729 13.8047C1.90227 13.6797 1.83203 13.5101 1.83203 13.3333V8H3.16536V12.6667Z"
                fill="currentColor"
              />
            </svg>
          )}
          Download Data
        </button>
      </div>

      <div className="flex flex-col gap-4 border-y border-grey-20 bg-primary-50 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          tabs={
            project?.diseases.map((disease) => ({
              id: disease.id,
              label: disease.shortName,
            })) ?? []
          }
          selected={filter.diseaseId}
          onTabClick={(tab) =>
            setFilter((prev) => ({ ...prev, diseaseId: tab.id }))
          }
        />
        <div className="flex items-center gap-3">
          <p className="text-xs text-grey-500">Showing data for:</p>
          <Select
            name="region"
            options={[
              { label: "This Month", value: "this-month" },
              { label: "Last Month", value: "last-month" },
            ]}
            onChange={handleDateSelect}
            placeholder="All Time"
          >
            <div className="h-5 w-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M14.166 2.50065H17.4993C17.7204 2.50065 17.9323 2.58845 18.0886 2.74473C18.2449 2.90101 18.3327 3.11297 18.3327 3.33398V16.6673C18.3327 16.8883 18.2449 17.1003 18.0886 17.2566C17.9323 17.4129 17.7204 17.5007 17.4993 17.5007H2.49935C2.27834 17.5007 2.06637 17.4129 1.91009 17.2566C1.75381 17.1003 1.66602 16.8883 1.66602 16.6673V3.33398C1.66602 3.11297 1.75381 2.90101 1.91009 2.74473C2.06637 2.58845 2.27834 2.50065 2.49935 2.50065H5.83268V0.833984H7.49935V2.50065H12.4993V0.833984H14.166V2.50065ZM12.4993 4.16732H7.49935V5.83398H5.83268V4.16732H3.33268V7.50065H16.666V4.16732H14.166V5.83398H12.4993V4.16732ZM16.666 9.16732H3.33268V15.834H16.666V9.16732Z"
                  fill="#889096"
                />
              </svg>
            </div>
          </Select>
        </div>
      </div>

      <div className="flex flex-col overflow-x-auto">
        <div className="min-w-fit flex items-center gap-6 border-b border-grey-20 bg-grey-10 px-6 py-3">
          {columns.map(([key, label]) => (
            <div
              key={key}
              className={`flex cursor-pointer items-center gap-2 ${
                key === "firstName"
                  ? "min-w-[160px] flex-[2]"
                  : key === "siteName"
                    ? "min-w-[160px] flex-[2]"
                    : "w-[110px]"
              }`}
              onClick={() =>
                key !== "firstName" && key !== "siteName"
                  ? handleSortClick(key)
                  : undefined
              }
            >
              <p className="text-sm font-medium text-grey-500">{label}</p>
              {key !== "firstName" && key !== "siteName" && (
                <div
                  className={`h-5 w-5 ${
                    filter.sort === key ? "text-primary-500" : "text-grey-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    className="fill-current"
                  >
                    <path d="M9.95703 7.125L8.7787 8.30333L6.66536 6.19V17.1667H4.9987V6.19L2.8862 8.30333L1.70703 7.125L5.83203 3L9.95703 7.125ZM18.2904 13.875L14.1654 18L10.0404 13.875L11.2187 12.6967L13.3329 14.81L13.332 3.83333H14.9987V14.81L17.112 12.6967L18.2904 13.875Z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex min-h-20 w-full items-center justify-center">
            <Loader />
          </div>
        )}

        {members.length > 0
          ? members.map((member, i) => (
              <div
                key={`${member.userId}-${member.siteId}-${i}`}
                className="min-w-fit flex items-center gap-6 border-b border-grey-20 bg-white px-6 py-3 transition-colors hover:bg-grey-10"
              >
                <div className="min-w-[160px] flex-[2]">
                  <p className="text-base font-medium text-grey-800">
                    {member.firstName} {member.lastName}
                  </p>
                </div>
                <div className="min-w-[160px] flex-[2]">
                  <p className="text-base text-grey-700">{member.siteName}</p>
                </div>
                <div className="w-[110px]">
                  <p className="text-base text-grey-700">
                    {member.pendingVisitCount ?? 0}
                  </p>
                </div>
                <div className="w-[110px]">
                  <p className="text-base text-grey-700">
                    {member.completedVisitCount ?? 0}
                  </p>
                </div>
                <div className="w-[110px]">
                  <p className="text-base text-grey-700">
                    {member.totalCollected ?? 0}
                  </p>
                </div>
                <div className="w-[110px]">
                  <p className="text-base text-grey-700">
                    {member.totalReceived ?? 0}
                  </p>
                </div>
                <div className="w-[110px]">
                  <p className="text-base text-grey-700">
                    {member.totalExtracted ?? 0}
                  </p>
                </div>
                <div className="w-[110px]">
                  <p className="text-base text-grey-700">
                    {member.totalTested ?? 0}
                  </p>
                </div>
                <div className="w-[110px]">
                  <p className="text-base text-grey-700">
                    {member.totalReportGenerated ?? 0}
                  </p>
                </div>
              </div>
            ))
          : !loading && (
              <p className="min-h-20 mb-10 mt-4 text-center text-base text-grey-500">
                No data found
              </p>
            )}

        <Pagination
          page={page}
          totalPages={totalPages ?? 0}
          goToPage={setPage}
          loading={loading}
        />
      </div>
    </section>
  );
}

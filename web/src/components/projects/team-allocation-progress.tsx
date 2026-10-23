import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import TeamAllocationItem from "@/src/components/projects/team-allocation-item";
import Pagination from "@/src/components/ui/pagination";
import { TeamProgress } from "@/src/types/teams";
import { getTeamProgressApi } from "@/src/app/(dashboard)/projects/[id]/loader";
import Loader from "@/src/components/ui/loader";
import { toast } from "react-toastify";

export default function TeamAllocationProgress() {
  const { id } = useParams<{ id: string }>();

  const [sitesStats, setSitesStats] = useState<TeamProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [filter, setFilter] = useState<{
    sort?: keyof TeamProgress;
    sortOrder?: "asc" | "desc";
  }>({});

  const fetchTeamProgress = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTeamProgressApi(id, {
        ...filter,
        page,
        limit: 10,
      });
      setSitesStats(response.data);
      setTotalPages(response.totalPages);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [id, page, filter]);

  useEffect(() => {
    fetchTeamProgress();
  }, [fetchTeamProgress, page, filter.sort, filter.sortOrder]);

  const handleSortClick = (fieldName: keyof TeamProgress) => {
    setFilter((prev) => {
      if (prev.sort !== fieldName) {
        // New sort field: start with ascending
        return {
          ...prev,
          sort: fieldName,
          sortOrder: "asc",
        };
      }

      // Same field: toggle sort order
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

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-grey-20 bg-white shadow-card overflow-hidden">
      <div className="flex flex-col gap-2 px-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold leading-tight text-grey-90">
          Team Allocation & Progress
        </h2>
        <Link
          href={`/projects/${id}/team-progress`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-500"
        >
          View All Team Members
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8.78047 8.00048L5.48047 4.70048L6.42314 3.75781L10.6658 8.00048L6.42314 12.2431L5.48047 11.3005L8.78047 8.00048Z"
              fill="#5D7FDD"
            />
          </svg>
        </Link>
      </div>
      {/* data-table */}
      <div className="flex flex-col overflow-x-auto">
        <div className="min-w-fit self-stretch px-6 py-3 border-y border-grey-20 bg-grey-10 flex items-center gap-6">
          <div className="w-1/2 min-w-[300px] flex items-center">
            <p className="text-sm text-grey-70">Site Name</p>
          </div>
          {/* ... commented code ... */}
          <div className="w-1/2 min-w-[240px] flex justify-center">
            <p className="text-sm text-grey-70">Visits</p>
          </div>
        </div>
        <div className="min-w-fit self-stretch px-6 py-2 border-b border-grey-20 bg-grey-10 flex items-center gap-6">
          <div className="w-1/2 min-w-[300px] flex items-center"></div>
          {/* ... commented code ... */}
          <div className="w-1/2 min-w-[240px] flex gap-10">
            <div className="min-w-[100px] w-1/2 flex items-center gap-2">
              <p className="text-sm text-grey-70">Pending</p>
              <div
                className={`w-5 h-5 cursor-pointer ${
                  filter.sort === "pendingVisitCount"
                    ? "text-primary-500"
                    : "text-grey-60"
                }`}
                onClick={() => handleSortClick("pendingVisitCount")}
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
            </div>
            <div className="min-w-[100px] w-1/2 flex items-center gap-2">
              <p className="text-sm text-grey-70">Completed</p>
              <div
                className={`w-5 h-5 cursor-pointer ${
                  filter.sort === "completedVisitCount"
                    ? "text-primary-500"
                    : "text-grey-60"
                }`}
                onClick={() => handleSortClick("completedVisitCount")}
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
            </div>
          </div>
        </div>
        {loading && (
          <div className="flex min-h-20 w-full items-center justify-center">
            <Loader />
          </div>
        )}
        {sitesStats?.length > 0
          ? sitesStats.map((site) => (
              <TeamAllocationItem key={site.id} site={site} />
            ))
          : !loading && (
              <p className="min-h-20 mb-10 mt-4 text-center text-base text-grey-70">
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

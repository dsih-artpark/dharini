"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getTeamProgressSampleStatApi } from "@/src/app/(dashboard)/projects/[id]/team-progress/loader";
import { TeamProgressStats } from "@/src/types/teams";
import Loader from "@/src/components/ui/loader";
import { toast } from "react-toastify";

export default function ProgressStatistics() {
  const { id } = useParams<{ id: string }>();
  const [stats, setStats] = useState<TeamProgressStats>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTeamProgressStats = async () => {
    try {
      setLoading(true);
      const { data } = await getTeamProgressSampleStatApi(id);
      setStats(data);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamProgressStats();
  }, []);

  return (
    <section className="rounded-3xl border border-grey-20 bg-white p-6 shadow-card sm:p-8">
      <h2 className="text-2xl font-semibold leading-tight text-grey-90">
        Team Activity &amp; Progress
      </h2>

      {loading ? (
        <div className="mt-6 flex min-h-[120px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Samples Completed Card */}
          <div className="flex flex-col gap-4 rounded-xl border border-grey-20 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-info-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M14.1654 1.66797V3.33464H13.332V15.0013C13.332 16.843 11.8404 18.3346 9.9987 18.3346C8.15703 18.3346 6.66536 16.843 6.66536 15.0013V3.33464H5.83203V1.66797H14.1654ZM11.6654 8.33464H8.33203V15.0013C8.33203 15.9221 9.07786 16.668 9.9987 16.668C10.9195 16.668 11.6654 15.9221 11.6654 15.0013V8.33464ZM10.832 12.5013C11.292 12.5013 11.6654 12.8746 11.6654 13.3346C11.6654 13.7946 11.292 14.168 10.832 14.168C10.372 14.168 9.9987 13.7946 9.9987 13.3346C9.9987 12.8746 10.372 12.5013 10.832 12.5013ZM9.16536 10.0013C9.62536 10.0013 9.9987 10.3746 9.9987 10.8346C9.9987 11.2946 9.62536 11.668 9.16536 11.668C8.70536 11.668 8.33203 11.2946 8.33203 10.8346C8.33203 10.3746 8.70536 10.0013 9.16536 10.0013ZM11.6654 3.33464H8.33203V6.66797H11.6654V3.33464Z"
                    fill="#11181C"
                  />
                </svg>
              </div>
              <p className="text-base font-medium text-grey-70">
                Samples Completed
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-info-600" />
                  <p className="text-xl font-semibold text-grey-90">
                    {stats?.totalCompletedSampleCount ?? 0}
                  </p>
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-grey-60">
                  Completed
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <p className="text-xl font-semibold text-grey-90">
                  {stats?.totalPendingSampleCount ?? 0}
                </p>
                <p className="text-xs font-bold uppercase tracking-wide text-grey-60">
                  Pending
                </p>
              </div>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-grey-20">
              <div
                className="h-full rounded-full bg-info-600"
                style={{
                  width: `${
                    ((stats?.totalCompletedSampleCount ?? 0) /
                      ((stats?.totalCompletedSampleCount ?? 0) +
                        (stats?.totalPendingSampleCount ?? 0))) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { formatDate } from "@/src/utils";
import { getSitesStatisticsByDiseasesApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { SiteStatisticsByDisease } from "@/src/types/global";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";

export default function SiteStatistics() {
  const { id } = useParams<{ id: string }>();
  const [statistics, setStatistics] = useState<SiteStatisticsByDisease[]>();

  const fetchSitesStatisticsByStatus = async () => {
    try {
      const { data } = await getSitesStatisticsByDiseasesApi(id);
      setStatistics(data);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    }
  };

  useEffect(() => {
    fetchSitesStatisticsByStatus();
  }, []);

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-grey-20 bg-white px-6 py-8 shadow-card sm:px-8 lg:px-12 lg:py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold leading-tight text-grey-90 sm:text-[32px]">
            All Sites
          </h1>
          <p className="text-base leading-normal text-grey-60">
            Details of all sites conducting disease surveillance.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statistics?.map((statistic, i) => {
          const border = [
            "border-l-primary-500",
            "border-l-teal-30",
            "border-l-purple-10",
            "border-l-orange-30",
          ][statistic.diseaseIndex % 4];
          const pillBg =
            DISEASE_COLOR_CODE.BG_COLOR[statistic.diseaseIndex % 6];
          return (
            <div
              key={i}
              className={`flex flex-col gap-2 rounded-xl bg-grey-10 p-5 border-l-4 shadow-sm ${border}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-base leading-normal text-grey-80">
                  {statistic.diseaseName ?? "Total Positive Sites"}
                </p>
                {statistic.diseaseSName && (
                  <div className={`rounded px-2 py-1 ${pillBg}`}>
                    <p className="text-[10px] font-bold uppercase leading-[15px] tracking-tight text-grey-80">
                      {statistic.diseaseSName}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-[32px] font-semibold leading-[48px] text-grey-90">
                {statistic.siteCount}
              </p>
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
    </section>
  );
}

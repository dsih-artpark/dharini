"use client";

import { useEffect, useState } from "react";

import { getDiseaseWisePositiveSitesStatApi } from "@/src/app/(dashboard)/monitor/loader";
import {
  DiseaseWisePositiveSitesStat,
  FilterType,
} from "@/src/types/statistics";
import Loader from "@/src/components/ui/loader";

export default function PositiveSitesStat({
  filters,
}: {
  filters: FilterType;
}) {
  const [siteStatData, setSiteStatData] = useState<
    DiseaseWisePositiveSitesStat[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (filters.diseaseId) fetchData();
  }, [filters.diseaseId, filters.startDate, filters.endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getDiseaseWisePositiveSitesStatApi({
        ...filters,
      });
      setSiteStatData(data.siteStats);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="self-stretch w-full pt-6 flex-col justify-start items-start gap-4 inline-flex">
      <div className="w-px h-px relative" />

      <div className="self-stretch justify-between items-start inline-flex flex-col sm:flex-row gap-4">
        <h2 className="text-grey-80 text-xl font-semibold font-noto-serif leading-[31.20px]">
          No. of Positive Sites
        </h2>
      </div>

      <div className="self-stretch justify-start items-start gap-4 inline-flex">
        <div className="grow shrink basis-0 px-5 py-4 bg-white rounded-lg border border-grey-20 flex-col justify-start items-start gap-6 inline-flex">
          <div className="self-stretch justify-between items-start inline-flex">
            <p className="text-grey-80 text-base leading-normal font-semibold">
              Districts with Most Positive Sites
            </p>
          </div>
          <div className="self-stretch flex-col justify-start items-start gap-4 flex">
            {loading && <Loader />}
            {siteStatData.length ? (
              siteStatData.map((statData, i) => {
                const percentage =
                  statData.totalSiteCount > 0
                    ? (statData.positiveCount / statData.totalSiteCount) * 100
                    : 0;

                return (
                  <div
                    key={i}
                    className="self-stretch flex-col justify-start items-start gap-3 flex"
                  >
                    <div className="self-stretch flex justify-between items-center">
                      <p className="text-grey-80 text-sm font-medium leading-[21px]">
                        {statData.district}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-red-600">
                          {statData.positiveCount}
                        </span>
                        <span className="text-xs text-grey-50 font-medium">
                          / {statData.totalSiteCount} Sites
                        </span>
                      </div>
                    </div>
                    <div className="self-stretch h-3 bg-grey-10 rounded-full overflow-hidden shadow-inner border border-grey-20/50">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-red-600 rounded-full transition-all duration-700 ease-out shadow-sm relative group"
                        style={{ width: `${percentage}%` }}
                      >
                        {/* Shine effect on hover */}
                        <div className="absolute top-0 left-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="self-stretch text-center text-grey-80 text-sm leading-[21px]">
                No data available
              </p>
            )}
          </div>
        </div>

        {/* <div className="grow shrink basis-0 px-5 py-4 rounded border border-grey-20 flex-col justify-start items-start gap-6 inline-flex">
          <div className="self-stretch justify-between items-start inline-flex">
            <p className="text-grey-80 text-base leading-normal">
              Trend Over Time
            </p>
            <div className="px-2 py-1 bg-teal-20 rounded justify-center items-center gap-1 flex">
              <p className="text-grey-80 text-[10px] uppercase leading-[15px] tracking-tight">
                FMD
              </p>
            </div>
          </div>
          <div className="relative self-stretch h-[248px] p-6 bg-grey-10 flex-col justify-end items-center gap-2.5 flex">
            graph
          </div>
        </div> */}
      </div>
    </div>
  );
}

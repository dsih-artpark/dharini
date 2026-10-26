"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { getProjectStatisticsApi } from "@/src/app/(dashboard)/manage/loader";
import { projectStatisticsAtom } from "@/src/store/projectStatisticsAtom";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";

export default function ProjectStatistics() {
  const [statistics, setStatistics] = useAtom(projectStatisticsAtom);

  const fetchProjectStatistics = async () => {
    const { success, data } = await getProjectStatisticsApi();
    if (success) {
      setStatistics(data);
    }
  };

  useEffect(() => {
    if (!statistics.length) {
      fetchProjectStatistics();
    }
  }, []);

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statistics?.map((statistic, i) => {
        const border = [
          "border-blue-40",
          "border-teal-30",
          "border-purple-10",
          "border-orange-30",
        ][(statistic.disease?.index ?? 0) % 4];
        const pillBg =
          DISEASE_COLOR_CODE.BG_COLOR[(statistic.disease?.index ?? 0) % 6];

        return (
          <div
            key={i}
            className={`rounded-xl border border-grey-20 border-l-4 bg-grey-10 px-5 py-4 ${border}`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 flex-1 truncate text-base font-medium leading-6 text-grey-80">
                {statistic.disease ? (statistic.disease?.name ?? "-") : "Total"}
              </p>
              {statistic.disease?.name && (
                <div
                  className={`px-2 py-1 ${
                    pillBg ?? "bg-teal-20"
                  } flex shrink-0 items-center justify-center gap-1 rounded-md`}
                >
                  <p className="text-[10px] font-medium uppercase leading-[15px] text-grey-80">
                    {statistic.disease?.shortName ??
                      statistic.disease?.name
                        ?.split(" ")
                        .map((d) => d.charAt(0))}
                  </p>
                </div>
              )}
            </div>
            <p className="mt-3 text-2xl font-semibold leading-none text-grey-90">
              {statistic.totalProjects}
            </p>
          </div>
        );
      })}
    </div>
  );
}

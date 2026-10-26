"use client";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { ChevronRight } from "lucide-react";
import { homeDataAtom, homeDataLoadingAtom } from "@/src/store/homeDataAtom";
import Loader from "@/src/components/ui/loader";

export default function DiseasesSection() {
  const homeData = useAtomValue(homeDataAtom);
  const loading = useAtomValue(homeDataLoadingAtom);

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-grey-20 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold leading-tight text-grey-90 sm:text-[32px]">
          Diseases
        </h2>
        <Link
          href="/monitor"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#3A11B6] transition hover:bg-primary-100"
        >
          <span>View Dashboard</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      )}

      {!loading &&
        homeData?.diseaseStats &&
        homeData.diseaseStats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {homeData.diseaseStats.map((sampleStat, i) => {
              const totalSampleCount =
                sampleStat.totalCollected +
                sampleStat.totalUnclear +
                sampleStat.totalPositive +
                sampleStat.totalNegative;

              return (
                <div
                  key={i}
                  className="flex flex-col gap-4 rounded-xl bg-grey-10 p-5"
                >
                  <h3 className="text-lg font-semibold text-grey-90">
                    {sampleStat.name}
                  </h3>

                  {/* Progress bar */}
                  <div className="h-2 w-full bg-grey-20 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-green-600"
                      style={{
                        width: `${
                          totalSampleCount > 0
                            ? (sampleStat.totalCollected / totalSampleCount) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${
                          totalSampleCount > 0
                            ? (sampleStat.totalUnclear / totalSampleCount) * 100
                            : 0
                        }%`,
                      }}
                    />
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${
                          totalSampleCount > 0
                            ? (sampleStat.totalPositive / totalSampleCount) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                    <div
                      className="h-full bg-grey-50"
                      style={{
                        width: `${
                          totalSampleCount > 0
                            ? (sampleStat.totalNegative / totalSampleCount) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                        <span className="text-xs font-medium text-grey-70">
                          Collected &amp; Shipped
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-grey-90">
                        {sampleStat.totalCollected}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        <span className="text-xs font-medium text-grey-70">
                          Unclear
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-grey-90">
                        {sampleStat.totalUnclear}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-xs font-medium text-grey-70">
                          Tested Positive
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-grey-90">
                        {sampleStat.totalPositive}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-grey-50" />
                        <span className="text-xs font-medium text-grey-70">
                          Tested Negative
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-grey-90">
                        {sampleStat.totalNegative}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {!loading &&
        (!homeData?.diseaseStats || homeData.diseaseStats.length === 0) && (
          <div className="text-center py-12">
            <p className="text-grey-60">No disease statistics available.</p>
          </div>
        )}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getDiseaseWisePositiveSamplesStatApi } from "@/src/app/(dashboard)/monitor/loader";
import { DiseaseWisePositiveSampleStat } from "@/src/types/statistics";
import Loader from "@/src/components/ui/loader";
import Select from "@/src/components/ui/select";

export default function DiseaseStatistics() {
  const [sampleData, setSampleData] = useState<DiseaseWisePositiveSampleStat>(
    {},
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<{
    startDate?: string;
    endDate?: string;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  useEffect(() => {
    fetchData();
  }, [filter.startDate, filter.endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getDiseaseWisePositiveSamplesStatApi({
        ...filter,
      });
      setSampleData(data?.diseaseStats);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const now = new Date();
    if (e.target.value === "") {
      setFilter((prev) => ({ ...prev, startDate: "", endDate: "" }));
    }
    if (e.target.value === "this-month") {
      // Start of the month
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      ).toISOString();
      // End of the month
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
      ).toISOString();
      setFilter((prev) => ({ ...prev, startDate, endDate }));
    }
    if (e.target.value === "last-month") {
      // Start of last month
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      ).toISOString();
      // End of last month
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
      ).toISOString();
      setFilter((prev) => ({ ...prev, startDate, endDate }));
    }
  };

  return (
    <div className="px-4 sm:px-8 lg:px-20 pt-6 pb-10 bg-blue-10 border-b border-grey-20 flex-col justify-start items-start gap-6 inline-flex overflow-hidden">
      <div className="self-stretch justify-between items-start inline-flex flex-col sm:flex-row gap-4">
        <h2 className="text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
          Disease-wise Positive Samples
        </h2>
        <div className="self-stretch justify-end sm:justify-start items-center gap-3 flex">
          <p className="text-grey-70 text-xs leading-[18px]">
            Showing data for:
          </p>
          <Select
            name="region"
            options={[
              {
                label: "This Month",
                value: "this-month",
              },
              {
                label: "Last Month",
                value: "last-month",
              },
            ]}
            onChange={handleDateSelect}
            placeholder="All Time"
          >
            <div className="w-5 h-5 relative">
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

      {loading ? (
        <div className="self-stretch justify-center items-center inline-flex">
          <Loader />
        </div>
      ) : (
        <div className="self-stretch justify-start gap-4 inline-flex">
          {sampleData &&
            Object.entries(sampleData)?.map(([name, data], i) => (
              <div
                key={i}
                className="grow shrink basis-0 px-4 py-3 bg-white rounded shadow-[0px_2px_6px_0px_rgba(16,24,40,0.06)] flex-col justify-start items-start gap-2 inline-flex"
              >
                <h2 className="flex-1 self-stretch text-grey-80 text-base leading-normal">
                  {name}
                </h2>
                <div className="rounded flex-col justify-center items-start gap-1 flex">
                  <p className="text-red-30 text-[32px] leading-[48px]">
                    {data.testedSamples}
                  </p>
                  <p className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
                    of {data.totalSamples} tested
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import { toast } from "react-toastify";

import {
  getSiteWiseSamplesStatisticsApi,
  downloadCsvSiteWiseSamplesStatisticsApi,
} from "@/src/app/(dashboard)/monitor/loader";
import { Region, SiteWiseSampleStat } from "@/src/types/global";
import { fetchProjectRegions } from "@/src/app/(dashboard)/project-onboarding/loader";
import { regionsAtom } from "@/src/store/regionsAtom";
import Loader from "@/src/components/ui/loader";
import Select from "@/src/components/ui/select";
import Spinner from "@/src/components/ui/spinner";

// import Pagination from "@/src/components/ui/pagination";

export default function SiteWiseSamples({ diseaseId }: { diseaseId: string }) {
  const [regions, setRegions] = useAtom(regionsAtom);
  const [sites, setSites] = useState<SiteWiseSampleStat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<{
    region: string;
    startDate: string;
    endDate: string;
    sort?: keyof SiteWiseSampleStat | "";
    sortOrder: "ascending" | "descending";
  }>({
    region: "",
    startDate: "",
    endDate: "",
    sort: "",
    sortOrder: "ascending",
  });
  const [downloading, setDownloading] = useState<boolean>(false);

  const fetchSiteWiseSamplesStat = async () => {
    try {
      setLoading(true);
      const { data } = await getSiteWiseSamplesStatisticsApi({
        disease: diseaseId,
        ...filter,
      });
      setSites(data);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!regions.length) {
      fetchProjectRegions()
        .then((response) => {
          if (response.success) {
            setRegions(response?.data ?? []);
          }
        })
        .catch((e) => console.error("Error fetching regions", e));
    }
  }, []);

  useEffect(() => {
    if (diseaseId) fetchSiteWiseSamplesStat();
  }, [diseaseId, filter.region, filter.startDate, filter.endDate]);

  useEffect(() => {
    if (filter.sort) {
      const sortedSites = JSON.parse(JSON.stringify(sites));
      sortedSites.sort((a: SiteWiseSampleStat, b: SiteWiseSampleStat) => {
        if (filter.sortOrder === "ascending") {
          return (
            (a[filter.sort as keyof SiteWiseSampleStat] as number) -
            (b[filter.sort as keyof SiteWiseSampleStat] as number)
          );
        }
        return (
          (b[filter.sort as keyof SiteWiseSampleStat] as number) -
          (a[filter.sort as keyof SiteWiseSampleStat] as number)
        );
      });
      setSites(sortedSites);
    }
  }, [filter.sort, filter.sortOrder]);

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

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDownloadClick = async () => {
    try {
      setDownloading(true);
      const blob = await downloadCsvSiteWiseSamplesStatisticsApi({
        disease: diseaseId,
        ...filter,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `site-wise-samples-breakdown.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      toast.error((error as Error)?.message ?? "Error downloading CSV");
    } finally {
      setDownloading(false);
    }
  };

  const handleSortClick = (name: keyof SiteWiseSampleStat) => {
    setFilter((prev) => ({
      ...prev,
      sort: name,
      sortOrder:
        prev.sort == name
          ? prev.sortOrder === "ascending"
            ? "descending"
            : "ascending"
          : "ascending",
    }));
  };

  return (
    <div className="px-4 sm:px-8 lg:px-20 py-8 bg-white border-t border-grey-20 flex-col justify-start items-start gap-8 inline-flex pb-20">
      <div className="self-stretch justify-between items-center inline-flex">
        <div className="flex-col justify-start items-start gap-2 inline-flex">
          <h1 className="text-grey-80 text-2xl font-semibold font-noto-serif leading-[31.20px]">
            Site-wise Sample Breakdown
          </h1>
          <p className="text-grey-70 text-base leading-normal">
            Monitor the number of samples tested positive, negative, and unclear
            for different diseases
          </p>
        </div>
        <button
          className="px-3 py-2 rounded-lg border border-blue-40 justify-center items-center gap-2 flex text-blue-40 text-sm leading-[21px] disabled:cursor-not-allowed disabled:bg-grey-40 disabled:text-grey-0 disabled:border-0"
          onClick={handleDownloadClick}
          disabled={downloading}
        >
          {downloading ? (
            <Spinner />
          ) : (
            <div className="w-4 h-4 relative">
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
            </div>
          )}
          Download Data
        </button>
      </div>

      <div className="self-stretch rounded border border-b-0 border-grey-40 flex-col justify-start items-start flex">
        <div className="self-stretch flex-col justify-start items-start flex">
          <div className="self-stretch px-4 py-3 bg-blue-10 border-b border-grey-20 justify-between items-start inline-flex">
            <Select
              name="region"
              options={regions.map((region: Region) => ({
                label: region.name,
                value: region.id,
              }))}
              onChange={handleSelect}
              defaultValue={filter.region}
              placeholder="All locations"
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
                    d="M10 17.416L14.125 13.291C14.9408 12.4751 15.4963 11.4357 15.7213 10.3042C15.9463 9.17264 15.8308 7.99978 15.3892 6.93391C14.9477 5.86805 14.2 4.95704 13.2408 4.31609C12.2815 3.67514 11.1537 3.33304 10 3.33304C8.8463 3.33304 7.71851 3.67514 6.75924 4.31609C5.79997 4.95704 5.05229 5.86805 4.61076 6.93391C4.16923 7.99978 4.05368 9.17264 4.27871 10.3042C4.50374 11.4357 5.05926 12.4751 5.875 13.291L10 17.416ZM10 19.7726L4.69667 14.4693C3.64779 13.4204 2.93349 12.084 2.64411 10.6292C2.35473 9.1743 2.50326 7.66631 3.07092 6.29587C3.63858 4.92543 4.59987 3.75409 5.83324 2.92999C7.0666 2.10588 8.51665 1.66602 10 1.66602C11.4834 1.66602 12.9334 2.10588 14.1668 2.92999C15.4001 3.75409 16.3614 4.92543 16.9291 6.29587C17.4968 7.66631 17.6453 9.1743 17.3559 10.6292C17.0665 12.084 16.3522 13.4204 15.3033 14.4693L10 19.7726ZM10 10.8326C10.442 10.8326 10.866 10.657 11.1785 10.3445C11.4911 10.0319 11.6667 9.60798 11.6667 9.16595C11.6667 8.72392 11.4911 8.3 11.1785 7.98744C10.866 7.67488 10.442 7.49928 10 7.49928C9.55798 7.49928 9.13405 7.67488 8.82149 7.98744C8.50893 8.3 8.33334 8.72392 8.33334 9.16595C8.33334 9.60798 8.50893 10.0319 8.82149 10.3445C9.13405 10.657 9.55798 10.8326 10 10.8326ZM10 12.4993C9.11595 12.4993 8.2681 12.1481 7.64298 11.523C7.01786 10.8979 6.66667 10.05 6.66667 9.16595C6.66667 8.2819 7.01786 7.43405 7.64298 6.80893C8.2681 6.18381 9.11595 5.83262 10 5.83262C10.8841 5.83262 11.7319 6.18381 12.357 6.80893C12.9821 7.43405 13.3333 8.2819 13.3333 9.16595C13.3333 10.05 12.9821 10.8979 12.357 11.523C11.7319 12.1481 10.8841 12.4993 10 12.4993Z"
                    fill="#889096"
                  />
                </svg>
              </div>
            </Select>
            <div className="justify-start items-center gap-3 flex">
              <p className="hidden sm:block text-grey-70 text-xs leading-[18px]">
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
            {/* <div className="justify-start items-center gap-4 flex">
              <div className="h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
                <select className="custom-select text-grey-80 text-sm leading-[21px] outline-none">
                  <option>More Filters</option>
                  <option>More Filters</option>
                </select>
              </div>
            </div> */}
          </div>
        </div>

        <div className="flex-col flex overflow-x-auto w-full">
          <div className="min-w-fit self-stretch px-4 py-2 bg-grey-10 border-b border-grey-20 items-center gap-10 flex">
            <div className="min-w-[300px] grow shrink basis-0 h-[21px] justify-start items-center gap-2.5 flex">
              <div className="text-grey-70 text-sm leading-[21px]">Site ID</div>
            </div>
            <div className="w-[266px] h-[21px] justify-start items-center gap-2.5 flex">
              <div className="text-grey-70 text-sm leading-[21px]">Region</div>
            </div>
            <div className="w-20 h-[21px] justify-end items-center gap-2 flex">
              <div className="grow shrink basis-0 text-right text-grey-70 text-sm leading-[21px]">
                Positive
              </div>
              <div
                className="w-5 h-5 relative  overflow-hidden cursor-pointer"
                onClick={() => handleSortClick("positiveSampleCount")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <path
                    d="M10.459 7.125L9.28065 8.30333L7.16732 6.19V17.1667H5.50065V6.19L3.38815 8.30333L2.20898 7.125L6.33398 3L10.459 7.125ZM18.7923 13.875L14.6673 18L10.5423 13.875L11.7207 12.6967L13.8348 14.81L13.834 3.83333H15.5007V14.81L17.614 12.6967L18.7923 13.875Z"
                    fill={
                      filter.sort === "positiveSampleCount"
                        ? "#284DB6"
                        : "#889096"
                    }
                  />
                </svg>
              </div>
            </div>
            <div className="w-20 h-[21px] justify-end items-center gap-2 flex">
              <div className="grow shrink basis-0 text-right text-grey-70 text-sm leading-[21px]">
                Negative
              </div>
              <div
                className="w-5 h-5 relative  overflow-hidden cursor-pointer"
                onClick={() => handleSortClick("negativeSampleCount")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <path
                    d="M10.459 7.125L9.28065 8.30333L7.16732 6.19V17.1667H5.50065V6.19L3.38815 8.30333L2.20898 7.125L6.33398 3L10.459 7.125ZM18.7923 13.875L14.6673 18L10.5423 13.875L11.7207 12.6967L13.8348 14.81L13.834 3.83333H15.5007V14.81L17.614 12.6967L18.7923 13.875Z"
                    fill={
                      filter.sort === "negativeSampleCount"
                        ? "#284DB6"
                        : "#889096"
                    }
                  />
                </svg>
              </div>
            </div>
            <div className="w-20 h-[21px] justify-end items-center gap-2 flex">
              <div className="grow shrink basis-0 text-right text-grey-70 text-sm leading-[21px]">
                Unclear
              </div>
              <div
                className="w-5 h-5 relative  overflow-hidden cursor-pointer"
                onClick={() => handleSortClick("unclearSampleCount")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <path
                    d="M10.459 7.125L9.28065 8.30333L7.16732 6.19V17.1667H5.50065V6.19L3.38815 8.30333L2.20898 7.125L6.33398 3L10.459 7.125ZM18.7923 13.875L14.6673 18L10.5423 13.875L11.7207 12.6967L13.8348 14.81L13.834 3.83333H15.5007V14.81L17.614 12.6967L18.7923 13.875Z"
                    fill={
                      filter.sort === "unclearSampleCount"
                        ? "#284DB6"
                        : "#889096"
                    }
                  />
                </svg>
              </div>
            </div>
            <div className="w-20 h-[21px] justify-end items-center gap-2 flex">
              <div className="grow shrink basis-0 text-right text-grey-70 text-sm leading-[21px]">
                Total
              </div>
              <div
                className="w-5 h-5 relative  overflow-hidden cursor-pointer"
                onClick={() => handleSortClick("totalSampleCount")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <path
                    d="M10.459 7.125L9.28065 8.30333L7.16732 6.19V17.1667H5.50065V6.19L3.38815 8.30333L2.20898 7.125L6.33398 3L10.459 7.125ZM18.7923 13.875L14.6673 18L10.5423 13.875L11.7207 12.6967L13.8348 14.81L13.834 3.83333H15.5007V14.81L17.614 12.6967L18.7923 13.875Z"
                    fill={
                      filter.sort === "totalSampleCount" ? "#284DB6" : "#889096"
                    }
                  />
                </svg>
              </div>
            </div>
          </div>

          {loading && (
            <div className="w-full min-h-10 flex justify-center items-center">
              <Loader />
            </div>
          )}
          {sites?.length
            ? sites.map((site) => (
                <div
                  key={site.id}
                  className="min-w-fit self-stretch px-4 py-2 bg-white border-b border-grey-20 items-center gap-10 flex"
                >
                  <div className="min-w-[300px] grow shrink basis-0 h-20 justify-start items-center gap-6 flex">
                    {site.photos?.length ? (
                      <Image
                        className="h-20 w-20 rounded"
                        src={site.photos[0]}
                        width={80}
                        height={80}
                        alt={"site photo"}
                      />
                    ) : (
                      <div className="p-7 bg-blue-10 rounded justify-center items-center flex overflow-hidden">
                        <div className="w-6 h-6 relative overflow-hidden">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="24"
                            viewBox="0 0 25 24"
                            fill="none"
                          >
                            <path
                              d="M20.5 5H4.5V19L13.792 9.706C13.9795 9.51853 14.2338 9.41321 14.499 9.41321C14.7642 9.41321 15.0185 9.51853 15.206 9.706L20.5 15.01V5ZM2.5 3.993C2.50183 3.73038 2.6069 3.47902 2.79251 3.29322C2.97813 3.10742 3.22938 3.00209 3.492 3H21.508C22.056 3 22.5 3.445 22.5 3.993V20.007C22.4982 20.2696 22.3931 20.521 22.2075 20.7068C22.0219 20.8926 21.7706 20.9979 21.508 21H3.492C3.22881 20.9997 2.9765 20.895 2.79049 20.7088C2.60448 20.5226 2.5 20.2702 2.5 20.007V3.993ZM8.5 11C7.96957 11 7.46086 10.7893 7.08579 10.4142C6.71071 10.0391 6.5 9.53043 6.5 9C6.5 8.46957 6.71071 7.96086 7.08579 7.58579C7.46086 7.21071 7.96957 7 8.5 7C9.03043 7 9.53914 7.21071 9.91421 7.58579C10.2893 7.96086 10.5 8.46957 10.5 9C10.5 9.53043 10.2893 10.0391 9.91421 10.4142C9.53914 10.7893 9.03043 11 8.5 11Z"
                              fill="#D7DBDF"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="w-[200px] flex-col justify-start items-start gap-2 inline-flex">
                      {/* <div className="self-stretch justify-start items-center gap-1 inline-flex">
                        <div className="w-4 h-4 relative">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                          >
                            <path
                              d="M7.8326 12.4593C6.48775 12.2882 5.25851 11.6114 4.39473 10.5665C3.53095 9.52161 3.09746 8.18701 3.18235 6.83397C3.26724 5.48093 3.86416 4.21098 4.85177 3.28224C5.83938 2.3535 7.14357 1.83567 8.49927 1.83399C9.85663 1.83298 11.1633 2.34954 12.153 3.27844C13.1428 4.20733 13.7411 5.47865 13.8261 6.83334C13.9111 8.18804 13.4764 9.52418 12.6105 10.5695C11.7446 11.6148 10.5128 12.2907 9.16594 12.4593V14.5007H7.8326V12.4593ZM8.49927 11.1673C9.56014 11.1673 10.5776 10.7459 11.3277 9.99575C12.0778 9.2456 12.4993 8.22819 12.4993 7.16732C12.4993 6.10645 12.0778 5.08904 11.3277 4.33889C10.5776 3.58875 9.56014 3.16732 8.49927 3.16732C7.4384 3.16732 6.42099 3.58875 5.67084 4.33889C4.9207 5.08904 4.49927 6.10645 4.49927 7.16732C4.49927 8.22819 4.9207 9.2456 5.67084 9.99575C6.42099 10.7459 7.4384 11.1673 8.49927 11.1673ZM3.8326 15.1673H13.1659V16.5007H3.8326V15.1673Z"
                              fill="#889096"
                            />
                          </svg>
                        </div>
                        <p className="text-grey-70 text-xs leading-[18px]">
                          Site Code: {site.code ?? "-"}
                        </p>
                      </div> */}
                      <p className="self-stretch text-grey-80 text-xl leading-[25px]">
                        {site.name}
                      </p>
                    </div>
                  </div>
                  <div className="justify-start items-start gap-1 flex">
                    <div className="w-5 h-5 relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                      >
                        <path
                          d="M10.5 17.416L14.625 13.291C15.4408 12.4751 15.9963 11.4357 16.2213 10.3042C16.4463 9.17264 16.3308 7.99978 15.8892 6.93391C15.4477 5.86805 14.7 4.95704 13.7408 4.31609C12.7815 3.67514 11.6537 3.33304 10.5 3.33304C9.3463 3.33304 8.21851 3.67514 7.25924 4.31609C6.29997 4.95704 5.55229 5.86805 5.11076 6.93391C4.66923 7.99978 4.55368 9.17264 4.77871 10.3042C5.00374 11.4357 5.55926 12.4751 6.375 13.291L10.5 17.416ZM10.5 19.7726L5.19667 14.4693C4.14779 13.4204 3.43349 12.084 3.14411 10.6292C2.85473 9.1743 3.00326 7.66631 3.57092 6.29587C4.13858 4.92543 5.09987 3.75409 6.33324 2.92999C7.5666 2.10588 9.01665 1.66602 10.5 1.66602C11.9834 1.66602 13.4334 2.10588 14.6668 2.92999C15.9001 3.75409 16.8614 4.92543 17.4291 6.29587C17.9968 7.66631 18.1453 9.1743 17.8559 10.6292C17.5665 12.084 16.8522 13.4204 15.8033 14.4693L10.5 19.7726ZM10.5 10.8326C10.942 10.8326 11.366 10.657 11.6785 10.3445C11.9911 10.0319 12.1667 9.60798 12.1667 9.16595C12.1667 8.72392 11.9911 8.3 11.6785 7.98744C11.366 7.67488 10.942 7.49928 10.5 7.49928C10.058 7.49928 9.63405 7.67488 9.32149 7.98744C9.00893 8.3 8.83334 8.72392 8.83334 9.16595C8.83334 9.60798 9.00893 10.0319 9.32149 10.3445C9.63405 10.657 10.058 10.8326 10.5 10.8326ZM10.5 12.4993C9.61595 12.4993 8.7681 12.1481 8.14298 11.523C7.51786 10.8979 7.16667 10.05 7.16667 9.16595C7.16667 8.2819 7.51786 7.43405 8.14298 6.80893C8.7681 6.18381 9.61595 5.83262 10.5 5.83262C11.3841 5.83262 12.2319 6.18381 12.857 6.80893C13.4821 7.43405 13.8333 8.2819 13.8333 9.16595C13.8333 10.05 13.4821 10.8979 12.857 11.523C12.2319 12.1481 11.3841 12.4993 10.5 12.4993Z"
                          fill="#889096"
                        />
                      </svg>
                    </div>
                    <p className="w-[240px] text-grey-70 text-base leading-normal whitespace-nowrap truncate">
                      {site.district}, {site.state}
                    </p>
                  </div>
                  <div className="w-20 h-[25px] justify-end items-center gap-1 flex">
                    <div className="justify-start items-center gap-2.5 flex">
                      {site.positiveSampleCount > site.negativeSampleCount && (
                        <div className="w-4 h-4 relative  overflow-hidden">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="16"
                            viewBox="0 0 17 16"
                            fill="none"
                          >
                            <path
                              d="M9.16645 5.21802V13.3327H7.83312V5.21802L4.25712 8.79402L3.31445 7.85135L8.49979 2.66602L13.6851 7.85135L12.7425 8.79402L9.16645 5.21802Z"
                              fill="#A1221B"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p
                      className={`text-right text-xl leading-[25px] ${
                        site.positiveSampleCount > site.negativeSampleCount
                          ? "text-red-30"
                          : "text-grey-70"
                      }`}
                    >
                      {site.positiveSampleCount ?? 0}
                    </p>
                  </div>
                  <div className="w-20 h-[25px] justify-end items-center gap-2 flex">
                    <p className="text-right text-grey-70 text-xl leading-[25px]">
                      {site.negativeSampleCount ?? 0}
                    </p>
                  </div>
                  <div className="w-20 h-[25px] justify-end items-center gap-2 flex">
                    <p className="text-right text-grey-70 text-xl leading-[25px]">
                      {site.unclearSampleCount ?? 0}
                    </p>
                  </div>
                  <div className="w-20 h-[25px] justify-end items-center gap-2 flex">
                    <p className="text-center text-grey-80 text-xl leading-[25px]">
                      {site.totalSampleCount ?? 0}
                    </p>
                  </div>
                </div>
              ))
            : !loading && (
                <p className="self-stretch mt-4 text-center text-grey-70 text-base mb-10">
                  No data found
                </p>
              )}
        </div>
        {/* TODO */}
        {/* <Pagination /> */}
      </div>
    </div>
  );
}

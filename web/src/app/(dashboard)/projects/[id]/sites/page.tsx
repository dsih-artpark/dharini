"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";

import Breadcrumb from "@/src/components/ui/breadcrumb";
import SiteStatistics from "@/src/components/projects/sites/site-list/site-statistics";
import SiteListItem from "@/src/components/projects/sites/site-list/site-list-item";
import { getProjectSitesApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { Site } from "@/src/types/site";
import { getProjectDetailApi } from "@/src/app/(dashboard)/projects/[id]/loader";
import { projectAtom } from "@/src/store/projectAtom";
import { siteAtom } from "@/src/store/siteAtom";
import Loader from "@/src/components/ui/loader";
import Select from "@/src/components/ui/select";
import { SITE_TYPES } from "@/src/utils/constant";
import { debounce } from "@/src/utils";
import { toast } from "react-toastify";
import UpdateCollectionPlanModal from "@/src/components/projects/sites/update-collection-plan";
import { useHasPermission } from "@/src/hooks/check-permission";

export default function SiteList() {
  const { id } = useParams<{ id: string }>();
  const hasPermission = useHasPermission();
  const [project, setProject] = useAtom(projectAtom);
  const [, setSite] = useAtom(siteAtom);

  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenCollectionPlan, setIsOpenCollectionPlan] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>(
    undefined,
  );
  const [filter, setFilter] = useState<{
    disease: string;
    siteType: string;
    startDate: string;
    endDate: string;
    testResult: string;
  }>({
    disease: "",
    siteType: "",
    startDate: "",
    endDate: "",
    testResult: "",
  });
  const [search, setSearch] = useState<string>("");

  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      const { data } = await getProjectDetailApi(id);
      setProject(data);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!project) fetchProjectDetail();
  }, []);

  const fetchProjectSites = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getProjectSitesApi(id, {
        ...filter,
        search,
      });
      setSites(data);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [filter, id, search]);

  useEffect(() => {
    if (project?.diseases?.length) {
      setFilter((prev) => ({ ...prev, disease: project?.diseases[0].id }));
    }
  }, [project?.diseases]);

  useEffect(() => {
    if (filter.disease) fetchProjectSites();
  }, [
    filter.disease,
    filter.siteType,
    filter.startDate,
    filter.endDate,
    filter.testResult,
    search,
    fetchProjectSites,
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const debouncedHandleSearch = debounce(handleSearch, 500);

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
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      <Breadcrumb
        path={[
          { name: project?.name ?? "Project", href: `/projects/${id}` },
          { name: "Sites", href: "/sites" },
        ]}
      />
      <SiteStatistics />

      <section className="flex flex-col gap-4 rounded-2xl border border-grey-20 bg-white shadow-card overflow-hidden">
        {/* Tabs + Search */}
        <div className="flex flex-col gap-4 px-5 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1">
            {project?.diseases.map((disease) => (
              <button
                key={disease.id}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filter.disease === disease.id
                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                    : "border border-grey-10 text-grey-70 hover:bg-grey-10"
                }`}
                onClick={() =>
                  setFilter((prev) => ({ ...prev, disease: disease.id }))
                }
              >
                {disease.shortName}
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="flex items-center gap-3 rounded-lg border border-grey-20 bg-grey-10 px-3 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                className="shrink-0 text-grey-60"
              >
                <path
                  d="M15.5271 13.8469L19.0963 17.4152L17.9171 18.5943L14.3488 15.0252C13.0211 16.0895 11.3696 16.6684 9.66797 16.666C5.52797 16.666 2.16797 13.306 2.16797 9.16602C2.16797 5.02602 5.52797 1.66602 9.66797 1.66602C13.808 1.66602 17.168 5.02602 17.168 9.16602C17.1704 10.8677 16.5915 12.5191 15.5271 13.8469ZM13.8555 13.2285C14.9131 12.1409 15.5037 10.683 15.5013 9.16602C15.5013 5.94268 12.8905 3.33268 9.66797 3.33268C6.44464 3.33268 3.83464 5.94268 3.83464 9.16602C3.83464 12.3885 6.44464 14.9993 9.66797 14.9993C11.185 15.0017 12.6429 14.4111 13.7305 13.3535L13.8555 13.2285Z"
                  fill="currentColor"
                />
              </svg>
              <input
                className="w-full bg-transparent text-sm text-grey-80 outline-none placeholder:text-grey-60"
                placeholder="Search for Sites by name"
                onChange={debouncedHandleSearch}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 border-y border-grey-20 bg-grey-10 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              name="testResult"
              options={["Pending", "Positive", "Negative"].map(
                (testResult) => ({
                  label: testResult,
                  value: testResult?.toLowerCase(),
                }),
              )}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, testResult: e.target.value }))
              }
              placeholder="All Status"
            >
              <div className="flex h-5 w-5 items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M11.4314 1.62305L14.543 2.81805L13.9455 4.37388L13.1672 4.07471L12.5455 5.69555C13.1947 6.08055 13.7489 6.60721 14.1664 7.23388L15.7522 6.52805L15.413 5.76638L16.9355 5.08888L18.2914 8.13388L16.7689 8.81138L16.4297 8.05055L14.8447 8.75638C14.9464 9.15388 15.0005 9.57138 15.0005 10.0005C15.0005 10.3389 14.9672 10.6697 14.903 10.9897L16.523 11.6114L16.8214 10.8339L18.378 11.4314L17.183 14.543L15.6272 13.9455L15.9255 13.168L14.3055 12.5455C13.9205 13.1947 13.3939 13.7489 12.7672 14.1664L13.473 15.7522L14.2347 15.413L14.9122 16.9355L11.8672 18.2914L11.1897 16.7689L11.9505 16.4297L11.2447 14.8447C10.8472 14.9464 10.4297 15.0005 10.0005 15.0005C9.66138 15.0005 9.33055 14.9672 9.01055 14.9022L8.38888 16.523L9.16721 16.8214L8.56971 18.378L5.45805 17.183L6.05555 15.6272L6.83221 15.9255L7.45555 14.3055C6.80638 13.9205 6.25221 13.3939 5.83388 12.7672L4.24805 13.473L4.58721 14.2347L3.06471 14.9122L1.70888 11.8672L3.23138 11.1897L3.56971 11.9514L5.15555 11.2447C5.05471 10.8472 5.00055 10.4297 5.00055 10.0005C5.00055 9.66221 5.03388 9.33138 5.09805 9.01138L3.47721 8.38971L3.17971 9.16721L1.62305 8.56971L2.81805 5.45888L4.37388 6.05638L4.07471 6.83388L5.69555 7.45638C6.08055 6.80638 6.60721 6.25221 7.23388 5.83388L6.52805 4.24805L5.76638 4.58721L5.08888 3.06471L8.13388 1.70971L8.81138 3.23221L8.05055 3.57138L8.75638 5.15638C9.15388 5.05471 9.57138 5.00055 10.0005 5.00055C10.3389 5.00055 10.6697 5.03388 10.9897 5.09805L11.6105 3.47721L10.8339 3.17971L11.4314 1.62305ZM10.0005 6.66721C8.15888 6.66721 6.66721 8.15888 6.66721 10.0005C6.66721 11.8422 8.15888 13.3339 10.0005 13.3339C11.8422 13.3339 13.3339 11.8422 13.3339 10.0005C13.3339 8.15888 11.8422 6.66721 10.0005 6.66721ZM9.58388 10.7222C9.98221 10.9522 10.1189 11.4622 9.88888 11.8605C9.65888 12.2589 9.14888 12.3955 8.75055 12.1655C8.35221 11.9355 8.21555 11.4255 8.44555 11.0272C8.67555 10.6289 9.18555 10.4922 9.58388 10.7222ZM11.6672 9.16721C12.1272 9.16721 12.5005 9.54055 12.5005 10.0005C12.5005 10.4605 12.1272 10.8339 11.6672 10.8339C11.2072 10.8339 10.8339 10.4605 10.8339 10.0005C10.8339 9.54055 11.2072 9.16721 11.6672 9.16721ZM9.88888 8.14055C10.1189 8.53888 9.98221 9.04888 9.58388 9.27888C9.18555 9.50888 8.67555 9.37221 8.44555 8.97388C8.21555 8.57555 8.35221 8.06555 8.75055 7.83555C9.14888 7.60555 9.65888 7.74221 9.88888 8.14055Z"
                    fill="#889096"
                  />
                </svg>
              </div>
            </Select>
            <Select
              name="siteType"
              options={SITE_TYPES.map((siteType) => ({
                label: siteType,
                value: siteType,
              }))}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, siteType: e.target.value }))
              }
              placeholder="All Site Types"
            >
              <div className="flex h-5 w-5 items-center justify-center">
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
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-grey-60">Showing data for:</p>
            <Select
              name="region"
              options={[
                { label: "This Month", value: "this-month" },
                { label: "Last Month", value: "last-month" },
              ]}
              onChange={handleDateSelect}
              placeholder="All Time"
            >
              <div className="flex h-5 w-5 items-center justify-center">
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

        {/* Table */}
        <div className="flex flex-col overflow-x-auto">
          <div className="inline-flex min-w-fit items-center gap-10 border-b border-grey-20 bg-grey-10 px-5 py-3">
            <div className="flex min-w-[250px] items-center">
              <p className="text-sm text-grey-70">Site ID</p>
            </div>
            <div className="flex w-[120px] items-center">
              <p className="text-sm text-grey-70">Farm Type</p>
            </div>
            <div className="flex w-[120px] items-center">
              <p className="text-sm text-grey-70">Sub Type</p>
            </div>
            <div className="flex w-[120px] items-center">
              <p className="text-sm text-grey-70">Site Type</p>
            </div>
            <div className="flex w-[200px] items-center">
              <p className="text-sm text-grey-70">Collector</p>
            </div>
            <div className="flex w-[120px] items-center justify-end">
              <p className="text-right text-sm text-grey-70">Status</p>
            </div>
            <div className="flex w-[160px] items-center">
              <p className="text-sm text-grey-70">Actions</p>
            </div>
          </div>

          {loading && (
            <div className="flex min-h-10 w-full items-center justify-center">
              <Loader />
            </div>
          )}
          {sites?.length
            ? sites.map((site) => (
                <SiteListItem
                  key={site.id}
                  site={{
                    ...site,
                    diseases: site.diseases?.length
                      ? site.diseases
                      : project?.diseases,
                  }}
                  canUpdateCollectionPlan={hasPermission(
                    "update",
                    "collection-plan",
                    id,
                  )}
                  onUpdateCollectionPlan={(s) => {
                    setSite(s);
                    setSelectedSiteId(s.id);
                    setIsOpenCollectionPlan(true);
                  }}
                />
              ))
            : !loading && (
                <p className="mb-10 mt-4 text-center text-base text-grey-70">
                  No data found
                </p>
              )}
        </div>
      </section>

      <UpdateCollectionPlanModal
        isOpen={isOpenCollectionPlan}
        onClose={() => {
          setIsOpenCollectionPlan(false);
          setSelectedSiteId(undefined);
        }}
        siteId={selectedSiteId}
      />
    </div>
  );
}

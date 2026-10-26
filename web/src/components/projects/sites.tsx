"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAtomValue, useAtom } from "jotai";

import { projectAtom } from "@/src/store/projectAtom";
import { siteAtom } from "@/src/store/siteAtom";
import { SiteStatisticsByStatus } from "@/src/types/global";
import { getSitesStatisticsByStatusApi } from "@/src/app/(dashboard)/projects/[id]/loader";
import { getProjectSitesApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { Site } from "@/src/types/site";
import Select from "@/src/components/ui/select";
import Spinner from "@/src/components/ui/spinner";
import UpdateCollectionPlanModal from "@/src/components/projects/sites/update-collection-plan";
import { useHasPermission } from "@/src/hooks/check-permission";
import { toast } from "react-toastify";
import { formatDate } from "@/src/utils";

export default function Sites() {
  const { id } = useParams<{ id: string }>();
  const hasPermission = useHasPermission();

  const [selectedDisease, setSelectedDisease] = useState("");
  const [statistics, setStatistics] = useState<SiteStatisticsByStatus>();
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [sitesLoading, setSitesLoading] = useState(false);
  const [isOpenCollectionPlan, setIsOpenCollectionPlan] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>(
    undefined,
  );
  const [, setSite] = useAtom(siteAtom);
  const project = useAtomValue(projectAtom);
  const [filter, setFilter] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });

  const fetchSitesStatisticsByStatus = async () => {
    try {
      setLoading(true);
      const { data } = await getSitesStatisticsByStatusApi(id, {
        disease: selectedDisease,
        ...filter,
      });
      setStatistics(data);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project?.diseases?.length) {
      setSelectedDisease(project?.diseases[0]?.id);
    }
  }, [project?.diseases]);

  const fetchSitesList = async () => {
    try {
      setSitesLoading(true);
      const { data } = await getProjectSitesApi(id, {
        disease: selectedDisease,
        siteType: "",
        startDate: filter.startDate,
        endDate: filter.endDate,
        search: "",
        testResult: "",
      });
      setSites(data ?? []);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching sites");
    } finally {
      setSitesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDisease) {
      fetchSitesStatisticsByStatus();
      fetchSitesList();
    }
  }, [selectedDisease, filter.startDate, filter.endDate]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const months = Number(e.target.value);

    if (months === 0) {
      setFilter((prev) => ({ ...prev, startDate: "", endDate: "" }));
    } else {
      const now = new Date();
      // end date is now
      const endDate = now.toISOString();
      // start date is {n} months before
      now.setMonth(now.getMonth() - months);
      const startDate = now.toISOString();
      setFilter((prev) => ({ ...prev, startDate, endDate }));
    }
  };

  const farmTypeLabel = (farmType: string | undefined) => {
    if (!farmType) return "—";
    return farmType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const statusBadgeClass = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "inline-flex items-center rounded-full bg-green-10 px-3 py-1 text-xs font-medium text-green-30 capitalize";
      case "pending":
        return "inline-flex items-center rounded-full bg-yellow-10 px-3 py-1 text-xs font-medium text-yellow-30 capitalize";
      case "overdue":
        return "inline-flex items-center rounded-full bg-red-10 px-3 py-1 text-xs font-medium text-red-30 capitalize";
      default:
        return "inline-flex items-center rounded-full bg-grey-10 px-3 py-1 text-xs font-medium text-grey-70 capitalize";
    }
  };

  const testResultBadgeClass = (result: string | undefined) => {
    switch (result?.toLowerCase()) {
      case "positive":
        return "inline-flex items-center rounded-full bg-green-10 px-3 py-1 text-xs font-medium text-green-30 capitalize";
      case "negative":
        return "inline-flex items-center rounded-full bg-red-10 px-3 py-1 text-xs font-medium text-red-30 capitalize";
      case "pending":
        return "inline-flex items-center rounded-full bg-yellow-10 px-3 py-1 text-xs font-medium text-yellow-30 capitalize";
      default:
        return "inline-flex items-center rounded-full bg-grey-10 px-3 py-1 text-xs font-medium text-grey-70 capitalize";
    }
  };

  const collectorName = (collector: Site["collectionCollector"]) => {
    if (!collector) return "—";
    if (typeof collector === "string") return collector;
    if (collector.firstName || collector.lastName) {
      return `${collector.firstName ?? ""} ${collector.lastName ?? ""}`.trim();
    }
    return collector.email ?? "—";
  };

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-grey-20 bg-white px-6 py-6 shadow-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold leading-tight text-grey-90">
          Sites
        </h2>
        {hasPermission("read", "site", id) && (
          <Link
            href={`/projects/${id}/sites`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-500"
          >
            View All Sites
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
        )}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {project?.diseases?.map((disease) => (
            <button
              key={disease.id}
              onClick={() => setSelectedDisease(disease.id)}
              className={`inline-flex cursor-pointer items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedDisease === disease.id
                  ? "bg-primary-50 text-primary-700 border border-primary-200"
                  : "border border-grey-20 text-grey-70 hover:bg-grey-10"
              }`}
            >
              {disease.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Select
            name="months"
            options={[
              { label: "Past 3 Months", value: "3" },
              { label: "Past 6 Months", value: "6" },
              { label: "Past 9 Months", value: "9" },
              { label: "Past 12 Months", value: "12" },
            ]}
            onChange={handleSelect}
            placeholder="All time"
          ></Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="flex flex-col gap-2 rounded-xl border border-grey-20 bg-white p-5 shadow-sm">
          <p className="text-base leading-normal text-grey-500">Total</p>
          <div className="flex h-12 items-center">
            {loading ? (
              <Spinner />
            ) : (
              <p className="text-[32px] leading-10 text-grey-90">
                {statistics?.total ?? 0}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-grey-20 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8.35355 1.64645L8 1.29289L7.64645 1.64645L1.64645 7.64645L1.29289 8L1.64645 8.35355L7.64645 14.3536L8 14.7071L8.35355 14.3536L14.3536 8.35355L14.7071 8L14.3536 7.64645L8.35355 1.64645Z"
                fill="#B7BDC2"
                stroke="#D7DBDF"
              />
            </svg>
            <p className="text-base leading-normal text-grey-500">Pending</p>
          </div>
          <div className="flex h-12 items-center">
            {loading ? (
              <Spinner />
            ) : (
              <p className="text-[32px] leading-10 text-grey-90">
                {statistics?.pending ?? 0}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-grey-20 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8.35355 1.64645L8 1.29289L7.64645 1.64645L1.64645 7.64645L1.29289 8L1.64645 8.35355L7.64645 14.3536L8 14.7071L8.35355 14.3536L14.3536 8.35355L14.7071 8L14.3536 7.64645L8.35355 1.64645Z"
                fill="#107C10"
                stroke="#D7DBDF"
              />
            </svg>
            <p className="text-base leading-normal text-grey-500">Positive</p>
          </div>
          <div className="flex h-12 items-center">
            {loading ? (
              <Spinner />
            ) : (
              <p className="text-[32px] leading-10 text-grey-90">
                {statistics?.positive ?? 0}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-grey-20 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8.35355 1.64645L8 1.29289L7.64645 1.64645L1.64645 7.64645L1.29289 8L1.64645 8.35355L7.64645 14.3536L8 14.7071L8.35355 14.3536L14.3536 8.35355L14.7071 8L14.3536 7.64645L8.35355 1.64645Z"
                fill="#A1221B"
                stroke="#D7DBDF"
              />
            </svg>
            <p className="text-base leading-normal text-grey-500">Negative</p>
          </div>
          <div className="flex h-12 items-center">
            {loading ? (
              <Spinner />
            ) : (
              <p className="text-[32px] leading-10 text-grey-90">
                {statistics?.negative ?? 0}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sites table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-grey-10 border-b border-grey-20">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grey-70">
                Site Name
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grey-70">
                District
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grey-70">
                Last Schedule
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grey-70">
                Farm Type
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grey-70">
                Subtype
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grey-70">
                Collector
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grey-70">
                Test Result
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grey-70">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grey-70">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-20">
            {sitesLoading ? (
              <tr>
                <td colSpan={9} className="py-8">
                  <div className="flex items-center justify-center">
                    <Spinner />
                  </div>
                </td>
              </tr>
            ) : sites.length > 0 ? (
              sites.slice(0, 5).map((site) => (
                <tr key={site.id} className="hover:bg-grey-5 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium capitalize whitespace-nowrap">
                    <Link
                      href={`/projects/${id}/sites/${site.id}`}
                      className="text-primary-500 hover:text-primary-700 hover:underline transition-colors"
                    >
                      {site.name ?? "—"}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm text-grey-70 capitalize whitespace-nowrap">
                    {site.location?.region?.name ??
                      site.address?.split(",")[0] ??
                      "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-grey-70 whitespace-nowrap">
                    {formatDate(site.collectionLastScheduleDate ?? "")}
                  </td>
                  <td className="px-5 py-4 text-sm text-grey-70 capitalize whitespace-nowrap">
                    {farmTypeLabel(site.farmType)}
                  </td>
                  <td className="px-5 py-4 text-sm text-grey-70 capitalize whitespace-nowrap">
                    {site.siteSubType || site.siteType || "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-grey-70 whitespace-nowrap">
                    {collectorName(site.collectionCollector)}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={testResultBadgeClass(site.testResult)}>
                      {site.testResult ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={statusBadgeClass(site.status)}>
                      {site.status ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {hasPermission("update", "collection-plan", id) && (
                      <button
                        onClick={() => {
                          setSelectedSiteId(site.id);
                          setSite(site);
                          setIsOpenCollectionPlan(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M8 2v4" />
                          <path d="M16 2v4" />
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <path d="M3 10h18" />
                          <path d="M8 14h.01" />
                          <path d="M12 14h.01" />
                          <path d="M16 14h.01" />
                          <path d="M8 18h.01" />
                          <path d="M12 18h.01" />
                          <path d="M16 18h.01" />
                        </svg>
                        Update Collection Plan
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="py-8 text-center text-sm text-grey-70"
                >
                  No sites found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UpdateCollectionPlanModal
        isOpen={isOpenCollectionPlan}
        onClose={() => {
          setIsOpenCollectionPlan(false);
          setSelectedSiteId(undefined);
        }}
        siteId={selectedSiteId}
      />
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";

import Breadcrumb from "@/src/components/ui/breadcrumb";
import SiteDetails from "@/src/components/projects/sites/site-details";
import SiteVisitStats from "@/src/components/projects/sites/site-visit-stats";
import PastVisitsList from "@/src/components/projects/sites/past-visits-list";
import ScheduledVisitsList from "@/src/components/projects/sites/scheduled-visits-list";
import { projectAtom } from "@/src/store/projectAtom";
import { siteAtom } from "@/src/store/siteAtom";
import { getScheduledVisitsApi } from "@/src/app/(dashboard)/projects/[id]/sites/[siteId]/loader";

export default function SiteDetailsPage() {
  const { id, siteId } = useParams<{ id: string; siteId: string }>();
  const project = useAtomValue(projectAtom);
  const siteDetail = useAtomValue(siteAtom);
  const [activeTab, setActiveTab] = useState<"overview" | "scheduled" | "past-visits">(
    "overview",
  );
  const [scheduledCount, setScheduledCount] = useState<number>(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return (
      siteDetail?.visits?.filter(
        (v) =>
          !v.isCompleted &&
          v.visitStatus !== "completed" &&
          v.visitStatus !== "skipped" &&
          new Date(v.visitScheduledAt).getTime() >= todayStart.getTime(),
      ).length ?? 0
    );
  });

  // Sync scheduled count whenever siteDetail visits load or update
  useEffect(() => {
    if (siteDetail?.visits) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const count = siteDetail.visits.filter(
        (v) =>
          !v.isCompleted &&
          v.visitStatus !== "completed" &&
          v.visitStatus !== "skipped" &&
          new Date(v.visitScheduledAt).getTime() >= todayStart.getTime(),
      ).length;
      setScheduledCount(count);
    }
  }, [siteDetail?.visits]);

  // Fetch upcoming scheduled visits count on mount so the count is immediately
  // accurate, and again whenever the site's visits are read back, e.g. after
  // its collection plan changes.
  useEffect(() => {
    if (!id || !siteId) return;
    getScheduledVisitsApi(id, {
      siteId,
      visitStatus: "upcoming",
      assignedTo: true,
    })
      .then((res) => {
        if (res?.success) {
          const count =
            res.total ?? (Array.isArray(res.data) ? res.data.length : 0);
          setScheduledCount(count);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch initial scheduled count:", err);
      });
  }, [id, siteId, siteDetail?.visits]);

  const pastVisitsCount =
    siteDetail?.visits?.filter((v) => v.isCompleted).length ?? 0;

  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      <div className="flex flex-col gap-4">
        <Breadcrumb
          path={[
            { name: project?.name ?? "Project", href: `/projects/${id}` },
            { name: "Sites", href: `/projects/${id}/sites` },
            {
              name: siteDetail?.name ?? "Site details",
              href: `/sites/${siteId}`,
            },
          ]}
        />
        <SiteVisitStats />

        {/* Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-blue-40 text-white"
                : "border border-grey-20 bg-white text-grey-70 hover:bg-grey-10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            Overview
          </button>
          <button
            onClick={() => setActiveTab("scheduled")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "scheduled"
                ? "bg-blue-40 text-white"
                : "border border-grey-20 bg-white text-grey-70 hover:bg-grey-10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            Schedule ({scheduledCount})
          </button>
          <button
            onClick={() => setActiveTab("past-visits")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "past-visits"
                ? "bg-blue-40 text-white"
                : "border border-grey-20 bg-white text-grey-70 hover:bg-grey-10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
            </svg>
            Past Visits ({pastVisitsCount})
          </button>
        </div>

        {activeTab === "overview" && <SiteDetails />}
        {activeTab === "scheduled" && (
          <ScheduledVisitsList
            siteId={siteId}
            onCountChange={setScheduledCount}
          />
        )}
      </div>
      {activeTab === "past-visits" && <PastVisitsList />}
    </div>
  );
}

"use client";

import { useAtomValue } from "jotai";

import { siteAtom } from "@/src/store/siteAtom";
import { formatDate } from "@/src/utils";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";

export default function SiteVisitStats() {
  const siteDetail = useAtomValue(siteAtom);

  if (!siteDetail) return null;

  const visits = siteDetail.visits ?? [];
  const completedVisits = visits.filter((v) => v.isCompleted);

  const totalVisits = completedVisits.length;
  const totalSamples = completedVisits.reduce(
    (sum, v) => sum + (v.totalSamples ?? 0),
    0,
  );
  const suspectedPositives = completedVisits.reduce((sum, v) => {
    const count =
      v.suspectedPositives?.filter((sp) => sp.isSuspectedPositive).length ?? 0;
    return sum + count;
  }, 0);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const upcomingVisits = visits
    .filter(
      (v) =>
        !v.isCompleted &&
        v.visitStatus !== "completed" &&
        v.visitStatus !== "skipped" &&
        new Date(v.visitScheduledAt).getTime() >= todayStart.getTime(),
    )
    .sort(
      (a, b) =>
        new Date(a.visitScheduledAt).getTime() -
        new Date(b.visitScheduledAt).getTime(),
    );

  const nextVisitDate =
    upcomingVisits.length > 0
      ? upcomingVisits[0].visitScheduledAt
      : siteDetail.nextCollectionDate || null;
  const updatedAt = siteDetail.updatedAt ?? siteDetail.createdAt;

  return (
    <div className="flex flex-col gap-4">
      {/* Site summary header */}
      <div className="flex items-center gap-4 rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
        {/* Location icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5D7FDD"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        {/* Text block */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-grey-90">
              {siteDetail.name}
            </h1>
            {siteDetail.diseases?.map((disease) => (
              <span
                key={disease.id}
                className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium uppercase tracking-tight ${DISEASE_COLOR_CODE.BG_COLOR[(disease.index ?? 0) % 6]} text-grey-80`}
              >
                {disease.shortName}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-10 px-2.5 py-0.5 text-xs font-medium text-green-30 capitalize">
              <span className="h-1.5 w-1.5 rounded-full bg-green-30" />
              {siteDetail.status ?? "active"}
            </span>
          </div>
          <p className="text-sm text-grey-70">
            <span className="capitalize">
              {siteDetail.farmType?.replace(/_/g, " ")}
            </span>
            {siteDetail.siteType && (
              <>
                {" · "}
                <span className="capitalize">{siteDetail.siteType}</span>
              </>
            )}
            {updatedAt && (
              <>
                {" · Updated "}
                {formatDate(updatedAt)}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Visits */}
        <div className="flex flex-col gap-4 rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-grey-80">Total Visits</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5D7FDD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[28px] font-semibold leading-9 text-grey-90">
              {totalVisits}
            </p>
            <p className="text-xs text-grey-60">all-time</p>
          </div>
        </div>

        {/* Samples Collected */}
        <div className="flex flex-col gap-4 rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-grey-80">
              Samples Collected
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5D7FDD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 2v7.31" />
                <path d="M14 2v7.31" />
                <path d="M8.5 2h7" />
                <path d="M14 12.5a2.5 2.5 0 0 0-5 0v4.5a2.5 2.5 0 0 0 5 0z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[28px] font-semibold leading-9 text-grey-90">
              {totalSamples}
            </p>
            <p className="text-xs text-grey-60">across visits</p>
          </div>
        </div>

        {/* Suspected Positives */}
        <div className="flex flex-col gap-4 rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-grey-80">
              Suspected Positives
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A1221B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[28px] font-semibold leading-9 text-grey-90">
              {suspectedPositives}
            </p>
            <p className="text-xs text-grey-60">requires lab review</p>
          </div>
        </div>

        {/* Next Visit */}
        <div className="flex flex-col gap-4 rounded-2xl border border-grey-20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-grey-80">Next Visit</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#107C10"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            {nextVisitDate ? (
              <>
                <p className="text-[28px] font-semibold leading-9 text-grey-90">
                  {formatDate(nextVisitDate)}
                </p>
                <p className="text-xs text-grey-60">scheduled</p>
              </>
            ) : (
              <>
                <p className="text-[28px] font-semibold leading-9 text-grey-90">
                  &mdash;
                </p>
                <p className="text-xs text-grey-60">no plan</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

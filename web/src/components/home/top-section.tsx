"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { useAtomValue } from "jotai";
import { userAtom } from "@/src/store/userAtom";
import { homeDataAtom } from "@/src/store/homeDataAtom";
import analytics from "@/src/lib/analytics";

export default function TopSection() {
  const user = useAtomValue(userAtom);
  const homeData = useAtomValue(homeDataAtom);

  useEffect(() => {
    analytics.dashboardViewed();
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <div className="rounded-3xl bg-blue-40 px-6 py-8 sm:px-8 lg:px-12 lg:py-11">
        <p className="text-lg font-bold uppercase leading-none tracking-[0.16em] text-white/80">
          This month&apos;s overview
        </p>
        <h1 className="mt-5 max-w-[620px] text-3xl font-semibold leading-tight text-white sm:text-4xl">
          Welcome back, {user?.firstName ?? "Admin"} - keep your surveillance on
          track
        </h1>
        <Link
          href="/monitor"
          className="mt-8 inline-flex h-[50px] items-center gap-3 rounded-full bg-grey-90 px-6 text-sm font-semibold text-white transition hover:bg-grey-80 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-blue-40"
        >
          <span>Open Dashboard</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
            <ChevronRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Visited Sites"
          value={homeData?.visits?.totalVisited ?? 0}
          total={homeData?.visits?.totalPresent ?? 0}
          icon={<VisitedSitesIcon />}
          iconClassName="bg-blue-10"
        />

        <StatCard
          title="Positive Sites"
          value={homeData?.sites?.totalPositive ?? 0}
          total={homeData?.sites?.totalPresent ?? 0}
          valueClassName="text-red-30"
          icon={<PositiveSitesIcon />}
          iconClassName="bg-red-10"
        />

        <StatCard
          title="Samples Tested"
          value={homeData?.samples?.totalTested ?? 0}
          total={homeData?.samples?.totalPresent ?? 0}
          icon={<SamplesIcon fill="#5D7FDD" />}
          iconClassName="bg-blue-10"
        />
      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  total,
  icon,
  iconClassName,
  valueClassName = "text-grey-90",
}: {
  title: string;
  value: number;
  total: number;
  icon: ReactNode;
  iconClassName: string;
  valueClassName?: string;
}) {
  return (
    <div className="min-h-[140px] rounded-xl border border-grey-20 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium leading-5 text-grey-80">{title}</p>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-6">
        <p
          className={`text-[32px] font-semibold leading-none ${valueClassName}`}
        >
          {value}
        </p>
        <p className="mt-3 text-xs font-bold uppercase leading-none tracking-wide text-grey-60">
          of {total} total
        </p>
      </div>
    </div>
  );
}

function PositiveSitesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M19.03 17.3639L12.666 23.7279L6.30202 17.3639C5.04336 16.1052 4.1862 14.5016 3.83894 12.7558C3.49169 11.0099 3.66992 9.20035 4.35111 7.55582C5.03231 5.91129 6.18586 4.50569 7.6659 3.51677C9.14594 2.52784 10.886 2 12.666 2C14.446 2 16.1861 2.52784 17.6661 3.51677C19.1462 4.50569 20.2997 5.91129 20.9809 7.55582C21.6621 9.20035 21.8404 11.0099 21.4931 12.7558C21.1458 14.5016 20.2887 16.1052 19.03 17.3639ZM11.666 9.99992H8.66602V11.9999H11.666V14.9999H13.666V11.9999H16.666V9.99992H13.666V6.99992H11.666V9.99992Z"
        fill="#A1221B"
      />
    </svg>
  );
}

function VisitedSitesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M12.332 20.8999L17.282 15.9499C18.2609 14.9709 18.9275 13.7236 19.1976 12.3658C19.4676 11.0079 19.329 9.60052 18.7991 8.32148C18.2693 7.04244 17.3721 5.94923 16.221 5.18009C15.0698 4.41095 13.7165 4.00043 12.332 4.00043C10.9476 4.00043 9.59425 4.41095 8.44312 5.18009C7.29199 5.94923 6.39478 7.04244 5.86495 8.32148C5.33511 9.60052 5.19645 11.0079 5.46649 12.3658C5.73652 13.7236 6.40314 14.9709 7.38204 15.9499L12.332 20.8999ZM12.332 23.7279L5.96804 17.3639C4.70937 16.1052 3.85222 14.5016 3.50496 12.7558C3.1577 11.0099 3.33594 9.20035 4.01713 7.55582C4.69832 5.91129 5.85187 4.50569 7.33191 3.51677C8.81195 2.52784 10.552 2 12.332 2C14.1121 2 15.8521 2.52784 17.3322 3.51677C18.8122 4.50569 19.9657 5.91129 20.6469 7.55582C21.3281 9.20035 21.5064 11.0099 21.1591 12.7558C20.8119 14.5016 19.9547 16.1052 18.696 17.3639L12.332 23.7279ZM12.332 12.9999C12.8625 12.9999 13.3712 12.7892 13.7462 12.4141C14.1213 12.0391 14.332 11.5304 14.332 10.9999C14.332 10.4695 14.1213 9.96078 13.7462 9.58571C13.3712 9.21064 12.8625 8.99992 12.332 8.99992C11.8016 8.99992 11.2929 9.21064 10.9178 9.58571C10.5427 9.96078 10.332 10.4695 10.332 10.9999C10.332 11.5304 10.5427 12.0391 10.9178 12.4141C11.2929 12.7892 11.8016 12.9999 12.332 12.9999ZM12.332 14.9999C11.2712 14.9999 10.2538 14.5785 9.50361 13.8283C8.75346 13.0782 8.33204 12.0608 8.33204 10.9999C8.33204 9.93906 8.75346 8.92164 9.50361 8.17149C10.2538 7.42135 11.2712 6.99992 12.332 6.99992C13.3929 6.99992 14.4103 7.42135 15.1605 8.17149C15.9106 8.92164 16.332 9.93906 16.332 10.9999C16.332 12.0608 15.9106 13.0782 15.1605 13.8283C14.4103 14.5785 13.3929 14.9999 12.332 14.9999Z"
        fill="#5D7FDD"
      />
    </svg>
  );
}

function SamplesIcon({ fill }: { fill: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M17 2V4H16V18C16 20.21 14.21 22 12 22C9.79 22 8 20.21 8 18V4H7V2H17ZM14 10H10V18C10 19.105 10.895 20 12 20C13.105 20 14 19.105 14 18V10ZM13 15C13.552 15 14 15.448 14 16C14 16.552 13.552 17 13 17C12.448 17 12 16.552 12 16C12 15.448 12.448 15 13 15ZM11 12C11.552 12 12 12.448 12 13C12 13.552 11.552 14 11 14C10.448 14 10 13.552 10 13C10 12.448 10.448 12 11 12ZM14 4H10V8H14V4Z"
        fill={fill}
      />
    </svg>
  );
}

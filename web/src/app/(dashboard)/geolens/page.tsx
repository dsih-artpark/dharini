"use client";

import dynamic from "next/dynamic";
import "./index.css";
import "./App.css";

const DashboardApp = dynamic(
  () => import("@/src/components/geolens/DashboardApp"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white dark:bg-grey-90">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-grey-20 dark:border-grey-70"></div>
            <div className="absolute h-12 w-12 rounded-full border-4 border-t-blue-40 animate-spin border-r-transparent border-b-transparent border-l-transparent"></div>
          </div>
          <p className="text-base font-semibold text-blue-40 dark:text-blue-20 animate-pulse">
            Preparing Dashboard...
          </p>
        </div>
      </div>
    ),
  },
);

export default function Page() {
  return <DashboardApp />;
}

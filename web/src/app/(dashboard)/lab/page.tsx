"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Archive, Inbox } from "lucide-react";
import SamplesStat from "@/src/components/lab/samples-stat";
import SampleArchive from "@/src/components/lab/sample-archive";
import SuperAdminProjectPicker from "@/src/components/lab/super-admin-project-picker";
import Spinner from "@/src/components/ui/spinner";

// Browser-only: the list starts from the tab and columns saved in
// sessionStorage, which the server can't read, so a server render would
// differ from the first client render and fail hydration.
const ReceivedSamplesList = dynamic(
  () => import("@/src/components/lab/received-sample-list"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    ),
  },
);

const LAB_TABS = [
  { id: "received", label: "Received Samples", Icon: Inbox },
  { id: "archive", label: "Sample Archive", Icon: Archive },
] as const;

type LabTab = (typeof LAB_TABS)[number]["id"];

// The main tab is kept in `?tab=` so other screens can link to the archive.
function LabSamples() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab: LabTab =
    searchParams.get("tab") === "archive" ? "archive" : "received";

  const selectTab = (tab: LabTab) => {
    if (tab === activeTab) return;
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "archive") params.set("tab", "archive");
    else params.delete("tab");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <section className="flex flex-col rounded-2xl border border-grey-20 bg-white pt-2 shadow-card">
      <div
        role="tablist"
        aria-label="Lab samples"
        className="flex gap-6 border-b border-grey-20 px-5 sm:gap-8 sm:px-6"
      >
        {LAB_TABS.map(({ id, label, Icon }) => {
          const isActive = id === activeTab;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectTab(id)}
              className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-[3px] py-3 text-base font-semibold transition-colors sm:text-xl ${
                isActive
                  ? "border-blue-40 text-grey-90"
                  : "border-transparent text-grey-60 hover:text-grey-80"
              }`}
            >
              <Icon
                size={20}
                className={`hidden sm:block ${isActive ? "text-blue-40" : ""}`}
              />
              {label}
            </button>
          );
        })}
      </div>
      {activeTab === "archive" ? <SampleArchive /> : <ReceivedSamplesList />}
    </section>
  );
}

export default function Lab() {
  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold leading-tight text-grey-90">
          Lab Processing
        </h1>
        <SuperAdminProjectPicker />
      </div>
      <SamplesStat />
      {/* useSearchParams needs a Suspense boundary in the App Router. */}
      <Suspense
        fallback={
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        }
      >
        <LabSamples />
      </Suspense>
    </div>
  );
}

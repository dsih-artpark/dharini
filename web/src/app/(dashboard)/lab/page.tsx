"use client";

import dynamic from "next/dynamic";
import SamplesStat from "@/src/components/lab/samples-stat";
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

export default function Lab() {
  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      <SuperAdminProjectPicker />
      <SamplesStat />

      <section className="flex flex-col gap-4 rounded-2xl border border-grey-20 bg-white pt-5 shadow-card">
        <div className="flex flex-col gap-1 px-5 sm:px-6">
          <h1 className="text-2xl font-semibold leading-tight text-grey-90 sm:text-[32px]">
            Received Samples
          </h1>
        </div>
        <ReceivedSamplesList />
      </section>
    </div>
  );
}

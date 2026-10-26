"use client";

import SamplesStat from "@/src/components/lab/samples-stat";
import ReceivedSamplesList from "@/src/components/lab/received-sample-list";
import SuperAdminProjectPicker from "@/src/components/lab/super-admin-project-picker";

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

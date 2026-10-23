"use client";

import MonitorDashboard from "@/src/components/monitor/diseases/monitor-dashboard";

export default function Monitor() {
  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      <MonitorDashboard />
    </div>
  );
}

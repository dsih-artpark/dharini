"use client";

import { useState } from "react";
import ProjectComparison from "@/src/components/comparison/project-comparison";
import SiteComparison from "@/src/components/comparison/site-comparison";
import SampleTypeComparison from "@/src/components/comparison/sample-type-comparison";

const TABS = [
  { id: "project", label: "Project Comparison" },
  { id: "site", label: "Sitewise Comparison" },
  { id: "sample", label: "Sample Comparison" },
];

const HEADERS: Record<string, { title: string; subtitle: string }> = {
  project: {
    title: "Project Comparison",
    subtitle: "Compare sample positivity across projects",
  },
  site: {
    title: "Compare Sites",
    subtitle: "Compare sample positivity across two sites within a project",
  },
  sample: {
    title: "Compare Samples",
    subtitle: "Compare positivity across two different sample types",
  },
};

export default function ComparisonPage() {
  const [selected, setSelected] = useState("project");
  const header = HEADERS[selected];

  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-grey-90">{header.title}</h1>
        <p className="text-sm text-grey-70">{header.subtitle}</p>
      </div>

      <div className="flex items-center bg-grey-5 rounded-lg p-0.5 border border-grey-20 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelected(tab.id)}
            className={`text-xs px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              selected === tab.id
                ? "bg-white text-grey-80 shadow-sm font-medium"
                : "text-grey-60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {selected === "project" && <ProjectComparison />}
        {selected === "site" && <SiteComparison />}
        {selected === "sample" && <SampleTypeComparison />}
      </div>
    </div>
  );
}

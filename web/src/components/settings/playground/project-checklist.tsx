"use client";

import { useMemo, useState } from "react";
import Checkbox from "@/src/components/ui/checkbox";
import type { ProjectDetail } from "@/src/types/global";

type ProjectChecklistProps = {
  projects: ProjectDetail[];
  loading: boolean;
  selectedProjectIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
};

export default function ProjectChecklist({
  projects,
  loading,
  selectedProjectIds,
  onToggle,
  onSelectAll,
  onClearAll,
}: ProjectChecklistProps) {
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.code?.toLowerCase().includes(query),
    );
  }, [projects, search]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-grey-80 text-sm font-semibold">
          Projects
          {selectedProjectIds.length > 0 &&
            ` (${selectedProjectIds.length} selected)`}
        </label>
        <div className="flex items-center gap-3 text-xs font-medium">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-blue-50 hover:text-blue-60"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="text-grey-50 hover:text-grey-70"
          >
            Clear
          </button>
        </div>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter projects..."
        className="w-full px-3 py-2 border border-grey-20 rounded-lg text-sm bg-white placeholder-grey-40 focus:ring-2 focus:ring-blue-40 focus:outline-none"
      />

      <div className="border border-grey-20 rounded-lg max-h-[320px] overflow-y-auto flex flex-col divide-y divide-grey-10">
        {loading ? (
          <div className="p-4 text-center text-grey-50 text-sm">
            Loading projects...
          </div>
        ) : filteredProjects.length ? (
          filteredProjects.map((project) => (
            <Checkbox
              key={project.id}
              id={`playground-project-${project.id}`}
              label={`${project.name} (${project.code})`}
              className="bg-white"
              checked={selectedProjectIds.includes(project.id)}
              onChange={() => onToggle(project.id)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-grey-50 text-sm">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
}

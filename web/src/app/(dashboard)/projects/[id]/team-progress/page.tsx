"use client";

import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";

import Breadcrumb from "@/src/components/ui/breadcrumb";
import TeamProgressStatistics from "@/src/components/projects/team-progress/team-progress-statistics";
import TeamMembersActivity from "@/src/components/projects/team-progress/team-members-activity";
import { projectAtom } from "@/src/store/projectAtom";

export default function TeamMembersPage() {
  const { id } = useParams<{ id: string }>();
  const project = useAtomValue(projectAtom);

  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      <Breadcrumb
        path={[
          { name: project?.name ?? "Project", href: `/projects/${id}` },
          {
            name: "Team Activity & Progress",
            href: `/projects/${id}/team-progress`,
          },
        ]}
      />
      <TeamProgressStatistics />
      <TeamMembersActivity />
    </div>
  );
}

"use client";

import Detail from "@/src/components/projects/project-detail";
import ProjectDetailActions from "@/src/components/projects/project-details-actions";
// import Samples from "@/src/components/projects/samples";
import Sites from "@/src/components/projects/sites";
import TeamMemberProgress from "@/src/components/projects/team-member-progress";

export default function ProjectDetail() {
  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      {/* <Breadcrumb
        path={[{ name: project?.name ?? "Project", href: `/projects/${id}` }]}
      /> */}
      <Detail />
      <ProjectDetailActions />
      <Sites />
      <TeamMemberProgress />
    </div>
  );
}

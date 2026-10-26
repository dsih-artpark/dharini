"use client";

import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";
// import { useState } from "react";
import Breadcrumb from "@/src/components/ui/breadcrumb";
import ManageAccess from "@/src/components/projects/manage-access/manage-access";
// import ConfigureAccess from "@/src/components/projects/manage-access/configure-access";
import { projectAtom } from "@/src/store/projectAtom";
// type TabTypes = "Manage" | "Configure";

export default function ManageAccessPage() {
  const { id } = useParams<{ id: string; siteId: string }>();
  const project = useAtomValue(projectAtom);

  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      <Breadcrumb
        path={[
          { name: project?.name ?? "Project", href: `/projects/${id}` },
          { name: "Manage Team", href: `/projects/${id}/manage-access` },
        ]}
      />
      <ManageAccess />
    </div>
  );
}

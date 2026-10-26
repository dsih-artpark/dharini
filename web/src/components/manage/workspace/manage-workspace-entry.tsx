"use client";

import Link from "next/link";
import { Settings } from "lucide-react";

import {
  useIsWorkspaceAdmin,
  useIsSuperAdmin,
} from "@/src/hooks/check-permission";

// 4.5: entry point into the new /manage/workspace admin screen, shown
// to workspace-admins (to manage their workspace) and super-admins
// (to manage any workspace).
export default function ManageWorkspaceEntry() {
  const isWorkspaceAdmin = useIsWorkspaceAdmin();
  const isSuperAdmin = useIsSuperAdmin();

  if (!isWorkspaceAdmin && !isSuperAdmin) return null;

  return (
    <Link
      href="/manage/workspace"
      className="inline-flex w-fit items-center gap-2 rounded-lg border border-grey-20 bg-white px-4 py-2.5 text-sm font-medium text-grey-80 shadow-card transition hover:bg-grey-10"
    >
      <Settings className="h-4 w-4" />
      Manage Workspace
    </Link>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { usePathname } from "next/navigation";

import { userAtom } from "@/src/store/userAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { getWorkspaceProjects } from "@/src/app/(root)/workspaces/loader";
import type { ProjectDetail } from "@/src/types/global";

// 4.4: shared "what project should this page act on" resolution, used by
// /monitor, /comparison, /lab and /sequencing.
//
// These pages were built before workspaces existed and hardcoded a single
// `user.project` assumption. That's still correct for team/project-scoped
// members - their UserRole is genuinely tied to one fixed project regardless
// of which workspace they're viewing (see WorkspacesService.findMine()'s
// comment on indirect workspace membership via a project). But a
// workspace-admin's UserRole has no project at all, so without a fallback
// they'd see an empty state no matter which workspace they select via the
// 4.3 nav switcher.
//
// Precedence: an explicit selection the caller already tracks (e.g. a
// super-admin's own dropdown state) > user.project (fixed team/project-scoped
// assignment) > the first project belonging to the currently selected
// workspace.
export const useCurrentProjectResolver = () => {
  const user = useAtomValue(userAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const pathname = usePathname();
  const [workspaceProjects, setWorkspaceProjects] = useState<ProjectDetail[]>(
    [],
  );
  const [loadingWorkspaceProjects, setLoadingWorkspaceProjects] =
    useState(false);

  useEffect(() => {
    if (!currentWorkspace?.id) {
      setWorkspaceProjects([]);
      return;
    }
    setLoadingWorkspaceProjects(true);
    getWorkspaceProjects(currentWorkspace.id)
      .then(setWorkspaceProjects)
      .catch((error) => {
        console.error("Failed to load workspace projects", error);
        setWorkspaceProjects([]);
      })
      .finally(() => setLoadingWorkspaceProjects(false));
  }, [currentWorkspace?.id]);

  const routeProjectId = (() => {
    const match = pathname?.match(/^\/projects\/([^/]+)/);
    return match?.[1] ?? "";
  })();

  const resolveProjectId = (explicitProjectId?: string) => {
    if (explicitProjectId) return explicitProjectId;
    if (routeProjectId) return routeProjectId;

    if (currentWorkspace?.id) {
      if (workspaceProjects.length > 0) {
        const userProjectId = user?.project?.id;
        if (
          userProjectId &&
          workspaceProjects.some((p) => p.id === userProjectId)
        ) {
          return userProjectId;
        }
        const matchingProject = user?.projects?.find((up) =>
          workspaceProjects.some((wp) => wp.id === up.id),
        );
        if (matchingProject?.id) {
          return matchingProject.id;
        }
        return workspaceProjects[0]?.id || "";
      }
      return "";
    }

    return user?.project?.id || user?.projects?.[0]?.id || "";
  };

  return { workspaceProjects, loadingWorkspaceProjects, resolveProjectId };
};

"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { homeDataAtom, homeDataLoadingAtom } from "@/src/store/homeDataAtom";
import {
  currentWorkspaceAtom,
  CURRENT_WORKSPACE_STORAGE_KEY,
} from "@/src/store/currentWorkspaceAtom";
import { getHomeLast30DaysApi } from "@/src/app/(dashboard)/home/loader";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";

// currentWorkspaceAtom is localStorage-backed but (to stay SSR-safe) always
// starts as `null` and only re-hydrates the persisted value in a mount
// effect, one render after this component's first render. Without this
// check, that first render fires a request with no workspace id at all
// whenever a workspace selection IS persisted, which briefly shows
// unscoped data before the correctly-scoped request replaces it - the
// "data appears then disappears" symptom. Reading the raw key directly
// (mirroring jotai's own JSON storage semantics: an absent key or a stored
// `null` both mean "nothing persisted") tells us, before that hydration
// lands, whether to wait for it.
const hasPersistedWorkspaceSelection = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(CURRENT_WORKSPACE_STORAGE_KEY);
    return raw !== null && JSON.parse(raw) !== null;
  } catch {
    return false;
  }
};

export default function HomeDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const setHomeData = useSetAtom(homeDataAtom);
  const setLoading = useSetAtom(homeDataLoadingAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const { resolveProjectId } = useCurrentProjectResolver();
  const [awaitingPersistedWorkspace] = useState(hasPersistedWorkspaceSelection);
  // Once currentWorkspace has hydrated (or resolved to genuinely nothing)
  // at least once, the "await" gate below must not re-apply - e.g. a user
  // deliberately clearing their workspace later via the switcher also makes
  // currentWorkspace?.id falsy, and that's a real state to fetch for, not
  // the initial hydration lag.
  const hasHydratedWorkspaceRef = useRef(false);
  if (currentWorkspace?.id) {
    hasHydratedWorkspaceRef.current = true;
  }

  useEffect(() => {
    if (
      awaitingPersistedWorkspace &&
      !hasHydratedWorkspaceRef.current &&
      !currentWorkspace?.id
    ) {
      setLoading(true);
      return;
    }

    setLoading(true);
    setHomeData(null);
    // /home is a workspace-wide overview, not a single-project view. When a
    // workspace is active, scope by workspaceId alone - the backend's own
    // tenant scoping (see StatisticsService.getHomeLast30Days) already
    // narrows that to whatever projects this caller can actually reach
    // inside it, aggregated, for every role. Sending a projectId here (as
    // useCurrentProjectResolver()'s general-purpose fallback would, picking
    // *some* single project) pins the whole dashboard to one project
    // instead - which is what a project/team-scoped member without a
    // workspace context genuinely needs (there's no workspaceId to lean on
    // for them), but wrong for anyone viewing a workspace.
    const projectId = currentWorkspace?.id ? undefined : resolveProjectId();
    getHomeLast30DaysApi(projectId || undefined, currentWorkspace?.id)
      .then(({ success, data }) => {
        if (success) setHomeData(data);
      })
      .catch((error) => {
        console.error("Failed to load home statistics", error);
      })
      .finally(() => setLoading(false));
  }, [awaitingPersistedWorkspace, currentWorkspace?.id]);

  return <>{children}</>;
}

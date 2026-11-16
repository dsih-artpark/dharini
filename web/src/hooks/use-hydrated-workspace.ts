"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import {
  currentWorkspaceAtom,
  CURRENT_WORKSPACE_STORAGE_KEY,
} from "@/src/store/currentWorkspaceAtom";

// Like home-data-provider's check (an absent key or a stored `null` mean
// "nothing persisted"), but also requires an id: a stored value without one
// would never produce a workspaceId, so waiting for it would never end.
const hasPersistedWorkspaceSelection = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(CURRENT_WORKSPACE_STORAGE_KEY);
    return raw !== null && Boolean(JSON.parse(raw)?.id);
  } catch {
    return false;
  }
};

// currentWorkspaceAtom is localStorage-backed but starts as `null` and only
// loads the saved workspace one render after mount. Fetching before that
// sends no workspaceId, and the backend answers with every workspace's data -
// which, after a refresh, could land after (and overwrite) the correctly
// scoped response. `ready` stays false until the saved selection has loaded
// (or there is none). It is also false on the server and the first client
// render, so it is safe to gate rendering on, not just fetching.
export function useHydratedWorkspace() {
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const workspaceId = currentWorkspace?.id;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    if (workspaceId || !hasPersistedWorkspaceSelection()) setReady(true);
  }, [ready, workspaceId]);

  return { workspaceId, ready };
}

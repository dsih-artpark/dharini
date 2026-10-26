import { atomWithStorage } from "jotai/utils";
import type { Workspace } from "@/src/types/global";

// Exported so code that can't use the atom directly (e.g. home-data-provider,
// which reads the stored value before the atom has loaded it) can do so
// without duplicating the key string.
export const CURRENT_WORKSPACE_STORAGE_KEY = "dharini.currentWorkspace";

// 4.2: the workspace the user is currently operating in. Persisted
// (localStorage-backed) so the choice survives a refresh/new tab, not just
// the current in-memory session — unlike userAtom, which is always
// refetched from GET /users/profile on load.
export const currentWorkspaceAtom = atomWithStorage<Workspace | null>(
  CURRENT_WORKSPACE_STORAGE_KEY,
  null,
);

import { atom } from "jotai";

/**
 * True when the super-admin lab flow is showing data across ALL projects.
 *
 * Lab-scoped only — `userAtom.project` always stays a real project so the rest
 * of the app (header links, monitor, sequencing) is unaffected. The picker
 * writes this; the lab read components (stats, list, detail modal) read it.
 * Initialised to false; the picker syncs it from localStorage on mount.
 */
export const labAllProjectsAtom = atom<boolean>(false);

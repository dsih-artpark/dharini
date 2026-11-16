import { atom } from "jotai";
import type { ProjectDetail } from "@/src/types/global";

/**
 * The project the user had when the lab picker switched them, on its own, to
 * a project they can work in the lab in - because they can't in theirs - or
 * null when it didn't.
 *
 * `userAtom.project` is app-wide, so that switch would otherwise follow the
 * user out of the lab. LabProjectRestorer puts this project back once they
 * leave the lab's pages; picking a project in the picker themselves clears
 * it, so a choice they made stays.
 */
export const labSwitchedFromProjectAtom = atom<ProjectDetail | null>(null);

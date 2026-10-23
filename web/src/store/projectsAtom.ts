import { atom } from "jotai";
import type { ProjectDetail } from "@/src/types/global";

export const projectsAtom = atom<ProjectDetail[] | []>([]);

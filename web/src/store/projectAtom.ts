import { atom } from "jotai";
import type { ProjectDetail } from "@/src/types/global";

export const projectAtom = atom<ProjectDetail | null>();

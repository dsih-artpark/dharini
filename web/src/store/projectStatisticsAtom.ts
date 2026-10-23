import { atom } from "jotai";
import type { ProjectStatistic } from "@/src/types/global";

export const projectStatisticsAtom = atom<ProjectStatistic[] | []>([]);

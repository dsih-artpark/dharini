import { atom } from "jotai";
import type { HomeLast30DaysData } from "@/src/types/statistics";

export const homeDataAtom = atom<HomeLast30DaysData | null>(null);
export const homeDataLoadingAtom = atom(false);

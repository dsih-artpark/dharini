import { atom } from "jotai";
import { Sample } from "@/src/types/sample";

/**
 * Tracks the additional alternative samples selected by the user
 * to process in bulk along with the current primary sample.
 */
export const selectedProcessableSamplesAtom = atom<Sample[]>([]);

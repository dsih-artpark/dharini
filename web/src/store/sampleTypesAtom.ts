import { atom } from "jotai";
import type { SampleType } from "@/src/types/sample";

export const sampleTypesAtom = atom<SampleType[]>([]);

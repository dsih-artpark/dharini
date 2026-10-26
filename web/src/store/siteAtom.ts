import { atom } from "jotai";
import type { Site } from "@/src/types/site";

export const siteAtom = atom<Site | null>();

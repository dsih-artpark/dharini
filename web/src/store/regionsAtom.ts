import { atom } from "jotai";
import type { Region } from "@/src/types/global";

export const regionsAtom = atom<Region[]>([]);

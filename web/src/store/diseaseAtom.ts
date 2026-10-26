import { atom } from "jotai";
import type { Disease } from "@/src/types/global";

export const diseaseAtom = atom<Disease[]>([]);

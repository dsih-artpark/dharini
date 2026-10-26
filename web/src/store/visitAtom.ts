import { atom } from "jotai";
import type { Visit } from "@/src/types/visit";

export const visitAtom = atom<Visit | null>(null);

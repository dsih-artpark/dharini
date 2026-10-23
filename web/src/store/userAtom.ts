import { atom } from "jotai";
import type { UserProfile } from "@/src/types/user";

export const userAtom = atom<UserProfile | null>(null);

import { atom } from "jotai";
import type { PartnerOrganization } from "@/src/types/global";

export const partnerOrganizationsAtom = atom<PartnerOrganization[]>([]);

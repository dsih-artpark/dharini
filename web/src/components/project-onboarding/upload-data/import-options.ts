import type {
  DiseaseGroup,
  ImportSection,
} from "@/src/app/(dashboard)/project-onboarding/actions";

// `diseases`: the short names a group covers. A project is offered a group
// when it is set up for at least one of them (the backend checks the same).
export const DISEASE_GROUPS: {
  id: DiseaseGroup;
  label: string;
  diseases: string[];
}[] = [
  { id: "FMD_LSD", label: "FMD / LSD", diseases: ["FMD", "LSD"] },
  { id: "AI", label: "Avian Influenza (AI)", diseases: ["AI"] },
];

export const SECTION_LABELS: Record<ImportSection, string> = {
  collection: "Collection Data",
  lab: "Lab Data",
};

export function diseaseGroupLabel(id: DiseaseGroup): string {
  return DISEASE_GROUPS.find((group) => group.id === id)?.label ?? id;
}

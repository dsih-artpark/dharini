import type {
  DiseaseGroup,
  ImportSection,
} from "@/src/app/(dashboard)/project-onboarding/actions";

export const DISEASE_GROUPS: { id: DiseaseGroup; label: string }[] = [
  { id: "FMD_LSD", label: "FMD / LSD" },
  { id: "AI", label: "Avian Influenza (AI)" },
];

export const SECTION_LABELS: Record<ImportSection, string> = {
  collection: "Collection Data",
  lab: "Lab Data",
};

export function diseaseGroupLabel(id: DiseaseGroup): string {
  return DISEASE_GROUPS.find((group) => group.id === id)?.label ?? id;
}

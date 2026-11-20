import { TestResultType } from 'src/common/enums/test-result.enum';

// A lab test only counts as an existing result once it has a final outcome.
// One saved without it (testResult NULL, or 'pending' from an earlier import)
// is still open, so an upload carrying its result must not be rejected as a
// duplicate. Same set the statistics count as a processed sample.
export const FINAL_TEST_RESULTS = [
  TestResultType.POSITIVE,
  TestResultType.NEGATIVE,
  TestResultType.UNCLEAR,
];

export interface RowError {
  row: number; // spreadsheet row number; 0 for a problem with the whole file
  column?: string; // what the message calls the column, e.g. "Tested By"
  // Template column key (the header in the file, e.g. "testedBy"), so the
  // client can point at the exact cell.
  field?: string;
  message: string;
  // Set when the file's columns belong to a different template than the
  // one selected, so the client can offer to switch.
  detectedTemplate?: ImportTemplate;
}

export interface ValidationResult<T> {
  isValid: boolean;
  errors: RowError[];
  rows: T[]; // parsed + validated rows, only meaningful when isValid === true
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  errors: RowError[];
}

export type DiseaseGroup = 'AI' | 'FMD_LSD';
export type ImportSection = 'collection' | 'lab';

export interface ImportTemplate {
  diseaseGroup: DiseaseGroup;
  section: ImportSection;
}

// The diseases (short names) each upload group covers, and its name as the
// upload page's Disease dropdown shows it.
export const DISEASE_GROUPS: Record<
  DiseaseGroup,
  { diseases: string[]; label: string }
> = {
  AI: { diseases: ['AI'], label: 'Avian Influenza (AI)' },
  FMD_LSD: { diseases: ['FMD', 'LSD'], label: 'FMD / LSD' },
};

// Why a project can't take an upload for a disease group, or null when it
// can: the group must be a known one, and the project must be set up for at
// least one of its diseases.
export function diseaseGroupRefusal(
  diseaseGroup: string,
  projectDiseases: string[],
): string | null {
  if (!Object.prototype.hasOwnProperty.call(DISEASE_GROUPS, diseaseGroup)) {
    return `Unknown disease group "${diseaseGroup}". Valid options: ${Object.keys(DISEASE_GROUPS).join(', ')}`;
  }
  const group = DISEASE_GROUPS[diseaseGroup as DiseaseGroup];
  if (!group.diseases.some((disease) => projectDiseases.includes(disease))) {
    return `${group.label} is not configured for this project. Project diseases: ${projectDiseases.join(', ') || 'none'}`;
  }
  return null;
}

// A row naming a disease the project isn't set up for.
export const diseaseNotInProjectMessage = (
  disease: string,
  projectDiseases: string[],
): string =>
  `Disease "${disease}" is not configured for this project. Project diseases: ${projectDiseases.join(', ') || 'none'}`;

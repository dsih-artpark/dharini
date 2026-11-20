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

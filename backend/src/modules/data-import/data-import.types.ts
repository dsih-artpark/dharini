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
  row: number; // 1-based, matches spreadsheet row number (header = row 1)
  column?: string;
  message: string;
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

/**
 * Vaccination status dropdown values per disease.
 *
 * Ground truth: mobile/lib/views/visits/disease_questions_config.dart
 * - FMD/LSD ('vaccinationStage'): 4 values.
 * - AI ('vaccinationStage_AI'): 3 values (NOT a plain yes/no toggle in the live
 *   app, despite the simplified "yes/no" ask — kept aligned with the mobile
 *   questionnaire so imported data matches what the app itself would store).
 */
export const VACCINATION_STATUS_OPTIONS: Record<
  'AI' | 'FMD' | 'LSD',
  string[]
> = {
  AI: ['Vaccinated', 'Not Vaccinated', 'Unknown'],
  FMD: [
    'Vaccinated within 1 year',
    'Vaccinated before 1 year',
    'Not Vaccinated',
    'Unknown',
  ],
  LSD: [
    'Vaccinated within 1 year',
    'Vaccinated before 1 year',
    'Not Vaccinated',
    'Unknown',
  ],
};

export function getVaccinationStatusOptions(
  diseaseShortName: string,
): string[] {
  return (
    VACCINATION_STATUS_OPTIONS[diseaseShortName as 'AI' | 'FMD' | 'LSD'] ?? []
  );
}

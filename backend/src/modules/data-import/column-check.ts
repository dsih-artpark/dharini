import {
  DiseaseGroup,
  ImportSection,
  ImportTemplate,
  RowError,
} from './data-import.types';

const ALL_TEMPLATES: ImportTemplate[] = [
  { diseaseGroup: 'FMD_LSD', section: 'collection' },
  { diseaseGroup: 'FMD_LSD', section: 'lab' },
  { diseaseGroup: 'AI', section: 'collection' },
  { diseaseGroup: 'AI', section: 'lab' },
];

// Same names the upload page uses for its disease and section pickers.
const DISEASE_GROUP_LABELS: Record<DiseaseGroup, string> = {
  FMD_LSD: 'FMD / LSD',
  AI: 'Avian Influenza (AI)',
};
const SECTION_LABELS: Record<ImportSection, string> = {
  collection: 'Collection Data',
  lab: 'Lab Data',
};

// A file at least this close to another template is taken to be that
// template rather than an edited copy of the selected one. Collection and lab
// templates score under 0.1 against each other; FMD/LSD and AI templates for
// the same section 0.5–0.6.
const SAME_TEMPLATE_SIMILARITY = 0.8;

// Column names listed in one message before the rest are summarised.
const MAX_LISTED_COLUMNS = 8;

export function describeTemplate(template: ImportTemplate): string {
  return `${DISEASE_GROUP_LABELS[template.diseaseGroup]} ${SECTION_LABELS[template.section]}`;
}

/**
 * Checks a file's header row against the selected template before any row
 * is validated. With the wrong template or edited columns every row fails
 * the same way, so this reports one file-level error instead and the import
 * stops there. When the columns match a different template, the error names
 * it (and carries it as `detectedTemplate`) so the user can switch.
 */
export function checkColumns(
  headers: string[],
  selected: ImportTemplate,
  headersFor: (template: ImportTemplate) => string[],
): RowError[] {
  const fileHeaders = new Set(headers);
  const expected = headersFor(selected);
  const missing = expected.filter((header) => !fileHeaders.has(header));
  const unexpected = [...fileHeaders].filter(
    (header) => !expected.includes(header),
  );
  if (missing.length === 0 && unexpected.length === 0) return [];

  const selectedSimilarity = similarity(fileHeaders, expected);
  const detected = ALL_TEMPLATES.filter(
    (template) => !isSameTemplate(template, selected),
  )
    .map((template) => ({
      template,
      similarity: similarity(fileHeaders, headersFor(template)),
    }))
    .filter(
      (candidate) =>
        candidate.similarity >= SAME_TEMPLATE_SIMILARITY &&
        candidate.similarity > selectedSimilarity,
    )
    .sort((a, b) => b.similarity - a.similarity)[0];

  if (detected) {
    const detectedName = describeTemplate(detected.template);
    return [
      {
        row: 0,
        message: `This file is for ${detectedName}, but ${describeTemplate(selected)} is selected. Select ${detectedName} and upload again.`,
        detectedTemplate: detected.template,
      },
    ];
  }

  const problems = [
    missing.length > 0 ? `Missing: ${listColumns(missing)}.` : '',
    unexpected.length > 0
      ? `Not in the template: ${listColumns(unexpected)}.`
      : '',
  ].filter(Boolean);
  return [
    {
      row: 0,
      message: `The columns don't match the ${describeTemplate(selected)} template. ${problems.join(' ')} Download the template from this page and keep its columns as they are.`,
    },
  ];
}

// Shared columns over all distinct columns: 1 for the same set, 0 for none
// in common.
function similarity(fileHeaders: Set<string>, templateHeaders: string[]) {
  const shared = templateHeaders.filter((header) =>
    fileHeaders.has(header),
  ).length;
  return shared / (fileHeaders.size + templateHeaders.length - shared);
}

function isSameTemplate(a: ImportTemplate, b: ImportTemplate): boolean {
  return a.diseaseGroup === b.diseaseGroup && a.section === b.section;
}

function listColumns(columns: string[]): string {
  if (columns.length <= MAX_LISTED_COLUMNS) return columns.join(', ');
  const listed = columns.slice(0, MAX_LISTED_COLUMNS).join(', ');
  return `${listed} and ${columns.length - MAX_LISTED_COLUMNS} more`;
}

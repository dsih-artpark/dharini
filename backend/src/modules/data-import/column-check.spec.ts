import { checkColumns } from './column-check';
import { ImportTemplate } from './data-import.types';
import { TemplateService } from './template.service';

const templateService = new TemplateService();
const headersFor = (template: ImportTemplate) =>
  templateService.getHeaders(template.diseaseGroup, template.section);

const FMD_COLLECTION: ImportTemplate = {
  diseaseGroup: 'FMD_LSD',
  section: 'collection',
};
const FMD_LAB: ImportTemplate = { diseaseGroup: 'FMD_LSD', section: 'lab' };
const AI_COLLECTION: ImportTemplate = {
  diseaseGroup: 'AI',
  section: 'collection',
};
const AI_LAB: ImportTemplate = { diseaseGroup: 'AI', section: 'lab' };

describe('checkColumns', () => {
  it.each([FMD_COLLECTION, FMD_LAB, AI_COLLECTION, AI_LAB])(
    'accepts the unchanged %o template',
    (template) => {
      expect(checkColumns(headersFor(template), template, headersFor)).toEqual(
        [],
      );
    },
  );

  it('ignores column order', () => {
    const headers = [...headersFor(FMD_LAB)].reverse();

    expect(checkColumns(headers, FMD_LAB, headersFor)).toEqual([]);
  });

  it('names the template a file belongs to when the section is wrong', () => {
    const errors = checkColumns(
      headersFor(FMD_COLLECTION),
      FMD_LAB,
      headersFor,
    );

    expect(errors).toEqual([
      {
        row: 0,
        message:
          'This file is for FMD / LSD Collection Data, but FMD / LSD Lab Data is selected. Select FMD / LSD Collection Data and upload again.',
        detectedTemplate: FMD_COLLECTION,
      },
    ]);
  });

  it('names the template a file belongs to when the disease is wrong', () => {
    const errors = checkColumns(headersFor(AI_LAB), FMD_LAB, headersFor);

    expect(errors).toEqual([
      expect.objectContaining({ row: 0, detectedTemplate: AI_LAB }),
    ]);
  });

  it('still recognises another template with a column removed', () => {
    const headers = headersFor(FMD_COLLECTION).filter(
      (header) => header !== 'remarks',
    );

    expect(checkColumns(headers, FMD_LAB, headersFor)).toEqual([
      expect.objectContaining({ detectedTemplate: FMD_COLLECTION }),
    ]);
  });

  it('lists missing and extra columns of an edited copy of the selected template', () => {
    const headers = [
      ...headersFor(FMD_LAB).filter((header) => header !== 'testedBy'),
      'labName',
    ];

    expect(checkColumns(headers, FMD_LAB, headersFor)).toEqual([
      {
        row: 0,
        message:
          "The columns don't match the FMD / LSD Lab Data template. Missing: testedBy. Not in the template: labName. Download the template from this page and keep its columns as they are.",
      },
    ]);
  });

  it('summarises long column lists for a file that matches no template', () => {
    const headers = [
      'instituteSampleId',
      ...Array.from({ length: 12 }, (_, index) => `column${index + 1}`),
    ];

    const [error] = checkColumns(headers, FMD_LAB, headersFor);

    expect(error.detectedTemplate).toBeUndefined();
    expect(error.message).toContain(
      'Not in the template: column1, column2, column3, column4, column5, column6, column7, column8 and 4 more.',
    );
    expect(error.message).toContain('Missing: disease, sampleType,');
  });
});

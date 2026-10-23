import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { DiseaseGroup, ImportSection } from './data-import.types';
import { getVaccinationStatusOptions } from './config/vaccination-status.config';
import {
  getHabitatOptions,
  getSiteCategoryOptions,
  SITE_SUB_TYPE_OPTIONS_BY_CATEGORY,
} from './config/site-category.config';

interface ColumnSpec {
  header: string;
  key: string;
  width?: number;
  dropdown?: string[];
}

interface ExampleRow {
  [key: string]: string | number;
}

const YES_NO = ['Yes', 'No'];
const GENDER = ['Male', 'Female', 'Unknown'];
const SAMPLE_CATEGORY = ['Clinical', 'Environmental'];
const TEST_RESULT = ['Positive', 'Negative', 'Unclear', 'Pending'];

// Workspace/project preamble rows sit above the column headers, matching the
// client's existing field-data sheet layout.
const PREAMBLE_ROW_COUNT = 3;
export const HEADER_ROW_NUMBER = PREAMBLE_ROW_COUNT + 1;

@Injectable()
export class TemplateService {
  async generate(
    diseaseGroup: DiseaseGroup,
    section: ImportSection,
    workspaceName = '',
    projectName = '',
  ): Promise<Buffer> {
    const { columns, examples } = this.getSpec(diseaseGroup, section);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    worksheet.addRow(['Workspace Name:', workspaceName]);
    worksheet.addRow(['Project Name:', projectName]);
    worksheet.addRow([]);
    worksheet.getRow(1).getCell(1).font = { bold: true };
    worksheet.getRow(2).getCell(1).font = { bold: true };

    const headerRow = worksheet.addRow(columns.map((c) => c.header));
    headerRow.font = { bold: true };

    columns.forEach((column, index) => {
      worksheet.getColumn(index + 1).width = column.width ?? 20;
    });

    examples.forEach((example) => {
      worksheet.addRow(columns.map((c) => example[c.key] ?? ''));
    });

    const firstDataRow = HEADER_ROW_NUMBER + 1;
    columns.forEach((column, index) => {
      if (!column.dropdown?.length) return;
      for (
        let rowNumber = firstDataRow;
        rowNumber <= firstDataRow + 1000;
        rowNumber += 1
      ) {
        worksheet.getCell(rowNumber, index + 1).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${column.dropdown.join(',')}"`],
          showErrorMessage: true,
          errorStyle: 'error',
          error: `Value must be one of: ${column.dropdown.join(', ')}`,
        };
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private getSpec(
    diseaseGroup: DiseaseGroup,
    section: ImportSection,
  ): { columns: ColumnSpec[]; examples: ExampleRow[] } {
    if (diseaseGroup === 'FMD_LSD' && section === 'collection') {
      return this.fmdLsdCollectionSpec();
    }
    if (diseaseGroup === 'FMD_LSD' && section === 'lab') {
      return this.fmdLsdLabSpec();
    }
    if (diseaseGroup === 'AI' && section === 'collection') {
      return this.aiCollectionSpec();
    }
    return this.aiLabSpec();
  }

  private fmdLsdCollectionSpec() {
    const vaccinationOptions = [
      ...new Set([
        ...getVaccinationStatusOptions('FMD'),
        ...getVaccinationStatusOptions('LSD'),
      ]),
    ];
    const siteCategoryOptions = [
      ...new Set([
        ...getSiteCategoryOptions('FMD'),
        ...getSiteCategoryOptions('LSD'),
      ]),
    ];
    const habitatOptions = getHabitatOptions();

    const columns: ColumnSpec[] = [
      { header: 'instituteSampleId', key: 'instituteSampleId' },
      { header: 'collectorName', key: 'collectorName' },
      { header: 'collectorEmail', key: 'collectorEmail' },
      {
        header: 'visitOrCollectionDate',
        key: 'visitOrCollectionDate',
        width: 18,
      },
      { header: 'siteName', key: 'siteName' },
      {
        header: 'siteCategory',
        key: 'siteCategory',
        dropdown: siteCategoryOptions,
      },
      { header: 'habitat', key: 'habitat', dropdown: habitatOptions },
      { header: 'state', key: 'state' },
      { header: 'district', key: 'district' },
      { header: 'villageOrLocality', key: 'villageOrLocality' },
      { header: 'latitude', key: 'latitude' },
      { header: 'longitude', key: 'longitude' },
      // A sample can be relevant to both diseases — pick "FMD & LSD" for those
      // ("&" not "," since the dropdown list itself is comma-delimited).
      {
        header: 'disease',
        key: 'disease',
        dropdown: ['FMD', 'LSD', 'FMD & LSD'],
      },
      {
        header: 'sampleCategory',
        key: 'sampleCategory',
        dropdown: SAMPLE_CATEGORY,
      },
      { header: 'species', key: 'species' },
      { header: 'speciesHeadcountAtSite', key: 'speciesHeadcountAtSite' },
      { header: 'totalAnimalsAtSite', key: 'totalAnimalsAtSite' },
      { header: 'animalIdentifier', key: 'animalIdentifier' },
      { header: 'breed', key: 'breed' },
      { header: 'ageYears', key: 'ageYears' },
      { header: 'ageMonths', key: 'ageMonths' },
      { header: 'gender', key: 'gender', dropdown: GENDER },
      {
        header: 'vaccinationStatus',
        key: 'vaccinationStatus',
        dropdown: vaccinationOptions,
      },
      { header: 'diseaseHistory', key: 'diseaseHistory' },
      { header: 'feverObserved', key: 'feverObserved', dropdown: YES_NO },
      { header: 'firstNoticedDate', key: 'firstNoticedDate', width: 18 },
      {
        header: 'averageMilkProductionPerDayWithinOneYear',
        key: 'averageMilkProductionPerDayWithinOneYear',
        width: 30,
      },
      {
        header: 'averageMilkProductionPerDayBeforeOneYear',
        key: 'averageMilkProductionPerDayBeforeOneYear',
        width: 30,
      },
      { header: 'vectors', key: 'vectors' },
      {
        header: 'environmentalSourceDescription',
        key: 'environmentalSourceDescription',
        width: 30,
      },
      { header: 'sampleType', key: 'sampleType' },
      { header: 'sampleQuantity', key: 'sampleQuantity' },
      { header: 'unit', key: 'unit' },
      { header: 'remarks', key: 'remarks', width: 40 },
    ];

    const examples: ExampleRow[] = [
      {
        instituteSampleId: 'EXAMPLE-NCL-2021-0456',
        collectorName: 'Dr. R. Patel',
        collectorEmail: 'r.patel@example.com',
        visitOrCollectionDate: '2021-06-14',
        siteName: 'Narsapur Farm',
        siteCategory: 'Cattle Farm',
        habitat: '',
        state: 'Gujarat',
        district: 'Ahmedabad',
        villageOrLocality: 'Sanand',
        latitude: 23.05,
        longitude: 72.35,
        disease: 'FMD',
        sampleCategory: 'Clinical',
        species: 'Cattle',
        speciesHeadcountAtSite: 24,
        totalAnimalsAtSite: 30,
        animalIdentifier: 'A123',
        breed: 'Cross-bred',
        ageYears: 2,
        ageMonths: '',
        gender: 'Male',
        vaccinationStatus: 'Vaccinated within 1 year',
        diseaseHistory: 'No history',
        feverObserved: 'Yes',
        firstNoticedDate: '2021-06-12',
        averageMilkProductionPerDayWithinOneYear: 8,
        averageMilkProductionPerDayBeforeOneYear: 10,
        vectors: 'Ticks, Flies',
        environmentalSourceDescription: '',
        sampleType: 'Nasal Swab',
        sampleQuantity: 3,
        unit: 'mL',
        remarks: 'DELETE THIS ROW - example only.',
      },
      {
        instituteSampleId: 'EXAMPLE-NCL-2021-0457',
        collectorName: 'Dr. R. Patel',
        collectorEmail: 'r.patel@example.com',
        visitOrCollectionDate: '2021-06-14',
        siteName: 'Narsapur Farm',
        siteCategory: 'Cattle Farm',
        habitat: 'Wetland',
        state: 'Gujarat',
        district: 'Ahmedabad',
        villageOrLocality: 'Sanand',
        latitude: 23.05,
        longitude: 72.35,
        disease: 'FMD',
        sampleCategory: 'Environmental',
        environmentalSourceDescription: 'Effluent drain water near cattle shed',
        sampleType: 'Drinking Water',
        sampleQuantity: 500,
        unit: 'mL',
        remarks: 'DELETE THIS ROW - example only. Environmental sample.',
      },
    ];

    return { columns, examples };
  }

  private fmdLsdLabSpec() {
    const columns: ColumnSpec[] = [
      { header: 'instituteSampleId', key: 'instituteSampleId' },
      {
        header: 'disease',
        key: 'disease',
        dropdown: ['FMD', 'LSD', 'FMD & LSD'],
      },
      { header: 'sampleType', key: 'sampleType' },
      { header: 'sampleReceivedDate', key: 'sampleReceivedDate', width: 18 },
      { header: 'nucleicAcidType', key: 'nucleicAcidType' },
      { header: 'testMethodUsed', key: 'testMethodUsed' },
      { header: 'testResult', key: 'testResult', dropdown: TEST_RESULT },
      { header: 'ctValue', key: 'ctValue' },
      { header: 'viralLoad', key: 'viralLoad' },
      { header: 'strainOrSerotype', key: 'strainOrSerotype' },
      { header: 'resultDate', key: 'resultDate', width: 18 },
      { header: 'testedBy', key: 'testedBy' },
      { header: 'remarks', key: 'remarks', width: 40 },
    ];

    const examples: ExampleRow[] = [
      {
        instituteSampleId: 'EXAMPLE-NCL-2021-0456',
        disease: 'FMD',
        sampleType: 'Nasal Swab',
        sampleReceivedDate: '2021-06-15',
        nucleicAcidType: 'RNA',
        testMethodUsed: 'PCR',
        testResult: 'Positive',
        ctValue: 24.5,
        viralLoad: '1.2 x 10^6 copies/mL',
        strainOrSerotype: 'O',
        resultDate: '2021-06-20',
        testedBy: 'Dr. S. Mehta',
        remarks: 'DELETE THIS ROW - example only.',
      },
    ];

    return { columns, examples };
  }

  private aiCollectionSpec() {
    const vaccinationOptions = getVaccinationStatusOptions('AI');
    const siteCategoryOptions = getSiteCategoryOptions('AI');
    const habitatOptions = getHabitatOptions();
    const siteSubTypeOptions =
      SITE_SUB_TYPE_OPTIONS_BY_CATEGORY['Poultry Farm'];

    const columns: ColumnSpec[] = [
      { header: 'instituteSampleId', key: 'instituteSampleId' },
      { header: 'collectorName', key: 'collectorName' },
      { header: 'collectorEmail', key: 'collectorEmail' },
      {
        header: 'visitOrCollectionDate',
        key: 'visitOrCollectionDate',
        width: 18,
      },
      { header: 'siteName', key: 'siteName' },
      {
        header: 'siteCategory',
        key: 'siteCategory',
        dropdown: siteCategoryOptions,
      },
      {
        header: 'siteSubType',
        key: 'siteSubType',
        dropdown: siteSubTypeOptions,
      },
      { header: 'habitat', key: 'habitat', dropdown: habitatOptions },
      { header: 'state', key: 'state' },
      { header: 'district', key: 'district' },
      { header: 'villageOrLocality', key: 'villageOrLocality' },
      { header: 'latitude', key: 'latitude' },
      { header: 'longitude', key: 'longitude' },
      { header: 'disease', key: 'disease', dropdown: ['AI'] },
      {
        header: 'sampleCategory',
        key: 'sampleCategory',
        dropdown: SAMPLE_CATEGORY,
      },
      { header: 'numberOfSheds', key: 'numberOfSheds' },
      { header: 'shedCapacity', key: 'shedCapacity' },
      { header: 'birdsInShed', key: 'birdsInShed' },
      { header: 'farmCapacity', key: 'farmCapacity' },
      { header: 'farmSize', key: 'farmSize' },
      {
        header: 'mortalityObservedInShed',
        key: 'mortalityObservedInShed',
        dropdown: YES_NO,
      },
      { header: 'species', key: 'species' },
      { header: 'speciesHeadcountAtSite', key: 'speciesHeadcountAtSite' },
      { header: 'totalAnimalsAtSite', key: 'totalAnimalsAtSite' },
      { header: 'birdId', key: 'birdId' },
      { header: 'breed', key: 'breed' },
      { header: 'ageYears', key: 'ageYears' },
      { header: 'ageMonths', key: 'ageMonths' },
      {
        header: 'vaccinationStatus',
        key: 'vaccinationStatus',
        dropdown: vaccinationOptions,
      },
      { header: 'dropInFeedIntake', key: 'dropInFeedIntake', dropdown: YES_NO },
      {
        header: 'dropInWaterIntake',
        key: 'dropInWaterIntake',
        dropdown: YES_NO,
      },
      {
        header: 'dropInEggProduction',
        key: 'dropInEggProduction',
        dropdown: YES_NO,
      },
      {
        header: 'environmentalSourceDescription',
        key: 'environmentalSourceDescription',
        width: 30,
      },
      { header: 'sampleType', key: 'sampleType' },
      { header: 'sampleQuantity', key: 'sampleQuantity' },
      { header: 'unit', key: 'unit' },
      { header: 'remarks', key: 'remarks', width: 40 },
    ];

    const examples: ExampleRow[] = [
      {
        instituteSampleId: 'EXAMPLE-AI-2022-0101',
        collectorName: 'Dr. K. Rao',
        collectorEmail: 'k.rao@example.com',
        visitOrCollectionDate: '2022-01-10',
        siteName: 'Sunrise Poultry Farm',
        siteCategory: 'Poultry Farm',
        siteSubType: 'Layer',
        habitat: '',
        state: 'Maharashtra',
        district: 'Pune',
        villageOrLocality: 'Baramati',
        latitude: 18.15,
        longitude: 74.58,
        disease: 'AI',
        sampleCategory: 'Clinical',
        numberOfSheds: 4,
        shedCapacity: 5000,
        birdsInShed: 4800,
        farmCapacity: 20000,
        farmSize: '2 acres',
        mortalityObservedInShed: 'Yes',
        species: 'Chicken',
        speciesHeadcountAtSite: 4800,
        totalAnimalsAtSite: 4800,
        birdId: 'B-2201',
        breed: 'White Leghorn',
        ageMonths: 8,
        vaccinationStatus: 'Not Vaccinated',
        dropInFeedIntake: 'Yes',
        dropInWaterIntake: 'Yes',
        dropInEggProduction: 'Yes',
        sampleType: 'Tracheal Swab',
        sampleQuantity: 1,
        unit: 'swab',
        remarks: 'DELETE THIS ROW - example only.',
      },
      {
        instituteSampleId: 'EXAMPLE-AI-2022-0102',
        collectorName: 'Dr. K. Rao',
        collectorEmail: 'k.rao@example.com',
        visitOrCollectionDate: '2022-01-11',
        siteName: 'Baramati Live Bird Market',
        siteCategory: 'Live Bird Market',
        state: 'Maharashtra',
        district: 'Pune',
        villageOrLocality: 'Baramati',
        latitude: 18.16,
        longitude: 74.59,
        disease: 'AI',
        sampleCategory: 'Environmental',
        habitat: 'Live Bird Market',
        environmentalSourceDescription: 'Cage floor swab pooled from 5 stalls',
        sampleType: 'Surface Scrap',
        sampleQuantity: 1,
        unit: 'swab',
        remarks: 'DELETE THIS ROW - example only.',
      },
    ];

    return { columns, examples };
  }

  private aiLabSpec() {
    const columns: ColumnSpec[] = [
      { header: 'instituteSampleId', key: 'instituteSampleId' },
      { header: 'disease', key: 'disease', dropdown: ['AI'] },
      { header: 'sampleType', key: 'sampleType' },
      { header: 'sampleReceivedDate', key: 'sampleReceivedDate', width: 18 },
      {
        header: 'virusIsolationPerformed',
        key: 'virusIsolationPerformed',
        dropdown: YES_NO,
      },
      { header: 'inoculationDate', key: 'inoculationDate', width: 18 },
      { header: 'harvestingDate', key: 'harvestingDate', width: 18 },
      { header: 'hValue', key: 'hValue' },
      { header: 'nValue', key: 'nValue' },
      {
        header: 'ndvPresent',
        key: 'ndvPresent',
        dropdown: ['Positive', 'Negative'],
      },
      { header: 'haTitre', key: 'haTitre' },
      { header: 'hiTitre', key: 'hiTitre' },
      { header: 'allantoicFluidVolume', key: 'allantoicFluidVolume' },
      { header: 'allantoicFluidVolumeUnit', key: 'allantoicFluidVolumeUnit' },
      { header: 'nucleicAcidType', key: 'nucleicAcidType' },
      { header: 'testMethodUsed', key: 'testMethodUsed' },
      { header: 'targetGene', key: 'targetGene' },
      { header: 'testResult', key: 'testResult', dropdown: TEST_RESULT },
      { header: 'ctValue', key: 'ctValue' },
      { header: 'viralLoad', key: 'viralLoad' },
      { header: 'subtypeOrVariant', key: 'subtypeOrVariant' },
      { header: 'resultDate', key: 'resultDate', width: 18 },
      { header: 'testedBy', key: 'testedBy' },
      { header: 'remarks', key: 'remarks', width: 40 },
    ];

    const examples: ExampleRow[] = [
      {
        instituteSampleId: 'EXAMPLE-AI-2022-0101',
        disease: 'AI',
        sampleType: 'Tracheal Swab',
        sampleReceivedDate: '2022-01-11',
        virusIsolationPerformed: 'Yes',
        inoculationDate: '2022-01-12',
        harvestingDate: '2022-01-15',
        hValue: 'H5',
        nValue: 'N1',
        ndvPresent: 'Negative',
        haTitre: '1:64',
        hiTitre: '1:32',
        allantoicFluidVolume: 0.8,
        allantoicFluidVolumeUnit: 'mL',
        nucleicAcidType: 'RNA',
        testMethodUsed: 'PCR',
        targetGene: 'M gene',
        testResult: 'Positive',
        ctValue: 19.8,
        viralLoad: '2.1 x 10^7 copies/mL',
        subtypeOrVariant: 'H5N1',
        resultDate: '2022-01-16',
        testedBy: 'Dr. S. Iyer',
        remarks: 'DELETE THIS ROW - example only.',
      },
      {
        instituteSampleId: 'EXAMPLE-AI-2022-0102',
        disease: 'AI',
        sampleType: 'Surface Scrap',
        sampleReceivedDate: '2022-01-12',
        virusIsolationPerformed: 'No',
        nucleicAcidType: 'RNA',
        testMethodUsed: 'PCR',
        targetGene: 'M gene',
        testResult: 'Negative',
        resultDate: '2022-01-14',
        testedBy: 'Dr. S. Iyer',
        remarks: 'DELETE THIS ROW - example only.',
      },
    ];

    return { columns, examples };
  }
}

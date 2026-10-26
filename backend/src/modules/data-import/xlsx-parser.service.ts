import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

/**
 * Reads the first worksheet of an uploaded .xlsx template into plain row
 * objects keyed by header, skipping the workspace/project preamble rows and
 * the instructional "DELETE THIS ROW" example rows shipped in every template.
 */
@Injectable()
export class XlsxParserService {
  async parseRows(buffer: Buffer): Promise<Record<string, any>[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error('No worksheet found in the uploaded file');
    }

    // Located by content rather than a fixed offset so files re-saved with
    // extra preamble rows still parse.
    let headerRowNumber = 0;
    worksheet.eachRow((row, rowNumber) => {
      if (headerRowNumber) return;
      const values = (row.values as ExcelJS.CellValue[]).map((v) =>
        String(v ?? '').trim(),
      );
      if (values.includes('instituteSampleId')) headerRowNumber = rowNumber;
    });
    if (!headerRowNumber) {
      throw new Error(
        'Could not find the header row (expected a column named "instituteSampleId")',
      );
    }

    const headers: string[] = [];
    worksheet.getRow(headerRowNumber).eachCell((cell, colNumber) => {
      headers[colNumber - 1] = cell.value?.toString().trim() || '';
    });

    const rows: Record<string, any>[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= headerRowNumber) return;

      const rowData: Record<string, any> & { __row: number } = {
        __row: rowNumber,
      };
      let isEmpty = true;
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const header = headers[colNumber - 1];
        if (!header) return;
        const value = this.cellToString(cell.value);
        if (value !== undefined && value !== '') isEmpty = false;
        rowData[header] = value;
      });

      if (isEmpty) return;

      const remarks = String(rowData['remarks'] ?? '');
      if (remarks.toUpperCase().startsWith('DELETE THIS ROW')) return;

      rows.push(rowData);
    });

    return rows;
  }

  private cellToString(value: ExcelJS.CellValue): string | undefined {
    if (value === null || value === undefined) return undefined;
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (typeof value === 'object' && 'text' in (value as any)) {
      return this.emptyToUndefined(String((value as any).text));
    }
    if (typeof value === 'object' && 'result' in (value as any)) {
      return this.emptyToUndefined(String((value as any).result));
    }
    return this.emptyToUndefined(String(value).trim());
  }

  // A "blank" cell can round-trip as either a truly empty cell (`null`) or a
  // literal empty string, depending on how it was cleared in Excel/Sheets —
  // indistinguishable to a human looking at the sheet, but `@IsOptional()`
  // only treats `null`/`undefined` as "not provided", not `''`. Normalizing
  // here, at the single point every cell value passes through, means every
  // optional DTO field behaves consistently regardless of which way a cell
  // happened to get cleared.
  private emptyToUndefined(value: string): string | undefined {
    return value.trim() === '' ? undefined : value;
  }
}

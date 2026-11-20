import type { CellValue } from "exceljs";

const HEADER_MARKER = "instituteSampleId";

export type ImportPreviewRow = {
  // Spreadsheet row number, the same one the server's "Row N" errors use.
  rowNumber: number;
  cells: string[];
};

export type ImportPreview = {
  sheetName: string;
  headers: string[];
  rows: ImportPreviewRow[];
};

/**
 * Reads a template .xlsx in the browser the way the backend's
 * XlsxParserService does: first worksheet, header row found by its
 * `instituteSampleId` column, then every non-empty row below it except the
 * template's "DELETE THIS ROW" examples. Keep the two in step so the preview
 * shows exactly the rows the server will validate.
 */
export async function parseImportPreview(file: File): Promise<ImportPreview> {
  // Loaded on demand: exceljs is large and only this preview needs it.
  const exceljs = await import("exceljs");
  const { Workbook } =
    (exceljs as unknown as { default?: typeof exceljs }).default ?? exceljs;

  const workbook = new Workbook();
  try {
    await workbook.xlsx.load(await file.arrayBuffer());
  } catch {
    throw new Error("This file couldn't be read as an .xlsx spreadsheet.");
  }

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("This file has no worksheet.");
  }

  let headerRowNumber = 0;
  worksheet.eachRow((row, rowNumber) => {
    if (headerRowNumber) return;
    const values = (row.values as CellValue[]).map((value) =>
      String(value ?? "").trim()
    );
    if (values.includes(HEADER_MARKER)) headerRowNumber = rowNumber;
  });
  if (!headerRowNumber) {
    throw new Error(
      `Couldn't find the header row (a column named "${HEADER_MARKER}"). Use the template downloaded from this page.`
    );
  }

  const headers: string[] = [];
  const columnNumbers: number[] = [];
  worksheet.getRow(headerRowNumber).eachCell((cell, columnNumber) => {
    const header = cell.value?.toString().trim();
    if (!header) return;
    headers.push(header);
    columnNumbers.push(columnNumber);
  });
  const remarksIndex = headers.indexOf("remarks");

  const rows: ImportPreviewRow[] = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowNumber) return;

    const cells = columnNumbers.map((columnNumber) =>
      cellToText(row.getCell(columnNumber).value)
    );
    if (cells.every((cell) => cell === "")) return;
    if (
      remarksIndex >= 0 &&
      cells[remarksIndex].toUpperCase().startsWith("DELETE THIS ROW")
    ) {
      return;
    }

    rows.push({ rowNumber, cells });
  });

  return { sheetName: worksheet.name, headers, rows };
}

function cellToText(value: CellValue): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "object") {
    if ("richText" in value) {
      return value.richText
        .map((run) => run.text)
        .join("")
        .trim();
    }
    // Hyperlink cells.
    if ("text" in value) return cellToText(value.text as CellValue);
    // Formula cells show their last computed result.
    if ("result" in value) return cellToText(value.result as CellValue);
    if ("error" in value) return String(value.error);
  }
  return String(value).trim();
}

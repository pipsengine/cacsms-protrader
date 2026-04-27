// System Config Repository: Handles System_Config sheet logic
import { getSheetData } from '../../../services/data-source/google-sheets.service';
import { parseSystemConfigRows } from '../../../services/data-source/sheet-parser.service';
import { validateSystemConfigRow } from '../../../services/data-source/sheet-validator.service';

export async function getSystemConfig() {
  const values = await getSheetData('System_Config', 'A1:G100');
  const parsed = parseSystemConfigRows(values);
  return parsed
    .map(row => validateSystemConfigRow(row))
    .filter(r => r.valid)
    .map(r => r.data);
}

// Sheet Parser Service: Parses and normalizes sheet data
import { SystemConfigRow } from '../../types/protrader-data-source.types';

export function parseSystemConfigRows(values: any[][]): SystemConfigRow[] {
  if (!values || values.length < 2) return [];
  const [header, ...rows] = values;
  return rows.map(row => {
    const obj: any = {};
    header.forEach((key: string, idx: number) => {
      obj[key] = row[idx];
    });
    return obj as SystemConfigRow;
  });
}

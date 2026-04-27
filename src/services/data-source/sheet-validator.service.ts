// Sheet Validator Service: Validates sheet data against schemas
import { SystemConfigRow } from '../../types/protrader-data-source.types';
import { isRequired, isNumber, isBoolean, isDate } from '../../utils/validation';

export function validateSystemConfigRow(row: any): { valid: boolean; errors: string[]; data?: SystemConfigRow } {
  const errors: string[] = [];
  if (!isRequired(row.config_key)) errors.push('config_key is required');
  if (!isRequired(row.config_value)) errors.push('config_value is required');
  if (!isRequired(row.data_type)) errors.push('data_type is required');
  if (!isRequired(row.is_active) || !isBoolean(row.is_active)) errors.push('is_active must be boolean');
  if (!isRequired(row.updated_at) || !isDate(row.updated_at)) errors.push('updated_at must be a valid date');
  // Add more rules as needed
  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? row as SystemConfigRow : undefined,
  };
}

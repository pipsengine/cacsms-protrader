// Validation Utilities: Common validation helpers
export function isRequired(value: any): boolean {
  return value !== undefined && value !== null && value !== '';
}

export function isNumber(value: any): boolean {
  return !isNaN(Number(value));
}

export function isBoolean(value: any): boolean {
  return value === true || value === false || value === 'true' || value === 'false';
}

export function isDate(value: any): boolean {
  return !isNaN(Date.parse(value));
}

// Logger Utility: Centralized logging for errors, warnings, info
export function logInfo(message: string, ...args: any[]) {
  console.info('[INFO]', message, ...args);
}

export function logWarn(message: string, ...args: any[]) {
  console.warn('[WARN]', message, ...args);
}

export function logError(message: string, ...args: any[]) {
  console.error('[ERROR]', message, ...args);
}

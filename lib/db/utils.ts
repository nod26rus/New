export function getTodayDateStr(): string {
  const date = new Date()
  return date.toISOString().split('T')[0]
}

export function formatDateStr(date: Date): string {
  return date.toISOString().split('T')[0]
}
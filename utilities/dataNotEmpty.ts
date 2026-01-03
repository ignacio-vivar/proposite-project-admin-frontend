export function isDataNotEmptyObject<T extends object>(data: T[]): boolean {
  return Array.isArray(data) && data.length > 0;
}
export function isDataNotEmpty<T extends object>(data: T): boolean {
  return Array.isArray(data) && data.length > 0;
}

export function isObjectNotEmpty<T extends object>(data: T): boolean {
  return Object.keys(data).length > 0;
}

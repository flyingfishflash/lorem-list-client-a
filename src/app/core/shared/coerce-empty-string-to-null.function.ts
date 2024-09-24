export function coerceEmptyStringToNull(
  value: string | null | undefined,
): string | null {
  return value === '' ? null : (value ?? null);
}

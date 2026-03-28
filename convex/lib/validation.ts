export function requireNonEmptyString(
  field: string,
  value: string,
  maxLength: number
): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${field} is required`);
  }
  if (trimmed.length > maxLength) {
    throw new Error(`${field} must be at most ${maxLength} characters`);
  }
  return trimmed;
}

export function requirePositivePrice(price: number): void {
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("price must be a positive number");
  }
}

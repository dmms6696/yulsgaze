export function clamp(value: number, min = 0, max = 100) {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

export function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

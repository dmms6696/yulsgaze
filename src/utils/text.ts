export function formatDelta(delta: number) {
  if (delta > 0) {
    return `+${delta}`;
  }
  return String(delta);
}

export function compactText(text: string, maxLength = 80) {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1)}…`;
}

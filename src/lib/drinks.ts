import drinks from "./drinks.json";

const byLabel = new Map(
  Object.values(drinks).flat().map(d => [d.label, d])
);

export function getCaffeine(label: string): number {
  return byLabel.get(label)?.caffeine ?? 0;
}

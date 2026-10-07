import drinks from "./drinks.json";

type DrinkInfo = { label: string; caffeine: number; sfOnly?: boolean; category: string };

const byLabel = new Map<string, DrinkInfo>(
  Object.entries(drinks).flatMap(([category, items]) =>
    items.map((d) => [d.label, { ...d, category }] as const),
  ),
);

export function getCaffeine(label: string): number {
  return byLabel.get(label)?.caffeine ?? 0;
}

export function normalizePick(pick: unknown): { label: string; sf: boolean } | null {
  if (typeof pick !== "object" || pick === null) return null;
  const { label, sf } = pick as { label?: unknown; sf?: unknown };
  if (typeof label !== "string") return null;
  const info = byLabel.get(label);
  if (!info) return null;
  if (info.sfOnly) return { label, sf: true };
  return { label, sf: info.category === "redbull" && sf === true };
}

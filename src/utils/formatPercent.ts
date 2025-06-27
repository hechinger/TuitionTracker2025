export function formatPercent(value: number) {
  const pct = value.toLocaleString(undefined, {
    style: "percent",
    maximumFractionDigits: 0,
  });
  if (pct === "0%" && value > 0) return "<1%";
  return pct;
}

export function getValueIdSet({
  rows,
  columns,
}: {
  rows: Record<string, unknown>[];
  columns?: string[];
}) {
  const [firstItem] = rows;

  if (!firstItem) return "()";

  const cols = columns || Object.keys(firstItem);
  const nRows = rows.length;
  const nCols = cols.length;

  return [...Array(nRows)].map((_, row) => {
    const base = (row * nCols) + 1;
    const ids = [...Array(nCols)].map((_, col) => `$${base + col}`);
    return `(${ids.join(", ")})`;
  }).join(", ");
};

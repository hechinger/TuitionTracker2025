export function formatDollars(
  price: number,
  opts: {
    round?: boolean;
    abbreviate?: boolean;
  } = {},
) {
  if (!price) return "$0";

  const {
    round = true,
    abbreviate = false,
  } = opts;

  const string = price.toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: round ? 0 : 2,
    },
  );

  if (!abbreviate) return string;
  return string.replace(/,000$/, "K");
}

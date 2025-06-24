export function formatDollars(
  price: number,
  opts: {
    round?: boolean;
  } = {},
) {
  if (!price) return "$0";

  const {
    round = true,
  } = opts;

  return price.toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: round ? 0 : 2,
    },
  );
}

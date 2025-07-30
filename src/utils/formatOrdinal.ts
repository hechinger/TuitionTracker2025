const lowDigits = [
  "zeroeth",
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "10th",
  "11th",
  "12th",
  "13th",
];

const digitSuffixes = new Map([
  ["1", "st"],
  ["2", "nd"],
  ["3", "rd"],
]);

export function formatOrdinal(n: number) {
  if (n < lowDigits.length) return lowDigits[n];
  const lastDigit = `${n}`.at(-1) || "";
  const suffix = digitSuffixes.get(lastDigit) || "th";
  return `${n.toLocaleString()}${suffix}`;
}

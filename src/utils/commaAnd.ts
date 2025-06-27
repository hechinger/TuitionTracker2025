export function commaAnd(items: string[], opts: {
  and?: string;
  comma?: string;
  oxfordComma?: boolean;
} = {}) {
  const {
    and = "and",
    comma = ",",
    oxfordComma = false,
  } = opts;

  const oxfordAnd = oxfordComma ? `${comma} ${and} ` : ` ${and} `;
  const first = items.slice(0, items.length - 1);

  return [
    first.join(`${comma} `),
    items[items.length - 1],
  ].join(oxfordAnd);
}

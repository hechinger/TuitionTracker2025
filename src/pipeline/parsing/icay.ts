import type { ParseContext } from "../utils/parseIpedsFile";

export type RowICAY = {
  CHG2AY3: string;
  CHG3AY3: string;
  CHG4AY3: string;
  CHG5AY3: string;
  CHG6AY3: string;
  CHG7AY3: string;
  CHG8AY3: string;
};

export const parseICAY = (
  years: RowICAY[][],
  { year: baseYear }: ParseContext,
) => {
  let numOnCampus = 0;
  let numOffCampus = 0;

  const yearData = years.map(([year], i) => {
    const yearNumber = baseYear - i;

    const chg2ay3 = parseInt(year.CHG2AY3, 10) || null;
    const chg3ay3 = parseInt(year.CHG3AY3, 10) || null;
    const chg4ay3 = parseInt(year.CHG4AY3, 10) || 0;
    const chg5ay3 = parseInt(year.CHG5AY3, 10) || null;
    const chg6ay3 = parseInt(year.CHG6AY3, 10) || null;
    const chg7ay3 = parseInt(year.CHG7AY3, 10) || null;
    const chg8ay3 = parseInt(year.CHG8AY3, 10) || null;

    const sumNull = (...ns: (number | null)[]) => ns.reduce((a, b) => {
      if (!a && a !== 0) return null;
      if (!b && b !== 0) return null;
      return a + b;
    }, 0);

    const inStateOnCampus = sumNull(chg2ay3, chg4ay3, chg5ay3, chg6ay3);
    const inStateOffCampus = sumNull(chg2ay3, chg4ay3, chg7ay3, chg8ay3);
    const outStateOnCampus = sumNull(chg3ay3, chg4ay3, chg5ay3, chg6ay3);
    const outStateOffCampus = sumNull(chg3ay3, chg4ay3, chg7ay3, chg8ay3);

    if (inStateOnCampus) {
      numOnCampus += 1;
    }

    if (inStateOffCampus) {
      numOffCampus += 1;
    }

    return {
      year: yearNumber,
      prices: {
        inStateOnCampus,
        inStateOffCampus,
        outStateOnCampus,
        outStateOffCampus,
      },
    };
  });

  const type = (numOnCampus >= numOffCampus) ? "on-campus" : "off-campus";

  return {
    stickerPriceYears: yearData.map((year) => ({
      ...year,
      prices: {
        type,
        price: (type === "on-campus") ? year.prices.inStateOnCampus : year.prices.inStateOffCampus,
        priceOutState: (type === "on-campus") ? year.prices.outStateOnCampus : year.prices.outStateOffCampus,
      },
    })),
  };
};

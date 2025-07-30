import type { SchoolData } from "./types";

type ParseContext = {
  year: number;
};

/**
 * This function takes the combination of all of the parsed data for one
 * school at a time and synthesizes that into one final representation
 * of the school. This is the step where we can do things like project
 * out net and sticker price, filter out price data for schools that don't
 * have enough years available, etc.
 */
export const synthesize = (
  school: SchoolData,
  { year: baseYear }: ParseContext,
) => {
  const {
    stickerPriceYears,
    netPriceYears,
    ...restSchool
  } = school;

  if (!school.id) return null;

  try {
    // we keep track of the "discount" for each income bracket
    const minMaxDiscounts = {
      average: {
        min: undefined as (number | undefined),
        max: undefined as (number | undefined),
      },
      "0_30000": {
        min: undefined as (number | undefined),
        max: undefined as (number | undefined),
      },
      "30001_48000": {
        min: undefined as (number | undefined),
        max: undefined as (number | undefined),
      },
      "48001_75000": {
        min: undefined as (number | undefined),
        max: undefined as (number | undefined),
      },
      "75001_110000": {
        min: undefined as (number | undefined),
        max: undefined as (number | undefined),
      },
      "110001": {
        min: undefined as (number | undefined),
        max: undefined as (number | undefined),
      },
    };

    // we keep track of which years this school has so that we know if
    // it has enough price data to include
    const startYears = new Set();

    const years = stickerPriceYears.map((stickerYear, i) => {
      const yearNum = baseYear - i;
      const netYear = netPriceYears[i - 1];

      const stickerPrice = stickerYear.prices;
      const sticker = stickerPrice.price;

      const getNetPrice = (bracket: keyof typeof minMaxDiscounts) => {
        if (!netYear) {
          return {
            price: null,
          } as {
            price: number | null;
            discount?: number;
            min?: number;
            max?: number;
          };
        }

        const netPrice = netYear.prices[bracket];
        const discount = netPrice / sticker!;
        const { min, max } = minMaxDiscounts[bracket];

        if (min === undefined || discount < min) {
          minMaxDiscounts[bracket].min = discount;
        }

        if (max === undefined || discount > max) {
          minMaxDiscounts[bracket].max = discount;
        }

        return {
          price: netPrice,
          discount,
          min: undefined,
          max: undefined,
        } as {
          price: number | null;
          discount?: number;
          min?: number;
          max?: number;
        };
      };

      const avgPrice = getNetPrice("average");

      // We count this year as having price data if it includes both the
      // sticker price and the average net price. IPEDS won't have the net
      // price for the most recent year, so we overlook that one.
      if (stickerPrice && (avgPrice.price || i === 0)) {
        startYears.add(yearNum);
      }

      return {
        year: `${(yearNum).toString().slice(2)}-${(yearNum + 1).toString().slice(2)}`,
        startYear: yearNum,
        stickerPrice,
        netPricesByBracket: {
          average: avgPrice,
          "0_30000": getNetPrice("0_30000"),
          "30001_48000": getNetPrice("30001_48000"),
          "48001_75000": getNetPrice("48001_75000"),
          "75001_110000": getNetPrice("75001_110000"),
          "110001": getNetPrice("110001"),
        },
      };
    });

    // Here we're making sure the school has the 7 most recent years worth of
    // price data.
    const needYears = new Set([...Array(7)].map((_, i) => baseYear - i));
    const hasEnoughData = startYears.intersection(needYears).size >= needYears.size;

    const nullMult = (
      a: number | null = null,
      b: number | null = null,
    ) => {
      if (!a && a !== 0) return null;
      if (!b && b !== 0) return null;
      return a * b;
    };

    // Because IPEDS doesn't have net price information for the latest year,
    // we calculate it based on the previous year's discount from the sticker
    // price.
    if (hasEnoughData) {
      years[0].netPricesByBracket = {
        average: {
          price: nullMult(years[1].netPricesByBracket.average.discount, years[0].stickerPrice.price),
          min: minMaxDiscounts.average.min,
          max: minMaxDiscounts.average.max,
        },
        "0_30000": {
          price: nullMult(years[1].netPricesByBracket["0_30000"].discount, years[0].stickerPrice.price),
          min: minMaxDiscounts["0_30000"].min,
          max: minMaxDiscounts["0_30000"].max,
        },
        "30001_48000": {
          price: nullMult(years[1].netPricesByBracket["30001_48000"].discount, years[0].stickerPrice.price),
          min: minMaxDiscounts["30001_48000"].min,
          max: minMaxDiscounts["30001_48000"].max,
        },
        "48001_75000": {
          price: nullMult(years[1].netPricesByBracket["48001_75000"].discount, years[0].stickerPrice.price),
          min: minMaxDiscounts["48001_75000"].min,
          max: minMaxDiscounts["48001_75000"].max,
        },
        "75001_110000": {
          price: nullMult(years[1].netPricesByBracket["75001_110000"].discount, years[0].stickerPrice.price),
          min: minMaxDiscounts["75001_110000"].min,
          max: minMaxDiscounts["75001_110000"].max,
        },
        "110001": {
          price: nullMult(years[1].netPricesByBracket["110001"].discount, years[0].stickerPrice.price),
          min: minMaxDiscounts["110001"].min,
          max: minMaxDiscounts["110001"].max,
        },
      };
    }

    // For schools that have the full 11 years of sticker price data, we will
    // project the next two years of sticker and net price data by multiplying
    // the most recent year by the growth rate:
    //
    // ```
    // (t_n / t_0) ** (1 / 11)
    // ```
    //
    // where `t_n` is the sticker price for the most recent year and `t_0` is
    // the sticker price for the oldest year we have.
    if (
      years.length === 11
      && years.every((y) => !!y.stickerPrice.price)
    ) {
      const [mostRecentYear] = years;
      const oldestYear = years.at(-1)!;

      const getGrowth = (a: number, b: number) => ((a / b) ** (1 / 11));
      const growth = getGrowth(
        mostRecentYear.stickerPrice.price!,
        oldestYear.stickerPrice.price!,
      );
      const growthOutState = getGrowth(
        mostRecentYear.stickerPrice.priceOutState!,
        oldestYear.stickerPrice.priceOutState!,
      );

      const grow = (
        n: number | null = null,
        g: number | null = growth,
      ) => nullMult(n, g);

      // Here we're projecting out _two_ years.
      [...Array(2)].forEach((_, i) => {
        const newYear = baseYear + 1 + i;
        years.unshift({
          year: `${newYear.toString().slice(2)}-${(newYear + 1).toString().slice(2)}`,
          startYear: newYear,
          stickerPrice: {
            price: grow(years[0].stickerPrice.price),
            priceOutState: grow(years[0].stickerPrice.priceOutState, growthOutState),
            type: mostRecentYear.stickerPrice.type,
          },
          netPricesByBracket: {
            average: {
              price: grow(years[0].netPricesByBracket.average.price),
              min: minMaxDiscounts.average.min,
              max: minMaxDiscounts.average.max,
            },
            "0_30000": {
              price: grow(years[0].netPricesByBracket["0_30000"].price),
              min: minMaxDiscounts["0_30000"].min,
              max: minMaxDiscounts["0_30000"].max,
             },
            "30001_48000": {
              price: grow(years[0].netPricesByBracket["30001_48000"].price),
              min: minMaxDiscounts["30001_48000"].min,
              max: minMaxDiscounts["30001_48000"].max,
             },
            "48001_75000": {
              price: grow(years[0].netPricesByBracket["48001_75000"].price),
              min: minMaxDiscounts["48001_75000"].min,
              max: minMaxDiscounts["48001_75000"].max,
             },
            "75001_110000": {
              price: grow(years[0].netPricesByBracket["75001_110000"].price),
              min: minMaxDiscounts["75001_110000"].min,
              max: minMaxDiscounts["75001_110000"].max,
             },
            "110001": {
              price: grow(years[0].netPricesByBracket["110001"].price),
              min: minMaxDiscounts["110001"].min,
              max: minMaxDiscounts["110001"].max,
            },
          },
        });
      });
    }

    // If a school does not have enough price data, we return an empty array
    // for its yearly price data, omitting the sparse data entirely.
    return {
      ...restSchool,
      years: hasEnoughData ? years : [],
    };
  } catch (error) {
    if (school.stickerPriceYears && school.netPriceYears) {
      console.log(school);
      console.error(error);
      throw error;
    }
    return null;
  }
};

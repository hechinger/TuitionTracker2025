import type { SchoolData } from "../config";

type ParseContext = {
  year: number;
};

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

    const startYears = new Set();
    const years = stickerPriceYears.map((stickerYear, i) => {
      const yearNum = baseYear - i;
      const netYear = netPriceYears[i - 1];

      const stickerPrice = stickerYear.prices;
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
        const sticker = stickerPrice.price;
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

      if (stickerPrice && avgPrice.price) {
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
      ) => {
        if (!g && g !== 0) return null;
        if (!n && n !== 0) return null;
        return g * n;
      };

      years[0].netPricesByBracket = {
        average: {
          price: grow(years[1].netPricesByBracket.average.discount, years[0].stickerPrice.price),
          min: minMaxDiscounts.average.min,
          max: minMaxDiscounts.average.max,
        },
        "0_30000": {
          price: grow(years[1].netPricesByBracket["0_30000"].discount, years[0].stickerPrice.price),
          min: minMaxDiscounts["0_30000"].min,
          max: minMaxDiscounts["0_30000"].max,
        },
        "30001_48000": {
          price: grow(years[1].netPricesByBracket["30001_48000"].discount, years[0].stickerPrice.price),
          min: minMaxDiscounts["30001_48000"].min,
          max: minMaxDiscounts["30001_48000"].max,
        },
        "48001_75000": {
          price: grow(years[1].netPricesByBracket["48001_75000"].discount, years[0].stickerPrice.price),
          min: minMaxDiscounts["48001_75000"].min,
          max: minMaxDiscounts["48001_75000"].max,
        },
        "75001_110000": {
          price: grow(years[1].netPricesByBracket["75001_110000"].discount, years[0].stickerPrice.price),
          min: minMaxDiscounts["75001_110000"].min,
          max: minMaxDiscounts["75001_110000"].max,
        },
        "110001": {
          price: grow(years[1].netPricesByBracket["110001"].discount, years[0].stickerPrice.price),
          min: minMaxDiscounts["110001"].min,
          max: minMaxDiscounts["110001"].max,
        },
      };

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

    const needYears = new Set([...Array(7)].map((_, i) => baseYear - i - 1));
    const hasEnoughData = startYears.intersection(needYears).size >= needYears.size;

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

import type { parseHD } from "./hd";
import type { parseADM } from "./adm";
import type { parseEFFY } from "./effy";
import type { parseGR } from "./gr";
import type { parseEFD } from "./efd";
import type { parseICAY } from "./icay";
import type { parseSFA } from "./sfa";

type SchoolData = ReturnType<typeof parseHD>
  & ReturnType<typeof parseADM>
  & ReturnType<typeof parseEFFY>
  & ReturnType<typeof parseGR>
  & ReturnType<typeof parseEFD>
  & ReturnType<typeof parseICAY>
  & ReturnType<typeof parseSFA>;

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
        min: undefined,
        max: undefined,
      },
      "0_30000": {
        min: undefined,
        max: undefined,
      },
      "30001_48000": {
        min: undefined,
        max: undefined,
      },
      "48001_75000": {
        min: undefined,
        max: undefined,
      },
      "75001_110000": {
        min: undefined,
        max: undefined,
      },
      "110001": {
        min: undefined,
        max: undefined,
      },
    };

    const startYears = new Set();
    const years = stickerPriceYears.map((stickerYear, i) => {
      const yearNum = baseYear - i;
      const netYear = netPriceYears[i - 1];

      const stickerPrice = stickerYear.prices;
      const getNetPrice = (bracket) => {
        if (!netYear) {
          return {
            price: null,
          };
        }

        const netPrice = netYear.prices[bracket];
        const sticker = (stickerPrice.type === "on-campus")
          ? stickerPrice.inStateOnCampus
          : stickerPrice.inStateOffCampus
        const discount = netPrice / sticker;
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
      const oldestYear = years.at(-1);

      const getGrowth = (a: number, b: number) => ((a / b) ** (1 / 11));
      const growth = getGrowth(
        mostRecentYear.stickerPrice.price,
        oldestYear.stickerPrice.price,
      );
      const growthOutState = getGrowth(
        mostRecentYear.stickerPrice.priceOutState,
        oldestYear.stickerPrice.priceOutState,
      );

      const grow = (n) => ((!n && n !== 0) ? null : (n * growth));

      years[0].netPricesByBracket = {
        average: {
          // price: grow(years[1].netPricesByBracket.average.price),
          price: years[1].netPricesByBracket.average.discount * years[0].stickerPrice.price,
          min: minMaxDiscounts.average.min,
          max: minMaxDiscounts.average.max,
        },
        "0_30000": {
          // price: grow(years[1].netPricesByBracket["0_30000"].price),
          price: years[1].netPricesByBracket["0_30000"].discount * years[0].stickerPrice.price,
          min: minMaxDiscounts["0_30000"].min,
          max: minMaxDiscounts["0_30000"].max,
        },
        "30001_48000": {
          // price: grow(years[1].netPricesByBracket["30001_48000"].price),
          price: years[1].netPricesByBracket["30001_48000"].discount * years[0].stickerPrice.price,
          min: minMaxDiscounts["30001_48000"].min,
          max: minMaxDiscounts["30001_48000"].max,
        },
        "48001_75000": {
          // price: grow(years[1].netPricesByBracket["48001_75000"].price),
          price: years[1].netPricesByBracket["48001_75000"].discount * years[0].stickerPrice.price,
          min: minMaxDiscounts["48001_75000"].min,
          max: minMaxDiscounts["48001_75000"].max,
        },
        "75001_110000": {
          // price: grow(years[1].netPricesByBracket["75001_110000"].price),
          price: years[1].netPricesByBracket["75001_110000"].discount * years[0].stickerPrice.price,
          min: minMaxDiscounts["75001_110000"].min,
          max: minMaxDiscounts["75001_110000"].max,
        },
        "110001": {
          // price: grow(years[1].netPricesByBracket["110001"].price),
          price: years[1].netPricesByBracket["110001"].discount * years[0].stickerPrice.price,
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
            price: years[0].stickerPrice.price * growth,
            priceOutState: years[0].stickerPrice.priceOutState * growthOutState,
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

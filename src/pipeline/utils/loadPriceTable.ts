import get from "lodash/get";
import { run } from "@/db/pool";

const priceColumns = {
  school_id: "school.id", 
  year: "year", 
  start_year: "startYear", 
  sticker_price_in_state: "stickerPrice.price", 
  sticker_price_out_state: "stickerPrice.priceOutState", 
  sticker_price_type: "stickerPrice.type", 
  net_price_average: "netPricesByBracket.average.price", 
  net_price_average_min: "netPricesByBracket.average.min", 
  net_price_average_max: "netPricesByBracket.average.max", 
  net_price_bracket0: "netPricesByBracket.0_30000.price", 
  net_price_bracket0_min: "netPricesByBracket.0_30000.min", 
  net_price_bracket0_max: "netPricesByBracket.0_30000.max", 
  net_price_bracket1: "netPricesByBracket.30001_48000.price", 
  net_price_bracket1_min: "netPricesByBracket.30001_48000.min", 
  net_price_bracket1_max: "netPricesByBracket.30001_48000.max", 
  net_price_bracket2: "netPricesByBracket.48001_75000.price", 
  net_price_bracket2_min: "netPricesByBracket.48001_75000.min", 
  net_price_bracket2_max: "netPricesByBracket.48001_75000.max", 
  net_price_bracket3: "netPricesByBracket.75001_110000.price", 
  net_price_bracket3_min: "netPricesByBracket.75001_110000.min", 
  net_price_bracket3_max: "netPricesByBracket.75001_110000.max", 
  net_price_bracket4: "netPricesByBracket.110001.price", 
  net_price_bracket4_min: "netPricesByBracket.110001.min", 
  net_price_bracket4_max: "netPricesByBracket.110001.max", 
};

/**
 * Load the parsed price data into the database.
 */
export const loadPriceTable = async <School = Record<string, unknown>>(schools: School[]) => {
  const values = [] as unknown[];
  let valueId = 0;
  const valueIds = [] as string[][];

  schools.forEach((school) => {
    const years = get(school, "years", []) as Record<string, unknown>[];
    years.forEach((year) => {
      const obj = { ...year, school };
      const priceValues = Object.values(priceColumns).map((c) => get(obj, c, null));
      values.push(priceValues);
      valueIds.push(priceValues.map(() => {
        valueId += 1;
        return `$${valueId}`;
      }));
    });
  });

  const valueIdSets = valueIds.map((v) => v.join(", ")).map((v) => `(${v})`).join(", ");
  const updateColumns = Object.keys(priceColumns)
    .map((c) => `${c} = EXCLUDED.${c}`)
    .join(", ");
  const query = {
    text: `
      INSERT INTO prices
        (${Object.keys(priceColumns).join(", ")})
      VALUES ${valueIdSets}
      ON CONFLICT (school_id, year) DO UPDATE SET ${updateColumns};
    `,
    values: values.flat(),
  };

  if (query.values.length > 0) {
    await run(query);
  }
}

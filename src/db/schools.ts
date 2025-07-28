import { max, bin, extent, mean, median } from "d3-array";
import type { SchoolIndex, SchoolDetail, YearData } from "@/types";
import { queryRows, run } from "./pool";

export type SchoolsRow = {
  db_id: number;
  id: string;
  slug: string;
  image: string;
  image_credit: string;
  name: string;
  alias: string;
  city: string;
  state: string;
  zip: string;
  longitude: string;
  latitude: string;
  hbcu: boolean;
  tribal_college: boolean;
  sector: string;
  school_control: string;
  degree_level: string;
  admission_rate: number;
  enrollment_total: number;
  enrollment_gender_men: number;
  enrollment_gender_women: number;
  enrollment_gender_unknown: number;
  enrollment_gender_other: number;
  enrollment_race_unknown: number;
  enrollment_race_multiple: number;
  enrollment_race_white: number;
  enrollment_race_hisp: number;
  enrollment_race_nathawpacisl: number;
  enrollment_race_black: number;
  enrollment_race_asian: number;
  enrollment_race_amerindalasknat: number;
  enrollment_race_nonresident: number;
  graduation_total: number;
  graduation_race_unknown: number;
  graduation_race_multiple: number;
  graduation_race_white: number;
  graduation_race_hisp: number;
  graduation_race_nathawpacisl: number;
  graduation_race_black: number;
  graduation_race_asian: number;
  graduation_race_amerindalasknat: number;
  graduation_race_nonresident: number;
  retention_full_time: number;
  retention_part_time: number;
  percent_sticker: number;
};

export type PricesRow = {
  db_id: number;
  school_id: string;
  year: string;
  start_year: number;
  sticker_price_in_state: number;
  sticker_price_out_state: number;
  sticker_price_type: string;
  net_price_average: number;
  net_price_average_min: number | null;
  net_price_average_max: number | null;
  net_price_bracket0: number;
  net_price_bracket0_min: number | null;
  net_price_bracket0_max: number | null;
  net_price_bracket1: number;
  net_price_bracket1_min: number | null;
  net_price_bracket1_max: number | null;
  net_price_bracket2: number;
  net_price_bracket2_min: number | null;
  net_price_bracket2_max: number | null;
  net_price_bracket3: number;
  net_price_bracket3_min: number | null;
  net_price_bracket3_max: number | null;
  net_price_bracket4: number;
  net_price_bracket4_min: number | null;
  net_price_bracket4_max: number | null;
};

export const getAllSchoolNames = async () => {
  const schools = await queryRows<Pick<SchoolsRow, "id" | "name" | "slug" | "alias">>(
    "SELECT id, name, slug, alias FROM schools;",
  );
  return schools;
};

const getIndexQuery = (ids?: string[]) => {
  const baseQuery = `
    SELECT *
    FROM schools
      LEFT OUTER JOIN (
        SELECT *
        FROM prices
        INNER JOIN (
          SELECT
            school_id as max_school_id,
            max(start_year) as start_year
          FROM prices
          GROUP BY school_id
        ) as years
        ON
          prices.school_id = years.max_school_id
          AND prices.start_year = years.start_year
      ) as latest_prices
      ON schools.id = latest_prices.school_id
  `.trim();

  if (!ids) {
    return `${baseQuery};`;
  }

  const varIds = ids.map((_, i) => `$${i + 1}`);
  return {
    text: `
      ${baseQuery}
      WHERE id IN (${varIds.join(", ")});
    `,
    values: ids,
  };
}

export const getSchoolsIndex = async (opts: {
  schoolIds?: string[];
} = {}) => {
  const {
    schoolIds,
  } = opts;

  const query = getIndexQuery(schoolIds);
  const schools = await queryRows<SchoolsRow & PricesRow>(query);
  return schools.map((school) => ({
    id: school.id,
    slug: school.slug,
    image: school.image,
    imageCredit: school.image_credit,
    name: school.name,
    alias: school.alias,
    city: school.city,
    state: school.state,
    hbcu: school.hbcu,
    tribalCollege: school.tribal_college,
    schoolControl: school.school_control,
    degreeLevel: school.degree_level,
    enrollment: school.enrollment_total,
    stickerPrice: {
      type: school.sticker_price_type,
      price: school.sticker_price_in_state,
    },
    netPricesByBracket: {
      average: school.net_price_average,
      "0_30000": school.net_price_bracket0,
      "30001_48000": school.net_price_bracket1,
      "48001_75000": school.net_price_bracket2,
      "75001_110000": school.net_price_bracket3,
      "110001": school.net_price_bracket4,
    },
  })) as SchoolIndex[];
};

const getDetailQueries = (ids: string[]) => {
  const varIds = ids.map((_, i) => `$${i + 1}`);
  const varIdList = varIds.join(", ");
  return {
    schoolsQuery: {
      text: `
        SELECT *
        FROM schools
        WHERE id IN (${varIdList});
      `,
      values: ids,
    },
    pricesQuery: {
      text: `
        SELECT *
        FROM prices
        WHERE school_id IN (${varIdList});
      `,
      values: ids,
    },
  };
}

export const getSchoolsDetail = async (opts: {
  schoolIds: string[];
}) => {
  const {
    schoolIds,
  } = opts;

  const {
    schoolsQuery,
    pricesQuery,
  } = getDetailQueries(schoolIds);

  const [schools, prices] = await Promise.all([
    queryRows<SchoolsRow>(schoolsQuery),
    queryRows<PricesRow>(pricesQuery),
  ]);

  const yearsBySchool = prices.reduce((map, price) => {
    const year = {
      year: price.year,
      startYear: price.start_year,
      stickerPrice: {
        type: price.sticker_price_type,
        price: price.sticker_price_in_state,
        priceOutState: price.sticker_price_out_state,
      },
      netPricesByBracket: {
        average: {
          price: price.net_price_average,
          min: price.net_price_average_min || undefined,
          max: price.net_price_average_max || undefined,
        },
        "0_30000": {
          price: price.net_price_bracket0,
          min: price.net_price_bracket0_min || undefined,
          max: price.net_price_bracket0_max || undefined,
        },
        "30001_48000": {
          price: price.net_price_bracket1,
          min: price.net_price_bracket1_min || undefined,
          max: price.net_price_bracket1_max || undefined,
        },
        "48001_75000": {
          price: price.net_price_bracket2,
          min: price.net_price_bracket2_min || undefined,
          max: price.net_price_bracket2_max || undefined,
        },
        "75001_110000": {
          price: price.net_price_bracket3,
          min: price.net_price_bracket3_min || undefined,
          max: price.net_price_bracket3_max || undefined,
        },
        "110001": {
          price: price.net_price_bracket4,
          min: price.net_price_bracket4_min || undefined,
          max: price.net_price_bracket4_max || undefined,
        },
      },
    };
    if (!map.has(price.school_id)) {
      map.set(price.school_id, []);
    }
    map.get(price.school_id)!.push(year);
    return map;
  }, new Map<string, YearData[]>());

  return schools.map((school) => {
    const years = (yearsBySchool.get(school.id) || []).sort((a, b) => {
      return b.startYear - a.startYear;
    });
    const lastYear = years[0] as YearData | undefined;

    return {
      id: school.id,
      slug: school.slug,
      image: school.image,
      imageCredit: school.image_credit,
      name: school.name,
      alias: school.alias,
      city: school.city,
      state: school.state,
      hbcu: school.hbcu,
      tribalCollege: school.tribal_college,
      schoolControl: school.school_control,
      degreeLevel: school.degree_level,
      stats: {
        percentSticker: school.percent_sticker,
        percentAdmitted: school.admission_rate,
      },
      stickerPrice: lastYear?.stickerPrice,
      netPricesByBracket: lastYear && {
        average: lastYear.netPricesByBracket.average.price,
        "0_30000": lastYear.netPricesByBracket["0_30000"].price,
        "30001_48000": lastYear.netPricesByBracket["30001_48000"].price,
        "48001_75000": lastYear.netPricesByBracket["48001_75000"].price,
        "75001_110000": lastYear.netPricesByBracket["75001_110000"].price,
        "110001": lastYear.netPricesByBracket["110001"].price,
      },
      enrollment: {
        total: school.enrollment_total,
        byRace: {
          unknown: school.enrollment_race_unknown,
          multiple: school.enrollment_race_multiple,
          white: school.enrollment_race_white,
          hisp: school.enrollment_race_hisp,
          nathawpacisl: school.enrollment_race_nathawpacisl,
          black: school.enrollment_race_black,
          asian: school.enrollment_race_asian,
          amerindalasknat: school.enrollment_race_amerindalasknat,
          nonresident: school.enrollment_race_nonresident,
        },
        byGender: {
          men: school.enrollment_gender_men,
          women: school.enrollment_gender_women,
          unknown: school.enrollment_gender_unknown,
          other: school.enrollment_gender_other,
        },
      },
      retention: {
        fullTime: school.retention_full_time,
        partTime: school.retention_part_time,
      },
      graduation: {
        total: school.graduation_total,
        byRace: {
          unknown: school.graduation_race_unknown,
          multiple: school.graduation_race_multiple,
          white: school.graduation_race_white,
          hisp: school.graduation_race_hisp,
          nathawpacisl: school.graduation_race_nathawpacisl,
          black: school.graduation_race_black,
          asian: school.graduation_race_asian,
          amerindalasknat: school.graduation_race_amerindalasknat,
          nonresident: school.graduation_race_nonresident,
        },
      },
      years,
    };
  }) as SchoolDetail[];
};

export const setSchool = async (opts: {
  id: string;
  name: string;
  alias: string;
  image: string;
  imageCredit: string;
  city: string;
  state: string;
  schoolControl: string;
  degreeLevel: string;
  hbcu: boolean;
  tribalCollege: boolean;
}) => {
  await run({
    text: `
      UPDATE schools
      SET
        name = $2,
        alias = $3,
        image = $4,
        image_credit = $5,
        city = $6,
        state = $7,
        school_control = $8,
        degree_level = $9,
        hbcu = $10,
        tribal_college = $11
      WHERE
        id = $1;
    `,
    values: [
      opts.id,
      opts.name,
      opts.alias,
      opts.image,
      opts.imageCredit,
      opts.city,
      opts.state,
      opts.schoolControl,
      opts.degreeLevel,
      opts.hbcu,
      opts.tribalCollege,
    ],
  });
};

export const getPriceHistogram = async () => {
  type PriceHistogramPrices = {
    sticker_price_in_state: number;
    net_price_average: number;
    net_price_bracket0: number;
    net_price_bracket1: number;
    net_price_bracket2: number;
    net_price_bracket3: number;
    net_price_bracket4: number;
  };

  const prices = await queryRows<PriceHistogramPrices>(`
    SELECT
      sticker_price_in_state,
      net_price_average,
      net_price_bracket0,
      net_price_bracket1,
      net_price_bracket2,
      net_price_bracket3,
      net_price_bracket4
    FROM
      prices
    INNER JOIN (
      SELECT
        school_id as max_school_id,
        max(start_year) as start_year
      FROM prices
      GROUP BY school_id
    ) as years
    ON
      prices.school_id = years.max_school_id
      AND prices.start_year = years.start_year;
  `);

  const getBins = (key: keyof PriceHistogramPrices) => {
    const binPrices = prices
      .map((p) => p[key])
      .filter((p) => p && p > 0 && Number.isFinite(p));
    const binner = bin().thresholds(50);
    return binner(binPrices).map((b) => ({
      length: b.length,
      x0: b.x0,
      x1: b.x1,
    }));
  };

  return {
    sticker: getBins("sticker_price_in_state"),
    average: getBins("net_price_average"),
    "0_30000": getBins("net_price_bracket0"),
    "30001_48000": getBins("net_price_bracket1"),
    "48001_75000": getBins("net_price_bracket2"),
    "75001_110000": getBins("net_price_bracket3"),
    "110001": getBins("net_price_bracket4"),
  };
};

export const getSizeHistogram = async (opts: {
  schoolControl?: string;
  degreeLevel?: string;
} = {}) => {
  const {
    schoolControl,
    degreeLevel,
  } = opts;

  let i = 1;
  const conditions = [
    (typeof schoolControl === "string") && {
      condition: `school_control = $${i++}`,
      value: schoolControl,
    },
    (typeof degreeLevel === "string") && {
      condition: `degree_level = $${i++}`,
      value: degreeLevel,
    },
  ].filter((d) => d !== false);

  const where = ["enrollment_total IS NOT NULL", ...conditions.map((c) => c.condition)];

  type SizeRow = {
    enrollment_total: number;
  };
  const prices = await queryRows<SizeRow>({
    text: `
      SELECT
        enrollment_total
      FROM
        schools
      WHERE
        ${where.join(" AND ")};
    `,
    values: conditions.map((c) => c.value),
  });

  const sizes = prices.map((school) => school.enrollment_total);

  const binSize = 500;
  const binMax = max(sizes) || 0;
  const binN = Math.ceil(binMax / binSize);

  const binner = bin()
    .value((d) => Math.min(d, binMax))
    .thresholds([...Array(binN)].map((_, i) => binSize * (i + 1)));

  return binner(sizes).map((b) => ({
    length: b.length,
    x0: b.x0,
    x1: b.x1,
  }));
};

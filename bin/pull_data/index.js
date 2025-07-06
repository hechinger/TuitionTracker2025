const fs = require("fs");
const path = require("path");
const get = require("lodash/get");
const kebabCase = require("lodash/kebabCase");
const { sum } = require("d3-array");
const { z } = require("zod");
const Papa = require("papaparse");
const { parseIpedsDataset } = require("./utils");

const baseYear = 2022;
const rootDir = path.dirname(path.dirname(__dirname));
const ipedsDir = path.join(rootDir, "src", "data", "ipeds");

const oldFile = path.join(rootDir, "src", "data", "schools.json");
const oldSchools = JSON.parse(fs.readFileSync(oldFile)).filter(Boolean);
const oldSchoolIds = new Set(oldSchools.map((s) => `${s.unitid}`));
const oldSchoolIdToName = new Map(oldSchools.map((s) => [`${s.unitid}`, s.schoolname]));

const oldSchoolSchema = z.object({
  unitid: z.string(),
  schoolname: z.string(),
  stateabbr: z.string(),
  // programs: null,
  aliasname: z.string(),
  schoolcontrol: z.enum(["public", "private", "for-profit"]),
  degreetype: z.enum(["4-year", "2-year"]),
  enrollment1617: z.union([z.number(), z.literal("")]), // 5 missing enrollment
  details: z.object({
    unitid: z.string(),
    institution: z.string(),
    alias: z.string(),
    city: z.string(),
    abbreviation: z.string(),
    hbcu: z.number(),
    tribal_college: z.number(),
    level: z.number(),
    enrollment: z.object({
      perc_sticker: z.nullable(z.number()), // 45 null
      perc_admitted: z.nullable(z.number()), // 1756 null
      enrollment_unknown: z.number(),
      enrollment_twomore: z.number(),
      enrollment_white: z.number(),
      enrollment_hisp: z.number(),
      enrollment_nathawpacisl: z.number(),
      enrollment_black: z.number(),
      enrollment_asian: z.number(),
      enrollment_amerindalasknat: z.number(),
      enrollment_nonresident: z.number(),
      total_men: z.nullable(z.number()), // 34 null
      total_women: z.nullable(z.number()), // 34 null
      total_enrollment: z.nullable(z.number()), // 34 null
      total_genderunknown: z.nullable(z.number()), // 34 null
      total_anothergender: z.nullable(z.number()), // 2710 null
    }),
    yearly_data: z.array(z.object({
      year: z.string(),
      // price: z.number(),
      price_instate_oncampus: z.nullable(z.number()), // ~1600 null
      price_instate_offcampus_nofamily: z.nullable(z.number()), // ~300 null, though ~2200 for most recent year
      avg_net_price_0_30000_titleiv_privateforprofit: z.number(), // ~300 null
      avg_net_price_30001_48000_titleiv_privateforprofit: z.number(), // ~300 null
      avg_net_price_48001_75000_titleiv_privateforprofit: z.number(), // ~500 null
      avg_net_price_75001_110000_titleiv_privateforprofit: z.number(), // ~700 null
      avg_net_price_110001_titleiv_privateforprofit: z.number(), // ~1000 null
      min_max_diff_0_30000_titleiv_privateforprofit_campus: z.array(z.number()).optional(),
      min_max_diff_30001_48000_titleiv_privateforprofit_campus: z.array(z.number()).optional(),
      min_max_diff_48001_75000_titleiv_privateforprofit_campus: z.array(z.number()).optional(),
      min_max_diff_75001_110000_titleiv_privateforprofit_campus: z.array(z.number()).optional(),
      min_max_diff_110001_titleiv_privateforprofit_campus: z.array(z.number()).optional(),
      min_max_diff_0_30000_titleiv_privateforprofit_offcampus: z.array(z.number()).optional(),
      min_max_diff_30001_48000_titleiv_privateforprofit_offcampus: z.array(z.number()).optional(),
      min_max_diff_48001_75000_titleiv_privateforprofit_offcampus: z.array(z.number()).optional(),
      min_max_diff_75001_110000_titleiv_privateforprofit_offcampus: z.array(z.number()).optional(),
      min_max_diff_110001_titleiv_privateforprofit_offcampus: z.array(z.number()).optional(),
    })),
  }),
});

const schoolSchema = z.object({
  id: z.string(),
  slug: z.string(),
  image: z.null(),
  name: z.string(),
  alias: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  hbcu: z.boolean(),
  tribalCollege: z.boolean(),
  sector: z.string(),
  schoolControl: z.enum(["public", "private", "for-profit"]),
  degreeLevel: z.enum(["4-year", "2-year", "other"]),
  admissionRate: z.nullable(z.number()).optional(), // 1850 missing, 15 null
  percentSticker: z.number(),
  enrollment: z.object({
    total: z.number(),
    byGender: z.object({
      men: z.number(),
      women: z.number(),
      unknown: z.number(),
      other: z.nullable(z.number()), // 2902 null
    }),
    byRace: z.object({
      unknown: z.number(),
      multiple: z.number(),
      white: z.number(),
      hisp: z.number(),
      nathawpacisl: z.number(),
      black: z.number(),
      asian: z.number(),
      amerindalasknat: z.number(),
      nonresident: z.number(),
    }),
  }).optional(), // 64 missing
  graduation: z.object({
    total: z.nullable(z.number()), // 156 null
    byRace: z.object({
      unknown: z.nullable(z.number()), // 756 null
      multiple: z.nullable(z.number()), // 672 null
      white: z.nullable(z.number()), // 263 null
      hisp: z.nullable(z.number()), // 404 null
      nathawpacisl: z.nullable(z.number()), // 1300 null
      black: z.nullable(z.number()), // 466 null
      asian: z.nullable(z.number()), // 659 null
      amerindalasknat: z.nullable(z.number()), // 862 null
      nonresident: z.nullable(z.number()), // 1011 null
    }),
  }).optional(), // 288 missing
  retention: z.object({
    fullTime: z.nullable(z.number()), // 292 null
    partTime: z.nullable(z.number()), // 1004 null
  }).optional(), // 13 missing
  years: z.array(z.object({
    year: z.string(),
    startYear: z.number(),
    stickerPrice: z.object({
      price: z.number(),
      priceOutState: z.number(),
      type: z.enum(["on-campus", "off-campus"]),
    }),
    netPricesByBracket: z.object({
      average: z.object({
        price: z.number(),
        // min: z.number().optional(),
        // max: z.number().optional(),
      }),
      "0_30000": z.object({
        price: z.number(),
        // min: z.number().optional(),
        // max: z.number().optional(),
      }),
      "30001_48000": z.object({
        price: z.number(),
        // min: z.number().optional(),
        // max: z.number().optional(),
      }),
      "48001_75000": z.object({
        price: z.number(),
        // min: z.number().optional(),
        // max: z.number().optional(),
      }),
      "75001_110000": z.object({
        price: z.number(),
        // min: z.number().optional(),
        // max: z.number().optional(),
      }),
      "110001": z.object({
        price: z.number(),
        // min: z.number().optional(),
        // max: z.number().optional(),
      }),
    }),
  })),
});

const datasetConfig = {
  year: baseYear,
  baseUrl: "https://nces.ed.gov/ipeds/datacenter/data/",
  files: [
    {
      file: "HD{YEAR}",
      parseSchoolRows: ([[data]], { registerError }) => {
        const schoolData = {
          id: `${get(data, "UNITID")}`,
          slug: kebabCase(get(data, "INSTNM")),
          image: null,
          name: get(data, "INSTNM"),
          alias: get(data, "IALIAS"),
          city: get(data, "CITY"),
          state: get(data, "STABBR"),
          zip: `${get(data, "ZIP")}`,
          longitude: get(data, "LONGITUD"),
          latitude: get(data, "LATITUDE"),
          hbcu: `${get(data, "HBCU")}` === "2",
          tribalCollege: `${get(data, "TRIBAL")}` === "2",
          sector: `${get(data, "SECTOR")}`,
          schoolControl: (() => {
            const control = `${get(data, "CONTROL")}`;
            if (control === "1") return "public";
            if (control === "2") return "private";
            if (control === "3") return "for-profit";
            registerError(`Unhandled school control value: ${control}`);
            return null;
          })(),
          degreeLevel: (() => {
            const level = `${get(data, "ICLEVEL")}`;
            if (level === "1") return "4-year";
            if (level === "2") return "2-year";
            if (level === "3") return "other";
            registerError(`Unhandled degree level value: ${level}`);
            return null;
          })(),
        };
        return schoolData;
      },
    },
    {
      file: "ADM{YEAR}",
      parseSchoolRows: ([[data]]) => {
        const applicants = get(data, "APPLCN", 0);
        const admissions = get(data, "ADMSSN", 0);
        return {
          admissionRate: !applicants ? null : (admissions / applicants),
        };
      },
    },
    {
      file: "EFFY{YEAR}",
      parseSchoolRows: ([[data]]) => ({
        enrollment: {
          total: get(data, "EFYTOTLT"),
          byGender: {
            men: get(data, "EFYTOTLM"),
            women: get(data, "EFYTOTLW"),
            unknown: get(data, "EFYGUUN"),
            other: get(data, "EFYGUAN"),
          },
          byRace: {
            unknown: get(data, "EFYUNKNT"),
            multiple: get(data, "EFY2MORT"),
            white: get(data, "EFYWHITT"),
            hisp: get(data, "EFYHISPT"),
            nathawpacisl: get(data, "EFYNHPIT"),
            black: get(data, "EFYBKAAT"),
            asian: get(data, "EFYASIAT"),
            amerindalasknat: get(data, "EFYAIANT"),
            nonresident: get(data, "EFYNRALT"),
          },
        },
      }),
    },
    {
      file: "GR{YEAR}",
      years: 5,
      parseSchoolRows: (years, { registerError }) => {
        const rows = years.flat(Infinity);
        const numeratorRows = rows.filter((row) => ["9", "30"].includes(`${row.GRTYPE}`));
        const denominatorRows = rows.filter((row) => ["8", "29"].includes(`${row.GRTYPE}`));
        const gradRate = (key) => {
          const numerator = sum(numeratorRows, (row) => row[key]);
          const denominator = sum(denominatorRows, (row) => row[key]);
          if (!denominator) {
            registerError("Could not compute graduation rate");
            return null;
          }
          return numerator / denominator;
        };
        return {
          graduation: {
            total: gradRate("GRTOTLT"),
            byRace: {
              unknown: gradRate("GRUNKNT"),
              multiple: gradRate("GR2MORT"),
              white: gradRate("GRWHITT"),
              hisp: gradRate("GRHISPT"),
              nathawpacisl: gradRate("GRNHPIT"),
              black: gradRate("GRBKAAT"),
              asian: gradRate("GRASIAT"),
              amerindalasknat: gradRate("GRAIANT"),
              nonresident: gradRate("GRNRALT"),
            },
          },
        };
      },
    },
    {
      file: "EF{YEAR}D",
      years: 5,
      parseSchoolRows: (years, { registerError }) => {
        const rows = years.flat(Infinity);
        const retentionRate = (numeratorKey, denominatorKey) => {
          const numerator = sum(rows, (row) => row[numeratorKey]);
          const denominator = sum(rows, (row) => row[denominatorKey]);
          if (!denominator) {
            registerError("Could not compute retention rate");
            return null;
          }
          return numerator / denominator;
        };
        return {
          retention: {
            fullTime: retentionRate("RET_NMF", "RRFTCTA"),
            partTime: retentionRate("RET_NMP", "RRPTCTA"),
          },
        };
      },
    },
    {
      file: "IC{YEAR}_AY",
      years: 11,
      parseSchoolRows: (years) => {
        const getStickerPriceYear = (year, yearNumber) => {
          const chg2ay3 = parseInt(year.CHG2AY3, 10) || 0;
          const chg3ay3 = parseInt(year.CHG3AY3, 10) || 0;
          const chg4ay3 = parseInt(year.CHG4AY3, 10) || 0;
          const chg5ay3 = parseInt(year.CHG5AY3, 10) || 0;
          const chg6ay3 = parseInt(year.CHG6AY3, 10) || 0;
          const chg7ay3 = parseInt(year.CHG7AY3, 10) || 0;
          const chg8ay3 = parseInt(year.CHG8AY3, 10) || 0;

          const inStateOnCampus = chg2ay3 + chg4ay3 + chg5ay3 + chg6ay3;
          const inStateOffCampus = chg2ay3 + chg4ay3 + chg7ay3 + chg8ay3;
          const outStateOnCampus = chg3ay3 + chg4ay3 + chg5ay3 + chg6ay3;
          const outStateOffCampus = chg3ay3 + chg4ay3 + chg7ay3 + chg8ay3;

          return {
            year: yearNumber,
            prices: {
              price: inStateOnCampus || inStateOffCampus,
              priceOutState: outStateOnCampus || outStateOffCampus,
              type: inStateOnCampus ? "on-campus" : "off-campus",
            },
          };
        };
        return {
          stickerPriceYears: years.map(([year], i) => getStickerPriceYear(year, baseYear - i)),
        };
      },
    },
    {
      file: "SFA{ACADEMIC_YEAR}",
      years: 11,
      parseSchoolRows: (years) => {
        const [[mostRecentYear]] = years;
        const percentSticker = (100 - mostRecentYear.UAGRNTP) / 100;

        const getNetPriceYear = (year, yearNumber) => {
          return {
            year: yearNumber,
            prices: {
              average: year.NPIST2 || year.NPGRN2,
              "0_30000": year.NPIS412 || year.NPT412,
              "30001_48000": year.NPIS422 || year.NPT422,
              "48001_75000": year.NPIS432 || year.NPT432,
              "75001_110000": year.NPIS442 || year.NPT442,
              "110001": year.NPIS452 || year.NPT452,
            },
          };
        };

        return {
          percentSticker,
          netPriceYears: years.map(([year], i) => getNetPriceYear(year, baseYear - i)),
        };
      },
    },
  ],
  synthesizeSchool: (school) => {
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

      const years = stickerPriceYears.map((stickerYear, i) => {
        const yearNum = baseYear - i;
        const netYear = netPriceYears[i];

        const stickerPrice = stickerYear.prices;
        const getNetPrice = (bracket) => {
          if (!netYear) {
            return {
              price: null,
            };
          }

          const netPrice = netYear.prices[bracket];
          const discount = netPrice / stickerPrice.price;
          const { min, max } = minMaxDiscounts[bracket];

          if (min === undefined || discount < min) {
            minMaxDiscounts[bracket].min = discount;
          }

          if (max === undefined || discount > max) {
            minMaxDiscounts[bracket].max = discount;
          }

          return {
            price: netPrice,
          };
        };

        return {
          year: `${(yearNum - 1).toString().slice(2)}-${yearNum.toString().slice(2)}`,
          startYear: yearNum - 1,
          stickerPrice,
          netPricesByBracket: {
            average: getNetPrice("average"),
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

        const getGrowth = (a, b) => ((a / b) ** (1 / 11));
        const growth = getGrowth(
          mostRecentYear.stickerPrice.price,
          oldestYear.stickerPrice.price,
        );
        const growthOutState = getGrowth(
          mostRecentYear.stickerPrice.priceOutState,
          oldestYear.stickerPrice.priceOutState,
        );

        const grow = (n) => ((!n && n !== 0) ? null : (n * growth));
        [...Array(2)].forEach(() => {
          years.unshift({
            year: `${baseYear.toString().slice(2)}-${(baseYear + 1).toString().slice(2)}`,
            startYear: baseYear,
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

      return {
        ...restSchool,
        years,
      };
    } catch (error) {
      if (school.stickerPriceYears && school.netPriceYears) {
        console.log(school);
        console.error(error);
        throw error;
      }
      return null;
    }
  },
};


const main = async (config) => {
  fs.mkdirSync(ipedsDir, { recursive: true });

  const dataset = await parseIpedsDataset(config, {
    dataDir: ipedsDir,
  });
  // const dataset = {
  //   errors: [],
  //   dataset: JSON.parse(fs.readFileSync(path.join(ipedsDir, "dataset.json"))),
  // };

  const schools = Object.values(dataset.dataset).filter((s) => s.years.length === 13);

  const validationErrors = [];
  const validationErrorsByPath = new Map();

  const validSchools = schools.filter((school) => {
    const result = schoolSchema.safeParse(school);

    if (!result.success) {
      validationErrors.push(result.error);
      result.error.issues.forEach((issue) => {
        const p = issue.path.join(".");
        if (!validationErrorsByPath.has(p)) {
          validationErrorsByPath.set(p, new Map());
        }
        const n = validationErrorsByPath.get(p).get(issue.message) || { count: 0, unique: 0 };
        n.count += 1;
        n.unique += (result.error.issues.length === 1) ? 1 : 0;
        validationErrorsByPath.get(p).set(issue.message, n);

        if (issue.message === "Expected number, received string") {
          console.log(issue);
          console.log(JSON.stringify(school, null, 2));
        }
      });
    }

    return result.success;
  });

  const validationErrorsByPathRows = [];
  [...validationErrorsByPath].forEach(([errorPath, errors]) => {
    [...errors].forEach(([message, count]) => {
      validationErrorsByPathRows.push({
        path: errorPath,
        message,
        count: count.count,
        unique: count.unique,
      });
    });
  });
  fs.writeFileSync(
    path.join(ipedsDir, "validation_errors.csv"),
    Papa.unparse(validationErrorsByPathRows),
  );

  console.log(validationErrorsByPath);

  console.log(`Parsing errors: ${dataset.errors.length}`);
  console.log(`Validation errors: ${validationErrors.length}`);
  console.log(`Schools: ${schools.length}`);
  console.log(`Valid schools: ${validSchools.length}`);

  const shortNames = [];
  const yearLengths = schools.reduce((map, school) => {
    const n = school.years.length;
    if (n < 13 && oldSchoolIds.has(school.id)) {
      shortNames.push(`${school.name} (${n})`);
    }
    map.set(n, (map.get(n) || 0) + 1);
    return map;
  }, new Map());

  console.log(yearLengths);
  console.log(`Number short: ${shortNames.length}`);
  console.log(shortNames);

  const validOldSchools = oldSchools.filter((school) => {
    const result = oldSchoolSchema.safeParse(school);
    return result.success;
  });
  const validSchoolIds = new Set(validSchools.map((s) => s.id));
  const validOldSchoolIds = new Set(validOldSchools.map((s) => s.unitid));
  const missingOldSchools = validOldSchoolIds.difference(validSchoolIds);

  console.log("Comparison to old data:");
  console.log(`Valid schools: ${validOldSchoolIds.size} old, ${validSchoolIds.size} new`);
  console.log(`Missing old schools: ${missingOldSchools.size}`);
  console.log([...missingOldSchools].map((id) => oldSchoolIdToName.get(id)));

  console.log(JSON.stringify(dataset.dataset[[...missingOldSchools][0]], null, 2));

  // const [id] = Object.keys(dataset.dataset);
  // dataset.dataset[id].years.forEach((y) => console.log(y));

  const datasetFile = path.join(ipedsDir, "dataset.json");
  fs.writeFileSync(datasetFile, JSON.stringify(dataset.dataset, null, 2));
}

main(datasetConfig);

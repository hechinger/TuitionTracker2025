const fs = require("fs");
const path = require("path");
const groupBy = require("lodash/groupBy");
const { z } = require("zod");

const rootDir = path.dirname(path.dirname(__dirname));
const ipedsDir = path.join(rootDir, "src", "data", "ipeds");

const EnrollmentSchema = z.object({
  total: z.number(),
  byGender: z.object({
    men: z.number(),
    women: z.number(),
    unknown: z.number(),
    other: z.nullable(z.number()),
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
});

const GraduationSchema = z.object({
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
});

const RetentionSchema = z.object({
  fullTime: z.number(), // 292 null
  partTime: z.nullable(z.number()), // 1004 null
});

const AdmissionRateSchema = z.number();

const StickerPriceSchema = z.object({
  price: z.number(),
  priceOutState: z.nullable(z.number()),
  type: z.enum(["on-campus", "off-campus"]),
});

const BracketSchema = z.object({
  price: z.number(),
});

const BracketSchemaOptional = z.object({
  price: z.number().nullable(),
});

const YearSchema = z.object({
  year: z.string(),
  startYear: z.number(),
  stickerPrice: StickerPriceSchema,
  netPricesByBracket: z.object({
    average: BracketSchema,
    "0_30000": BracketSchema,
    "30001_48000": BracketSchema,
    "48001_75000": BracketSchemaOptional,
    "75001_110000": BracketSchemaOptional,
    "110001": BracketSchemaOptional,
  }),
});

const SchoolInfoSchema = z.object({
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
  percentSticker: z.number(),
});

const schoolSchema = z.object({
  ...SchoolInfoSchema.shape,
  enrollment: EnrollmentSchema.optional(), // 64 missing
  graduation: GraduationSchema.optional(), // 288 missing
  retention: RetentionSchema.optional(),
  admissionRate: AdmissionRateSchema.optional(),
  years: z.array(YearSchema),
});

const isValid = (schema, obj) => {
  const result = schema.safeParse(obj);
  return result.success;
};

const main = async () => {
  const dataset = {
    errors: [],
    dataset: JSON.parse(fs.readFileSync(path.join(ipedsDir, "dataset.json"))),
  };

  const schools = Object.values(dataset.dataset);

  const validInfo = new Set();
  const validEnrollment = new Set();
  const validGraduation = new Set();
  const validRetention = new Set();
  const validAdmission = new Set();
  const enoughData = new Set();
  const stats = [];

  const needYears = new Set([2022, 2021, 2020, 2019, 2018, 2017, 2016]);

  schools.forEach((school) => {
    const startYears = new Set(
      school.years
        .filter((y) => (
          isValid(StickerPriceSchema, y.stickerPrice)
          && isValid(BracketSchema, y.netPricesByBracket.average)
        ))
        .map((y) => y.startYear)
    );
    const hasEnoughData = startYears.intersection(needYears).size >= needYears.size;
    
    const stat = {
      tag: `${school.name} in ${school.city}, ${school.state} (${school.id})`,
      id: school.id,
      name: school.name,
      hasValidInfo: isValid(SchoolInfoSchema, school),
      hasValidEnrollment: isValid(EnrollmentSchema, school.enrollment),
      hasValidGraduation: isValid(GraduationSchema, school.graduation),
      hasValidRetention: isValid(RetentionSchema, school.retention),
      hasValidAdmission: isValid(AdmissionRateSchema, school.admissionRate),
      years: school.years.length,
      validYears: school.years.filter((y) => isValid(YearSchema, y)).length,
      validStickerYears: school.years.filter((y) => isValid(StickerPriceSchema, y.stickerPrice)).length,
      validNetAverageYears: school.years.filter((y) => isValid(BracketSchema, y.netPricesByBracket.average)).length,
      hasEnoughData,
    };

    if (stat.hasValidInfo) validInfo.add(school.id);
    if (stat.hasValidEnrollment) validEnrollment.add(school.id);
    if (stat.hasValidGraduation) validGraduation.add(school.id);
    if (stat.hasValidRetention) validRetention.add(school.id);
    if (stat.hasValidAdmission) validAdmission.add(school.id);
    if (hasEnoughData) enoughData.add(school.id);

    stats.push(stat);
  });

  const byYears = groupBy(stats, (d) => d.years);
  const yearCounts = Object.entries(byYears).sort((a, b) => b[0] - a[0]);

  const byValidYears = groupBy(stats, (d) => d.validYears);
  const validYearCounts = Object.entries(byValidYears).sort((a, b) => b[0] - a[0]);

  const byValidStickerYears = groupBy(stats, (d) => d.validStickerYears);
  const validStickerYearCounts = Object.entries(byValidStickerYears).sort((a, b) => b[0] - a[0]);

  const byValidNetAvgYears = groupBy(stats, (d) => d.validNetAverageYears);
  const validNetAvgYearCounts = Object.entries(byValidNetAvgYears).sort((a, b) => b[0] - a[0]);

  console.log("Total schools:", schools.length);
  console.log("Schools with valid info:", validInfo.size);
  console.log("Schools with valid enrollment:", validEnrollment.size);
  console.log("Schools with valid graduation:", validGraduation.size);
  console.log("Schools with valid retention:", validRetention.size);
  console.log("Schools with valid admission rate:", validAdmission.size);
  console.log("Schools with enrollment/grad/retention:", validEnrollment.intersection(validGraduation).intersection(validRetention).size);
  console.log("Schools with enough price data:", enoughData.size);
  console.log("");
  console.log("Number of years available:");
  yearCounts.forEach((ct) => {
    console.log(`${ct[0]} years: ${ct[1].length} schools`, ct[1].slice(0, 5).map((s) => s.id));
  });
  console.log("");
  console.log("Number of valid years available:");
  validYearCounts.forEach((ct) => {
    console.log(`${ct[0]} valid years: ${ct[1].length} schools`, ct[1].slice(0, 5).map((s) => s.id));
  });
  console.log("");
  console.log("Number of valid sticker years available:");
  validStickerYearCounts.forEach((ct) => {
    console.log(`${ct[0]} valid years: ${ct[1].length} schools`, ct[1].slice(0, 5).map((s) => s.id));
  });
  console.log("");
  console.log("Number of valid net average years available:");
  validNetAvgYearCounts.forEach((ct) => {
    console.log(`${ct[0]} valid years: ${ct[1].length} schools`, ct[1].slice(0, 5).map((s) => s.id));
  });
  console.log("");

  const toDisplay = new Set(["495767"]);
  stats.forEach((stat) => {
    if (toDisplay.has(stat.id)) {
      console.log(stat);
    }
  });
};

main();

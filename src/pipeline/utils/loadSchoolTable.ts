import get from "lodash/get";
import { run } from "@/db/pool";

const schoolColumns = {
  id: "id", 
  slug: "slug",
  image: "image", 
  name: "name", 
  alias: "alias", 
  city: "city", 
  state: "state", 
  zip: "zip", 
  longitude: "longitude",
  latitude: "latitude",
  hbcu: "hbcu", 
  tribal_college: "tribalCollege", 
  sector: "sector", 
  school_control: "schoolControl", 
  degree_level: "degreeLevel", 
  admission_rate: "admissionRate", 
  enrollment_total: "enrollment.total", 
  enrollment_gender_men: "enrollment.byGender.men", 
  enrollment_gender_women: "enrollment.byGender.women", 
  enrollment_gender_unknown: "enrollment.byGender.unknown", 
  enrollment_gender_other: "enrollment.byGender.other", 
  enrollment_race_unknown: "enrollment.byRace.unknown", 
  enrollment_race_multiple: "enrollment.byRace.multiple", 
  enrollment_race_white: "enrollment.byRace.white", 
  enrollment_race_hisp: "enrollment.byRace.hisp", 
  enrollment_race_nathawpacisl: "enrollment.byRace.nathawpacisl", 
  enrollment_race_black: "enrollment.byRace.black", 
  enrollment_race_asian: "enrollment.byRace.asian", 
  enrollment_race_amerindalasknat: "enrollment.byRace.amerindalasknat", 
  enrollment_race_nonresident: "enrollment.byRace.nonresident", 
  graduation_total: "graduation.total", 
  graduation_race_unknown: "graduation.byRace.unknown", 
  graduation_race_multiple: "graduation.byRace.multiple", 
  graduation_race_white: "graduation.byRace.white", 
  graduation_race_hisp: "graduation.byRace.hisp", 
  graduation_race_nathawpacisl: "graduation.byRace.nathawpacisl", 
  graduation_race_black: "graduation.byRace.black", 
  graduation_race_asian: "graduation.byRace.asian", 
  graduation_race_amerindalasknat: "graduation.byRace.amerindalasknat", 
  graduation_race_nonresident: "graduation.byRace.nonresident", 
  retention_full_time: "retention.fullTime", 
  retention_part_time: "retention.partTime", 
  percent_sticker: "percentSticker", 
};

export const loadSchoolTable = async <School = Record<string, unknown>>(schools: School[]) => {
  // Update schools table
  const values = [] as unknown[];
  let valueId = 0;
  const valueIds = [] as string[][];

  schools.forEach((school) => {
    const schoolValues = Object.values(schoolColumns).map((c) => get(school, c, null));
    values.push(schoolValues);
    valueIds.push(schoolValues.map(() => {
      valueId += 1;
      return `$${valueId}`;
    }));
  });

  const valueIdSets = valueIds.map((v) => v.join(", ")).map((v) => `(${v})`).join(", ");
  const query = {
    text: `INSERT INTO schools (${Object.keys(schoolColumns).join(", ")}) VALUES ${valueIdSets} ON CONFLICT DO NOTHING;`,
    values: values.flat(),
  };

  await run(query);
};

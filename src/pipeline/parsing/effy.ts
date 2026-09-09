import type { ParseContext } from "../utils/parseIpedsFile";

/**
 * The 12-month enrollment file contains one row per school per level of
 * student (`EFFYALEV`). Level 1 is *all* students — including graduate
 * students — while level 2 is the undergraduate total, which is what we
 * report. Rows arrive in level order, so the first row for a school is the
 * all-students row and must not be used.
 */
const UNDERGRADUATE_LEVEL = 2;

export type RowEFFY = {
  EFFYALEV: number; // level of student the row covers
  EFYTOTLT: number; // total enrollment count
  EFYTOTLM: number; // male
  EFYTOTLW: number; // female
  EFYGUUN: number; // unknown gender
  EFYGUAN: number; // another gender
  EFYUNKNT: number; // unknown race
  EFY2MORT: number; // multiple races
  EFYWHITT: number; // white
  EFYHISPT: number; // hispanic
  EFYNHPIT: number; // native hawaiian / pacific islander
  EFYBKAAT: number; // black
  EFYASIAT: number; // asian
  EFYAIANT: number; // american indian / alaskan native
  EFYNRALT: number; // nonresident
};

export const parseEFFY = (
  years: RowEFFY[][],
  { registerError }: ParseContext,
) => {
  const [rows] = years;
  const data = rows.find((row) => `${row.EFFYALEV}` === `${UNDERGRADUATE_LEVEL}`);

  // Graduate-only schools have no undergraduate row at all. We report their
  // enrollment as unknown rather than falling back to a total that would
  // include graduate students.
  if (!data) {
    registerError("No undergraduate enrollment reported");
    return {
      enrollment: {
        total: null,
        byGender: { men: null, women: null, unknown: null, other: null },
        byRace: {
          unknown: null, multiple: null, white: null, hisp: null,
          nathawpacisl: null, black: null, asian: null,
          amerindalasknat: null, nonresident: null,
        },
      },
    };
  }

  return {
    enrollment: {
      total: data.EFYTOTLT,
      byGender: {
        men: data.EFYTOTLM,
        women: data.EFYTOTLW,
        unknown: data.EFYGUUN,
        other: data.EFYGUAN,
      },
      byRace: {
        unknown: data.EFYUNKNT,
        multiple: data.EFY2MORT,
        white: data.EFYWHITT,
        hisp: data.EFYHISPT,
        nathawpacisl: data.EFYNHPIT,
        black: data.EFYBKAAT,
        asian: data.EFYASIAT,
        amerindalasknat: data.EFYAIANT,
        nonresident: data.EFYNRALT,
      },
    },
  };
}

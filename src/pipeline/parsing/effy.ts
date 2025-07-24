export type RowEFFY = {
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
) => {
  const [[data]] = years;
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

export type RowEFFY = {
  EFYTOTLT: number;
  EFYTOTLM: number;
  EFYTOTLW: number;
  EFYGUUN: number;
  EFYGUAN: number;
  EFYUNKNT: number;
  EFY2MORT: number;
  EFYWHITT: number;
  EFYHISPT: number;
  EFYNHPIT: number;
  EFYBKAAT: number;
  EFYASIAT: number;
  EFYAIANT: number;
  EFYNRALT: number;
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

export type RowADM = {
  APPLCN: number;
  ADMSSN: number;
};

export const parseADM = (
  years: RowADM[][],
) => {
  const [[data]] = years;
  const applicants = data.APPLCN;
  const admissions = data.ADMSSN || 0;
  return {
    admissionRate: !applicants ? null : (admissions / applicants),
  };
};

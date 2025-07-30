export type RowADM = {
  APPLCN: number; // number of applications
  ADMSSN: number; // number admitted
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

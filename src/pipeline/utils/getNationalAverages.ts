import get from "lodash/get";

/**
 * Compute the set of national averages from the whole set of schools. This
 * computes national averages for 2-year and 4-year institutions for retention
 * and graduation rates.
 */
export const getNationalAverages = (schools: Record<string, unknown>[]) => {
  const averages = {
    "2-year": {
      retentionFullTime: { sum: 0, n: 0 },
      retentionPartTime: { sum: 0, n: 0 },
      graduationTotal: { sum: 0, n: 0 },
      graduationUnknown: { sum: 0, n: 0 },
      graduationMultiple: { sum: 0, n: 0 },
      graduationWhite: { sum: 0, n: 0 },
      graduationHisp: { sum: 0, n: 0 },
      graduationNathawpacisl: { sum: 0, n: 0 },
      graduationBlack: { sum: 0, n: 0 },
      graduationAsian: { sum: 0, n: 0 },
      graduationAmerindalasknat: { sum: 0, n: 0 },
      graduationNonresident: { sum: 0, n: 0 },
    },
    "4-year": {
      retentionFullTime: { sum: 0, n: 0 },
      retentionPartTime: { sum: 0, n: 0 },
      graduationTotal: { sum: 0, n: 0 },
      graduationUnknown: { sum: 0, n: 0 },
      graduationMultiple: { sum: 0, n: 0 },
      graduationWhite: { sum: 0, n: 0 },
      graduationHisp: { sum: 0, n: 0 },
      graduationNathawpacisl: { sum: 0, n: 0 },
      graduationBlack: { sum: 0, n: 0 },
      graduationAsian: { sum: 0, n: 0 },
      graduationAmerindalasknat: { sum: 0, n: 0 },
      graduationNonresident: { sum: 0, n: 0 },
    },
  } as const;

  const keys = {
    retentionFullTime: "retention.fullTime",
    retentionPartTime: "retention.partTime",
    graduationTotal: "graduation.total",
    graduationUnknown: "graduation.byRace.unknown",
    graduationMultiple: "graduation.byRace.multiple",
    graduationWhite: "graduation.byRace.white",
    graduationHisp: "graduation.byRace.hisp",
    graduationNathawpacisl: "graduation.byRace.nathawpacisl",
    graduationBlack: "graduation.byRace.black",
    graduationAsian: "graduation.byRace.asian",
    graduationAmerindalasknat: "graduation.byRace.amerindalasknat",
    graduationNonresident: "graduation.byRace.nonresident",
  } as const;

  const updateAverage = (
    school: Record<string, unknown>,
    valuePath: string,
    avgPath: string,
  ) => {
    const value = get(school, valuePath);
    if (typeof value === "undefined") return;
    const degreeLevel = get(school, "degreeLevel") as string;
    const avg = get(averages, [degreeLevel, avgPath]);
    if (!avg) {
      throw new Error(`Invalid average path: ${degreeLevel}.${avgPath}`);
    }
    avg.sum += value;
    avg.n += 1;
  };

  schools.forEach((school) => {
    Object.entries(keys).forEach(([avgKey, valueKey]) => {
      updateAverage(school, valueKey, avgKey);
    });
  });

  const natAvgs = Object.fromEntries(
    Object.entries(averages).map(([level, avgs]) => {
      return [
        level,
        Object.fromEntries(
          Object.entries(avgs).map(([key, avg]) => {
            const { sum, n } = avg;
            return [
              key,
              sum / n,
            ];
          }),
        ),
      ];
    }),
  );

  return natAvgs;
};

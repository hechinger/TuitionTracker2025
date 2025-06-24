const fs = require("fs");
const path = require("path");
const kebabCase = require("lodash/kebabCase");
const data = require("../src/data/schools.json");

const getPriceTypes = (years) => {
  const firstYear = years[0];
  if (firstYear.price_instate_oncampus !== null) {
    return {
      stickerPriceType: "price_instate_oncampus",
      campusFlag: "campus",
    };
  }
  return {
    stickerPriceType: "price_instate_offcampus_nofamily",
    campusFlag: "offcampus",
  };
}

const getBrackets = (opts) => {
  const brackets = [
    "0_30000",
    "30001_48000",
    "48001_75000",
    "75001_110000",
    "110001",
  ];
  const { year, campusFlag } = opts;

  const netPricesByBracket = brackets.map((bracket) => {
    const limits = year[`min_max_diff_${bracket}_titleiv_privateforprofit_${campusFlag}`] || [];
    return [
      bracket,
      {
        price: year[`avg_net_price_${bracket}_titleiv_privateforprofit`],
        min: limits[0],
        max: limits[1],
      },
    ];
  });

  const averagePriceSum = netPricesByBracket.reduce((sum, b) => sum + (b[1].price || 0), 0);
  const averagePrice = averagePriceSum  / netPricesByBracket.length;

  return {
    average: {
      price: averagePrice,
    },
    ...Object.fromEntries(netPricesByBracket),
  };
};

const convertData = (schools) => {
  return schools.map((school) => {
    if (!school || !school.details) return null;

    const yearData = school.details.yearly_data;

    const gradDataYear = yearData.find((year) => (
      "grad_rate_associate_3years_total" in year
    ));

    const { stickerPriceType, campusFlag } = getPriceTypes(yearData);

    const years = yearData.map((year) => {
      const brackets = getBrackets({ year, campusFlag });
      return {
        year: year.year,
        startYear: +`20${year.year.slice(0, 2)}`,
        stickerPrice: {
          type: stickerPriceType,
          price: year[stickerPriceType],
        },
        netPricesByBracket: brackets,
      };
    });

    const maxYearData = yearData.reduce((max, year) => {
      if (year.startYear > max.startYear) {
        return year;
      }
      return max;
    });
    const maxYearBrackets = getBrackets({ year: maxYearData, campusFlag });
    const netPricesByBracket = Object.fromEntries(
      Object.entries(maxYearBrackets).map(([key, value]) => [
        key,
        value.price,
      ]),
    );

    const schoolIndex = {
      id: `${school.unitid}`,
      slug: kebabCase(school.schoolname),
      image: `https://picsum.photos/500/280?_=${school.unitid}`, // "/university-of-new-mexico.jpg",
      name: school.schoolname,
      alias: school.aliasname,
      city: school.details.city,
      state: school.stateabbr,
      hbcu: school.details.hbcu === 2,
      tribalCollege: school.details.tribal_college === 2,
      schoolControl: school.schoolcontrol,
      degreeLevel: school.degreetype,
      enrollment: school.enrollment1617,
      stickerPrice: {
        type: stickerPriceType,
        price: maxYearData[stickerPriceType],
      },
      netPricesByBracket,
    };

    return {
      ...schoolIndex,

      details: {
        id: schoolIndex.id,
        name: schoolIndex.name,
        slug: schoolIndex.slug,
        image: schoolIndex.image,
        city: schoolIndex.city,
        state: schoolIndex.state,
        hbcu: schoolIndex.hbcu,
        tribalCollege: schoolIndex.tribalCollege,
        schoolControl: schoolIndex.schoolControl,
        degreeLevel: schoolIndex.degreeLevel,
        stickerPrice: schoolIndex.stickerPrice,
        netPricesByBracket: schoolIndex.netPricesByBracket,
        stats: {
          percentSticker: school.details.enrollment.perc_sticker,
          percentAdmitted: school.details.enrollment.perc_admitted,
        },
        enrollment: {
          total: school.details.enrollment.total_enrollment,
          byRace: {
            unknown: school.details.enrollment.enrollment_unknown,
            multiple: school.details.enrollment.enrollment_twomore,
            white: school.details.enrollment.enrollment_white,
            hisp: school.details.enrollment.enrollment_hisp,
            nathawpacisl: school.details.enrollment.enrollment_nathawpacisl,
            black: school.details.enrollment.enrollment_black,
            asian: school.details.enrollment.enrollment_asian,
            amerindalasknat: school.details.enrollment.enrollment_amerindalasknat,
            nonresident: school.details.enrollment.enrollment_nonresident,
          },
          byGender: {
            men: school.details.enrollment.total_men,
            women: school.details.enrollment.total_women,
            unknown: school.details.enrollment.total_genderunknown,
            other: school.details.enrollment.total_anothergender,
          },
        },
        retention: {
          fullTime: gradDataYear.full_time_retention_rate,
          partTime: gradDataYear.part_time_retention_rate,
        },
        graduationBachelors: {
          total: gradDataYear.grad_rate_bachelors_6years_total,
          byRace: {
            unknown: gradDataYear.grad_rate_bachelors_6years_unknown,
            multiple: gradDataYear.grad_rate_bachelors_6years_twomore,
            white: gradDataYear.grad_rate_bachelors_6years_white,
            hisp: gradDataYear.grad_rate_bachelors_6years_hisp,
            nathawpacisl: gradDataYear.grad_rate_bachelors_6years_nathawpacisl,
            black: gradDataYear.grad_rate_bachelors_6years_black,
            asian: gradDataYear.grad_rate_bachelors_6years_asian,
            amerindalasknat: gradDataYear.grad_rate_bachelors_6years_amerindalasknat,
          },
        },
        graduationAssociates: {
          total: gradDataYear.grad_rate_associate_3years_total,
          byRace: {
            unknown: gradDataYear.grad_rate_associate_3years_unknown,
            multiple: gradDataYear.grad_rate_associate_3years_twomore,
            white: gradDataYear.grad_rate_associate_3years_white,
            hisp: gradDataYear.grad_rate_associate_3years_hisp,
            nathawpacisl: gradDataYear.grad_rate_associate_3years_nathawpacisl,
            black: gradDataYear.grad_rate_associate_3years_black,
            asian: gradDataYear.grad_rate_associate_3years_asian,
            amerindalasknat: gradDataYear.grad_rate_associate_3years_amerindalasknat,
          },
        },
        years,
      },
    };
  }).filter((school) => school !== null);
};

const fullData = convertData(data);
const indexData = fullData.map(({ details, ...school }) => school);

fs.writeFileSync(
  path.resolve(__dirname, "../src/data/schools_index.json"),
  JSON.stringify(indexData),
);

fullData.forEach((school) => {
  const { id, details } = school;
  fs.writeFileSync(
    path.resolve(__dirname, `../src/data/split/school_${id}.json`),
    JSON.stringify(details),
  );
});

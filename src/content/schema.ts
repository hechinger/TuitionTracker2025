import S from "string";
import type { AdminField, AdminState } from "@/types/admin";

const section = (s: Record<string, AdminField>) => {
  const fields = Object.entries(s).map(([key, field]) => ({
    ...field,
    key,
    label: S(key).humanize().s,
  }));
  return {
    type: "section" as const,
    key: "",
    label: "",
    fields,
  };
};

const txt = (s: string) => ({
  type: "copy" as const,
  key: "",
  label: "",
  defaultValue: s,
});

const str = (s: string) => ({
  type: "string" as const,
  key: "",
  label: "",
  defaultValue: s,
});

const richTxt = (s: string) => ({
  type: "richCopy" as const,
  key: "",
  label: "",
  defaultValue: s,
});

const img = () => ({
  type: "file" as const,
  key: "",
  label: "",
  accept: "image/*",
  defaultValue: undefined,
});

export const schema = section({
  GeneralPurpose: section({
    schoolControl: section({
      public: txt("Public"),
      private: txt("Private"),
      "for-profit": txt("For-profit"),
    }),
    degreeLevel: section({
      "2-year": txt("2-year"),
      "4-year": txt("4-year"),
    }),
    hbcu: txt("HBCU"),
    tribalCollege: txt("Tribal college"),
    incomeSelection: section({
      average: txt("any income"),
      "0_30000": txt("<$30K income"),
      "30001_48000": txt("$30K-$48K income"),
      "48001_75000": txt("$48K-$75K income"),
      "75001_110000": txt("$75K-$110K income"),
      "110001": txt(">$110K income"),
    }),
    demographicCategories: section({
      amerindalasknat: txt("American Indian/Alaska Native"),
      asian: txt("Asian"),
      black: txt("Black"),
      hisp: txt("Hispanic"),
      nathawpacisl: txt("Native Hawaiian/Pacific Islander"),
      white: txt("White"),
      multiple: txt("Multiple races"),
      nonresident: txt("Nonresident"),
      unknown: txt("Unknown race"),
    }),
  }),
  AdSlot: section({
    title: txt("Advertisement"),
  }),
  HeroSplash: section({
    subtitle: txt("Revealing the true cost of college"),
    sponsor: section({
      text: txt("In partnership with"),
      image: img(),
      imageAlt: txt("Big Charitable Group logo"),
    }),
  }),
  SearchBar: section({
    where: section({
      title: txt("Where"),
      placeholder: txt("Find a school or pick a state"),
      states: txt("States"),
      schools: txt("Schools"),
    }),
    more: section({
      title: txt("Total cost and more"),
      placeholder: txt("More search options"),
    }),
    advanced: section({
      cost: section({
        title: txt("What it will cost"),
        instructions: txt("Optionally select your hosuehold income to get a better price estimate"),
        anyIncome: txt("Any"),
        histogramTitle: txt("Net price for {INCOME} income"),
        minimum: txt("Minimum"),
        maximum: txt("Maximum"),
      }),
      schoolType: section({
        title: txt("School type"),
      }),
      degreeType: section({
        title: txt("Degree type"),
        anyType: txt("Any type"),
      }),
      other: section({
        title: txt("Other school attributes"),
        tribalCollege: txt("Tribal college"),
        hbcu: txt("Historically black (HBCU)"),
      }),
      controls: section({
        clear: txt("Clear all"),
        search: txt("Search"),
      }),
    }),
  }),
  Newsletter: section({
    title: txt("Subscribe to our newsletter"),
    blurb: txt("Keep up with the latest on higher education."),
    emailPlaceholder: txt("Email address"),
    submitButton: txt("Submit"),
    campaignId: str(""),
  }),
  ContactUs: section({
    title: txt("Have a question?"),
    blurb: txt("Send us a message if you can’t find what you’re looking for or if something doesn’t seem right."),
    url: str("https://hechingerreport.org/contact/"),
  }),
  Recirculation: section({
    title: txt("Read more"),
  }),
  About: section({
    title: txt("About"),
    copy: richTxt("<p>Lorem ipsum.</p>"),
  }),
  DownloadData: section({
    title: txt("Download the data"),
    copy: richTxt("<p>Lorem ipsum.</p>"),
  }),
  SearchResults: section({
    schoolsFound: txt("{FOUND} schools found out of {TOTAL_SCHOOLS}"),
    sortBy: section({
      title: txt("Sort by"),
      name: txt("Name"),
      priceAscending: txt("Price $ - $$$"),
      priceDescending: txt("Price $$$ - $"),
    }),
  }),
  SchoolComparison: section({
    title: txt("Compare your favorite schools"),
    savedSchools: section({
      title: txt("Your saved schools"),
      copyLink: txt("Copy link to saved schools"),
    }),
    compareSchools: section({
      title: txt("Compare schools"),
      clear: txt("Clear"),
      card: section({
        typeTitle: txt("Type"),
        stickerPriceTitle: txt("Sticker price"),
        netPriceTitle: txt("Average net price"),
      }),
      dragPrompt: txt("Click or drag a school here to compare"),
    }),
    priceTrend: section({
      title: txt("Historical price trend"),
      fallbackText: txt("Select schools above to see how their prices compare over time."),
      comparisonText: txt("See how the sticker price and net price trends of {SCHOOLS} compare."),
    }),
    graduationRate: section({
      title: txt("Graduation Rates"),
      fallbackText: txt("Select schools above to see how their graduation rates compare."),
      comparisonText: txt("Graduation rate can be a good indicator of how likely students are to complete their degree. See how the graduation rates of {SCHOOLS} compare."),
      graphLabel: txt("graduation rate"),
    }),
    schoolSizes: section({
      title: txt("School Sizes"),
      fallbackText: txt("Select schools above to see how their sizes compare."),
      comparisonText: txt("School size can have a large impact on a student’s college experience. See how the sizes of {SCHOOLS} compare."),
      students: txt("students"),
    }),
  }),
  SchoolPage: section({
    SchoolTopper: section({
      schoolInfo: txt("{SCHOOL_CONTROL} {DEGREE_LEVEL} school"),
      stickerPriceLabel: txt("projected sticker price"),
      netPriceLabel: txt("projected average net price for {INCOME}"),
      saveButton: section({
        saveThisSchool: txt("Save this school"),
        saved: txt("Saved"),
      }),
    }),
    Prices: section({
      priceTrendTemplate: richTxt("<p>This year at <strong>{SCHOOL_NAME}</strong>, we project that {STUDENT_TYPE} will pay <span class=\"highlight\">{NET_PRICE}</span>, while the advertised sticker price is {STICKER_PRICE}. That’s a difference of {PRICE_DIFFERENCE}.</p>"),
      priceTrendChartTitle: txt("Prices at {SCHOOL_NAME} over time for {INCOME}"),
      outOfStateStickerLabel: txt("out-of-state sticker price"),
      inStateStickerLabel: txt("in-state sticker price"),
      inStateNetPriceLabel: txt("in-state net price"),
      stickerLabel: txt("sticker price"),
      netPriceLabel: txt("net price"),
      upperEstimateLabel: txt("Upper net price estimation"),
      estimateLabel: txt("Projected net price"),
      lowerEstimateLabel: txt("Lower net price estimation"),
      incomeBracketTemplate: richTxt("<p>How much a student has to pay usually depends on their family's household income. At <strong>{SCHOOL_NAME}</strong> this year, {MAX_BRACKET_STUDENTS} will pay around {MAX_BRACKET_PRICE}, while {MIN_BRACKET_STUDENTS} will pay around {MIN_BRACKET_PRICE}. That's a difference of {PRICE_DIFFERENCE}.</p>"),
      incomeBracketChartTitle: txt("Net price by income bracket, {SCHOOL_YEAR} school year"),
      incomeBracketChartAxisLabel: txt("Family income bracket"),
    }),
    SchoolDetails: section({
      title: txt("School details"),
      location: txt("Located in {LOCATION}"),
      schoolType: txt("{SCHOOL_CONTROL} {DEGREE_LEVEL} school"),
      acceptanceRate: txt("{ACCEPTANCE_RATE} acceptance rate"),
      graduationRate: txt("{GRADUATION_RATE} graduation rate"),
      aboutTheData: richTxt("Lore ipsum dolor sec amet..."),
    }),
    GraduationRates: section({
      title: txt("Graduation Rates"),
      overallTemplate: section({
        template: richTxt("<p>A school’s graduation rate can help capture how likely a student is to complete their degree. At <strong>{SCHOOL_NAME}</strong>, roughly <span class=\"highlight\">{GRADUATION_RATE}</span> of students achieve their {DEGREE_TYPE} within {DEGREE_YEARS} of enrolling.</p>"),
        degreeTypes: section({
          "2-year": txt("associate’s degree"),
          "4-year": txt("bachelor’s degree"),
        }),
        degreeYearsCompletionLimit: section({
          "2-year": txt("four years"),
          "4-year": txt("six years"),
        }),
      }),
      overallBarLabel: txt("{GRADUATION_RATE} overall grad rate"),
      nationalAverageBarLabel: txt("Nat’l average: {NATIONAL_AVERAGE}"),
      demographicTemplate: richTxt("<p>Students of different demographic backgrounds often graduate at different rates, so it can be helpful to look beyond the overall graduation rate. This chart shows how students of different demographic backgrounds fare completing their degrees at <strong>{SCHOOL_NAME}</strong>.</p>"),
    }),
    StudentRetention: section({
      title: txt("Student Retention"),
      fullTimeStudents: txt("Full-time students"),
      partTimeStudents: txt("Part-time students"),
      chartLabel: txt("retention"),
      nationalAverageLabel: txt("Nat’l average: {NATIONAL_AVERAGE}"),
      template: richTxt("<p>Student retention, or how frequently enrolled students return to continue their degree after the first year or two, is another helpful indicator of how successful students at a school tend to be. At <strong>{SCHOOL_NAME}</strong>, about <span class=\"highlight\">{FULL_TIME_RETENTION_RATE}</span> of full-time students return to continue their degree.</p>"),
    }),
    StudentDemographics: section({
      title: txt("Student Demographics"),
      size: section({
        template: richTxt("<p>The size and makeup of a school’s student body can have a large impact on a student’s experience. <strong>{SCHOOL_NAME}</strong> has {ENROLLMENT} students, which puts it in the <strong>{SIZE_PERCENTILE} percentile</strong> of {SCHOOL_TYPE} schools.</p>"),
        students: txt("students"),
      }),
      gender: section({
        template: richTxt("<p>Different schools attract students from different backgrounds. At <strong>{SCHOOL_NAME}</strong>, about <strong>{GENDER_PERCENT_MAX}</strong> of students are {GENDER_NAME_MAX}.</p>"),
        genderTextNames: section({
          men: txt("male"),
          women: txt("female"),
          unknown: txt("of unknown gender"),
          other: txt("of a gender other than male or female"),
        }),
        genderChartLabels: section({
          men: txt("male"),
          women: txt("female"),
          other: txt("other"),
        }),
      }),
      race: section({
        template: richTxt("<p>The demographic makeup of a school’s student body also plays a big role in its campus culture. At <strong>{SCHOOL_NAME}</strong>, about <strong>{DEMOGRAPHIC_PERCENT_MAX}</strong> of students are {DEMOGRAPHIC_NAME_MAX}.</p>"),
        demographicTextNames: section({
          unknown: txt("of an unknown demographic background"),
          multiple: txt("of multiple races"),
          white: txt("white"),
          hisp: txt("hispanic"),
          nathawpacisl: txt("Native Hawaiian or Pacific Islanders"),
          black: txt("black"),
          asian: txt("Asian"),
          amerindalasknat: txt("American Indians or Alaskan Natives"),
          nonresident: txt("not U.S. residents"),
        }),
      }),
    }),
  }),
});

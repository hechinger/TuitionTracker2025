import S from "string";
import type { AdminField } from "@/types/admin";

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

export const contentSections = [
  {
    title: "Landing Page Content",
    description: "Content and configuration for basic information on the landing page.",
    fields: [
      {
        type: "fieldGroup",
        title: "Landing Page Branding",
        fields: [
          {
            type: "copy",
            title: "Page Subtitle",
            path: "HeroSplash.subtitle",
          },
          {
            type: "copy",
            title: "Sponsor Text",
            path: "HeroSplash.sponsor.text",
          },
          {
            type: "image",
            title: "Sponsor Image",
            help: "Sponsor information only shows up if there is a sponsor image",
            path: "HeroSplash.sponsor.image",
          },
          {
            type: "copy",
            title: "Sponsor Image Alt Text",
            path: "HeroSplash.sponsor.imageAlt",
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Landing Page About Section",
        fields: [
          {
            type: "copy",
            title: "About Section Title",
            path: "About.title",
          },
          {
            type: "richCopy",
            title: "About Section Copy",
            path: "About.copy",
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Landing Page Data Section",
        fields: [
          {
            type: "copy",
            title: "Data Section Title",
            path: "DownloadData.title",
          },
          {
            type: "richCopy",
            title: "Data Section Copy",
            path: "DownloadData.copy",
          },
        ],
      },
    ],
  },
  {
    title: "School Page Content",
    description: "Content and configuration for dynamic text on the school detail page.",
    fields: [
      {
        type: "fieldGroup",
        title: "Price Section",
        fields: [
          {
            type: "autotext",
            title: "Historical Price Trend Copy",
            path: "SchoolPage.Prices.priceTrendTemplate",
            variables: [
              {
                name: "SCHOOL_NAME",
                help: "The name of the displayed school",
                example: "Florida State University",
              },
              {
                name: "STUDENT_TYPE",
                help: "The name of the active income bracket",
                example: "students with household incomes under $30K",
              },
              {
                name: "NET_PRICE",
                help: "The net price students in the active income bracket will pay",
                example: "$24,365",
              },
              {
                name: "STICKER_PRICE",
                help: "The school’s sticker price",
                example: "$32,123",
              },
              {
                name: "PRICE_DIFFERENCE",
                help: "The difference between the sticker and net price",
                example: "$7,758",
              },
            ],
          },
          {
            type: "autotext",
            title: "Income Bracket Copy",
            path: "SchoolPage.Prices.incomeBracketTemplate",
            variables: [
              {
                name: "SCHOOL_NAME",
                help: "The name of the displayed school",
                example: "Florida State University",
              },
              {
                name: "STUDENT_TYPE",
                help: "The name of the active income bracket",
                example: "students with household incomes under $30K",
              },
              {
                name: "MIN_BRACKET_PRICE",
                help: "The lowest price across all brackets",
                example: "$3,156",
              },
              {
                name: "MAX_BRACKET_PRICE",
                help: "The highest price across all brackets",
                example: "$32,156",
              },
              {
                name: "MIN_BRACKET_STUDENTS",
                help: "The student type for the lowest-price bracket",
                example: "students with household incomes under $30K",
              },
              {
                name: "MAX_BRACKET_STUDENTS",
                help: "The student type for the highest-price bracket",
                example: "students with household incomes above $110K",
              },
              {
                name: "PRICE_DIFFERENCE",
                help: "The price difference between the lowest and highest bracket",
                example: "$29,000",
              },
            ],
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Graduation Rate Section",
        fields: [
          {
            type: "autotext",
            title: "Overall Graduation Rate Copy",
            path: "SchoolPage.GraduationRates.overallTemplate.template",
            variables: [
              {
                name: "SCHOOL_NAME",
                help: "The name of the displayed school",
                example: "Florida State University",
              },
              {
                name: "GRADUATION_RATE",
                help: "The school’s overall graduation rate",
                example: "72%",
              },
              {
                name: "DEGREE_TYPE",
                help: "The kind of degree offered by the school",
                example: "bachelor’s degree",
              },
              {
                name: "DEGREE_YEAR",
                help: "The 150% completion type of the degree type",
                example: "six years",
              },
            ],
          },
          {
            type: "autotext",
            title: "Demographic Graduation Rate Copy",
            path: "SchoolPage.GraduationRates.demographicTemplate",
            variables: [
              {
                name: "SCHOOL_NAME",
                help: "The name of the displayed school",
                example: "Florida State University",
              },
            ],
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Student Retention Section",
        fields: [
          {
            type: "autotext",
            title: "Student Retention Copy",
            path: "SchoolPage.StudentRetention.template",
            variables: [
              {
                name: "SCHOOL_NAME",
                help: "The name of the displayed school",
                example: "Florida State University",
              },
              {
                name: "FULL_TIME_RETENTION_RATE",
                help: "The school’s retention rate for full-time students",
                example: "87%",
              },
            ],
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Demographics Section",
        fields: [
          {
            type: "autotext",
            title: "School Size Copy",
            path: "SchoolPage.StudentDemographics.size.template",
            variables: [
              {
                name: "SCHOOL_NAME",
                help: "The name of the displayed school",
                example: "Florida State University",
              },
              {
                name: "ENROLLMENT",
                help: "The school’s total enrollment",
                example: "67,123",
              },
              {
                name: "SIZE_PERCENTILE",
                help: "The percentile this school’s size falls into for schools of similar type",
                example: "23rd",
              },
              {
                name: "SCHOOL_TYPE",
                help: "The type of school this is",
                example: "public, 4-year",
              },
            ],
          },
          {
            type: "autotext",
            title: "Gender Breakdown Copy",
            path: "SchoolPage.StudentDemographics.gender.template",
            variables: [
              {
                name: "SCHOOL_NAME",
                help: "The name of the displayed school",
                example: "Florida State University",
              },
              {
                name: "GENDER_NAME_MAX",
                help: "The name of the gender category with the largest share of students",
                example: "men",
              },
              {
                name: "GENDER_PERCENT_MAX",
                help: "The percentage held by the max gender",
                example: "52%",
              },
            ],
          },
          {
            type: "autotext",
            title: "Race Breakdown Copy",
            path: "SchoolPage.StudentDemographics.race.template",
            variables: [
              {
                name: "SCHOOL_NAME",
                help: "The name of the displayed school",
                example: "Florida State University",
              },
              {
                name: "DEMOGRAPHIC_NAME_MAX",
                help: "The name of the demographic category with the largest share of students",
                example: "white",
              },
              {
                name: "DEMOGRAPHIC_PERCENT_MAX",
                help: "The percentage held by the largest demographic group",
                example: "52%",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "General Purpose Content",
    description: "These labels are used throughout the application to refer to standard things like income brackets and demographic categories.",
    presentation: "collapsed",
    fields: [
      {
        type: "fieldGroup",
        title: "Income Bracket Selection Labels",
        fields: [
          {
            type: "copy",
            title: "2-year",
            path: "GeneralPurpose.degreeLevel.2-year",
          },
          {
            type: "copy",
            title: "4-year",
            path: "GeneralPurpose.degreeLevel.4-year",
          },
          {
             type: "copy",
             title: "any income",
             path: "GeneralPurpose.incomeSelection.average",
          },
          {
             type: "copy",
             title: "<$30K income",
             path: "GeneralPurpose.incomeSelection.0_30000",
          },
          {
             type: "copy",
             title: "$30K-$48K income",
             path: "GeneralPurpose.incomeSelection.30001_48000",
          },
          {
             type: "copy",
             title: "$48K-$75K income",
             path: "GeneralPurpose.incomeSelection.48001_75000",
          },
          {
             type: "copy",
             title: "$75K-$110K income",
             path: "GeneralPurpose.incomeSelection.75001_110000",
          },
          {
             type: "copy",
             title: ">$110K income",
             path: "GeneralPurpose.incomeSelection.110001",
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "School Control Labels",
        fields: [
          {
            type: "copy",
            title: "Public",
            path: "GeneralPurpose.schoolControl.public",
          },
          {
            type: "copy",
            title: "Private",
            path: "GeneralPurpose.schoolControl.private",
          },
          {
            type: "copy",
            title: "For-profit",
            path: "GeneralPurpose.schoolControl.for-profit",
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Degree Level Labels",
        fields: [
          {
            type: "copy",
            title: "2-year",
            path: "GeneralPurpose.degreeLevel.2-year",
          },
          {
            type: "copy",
            title: "4-year",
            path: "GeneralPurpose.degreeLevel.4-year",
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Demographic Category Labels",
        fields: [
          {
             type: "copy",
             title: "American Indian/Alaska Native",
             path: "GeneralPurpose.demographicCategories.amerindalasknat",
          },
          {
             type: "copy",
             title: "Asian",
             path: "GeneralPurpose.demographicCategories.asian",
          },
          {
             type: "copy",
             title: "Black",
             path: "GeneralPurpose.demographicCategories.black",
          },
          {
             type: "copy",
             title: "Hispanic",
             path: "GeneralPurpose.demographicCategories.hisp",
          },
          {
             type: "copy",
             title: "Native Hawaiian/Pacific Islander",
             path: "GeneralPurpose.demographicCategories.nathawpacisl",
          },
          {
             type: "copy",
             title: "White",
             path: "GeneralPurpose.demographicCategories.white",
          },
          {
             type: "copy",
             title: "Multiple races",
             path: "GeneralPurpose.demographicCategories.multiple",
          },
          {
             type: "copy",
             title: "Nonresident",
             path: "GeneralPurpose.demographicCategories.nonresident",
          },
          {
             type: "copy",
             title: "Unknown race",
             path: "GeneralPurpose.demographicCategories.unknown",
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Other School Info",
        fields: [
          {
            type: "copy",
            title: "HBCU",
            path: "GeneralPurpose.hbcu",
          },
          {
            type: "copy",
            title: "Tribal College",
            path: "GeneralPurpose.tribalCollege",
          },
        ],
      },
    ],
  },
  {
    title: "UI Details",
    description: "Content and configuration details for fundamental UI elements.",
    presentation: "collapsed",
    fields: [
      {
        type: "fieldGroup",
        title: "Newsletter Promo",
        fields: [
          {
            type: "copy",
            title: "Title",
            path: "Newsletter.title",
          },
          {
            type: "copy",
            title: "Promo Blurb",
            path: "Newsletter.blurb",
          },
          {
            type: "copy",
            title: "Email Input Placeholder",
            path: "Newsletter.emailPlaceholder",
          },
          {
            type: "copy",
            title: "Submit Button",
            path: "Newsletter.submitButton",
          },
          {
            type: "string",
            title: "Campaign ID",
            path: "Newsletter.campaignId",
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Contact Us",
        fields: [
          {
            type: "copy",
            title: "Title",
            path: "ContactUs.title",
          },
          {
            type: "copy",
            title: "Blurb",
            path: "ContactUs.blurb",
          },
          {
            type: "string",
            title: "Contact URL",
            path: "ContactUs.url",
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Recirculation",
        fields: [
          {
            type: "copy",
            title: "Title",
            path: "Recirculation.title",
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Search Results",
        fields: [
          {
            type: "copy",
            title: "Result Count",
            path: "SearchResults.schoolsFound",
            template: {
              FOUND: "142",
              TOTAL_SCHOOLS: "2,476",
            },
          },
          {
            type: "copy",
            title: "Sort By Label",
            path: "SearchResults.sortBy.title",
          },
          {
            type: "copy",
            title: "Sort By Name",
            path: "SearchResults.sortBy.name",
          },
          {
            type: "copy",
            title: "Sort By Price Ascending",
            path: "SearchResults.sortBy.priceAscending",
          },
          {
            type: "copy",
            title: "Sort By Price Descending",
            path: "SearchResults.sortBy.priceDescending",
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Ad Slots",
        fields: [
          {
            type: "copy",
            title: "Title",
            path: "AdSlot.title",
          },
        ],
      },
    ],
  },
];

export const schoolFields = [
  {
    type: "string",
    title: "Name",
    path: "name",
  },
  {
    type: "string",
    title: "Alias (for search)",
    path: "alias",
  },
  {
    type: "image",
    title: "Image",
    path: "image",
  },
  {
    type: "string",
    title: "City",
    path: "city",
  },
  {
    type: "string",
    title: "State",
    path: "state",
  },
  {
    type: "select",
    title: "School Control",
    path: "schoolControl",
    options: [
      {
        value: "public",
        label: "Public",
      },
      {
        value: "private",
        label: "Private",
      },
      {
        value: "for-profit",
        label: "For-profit",
      },
    ],
  },
  {
    type: "select",
    title: "Degree Level",
    path: "degreeLevel",
    options: [
      {
        value: "2-year",
        label: "2-year",
      },
      {
        value: "4-year",
        label: "4-year",
      },
    ],
  },
  {
    type: "boolean",
    title: "HBCU",
    path: "hbcu",
  },
  {
    type: "boolean",
    title: "Tribal College",
    path: "tribalCollege",
  },
];

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

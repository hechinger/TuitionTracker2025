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

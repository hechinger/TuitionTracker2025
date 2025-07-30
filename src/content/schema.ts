/**
 * This controls how fields show up in the admin content dashboard. The top-level
 * sections correspond to the tabs in the dashboard, and the field groups are
 * groups of related fields. Each individual field gets rendered with the `Field`
 * component in `src/admin/components/Field`, so the valid types are:
 *
 * - `string`: a simple text input for non-localized strings
 * - `copy`: a bit of localized text
 * - `richCopy`: multi-paragraph, localized text
 * - `autotext`: multi-paragraph, localized text with dynamic variables
 * - `select`: a select menu with explicit options
 * - `boolean`: a checkbox
 * - `image`: a file input to upload an imaage
 *
 * By setting `presentation` to `"collapsed"` on a field group, you can make that
 * group render pre-collapsed in the tool. That can be handy for more "advanced"
 * controls that likely won't be used with any kind of regularity.
 */
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
      {
        type: "fieldGroup",
        title: "Advanced: School Topper",
        presentation: "collapsed",
        fields: [
          {
            type: "copy",
            path: "SchoolPage.SchoolTopper.schoolInfo",
            title: "School info"
          },
          {
            type: "copy",
            path: "SchoolPage.SchoolTopper.stickerPriceLabel",
            title: "Sticker price label"
          },
          {
            type: "copy",
            path: "SchoolPage.SchoolTopper.netPriceLabel",
            title: "Net price label"
          },
          {
            type: "copy",
            path: "SchoolPage.SchoolTopper.saveButton.saveThisSchool",
            title: "Save button: save this school"
          },
          {
            type: "copy",
            path: "SchoolPage.SchoolTopper.saveButton.saved",
            title: "Save button: saved"
          },
          {
            type: "copy",
            path: "SchoolPage.SchoolTopper.noDataMessage",
            title: "No-data fallback message"
          },
          {
            type: "copy",
            path: "SchoolPage.SchoolTopper.collegeNavigatorLink",
            title: "No-data College Navigator link"
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Advanced: Prices",
        presentation: "collapsed",
        fields: [
          {
             type: "copy",
             path: "SchoolPage.Prices.priceTrendTemplateStudentsAverage",
             title: "Price trend template students: Average",
          },
          {
             type: "copy",
             path: "SchoolPage.Prices.priceTrendTemplateStudents030K",
             title: "Price trend template students: <$30K",
          },
          {
             type: "copy",
             path: "SchoolPage.Prices.priceTrendTemplateStudents3048",
             title: "Price trend template students: $30-48K",
          },
          {
             type: "copy",
             path: "SchoolPage.Prices.priceTrendTemplateStudents4875",
             title: "Price trend template students: $48-75K",
          },
          {
             type: "copy",
             path: "SchoolPage.Prices.priceTrendTemplateStudents75110",
             title: "Price trend template students: $75-110K",
          },
          {
             type: "copy",
             path: "SchoolPage.Prices.priceTrendTemplateStudents110",
             title: "Price trend template students: >$110",
          },
          {
            type: "copy",
            path: "SchoolPage.Prices.priceTrendChartTitle",
            title: "Price trend chart title"
          },
          {
            type: "copy",
            path: "SchoolPage.Prices.outOfStateStickerLabel",
            title: "Out-of-state sticker price label"
          },
          {
            type: "copy",
            path: "SchoolPage.Prices.inStateStickerLabel",
            title: "In-state sticker price label"
          },
          {
            type: "copy",
            path: "SchoolPage.Prices.stickerLabel",
            title: "Generic sticker price label"
          },
          {
            type: "copy",
            path: "SchoolPage.Prices.inStateNetPriceLabel",
            title: "In-state net price label"
          },
          {
            type: "copy",
            path: "SchoolPage.Prices.netPriceLabel",
            title: "Generic net price label"
          },
          {
            type: "copy",
            path: "SchoolPage.Prices.upperEstimateLabel",
            title: "Upper estimate label"
          },
          {
            type: "copy",
            path: "SchoolPage.Prices.estimateLabel",
            title: "Estimate label"
          },
          {
            type: "copy",
            path: "SchoolPage.Prices.lowerEstimateLabel",
            title: "Lower estimate label"
          },
          {
            type: "copy",
            path: "SchoolPage.Prices.incomeBracketChartTitle",
            title: "Income bracket chart title"
          },
          {
            type: "copy",
            path: "SchoolPage.Prices.incomeBracketChartAxisLabel",
            title: "Income bracket chart axis label"
          },
          {
            type: "copy",
            path: "SchoolPage.Prices.incomeBracketChartNoData",
            title: "Income bracket chart no-data label"
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Advanced: School Details",
        presentation: "collapsed",
        fields: [
          {
            type: "copy",
            path: "SchoolPage.SchoolDetails.title",
            title: "Title"
          },
          {
            type: "copy",
            path: "SchoolPage.SchoolDetails.location",
            title: "Location"
          },
          {
            type: "copy",
            path: "SchoolPage.SchoolDetails.schoolType",
            title: "School type"
          },
          {
            type: "copy",
            path: "SchoolPage.SchoolDetails.acceptanceRate",
            title: "Acceptance rate"
          },
          {
            type: "copy",
            path: "SchoolPage.SchoolDetails.graduationRate",
            title: "Graduation rate"
          },
          {
            type: "richCopy",
            path: "SchoolPage.SchoolDetails.aboutTheData",
            title: "About the data"
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Advanced: Graduation rates",
        presentation: "collapsed",
        fields: [
          {
            type: "copy",
            path: "SchoolPage.GraduationRates.title",
            title: "Title"
          },
          {
            type: "copy",
            path: "SchoolPage.GraduationRates.overallTemplate.degreeTypes.2-year",
            title: "Overall template variable: 2-year degree type"
          },
          {
            type: "copy",
            path: "SchoolPage.GraduationRates.overallTemplate.degreeTypes.4-year",
            title: "Overall template variable: 4-year degree type"
          },
          {
            type: "copy",
            path: "SchoolPage.GraduationRates.overallTemplate.degreeYearsCompletionLimit.2-year",
            title: "Overall template variable: 2-year completion years"
          },
          {
            type: "copy",
            path: "SchoolPage.GraduationRates.overallTemplate.degreeYearsCompletionLimit.4-year",
            title: "Overall template variable: 4-year completion years"
          },
          {
            type: "copy",
            path: "SchoolPage.GraduationRates.overallBarLabel",
            title: "Overall bar label"
          },
          {
            type: "copy",
            path: "SchoolPage.GraduationRates.nationalAverageBarLabel",
            title: "National average bar label"
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Advanced: Student Retention",
        presentation: "collapsed",
        fields: [
          {
            type: "copy",
            path: "SchoolPage.StudentRetention.title",
            title: "Title"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentRetention.fullTimeStudents",
            title: "Chart label: Full time students"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentRetention.partTimeStudents",
            title: "Chart label: Part time students"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentRetention.chartLabel",
            title: "Interior chart label: student retention"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentRetention.nationalAverageLabel",
            title: "National average label"
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Advanced: Student Demographics",
        presentation: "collapsed",
        fields: [
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.title",
            title: "Title"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.size.students",
            title: "Size label: students"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.gender.genderTextNames.men",
            title: "Gender template variable: men"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.gender.genderTextNames.women",
            title: "Gender template variable: women"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.gender.genderTextNames.unknown",
            title: "Gender template variable: unknown"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.gender.genderTextNames.other",
            title: "Gender template variable: other"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.gender.genderChartLabels.men",
            title: "Gender chart label: men"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.gender.genderChartLabels.women",
            title: "Gender chart label: women"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.gender.genderChartLabels.other",
            title: "Gender chart label: other"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.race.demographicTextNames.unknown",
            title: "Race template variable: Unknown"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.race.demographicTextNames.multiple",
            title: "Race template variable: Multiple"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.race.demographicTextNames.white",
            title: "Race template variable: White"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.race.demographicTextNames.hisp",
            title: "Race template variable: Hispanic"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.race.demographicTextNames.nathawpacisl",
            title: "Race template variable: Native Hawaiian/Pacific Islander"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.race.demographicTextNames.black",
            title: "Race template variable: Black"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.race.demographicTextNames.asian",
            title: "Race template variable: Asian"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.race.demographicTextNames.amerindalasknat",
            title: "Race template variable: American Indian/Alaskan Native"
          },
          {
            type: "copy",
            path: "SchoolPage.StudentDemographics.race.demographicTextNames.nonresident",
            title: "Race template variable: Nonresident"
          }
        ]
      }
    ],
  },
  {
    title: "School Comparison",
    description: "Content for the school comparison page.",
    fields: [
      {
        type: "fieldGroup",
        title: "Section Copy",
        fields: [
          {
            type: "copy",
            path: "SchoolComparison.priceTrend.title",
            title: "Price trend title"
          },
          {
            type: "richCopy",
            path: "SchoolComparison.priceTrend.fallbackText",
            title: "Price trend fallback text"
          },
          {
            type: "richCopy",
            path: "SchoolComparison.priceTrend.comparisonText",
            title: "Price trend comparison text"
          },
          {
            type: "copy",
            path: "SchoolComparison.graduationRate.title",
            title: "Graduation rate title"
          },
          {
            type: "richCopy",
            path: "SchoolComparison.graduationRate.fallbackText",
            title: "Graduation rate fallback text"
          },
          {
            type: "richCopy",
            path: "SchoolComparison.graduationRate.comparisonText",
            title: "Graduation rate comparison text"
          },
          {
            type: "copy",
            path: "SchoolComparison.schoolSizes.title",
            title: "School sizes title"
          },
          {
            type: "richCopy",
            path: "SchoolComparison.schoolSizes.fallbackText",
            title: "School sizes fallback text"
          },
          {
            type: "richCopy",
            path: "SchoolComparison.schoolSizes.comparisonText",
            title: "School sizes comparison text"
          },
        ],
      },
      {
        type: "fieldGroup",
        title: "Advanced",
        presentation: "collapsed",
        fields: [
          {
            type: "copy",
            path: "SchoolComparison.title",
            title: "Title"
          },
          {
            type: "copy",
            path: "SchoolComparison.savedSchools.title",
            title: "Saved schools title"
          },
          {
            type: "copy",
            path: "SchoolComparison.savedSchools.copyLink",
            title: "Saved schools copy link"
          },
          {
            type: "copy",
            path: "SchoolComparison.compareSchools.title",
            title: "Compare schools title"
          },
          {
            type: "copy",
            path: "SchoolComparison.compareSchools.clear",
            title: "Compare schools clear"
          },
          {
            type: "copy",
            path: "SchoolComparison.compareSchools.card.typeTitle",
            title: "Compare schools card type title"
          },
          {
            type: "copy",
            path: "SchoolComparison.compareSchools.card.stickerPriceTitle",
            title: "Compare schools card sticker price title"
          },
          {
            type: "copy",
            path: "SchoolComparison.compareSchools.card.netPriceTitle",
            title: "Compare schools card net price title"
          },
          {
            type: "copy",
            path: "SchoolComparison.compareSchools.dragPrompt",
            title: "Compare schools drag prompt"
          },
          {
            type: "copy",
            path: "SchoolComparison.graduationRate.graphLabel",
            title: "Graduation rate graph label"
          },
          {
            type: "copy",
            path: "SchoolComparison.schoolSizes.students",
            title: "School sizes students"
          }
        ]
      }
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
    title: "Search",
    description: "Content for the search UI.",
    fields: [
      {
        type: "fieldGroup",
        title: "Search Bar Labels",
        fields: [
          {
            type: "copy",
            path: "SearchBar.where.title",
            title: "Where title"
          },
          {
            type: "copy",
            path: "SearchBar.where.placeholder",
            title: "Where placeholder"
          },
          {
            type: "copy",
            path: "SearchBar.where.states",
            title: "Where states"
          },
          {
            type: "copy",
            path: "SearchBar.where.schools",
            title: "Where schools"
          },
          {
            type: "copy",
            path: "SearchBar.more.title",
            title: "More title"
          },
          {
            type: "copy",
            path: "SearchBar.more.placeholder",
            title: "More placeholder"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.cost.title",
            title: "Advanced cost title"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.cost.instructions",
            title: "Advanced cost instructions"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.cost.anyIncome",
            title: "Advanced cost any income"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.cost.histogramTitle",
            title: "Advanced cost histogram title"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.cost.minimum",
            title: "Advanced cost minimum"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.cost.maximum",
            title: "Advanced cost maximum"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.schoolType.title",
            title: "Advanced school type title"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.degreeType.title",
            title: "Advanced degree type title"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.degreeType.anyType",
            title: "Advanced degree type any type"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.other.title",
            title: "Advanced other title"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.other.tribalCollege",
            title: "Advanced other tribal college"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.other.hbcu",
            title: "Advanced other hbcu"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.controls.clear",
            title: "Advanced controls clear"
          },
          {
            type: "copy",
            path: "SearchBar.advanced.controls.search",
            title: "Advanced controls search"
          }
        ]
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
    ],
  },
  {
    title: "UI Details",
    description: "Content and configuration details for fundamental UI elements.",
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

/**
 * This defines the set of fields that are editable in the school admin.
 * We're keeping this pretty simple for now, because the main use case
 * is just for managing school images.
 */
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
    title: "Image Credit",
    path: "imageCredit",
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

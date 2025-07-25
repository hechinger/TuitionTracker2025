import "dotenv/config";
import { Pool } from "pg";
import { pipeline } from "../src/pipeline";

const year = 2023;
const dbUrl = process.env.DATABASE_URL;

const getValueIdSet = (nRows: number, nCols: number) => {
  return [...Array(nRows)].map((_, row) => {
    const base = (row * nCols) + 1;
    const ids = [...Array(nCols)].map((_, col) => `$${base + col}`);
    return `(${ids.join(", ")})`;
  }).join(", ");
};

const main = async () => {
  const db = new Pool({
    connectionString: dbUrl,
  });

  console.log("Creating table: schools");
  await db.query(`
    CREATE TABLE IF NOT EXISTS schools (
      db_id SERIAL PRIMARY KEY,
      id VARCHAR(10) UNIQUE NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      image VARCHAR(255),
      image_credit TEXT,
      name VARCHAR(255) NOT NULL,
      alias TEXT,
      city VARCHAR(255),
      state VARCHAR(255),
      zip VARCHAR(255),
      longitude VARCHAR(255),
      latitude VARCHAR(255),
      hbcu BOOLEAN,
      tribal_college BOOLEAN,
      sector VARCHAR(10),
      school_control VARCHAR(255),
      degree_level VARCHAR(255),
      admission_rate REAL,
      enrollment_total INT,
      enrollment_gender_men INT,
      enrollment_gender_women INT,
      enrollment_gender_unknown INT,
      enrollment_gender_other INT,
      enrollment_race_unknown INT,
      enrollment_race_multiple INT,
      enrollment_race_white INT,
      enrollment_race_hisp INT,
      enrollment_race_nathawpacisl INT,
      enrollment_race_black INT,
      enrollment_race_asian INT,
      enrollment_race_amerindalasknat INT,
      enrollment_race_nonresident INT,
      graduation_total REAL,
      graduation_race_unknown REAL,
      graduation_race_multiple REAL,
      graduation_race_white REAL,
      graduation_race_hisp REAL,
      graduation_race_nathawpacisl REAL,
      graduation_race_black REAL,
      graduation_race_asian REAL,
      graduation_race_amerindalasknat REAL,
      graduation_race_nonresident REAL,
      retention_full_time REAL,
      retention_part_time REAL,
      percent_sticker REAL
    );
  `);

  console.log("Creating table: prices");
  await db.query(`
    CREATE TABLE IF NOT EXISTS prices (
      db_id SERIAL PRIMARY KEY,
      school_id VARCHAR(10) NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
      year VARCHAR(10) NOT NULL,
      start_year INT,
      sticker_price_in_state DOUBLE PRECISION,
      sticker_price_out_state DOUBLE PRECISION,
      sticker_price_type VARCHAR(255),
      net_price_average DOUBLE PRECISION,
      net_price_average_min REAL,
      net_price_average_max REAL,
      net_price_bracket0 DOUBLE PRECISION,
      net_price_bracket0_min REAL,
      net_price_bracket0_max REAL,
      net_price_bracket1 DOUBLE PRECISION,
      net_price_bracket1_min REAL,
      net_price_bracket1_max REAL,
      net_price_bracket2 DOUBLE PRECISION,
      net_price_bracket2_min REAL,
      net_price_bracket2_max REAL,
      net_price_bracket3 DOUBLE PRECISION,
      net_price_bracket3_min REAL,
      net_price_bracket3_max REAL,
      net_price_bracket4 DOUBLE PRECISION,
      net_price_bracket4_min REAL,
      net_price_bracket4_max REAL,
      UNIQUE (school_id, year)
    );
  `);

  console.log("Creating table: national_averages");
  await db.query(`
    CREATE TABLE IF NOT EXISTS national_averages (
      db_id SERIAL PRIMARY KEY,
      school_control VARCHAR(255),
      average_key VARCHAR(255),
      value DOUBLE PRECISION,
      UNIQUE (school_control, average_key)
    );
  `);

  console.log("Creating table: content");
  await db.query(`
    CREATE TABLE IF NOT EXISTS content (
      db_id SERIAL PRIMARY KEY,
      locale VARCHAR(255),
      component VARCHAR(255) NOT NULL,
      path VARCHAR(255) NOT NULL,
      value TEXT
    );
  `);

  console.log("Creating table: recirculation_articles");
  await db.query(`
    CREATE TABLE IF NOT EXISTS recirculation_articles (
      db_id SERIAL PRIMARY KEY,
      page VARCHAR(255) NOT NULL,
      url TEXT NOT NULL,
      headline TEXT NOT NULL,
      image TEXT NOT NULL,
      image_alt TEXT
    );
  `);

  console.log("Creating table: recommended_schools");
  await db.query(`
    CREATE TABLE IF NOT EXISTS recommended_schools (
      db_id SERIAL PRIMARY KEY,
      page_order INT NOT NULL,
      title TEXT NOT NULL,
      title_spanish TEXT NOT NULL
    );
  `);

  console.log("Creating table: recommended_school_ids");
  await db.query(`
    CREATE TABLE IF NOT EXISTS recommended_school_ids (
      db_id SERIAL PRIMARY KEY,
      section_id INT NOT NULL REFERENCES recommended_schools(db_id) ON DELETE CASCADE,
      school_id VARCHAR(10) NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
      UNIQUE (section_id, school_id)
    );
  `);

  console.log("Running data pipeline...");
  await pipeline({ year });

  if (true) {
    console.log("Creating content records...");
    await db.query("TRUNCATE TABLE content;");

    const txt = (s: string) => ({ en: s, es: s });

    const content = {
      GeneralPurpose: {
        schoolControl:{
          public: txt("Public"),
          private: txt("Private"),
          "for-profit": txt("For-profit"),
        },
        degreeLevel: {
          "2-year": txt("2-year"),
          "4-year": txt("4-year"),
        },
        hbcu: txt("HBCU"),
        tribalCollege: txt("Tribal college"),
        incomeSelection: {
          average: txt("any income"),
          "0_30000": txt("<$30K income"),
          "30001_48000": txt("$30K-$48K income"),
          "48001_75000": txt("$48K-$75K income"),
          "75001_110000": txt("$75K-$110K income"),
          "110001": txt(">$110K income"),
        },
        demographicCategories: {
          amerindalasknat: txt("American Indian/Alaska Native"),
          asian: txt("Asian"),
          black: txt("Black"),
          hisp: txt("Hispanic"),
          nathawpacisl: txt("Native Hawaiian/Pacific Islander"),
          white: txt("White"),
          multiple: txt("Multiple races"),
          unknown: txt("Unknown race"),
          nonresident: txt("Nonresident"),
        },
      },
      AdSlot: {
        title: txt("Advertisement"),
      },
      HeroSplash: {
        subtitle: txt("Revealing the true cost of college"),
        sponsor: {
          text: txt("In partnership with"),
          image: "/partner.png",
          imageAlt: txt("Big Charitable Group logo"),
        },
      },
      SearchBar: {
        where: {
          title: txt("Where"),
          placeholder: txt("Find a school or pick a state"),
          states: txt("States"),
          schools: txt("Schools"),
        },
        more: {
          title: txt("Total cost and more"),
          placeholder: txt("More search options"),
        },
        advanced: {
          cost: {
            title: txt("What it will cost"),
            instructions: txt("Optionally select your hosuehold income to get a better price estimate"),
            anyIncome: txt("Any"),
            histogramTitle: txt("Net price for {INCOME} income"),
            minimum: txt("Minimum"),
            maximum: txt("Maximum"),
          },
          schoolType: {
            title: txt("School type"),
          },
          degreeType: {
            title: txt("Degree type"),
            anyType: txt("Any type"),
          },
          other: {
            title: txt("Other school attributes"),
            tribalCollege: txt("Tribal college"),
            hbcu: txt("Historically black (HBCU)"),
          },
          controls: {
            clear: txt("Clear all"),
            search: txt("Search"),
          },
        },
      },
      Newsletter: {
        title: txt("Sign up for our newsletter"),
        blurb: txt("We will help you understand the true cost of college."),
      },
      ContactUs: {
        title: txt("Have a question?"),
        blurb: txt("Get in touch with us if you have a question. Reach us at editor@hechingerreport.org."),
        url: "https://hechingerreport.org/contact/",
      },
      Recirculation: {
        title: txt("Read more"),
      },
      About: {
        title: txt("About"),
        copy: txt("<p>Tuition Tracker is an interactive tool that shows the relationship between published tuition and the actual costs of a given college. You can compare colleges by using your household income level to see what students like you have paid in the past and might be expected to pay now. The tool uses historical data to estimate of what you may pay to attend in the 2025-26 academic year.</p><p>You can also compare colleges based on graduation rates, which shows the likelihood of a student successfully completing their degree on time — a significant factor in affordability. For individual schools, you can also find out demographic information and retention rates.</p><p>Tuition Tracker uses cookies for optimal performance. Neither Tuition Tracker nor The Hechinger Report retain records of your personal data or answers to your income questions.</p>"),
      },
      DownloadData: {
        title: txt("Download the data"),
        copy: txt("<p>Tuition Tracker is powered by U.S. Department of Education data from IPEDS, the Integrated Postsecondary Education Data System, a service provided by the National Center for Education Statistics. The institutions analyzed are all U.S.-based, degree-granting colleges and universities that have first-time, full-time undergraduates.</p><p>Net prices are for first-time, full-time students (and, for public institutions, in-state students). The projected prices for each institution were calculated by taking the compound annual growth rate over the period of 2013-14 to 2023-24 using raw IPEDS data, then projecting that rate from the 2023-24 sticker price up to the 2025-26 academic year. Institutions without consecutive years of data going back to 2012-13 will not have projected prices. Average net price projections are determined by applying the discount rate for each income level in the last historical year these data were available. The percentage of students paying sticker price is derived from IPEDS data on first-time, first-year students.</p><p>Graduation rates and retention rates are calculated from the last five years of available data.</p><p>The data on institutional characteristics, acceptance rates and enrollment by race/ethnicity and gender are published as they are provided in IPEDS. The tool was last updated in April 2025.</p>"),
      },
      SearchResults: {
        schoolsFound: txt("{FOUND} schools found out of {TOTAL_SCHOOLS}"),
        sortBy: {
          title: txt("Sort by"),
          name: txt("Name"),
          priceAscending: txt("Price $ - $$$"),
          priceDescending: txt("Price $$$ - $"),
        },
      },
      SchoolComparison: {
        title: txt("Compare your favorite schools"),
        savedSchools: {
          title: txt("Your saved schools"),
          copyLink: txt("Copy link to saved schools"),
        },
        compareSchools: {
          title: txt("Compare schools"),
          clear: txt("Clear"),
          card: {
            typeTitle: txt("Type"),
            stickerPriceTitle: txt("Sticker price"),
            netPriceTitle: txt("Average net price"),
          },
          dragPrompt: txt("Click or drag a school here to compare"),
        },
        priceTrend: {
          title: txt("Historical price trend"),
          fallbackText: txt("Select schools above to see how their prices compare over time."),
          comparisonText: txt("See how the sticker price and net price trends of {SCHOOLS} compare."),
        },
        graduationRate: {
          title: txt("Graduation Rates"),
          fallbackText: txt("Select schools above to see how their graduation rates compare."),
          comparisonText: txt("Past graduation rates can be an indicator of how likely students are to complete their degree. See how the graduation rates of {SCHOOLS} compare."),
          graphLabel: txt("graduation rate"),
        },
        schoolSizes: {
          title: txt("School Sizes"),
          fallbackText: txt("Select schools above to see how their sizes compare."),
          comparisonText: txt("School size can have a large impact on a student’s college experience. See how the sizes of {SCHOOLS} compare."),
          students: txt("students"),
        },
      },
      SchoolPage: {
        SchoolTopper: {
          schoolInfo: txt("{SCHOOL_CONTROL} {DEGREE_LEVEL} school"),
          stickerPriceLabel: txt("projected sticker price"),
          netPriceLabel: txt("projected average net price for"),
          saveButton: {
            saveThisSchool: txt("Save this school"),
            saved: txt("Saved"),
          },
          noDataMessage: txt("This institution doesn’t have enough data for us to  calculate its sticker or net price. Learn more by visiting its official College Navigator page."),
          collegeNavigatorLink: txt("Go to College Navigator"),
        },
        Prices: {
          priceTrendTemplate: txt("<p>This year at <strong>{SCHOOL_NAME}</strong>, we project that on average {STUDENT_TYPE} will pay <u>{NET_PRICE}</u>, while the advertised price of attendance is {STICKER_PRICE}. That’s a difference of {PRICE_DIFFERENCE}.</p>"),
          priceTrendTemplateStudentsAverage: "students",
          priceTrendTemplateStudents030K: "students with incomes below $30K",
          priceTrendTemplateStudents3048: "students with incomes between $30K and $48K",
          priceTrendTemplateStudents4875: "students with incomes between $48K and $75K",
          priceTrendTemplateStudents75110: "students with incomes between $75K and $110K",
          priceTrendTemplateStudents110: "students with incomes over $110K",
          priceTrendChartTitle: txt("Prices at {SCHOOL_NAME} over time for"),
          outOfStateStickerLabel: txt("out-of-state sticker price"),
          inStateStickerLabel: txt("in-state sticker price"),
          inStateNetPriceLabel: txt("in-state net price"),
          stickerLabel: txt("sticker price"),
          netPriceLabel: txt("net price"),
          upperEstimateLabel: txt("Upper net price estimation"),
          estimateLabel: txt("Projected net price"),
          lowerEstimateLabel: txt("Lower net price estimation"),
          incomeBracketTemplate: txt("<p>How much a student actually pays usually depends, at least in part, on their family's household income. At <strong>{SCHOOL_NAME}</strong> this year, we project {MAX_BRACKET_STUDENTS} will pay around {MAX_BRACKET_PRICE}, while {MIN_BRACKET_STUDENTS} will pay around {MIN_BRACKET_PRICE}. That's a difference of {PRICE_DIFFERENCE}.</p>"),
          incomeBracketChartTitle: txt("Net price by income bracket, {SCHOOL_YEAR} school year"),
          incomeBracketChartAxisLabel: txt("Family income bracket"),
        },
        SchoolDetails: {
          title: txt("School details"),
          location: txt("Located in {LOCATION}"),
          schoolType: txt("{SCHOOL_CONTROL} {DEGREE_LEVEL} school"),
          acceptanceRate: txt("{ACCEPTANCE_RATE} acceptance rate"),
          graduationRate: txt("{GRADUATION_RATE} graduation rate"),
          aboutTheData: txt("<p>Historical sticker-price data up to 2022-23 and net price data up to 2021-22 come from the National Center for Education Statistics. Data for the following years are projected from Hechinger Report analyses. Projections are only provided for schools with complete historical data.</p><p>Net price is calculated by subtracting federal, state, local and institutional grants and scholarships from the total cost of attendance for first-time, full-time (and, at public universities, in-state) undergraduates. The data includes only families of students who received some form of federal student aid, including loans, since others are not tracked.</p><p>The shaded area provides a projected range of cost and is calculated using the highest and lowest discount rate in each income bracket over the last decade.</p>"),
        },
        GraduationRates: {
          title: txt("Graduation Rates"),
          overallTemplate: {
            template: txt("<p>A school’s graduation rate can indicate how likely a student is to complete their degree. At <strong>{SCHOOL_NAME}</strong>, over the last five years <u>{GRADUATION_RATE}</u> of students earned their {DEGREE_TYPE} within {DEGREE_YEARS} of enrolling.</p>"),
            degreeTypes: {
              "2-year": txt("associate’s degree"),
              "4-year": txt("bachelor’s degree"),
            },
            degreeYearsCompletionLimit: {
              "2-year": txt("four years"),
              "4-year": txt("six years"),
            },
          },
          overallBarLabel: txt("{GRADUATION_RATE} overall grad rate"),
          nationalAverageBarLabel: txt("Nat’l average"),
          demographicTemplate: txt("<p>Students from different demographic backgrounds often graduate at different rates, so it can be helpful to look beyond the overall graduation rate. This chart shows how students of different races and ethnicities fare earning their degrees at <strong>{SCHOOL_NAME}</strong>.</p>"),
        },
        StudentRetention: {
          title: txt("Student Retention"),
          fullTimeStudents: txt("Full-time students"),
          partTimeStudents: txt("Part-time students"),
          chartLabel: txt("retention"),
          nationalAverageLabel: txt("Nat’l average: {NATIONAL_AVERAGE}"),
          template: txt("<p>Student retention, or how often students return to continue their degree after completing their first year, is another helpful indicator. Over the last five years, at <strong>{SCHOOL_NAME}</strong>, about <u>{FULL_TIME_RETENTION_RATE}</u> of full-time students returned the following fall to continue their degree.</p>"),
        },
        StudentDemographics: {
          title: txt("Student Demographics"),
          size: {
            template: txt("<p>The size and demographic makeup of a school’s student body can have a large impact on a student’s experience. <strong>{SCHOOL_NAME}</strong> has {ENROLLMENT} students, which puts it in the {SIZE_PERCENTILE} percentile of {SCHOOL_TYPE} schools.</p>"),
            students: txt("students"),
          },
          gender: {
            template: txt("<p>About {GENDER_PERCENT_MAX} of students are {GENDER_NAME_MAX}.</p>"),
            genderTextNames: {
              men: txt("male"),
              women: txt("female"),
              unknown: txt("of unknown gender"),
              other: txt("of a gender other than male or female"),
            },
            genderChartLabels: {
              men: txt("male"),
              women: txt("female"),
              other: txt("other"),
            },
          },
          race: {
            template: txt("<p>And about {DEMOGRAPHIC_PERCENT_MAX} of students are {DEMOGRAPHIC_NAME_MAX}.</p>"),
            demographicTextNames: {
              unknown: txt("of an unknown demographic background"),
              multiple: txt("of multiple races"),
              white: txt("white"),
              hisp: txt("hispanic"),
              nathawpacisl: txt("Native Hawaiian or Pacific Islanders"),
              black: txt("black"),
              asian: txt("Asian"),
              amerindalasknat: txt("American Indians or Alaskan Natives"),
              nonresident: txt("not U.S. residents"),
            },
          },
        },
      },
    };
    const contentRows = [] as { locale: null | string, component: string, path: string, value: string }[];
    Object.entries(content).forEach(([component, info]) => {
      const decompose = (component: string, path: string, value: unknown) => {
        if (
          value
          && typeof value === "object"
          && "en" in value
          && "es" in value
          && Object.keys(value).length === 2
        ) {
          contentRows.push({
            locale: "en",
            component,
            path,
            value: `${value.en}`,
          });
          contentRows.push({
            locale: "es",
            component,
            path,
            value: `${value.es}`,
          });
          return;
        }

        if (typeof value === "string") {
          contentRows.push({
            locale: null,
            component,
            path,
            value,
          });
          return;
        }

        if (!value) return;

        const pref = path ? `${path}.` : "";
        Object.entries(value).forEach(([k, v]) => {
          decompose(component, `${pref}${k}`, v);
        });
      };
      decompose(component, "", info);
    });

    const valueIdSets = getValueIdSet(contentRows.length, 4);
    const values = contentRows.map((r) => [r.locale, r.component, r.path, r.value]).flat();
    const query = {
      text: `INSERT INTO content (locale, component, path, value) VALUES ${valueIdSets};`,
      values,
    };

    await db.query(query);
  }

  if (true) {
    console.log("Creating recirculation records...");
    await db.query("TRUNCATE TABLE recirculation_articles;");

    const recirc = [
      {
        page: "default",
        url: "https://hechingerreport.org/apprenticeships-for-high-schoolers-are-touted-as-the-next-big-thing-one-state-leads-the-way/",
        headline: "Apprenticeships for high schoolers are touted as the next big thing. One state leads the way",
        image: "https://i0.wp.com/hechingerreport.org/wp-content/uploads/2025/07/forte-INdiploma-9.jpg?fit=1200%2C1334&ssl=1",
      },
      {
        page: "default",
        url: "https://hechingerreport.org/proof-points-delay-release-naep-science/",
        headline: "Another Education Department delay: release of NAEP science scores",
        image: "https://i0.wp.com/hechingerreport.org/wp-content/uploads/2025/07/barshay_science_1-scaled.jpg?fit=1200%2C1707&ssl=1",
      },
      {
        page: "default",
        url: "http://hechingerreport.org/how-theater-can-teach-kids-about-climate-change/",
        headline: "How theater can teach kids about climate change",
        image: "https://hechingerreport.org/wp-content/uploads/2025/07/climate-newsletter-1-scaled.jpg",
      },
    ];

    const valueIdSets = getValueIdSet(recirc.length, 4);
    const values = recirc.map((r) => [r.page, r.url, r.headline, r.image]).flat();
    const query = {
      text: `INSERT INTO recirculation_articles (page, url, headline, image) VALUES ${valueIdSets};`,
      values,
    };

    await db.query(query);
  }

  if (true) {
    console.log("Creating recommended school records...");
    await db.query("TRUNCATE TABLE recommended_school_ids CASCADE;");
    await db.query("TRUNCATE TABLE recommended_schools CASCADE;");

    const sections = [
      {
        pageOrder: 0,
        title: "Big State Schools",
        titleSpanish: "Big State Schools",
        schoolIds: [
          "100724", // Alabama State University
          "134097", // Florida State University
          "134130", // University of Florida
          "187985", // University of New Mexico-Main Campus
          "236939", // Washington State University
        ],
      },
      {
        pageOrder: 1,
        title: "Liberal Arts Schools",
        titleSpanish: "Liberal Arts Schools",
        schoolIds: [
          "166027", // Harvard University
          "186131", // Princeton University
          "243744", // Stanford University
          "130794", // Yale University
          "182670", // Dartmouth College
        ],
      },
    ];

    for (const section of sections) {
      console.log("Creating section", section);
      const query = {
        text: `
          INSERT INTO recommended_schools
            (page_order, title, title_spanish)
          VALUES ($1, $2, $3);
        `,
        values: [section.pageOrder, section.title, section.titleSpanish],
      };
      await db.query(query);

      const { rows: [row] } = await db.query({
        text: "SELECT db_id FROM recommended_schools WHERE title = $1;",
        values: [section.title],
      });
      console.log("Creating school ID connections", row);
      const valueIds = getValueIdSet(section.schoolIds.length, 2);
      await db.query({
        text: `
          INSERT INTO recommended_school_ids
            (section_id, school_id)
          VALUES ${valueIds};
        `,
        values: section.schoolIds.map((s) => [row.db_id, s]).flat(),
      });
    }
  }
};

main();

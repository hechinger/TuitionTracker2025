import "dotenv/config";
import nodePath from "node:path";
import nodeFs from "node:fs";
import { Pool } from "pg";
import Papa from "papaparse";
import { put } from "@vercel/blob";
import { pipeline } from "../src/pipeline";

const year = 2023;
const dbUrl = process.env.DATABASE_URL;

const rootDir = nodePath.dirname(__dirname);

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

  // console.log("Running data pipeline...");
  // await pipeline({ year });

  if (true) {
    console.log("Creating content records...");
    await db.query("TRUNCATE TABLE content;");

    type ContentField = {
      component: string;
      path: string;
      locale: null | string;
      value: string;
    };
    const fields = [
      {
        component: "HeroSplash",
        path: "sponsor.image",
        locale: null,
        value: null,
      },
      {
        component: "ContactUs",
        path: "url",
        locale: null,
        value: "https://hechingerreport.org/contact/",
      },
    ] as ContentField[];

    type TranslationRow = {
      Path: string;
      English: string;
      Spanish: string;
    };
    const translationsFile = nodePath.join(rootDir, "src", "data", "translations.csv");
    const translationText = nodeFs.readFileSync(translationsFile).toString();
    const translations = Papa.parse<TranslationRow>(translationText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    translations.data.forEach((row) => {
      const [component, ...restPath] = row.Path.split(".");
      const path = restPath.join(".");
      fields.push({
        component,
        path,
        locale: "es",
        value: row.Spanish,
      });
      fields.push({
        component,
        path,
        locale: "en",
        value: row.English,
      });
    });

    const valueIdSets = getValueIdSet(fields.length, 4);
    const values = fields.map((r) => [r.locale, r.component, r.path, r.value]).flat();
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

  if (false) {
    console.log("Creating recommended school records...");
    await db.query("TRUNCATE TABLE recommended_school_ids CASCADE;");
    await db.query("TRUNCATE TABLE recommended_schools CASCADE;");

    const stateSchools = [
      {
        id: "110653", // University of California-Irvine
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/UCI_Student_Center.jpg/1600px-UCI_Student_Center.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:UCI_Student_Center.jpg">SinisterLizard</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons`,
      },
      {
        id: "178396", // University of Missouri-Columbia
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Jesse_Hall_Aerial.jpg/2560px-Jesse_Hall_Aerial.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Jesse_Hall_Aerial.jpg">Lectrician2</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons`,
      },
      {
        id: "163286", // University of Maryland-College Park
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Mckeldin_Mall.jpg/1599px-Mckeldin_Mall.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Mckeldin_Mall.jpg">Radhika Kshirsagar</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons`,
      },
      {
        id: "216339", // Temple University
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Temple_University_Performing_Arts_Center_in_2017.jpg/1600px-Temple_University_Performing_Arts_Center_in_2017.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Temple_University_Performing_Arts_Center_in_2017.jpg">ImagineerJC</a>, CC0, via Wikimedia Commons`,
      },
      {
        id: "209542", // Oregon State University
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/OSU_by_air.jpg?20080526185312",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:OSU_by_air.jpg">saml123</a>, <a href="https://creativecommons.org/licenses/by/2.0">CC BY 2.0</a>, via Wikimedia Commons`,
      },
      {
        id: "230728", // Utah State University
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Jon-M-Huntsman-School-of-Business-2016.jpg/1599px-Jon-M-Huntsman-School-of-Business-2016.jpg?20160613050640",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Jon-M-Huntsman-School-of-Business-2016.jpg">TaffyPuller1832</a>, Public domain, via Wikimedia Commons`,
      },
      {
        id: "100751", // The University of Alabama
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Amelia_Gayle_Gorgas_Library_and_Flags%2C_UA%2C_Tuscaloosa%2C_South_view_20160714_1.jpg/1600px-Amelia_Gayle_Gorgas_Library_and_Flags%2C_UA%2C_Tuscaloosa%2C_South_view_20160714_1.jpg?20160721135736",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Amelia_Gayle_Gorgas_Library_and_Flags,_UA,_Tuscaloosa,_South_view_20160714_1.jpg">DXR</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons`,
      },
      {
        id: "198464", // East Carolina University
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Joyner-Library-Clock-Tower.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Joyner-Library-Clock-Tower.jpg">Ecu2020</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons`,
      },
      {
        id: "204796", // Ohio State University-Main Campus
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Columbus%2C_Ohio_JJ_79.jpg/2560px-Columbus%2C_Ohio_JJ_79.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Columbus,_Ohio_JJ_79.jpg">Jsjessee</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0">CC BY-SA 2.0</a>, via Wikimedia Commons`,
      },
      {
        id: "183071", // University of New Hampshire at Manchester
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/University_of_New_Hampshire_Urban_Campus_%28August_2015%29.jpg?20151025202831",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:University_of_New_Hampshire_Urban_Campus_(August_2015).jpg">Millyard800</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons`,
      },
    ]

    const liberalArtsSchools = [
      {
        id: "115409", // Harvey Mudd College
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Hmc-dartmouth_entrance.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Hmc-dartmouth_entrance.jpg">The original uploader was Imagine at English Wikipedia.</a>, <a href="https://creativecommons.org/licenses/by/2.5">CC BY 2.5</a>, via Wikimedia Commons`,
      },
      {
        id: "212577", // Franklin and Marshall College
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/FnM_NewCollegeHouse.jpg/1600px-FnM_NewCollegeHouse.jpg?20200423115002",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:FnM_NewCollegeHouse.jpg">Pâmella Ferrari</a>, <a href="https://creativecommons.org/licenses/by/2.0">CC BY 2.0</a>, via Wikimedia Commons`,
      },
      {
        id: "156295", // Berea College
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/20140310_CampusShots_CAC_%284%29_%2813090607645%29.jpg/1920px-20140310_CampusShots_CAC_%284%29_%2813090607645%29.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:20140310_CampusShots_CAC_(4)_(13090607645).jpg">IMCBerea College</a>, <a href="https://creativecommons.org/licenses/by/2.0">CC BY 2.0</a>, via Wikimedia Commons`,
      },
      {
        id: "141060", // Spelman College
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/SCNew2.jpg/1600px-SCNew2.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:SCNew2.jpg">OneofaKind25</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons`,
      },
      {
        id: "211291", // Bucknell University
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Bertrand_Winter.jpg/1600px-Bertrand_Winter.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Bertrand_Winter.jpg">Dbl228</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons`,
      },
      {
        id: "189088", // Bard College
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Stone_Row_Dorm.jpg/1600px-Stone_Row_Dorm.jpg?20230531162044",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Stone_Row_Dorm.jpg">S6336s</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons`,
      },
      {
        id: "149781", // Wheaton College
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Wheaton_College_%28MA%29_Sign.jpg/1280px-Wheaton_College_%28MA%29_Sign.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Wheaton_College_(MA)_Sign.jpg">Kenneth C. Zirkel</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons`,
      },
      {
        id: "234207", // Washington and Lee University
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/2008-0831-WashingtonandLeeUniversity.jpg/1599px-2008-0831-WashingtonandLeeUniversity.jpg?20080910001325",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:2008-0831-WashingtonandLeeUniversity.jpg">Bobak Ha&#039;Eri</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>, via Wikimedia Commons`,
      },
      {
        id: "197133", // Vassar College
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Thompson_Library_%28Vassar_College%29.jpg/1600px-Thompson_Library_%28Vassar_College%29.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Thompson_Library_(Vassar_College).jpg">Noteremote</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0">CC BY-SA 3.0</a>, via Wikimedia Commons`,
      },
      {
        id: "164465", // Amherst College
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Amherst_College_Main_Quad.jpg?20100524002501",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Amherst_College_Main_Quad.jpg">David Emmerman</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>, via Wikimedia Commons`,
      },
      {
        id: "190099", // Colgate University
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Colgate_University_Campus_Aerial.jpg/1600px-Colgate_University_Campus_Aerial.jpg",
        imageCredit: `<a href="https://commons.wikimedia.org/wiki/File:Colgate_University_Campus_Aerial.jpg">Colgate University</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons`,
      },
    ]

    const sections = [
      {
        pageOrder: 0,
        title: "State Schools",
        titleSpanish: "Escuelas Públicas",
        schoolIds: stateSchools.map((school) => school.id),
      },
      {
        pageOrder: 1,
        title: "Liberal Arts Schools",
        titleSpanish: "Escuelas de Artes Liberales",
        schoolIds: liberalArtsSchools.map((school) => school.id),
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

    for (const school of [...stateSchools, ...liberalArtsSchools]) {
      console.log(`Fetching image for school ${school.id}...`);
      try {
        const rsp = await fetch(school.imageUrl);
        if (!rsp.ok || !rsp.body) {
          throw new Error(`Failed to download image for school ${school.id} from ${school.imageUrl}`);
        }
        const blob = await put(`school-image-${school.id}`, rsp.body, {
          access: "public",
          addRandomSuffix: true,
        });
        await db.query({
          text: "UPDATE schools SET image = $2, image_credit = $3 WHERE id = $1;",
          values: [school.id, blob.url, school.imageCredit],
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  }
};

main();

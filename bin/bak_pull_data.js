const fs = require("fs");
const { Readable } = require("stream");
const { finished } = require("stream/promises");
const path = require("path");
const AdmZip = require("adm-zip");
const Papa = require("papaparse");
const readXlsxFile = require("read-excel-file/node");
const get = require("lodash/get");
const kebabCase = require("lodash/kebabCase");

const rootDir = path.dirname(__dirname);
const ipedsDir = path.join(rootDir, "src", "data", "ipeds");

const fieldCrosswalk = {
  id: (dataset) => `${get(dataset, "HD.UNITID")}`,
  slug: (dataset) => kebabCase(get(dataset, "HD.INSTNM")),
  image: null,
  name: (dataset) => get(dataset, "HD.INSTNM"),
  alias: (dataset) => get(dataset, "HD.IALIAS"),
  city: (dataset) => get(dataset, "HD.CITY"),
  state: (dataset) => get(dataset, "HD.STABBR"),
  hbcu: (dataset) => `${get(dataset, "HD.HBCU")}` === "2",
  tribalCollege: (dataset) => `${get(dataset, "HD.TRIBAL")}` === "2",
  schoolControl: (dataset, { registerError }) => {
    const control = `${get(dataset, "HD.CONTROL")}`;
    if (control === "1") return "public";
    if (control === "2") return "private";
    if (control === "3") return "for-profit";
    registerError(`Unhandled school control value: ${control}`);
    return null;
  },
  degreeLevel: (dataset, { registerError }) => {
    const level = `${get(dataset, "HD.ILEVEL")}`;
    if (level === "1") return "4-year";
    if (level === "2") return "2-year";
    registerError(`Unhandled degree level value: ${control}`);
    return null;
  },
  // enrollment: (dataset) => get(dataset, x),
};

const datasetConfig = {
  year: 2023,
  files: [
    {
      file: "HD{YEAR}",
    },
    {
      file: "ADM{YEAR}",
    },
    {
      file: "EFFY{YEAR}",
    },
    {
      file: "GR{YEAR}",
      years: 5,
    },
    {
      file: "EF{YEAR}D",
      years: 5,
    },
    {
      file: "IC{YEAR}_AY",
      years: 11,
    },
    {
      file: "SFA{ACADEMIC_YEAR}",
      years: 11,
    },
  ],
};

const baseUrl = "https://nces.ed.gov/ipeds/datacenter/data/";
const fileTypes = [
  // "HD{YEAR}",
  // "IC{YEAR}",
  // "IC{YEAR}_AY",
  // "IC{YEAR}_PY",
  // "IC{YEAR}_CAMPUSES",
  // "FLAGS{YEAR}",
  // "EFFY{YEAR}",
  // "EFFY{YEAR}_DIST",
  // "EFFY{YEAR}_HS",
  // "EFIA{YEAR}",
  // "FLAGS{YEAR}",
  // "ADM{YEAR}",
  // "FLAGS{YEAR}",
  // "EF{YEAR}A",
  // "EF{YEAR}B",
  // "EF{YEAR}C",
  // "EF{YEAR}D",
  // "EF{YEAR}A_DIST",
  // "FLAGS{YEAR}",
  // "C{YEAR}_A",
  // "C{YEAR}_B",
  // "C{YEAR}_C",
  // "C{YEAR}DEP",
  // "FLAGS{YEAR}",
  // "SAL{YEAR}_IS",
  // "SAL{YEAR}_NIS",
  // "FLAGS{YEAR}",
  // "S{YEAR}_OC",
  // "S{YEAR}_SIS",
  // "S{YEAR}_IS",
  // "S{YEAR}_NH",
  // "FLAGS{YEAR}",
  // "EAP{YEAR}",
  // "FLAGS{YEAR}",
  // "F{ACADEMIC_YEAR}_F1A",
  // "F{ACADEMIC_YEAR}_F2",
  // "F{ACADEMIC_YEAR}_F3",
  // "FLAGS{YEAR}",
  // "SFA{ACADEMIC_YEAR}",
  // "SFAV{ACADEMIC_YEAR}",
  // "FLAGS{YEAR}",
  // "GR{YEAR}",
  // "GR{YEAR}_L2",
  // "GR{YEAR}_PELL_SSL",
  // "GR200_23",
  // "FLAGS{YEAR}",
  // "OM{YEAR}",
  // "FLAGS{YEAR}",
  // "AL{YEAR}",
  // "FLAGS{YEAR}",
  // "DRVIC{YEAR}",
  // "DRVADM{YEAR}",
  // "DRVEF{YEAR}",
  // "DRVEF12{YEAR}",
  // "DRVC{YEAR}",
  // "DRVGR{YEAR}",
  // "DRVOM{YEAR}",
  // "DRVF{YEAR}",
  // "DRVHR{YEAR}",
  // "DRVAL{YEAR}",
];

const downloadFile = async (url, destination) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(destination, { flags: "w" });
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
};

const fetchAndUnzipIpeds = async (fileName) => {
  const zipUrl = new URL(fileName, baseUrl);
  const zipFile = path.join(ipedsDir, fileName);

  if (!fs.existsSync(zipFile)) {
    await downloadFile(zipUrl, zipFile);
  }

  const zip = new AdmZip(zipFile);
  const [unzippedFile] = zip.getEntries().map((z) => path.join(ipedsDir, z.name));
  zip.extractAllTo(ipedsDir, true);

  return unzippedFile;
};

const parseCsv = async (fileName) => {
  return new Promise((resolve, reject) => {
    const text = fs.readFileSync(fileName, "utf8");
    Papa.parse(text, {
      header: true,
      complete: (results) => {
        resolve(results);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
};

const parseExcelSheet = async (fileName, opts = {}) => {
  const {
    header = false,
    sheet = 1,
  } = opts;
  const rows = await readXlsxFile(fileName, {
    sheet,
  });
  if (!header) return rows;
  const [names, ...dataRows] = rows;
  return dataRows.map((row) => Object.fromEntries(
    names.map((name, i) => [name, row[i]]),
  ));
};

const resolveFileTemplate = (template) => {
  const tokens = [
    {
      name: 'YEAR',
      value: `${year}`,
    },
    {
      name: 'ACADEMIC_YEAR',
      value: `${(year - 1).toString().slice(2)}${(year).toString().slice(2)}`,
    },
  ];
  return tokens.reduce((s, token) => {
    return {
      fileType: s.fileType.replace(`{${token.name}}`, token.value),
      fileId: s.fileType.replace(`{${token.name}}`, ""),
    };
  }, {
    fileType: template,
    fileId: template,
  });
};

const fetchIpedsFile = async (fileTemplate) => {
  const {
    fileType,
    fileId,
  } = resolveFileTemplate(fileTemplate);

  const [
    dataFile,
    dataDictionary,
  ] = await Promise.all([
    fetchAndUnzipIpeds(`${fileType}.zip`),
    fetchAndUnzipIpeds(`${fileType}_Dict.zip`),
  ]);

  const data = await parseCsv(dataFile);

  const shortDictionary = await parseExcelSheet(dataDictionary, {
    sheet: "varlist",
    header: true,
  });
  const longDictionary = await parseExcelSheet(dataDictionary, {
    sheet: "Description",
    header: true,
  });

  return {
    fileId,
    fileType,
    shortFields: shortDictionary.map((field) => ({
      variable: field.varname,
      description: field.varTitle,
    })),
    longFields: longDictionary.map((field) => ({
      variable: field.varname,
      description: field.longDescription,
    })),
    dictionary: shortDictionary,
    data,
  };
};

const main = async () => {
  fs.mkdirSync(ipedsDir, { recursive: true });

  for (const fileType of fileTypes) {
    const data = await fetchIpedsFile(fileType, year);
    console.log(data.shortFields);
  }
}

main();

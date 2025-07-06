const path = require("path");
const fs = require("fs");
const { Readable } = require("stream");
const { finished } = require("stream/promises");
const AdmZip = require("adm-zip");
const Papa = require("papaparse");
const readXlsxFile = require("read-excel-file/node");
const groupBy = require("lodash/groupBy");

const downloadFile = async ({ url, destination }) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(destination, { flags: "w" });
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
};

const fetchAndUnzipIpeds = async ({ file, baseUrl, dataDir }) => {
  try {
    const zipUrl = new URL(file, baseUrl);
    const zipFile = path.join(dataDir, file);

    if (!fs.existsSync(zipFile)) {
      await downloadFile({ url: zipUrl, destination: zipFile });
    }

    const zip = new AdmZip(zipFile);
    const [unzippedFile] = zip.getEntries().map((z) => path.join(dataDir, z.name));
    zip.extractAllTo(dataDir, true);

    return unzippedFile;
  } catch (error) {
    console.error(`Failed to download and unzip file: ${file}`);
    console.error(error);
    throw error;
  }
};

const parseCsv = async (fileName) => {
  return new Promise((resolve, reject) => {
    const text = fs.readFileSync(fileName, "utf8");
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
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

const resolveFileTemplate = ({ template, year }) => {
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

const fetchIpedsFile = async ({
  fileTemplate,
  year,
  baseUrl,
  dataDir,
}) => {
  const {
    fileType,
    fileId,
  } = resolveFileTemplate({ template: fileTemplate, year });

  const [
    dataFile,
    // dataDictionary,
  ] = await Promise.all([
    fetchAndUnzipIpeds({
      file: `${fileType}.zip`,
      baseUrl,
      dataDir,
    }),
    // fetchAndUnzipIpeds({
    //   file: `${fileType}_Dict.zip`,
    //   baseUrl,
    //   dataDir,
    // }),
  ]);

  const data = await parseCsv(dataFile);

  // const shortDictionary = await parseExcelSheet(dataDictionary, {
  //   sheet: "varlist",
  //   header: true,
  // });
  // const longDictionary = await parseExcelSheet(dataDictionary, {
  //   sheet: "Description",
  //   header: true,
  // });

  return {
    fileId,
    fileType,
    // shortFields: shortDictionary.map((field) => ({
    //   variable: field.varname,
    //   description: field.varTitle,
    // })),
    // longFields: longDictionary.map((field) => ({
    //   variable: field.varname,
    //   description: field.longDescription,
    // })),
    // dictionary: shortDictionary,
    data,
  };
};

const parseIpedsFile = async (config, context = {}) => {
  const {
    file,
    year,
    baseUrl,
    parseSchoolRows,
    schoolIdKey = "UNITID",
    years = 1,
  } = config;

  const {
    dataDir,
    registerError = () => {},
  } = context;

  const schoolYears = new Map();

  await [...Array(years)].reduce(async (promise, _, i) => {
    await promise;

    const data = await fetchIpedsFile({
      fileTemplate: file,
      year: year - i,
      baseUrl,
      dataDir,
    });
    const grouped = groupBy(data.data.data, schoolIdKey);

    Object.entries(grouped).forEach(([schoolId, rows]) => {
      const schoolYearRows = schoolYears.get(schoolId) || [];
      schoolYearRows.push(rows);
      schoolYears.set(schoolId, schoolYearRows);
    });
  }, Promise.resolve());

  return new Map([...schoolYears].map(([schoolId, data]) => {
    const parsedData = parseSchoolRows(data, {
      schoolId,
      registerError: (error) => registerError({
        schoolId,
        file,
        error,
      }),
    });
    return [schoolId, parsedData];
  }));
};

const parseIpedsDataset = async (config, opts = {}) => {
  const {
    dataDir,
  } = opts;

  const errors = [];
  const registerError = (err) => {
    errors.push(err);
  };

  const dataset = await config.files.reduce(async (promise, fileConfig) => {
    const partialDataset = await promise;

    const cfg = {
      file: fileConfig.file,
      year: config.year,
      baseUrl: config.baseUrl,
      parseSchoolRows: fileConfig.parseSchoolRows,
      schoolIdKey: fileConfig.schoolIdKey,
      years: fileConfig.years,
    };
    const fileSchools = await parseIpedsFile(cfg, { registerError, dataDir });

    [...fileSchools].forEach(([schoolId, schoolData]) => {
      const partialSchoolData = partialDataset.get(schoolId) || {};
      partialDataset.set(schoolId, { ...partialSchoolData, ...schoolData });
    });

    return partialDataset;
  }, Promise.resolve(new Map()));

  const entries = [...dataset]
    .map(([id, school]) => {
      const synthSchool = config.synthesizeSchool(school);
      if (!synthSchool) return null;
      return [id, synthSchool];
    })
    .filter(Boolean);

  return {
    dataset: Object.fromEntries(entries),
    errors,
  };
};

module.exports = {
  parseIpedsDataset,
};

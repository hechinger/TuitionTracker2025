const path = require("path");
const fs = require("fs");

const outFileName = "schools.json";
const missingFileName = "missing_schools.json";

const fetchJson = async (url) => {
  const headers = {
    Accepts: 'application/json',
  };
  try {
    const rsp = await fetch(url, { headers });

    if (!rsp.ok) {
      console.error(await rsp.text());
      console.error(url);
      throw new Error('Fetch error');
    }

    return rsp.json();
  } catch(error) {
    console.error(error);
    console.log(url);
    return null;
  }
};

const fetchSchool = async (id) => {
  const url = `https://www.tuitiontracker.org/data/school-data-2024-04/${id}.json`;
  return fetchJson(url);
};

const getSchoolId = (school) => `${school.unitid}`;

const main = async () => {
  const formData = await fetchJson("https://www.tuitiontracker.org/data/form-data.json");

  const groupSize = 10;
  const schoolGroups = formData.reduce((groups, school) => {
    if (groups[groups.length - 1].length >= groupSize) {
      groups.push([]);
    }
    groups[groups.length - 1].push(school);
    return groups;
  }, [[]]);

  const schools = new Map();
  const missingSchools = [];
  await schoolGroups.reduce(async (promise, group) => {
    await promise;
    const details = await Promise.all(group.map((school) => fetchSchool(getSchoolId(school))));
    details.forEach((school, i) => {
      if (school) {
        schools.set(getSchoolId(school), school);
      } else {
        missingSchools.push(group[i]);
      }
    });
  }, Promise.resolve());

  const fullData = formData.map((school) => {
    const details = schools.get(getSchoolId(school));

    if (!details) {
      console.error(`School not found: [${getSchoolId(school)}] ${school.schoolname}`);
      return null;
    }

    return {
      ...school,
      details,
    };
  });

  const pubDir = path.resolve(__dirname, path.join("..", "public"));
  const dataFile = path.join(pubDir, outFileName);
  const missingFile = path.join(pubDir, missingFileName);

  fs.writeFileSync(dataFile, JSON.stringify(fullData, null, 2));
  fs.writeFileSync(missingFile, JSON.stringify(missingSchools, null, 2));
};

main();

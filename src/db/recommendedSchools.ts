import type { SchoolIndex, RecommendationSectionAdmin } from "@/types";
import { queryRows, run } from "./pool";
import { getValueIdSet } from "./getValueIdSet";
import { getSchoolsIndex } from "./schools";

export type RecommendedSchoolsRow = {
  db_id: number;
  page_order: number;
  title: string;
  title_spanish: string;
  school_id: string;
};

export type RecommendedSchoolsSection = {
  db_id: number;
  page_order: number;
  title: string;
  title_spanish: string;
  schools: SchoolIndex[];
};

export const getRecommendedSchoolSlugs = async () => {
  const slugs = await queryRows<{ slug: string }>(`
    SELECT slug
    FROM recommended_school_ids
    INNER JOIN schools
    ON recommended_school_ids.school_id = schools.id;
  `);
  return slugs;
};

export const getRecommendedSchools = async () => {
  const sectionSchools = await queryRows<RecommendedSchoolsRow>(`
    SELECT recommended_schools.db_id, page_order, title, title_spanish, school_id
    FROM recommended_schools
    INNER JOIN recommended_school_ids
    ON recommended_schools.db_id = recommended_school_ids.section_id;
  `);

  const ids = sectionSchools.map((s) => s.school_id);
  const schools = await getSchoolsIndex({
    schoolIds: ids,
  });
  const schoolsById = new Map(schools.map((school) => [
    school.id,
    school,
  ]));

  const sections = new Map<number, RecommendedSchoolsSection>();
  sectionSchools.forEach((row) => {
    const { db_id, school_id, ...rest } = row;
    const section = sections.get(db_id) || {
      db_id,
      ...rest,
      schools: [],
    };
    section.schools.push(schoolsById.get(school_id)!);
    sections.set(db_id, section);
  });

  const sortedSections = Array.from(sections.values())
    .map((section, i) => ({
      dbId: section.db_id,
      key: `section-${i}`,
      pageOrder: section.page_order,
      title: {
        en: section.title,
        es: section.title_spanish,
      },
      schools: section.schools,
    }))
    .sort((a, b) => a.pageOrder - b.pageOrder);

  return sortedSections;
};

export const setRecommendedSchools = async (sections: RecommendationSectionAdmin[]) => {
  const newIds = new Set(sections.map((s) => s.dbId).filter(Boolean));

  const existing = await getRecommendedSchools();
  const toDelete = existing.map((d) => d.dbId).filter((id) => !newIds.has(id));

  const updates = [] as RecommendationSectionAdmin[];
  const creations = [] as RecommendationSectionAdmin[];
  sections.forEach((section) => {
    if (section.dbId) {
      updates.push(section);
    } else {
      creations.push(section);
    }
  });

  for (const creation of creations) {
    await run({
      text: `
        INSERT INTO recommended_schools
          (page_order, title, title_spanish)
        VALUES ($1, $2, $3);
      `,
      values: [creation.pageOrder, creation.title.en, creation.title.es],
    });
    const [row] = await queryRows({
      text: `
        SELECT db_id FROM recommended_schools
        WHERE page_order = $1 AND title = $2;
      `,
      values: [creation.pageOrder, creation.title.en],
    });
    const creationSchoolIds = creation.schoolIds.map((id) => ({
      sectionId: row.db_id,
      schoolId: id,
    }));
    await run({
      text: `
        INSERT INTO recommended_school_ids
          (section_id, school_id)
        VALUES ${getValueIdSet({
          rows: creationSchoolIds,
          columns: ["section_id", "school_id"],
        })};
      `,
      values: creationSchoolIds.map((s) => [s.sectionId, s.schoolId]).flat(),
    });
  }

  if (updates.length > 0) {
    const updateValueIds = getValueIdSet({
      rows: updates,
      columns: ["db_id", "page_order", "title", "title_spanish"],
    });
    const updateValues = updates.map((row) => [
      row.dbId,
      row.pageOrder,
      row.title.en,
      row.title.es,
    ]).flat();
    const updateQuery = {
      text: `
        INSERT INTO recommended_schools
          (db_id, page_order, title, title_spanish)
        VALUES ${updateValueIds}
        ON CONFLICT (db_id) DO UPDATE
        SET
          page_order = EXCLUDED.page_order,
          title = EXCLUDED.title,
          title_spanish = EXCLUDED.title_spanish;
      `,
      values: updateValues,
    };
    await run(updateQuery);

    await run({
      text: `
        DELETE FROM recommended_school_ids
        WHERE section_id IN (${updates.map((_, i) => `$${i + 1}`).join(", ")});
      `,
      values: updates.map((u) => u.dbId),
    });
    const updateSchoolIds = updates.map((row) => row.schoolIds.map((s) => ({
      sectionId: row.dbId,
      schoolId: s,
    }))).flat();
    await run({
      text: `
        INSERT INTO recommended_school_ids
          (section_id, school_id)
        VALUES ${getValueIdSet({
          rows: updateSchoolIds,
          columns: ["section_id", "school_id"],
        })}
        ON CONFLICT DO NOTHING;
      `,
      values: updateSchoolIds.map((row) => [row.sectionId, row.schoolId]).flat(),
    });
  }

  if (toDelete.length > 0) {
    const valueIds = toDelete.map((_, i) => `$${i + 1}`);
    const deleteQuery = {
      text: `
        DELETE FROM recommended_schools
        WHERE db_id IN (${valueIds.join(", ")});
      `,
      values: toDelete,
    };
    await run(deleteQuery);
  }
};

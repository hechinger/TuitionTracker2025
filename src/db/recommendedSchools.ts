import type { RecommendationSection } from "@/types";
import { queryRows, run } from "./pool";
import { getValueIdSet } from "./getValueIdSet";

export type RecommendedSchoolsRow = {
  db_id: number;
  page_order: number;
  title: string;
  title_spanish: string;
  school_ids: string[];
};

export const getRecommendedSchools = async () => {
  const sections = await queryRows<RecommendedSchoolsRow>(`
    SELECT db_id, page_order, title, title_spanish, school_ids
    FROM recommended_schools;
  `);

  const sortedSections = sections
    .map((section, i) => ({
      dbId: section.db_id,
      key: `section-${i}`,
      pageOrder: section.page_order,
      title: {
        en: section.title,
        es: section.title_spanish,
      },
      schoolIds: section.school_ids,
    }))
    .sort((a, b) => a.pageOrder - b.pageOrder);

  return sortedSections;
};

export const setRecommendedSchools = async (sections: RecommendationSection[]) => {
  const newIds = new Set(sections.map((s) => s.dbId).filter(Boolean));

  const existing = await getRecommendedSchools();
  const toDelete = existing.map((d) => d.dbId).filter((id) => !newIds.has(id));

  const updates = [] as RecommendationSection[];
  const creations = [] as RecommendationSection[];
  sections.forEach((section) => {
    if (section.dbId) {
      updates.push(section);
    } else {
      creations.push(section);
    }
  });

  if (creations.length > 0) {
    const creationValueIds = getValueIdSet({
      rows: creations,
      columns: ["page_order", "title", "title_spanish", "school_ids"],
    });
    const creationValues = creations.map((row) => [
      row.pageOrder,
      row.title.en,
      row.title.es,
      row.schoolIds,
    ]).flat();
    const creationQuery = {
      text: `
        INSERT INTO recommended_schools
          (page_order, title, title_spanish, school_ids)
        VALUES ${creationValueIds};
      `,
      values: creationValues,
    };
    await run(creationQuery);
  }

  if (updates.length > 0) {
    const updateValueIds = getValueIdSet({
      rows: creations,
      columns: ["db_id", "page_order", "title", "title_spanish", "school_ids"],
    });
    const updateValues = updates.map((row) => [
      row.dbId,
      row.pageOrder,
      row.title.en,
      row.title.es,
      row.schoolIds,
    ]).flat();
    const updateQuery = {
      text: `
        INSERT INTO recommended_schools
          (db_id, page_order, title, title_spanish, school_ids)
        VALUES ${updateValueIds}
        ON CONFLICT (db_id) DO UPDATE
        SET
          page_order = EXCLUDED.page_order,
          title = EXCLUDED.title,
          title_spanish = EXCLUDED.title_spanish,
          school_ids = EXCLUDED.school_ids;
      `,
      values: updateValues,
    };
    await run(updateQuery);
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

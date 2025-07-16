import { queryRows } from "./pool";

export type RecommendedSchoolsRow = {
  db_id: number;
  page_order: number;
  title: string;
  title_spanish: string;
  school_ids: string[];
};

type Row = Omit<RecommendedSchoolsRow, "db_id">;

export const getRecommendedSchools = async () => {
  const sections = await queryRows<Row>(`
    SELECT page_order, title, title_spanish, school_ids FROM recommended_schools;
  `);

  const sortedSections = sections
    .map((section, i) => ({
      key: `section-${i}`,
      pageOrder: section.page_order,
      title: {
        english: section.title,
        spanish: section.title_spanish,
      },
      schoolIds: section.school_ids,
    }))
    .sort((a, b) => a.pageOrder - b.pageOrder);

  return sortedSections;
};

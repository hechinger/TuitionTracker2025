import { queryRows, run } from "./pool";
import { getValueIdSet } from "./getValueIdSet";

export type RecirculationArticlesRow = {
  db_id: number;
  page: string;
  url: string;
  headline: string;
  image: string;
  image_alt: string | null;
};

export type Article = {
  dbId?: number;
  page: string;
  url: string;
  headline: string;
  image: string;
  imageAlt?: string | null;
};

export const getRecirculationArticles = async (opts: {
  page?: string;
} = {}) => {
  const {
    page = "default",
  } = opts;

  // Get the articles for the specified page, always pulling default articles
  const articles = await queryRows<RecirculationArticlesRow>({
    text: `
      SELECT db_id, page, url, headline, image, image_alt
      FROM recirculation_articles
      WHERE page = $1 OR page = 'default';
    `,
    values: [page],
  });

  const sortedArticles = articles
    .map((article) => ({
      dbId: article.db_id,
      page: article.page,
      url: article.url,
      headline: article.headline,
      image: article.image,
      imageAlt: article.image_alt,
    }))
    .sort((a, b) => {
      const aValue = (a.page === "default") ? 1 : 0;
      const bValue = (b.page === "default") ? 1 : 0;
      return aValue - bValue;
    });

  return sortedArticles;
};

export const setRecirculationArticles = async (articles: Article[]) => {
  const newIds = new Set(articles.map((a) => a.dbId).filter(Boolean));

  const existing = await queryRows<Pick<RecirculationArticlesRow, "db_id">>(`
    SELECT db_id
    FROM recirculation_articles;
  `);
  const toDelete = existing.map((d) => d.db_id).filter((id) => !newIds.has(id));

  const updates = [] as Article[];
  const creations = [] as Article[];
  articles.forEach((article) => {
    if (article.dbId) {
      updates.push(article);
    } else {
      creations.push(article);
    }
  });

  if (creations.length > 0) {
    const creationValueIds = getValueIdSet({
      rows: creations,
      columns: ["page", "url", "headline", "image", "image_alt"],
    });
    const creationValues = creations.map((row) => [
      row.page,
      row.url,
      row.headline,
      row.image,
      row.imageAlt,
    ]).flat();
    const creationQuery = {
      text: `
        INSERT INTO recirculation_articles
          (page, url, headline, image, image_alt)
        VALUES ${creationValueIds};
      `,
      values: creationValues,
    };
    await run(creationQuery);
  }

  if (updates.length > 0) {
    const updateValueIds = getValueIdSet({
      rows: updates,
      columns: ["db_id", "page", "url", "headline", "image", "image_alt"],
    });
    const updateValues = updates.map((row) => [
      row.dbId,
      row.page,
      row.url,
      row.headline,
      row.image,
      row.imageAlt,
    ]).flat();
    const updateQuery = {
      text: `
        INSERT INTO recirculation_articles
          (db_id, page, url, headline, image, image_alt)
        VALUES ${updateValueIds}
        ON CONFLICT (db_id) DO UPDATE
        SET
          page = EXCLUDED.page,
          url = EXCLUDED.url,
          headline = EXCLUDED.headline,
          image = EXCLUDED.image,
          image_alt = EXCLUDED.image_alt
      `,
      values: updateValues,
    };
    await run(updateQuery);
  }

  if (toDelete.length > 0) {
    const valueIds = toDelete.map((_, i) => `$${i + 1}`);
    const deleteQuery = {
      text: `
        DELETE FROM recirculation_articles
        WHERE db_id IN (${valueIds.join(", ")});
      `,
      values: toDelete,
    };
    await run(deleteQuery);
  }
};

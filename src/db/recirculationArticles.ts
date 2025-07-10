import { pool } from "./pool";

export type RecirculationArticlesRow = {
  db_id: number;
  page: string;
  url: string;
  headline: string;
  image: string;
  image_alt: string | null;
};

type Row = Omit<RecirculationArticlesRow, "db_id">;

export const getRecirculationArticles = async (opts: {
  page?: string;
} = {}) => {
  const {
    page = "default",
  } = opts;

  // Get the articles for the specified page, always pulling default articles
  const articles = await pool.query<Row>({
    text: `
      SELECT page, url, headline, image, image_alt
      FROM recirculation_articles
      WHERE page = $1 OR page = 'default';
    `,
    values: [page],
  });

  const sortedArticles = articles.rows
    .map((article) => ({
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

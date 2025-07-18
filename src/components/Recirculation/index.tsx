"use client";

import Well from "@/components/Well";
import { useContent } from "@/hooks/useContent";
import type { RecirculationArticle } from "@/types";
import styles from "./styles.module.scss";

/**
 * The recirculation module that promotes other articles from
 * hechingerreport.org.
 * 
 * @param props.articles
 *   The list of articles to link to
 */
export default function Recirculation(props: {
  articles?: RecirculationArticle[];
}) {
  const {
    articles,
  } = props;

  const content = useContent();

  if (!articles) return null;

  return (
    <div className={styles.recirculation}>
      <Well>
        <h2 className={styles.title}>
          {content("Recirculation.title")}
        </h2>

        <div className={styles.articles}>
          {articles.map((article, i) => (
            <a
              key={i}
              className={styles.article}
              href={article.url}
            >
              <img
                className={styles.img}
                src={article.image}
                alt={article.imageAlt || ""}
              />
              <div className={styles.headline}>
                {article.headline}
              </div>
            </a>
          ))}
        </div>
      </Well>
    </div>
  );
}

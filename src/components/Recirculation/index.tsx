"use client";

import Well from "@/components/Well";
import type { RecirculationArticle } from "@/types";
import styles from "./styles.module.scss";

const testArticles = [
  {
    url: "https://hechingerreport.org/",
    headline: "Test recirculation article one",
    image: "https://picsum.photos/500/280?_=recirc1",
    imageAlt: "",
  },
  {
    url: "https://hechingerreport.org/",
    headline: "Another est recirculation article",
    image: `https://picsum.photos/500/280?_=recirc2`,
    imageAlt: "",
  },
  {
    url: "https://hechingerreport.org/",
    headline: "The third and final test article",
    image: `https://picsum.photos/500/280?_=recirc3`,
    imageAlt: "",
  },
];

export default function Recirculation(props: {
  articles?: RecirculationArticle[];
}) {
  const {
    articles = testArticles,
  } = props;

  return (
    <div className={styles.recirculation}>
      <Well>
        <h2 className={styles.title}>
          Read more
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
                alt={article.imageAlt}
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

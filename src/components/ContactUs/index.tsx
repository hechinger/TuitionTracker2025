"use client";

import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { useContent } from "@/hooks/useContent";
import Well from "@/components/Well";
import styles from "./styles.module.scss";

export default function ContactUs() {
  const content = useContent();

  return (
    <Well width="narrow" section>
      <div className={styles.wrapper}>
        <a
          href={content("ContactUs.url") || "https://hechingerreport.org/contact/"}
          target="_blank"
          rel="noopener"
          className={styles.contactUs}
        >
          <div className={styles.icon}>
            <PaperPlaneTiltIcon />
          </div>
          <h2>
            {content("ContactUs.title")}
          </h2>
          <p>
            {content("ContactUs.blurb")}
          </p>
        </a>
      </div>
    </Well>
  );
}

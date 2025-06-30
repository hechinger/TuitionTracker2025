"use client";

import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import Well from "@/components/Well";
import styles from "./styles.module.scss";

export default function ContactUs() {
  return (
    <Well width="narrow" section>
      <div className={styles.wrapper}>
        <a
          href="https://hechingerreport.org/contact/"
          target="_blank"
          rel="noopener"
          className={styles.contactUs}
        >
          <div className={styles.icon}>
            <PaperPlaneTiltIcon />
          </div>
          <h2>Have a question?</h2>
          <p>
            Send us a message if you can’t find what you’re looking for or if something doesn’t seem right.
          </p>
        </a>
      </div>
    </Well>
  );
}

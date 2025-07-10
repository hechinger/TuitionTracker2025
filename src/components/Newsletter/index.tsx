"use client";

import { useState } from "react";
import { useContent } from "@/hooks/useContent";
import Well from "@/components/Well";
import styles from "./styles.module.scss";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const content = useContent();

  return (
    <Well width="text">
      <div className={styles.newsletter}>
        <h2>
          {content("Newsletter.title")}
        </h2>

        <p>
          {content("Newsletter.blurb")}
        </p>

        <div className={styles.form}>
          <input
            className={styles.input}
            value={email}
            placeholder={content("Newsletter.emailPlaceholder")}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="button"
            className={styles.submit}
          >
            {content("Newsletter.submitButton")}
          </button>
        </div>
      </div>
    </Well>
  );
}

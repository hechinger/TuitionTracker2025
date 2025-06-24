"use client";

import { useState } from "react";
import Well from "@/components/Well";
import styles from "./styles.module.scss";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <Well width="text">
      <div className={styles.newsletter}>
        <h2>Subscribe to our newsletter</h2>
        <p>
          Send us a message if you can’t find what you’re looking for or if something doesn’t seem right.
        </p>

        <div className={styles.form}>
          <input
            className={styles.input}
            value={email}
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="button"
            className={styles.submit}
          >
            Submit
          </button>
        </div>
      </div>
    </Well>
  );
}

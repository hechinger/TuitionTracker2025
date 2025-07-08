"use client";

import { useContent } from "@/hooks/useContent";
import styles from "./styles.module.scss";

export default function AdSlot() {
  const content = useContent();
  return (
    <div className={styles.adSlot}>
      <span>
        {content("AdSlot.title")}
      </span>
    </div>
  );
}

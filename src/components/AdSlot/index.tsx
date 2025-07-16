"use client";

import { useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import styles from "./styles.module.scss";

export default function AdSlot() {
  const id = 'div-gpt-ad-1732288624207-0';
  const content = useContent();

  useEffect(() => {
    if (!window.googletag) return;
    window.googletag.cmd.push(function() {
      window.googletag.display(id);
    });
  }, [id]);

  return (
    <div className={styles.adSlot}>
      <span>
        {content("AdSlot.title")}
      </span>
      <div id={id} className={styles.adContainer} />
    </div>
  );
}

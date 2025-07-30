"use client";

import { useEffect, useRef } from "react";
import get from "lodash/get";
import { useContent } from "@/hooks/useContent";
import styles from "./styles.module.scss";

type GoogleTag = {
  cmd: (() => void)[];
  display: (id: string) => void;
};

/**
 * Renders an advertisement.
 */
export default function AdSlot() {
  const ref = useRef<HTMLDivElement>(null);

  const id = 'div-gpt-ad-1732288624207-0';
  const content = useContent();

  useEffect(() => {
    const googletag = get(window, "googletag") as unknown as GoogleTag;
    if (!googletag) return;
    googletag.cmd.push(function() {
      googletag.display(id);
    });
  }, [id]);

  return (
    <div
      ref={ref}
      className={styles.adSlot}
    >
      <span>
        {content("AdSlot.title")}
      </span>
      <div className={styles.adContainer}>
        <div
          key={id}
          id={id}
          className={styles.ad}
        />
      </div>
    </div>
  );
}

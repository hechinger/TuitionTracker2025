"use client";

import { useEffect } from "react";
import get from "lodash/get";
import { useContent } from "@/hooks/useContent";
import styles from "./styles.module.scss";

type GoogleTag = {
  cmd: (() => void)[];
  display: (id: string) => void;
};

export default function AdSlot() {
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
    <div className={styles.adSlot}>
      <span>
        {content("AdSlot.title")}
      </span>
      <div id={id} className={styles.adContainer} />
    </div>
  );
}

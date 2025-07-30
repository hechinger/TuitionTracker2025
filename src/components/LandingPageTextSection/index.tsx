"use client";

import Well from "@/components/Well";
import { useContent } from "@/hooks/useContent";
import styles from "./styles.module.scss";

export default function LandingPageTextSection(props: {
  titleKey: string;
  textKey: string;
  children?: React.ReactNode;
}) {
  const content = useContent();

  const title = content(props.titleKey);
  const html = content(props.textKey) || "";

  return (
    <div className={styles.textSection}>
      <Well width="text">
        <h2>{title}</h2> 
        <div dangerouslySetInnerHTML={{ __html: html }} />
        {props.children}
      </Well>
    </div>
  );
}

"use client";

import Well from "@/components/Well";
import { ContentKey, useContent } from "@/hooks/useContent";
import styles from "./styles.module.scss";

export default function LandingPageTextSection(props: {
  titleKey: ContentKey;
  textKey: ContentKey;
  children?: React.ReactNode;
}) {
  const title = useContent(props.titleKey);
  const text = useContent(props.textKey);

  return (
    <div className={styles.textSection}>
      <Well width="text">
        <h2>{title}</h2> 
        <div dangerouslySetInnerHTML={{ __html: text }} />
        {props.children}
      </Well>
    </div>
  );
}

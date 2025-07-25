/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from "next/script";
import type { SchoolDetail } from "@/types";

export default function DataLayer(props: {
  locale: string;
  school?: SchoolDetail;
}) {
  const { school, locale } = props;
  if (!school) return null;
  const j = (val: unknown) => JSON.stringify(val);
  return (
    <Script id="data-layer" strategy="beforeInteractive">
      {`
         window.dataLayer = window.dataLayer || [];
         dataLayer.push({
           schoolName: ${j(school.name)},
           schoolType: ${j(school.schoolControl)},
           schoolDuration: ${j(school.degreeLevel)},
           schoolState: ${j(school.state)},
           language: ${j(locale)},
         });
      `}
    </Script>
  );
}

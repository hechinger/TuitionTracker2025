"use client";

import { useMemo } from "react";
import { minIndex, maxIndex } from "d3-array";
import { useContent } from "@/hooks/useContent";
import { useIncomeBracket } from "@/hooks/useIncomeBracket";
import { formatDollars } from "@/utils/formatDollars";
import Well from "@/components/Well";
import Robotext from "@/components/Robotext";
import PriceTrendChart from "@/components/PriceTrendChart";
import IncomeBracketBarChart from "@/components/IncomeBracketBarChart";
import IncomeBracketSelect from "@/components/IncomeBracketSelect";
import type { SchoolDetail } from "@/types";
import styles from "./styles.module.scss";

/**
 * The historical prices section of the school detail page.
 */
export default function SchoolHistoricalPrices(props: {
  school: SchoolDetail;
}) {
  const {
    school,
  } = props;

  const content = useContent();
  const { bracket = "average" } = useIncomeBracket();

  const bracketStudents = useMemo(() => ({
    average: content("SchoolPage.Prices.priceTrendTemplateStudentsAverage"),
    "0_30000": content("SchoolPage.Prices.priceTrendTemplateStudents030K"),
    "30001_48000": content("SchoolPage.Prices.priceTrendTemplateStudents3048"),
    "48001_75000": content("SchoolPage.Prices.priceTrendTemplateStudents4875"),
    "75001_110000": content("SchoolPage.Prices.priceTrendTemplateStudents75110"),
    "110001": content("SchoolPage.Prices.priceTrendTemplateStudents110"),
  }), [content]);
  const bracketStudent = bracketStudents[bracket];

  const historicTemplate = content("SchoolPage.Prices.priceTrendTemplate");
  const historicContext = useMemo(() => {
    if (!school || school.years.length < 1) return undefined;
    const sticker = school.stickerPrice.price;
    const net = school.netPricesByBracket[bracket]
    return {
      SCHOOL_NAME: school.name,
      STUDENT_TYPE: bracketStudent,
      STICKER_PRICE: formatDollars(sticker),
      NET_PRICE: formatDollars(net),
      PRICE_DIFFERENCE: formatDollars(sticker - net),
    };
  }, [bracket, bracketStudent, school]);

  const bracketTemplate = content("SchoolPage.Prices.incomeBracketTemplate");
  const bracketContext = useMemo(() => {
    if (!school || !school.netPricesByBracket) return undefined;
    const brackets = Object.entries(school.netPricesByBracket)
      .filter(([key, value]) => key !== "average" && value);
    if (brackets.length < 2) return undefined;
    const minBracket = brackets[minIndex(brackets, (b) => b[1])];
    const maxBracket = brackets[maxIndex(brackets, (b) => b[1])];

    const minBracketName = bracketStudents[minBracket[0] as keyof typeof bracketStudents];
    const minBracketPrice = minBracket[1];

    const maxBracketName = bracketStudents[maxBracket[0] as keyof typeof bracketStudents];
    const maxBracketPrice = maxBracket[1];

    return {
      SCHOOL_NAME: school.name,
      STUDENT_TYPE: "students",
      MIN_BRACKET_PRICE: formatDollars(minBracketPrice),
      MAX_BRACKET_PRICE: formatDollars(maxBracketPrice),
      PRICE_DIFFERENCE: formatDollars(maxBracketPrice - minBracketPrice),
      MIN_BRACKET_STUDENTS: minBracketName,
      MAX_BRACKET_STUDENTS: maxBracketName,
    };
  }, [school, bracketStudents]);

  if (!school) return null;
  if (school.years.length < 1) return null;

  return (
    <Well width="text" section>
      <div className={styles.content}>
        {historicContext && (
          <>
            <Robotext
              template={historicTemplate}
              context={historicContext}
              highlightColor="pink"
              variant="graf"
            />

            <div className={styles.chart}>
              {school && (
                <h2 className={styles.chartTitle}>
                  <Robotext
                    as="span"
                    template={content("SchoolPage.Prices.priceTrendChartTitle")}
                    context={{
                      SCHOOL_NAME: school.name,
                    }}
                  />
                  {' '}
                  <IncomeBracketSelect />
                </h2>
              )}

              <PriceTrendChart
                school={school}
              />
            </div>
          </>
        )}

        {bracketContext && (
          <>
            <Robotext
              template={bracketTemplate}
              context={bracketContext}
              highlightColor="pink"
              variant="graf"
            />

            <IncomeBracketBarChart
              school={school}
            />
          </>
        )}
      </div>
    </Well>
  );
}

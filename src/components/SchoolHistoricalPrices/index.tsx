"use client";

import { minIndex, maxIndex } from "d3-array";
import { useContent } from "@/hooks/useContent";
import { useSchool } from "@/hooks/useSchool";
import { formatDollars } from "@/utils/formatDollars";
import Well from "@/components/Well";
import Robotext from "@/components/Robotext";
import PriceTrendChart from "@/components/PriceTrendChart";
import IncomeBracketBarChart from "@/components/IncomeBracketBarChart";
import IncomeBracketSelect from "@/components/IncomeBracketSelect";
import styles from "./styles.module.scss";

const bracketStudents = {
  average: "students",
  "0_30000": "students with incomes below $30K",
  "30001_48000": "students with incomes between $30K and $48K",
  "48001_75000": "students with incomes between $48K and $75K",
  "75001_110000": "students with incomes between $75K and $110K",
  "110001": "students with incomes over $110K",
} as const;

/**
 * The historical prices section of the school detail page.
 */
export default function SchoolHistoricalPrices(props: {
  schoolId: string;
}) {
  const {
    data: school,
  } = useSchool(props.schoolId);

  const content = useContent();

  if (!school) return null;

  const sticker = school.stickerPrice.price;
  const net = school.netPricesByBracket.average;
  const historicTemplate = content("SchoolPage.Prices.priceTrendTemplate");
  const historicContext = {
    SCHOOL_NAME: school.name,
    STUDENT_TYPE: "students",
    STICKER_PRICE: formatDollars(sticker),
    NET_PRICE: formatDollars(net),
    PRICE_DIFFERENCE: formatDollars(sticker - net),
  };

  const brackets = Object.entries(school.netPricesByBracket)
    .filter(([key]) => key !== "average");
  const minBracket = brackets[minIndex(brackets, (b) => b[1])];
  const maxBracket = brackets[maxIndex(brackets, (b) => b[1])];

  const minBracketName = bracketStudents[minBracket[0] as keyof typeof bracketStudents];
  const minBracketPrice = minBracket[1];

  const maxBracketName = bracketStudents[maxBracket[0] as keyof typeof bracketStudents];
  const maxBracketPrice = maxBracket[1];

  const bracketTemplate = content("SchoolPage.Prices.incomeBracketTemplate");
  const bracketContext = {
    SCHOOL_NAME: school.name,
    STUDENT_TYPE: "students",
    MIN_BRACKET_PRICE: formatDollars(minBracketPrice),
    MAX_BRACKET_PRICE: formatDollars(maxBracketPrice),
    PRICE_DIFFERENCE: formatDollars(maxBracketPrice - minBracketPrice),
    MIN_BRACKET_STUDENTS: minBracketName,
    MAX_BRACKET_STUDENTS: maxBracketName,
  };
  
  return (
    <Well width="text" section>
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

      <Robotext
        template={bracketTemplate}
        context={bracketContext}
        highlightColor="pink"
        variant="graf"
      />

      <IncomeBracketBarChart
        schoolId={props.schoolId}
      />
    </Well>
  );
}

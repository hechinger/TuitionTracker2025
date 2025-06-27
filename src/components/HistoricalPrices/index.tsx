"use client";

import { minIndex, maxIndex } from "d3-array";
import { useSchool } from "@/hooks/useSchool";
import { formatDollars } from "@/utils/formatDollars";
import Well from "@/components/Well";
import Robotext from "@/components/Robotext";
import PriceTrendChart from "@/components/PriceTrendChart";
import IncomeBracketBarChart from "@/components/IncomeBracketBarChart";
import IncomeBracketSelect from "@/components/IncomeBracketSelect";
import styles from "./styles.module.scss";

const historicTemplate = `
  <p>
    This year at <strong>{schoolName}</strong>, we project that {studentType} will pay <span class="highlight">{netPrice}</span>, while the advertised sticker price is {stickerPrice}. That’s a difference of {priceDifference}.
  </p>
`;

const bracketTemplate = `
  <p>
    How much a student has to pay usually depends on their family's household income. At <strong>{schoolName}</strong> this year, {maxBracketStudents} will pay around {maxBracketPrice}, while {minBracketStudents} will pay around {minBracketPrice}. That's a difference of {priceDifference}.
  </p>
`;

const bracketStudents = {
  "0_30000": "students with incomes below $30K",
  "30001_48000": "students with incomes between $30K and $48K",
  "48001_75000": "students with incomes between $48K and $75K",
  "75001_110000": "students with incomes between $75K and $110K",
  "110001": "students with incomes over $110K",
} as const;

export default function HistoricalPrices(props: {
  schoolId: string;
}) {
  const {
    data: school,
  } = useSchool(props.schoolId);

  if (!school) return null;

  const sticker = school.stickerPrice.price;
  const net = school.netPricesByBracket.average;
  const historicContext = {
    schoolName: school.name,
    studentType: "students",
    stickerPrice: formatDollars(sticker),
    netPrice: formatDollars(net),
    priceDifference: formatDollars(sticker - net),
  };

  const brackets = Object.entries(school.netPricesByBracket)
    .filter(([key]) => key !== "average");
  const minBracket = brackets[minIndex(brackets, (b) => b[1])];
  const maxBracket = brackets[maxIndex(brackets, (b) => b[1])];

  const minBracketName = bracketStudents[minBracket[0] as keyof typeof bracketStudents];
  const minBracketPrice = minBracket[1];

  const maxBracketName = bracketStudents[maxBracket[0] as keyof typeof bracketStudents];
  const maxBracketPrice = maxBracket[1];

  const bracketContext = {
    schoolName: school.name,
    studentType: "students",
    minBracketPrice: formatDollars(minBracketPrice),
    maxBracketPrice: formatDollars(maxBracketPrice),
    priceDifference: formatDollars(maxBracketPrice - minBracketPrice),
    minBracketStudents: minBracketName,
    maxBracketStudents: maxBracketName,
  };
  
  return (
    <Well width="text" section>
      <Robotext
        template={historicTemplate}
        context={historicContext}
        highlightColor="pink"
      />

      <div className={styles.chart}>
        {school && (
          <h2 className={styles.chartTitle}>
            Prices at {school.name} over time for
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
      />

      <IncomeBracketBarChart
        schoolId={props.schoolId}
      />
    </Well>
  );
}

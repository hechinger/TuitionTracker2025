import { max } from "d3-array";
import PriceTrendChart from "@/components/PriceTrendChart";
import Well from "@/components/Well";
import { useSchool } from "@/hooks/useSchool";
import { commaAnd } from "@/utils/commaAnd";
import type { SchoolIndex } from "@/types";
import styles from "./styles.module.scss";

function Chart(props: {
  id: string;
  priceMax?: number;
}) {
  const { data: school } = useSchool(props.id);

  if (!school) {
    return (
      <div className={styles.placeholder} />
    );
  }

  return (
    <div className={styles.chartContainer}>
      <h3>{school.name}</h3>
      <PriceTrendChart
        school={school}
        max={props.priceMax}
        legend={false}
        lineLabels={false}
      />
    </div>
  );
}

export default function PriceTrend(props: {
  schools: SchoolIndex[];
}) {
  const schoolNames = props.schools.map((school) => school.name);
  const slots = [...Array(3)].map((_, i) => props.schools[i]);

  const priceMax = max(slots, (d) => d ? d.stickerPrice.price : 0);

  return (
    <div className={styles.container}>
      <Well width="text">
        <h2 className={styles.title}>
          Historical Price Trend
        </h2>

        {props.schools.length > 1 && (
          <p className={styles.graf}>
            See how the <span className={styles.sticker}>sticker price</span> and <span className={styles.net}>net price</span> trends of {commaAnd(schoolNames)} compare.
          </p>
        )}

        {props.schools.length < 3 && (
          <p className={styles.graf}>
            Select schools above to compare their historical price trends.
          </p>
        )}
      </Well>

      <Well>
        <div className={styles.charts}>
          {slots.map((school, i) => school ? (
            <Chart
              key={school.id}
              id={school.id}
              priceMax={priceMax}
            />
          ) : (
            <div key={i} className={styles.placeholder} />
          ))}
        </div>
      </Well>
    </div>
  );
}

import PriceTrendChart from "@/components/PriceTrendChart";
import Well from "@/components/Well";
import { useSchool } from "@/hooks/useSchool";
import { commaAnd } from "@/utils/commaAnd";
import type { SchoolIndex } from "@/types";
import styles from "./styles.module.scss";

function Chart(props: {
  id: string;
}) {
  const { data: school } = useSchool(props.id);

  if (!school) {
    return (
      <div className={styles.placeholder} />
    );
  }

  return (
    <PriceTrendChart
      school={school}
      max={100000}
    />
  );
}

export default function PriceTrend(props: {
  schools: SchoolIndex[];
}) {
  const schoolNames = props.schools.map((school) => school.name);
  const slots = [...Array(3)].map((_, i) => props.schools[i]);

  return (
    <div className={styles.container}>
      <Well width="text">
        <h2 className={styles.title}>
          Historical Price Trend
        </h2>

        {props.schools.length > 1 && (
          <p className={styles.graf}>
            See how the historical price trends of {commaAnd(schoolNames)} compare.
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
            />
          ) : (
            <div key={i} className={styles.placeholder} />
          ))}
        </div>
      </Well>
    </div>
  );
}

import PriceTrendChart from "@/components/PriceTrendChart";
import Well from "@/components/Well";
import { useSchool } from "@/hooks/useSchool";
import type { SchoolIndex } from "@/types";
import styles from "./styles.module.scss";

function Chart(props: {
  id: string;
}) {
  const { data: school } = useSchool(props.id);
  if (!school) return;
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
  return (
    <Well section>
      <h2>
        Historical Price Trend
      </h2>

      <div className={styles.charts}>
        {props.schools.map((school) => school && (
          <Chart
            key={school.id}
            id={school.id}
          />
        ))}
      </div>
    </Well>
  );
}

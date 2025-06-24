import PriceTrendChart from "@/components/PriceTrendChart";
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
    />
  );
}

export default function PriceTrend(props: {
  schools: SchoolIndex[];
}) {
  return (
    <div>
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
    </div>
  );
}

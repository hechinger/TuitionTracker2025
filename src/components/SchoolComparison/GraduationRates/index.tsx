import DonutChart from "@/components/DonutChart";
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
    <DonutChart
      value={school.graduationBachelors.total}
      label="graduation rate"
      title={school.name}
    />
  );
}

export default function GraduationRates(props: {
  schools: SchoolIndex[];
}) {
  return (
    <Well section>
      <h2>Graduation Rates</h2>

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

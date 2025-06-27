import DonutChart from "@/components/DonutChart";
import Well from "@/components/Well";
import { useSchool } from "@/hooks/useSchool";
import { commaAnd } from "@/utils/commaAnd";
import { getGraduation } from "@/utils/formatSchoolInfo";
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

  const graduation = getGraduation(school);
  return (
    <DonutChart
      value={graduation.total}
      label="graduation rate"
      title={school.name}
    />
  );
}

export default function GraduationRates(props: {
  schools: SchoolIndex[];
}) {
  const schoolNames = props.schools.map((school) => school.name);
  const slots = [...Array(3)].map((_, i) => props.schools[i]);

  return (
    <div className={styles.container}>
      <Well width="text">
        <h2 className={styles.title}>Graduation Rates</h2>

        {props.schools.length > 1 && (
          <p className={styles.graf}>
            Graduation rate can be a good indicator of how likely students are to complete their degree. See how the graduation rates of {commaAnd(schoolNames)} compare.
          </p>
        )}

        {props.schools.length < 3 && (
          <p className={styles.graf}>
            Select schools above to compare their graduation rates.
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

import SizeHistogram from "@/components/SizeHistogram";
import Well from "@/components/Well";
import { commaAnd } from "@/utils/commaAnd";
import type { SchoolIndex } from "@/types";
import styles from "./styles.module.scss";

export default function SchoolSizes(props: {
  schools: SchoolIndex[];
}) {
  const schoolNames = props.schools.map((school) => school.name);
  const slots = [...Array(3)].map((_, i) => props.schools[i]);

  return (
    <Well width="text" section>
      <h2 className={styles.title}>School Sizes</h2>

      {props.schools.length > 1 && (
        <p className={styles.graf}>
          School size can have a large impact on a student’s college experience. See how the sizes of {commaAnd(schoolNames)} compare.
        </p>
      )}

      {props.schools.length < 3 && (
        <p className={styles.graf}>
          Select schools above to compare their sizes.
        </p>
      )}

      <div className={styles.charts}>
        {slots.map((school, i) => school ? (
          <SizeHistogram
            key={school.id}
            size={school.enrollment}
            title={school.name}
          />
        ): (
          <div key={i} className={styles.placeholder} />
        ))}
      </div>
    </Well>
  );
}

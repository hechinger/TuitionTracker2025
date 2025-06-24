import SizeHistogram from "@/components/SizeHistogram";
import type { SchoolIndex } from "@/types";
import styles from "./styles.module.scss";

export default function SchoolSizes(props: {
  schools: SchoolIndex[];
}) {
  return (
    <div>
      <h2>School Sizes</h2>

      <div className={styles.charts}>
        {props.schools.map((school) => school && (
          <SizeHistogram
            key={school.id}
            size={school.enrollment}
            title={school.name}
          />
        ))}
      </div>
    </div>
  );
}

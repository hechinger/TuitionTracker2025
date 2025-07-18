import Well from "@/components/Well";
import styles from "./styles.module.scss";

/**
 * This component works with the `HechingerTopper` to provide the overlapping
 * page top seen on hechingerreport.org.
 */
export default function PageTopOverlap(props: {
  children?: React.ReactNode;
}) {
  return (
    <Well>
      <div className={styles.overlap}>
        {props.children}
      </div>
    </Well>
  );
}

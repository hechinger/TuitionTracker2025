import Well from "@/components/Well";
import styles from "./styles.module.scss";

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

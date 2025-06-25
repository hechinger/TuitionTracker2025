import clsx from "clsx";
import styles from "./styles.module.scss";

export default function Well(props: {
  width?: "full" | "page" | "text" | "narrow";
  section?: boolean;
  children?: React.ReactNode;
}) {
  const {
    width = "page",
    section = false,
    children,
  } = props;

  return (
    <div
      className={clsx(styles.well, styles[width], {
        [styles.section]: section,
      })}
    >
      {children}
    </div>
  );
}

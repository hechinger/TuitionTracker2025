import clsx from "clsx";
import styles from "./styles.module.scss";

export default function Well(props: {
  width?: "full" | "page" | "text" | "narrow";
  children?: React.ReactNode;
}) {
  const {
    width = "page",
    children,
  } = props;

  return (
    <div className={clsx(styles.well, styles[width])}>
      {children}
    </div>
  );
}

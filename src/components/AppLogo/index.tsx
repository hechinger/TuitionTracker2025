import clsx from "clsx";
import logo from "./logo.png";
import styles from "./styles.module.scss";

export default function AppLogo(props: {
  className?: string;
}) {
  return (
    <img
      src={logo.src}
      className={clsx(styles.logo, props.className)}
      alt="Tuition Tracker logo"
    />
  );
}

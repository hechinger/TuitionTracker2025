import clsx from "clsx";
import logo from "./logo.png";
import styles from "./styles.module.scss";

/**
 * Renders the Tuition Tracker logo as an image. Used at the top of each page
 * to provide consistent site branding.
 */
export default function TuitionTrackerLogo(props: {
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

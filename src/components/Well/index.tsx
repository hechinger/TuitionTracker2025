import clsx from "clsx";
import styles from "./styles.module.scss";

/**
 * A container component that sets the horizontal width of a section of the
 * page for consistent alignment.
 * 
 * @param props.width
 *   How wide the well should be rendered
 * @param props.section
 *   Whether or not this well should have the vertical margin of a "section"
 * @param props.children
 *   The content to render in this well
 */
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

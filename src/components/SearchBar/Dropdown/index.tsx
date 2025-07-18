import clsx from "clsx";
import styles from "./styles.module.scss";

/**
 * The floating drop-down window that appears under the search bar.
 * 
 * @param props.isOpen
 *   Whether the dropdown window is currently open
 * @param props.right
 *   Whether the window should be aligned to the right of the search bar
 *   rather than the left (the default)
 * @param props.children
 *   The content to put inside the dropdown window
 */
export default function Dropdown(props: {
  isOpen: boolean;
  right: boolean;
  children: React.ReactNode;
}) {

  if (!props.isOpen) return null;

  return (
    <div className={clsx(styles.dropdown, { [styles.right]: props.right })}>
      {props.children}
    </div>
  );
}

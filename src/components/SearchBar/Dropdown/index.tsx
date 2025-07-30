import clsx from "clsx";
import { XIcon } from "@phosphor-icons/react";
import styles from "./styles.module.scss";

/**
 * The floating drop-down window that appears under the search bar.
 * 
 * @param props.isOpen
 *   Whether the dropdown window is currently open
 * @param props.right
 *   Whether the window should be aligned to the right of the search bar
 *   rather than the left (the default)
 * @param props.mobileDialog
 *   Render as a larger dialog window on mobile
 * @param props.close
 *   Function to call that will close the dropdown
 * @param props.children
 *   The content to put inside the dropdown window
 */
export default function Dropdown(props: {
  isOpen: boolean;
  right: boolean;
  mobileDialog: boolean;
  close: () => void;
  children: React.ReactNode;
}) {

  if (!props.isOpen) return null;

  return (
    <div
      className={clsx(styles.dropdown, {
        [styles.right]: props.right,
        [styles.mobileDialog]: props.mobileDialog,
      })}
    >
      {props.mobileDialog && (
        <button
          type="button"
          onClick={props.close}
          className={styles.closeButton}
          aria-label="Close"
        >
          <XIcon size={24} weight="bold" />
        </button>
      )}
      {props.children}
    </div>
  );
}

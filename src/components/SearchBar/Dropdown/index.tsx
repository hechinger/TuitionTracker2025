import clsx from "clsx";
import styles from "./styles.module.scss";

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

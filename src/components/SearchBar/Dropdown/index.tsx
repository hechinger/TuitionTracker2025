import styles from "./styles.module.scss";

export default function Dropdown(props: {
  isOpen: boolean;
  children: React.ReactNode;
}) {

  if (!props.isOpen) return null;

  return (
    <div className={styles.dropdown}>
      {props.children}
    </div>
  );
}

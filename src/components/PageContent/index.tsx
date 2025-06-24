import styles from "./styles.module.scss";

export default function PageContent(props: {
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.pageContent}>
      {props.children}
    </div>
  );
}

import styles from "./styles.module.scss";

export default function MoreOptions(props: {
  onFocus: () => void;
}) {
  return (
    <div className={styles.moreOptions}>
      <div className={styles.label}>
        Total cost and more
      </div>

      <button
        type="button"
        className={styles.placeholder}
        onClick={() => props.onFocus()}
      >
        More search options
      </button>
    </div>
  );
}

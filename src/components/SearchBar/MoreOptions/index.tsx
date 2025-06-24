import type { SearchOptions, UpdateSearch } from "@/hooks/useSearchState";
import styles from "./styles.module.scss";

export default function MoreOptions(props: {
  search: SearchOptions;
  updateSearch: UpdateSearch;
}) {
  return (
    <div className={styles.moreOptions}>
      <div className={styles.label}>
        Total cost and more
      </div>

      <button
        type="button"
        className={styles.placeholder}
      >
        More search options
      </button>
    </div>
  );
}

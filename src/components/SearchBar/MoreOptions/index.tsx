"use client";

import type { SearchOptions } from "@/hooks/useSearchState";
import { formatDollars } from "@/utils/formatDollars";
import styles from "./styles.module.scss";

/**
 * Renders the "more options" section of the search bar.
 * 
 * @param props.search
 *   The current state of the user's search
 * @param props.onFocus
 *   Function to call when the user clicks into the "more options" section
 */
export default function MoreOptions(props: {
  search: SearchOptions;
  onFocus: () => void;
}) {
  const {
    minPrice = 0,
    maxPrice = 0,
    schoolType = [],
    degreeType = "any",
    tribalCollege = false,
    hbcu = false,
  } = props.search;

  const text = [
    minPrice !== 0 && `${formatDollars(minPrice)} to ${formatDollars(maxPrice)}`,
    schoolType.join(", "),
    (degreeType !== "any") ? degreeType : "",
    tribalCollege && "tribal college",
    hbcu && "HBCU",
  ].filter(Boolean).join(", ");

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
        {text || "More search options"}
      </button>
    </div>
  );
}

"use client";

import { useSchool } from "@/hooks/useSchool";
import { formatDollars } from "@/utils/formatDollars";
import styles from "./styles.module.scss";

export default function SchoolTopper(props: {
  schoolId: string;
}) {
  const {
    data: school,
  } = useSchool(props.schoolId);

  if (!school) return null;

  return (
    <div className={styles.topper}>
      <img
        className={styles.schoolImage}
        src={school.image}
        alt={school.name}
      />

      <h1 className={styles.name}>
        {school.name}
      </h1>

      <div className={styles.info}>
        <div>
          {`${school.city}, ${school.state}`}
        </div>

        <div>
          {`${school.schoolControl} ${school.degreeLevel}`}
        </div>
      </div>

      <div className={styles.prices}>
        <div className={styles.price}>
          <span className={styles.priceNumber}>
            {formatDollars(school.stickerPrice.price)}
          </span>
          <span className={styles.priceLabel}>
            projected sticker price
          </span>
        </div>

        <div className={styles.price}>
          <span className={styles.priceNumber}>
            {formatDollars(school.netPricesByBracket.average)}
          </span>
          <span className={styles.priceLabel}>
            projected average net price
          </span>
        </div>
      </div>
    </div>
  );
}

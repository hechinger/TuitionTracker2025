"use client";

import { GraduationCapIcon, MapPinIcon, StarIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { useSchool } from "@/hooks/useSchool";
import { useSavedSchools } from "@/hooks/useSavedSchools";
import { useIncomeBracket } from "@/hooks/useIncomeBracket";
import { formatDollars } from "@/utils/formatDollars";
import IncomeBracketSelect from "@/components/IncomeBracketSelect";
import styles from "./styles.module.scss";

export default function SchoolTopper(props: {
  schoolId: string;
}) {
  const {
    data: school,
  } = useSchool(props.schoolId);

  const savedSchools = useSavedSchools();
  const { bracket = "average" } = useIncomeBracket();

  if (!school) return null;

  const isSaved = savedSchools.schoolIsSaved(school.id);

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
        <div className={styles.infoItem}>
          <MapPinIcon />
          <span>
            {`${school.city}, ${school.state}`}
          </span>
        </div>

        <div className={styles.infoItem}>
          <GraduationCapIcon />
          <span>
            {`${school.schoolControl} ${school.degreeLevel}`}
          </span>
        </div>
      </div>

      <div className={styles.prices}>
        <div className={styles.price}>
          <span className={clsx(styles.priceNumber, styles.sticker)}>
            {formatDollars(school.stickerPrice.price)}
          </span>
          <span className={styles.priceLabel}>
            projected sticker price
          </span>
        </div>

        <div className={styles.price}>
          <span className={clsx(styles.priceNumber, styles.net)}>
            {formatDollars(school.netPricesByBracket[bracket])}
          </span>
          <span className={styles.priceLabel}>
            projected average net price
          </span>
          <IncomeBracketSelect />
        </div>
      </div>

      <button
        type="button"
        className={clsx(styles.saveButton, {
          [styles.saved]: isSaved,
        })}
        onClick={() => savedSchools.toggleSavedSchool(school.id)}
      >
        <StarIcon weight={isSaved ? "fill" : "regular"} />
        <span>
          {isSaved ? "Saved" : "Save this school"}
        </span>
      </button>
    </div>
  );
}

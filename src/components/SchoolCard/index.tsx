"use client";

import type { SchoolIndex } from "@/types";
import { StarIcon } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { getSchoolRoute } from "@/utils/routes";
import { formatDollars } from "@/utils/formatDollars";
import { useSavedSchools } from "@/hooks/useSavedSchools";
import SchoolImage from "@/components/SchoolImage";
import styles from "./styles.module.scss";

export default function SchoolCard(props: {
  school: SchoolIndex;
}) {
  const savedSchools = useSavedSchools();
  const isSaved = savedSchools.schoolIsSaved(props.school.id);

  return (
    <div className={styles.card}>
      <div className={styles.save}>
        <button
          type="button"
          onClick={() => savedSchools.toggleSavedSchool(props.school.id)}
        >
          <StarIcon
            size="32"
            weight="fill"
            color={isSaved ? "#FFCC33" : "#00000066"}
          />
          <StarIcon
            size="32"
            color="white"
          />
        </button>
      </div>

      <Link href={getSchoolRoute(props.school)}>
        <SchoolImage
          school={props.school}
          withFallback
        />

        <div className={styles.info}>
          <div className={styles.name}>
            {props.school.name}
          </div>
          <div className={styles.price}>
            <span className={styles.number}>
              {formatDollars(props.school.stickerPrice.price)}
            </span>
            <span className={styles.numberLabel}>
              sticker price
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

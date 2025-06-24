"use client";

import type { SchoolIndex } from "@/types";
import Link from "next/link";
import { StarIcon } from "@phosphor-icons/react";
import { getSchoolRoute } from "@/utils/routes";
import { formatDollars } from "@/utils/formatDollars";
import { useSavedSchools } from "@/hooks/useSavedSchools";
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
        <img
          src={props.school.image}
          alt={props.school.name}
        />

        <div className={styles.info}>
          <div className={styles.name}>
            {props.school.name}
          </div>
          <div className={styles.price}>
            <span className={styles.number}>
              {formatDollars(props.school.stickerPrice.price)}
            </span>
            <span>
              sticker price
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

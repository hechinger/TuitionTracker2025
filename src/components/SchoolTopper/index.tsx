"use client";

import { GraduationCapIcon, MapPinIcon, StarIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { useContent } from "@/hooks/useContent";
import { useSavedSchools } from "@/hooks/useSavedSchools";
import { useIncomeBracket } from "@/hooks/useIncomeBracket";
import { formatDollars } from "@/utils/formatDollars";
import Robotext from "@/components/Robotext";
import IncomeBracketSelect from "@/components/IncomeBracketSelect";
import Well from "@/components/Well";
import SchoolImage from "@/components/SchoolImage";
import type { SchoolDetail } from "@/types";
import styles from "./styles.module.scss";

/**
 * Renders the top box of the school detail page.
 */
export default function SchoolTopper(props: {
  school: SchoolDetail;
}) {
  const {
    school,
  } = props;

  const content = useContent();

  const savedSchools = useSavedSchools();
  const { bracket = "average" } = useIncomeBracket();

  if (!school) return null;

  const isSaved = savedSchools.schoolIsSaved(school.id);

  const { schoolControl, degreeLevel } = school;

  const buttonLabel = isSaved
    ? content("SchoolPage.SchoolTopper.saveButton.saved")
    : content("SchoolPage.SchoolTopper.saveButton.saveThisSchool");

  const hasData = school.years.length > 0;

  return (
    <Well>
      <div className={clsx(styles.topper, { [styles.withImage]: !!school.image })}>
        <SchoolImage
          className={styles.schoolImage}
          school={school}
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
            <Robotext
              as="span"
              template={content("SchoolPage.SchoolTopper.schoolInfo")}
              context={{
                SCHOOL_CONTROL: content(`GeneralPurpose.schoolControl.${schoolControl}`),
                DEGREE_LEVEL: content(`GeneralPurpose.degreeLevel.${degreeLevel}`),
              }}
            />
          </div>
        </div>

        {!hasData && (
          <div className={styles.dataFallback}>
            <div className={styles.message}>
              {content("SchoolPage.SchoolTopper.noDataMessage")}
            </div>
            <a
              href={`https://nces.ed.gov/collegenavigator/?id=${school.id}`}
              className={styles.collegeNavigatorLink}
            >
              {content("SchoolPage.SchoolTopper.collegeNavigatorLink")}
            </a>
          </div>
        )}

        {hasData && (
          <div className={styles.prices}>
            <div className={styles.price}>
              <span className={clsx(styles.priceNumber, styles.sticker)}>
                {formatDollars(school.stickerPrice.price)}
              </span>
              <span className={styles.priceLabel}>
                {content("SchoolPage.SchoolTopper.stickerPriceLabel")}
              </span>
            </div>

            <div className={styles.price}>
              <span className={clsx(styles.priceNumber, styles.net)}>
                {formatDollars(school.netPricesByBracket[bracket])}
              </span>
              <span className={styles.priceLabel}>
                {content("SchoolPage.SchoolTopper.netPriceLabel")}
              </span>
              <IncomeBracketSelect className={styles.select} />
            </div>
          </div>
        )}

        <button
          type="button"
          className={clsx(styles.saveButton, {
            [styles.saved]: isSaved,
          })}
          onClick={() => savedSchools.toggleSavedSchool(school.id)}
        >
          <StarIcon weight={isSaved ? "fill" : "regular"} />
          <span>
            {buttonLabel}
          </span>
        </button>
      </div>
    </Well>
  );
}

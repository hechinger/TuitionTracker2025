"use client";

import { useState } from "react";
import {
  GraduationCapIcon,
  MapPinIcon,
  BuildingApartmentIcon,
  TrophyIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import {
  getGraduation,
} from "@/utils/formatSchoolInfo";
import { formatPercent } from "@/utils/formatPercent";
import Well from "@/components/Well";
import Robotext from "@/components/Robotext";
import { useSchool } from "@/hooks/useSchool";
import { useContent } from "@/hooks/useContent";
import styles from "./styles.module.scss";

export default function SchoolDetails(props: {
  schoolId: string;
}) {
  const {
    data: school,
  } = useSchool(props.schoolId);
  const [isOpen, setIsOpen] = useState(false);
  const content = useContent();

  if (!school) return null;

  const place = `${school.city}, ${school.state}`;
  const acceptanceRate = formatPercent(school.stats.percentAdmitted);
  const gradRate = formatPercent(getGraduation(school).total);

  const { schoolControl, degreeLevel } = school;

  return (
    <Well width="text">
      <div className={styles.schoolDetails}>
        <div className={styles.icon}>
          <GraduationCapIcon />
        </div>
        <h2>
          {content("SchoolPage.SchoolDetails.title")}
        </h2>

        <div className={styles.facts}>
          <div className={styles.fact}>
            <MapPinIcon />
            <Robotext
              as="span"
              template={content("SchoolPage.SchoolDetails.location")}
              context={{
                LOCATION: place,
              }}
            />
          </div>

          <div className={styles.fact}>
            <TrophyIcon />
            <Robotext
              as="span"
              template={content("SchoolPage.SchoolDetails.acceptanceRate")}
              context={{
                ACCEPTANCE_RATE: acceptanceRate,
              }}
            />
          </div>

          <div className={styles.fact}>
            <BuildingApartmentIcon />
            <Robotext
              as="span"
              template={content("SchoolPage.SchoolDetails.schoolType")}
              context={{
                SCHOOL_CONTROL: content(`GeneralPurpose.schoolControl.${schoolControl}`),
                DEGREE_LEVEL: content(`GeneralPurpose.degreeLevel.${degreeLevel}`),
              }}
            />
          </div>

          <div className={styles.fact}>
            <GraduationCapIcon />
            <Robotext
              as="span"
              template={content("SchoolPage.SchoolDetails.graduationRate")}
              context={{
                GRADUATION_RATE: gradRate,
              }}
            />
          </div>
        </div>

        <div className={styles.about}>
          <button
            type="button"
            onClick={() => setIsOpen((old) => !old)}
          >
            About the data <CaretDownIcon />
          </button>

          {isOpen && (
            <Robotext
              template={content("SchoolPage.SchoolDetails.aboutTheData")}
            />
          )}
        </div>
      </div>
    </Well>
  );
}

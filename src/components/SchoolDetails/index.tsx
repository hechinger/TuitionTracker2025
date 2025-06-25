"use client";

import { useState } from "react";
import {
  GraduationCapIcon,
  MapPinIcon,
  BuildingApartmentIcon,
  TrophyIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import Well from "@/components/Well";
import { useSchool } from "@/hooks/useSchool";
import styles from "./styles.module.scss";

export default function SchoolDetails(props: {
  schoolId: string;
}) {
  const {
    data: school,
  } = useSchool(props.schoolId);
  const [isOpen, setIsOpen] = useState(false);

  if (!school) return null;

  const place = `${school.city}, ${school.state}`;
  const retentionRate = school.retention.fullTime.toLocaleString(undefined, {
    style: "percent",
    maximumFractionDigits: 0,
  });
  const gradRate = school.graduationBachelors.total.toLocaleString(undefined, {
    style: "percent",
    maximumFractionDigits: 0,
  });

  return (
    <Well width="text">
      <div className={styles.schoolDetails}>
        <div className={styles.icon}>
          <GraduationCapIcon />
        </div>
        <h2>School Details</h2>

        <div className={styles.facts}>
          <div className={styles.fact}>
            <MapPinIcon />
            <span>
              Located in {place}
            </span>
          </div>

          <div className={styles.fact}>
            <TrophyIcon />
            <span>
              {retentionRate} retention rate
            </span>
          </div>

          <div className={styles.fact}>
            <BuildingApartmentIcon />
            <span>
              Public, 4-year school
            </span>
          </div>

          <div className={styles.fact}>
            <GraduationCapIcon />
            <span>
              {gradRate} graduation rate
            </span>
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
            <p className={styles.text}>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
              faucibus ex sapien vitae pellentesque sem placerat. In id
              cursus mi pretium tellus duis convallis. Tempus leo eu aenean
              sed diam urna tempor. Pulvinar vivamus fringilla lacus nec
              metus bibendum egestas. Iaculis massa nisl malesuada lacinia
              integer nunc posuere. Ut hendrerit semper vel class aptent
              taciti sociosqu.
            </p>
          )}
        </div>
      </div>
    </Well>
  );
}

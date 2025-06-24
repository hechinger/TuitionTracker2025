"use client";

import { useSchool } from "@/hooks/useSchool";
import styles from "./styles.module.scss";

export default function SchoolDetails(props: {
  schoolId: string;
}) {
  const {
    data: school,
  } = useSchool(props.schoolId);

  return (
    <div className={styles.schoolDetails}>
      <div className={styles.icon} />
      <h2>School Details</h2>
      <p>
        Send us a message if you can’t find what you’re looking for or if something doesn’t seem right.
      </p>
    </div>
  );
}
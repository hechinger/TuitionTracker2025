"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import ContactUs from "@/components/ContactUs";
import Well from "@/components/Well";
import { useComparisonSchools } from "./useComparisonSchools";
import SchoolSelection from "./SchoolSelection";
import PriceTrend from "./PriceTrend";
import GraduationRates from "./GraduationRates";
import SchoolSizes from "./SchoolSizes";
import styles from "./styles.module.scss";

export default function SchoolComparison() {
  const {
    savedSchools,
    compareSchools,
    setCompareIds,
    clearCompareIds,
    optionSchools,
  } = useComparisonSchools();

  return (
    <div>
      <Well>
        <h1 className={styles.title}>
          Compare your favorite schools
        </h1>
      </Well>

      <ErrorBoundary>
        <SchoolSelection
          savedSchools={savedSchools}
          optionSchools={optionSchools}
          compareSchools={compareSchools}
          setCompareSchoolIds={setCompareIds}
          clearCompareIds={clearCompareIds}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <PriceTrend
          schools={compareSchools}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <GraduationRates
          schools={compareSchools}
        />
      </ErrorBoundary>

      <ContactUs />

      <ErrorBoundary>
        <SchoolSizes
          schools={compareSchools}
        />
      </ErrorBoundary>
    </div>
  );
}

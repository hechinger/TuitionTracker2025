"use client";

import ContactUs from "@/components/ContactUs";
import { useComparisonSchools } from "./useComparisonSchools";
import SchoolSelection from "./SchoolSelection";
import PriceTrend from "./PriceTrend";
import GraduationRates from "./GraduationRates";
import SchoolSizes from "./SchoolSizes";

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
      <h1>Compare your favorite schools</h1>
      <SchoolSelection
        savedSchools={savedSchools}
        optionSchools={optionSchools}
        compareSchools={compareSchools}
        setCompareSchoolIds={setCompareIds}
        clearCompareIds={clearCompareIds}
      />
      <PriceTrend
        schools={compareSchools}
      />
      <GraduationRates
        schools={compareSchools}
      />
      <ContactUs />
      <SchoolSizes
        schools={compareSchools}
      />
    </div>
  );
}

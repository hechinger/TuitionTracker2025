"use client";

import { useSchool } from "@/hooks/useSchool";
import PriceTrendChart from "@/components/PriceTrendChart";

export default function HistoricalPrices(props: {
  schoolId: string;
}) {
  const {
    data: school,
  } = useSchool(props.schoolId);
  
  return (
    <div>
      {school && (
        <h2>
          Prices at {school.name} over time
        </h2>
      )}

      <PriceTrendChart
        school={school}
      />
    </div>
  );
}

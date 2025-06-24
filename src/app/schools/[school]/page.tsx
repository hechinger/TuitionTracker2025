import SearchBar from "@/components/SearchBar";
import SchoolTopper from "@/components/SchoolTopper";
import HistoricalPrices from "@/components/HistoricalPrices";
import IncomeBracketBarChart from "@/components/IncomeBracketBarChart";
import SchoolDetails from "@/components/SchoolDetails";
import GraduationRateSection from "@/components/GraduationRateSection";
import StudentRetentionSection from "@/components/StudentRetentionSection";
import DemographicsSection from "@/components/DemographicsSection";
import ContactUs from "@/components/ContactUs";

export default async function School(props: {
  params: Promise<{ school: string }>;
}) {
  const { school } = await props.params;
  const schoolId = `${school.split('-').at(-1)}`;
  return (
    <div>
      <SearchBar />
      <SchoolTopper schoolId={schoolId} />
      <HistoricalPrices schoolId={schoolId} />
      <IncomeBracketBarChart schoolId={schoolId} />
      <SchoolDetails schoolId={schoolId} />
      <GraduationRateSection schoolId={schoolId} />
      <ContactUs />
      <StudentRetentionSection schoolId={schoolId} />
      <DemographicsSection schoolId={schoolId} />
    </div>
  );
}

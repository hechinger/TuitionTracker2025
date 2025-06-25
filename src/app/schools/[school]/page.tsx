import PageTopOverlap from "@/components/PageTopOverlap";
import SearchBar from "@/components/SearchBar";
import SchoolTopper from "@/components/SchoolTopper";
import HistoricalPrices from "@/components/HistoricalPrices";
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
    <>
      <PageTopOverlap>
        <SearchBar withNav />
      </PageTopOverlap>
      <SchoolTopper schoolId={schoolId} />
      <HistoricalPrices schoolId={schoolId} />
      <SchoolDetails schoolId={schoolId} />
      <GraduationRateSection schoolId={schoolId} />
      <ContactUs />
      <StudentRetentionSection schoolId={schoolId} />
      <DemographicsSection schoolId={schoolId} />
    </>
  );
}

import { getContent } from "@/db/content";
import BrandTopper from "@/components/BrandTopper";
import PageContent from "@/components/PageContent";
import BrandFooter from "@/components/BrandFooter";
import DataProvider from "@/components/DataProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdSlot from "@/components/AdSlot";
import PageTopOverlap from "@/components/PageTopOverlap";
import SearchBar from "@/components/SearchBar";
import SchoolTopper from "@/components/SchoolTopper";
import HistoricalPrices from "@/components/HistoricalPrices";
import SchoolDetails from "@/components/SchoolDetails";
import GraduationRateSection from "@/components/GraduationRateSection";
import StudentRetentionSection from "@/components/StudentRetentionSection";
import DemographicsSection from "@/components/DemographicsSection";
import ContactUs from "@/components/ContactUs";
import Recirculation from "@/components/Recirculation";
import SavedSchoolsNav from "@/components/SavedSchoolsNav";

export default async function School(props: {
  params: Promise<{ school: string }>;
}) {
  const [
    { school },
    content,
  ] = await Promise.all([
    props.params,
    getContent(),
  ]);

  const schoolId = `${school.split('-').at(-1)}`;

  return (
    <>
      <BrandTopper />
      <PageContent>
        <DataProvider content={content}>
          <PageTopOverlap>
            <ErrorBoundary>
              <SearchBar withNav />
            </ErrorBoundary>
          </PageTopOverlap>

          <ErrorBoundary>
            <SchoolTopper schoolId={schoolId} />
          </ErrorBoundary>

          <AdSlot />

          <ErrorBoundary>
            <HistoricalPrices schoolId={schoolId} />
          </ErrorBoundary>

          <ErrorBoundary>
            <SchoolDetails schoolId={schoolId} />
          </ErrorBoundary>

          <ErrorBoundary>
            <GraduationRateSection schoolId={schoolId} />
          </ErrorBoundary>

          <ContactUs />

          <ErrorBoundary>
            <StudentRetentionSection schoolId={schoolId} />
          </ErrorBoundary>

          <ErrorBoundary>
            <DemographicsSection schoolId={schoolId} />
          </ErrorBoundary>

          <Recirculation />
          <SavedSchoolsNav />
        </DataProvider>
      </PageContent>
      <BrandFooter />
    </>
  );
}

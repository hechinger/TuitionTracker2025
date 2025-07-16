import { cache } from "react";
import { getContent } from "@/db/content";
import { getSchoolsDetail } from "@/db/schools";
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

const getSchool = cache(async (id: string) => {
  const [school] = await getSchoolsDetail({
    schoolIds: [id],
  });
  return school;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school: string }>;
}) {
  const { school: schoolSlug } = await params;
  const schoolId = `${schoolSlug.split('-').at(-1)}`;
  const school = await getSchool(schoolId);
  return {
    title: `${school.name} Real Tuition Costs (What You’ll Pay After Assistance)`,
    openGraph: {
      title: `Tuition Tracker - ${school.name}`,
      description: "What You’ll Pay After Assistance",
      url: `https://tuitiontracker.org/schools/${schoolSlug}`,
      siteName: "Tuition Tracker",
      images: school.image || "https://hechingerreport.org/wp-content/uploads/2020/07/THR-for-Cisco-wallpaper.jpg",
      type: "website",
    },
    icons: {
      icon: "https://hechingerreport.org/wp-content/uploads/2018/06/cropped-favicon-32x32.jpg",
      shortcut: "https://i0.wp.com/hechingerreport.org/wp-content/uploads/2018/06/cropped-favicon.jpg?fit=192%2C192&ssl=1",
      apple: "https://i0.wp.com/hechingerreport.org/wp-content/uploads/2018/06/cropped-favicon.jpg?fit=192%2C192&ssl=1",
    },
  };
}

export default async function School(props: {
  params: Promise<{ school: string }>;
}) {
  const [
    { school: schoolSlug },
    content,
  ] = await Promise.all([
    props.params,
    getContent(),
  ]);

  const schoolId = `${schoolSlug.split('-').at(-1)}`;
  // const school = await getSchool(schoolId);
  // const schools = { [schoolId]: school };
  const schools = undefined;

  return (
    <>
      <BrandTopper />
      <PageContent>
        <DataProvider content={content} schools={schools}>
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

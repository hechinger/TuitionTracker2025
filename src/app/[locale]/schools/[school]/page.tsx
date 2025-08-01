import { cache } from "react";
import { notFound } from "next/navigation";
import { DataLayer } from "@/analytics";
import { LAST_MODIFIED } from "@/constants";
import { getContent } from "@/db/content";
import { getSchoolsDetail } from "@/db/schools";
import { getNationalAverages } from "@/db/nationalAverages";
import { AdSlot } from "@/ads";
import DataProvider from "@/components/DataProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageTopOverlap from "@/components/PageTopOverlap";
import SearchBar from "@/components/SearchBar";
import SchoolTopper from "@/components/SchoolTopper";
import SchoolHistoricalPrices from "@/components/SchoolHistoricalPrices";
import SchoolDetails from "@/components/SchoolDetails";
import SchoolGraduationRate from "@/components/SchoolGraduationRate";
import SchoolRetention from "@/components/SchoolRetention";
import SchoolDemographics from "@/components/SchoolDemographics";
import ContactUs from "@/components/ContactUs";
import SchoolImageCredit from "@/components/SchoolImageCredit";
import Recirculation from "@/components/Recirculation";
import SavedSchoolsNav from "@/components/SavedSchoolsNav";

// Gets purged when content changes
export const revalidate = 86400; // 1d

const getSchool = cache(async (id: string) => {
  const [school] = await getSchoolsDetail({
    schoolIds: [id],
  });
  return school;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    school: string,
  }>;
}) {
  const { locale, school: schoolSlug } = await params;
  const schoolId = `${schoolSlug.split('-').at(-1)}`;
  const school = await getSchool(schoolId);

  if (!school) return {};

  const fallbackImage = (school.schoolControl === "public")
    ? "https://www.tuitiontracker.org/public.jpg"
    : "https://www.tuitiontracker.org/private.jpg";
  const img = school.image || fallbackImage;

  return {
    title: `${school.name} Real Tuition Costs (What You’ll Pay After Assistance)`,
    openGraph: {
      title: `Tuition Tracker - ${school.name}`,
      description: "What you’ll pay after assistance",
      url: `https://www.tuitiontracker.org/schools/${schoolSlug}`,
      siteName: "Tuition Tracker",
      images: img,
      type: "website",
    },
    icons: {
      icon: "https://hechingerreport.org/wp-content/uploads/2018/06/cropped-favicon-32x32.jpg",
      shortcut: "https://i0.wp.com/hechingerreport.org/wp-content/uploads/2018/06/cropped-favicon.jpg?fit=192%2C192&ssl=1",
      apple: "https://i0.wp.com/hechingerreport.org/wp-content/uploads/2018/06/cropped-favicon.jpg?fit=192%2C192&ssl=1",
    },
    alternates: {
      languages: {
        en: `https://www.tuitiontracker.org/schools/${schoolSlug}`,
        es: `https://www.tuitiontracker.org/es/schools/${schoolSlug}`,
      },
    },
    other: {
      "parsely-title": school.name,
      "parsely-link": `https://www.tuitiontracker.org/schools/${schoolSlug}`,
      "parsely-type": "post",
      "parsely-image-url": img,
      "parsely-pub-date": LAST_MODIFIED.toISOString(),
      "parsely-section": locale,
      "parsely-author": school.state,
      "parsely-tags": [school.schoolControl, school.degreeLevel].join(", "),
    },
  };
}

export default async function School({
  params,
}: {
  params: Promise<{ locale: string, school: string }>;
}) {
  const { locale, school: schoolSlug } = await params;
  const schoolId = `${schoolSlug.split('-').at(-1)}`;
  const [
    content,
    school,
    nationalAverages,
  ] = await Promise.all([
    getContent({ locale }),
    getSchool(schoolId),
    getNationalAverages(),
  ]);

  if (!school) {
    return notFound();
  }

  return (
    <DataProvider locale={locale} content={content}>
      <DataLayer
        dataLayerKey={school.id}
        dataLayer={{
          schoolName: school.name,
          schoolType: school.schoolControl,
          schoolDuration: school.degreeLevel,
          schoolState: school.state,
          language: locale,
        }}
      />

      <PageTopOverlap>
        <ErrorBoundary>
          <SearchBar withNav />
        </ErrorBoundary>
      </PageTopOverlap>

      <ErrorBoundary>
        <SchoolTopper school={school} />
      </ErrorBoundary>

      <AdSlot />

      <ErrorBoundary>
        <SchoolHistoricalPrices school={school} />
      </ErrorBoundary>

      <ErrorBoundary>
        <SchoolDetails school={school} />
      </ErrorBoundary>

      <ErrorBoundary>
        <SchoolGraduationRate
          school={school}
          nationalAverages={nationalAverages}
        />
      </ErrorBoundary>

      <ContactUs />

      <ErrorBoundary>
        <SchoolRetention
          school={school}
          nationalAverages={nationalAverages}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <SchoolDemographics school={school} />
      </ErrorBoundary>

      <ErrorBoundary>
        <SchoolImageCredit school={school} />
      </ErrorBoundary>

      <Recirculation />
      <SavedSchoolsNav />
    </DataProvider>
  );
}

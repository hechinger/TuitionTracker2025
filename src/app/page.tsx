import { getContent } from "@/db/content";
import { getRecirculationArticles } from "@/db/recirculationArticles";
import { getRecommendedSchools } from "@/db/recommendedSchools";
import BrandTopper from "@/components/BrandTopper";
import PageContent from "@/components/PageContent";
import BrandFooter from "@/components/BrandFooter";
import DataProvider from "@/components/DataProvider";
import AdSlot from "@/components/AdSlot";
import PageTopOverlap from "@/components/PageTopOverlap";
import HeroSplash from "@/components/HeroSplash";
import SearchBar from "@/components/SearchBar";
import RecommendedSchools from "@/components/RecommendedSchools";
import Newsletter from "@/components/Newsletter";
import ContactUs from "@/components/ContactUs";
import Recirculation from "@/components/Recirculation";
import LandingPageTextSection from "@/components/LandingPageTextSection";
import SavedSchoolsNav from "@/components/SavedSchoolsNav";

export default async function Home() {
  const [
    content,
    articles,
    schoolSections,
  ] = await Promise.all([
    getContent(),
    getRecirculationArticles({ page: "landing" }),
    getRecommendedSchools(),
  ]);

  return (
    <>
      <BrandTopper />
      <PageContent>
        <DataProvider content={content}>
          <PageTopOverlap>
            <HeroSplash />
          </PageTopOverlap>
          <SearchBar
            highlight
          />
          {schoolSections.map((section) => (
            <RecommendedSchools
              key={section.key}
              title={section.title.english}
              schoolIds={section.schoolIds}
            />
          ))}
          <AdSlot />
          <Newsletter />
          <LandingPageTextSection
            titleKey="About.title"
            textKey="About.copy"
          />
          <ContactUs />
          <Recirculation articles={articles} />
          <LandingPageTextSection
            titleKey="DownloadData.title"
            textKey="DownloadData.copy"
          />
          <SavedSchoolsNav />
        </DataProvider>
      </PageContent>
      <BrandFooter />
    </>
  );
}

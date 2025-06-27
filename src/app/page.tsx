import AdSlot from "@/components/AdSlot";
import PageTopOverlap from "@/components/PageTopOverlap";
import HeroSplash from "@/components/HeroSplash";
import SearchBar from "@/components/SearchBar";
import RecommendedSchools from "@/components/RecommendedSchools";
import Newsletter from "@/components/Newsletter";
import ContactUs from "@/components/ContactUs";
import Recirculation from "@/components/Recirculation";
import LandingPageTextSection from "@/components/LandingPageTextSection";

const stateSchools = [
  "100724", // Alabama State University
  "134097", // Florida State University
  "134130", // University of Florida
  "187985", // University of New Mexico-Main Campus
  "236939", // Washington State University
];

const liberalArtsSchools = [
  "166027", // Harvard University
  "186131", // Princeton University
  "243744", // Stanford University
  "130794", // Yale University
  "182670", // Dartmouth College
];

export default function Home() {
  return (
    <>
      <PageTopOverlap>
        <HeroSplash />
      </PageTopOverlap>
      <SearchBar highlight />
      <RecommendedSchools
        title="Big State Schools"
        schoolIds={stateSchools}
      />
      <RecommendedSchools
        title="Liberal Arts Schools"
        schoolIds={liberalArtsSchools}
      />
      <AdSlot />
      <Newsletter />
      <LandingPageTextSection
        titleKey="landingPageAboutTitle"
        textKey="landingPageAboutText"
      />
      <ContactUs />
      <Recirculation />
      <LandingPageTextSection
        titleKey="landingPageDownloadDataTitle"
        textKey="landingPageDownloadDataText"
      />
    </>
  );
}

import PageTopOverlap from "@/components/PageTopOverlap";
import HeroSplash from "@/components/HeroSplash";
import SearchBar from "@/components/SearchBar";
import RecommendedSchools from "@/components/RecommendedSchools";
import Newsletter from "@/components/Newsletter";
import ContactUs from "@/components/ContactUs";
import Recirculation from "@/components/Recirculation";
import LandingPageTextSection from "@/components/LandingPageTextSection";

export default function Home() {
  return (
    <>
      <PageTopOverlap>
        <HeroSplash />
      </PageTopOverlap>
      <SearchBar highlight />
      <RecommendedSchools
        title="Big State Schools"
        schoolIds={["237136", "158343", "150145", "480781", "405872"]}
      />
      <RecommendedSchools
        title="Liberal Arts Schools"
        schoolIds={["162104", "211477", "201751", "211644", "177250"]}
      />
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

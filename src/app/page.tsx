import HeroSplash from "@/components/HeroSplash";
import SearchBar from "@/components/SearchBar";
import RecommendedSchools from "@/components/RecommendedSchools";
import ContactUs from "@/components/ContactUs";
import LandingPageTextSection from "@/components/LandingPageTextSection";

export default function Home() {
  return (
    <div>
      <HeroSplash />
      <SearchBar />
      <RecommendedSchools
        title="Big State Schools"
        schoolIds={["237136", "158343", "150145", "480781", "405872"]}
      />
      <RecommendedSchools
        title="Liberal Arts Schools"
        schoolIds={["162104", "211477", "201751", "211644", "177250"]}
      />
      <ContactUs />
      <LandingPageTextSection
        titleKey="landingPageAboutTitle"
        textKey="landingPageAboutText"
      />
      <LandingPageTextSection
        titleKey="landingPageDownloadDataTitle"
        textKey="landingPageDownloadDataText"
      />
    </div>
  );
}

import BrandTopper from "@/components/BrandTopper";
import PageContent from "@/components/PageContent";
import BrandFooter from "@/components/BrandFooter";
import DataProvider from "@/components/DataProvider";
import AdSlot from "@/components/AdSlot";
import PageTopOverlap from "@/components/PageTopOverlap";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import ContactUs from "@/components/ContactUs";
import Recirculation from "@/components/Recirculation";
import SavedSchoolsNav from "@/components/SavedSchoolsNav";

export default function Search() {
  return (
    <>
      <BrandTopper />
      <PageContent>
        <DataProvider>
          <PageTopOverlap>
            <SearchBar autoload withNav />
          </PageTopOverlap>
          <AdSlot />
          <SearchResults />
          <ContactUs />
          <Recirculation />
          <SavedSchoolsNav />
        </DataProvider>
      </PageContent>
      <BrandFooter />
    </>
  );
}

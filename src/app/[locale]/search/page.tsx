import { getContent } from "@/db/content";
import { getRecirculationArticles } from "@/db/recirculationArticles";
import DataProvider from "@/components/DataProvider";
import AdSlot from "@/components/AdSlot";
import PageTopOverlap from "@/components/PageTopOverlap";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import ContactUs from "@/components/ContactUs";
import Recirculation from "@/components/Recirculation";
import SavedSchoolsNav from "@/components/SavedSchoolsNav";

// Gets purged when content changes
export const revalidate = 86400; // 1d

export default async function Search() {
  const [
    content,
    articles,
  ] = await Promise.all([
    getContent(),
    getRecirculationArticles({ page: "search" }),
  ]);

  return (
    <DataProvider content={content}>
      <PageTopOverlap>
        <SearchBar autoload withNav />
      </PageTopOverlap>
      <AdSlot />
      <SearchResults />
      <ContactUs />
      <Recirculation articles={articles} />
      <SavedSchoolsNav />
    </DataProvider>
  );
}

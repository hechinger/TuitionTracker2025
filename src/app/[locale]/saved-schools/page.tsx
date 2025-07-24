import { getContent } from "@/db/content";
import { getRecirculationArticles } from "@/db/recirculationArticles";
import DataProvider from "@/components/DataProvider";
import PageTopOverlap from "@/components/PageTopOverlap";
import SearchBar from "@/components/SearchBar";
import SchoolComparison from "@/components/SchoolComparison";
import Recirculation from "@/components/Recirculation";

// Gets purged when content changes
export const revalidate = 86400; // 1d

export default async function SavedSchools() {
  const [
    content,
    articles,
  ] = await Promise.all([
    getContent(),
    getRecirculationArticles({ page: "comparison" }),
  ]);

  return (
    <DataProvider content={content}>
      <PageTopOverlap>
        <SearchBar withNav />
      </PageTopOverlap>
      <SchoolComparison />
      <Recirculation articles={articles} />
    </DataProvider>
  );
}

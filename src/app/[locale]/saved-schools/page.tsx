import type { Metadata } from "next";
import { getContent } from "@/db/content";
import { getRecirculationArticles } from "@/db/recirculationArticles";
import { DataLayer } from "@/analytics";
import DataProvider from "@/components/DataProvider";
import PageTopOverlap from "@/components/PageTopOverlap";
import SearchBar from "@/components/SearchBar";
import SchoolComparison from "@/components/SchoolComparison";
import Recirculation from "@/components/Recirculation";

// Gets purged when content changes
export const revalidate = 86400; // 1d

export const metadata: Metadata = {
  other: {
    "parsely-title": "saved-schools",
    "parsely-link": "https://tuitiontracker.org/saved-schools",
    "parsely-type": "index",
    "parsely-section": "saved-schools",
    "parsely-author": "Tuition Tracker",
  },
};

export default async function SavedSchools({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const [
    content,
    articles,
  ] = await Promise.all([
    getContent({ locale }),
    getRecirculationArticles({ page: "comparison" }),
  ]);

  return (
    <DataProvider locale={locale} content={content}>
      <DataLayer
        dataLayerKey="search"
        dataLayer={{
          language: locale,
        }}
      />

      <PageTopOverlap>
        <SearchBar withNav />
      </PageTopOverlap>
      <SchoolComparison />
      <Recirculation articles={articles} />
    </DataProvider>
  );
}

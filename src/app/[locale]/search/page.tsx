import type { Metadata } from "next";
import { Suspense } from "react";
import { getContent } from "@/db/content";
import { getRecirculationArticles } from "@/db/recirculationArticles";
import { DataLayer } from "@/analytics";
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

export const metadata: Metadata = {
  title: "Tuition Tracker - Search Results",
  openGraph: {
    url: "https://tuitiontracker.org/search",
  },
  other: {
    "parsely-title": "search-results",
    "parsely-link": "https://tuitiontracker.org/search",
    "parsely-type": "index",
    "parsely-section": "search-results",
    "parsely-author": "Tuition Tracker",
  },
};

export default async function Search({
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
    getRecirculationArticles({ page: "search" }),
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
        <SearchBar autoload withNav />
      </PageTopOverlap>
      <AdSlot />
      <Suspense>
        <SearchResults />
      </Suspense>
      <ContactUs />
      <Recirculation articles={articles} />
      <SavedSchoolsNav />
    </DataProvider>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/routing";
import { Suspense } from "react";
import { getContent } from "@/db/content";
import { getRecirculationArticles } from "@/db/recirculationArticles";
import { DataLayer } from "@/analytics";
import { AdSlot } from "@/ads";
import DataProvider from "@/components/DataProvider";
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
    url: "https://www.tuitiontracker.org/search",
  },
  other: {
    "parsely-title": "search-results",
    "parsely-link": "https://www.tuitiontracker.org/search",
    "parsely-type": "index",
    "parsely-section": "search-results",
    "parsely-author": "Tuition Tracker",
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Search({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

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
        <AdSlot />
        <SearchBar autoload withNav />
      </PageTopOverlap>
      <Suspense>
        <SearchResults />
      </Suspense>
      <ContactUs />
      <Recirculation articles={articles} />
      <SavedSchoolsNav />
    </DataProvider>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/routing";
import { getContent } from "@/db/content";
import { getRecirculationArticles } from "@/db/recirculationArticles";
import { getRecommendedSchools } from "@/db/recommendedSchools";
import { DataLayer } from "@/analytics";
import { AdSlot } from "@/ads";
import DataProvider from "@/components/DataProvider";
import PageTopOverlap from "@/components/PageTopOverlap";
import HeroSplash from "@/components/HeroSplash";
import SearchBar from "@/components/SearchBar";
import RecommendedSchools from "@/components/RecommendedSchools";
import NewsletterSignup from "@/components/NewsletterSignup";
import ContactUs from "@/components/ContactUs";
import Recirculation from "@/components/Recirculation";
import LandingPageTextSection from "@/components/LandingPageTextSection";
import DownloadData from "@/components/DownloadData";
import SavedSchoolsNav from "@/components/SavedSchoolsNav";

// Gets purged when content changes
export const revalidate = 86400; // 1d

export const metadata: Metadata = {
  other: {
    "parsely-title": "index",
    "parsely-link": "https://www.tuitiontracker.org",
    "parsely-type": "index",
    "parsely-section": "homepage",
    "parsely-author": "Tuition Tracker",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({
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
    schoolSections,
  ] = await Promise.all([
    getContent({ locale }),
    getRecirculationArticles({ page: "landing" }),
    getRecommendedSchools(),
  ]);

  return (
    <DataProvider locale={locale} content={content}>
      <DataLayer
        dataLayerKey="index"
        dataLayer={{
          language: locale,
        }}
      />

      <PageTopOverlap>
        <HeroSplash />
      </PageTopOverlap>
      <SearchBar
        highlight
      />
      {schoolSections.map((section) => (
        <RecommendedSchools
          key={section.key}
          title={section.title.en}
          schools={section.schools}
        />
      ))}
      <AdSlot />
      <NewsletterSignup />
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
      <DownloadData />
      <SavedSchoolsNav />
    </DataProvider>
  );
}

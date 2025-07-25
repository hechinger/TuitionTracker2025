import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/analytics";
import { routing } from "@/i18n/routing";
import HechingerTopper from "@/components/HechingerTopper";
import HechingerFooter from "@/components/HechingerFooter";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Tuition Tracker - True University Costs per Income Bracket",
  openGraph: {
    title: "Tuition Tracker",
    description: "True University Costs per Income Bracket",
    url: "https://tuitiontracker.org",
    siteName: "Tuition Tracker",
    images: "https://hechingerreport.org/wp-content/uploads/2020/07/THR-for-Cisco-wallpaper.jpg",
    type: "website",
  },
  icons: {
    icon: "https://hechingerreport.org/wp-content/uploads/2018/06/cropped-favicon-32x32.jpg",
    shortcut: "https://i0.wp.com/hechingerreport.org/wp-content/uploads/2018/06/cropped-favicon.jpg?fit=192%2C192&ssl=1",
    apple: "https://i0.wp.com/hechingerreport.org/wp-content/uploads/2018/06/cropped-favicon.jpg?fit=192%2C192&ssl=1",
  },
  alternates: {
    languages: {
      en: "https://tuitiontracker.org/",
      es: "https://tuitiontracker.org/es/",
    },
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <GoogleTagManager />
      </head>
      <body>
        <GoogleTagManagerNoScript />

        <NextIntlClientProvider>
          <HechingerTopper />
          <div>
            {children}
          </div>
          <HechingerFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

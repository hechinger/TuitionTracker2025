import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
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
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2DBQW0NLND"
        />
        <Script id="gtag-loader">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P7263Q9H');`}
        </Script>
        <Script
          async
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        />
        <Script id="gpt-loader">
          {`
            window.googletag = window.googletag || {cmd: []};
            googletag.cmd.push(function() {
              googletag.defineSlot('/6160094/tuition-tracker-top-001', [728, 90], 'div-gpt-ad-1732288624207-0').addService(googletag.pubads());
              googletag.pubads().enableSingleRequest();
              googletag.enableServices();
            });
          `}
        </Script>
      </head>
      <body>
        <NextIntlClientProvider>
          <HechingerTopper />
          <div>
            {children}
          </div>
          <HechingerFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

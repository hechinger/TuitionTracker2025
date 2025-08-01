import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tuition Tracker - True University Costs per Income Bracket",
  openGraph: {
    title: "Tuition Tracker",
    description: "True University Costs per Income Bracket",
    url: "https://www.tuitiontracker.org",
    siteName: "Tuition Tracker",
    images: "https://hechingerreport.org/wp-content/uploads/2020/07/THR-for-Cisco-wallpaper.jpg",
    type: "website",
  },
  icons: {
    icon: "https://hechingerreport.org/wp-content/uploads/2018/06/cropped-favicon-32x32.jpg",
    shortcut: "https://i0.wp.com/hechingerreport.org/wp-content/uploads/2018/06/cropped-favicon.jpg?fit=192%2C192&ssl=1",
    apple: "https://i0.wp.com/hechingerreport.org/wp-content/uploads/2018/06/cropped-favicon.jpg?fit=192%2C192&ssl=1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

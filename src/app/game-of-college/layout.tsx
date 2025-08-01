import type { Metadata } from "next";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/analytics";

export const metadata: Metadata = {
  title: "A Game of College | The Hechinger Report",
  openGraph: {
    title: "A Game of College: Can you get into college and finish a degree without taking on too much debt?",
    url: "https://www.tuitiontracker.org/game-of-college",
    siteName: "A Game of College",
    images: "https://kjxofjq2cxejjxiu.public.blob.vercel-storage.com/game-of-college-share.jpg",
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
      <head>
        <GoogleTagManager />
      </head>
      <body>
        <GoogleTagManagerNoScript />
        {children}
      </body>
    </html>
  );
}

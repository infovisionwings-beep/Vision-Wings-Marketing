import type { Metadata } from "next";
import { League_Spartan, DM_Sans } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://visionwing.com"), // Placeholder URL, update to actual domain
  title: {
    default: "Vision Wing - Premium Marketing Agency",
    template: "%s | Vision Wing",
  },
  description: "Vision Wing is a premium marketing agency, brand strategy studio, and business consultancy dedicated to elevating visionary brands.",
  keywords: ["marketing agency", "brand strategy", "business consultancy", "premium design", "Vision Wing"],
  authors: [{ name: "Vision Wing" }],
  openGraph: {
    title: "Vision Wing - Premium Marketing Agency",
    description: "Vision Wing is a premium marketing agency, brand strategy studio, and business consultancy.",
    url: "https://visionwing.com",
    siteName: "Vision Wing",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vision Wing - Premium Marketing Agency",
    description: "Vision Wing is a premium marketing agency, brand strategy studio, and business consultancy.",
    creator: "@visionwing",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Vision Wing",
  "image": "https://visionwing.com/logo-svg/Primary%20ICON.svg",
  "description": "Vision Wing is a premium marketing agency, brand strategy studio, and business consultancy.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Strategy Blvd",
    "addressLocality": "New York",
    "addressRegion": "NY",
    "postalCode": "10001",
    "addressCountry": "US"
  },
  "url": "https://visionwing.com",
  "telephone": "+11234567890",
};

import SmoothScrollProvider from "@/components/motion/SmoothScrollProvider";
import CursorAperture from "@/components/motion/CursorAperture";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { LoaderProvider } from "@/components/providers/LoaderProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${leagueSpartan.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-warm-50 text-navy-950">
        <LoaderProvider>
          <SmoothScrollProvider>
            <CursorAperture />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}

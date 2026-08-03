import type { Metadata } from "next";
import { League_Spartan, DM_Sans } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.visionwingsmarketing.com"),
  title: {
    default: "Vision Wings Marketing - Strategic Growth & Marketing Agency",
    template: "%s | Vision Wings Marketing",
  },
  description: "Vision Wings Marketing is a strategic marketing and growth partner based in Varanasi, elevating growth-stage businesses.",
  keywords: ["marketing agency", "brand strategy", "business consultancy", "growth marketing", "Vision Wings Marketing", "Varanasi agency"],
  authors: [{ name: "Vision Wings Marketing" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/logo-svg/Primary%20ICON.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/logo-svg/Primary%20ICON.svg",
  },
  openGraph: {
    title: "Vision Wings Marketing - Strategic Growth & Marketing Agency",
    description: "Vision Wings Marketing is a strategic marketing agency and growth partner.",
    url: "https://www.visionwingsmarketing.com",
    siteName: "Vision Wings Marketing",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vision Wings Marketing - Strategic Growth & Marketing Agency",
    description: "Vision Wings Marketing is a strategic marketing agency and growth partner.",
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
  "name": "Vision Wings Marketing",
  "image": "https://www.visionwingsmarketing.com/logo-svg/Primary%20ICON.svg",
  "description": "Vision Wings Marketing is a strategic marketing agency and growth partner based in Varanasi, India.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kandawa",
    "addressLocality": "Varanasi",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "221106",
    "addressCountry": "IN"
  },
  "url": "https://www.visionwingsmarketing.com",
  "telephone": "+918081952359",
};

import SmoothScrollProvider from "@/components/motion/SmoothScrollProvider";
import CursorAperture from "@/components/motion/CursorAperture";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { auth } from '@/lib/auth/server';

import { LoaderProvider } from "@/components/providers/LoaderProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  let isAdmin = false;
  try {
    const sessionRes = await auth.getSession();
    if (sessionRes?.data?.user) {
      // Safely serialize the user object to avoid Next.js RSC hydration errors
      const serializedUser = JSON.parse(JSON.stringify(sessionRes.data.user));
      user = serializedUser;
      
      const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [];
      const superAdmin = process.env.SUPER_ADMIN_EMAIL?.trim()?.toLowerCase();
      
      if (
        (user.email && adminEmails.includes(user.email.toLowerCase())) || 
        (user.email && superAdmin === user.email.toLowerCase())
      ) {
        isAdmin = true;
      }
    }
  } catch (e) {
    // Ignore errors during build or if Neon Auth is unconfigured
  }

  return (
    <html
      lang="en"
      className={`${leagueSpartan.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KGL4WL9DLW"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-KGL4WL9DLW');
`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-warm-50 text-navy-950">
        <LoaderProvider>
          <SmoothScrollProvider>
            <CursorAperture />
            <Navbar user={user} isAdmin={isAdmin} />
            <main className="flex-grow">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}

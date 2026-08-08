import type { Metadata } from "next";
import { League_Spartan, DM_Sans } from "next/font/google";
import Script from "next/script";
import { OG_IMAGE, OG_IMAGE_SIZE } from "@/lib/seo";
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
  // Icons come from the App Router file convention — app/favicon.ico, app/icon.png
  // and app/apple-icon.png. Declaring them here instead would override that and
  // pin plain URLs, which is what previously left the site pointing at icon files
  // that had moved out of public/.
  openGraph: {
    title: "Vision Wings Marketing - Strategic Growth & Marketing Agency",
    description: "Vision Wings Marketing is a strategic marketing agency and growth partner.",
    url: "https://www.visionwingsmarketing.com",
    siteName: "Vision Wings Marketing",
    locale: "en_US",
    type: "website",
    // The default card for anything that doesn't set its own — pages like
    // login and onboarding declare metadata without going through
    // pageMetadata(), so without this they'd share with no artwork at all.
    images: [{ url: OG_IMAGE, ...OG_IMAGE_SIZE, alt: "Vision Wings Marketing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vision Wings Marketing - Strategic Growth & Marketing Agency",
    description: "Vision Wings Marketing is a strategic marketing agency and growth partner.",
    creator: "@visionwing",
    images: [OG_IMAGE],
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
import DeferredCursor from "@/components/motion/DeferredCursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { auth } from '@/lib/auth/server';
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";

import { LoaderProvider } from "@/components/providers/LoaderProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The dashboard brings its own chrome — a sidebar on desktop, a drawer on
  // mobile. The public Navbar is `fixed top-0 z-50` and the admin header that
  // holds the drawer trigger is `sticky top-0 z-10`, so rendering both put the
  // marketing nav directly on top of the hamburger button. On desktop the
  // sidebar is visible and navigation still worked, which is why this only ever
  // showed up on mobile: the menu button was there, just covered.
  const pathnameForChrome = (await headers()).get("x-pathname") || "";
  const isAdminSurface =
    pathnameForChrome.startsWith("/admin") ||
    pathnameForChrome.startsWith("/admin-login") ||
    pathnameForChrome.startsWith("/admin-invite");

  let user: any = null;
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

      // Mandatory Onboarding Gate: Non-admin logged-in users must complete onboarding profile before entering main website
      if (!isAdmin) {
        const headerList = await headers();
        const pathname = headerList.get("x-pathname") || "";
        const isExcluded =
          pathname.startsWith("/onboarding") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/admin") ||
          pathname.startsWith("/api");

        if (!isExcluded) {
          const [profile] = await db
            .select()
            .from(userProfiles)
            .where(or(eq(userProfiles.userId, user.id), eq(userProfiles.userId, user.email || "")))
            .limit(1);

          if (!profile) {
            redirect("/onboarding");
          }
        }
      }
    }
  } catch (e) {
    if (e && typeof e === 'object' && 'digest' in e && String(e.digest).startsWith('NEXT_REDIRECT')) {
      throw e;
    }
    // Ignore errors during build or if Neon Auth is unconfigured
  }

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
            <DeferredCursor />
            {!isAdminSurface && <Navbar user={user} isAdmin={isAdmin} />}
            <main className="flex-grow">{children}</main>
            {!isAdminSurface && <Footer />}
          </SmoothScrollProvider>
        </LoaderProvider>

        {/* Analytics moved out of <head> and off the critical path. As raw
            script tags these opened a googletagmanager connection while the
            page was still fetching its own JS and fonts; "afterInteractive"
            waits until hydration is done. Measurement is unaffected — gtag
            queues events until the library lands. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KGL4WL9DLW"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-KGL4WL9DLW');`}
        </Script>
      </body>
    </html>
  );
}

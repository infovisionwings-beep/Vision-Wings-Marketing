import type { Metadata } from "next";

// The page is a client component and cannot export `metadata` itself.
export const metadata: Metadata = {
  title: "Client Onboarding",
  robots: { index: false, follow: true },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

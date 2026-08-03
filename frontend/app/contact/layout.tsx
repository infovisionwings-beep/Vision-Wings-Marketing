import type { Metadata } from "next";

// The page itself is a client component (interactive form state), and client
// components cannot export `metadata` — without this layout every visit to
// /contact fell back to the site-wide default title and description.
export const metadata: Metadata = {
  title: "Contact Us",
  description: "Tell us about your growth goals. A senior brand strategist will respond within 24 hours.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

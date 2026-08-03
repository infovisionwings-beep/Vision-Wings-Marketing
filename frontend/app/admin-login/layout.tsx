import type { Metadata } from "next";

// The page is a client component and cannot export `metadata` itself.
export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

// The page is a client component and cannot export `metadata` itself.
export const metadata: Metadata = {
  title: "Set a New Password",
  robots: { index: false, follow: true },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

// The page is a client component and cannot export `metadata` itself.
export const metadata: Metadata = {
  title: "Reset Your Password",
  robots: { index: false, follow: true },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}

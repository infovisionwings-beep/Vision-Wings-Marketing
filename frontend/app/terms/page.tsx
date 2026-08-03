import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { LegalDocViewer } from "@/components/legal/LegalDocViewer";

export const metadata: Metadata = {
  title: "Terms of Service | Vision Wings Marketing",
  description: "Terms of Service for Vision Wings Marketing — governing your use of our website and marketing services.",
};

export default function TermsPage() {
  const filePath = path.join(process.cwd(), "..", "legal", "02-terms-of-service.md");
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <LegalDocViewer currentSlug="terms" markdown={markdown} />;
}

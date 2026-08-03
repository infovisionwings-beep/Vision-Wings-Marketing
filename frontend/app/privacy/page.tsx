import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { LegalDocViewer } from "@/components/legal/LegalDocViewer";

export const metadata: Metadata = {
  title: "Privacy Policy | Vision Wings Marketing",
  description: "Privacy Policy for Vision Wings Marketing — learn how we process and protect your personal data under DPDP Act 2023.",
};

export default function PrivacyPage() {
  const filePath = path.join(process.cwd(), "..", "legal", "01-privacy-policy.md");
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <LegalDocViewer currentSlug="privacy" markdown={markdown} />;
}

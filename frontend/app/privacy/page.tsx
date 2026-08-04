import fs from "fs";
import path from "path";
import { pageMetadata } from "@/lib/seo";
import { LegalDocViewer } from "@/components/legal/LegalDocViewer";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for Vision Wings Marketing — learn how we process and protect your personal data under DPDP Act 2023.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const filePath = path.join(process.cwd(), "..", "legal", "01-privacy-policy.md");
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <LegalDocViewer currentSlug="privacy" markdown={markdown} />;
}

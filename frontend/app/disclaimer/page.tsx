import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { LegalDocViewer } from "@/components/legal/LegalDocViewer";

export const metadata: Metadata = {
  title: "Disclaimer | Vision Wings Marketing",
  description: "Website Disclaimer for Vision Wings Marketing — general information, no guarantee of campaign results, and platform disclaimers.",
};

export default function DisclaimerPage() {
  const filePath = path.join(process.cwd(), "..", "legal", "05-disclaimer.md");
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <LegalDocViewer currentSlug="disclaimer" markdown={markdown} />;
}

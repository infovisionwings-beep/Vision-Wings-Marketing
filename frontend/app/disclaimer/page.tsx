import fs from "fs";
import path from "path";
import { pageMetadata } from "@/lib/seo";
import { LegalDocViewer } from "@/components/legal/LegalDocViewer";

export const metadata = pageMetadata({
  title: "Disclaimer",
  description: "Website Disclaimer for Vision Wings Marketing — general information, no guarantee of campaign results, and platform disclaimers.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  const filePath = path.join(process.cwd(), "..", "legal", "05-disclaimer.md");
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <LegalDocViewer currentSlug="disclaimer" markdown={markdown} />;
}

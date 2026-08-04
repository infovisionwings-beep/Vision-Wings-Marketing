import fs from "fs";
import path from "path";
import { pageMetadata } from "@/lib/seo";
import { LegalDocViewer } from "@/components/legal/LegalDocViewer";

export const metadata = pageMetadata({
  title: "Acceptable Use Policy",
  description: "Acceptable Use Policy for Vision Wings Marketing — prohibited conduct, content restrictions, and compliance rules.",
  path: "/acceptable-use",
});

export default function AcceptableUsePage() {
  const filePath = path.join(process.cwd(), "..", "legal", "08-acceptable-use-policy.md");
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <LegalDocViewer currentSlug="acceptable-use" markdown={markdown} />;
}

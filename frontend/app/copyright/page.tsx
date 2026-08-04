import fs from "fs";
import path from "path";
import { pageMetadata } from "@/lib/seo";
import { LegalDocViewer } from "@/components/legal/LegalDocViewer";

export const metadata = pageMetadata({
  title: "Copyright Policy",
  description: "Copyright Policy for Vision Wings Marketing — ownership, permitted uses, client deliverables, and takedown procedure.",
  path: "/copyright",
});

export default function CopyrightPage() {
  const filePath = path.join(process.cwd(), "..", "legal", "06-copyright-policy.md");
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <LegalDocViewer currentSlug="copyright" markdown={markdown} />;
}

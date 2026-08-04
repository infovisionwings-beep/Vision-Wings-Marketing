import fs from "fs";
import path from "path";
import { pageMetadata } from "@/lib/seo";
import { LegalDocViewer } from "@/components/legal/LegalDocViewer";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description: "Cookie Policy for Vision Wings Marketing — learn how we use cookies and manage your consent.",
  path: "/cookies",
});

export default function CookiesPage() {
  const filePath = path.join(process.cwd(), "..", "legal", "03-cookie-policy.md");
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <LegalDocViewer currentSlug="cookies" markdown={markdown} />;
}

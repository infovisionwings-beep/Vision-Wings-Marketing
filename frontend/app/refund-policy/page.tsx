import fs from "fs";
import path from "path";
import { pageMetadata } from "@/lib/seo";
import { LegalDocViewer } from "@/components/legal/LegalDocViewer";

export const metadata = pageMetadata({
  title: "Refund & Cancellation Policy",
  description: "Refund and Cancellation Policy for Vision Wings Marketing — terms governing advance payments, retainers, and cancellations.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  const filePath = path.join(process.cwd(), "..", "legal", "04-refund-and-cancellation-policy.md");
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <LegalDocViewer currentSlug="refund-policy" markdown={markdown} />;
}

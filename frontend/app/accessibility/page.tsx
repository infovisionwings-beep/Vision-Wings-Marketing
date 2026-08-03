import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { LegalDocViewer } from "@/components/legal/LegalDocViewer";

export const metadata: Metadata = {
  title: "Accessibility Statement | Vision Wings Marketing",
  description: "Accessibility Statement for Vision Wings Marketing — WCAG 2.1 AA conformance, testing measures, and feedback contact.",
};

export default function AccessibilityPage() {
  const filePath = path.join(process.cwd(), "..", "legal", "07-accessibility-statement.md");
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <LegalDocViewer currentSlug="accessibility" markdown={markdown} />;
}

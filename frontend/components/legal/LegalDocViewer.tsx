import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText, Lock, RefreshCw, AlertCircle, Copyright, Eye, CheckCircle2 } from "lucide-react";

export const LEGAL_PAGES = [
  { slug: "privacy", name: "Privacy Policy", href: "/privacy", icon: Lock },
  { slug: "terms", name: "Terms of Service", href: "/terms", icon: FileText },
  { slug: "cookies", name: "Cookie Policy", href: "/cookies", icon: ShieldCheck },
  { slug: "refund-policy", name: "Refund & Cancellation", href: "/refund-policy", icon: RefreshCw },
  { slug: "disclaimer", name: "Disclaimer", href: "/disclaimer", icon: AlertCircle },
  { slug: "copyright", name: "Copyright Policy", href: "/copyright", icon: Copyright },
  { slug: "accessibility", name: "Accessibility Statement", href: "/accessibility", icon: Eye },
  { slug: "acceptable-use", name: "Acceptable Use Policy", href: "/acceptable-use", icon: CheckCircle2 },
];

interface LegalDocViewerProps {
  currentSlug: string;
  markdown: string;
}

export function LegalDocViewer({ currentSlug, markdown }: LegalDocViewerProps) {
  const currentDoc = LEGAL_PAGES.find((p) => p.slug === currentSlug) || LEGAL_PAGES[0];

  // Simple Markdown Parser to JSX
  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableHeader: string[] = [];
    let tableRows: string[][] = [];
    let listItems: string[] = [];
    let isOrderedList = false;

    const flushList = (key: string) => {
      if (listItems.length > 0) {
        if (isOrderedList) {
          elements.push(
            <ol key={key} className="list-decimal list-inside space-y-2 my-4 text-navy-800 text-body leading-relaxed pl-2">
              {listItems.map((item, idx) => (
                <li key={idx} className="pl-1">
                  {formatInline(item)}
                </li>
              ))}
            </ol>
          );
        } else {
          elements.push(
            <ul key={key} className="list-disc list-inside space-y-2 my-4 text-navy-800 text-body leading-relaxed pl-2">
              {listItems.map((item, idx) => (
                <li key={idx} className="pl-1">
                  {formatInline(item)}
                </li>
              ))}
            </ul>
          );
        }
        listItems = [];
      }
    };

    const flushTable = (key: string) => {
      if (inTable && tableHeader.length > 0) {
        elements.push(
          <div key={key} className="overflow-x-auto my-6 rounded-lg border border-navy-100 shadow-xs">
            <table className="w-full text-left text-body-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-navy-50 text-navy-950 border-b border-navy-200">
                  {tableHeader.map((th, idx) => (
                    <th key={idx} className="py-3 px-4 font-semibold font-display">
                      {formatInline(th.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 bg-white">
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-warm-50/50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3 px-4 text-navy-800 align-top">
                        {formatInline(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        inTable = false;
        tableHeader = [];
        tableRows = [];
      }
    };

    const formatInline = (text: string): React.ReactNode => {
      // Process bold, italic, links
      const parts: React.ReactNode[] = [];
      let lastIdx = 0;

      // Regex for links [text](url) and bold **text**
      const combinedRegex = /(\[(.*?)\]\((.*?)\))|(\*\*(.*?)\*\*)|(\*(.*?)\*)/g;
      let match;

      while ((match = combinedRegex.exec(text)) !== null) {
        if (match.index > lastIdx) {
          parts.push(text.substring(lastIdx, match.index));
        }

        if (match[1]) {
          // Link
          const label = match[2];
          const url = match[3];
          parts.push(
            <Link key={match.index} href={url} className="text-bronze-600 hover:text-bronze-800 underline font-medium transition-colors">
              {label}
            </Link>
          );
        } else if (match[4]) {
          // Bold
          parts.push(
            <strong key={match.index} className="font-semibold text-navy-950">
              {match[5]}
            </strong>
          );
        } else if (match[6]) {
          // Italic
          parts.push(
            <em key={match.index} className="italic text-navy-800">
              {match[7]}
            </em>
          );
        }

        lastIdx = combinedRegex.lastIndex;
      }

      if (lastIdx < text.length) {
        parts.push(text.substring(lastIdx));
      }

      return parts.length === 1 ? parts[0] : parts;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Check Table
      if (trimmed.startsWith("|")) {
        flushList(`list-${index}`);
        const cells = trimmed.split("|").filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1);
        if (trimmed.includes("---")) {
          // Header divider row, ignore
          return;
        }
        if (!inTable) {
          inTable = true;
          tableHeader = cells;
        } else {
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        flushTable(`table-${index}`);
      }

      // Check List item
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (isOrderedList) flushList(`list-${index}`);
        isOrderedList = false;
        listItems.push(trimmed.substring(2));
        return;
      }
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        if (!isOrderedList) flushList(`list-${index}`);
        isOrderedList = true;
        listItems.push(numMatch[2]);
        return;
      }

      flushList(`list-${index}`);

      if (trimmed === "") {
        return;
      }

      if (trimmed.startsWith("# ")) {
        elements.push(
          <h1 key={index} className="text-h1 font-bold text-navy-950 mt-2 mb-4 font-display">
            {formatInline(trimmed.substring(2))}
          </h1>
        );
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="text-h2 font-semibold text-navy-900 mt-10 mb-4 pt-6 border-t border-navy-100 font-display">
            {formatInline(trimmed.substring(3))}
          </h2>
        );
      } else if (trimmed.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-h3 font-semibold text-navy-800 mt-6 mb-3 font-display">
            {formatInline(trimmed.substring(4))}
          </h3>
        );
      } else if (trimmed === "---") {
        elements.push(<hr key={index} className="my-8 border-navy-200" />);
      } else {
        elements.push(
          <p key={index} className="text-body text-navy-800 leading-relaxed my-3">
            {formatInline(trimmed)}
          </p>
        );
      }
    });

    flushList("final-list");
    flushTable("final-table");

    return elements;
  };

  return (
    <div className="bg-warm-50 min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Tabs */}
        <div className="mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex gap-2 min-w-max border-b border-navy-200 pb-3">
            {LEGAL_PAGES.map((page) => {
              const Icon = page.icon;
              const isActive = page.slug === currentSlug;
              return (
                <Link
                  key={page.slug}
                  href={page.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-body-sm font-medium transition-all ${
                    isActive
                      ? "bg-navy-950 text-warm-50 shadow-md font-semibold"
                      : "bg-white text-navy-700 hover:bg-navy-100/60 hover:text-navy-950 border border-navy-200/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-bronze-400" : "text-navy-500"}`} />
                  {page.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-2xl border border-navy-100 p-6 md:p-12 shadow-sm">
          <article className="prose max-w-none">{renderMarkdown(markdown)}</article>

          {/* Footer note inside document */}
          <div className="mt-16 pt-8 border-t border-navy-100 flex flex-col md:flex-row justify-between items-center gap-4 text-caption text-navy-500">
            <p>© 2026 Vision Wings Marketing. Registered in Varanasi, India.</p>
            <p>
              For legal inquiries:{" "}
              <a href="mailto:info.visionwings@gmail.com" className="text-bronze-600 hover:underline">
                info.visionwings@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

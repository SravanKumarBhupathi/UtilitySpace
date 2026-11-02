import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find and Replace Text — Bulk Text Replacer",
  description: "Find and replace words, phrases, or regex patterns in bulk text with case sensitivity and whole-word matching.",
  alternates: {
    canonical: "https://utilityspace.online/tools/text/find-replace",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

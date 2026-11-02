import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Compare & Diff Checker — Compare Text Online",
  description: "Compare two text blocks side-by-side to find differences, added words, removed sentences, and modifications.",
  alternates: {
    canonical: "https://utilityspace.online/tools/text/text-compare",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

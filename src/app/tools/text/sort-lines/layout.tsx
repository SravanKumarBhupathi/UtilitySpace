import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sort Lines Alphabetically — A-Z & Z-A Line Sorter",
  description: "Sort text lines in alphabetical order, reverse alphabetical order, by line length, or numerically.",
  alternates: {
    canonical: "https://utilityspace.online/tools/text/sort-lines",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

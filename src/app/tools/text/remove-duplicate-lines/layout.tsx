import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove Duplicate Lines — Deduplicate Lists Online",
  description: "Identify and remove duplicate lines from lists, datasets, and text blocks with case sensitivity options.",
  alternates: {
    canonical: "https://utilityspace.online/tools/text/remove-duplicate-lines",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

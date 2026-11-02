import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Merger — Combine Multiple PDFs into One File",
  description: "Merge and combine multiple PDF documents into a single organized file in seconds.",
  alternates: {
    canonical: "https://utilityspace.online/tools/pdf/merger",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

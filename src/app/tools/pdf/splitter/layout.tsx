import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Splitter — Split PDF into Multiple Documents",
  description: "Split large PDF files into separate individual pages or custom page ranges with zero server uploads.",
  alternates: {
    canonical: "https://utilityspace.online/tools/pdf/splitter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotate PDF Pages — Permanently Rotate PDF Orientation",
  description: "Rotate individual or all pages within a PDF file 90, 180, or 270 degrees and download the updated document.",
  alternates: {
    canonical: "https://utilityspace.online/tools/pdf/rotate-pages",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

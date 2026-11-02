import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete PDF Pages — Remove Unwanted Pages Online",
  description: "Select and remove specific pages from PDF documents and export a clean new PDF file.",
  alternates: {
    canonical: "https://utilityspace.online/tools/pdf/delete-pages",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

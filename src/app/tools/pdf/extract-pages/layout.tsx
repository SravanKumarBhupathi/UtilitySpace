import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extract PDF Pages — Save Specific Pages from PDF",
  description: "Extract selected pages or page ranges from a PDF document into a separate new PDF file.",
  alternates: {
    canonical: "https://utilityspace.online/tools/pdf/extract-pages",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

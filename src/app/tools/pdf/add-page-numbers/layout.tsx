import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF — Online PDF Numbering",
  description: "Insert custom page numbers, headers, and footers into PDF documents cleanly and privately.",
  alternates: {
    canonical: "https://utilityspace.online/tools/pdf/add-page-numbers",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

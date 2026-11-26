import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV to JSON & JSON to CSV Converter — Free & Client-Side",
  description: "Convert CSV to JSON and JSON to CSV online with live data table preview, delimiter auto-detection, customizable formatting, and file download. 100% private in your browser.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/csv-json-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

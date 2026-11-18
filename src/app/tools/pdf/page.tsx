import type { Metadata } from "next";
import CategoryPage from "../[category]/page";

export const metadata: Metadata = {
  title: "PDF Tools — Free Online Utilities",
  description: "Convert, merge, split, rotate, and compress PDF files securely in your browser without uploading to external servers.",
  alternates: {
    canonical: "https://utilityspace.online/tools/pdf",
  },
};

export default function PDFCategoryAlias() {
  return <CategoryPage params={Promise.resolve({ category: "pdf" })} />;
}

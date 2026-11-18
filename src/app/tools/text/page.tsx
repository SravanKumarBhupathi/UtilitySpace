import type { Metadata } from "next";
import CategoryPage from "../[category]/page";

export const metadata: Metadata = {
  title: "Text Tools — Free Online Utilities",
  description: "Count words, convert cases, compare diffs, sort lines, and clean text online. Fast, secure, and client-side utilities.",
  alternates: {
    canonical: "https://utilityspace.online/tools/text",
  },
};

export default function TextCategoryAlias() {
  return <CategoryPage params={Promise.resolve({ category: "text" })} />;
}

import type { Metadata } from "next";
import CategoryPage from "../[category]/page";

export const metadata: Metadata = {
  title: "Developer Tools — Free Online Utilities",
  description: "Format JSON, encode URLs, generate hashes, decode JWTs, and test regular expressions online. 100% private in-browser developer utilities.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer",
  },
};

export default function DeveloperCategoryAlias() {
  return <CategoryPage params={Promise.resolve({ category: "developer" })} />;
}

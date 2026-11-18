import type { Metadata } from "next";
import CategoryPage from "../[category]/page";

export const metadata: Metadata = {
  title: "Image Tools — Free Online Utilities",
  description: "Resize, compress, convert, and crop images online. Fast, secure, and client-side browser tools on UtilitySpace.",
  alternates: {
    canonical: "https://utilityspace.online/tools/images",
  },
};

export default function ImageCategoryAlias() {
  return <CategoryPage params={Promise.resolve({ category: "images" })} />;
}

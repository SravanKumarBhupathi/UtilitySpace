import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Slug Generator — Create SEO-Friendly URL Slugs",
  description: "Convert titles and article headlines into clean, URL-friendly, lowercase hyphenated slugs for SEO.",
  alternates: {
    canonical: "https://utilityspace.online/tools/text/slug-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

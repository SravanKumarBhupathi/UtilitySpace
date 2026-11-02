import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Converter — Uppercase, Lowercase, Title Case, CamelCase",
  description: "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, kebab-case, and snake_case.",
  alternates: {
    canonical: "https://utilityspace.online/tools/text/case-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator — Beautify JSON",
  description: "Format, validate, beautify, and minify JSON data with syntax highlighting and instant error detection in your browser.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/json-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML Formatter & Beautifier — Prettify XML",
  description: "Format, indent, validate, and beautify XML strings with custom indentation options locally.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/xml-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

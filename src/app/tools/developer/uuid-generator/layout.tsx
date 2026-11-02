import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID & GUID Generator — Version 4",
  description: "Generate bulk unique UUIDs (Universally Unique Identifiers) and GUIDs v4 with custom hyphens and uppercase options.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/uuid-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

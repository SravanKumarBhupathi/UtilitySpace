import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Entities Encoder & Decoder",
  description: "Encode special characters into HTML entities or decode HTML entities back to raw text for web development.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/html-entities",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

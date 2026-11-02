import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reverse Text & Backwards Text Generator",
  description: "Reverse letters, reverse words, or invert lines of text with our fun and useful text flipper.",
  alternates: {
    canonical: "https://utilityspace.online/tools/text/reverse-text",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

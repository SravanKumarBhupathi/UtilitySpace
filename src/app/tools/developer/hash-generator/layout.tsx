import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator — MD5, SHA-1, SHA-256, SHA-512",
  description: "Generate secure cryptographic hashes including SHA-256, SHA-512, SHA-1, and MD5 for text and files locally.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/hash-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

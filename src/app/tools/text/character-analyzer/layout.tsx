import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Character Analyzer & Frequency Counter",
  description: "Analyze text character count, word density, unique characters, vowels, consonants, and frequency breakdown.",
  alternates: {
    canonical: "https://utilityspace.online/tools/text/character-analyzer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

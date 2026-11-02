import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Counter — Count Words, Characters, Sentences & Reading Time",
  description: "Count words, characters with and without spaces, sentences, paragraphs, and estimate reading time in real time.",
  alternates: {
    canonical: "https://utilityspace.online/tools/text/word-counter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

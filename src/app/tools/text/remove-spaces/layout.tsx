import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove Spaces — Trim Extra Spaces & Leading/Trailing Whitespace",
  description: "Remove leading, trailing, and duplicate spaces, or remove all spaces from text strings instantly.",
  alternates: {
    canonical: "https://utilityspace.online/tools/text/remove-spaces",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

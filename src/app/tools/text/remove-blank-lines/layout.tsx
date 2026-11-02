import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove Blank Lines — Clean Empty Lines from Text",
  description: "Clean up text documents and lists by automatically stripping out empty lines and whitespace.",
  alternates: {
    canonical: "https://utilityspace.online/tools/text/remove-blank-lines",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

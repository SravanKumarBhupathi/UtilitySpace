import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester — Test Regular Expressions Online",
  description: "Test and debug regular expressions with instant real-time pattern matching, group highlights, and explanations.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/regex-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

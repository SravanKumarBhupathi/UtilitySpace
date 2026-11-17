import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPA Calculator — Calculate Semester & College Grade Point Average",
  description: "Calculate your semester GPA with course credits and letter grades. Fast, free, and accurate Grade Point Average calculation.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/gpa",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

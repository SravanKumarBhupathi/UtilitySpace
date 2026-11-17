import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGPA Calculator — Calculate Cumulative Grade Point Average & Percentage",
  description: "Calculate your overall Cumulative GPA across semesters and convert CGPA to percentage easily. Fast, free, and accurate student calculator.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/cgpa",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

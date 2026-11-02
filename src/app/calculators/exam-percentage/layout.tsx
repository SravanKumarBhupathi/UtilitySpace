import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exam Percentage Calculator — Calculate Grades & Marks",
  description: "Calculate your overall academic exam percentage and letter grade from obtained marks and total marks.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/exam-percentage",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

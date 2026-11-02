import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Percentage Calculator — Quick & Accurate Calculations",
  description: "Calculate percentage of a number, percentage differences, and ratio proportions with our free online percentage tool.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/percentage",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

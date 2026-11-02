import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age Calculator — Calculate Exact Age in Years, Months, Days",
  description: "Free online Age Calculator. Calculate your exact age from date of birth in years, months, and days instantly.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/age",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

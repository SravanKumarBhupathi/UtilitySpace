import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EMI Calculator — Home, Car, & Personal Loan Calculator",
  description: "Calculate your monthly loan EMI, total interest payable, and amortization schedule for personal, car, or home loans.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/emi",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

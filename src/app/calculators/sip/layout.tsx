import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIP & Step-Up Mutual Fund Calculator — Estimate Wealth & Returns",
  description: "Calculate Systematic Investment Plan (SIP) and Step-Up SIP returns, total invested capital, wealth gained, and year-by-year compounding growth.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/sip",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

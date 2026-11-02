import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profit and Loss Calculator — Margin & Percentage",
  description: "Calculate net profit, loss, profit margin percentage, and markup for business or trading transactions.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/profit-loss",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

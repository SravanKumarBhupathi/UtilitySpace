import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compound Interest Calculator — Investment Growth",
  description: "Calculate compound interest, future balance, and compounding frequency earnings over time with our free investment calculator.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/compound-interest",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

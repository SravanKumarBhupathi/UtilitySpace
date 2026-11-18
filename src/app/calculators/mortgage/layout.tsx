import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Calculator with Amortization Schedule — Free & Private",
  description: "Calculate monthly mortgage payments, home loan interest, property taxes, insurance, and PMI with our interactive yearly and monthly amortization schedule.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/mortgage",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discount Calculator — Calculate Sale Price & Savings",
  description: "Calculate final sale prices, discount percentages, and total money saved on shopping items instantly.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/discount",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

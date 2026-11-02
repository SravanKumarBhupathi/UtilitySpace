import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Interest Calculator — Calculate Interest & Principal",
  description: "Calculate simple interest, maturity amount, and interest earned on loans or deposits based on principal, rate, and time.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/simple-interest",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

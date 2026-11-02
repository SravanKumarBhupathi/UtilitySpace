import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Average Calculator — Mean, Median, and Sum Calculation",
  description: "Calculate the arithmetic average, sum, and count of any list of numbers instantly with our free online calculator.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/average",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

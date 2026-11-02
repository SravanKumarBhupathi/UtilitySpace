import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Percentage Change Calculator — Increase & Decrease",
  description: "Calculate percentage increase, percentage decrease, and relative differences between two values.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/percentage-change",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary & Take-Home Pay Calculator — Hourly to Annual Converter",
  description: "Convert hourly, daily, weekly, bi-weekly, monthly, and annual salary with estimated tax and retirement deductions. Instant gross and net pay breakdown.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/salary",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

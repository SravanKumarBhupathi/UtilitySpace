import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Date Difference Calculator — Days Between Two Dates",
  description: "Calculate the exact duration, days, weeks, and months between two dates with our fast date duration calculator.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/date-difference",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

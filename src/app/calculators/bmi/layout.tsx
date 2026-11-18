import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI Calculator — Calculate Body Mass Index Online",
  description: "Calculate your Body Mass Index (BMI) using metric or imperial measurements. Free, instant, and accurate WHO category health calculator.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/bmi",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

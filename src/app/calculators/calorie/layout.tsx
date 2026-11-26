import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calorie, BMR & TDEE Calculator — Daily Energy & Macro Planner",
  description: "Calculate your Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), weight loss/gain calorie targets, and daily macronutrient breakdown.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/calorie",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

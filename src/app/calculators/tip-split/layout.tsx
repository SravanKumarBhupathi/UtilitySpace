import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tip & Bill Split Calculator — Fast Per-Person Bill Splitter",
  description: "Calculate tips and split restaurant or group bills evenly between friends with custom tip presets, pre/post-tax options, and per-person rounding.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/tip-split",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

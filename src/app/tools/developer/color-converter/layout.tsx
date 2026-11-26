import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Converter, Palette Generator & WCAG Contrast Checker",
  description: "Convert HEX, RGB, HSL, HSV, and CMYK color codes in real time. Generate harmonious color palettes (Complementary, Triadic, Analogous) and audit WCAG 2.1 AA/AAA contrast ratios.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/color-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Barcode Generator — Create Code 128, EAN-13, UPC-A, Code 39",
  description: "Generate high-resolution 1D linear barcodes online for free. Supports Code 128, EAN-13, UPC-A, Code 39, ITF-14, and Codabar. Download as crisp PNG or vector SVG.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/barcode-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

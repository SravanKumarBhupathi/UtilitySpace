import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert JPG & PNG Images to PDF Online Free — Fast & Secure",
  description: "Convert JPG, PNG, and WebP images to high-quality PDF documents in seconds. 100% private in-browser conversion with customizable A4/Letter page sizing.",
  alternates: {
    canonical: "https://utilityspace.online/tools/pdf/image-to-pdf",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

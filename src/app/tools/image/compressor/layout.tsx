import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor — Compress JPG, PNG, WebP Online",
  description: "Compress image file sizes significantly without losing visible quality. 100% private in-browser client compression.",
  alternates: {
    canonical: "https://utilityspace.online/tools/image/compressor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

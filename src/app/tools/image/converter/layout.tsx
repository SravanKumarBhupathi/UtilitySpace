import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Converter — Convert PNG, JPG, WebP",
  description: "Convert images between PNG, JPG, and WebP formats instantly with zero server uploads.",
  alternates: {
    canonical: "https://utilityspace.online/tools/image/converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

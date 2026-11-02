import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotate & Flip Image — Online Image Orientation Tool",
  description: "Rotate images 90, 180, or 270 degrees or flip them horizontally and vertically with instant preview.",
  alternates: {
    canonical: "https://utilityspace.online/tools/image/rotate-flip",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

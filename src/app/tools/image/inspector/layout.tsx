import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Metadata Inspector — View Resolution & Details",
  description: "Inspect image dimensions, aspect ratio, MIME type, and exact file size without installing any software.",
  alternates: {
    canonical: "https://utilityspace.online/tools/image/inspector",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

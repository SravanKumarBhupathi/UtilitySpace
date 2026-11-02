import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Cropper — Crop Photos Online with Aspect Ratios",
  description: "Crop and trim images to custom dimensions or standard social media aspect ratios (1:1, 16:9, 4:3) right in your browser.",
  alternates: {
    canonical: "https://utilityspace.online/tools/image/cropper",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Resizer — Resize Photos by Pixels or Percentage",
  description: "Resize image dimensions by exact pixel width and height or percentage scale while maintaining aspect ratio.",
  alternates: {
    canonical: "https://utilityspace.online/tools/image/resizer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

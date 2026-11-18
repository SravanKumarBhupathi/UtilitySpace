import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free QR Code Generator — URL, WiFi, Text & vCard",
  description: "Create high-resolution custom QR codes for websites, WiFi networks, contact vCards, and plain text with zero data tracking. Download PNG & SVG instantly.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/qr-code-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

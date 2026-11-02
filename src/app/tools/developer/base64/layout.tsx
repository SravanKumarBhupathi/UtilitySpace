import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder — Free Online Tool",
  description: "Encode text and files to Base64 format or decode Base64 strings to readable text instantly and privately in your browser.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/base64",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

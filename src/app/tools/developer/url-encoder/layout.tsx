import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Encoder & Decoder — Encode URI Strings",
  description: "Encode text into percent-encoded URLs or decode encoded URI strings back to normal readable text.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/url-encoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

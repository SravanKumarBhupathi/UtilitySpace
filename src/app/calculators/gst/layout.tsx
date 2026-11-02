import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GST Calculator — Calculate Inclusive & Exclusive Tax",
  description: "Calculate Goods and Services Tax (GST) easily for any amount with customizable tax rate slabs (5%, 12%, 18%, 28%).",
  alternates: {
    canonical: "https://utilityspace.online/calculators/gst",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

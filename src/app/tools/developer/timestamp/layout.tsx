import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter — Epoch to Date",
  description: "Convert Unix timestamps (epoch time) to human-readable dates and convert date strings into Unix timestamps.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/timestamp",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

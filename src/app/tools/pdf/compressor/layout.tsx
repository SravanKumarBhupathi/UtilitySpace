import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Compressor — Reduce PDF File Size Online",
  description: "Compress and reduce PDF document file sizes locally in your browser without uploading to a third-party server.",
  alternates: {
    canonical: "https://utilityspace.online/tools/pdf/compressor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

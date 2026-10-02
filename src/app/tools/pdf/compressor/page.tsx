import { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PDFCompressorTool } from "./pdf-compressor-tool";

export const metadata: Metadata = {
  title: "Compress PDF Files | UtilitySpace",
  description: "Reduce PDF file sizes locally in your browser without uploading to a server.",
};

export default function PDFCompressorPage() {
  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size by removing unneeded metadata. Fully local processing."
      category="PDF"
    >
      <PDFCompressorTool />
    </ToolLayout>
  );
}

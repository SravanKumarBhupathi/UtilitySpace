import { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PDFSplitterTool } from "./pdf-splitter-tool";

export const metadata: Metadata = {
  title: "Split PDF Files | UtilitySpace",
  description: "Split PDF files into separate pages or extract specific pages. Processing happens locally in your browser.",
};

export default function PDFSplitterPage() {
  return (
    <ToolLayout
      title="Split PDF"
      description="Extract pages from your PDF or split it into separate files."
      category="PDF"
    >
      <PDFSplitterTool />
    </ToolLayout>
  );
}

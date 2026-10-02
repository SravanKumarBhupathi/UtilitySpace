import { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PDFMergerTool } from "./pdf-merger-tool";

export const metadata: Metadata = {
  title: "Merge PDF Files | UtilitySpace",
  description: "Combine multiple PDF files into a single document easily and securely. Processing happens locally in your browser.",
};

export default function PDFMergerPage() {
  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into one."
      category="PDF"
    >
      <PDFMergerTool />
    </ToolLayout>
  );
}

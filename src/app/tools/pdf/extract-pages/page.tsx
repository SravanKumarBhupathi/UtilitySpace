"use client";

import { ToolLayout } from "@/components/tool-layout";
import { PDFExtractTool } from "./pdf-extract-tool";

export default function PDFExtractPages() {
  return (
    <ToolLayout
      title="Extract PDF Pages"
      description="Extract specific pages from a PDF document to create a new file. Processed locally in your browser."
      category="PDF"
    >
      <PDFExtractTool />
    </ToolLayout>
  );
}

import { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PDFCompressorTool } from "./pdf-compressor-tool";

export const metadata: Metadata = {
  title: "Compress PDF Files",
  description: "Reduce PDF file sizes locally in your browser without uploading to a server.",
};

export default function PDFCompressorPage() {
  const howToSteps = [
    "Upload or drag and drop your PDF document into the tool container.",
    "The compression algorithm parses the document structure and strips redundant object streams 100% locally in your browser.",
    "Review your file size savings and download the optimized PDF instantly.",
  ];

  const faqs = [
    {
      question: "Are my confidential files uploaded to any server?",
      answer: "No. All compression occurs strictly inside your web browser using client-side JavaScript. Your confidential documents, identity proofs, and statements never leave your device.",
    },
    {
      question: "Will text become blurry after compression?",
      answer: "No. Text in vector PDF documents remains 100% sharp and crisp because vector font glyphs are preserved without lossy rasterization.",
    },
    {
      question: "Why did my PDF only shrink by a small amount?",
      answer: "If a document is already well-optimized or contains images that were already heavily compressed JPEGs, further compression will produce modest savings.",
    },
  ];

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size by removing unneeded metadata. Fully local processing."
      category="PDF"
      howToSteps={howToSteps}
      faqs={faqs}
      aboutText="UtilitySpace PDF Compressor is a private, lightweight document optimization tool. By stripping redundant document structural trees, unreferenced metadata, and unused font overhead, it helps you meet strict 100KB, 200KB, and 500KB upload limits for job applications, portals, and email attachments."
    >
      <PDFCompressorTool />
    </ToolLayout>
  );
}

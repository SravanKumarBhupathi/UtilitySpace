"use client";

import { useState, useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download,
  Copy,
  Printer,
  Check,
  Barcode as BarcodeIcon,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Sliders,
  Palette,
  FileCode,
} from "lucide-react";

type BarcodeFormat = "CODE128" | "EAN13" | "UPC" | "CODE39" | "ITF14" | "codabar";

interface PresetItem {
  name: string;
  format: BarcodeFormat;
  value: string;
  description: string;
}

const PRESETS: PresetItem[] = [
  {
    name: "Inventory SKU (Code 128)",
    format: "CODE128",
    value: "SKU-2026-US-8941",
    description: "General alphanumeric inventory & asset tracking",
  },
  {
    name: "Book ISBN (EAN-13)",
    format: "EAN13",
    value: "9780132350884",
    description: "13-digit international retail book standard",
  },
  {
    name: "Retail Product (UPC-A)",
    format: "UPC",
    value: "012345678905",
    description: "12-digit North American supermarket packaging",
  },
  {
    name: "Industrial Batch (Code 39)",
    format: "CODE39",
    value: "PART-884-A",
    description: "Defense, automotive & industrial parts marking",
  },
  {
    name: "Shipping Carton (ITF-14)",
    format: "ITF14",
    value: "10012345678902",
    description: "14-digit master carton shipping distribution",
  },
  {
    name: "Library Tag (Codabar)",
    format: "codabar",
    value: "A123456789B",
    description: "Libraries, blood banks & airbills",
  },
];

export default function BarcodeGeneratorPage() {
  const [value, setValue] = useState("SKU-2026-US-8941");
  const [format, setFormat] = useState<BarcodeFormat>("CODE128");

  // Style customization
  const [lineColor, setLineColor] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [isTransparent, setIsTransparent] = useState(false);
  const [barWidth, setBarWidth] = useState(2);
  const [barHeight, setBarHeight] = useState(100);
  const [margin, setMargin] = useState(15);
  const [displayValue, setDisplayValue] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [textAlign, setTextAlign] = useState<"center" | "left" | "right">("center");

  // Status & feedback
  const [copied, setCopied] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  // Validate format and render barcode
  useEffect(() => {
    if (!svgRef.current) return;

    if (!value.trim()) {
      setErrorMessage("Please enter data to generate a barcode.");
      return;
    }

    try {
      setErrorMessage(null);
      const cleanValue = value.trim();

      // Basic client-side pre-validations
      if (format === "EAN13") {
        if (!/^\d{12,13}$/.test(cleanValue)) {
          throw new Error("EAN-13 requires exactly 12 or 13 numeric digits.");
        }
      } else if (format === "UPC") {
        if (!/^\d{11,12}$/.test(cleanValue)) {
          throw new Error("UPC-A requires exactly 11 or 12 numeric digits.");
        }
      } else if (format === "ITF14") {
        if (!/^\d{13,14}$/.test(cleanValue)) {
          throw new Error("ITF-14 requires 13 or 14 numeric digits.");
        }
      } else if (format === "CODE39") {
        if (!/^[0-9A-Z\-\.\ \$\/\+\%]+$/i.test(cleanValue)) {
          throw new Error("Code 39 only accepts A-Z, 0-9, and characters: - . $ / + % [space]");
        }
      } else if (format === "codabar") {
        if (!/^[A-Da-d][0-9\-\$\:\/\.\+]+[A-Da-d]$/.test(cleanValue)) {
          throw new Error("Codabar must start and end with A, B, C, or D (e.g. A12345B).");
        }
      }

      JsBarcode(svgRef.current, cleanValue, {
        format: format,
        lineColor: lineColor,
        background: isTransparent ? "transparent" : background,
        width: barWidth,
        height: barHeight,
        margin: margin,
        displayValue: displayValue,
        fontSize: fontSize,
        textAlign: textAlign,
        font: "monospace",
        textMargin: 6,
        valid: function (valid) {
          if (!valid) {
            setErrorMessage(`Invalid input for ${format} standard.`);
          }
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate barcode. Please check your input.";
      setErrorMessage(msg);
    }
  }, [
    value,
    format,
    lineColor,
    background,
    isTransparent,
    barWidth,
    barHeight,
    margin,
    displayValue,
    fontSize,
    textAlign,
  ]);

  const handleDownloadSvg = () => {
    if (!svgRef.current || errorMessage) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `barcode-${format.toLowerCase()}-${value.replace(/[^a-zA-Z0-9]/g, "_")}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handleDownloadPng = () => {
    if (!svgRef.current || errorMessage) return;

    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get SVG bounding box
    const bbox = svgElement.getBoundingClientRect();
    const scale = 3; // 3x high-resolution multiplier for crisp scanning
    const width = (bbox.width || 300) * scale;
    const height = (bbox.height || 150) * scale;

    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (!isTransparent) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `barcode-${format.toLowerCase()}-${value.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src = url;
  };

  const handleCopyImage = async () => {
    if (!svgRef.current || errorMessage) return;

    try {
      const svgElement = svgRef.current;
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const bbox = svgElement.getBoundingClientRect();
      const scale = 2;
      const width = (bbox.width || 300) * scale;
      const height = (bbox.height || 150) * scale;
      canvas.width = width;
      canvas.height = height;

      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = async () => {
        if (!isTransparent) {
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);

        canvas.toBlob(async (blob) => {
          if (!blob) return;
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // ClipboardItem not supported in some older browsers
            handleDownloadPng();
          }
        });
      };
      img.src = url;
    } catch {
      // Fallback
    }
  };

  const handleCopySvgCode = () => {
    if (!svgRef.current || errorMessage) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    navigator.clipboard.writeText(svgData);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const applyPreset = (preset: PresetItem) => {
    setFormat(preset.format);
    setValue(preset.value);
  };

  const howToSteps = [
    "Select your barcode format (Code 128 for alphanumeric, EAN-13 or UPC-A for retail, Code 39 for industrial labels).",
    "Enter your numeric SKU, product ID, ISBN, or serial code into the input field.",
    "Customize visual dimensions (bar width, height, margins) and colors to match your brand or label sheet.",
    "Download crisp vector SVG for packaging design, high-res PNG for digital use, or print directly.",
  ];

  const faqs = [
    {
      question: "Which barcode format should I choose?",
      answer:
        "For general product inventory, asset tags, and logistics, Code 128 is the most versatile because it supports all letters, numbers, and symbols. For retail goods sold in North American stores, use UPC-A (12 digits). For international retail and books, use EAN-13 (13 digits). For automotive or military specs, Code 39 is standard.",
    },
    {
      question: "Will these barcodes scan accurately on physical barcode scanners?",
      answer:
        "Yes! All generated barcodes conform strictly to GS1 and ISO/IEC international barcode specifications. When downloading PNG or SVG, our generator renders with high pixel density and adequate quiet zones (margins) so laser and camera scanners read them instantaneously.",
    },
    {
      question: "Can I use the generated barcode commercially?",
      answer:
        "Yes, 100% free for both personal and commercial applications with no licensing fees or attribution required. Keep in mind that official retail EAN/UPC prefixes sold in major supermarkets require registration through GS1.",
    },
    {
      question: "Why does EAN-13 or UPC-A show an error with my text?",
      answer:
        "EAN-13 and UPC-A are strictly numeric standards with a mandatory check digit calculated with a weighted modulo algorithm. EAN-13 requires 12 or 13 numbers, while UPC-A requires 11 or 12 numbers. If you need letters (A-Z) in your barcode, switch to Code 128 or Code 39.",
    },
    {
      question: "Is my barcode data stored on UtilitySpace servers?",
      answer:
        "No. All barcode calculations and vector SVG renderings execute 100% locally in your client web browser using JavaScript. Your product codes, serial numbers, and SKUs never touch our servers.",
    },
  ];

  return (
    <ToolLayout
      title="Barcode Generator"
      description="Create high-resolution 1D linear barcodes online for free. Supports Code 128, EAN-13, UPC-A, Code 39, ITF-14, and Codabar. Download as crisp PNG, vector SVG, or print directly."
      category="Developer"
      howToSteps={howToSteps}
      faqs={faqs}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input & Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Presets */}
          <div className="p-4 bg-muted/40 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <Label className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Quick Presets
              </Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                    format === p.format && value === p.value
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card border-border text-secondary-text hover:text-foreground hover:bg-muted"
                  }`}
                  title={p.description}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Barcode Value & Format */}
          <div className="p-6 bg-card rounded-xl border border-border shadow-sm space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="barcode-format" className="text-sm font-semibold text-foreground mb-1.5 block">
                  Barcode Symbology / Format
                </Label>
                <select
                  id="barcode-format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as BarcodeFormat)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  <option value="CODE128">Code 128 (Alphanumeric, General SKU)</option>
                  <option value="EAN13">EAN-13 (13-digit International Retail)</option>
                  <option value="UPC">UPC-A (12-digit North American Retail)</option>
                  <option value="CODE39">Code 39 (Industrial & Logistics)</option>
                  <option value="ITF14">ITF-14 (14-digit Carton Packaging)</option>
                  <option value="codabar">Codabar (Libraries, Healthcare)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="barcode-text" className="text-sm font-semibold text-foreground mb-1.5 block">
                  Barcode Data / Text
                </Label>
                <Input
                  id="barcode-text"
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter barcode string..."
                  className="font-mono text-sm"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}
          </div>

          {/* Appearance & Sizing Options */}
          <div className="p-6 bg-card rounded-xl border border-border shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Sliders className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-semibold text-foreground text-sm">
                Dimension & Quiet Zone Settings
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-secondary-text">Bar Width</span>
                  <span className="text-foreground">{barWidth} px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={barWidth}
                  onChange={(e) => setBarWidth(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  aria-label="Bar width"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-secondary-text">Bar Height</span>
                  <span className="text-foreground">{barHeight} px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="5"
                  value={barHeight}
                  onChange={(e) => setBarHeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  aria-label="Bar height"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-secondary-text">Quiet Zone / Margin</span>
                  <span className="text-foreground">{margin} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="1"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  aria-label="Margin"
                />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-primary" />
                <h4 className="font-heading font-semibold text-foreground text-sm">
                  Color Configuration
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="line-color"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="w-9 h-9 rounded border border-border cursor-pointer bg-transparent"
                  />
                  <div>
                    <Label htmlFor="line-color" className="text-xs font-semibold text-foreground block">
                      Bar Color
                    </Label>
                    <span className="font-mono text-xs text-secondary-text">{lineColor}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="bg-color"
                    disabled={isTransparent}
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-9 h-9 rounded border border-border cursor-pointer bg-transparent disabled:opacity-30"
                  />
                  <div className="flex-1">
                    <Label htmlFor="bg-color" className="text-xs font-semibold text-foreground block">
                      Background Color
                    </Label>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs text-secondary-text">{background}</span>
                      <label className="text-[11px] text-secondary-text flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isTransparent}
                          onChange={(e) => setIsTransparent(e.target.checked)}
                          className="h-3.5 w-3.5 rounded text-primary focus:ring-primary accent-primary"
                        />
                        Transparent
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="display-value"
                  checked={displayValue}
                  onChange={(e) => setDisplayValue(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary accent-primary"
                />
                <Label htmlFor="display-value" className="text-xs font-semibold text-foreground cursor-pointer">
                  Show Human-Readable Text
                </Label>
              </div>

              {displayValue && (
                <>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-secondary-text">Font Size</span>
                      <span className="text-foreground">{fontSize} px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      step="1"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      aria-label="Font size"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-secondary-text block mb-1">
                      Text Align
                    </Label>
                    <select
                      value={textAlign}
                      onChange={(e) => setTextAlign(e.target.value as "center" | "left" | "right")}
                      className="w-full h-8 px-2 text-xs rounded border border-border bg-background text-foreground"
                    >
                      <option value="center">Center</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Barcode Preview & Actions */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 bg-card rounded-xl border border-border shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <BarcodeIcon className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Live Barcode Preview
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-secondary-text font-medium">
                {format}
              </span>
            </div>

            {/* Barcode Render Canvas/SVG */}
            <div
              ref={printAreaRef}
              className="w-full min-h-[180px] p-4 flex items-center justify-center rounded-lg border border-dashed border-border/80 bg-background/50 overflow-x-auto"
            >
              <svg ref={svgRef} className="max-w-full h-auto" />
            </div>

            {/* Quick Actions */}
            <div className="w-full grid grid-cols-2 gap-2.5 mt-5">
              <Button
                variant="default"
                size="sm"
                onClick={handleDownloadPng}
                disabled={Boolean(errorMessage)}
                className="w-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download PNG
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadSvg}
                disabled={Boolean(errorMessage)}
                className="w-full text-xs font-medium border-border hover:bg-muted text-foreground"
              >
                <FileCode className="w-3.5 h-3.5 mr-1.5" />
                Download SVG
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyImage}
                disabled={Boolean(errorMessage)}
                className="w-full text-xs font-medium border-border hover:bg-muted text-foreground"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    Copied PNG!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy Image
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySvgCode}
                disabled={Boolean(errorMessage)}
                className="w-full text-xs font-medium border-border hover:bg-muted text-foreground"
              >
                {copiedSvg ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    Copied SVG!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy SVG
                  </>
                )}
              </Button>
            </div>

            <div className="w-full mt-2.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                disabled={Boolean(errorMessage)}
                className="w-full text-xs text-secondary-text hover:text-foreground"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                Print Barcode Label Sheet
              </Button>
            </div>
          </div>

          {/* Format Reference Card */}
          <div className="p-5 bg-muted/30 rounded-xl border border-border text-xs space-y-2.5">
            <h4 className="font-heading font-semibold text-foreground text-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Format Guidelines
            </h4>
            <ul className="space-y-1.5 text-secondary-text leading-relaxed">
              <li>
                <strong className="text-foreground">Code 128:</strong> High-density barcode encoding all 128 ASCII characters. Best for SKUs, inventory, and logistics.
              </li>
              <li>
                <strong className="text-foreground">EAN-13:</strong> Universal 13-digit retail barcode for supermarkets and bookstores outside North America.
              </li>
              <li>
                <strong className="text-foreground">UPC-A:</strong> Standard 12-digit consumer packaging barcode for the US and Canadian retail markets.
              </li>
              <li>
                <strong className="text-foreground">Code 39:</strong> Widely supported in legacy industrial, warehouse, and defense tracking applications.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

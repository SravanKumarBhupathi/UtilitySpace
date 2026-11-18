"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Copy, RefreshCw, Check, QrCode, Wifi, Link2, FileText, User, Mail } from "lucide-react";

type QRType = "url" | "text" | "wifi" | "email" | "vcard";
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export default function QrCodeGeneratorPage() {
  const [qrType, setQrType] = useState<QRType>("url");
  
  // URL & Text state
  const [urlInput, setUrlInput] = useState("https://utilityspace.online");
  const [textInput, setTextInput] = useState("");
  
  // WiFi state
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  // Email state
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // vCard state
  const [vcardName, setVcardName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardOrg, setVcardOrg] = useState("");

  // Style options
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>("M");
  const [size, setSize] = useState<number>(300);
  const [margin, setMargin] = useState<number>(2);

  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute final payload string depending on type
  const getPayload = (): string => {
    switch (qrType) {
      case "url":
        return urlInput.trim();
      case "text":
        return textInput;
      case "wifi": {
        const ssid = wifiSsid.replace(/([\\;,:"])/g, "\\$1");
        const pass = wifiPassword.replace(/([\\;,:"])/g, "\\$1");
        const hidden = wifiHidden ? "H:true;" : "";
        return `WIFI:S:${ssid};T:${wifiEncryption};P:${pass};${hidden};`;
      }
      case "email": {
        const query = [];
        if (emailSubject) query.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) query.push(`body=${encodeURIComponent(emailBody)}`);
        return `mailto:${emailTo}${query.length ? `?${query.join("&")}` : ""}`;
      }
      case "vcard": {
        return [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `FN:${vcardName}`,
          `TEL:${vcardPhone}`,
          `EMAIL:${vcardEmail}`,
          `ORG:${vcardOrg}`,
          "END:VCARD",
        ].filter(line => !line.endsWith(":")).join("\n");
      }
      default:
        return "";
    }
  };

  useEffect(() => {
    const payload = getPayload();
    if (!payload || !canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, payload, {
      width: size,
      margin: margin,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: ecLevel,
    }, (err) => {
      if (err) {
        setErrorMessage("Payload too large for selected error correction level.");
      } else {
        setErrorMessage(null);
      }
    });
  }, [qrType, urlInput, textInput, wifiSsid, wifiPassword, wifiEncryption, wifiHidden, emailTo, emailSubject, emailBody, vcardName, vcardPhone, vcardEmail, vcardOrg, fgColor, bgColor, ecLevel, size, margin]);

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `qrcode-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleDownloadSVG = async () => {
    const payload = getPayload();
    if (!payload) return;
    try {
      const svgString = await QRCode.toString(payload, {
        type: "svg",
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: ecLevel,
      });
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `qrcode-${Date.now()}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      // Fallback: copy payload text
      navigator.clipboard.writeText(getPayload());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const howToSteps = [
    "Choose your QR code type (Website URL, Plain Text, WiFi Network, Contact Card, or Email).",
    "Enter your information in the input fields; the preview automatically updates in real time.",
    "Customize colors, resolution size (128px to 600px), and error correction level.",
    "Click 'Download PNG' for bitmap images or 'Download SVG' for infinite resolution vector printing.",
  ];

  const faqs = [
    {
      question: "Do these generated QR codes expire?",
      answer: "No. These are static QR codes containing direct data. Because the information is directly encoded into the 2D matrix without external redirect servers, they will remain functional forever and never expire.",
    },
    {
      question: "What is Error Correction Level (L, M, Q, H)?",
      answer: "Error correction allows a QR code to be scanned even if part of it is damaged, smudged, or covered by a logo. Level L restores up to 7% of missing data, M restores 15%, Q restores 25%, and H restores up to 30%. For outdoor signs or t-shirts, use High (H). For screens and digital displays, Medium (M) is ideal.",
    },
    {
      question: "Is my personal data or WiFi password sent to any server?",
      answer: "Never. The QR code generation runs 100% locally in your web browser using client-side JavaScript. Your WiFi credentials, contact details, and private notes never touch an external server.",
    },
    {
      question: "How do I scan a WiFi QR code?",
      answer: "Open your smartphone's default camera app (iOS or Android) and point it at the QR code. A banner will appear asking if you want to join the network. Tap it to connect without manually typing the password.",
    },
  ];

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create high-resolution custom QR codes for websites, WiFi networks, contact cards, and text in your browser with zero tracking."
      category="Developer"
      howToSteps={howToSteps}
      faqs={faqs}
      aboutText="UtilitySpace QR Code Generator provides a secure, private, and instant way to generate 2D barcodes for personal, commercial, and technical use. Unlike many online QR tools that route your visitors through third-party redirect links with paywalls or expiration dates, every QR code generated here is 100% static, free forever, and processed entirely inside your local browser."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Config Panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* Type Selector Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-muted rounded-xl border border-border">
            <button
              onClick={() => setQrType("url")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                qrType === "url" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" /> URL
            </button>
            <button
              onClick={() => setQrType("text")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                qrType === "text" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Plain Text
            </button>
            <button
              onClick={() => setQrType("wifi")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                qrType === "wifi" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Wifi className="w-3.5 h-3.5" /> WiFi
            </button>
            <button
              onClick={() => setQrType("vcard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                qrType === "vcard" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-3.5 h-3.5" /> vCard
            </button>
            <button
              onClick={() => setQrType("email")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                qrType === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </button>
          </div>

          {/* Type Specific Inputs */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            {qrType === "url" && (
              <div className="space-y-2">
                <Label htmlFor="url">Website or Link URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Always include https:// so smartphone cameras recognize it as a web link.</p>
              </div>
            )}

            {qrType === "text" && (
              <div className="space-y-2">
                <Label htmlFor="plainText">Text Content</Label>
                <textarea
                  id="plainText"
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Type or paste any notes, instructions, or credentials..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </div>
            )}

            {qrType === "wifi" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="ssid">Network Name (SSID)</Label>
                  <Input
                    id="ssid"
                    placeholder="e.g. Home_WiFi_5G"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="wifiPass">Network Password</Label>
                  <Input
                    id="wifiPass"
                    type="password"
                    placeholder="Enter WiFi password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <Label htmlFor="security">Security Type</Label>
                    <select
                      id="security"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value as "WPA" | "WEP" | "nopass")}
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                        className="rounded border-input"
                      />
                      Hidden Network
                    </label>
                  </div>
                </div>
              </div>
            )}

            {qrType === "vcard" && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="vcardName">Full Name</Label>
                    <Input
                      id="vcardName"
                      placeholder="Jane Doe"
                      value={vcardName}
                      onChange={(e) => setVcardName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vcardPhone">Phone Number</Label>
                    <Input
                      id="vcardPhone"
                      placeholder="+1 (555) 000-0000"
                      value={vcardPhone}
                      onChange={(e) => setVcardPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="vcardEmail">Email Address</Label>
                    <Input
                      id="vcardEmail"
                      type="email"
                      placeholder="jane@example.com"
                      value={vcardEmail}
                      onChange={(e) => setVcardEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vcardOrg">Company / Organization</Label>
                    <Input
                      id="vcardOrg"
                      placeholder="Acme Corp"
                      value={vcardOrg}
                      onChange={(e) => setVcardOrg(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {qrType === "email" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="emailTo">Recipient Email</Label>
                  <Input
                    id="emailTo"
                    type="email"
                    placeholder="contact@example.com"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emailSub">Subject</Label>
                  <Input
                    id="emailSub"
                    placeholder="Meeting Request"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emailBody">Message Body (Optional)</Label>
                  <textarea
                    id="emailBody"
                    rows={2}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Prefilled message..."
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Customization Options */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-sm text-foreground">Styling & Resolution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fgColor" className="text-xs">Foreground Color</Label>
                <div className="flex gap-2 items-center mt-1">
                  <input
                    type="color"
                    id="fgColor"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded border border-input cursor-pointer p-0 bg-transparent"
                  />
                  <Input
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="font-mono text-xs uppercase"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bgColor" className="text-xs">Background Color</Label>
                <div className="flex gap-2 items-center mt-1">
                  <input
                    type="color"
                    id="bgColor"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded border border-input cursor-pointer p-0 bg-transparent"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <Label htmlFor="ecLevel" className="text-xs">Error Correction</Label>
                <select
                  id="ecLevel"
                  className="w-full h-9 mt-1 px-2 rounded-md border border-input bg-background text-xs"
                  value={ecLevel}
                  onChange={(e) => setEcLevel(e.target.value as ErrorCorrectionLevel)}
                >
                  <option value="L">Low (7% recovery)</option>
                  <option value="M">Medium (15% recovery)</option>
                  <option value="Q">Quartile (25% recovery)</option>
                  <option value="H">High (30% recovery)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="qrSize" className="text-xs">Resolution ({size}x{size}px)</Label>
                <input
                  type="range"
                  id="qrSize"
                  min="128"
                  max="600"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full mt-3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview & Download Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full sticky top-24 bg-card border border-border rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <h3 className="font-semibold text-sm mb-4 text-foreground flex items-center gap-2">
              <QrCode className="w-4 h-4 text-primary" /> Live QR Preview
            </h3>

            {/* Canvas Container */}
            <div className="p-4 rounded-xl border border-border bg-white flex items-center justify-center min-h-[260px] min-w-[260px] max-w-full overflow-hidden shadow-inner">
              <canvas ref={canvasRef} className="max-w-full h-auto" />
            </div>

            {errorMessage && (
              <p className="text-xs text-red-500 mt-3 text-center">{errorMessage}</p>
            )}

            {/* Actions */}
            <div className="w-full grid grid-cols-2 gap-2.5 mt-6">
              <Button onClick={handleDownloadPNG} className="w-full flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download PNG
              </Button>
              <Button onClick={handleDownloadSVG} variant="outline" className="w-full flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download SVG
              </Button>
            </div>

            <Button
              onClick={handleCopy}
              variant="secondary"
              className="w-full mt-2.5 flex items-center justify-center gap-2 text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied to Clipboard!" : "Copy QR Image"}
            </Button>

            <p className="text-[11px] text-muted-foreground mt-4 text-center">
              100% Client-Side Processing • No Tracking • High Resolution Vector Export Available
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

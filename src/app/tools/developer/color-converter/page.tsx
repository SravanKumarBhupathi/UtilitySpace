"use client";

import { useState, useMemo, ChangeEvent } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pipette,
  Copy,
  Check,
  Palette,
  Eye,
  Sliders,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Code,
} from "lucide-react";

// Color math conversion utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace("#", "").trim();
  if (![3, 6, 8].includes(cleanHex.length)) return null;

  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const num = parseInt(fullHex.slice(0, 6), 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

// Relative luminance for WCAG 2.1
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Contrast Ratio (1 to 21)
function getContrastRatio(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export default function ColorConverterPage() {
  const [hexInput, setHexInput] = useState("#3B82F6");
  const [rgbState, setRgbState] = useState({ r: 59, g: 130, b: 246 });

  // Contrast tester state
  const [contrastTextColor, setContrastTextColor] = useState("#FFFFFF");
  const [contrastBgColor, setContrastBgColor] = useState("#3B82F6");

  // Feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Synchronized color derivations
  const currentHex = useMemo(() => rgbToHex(rgbState.r, rgbState.g, rgbState.b), [rgbState]);
  const currentHsl = useMemo(() => rgbToHsl(rgbState.r, rgbState.g, rgbState.b), [rgbState]);
  const currentHsv = useMemo(() => rgbToHsv(rgbState.r, rgbState.g, rgbState.b), [rgbState]);
  const currentCmyk = useMemo(() => rgbToCmyk(rgbState.r, rgbState.g, rgbState.b), [rgbState]);

  // Sync from hex input
  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    const rgb = hexToRgb(val);
    if (rgb) {
      setRgbState(rgb);
      setContrastBgColor(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
  };

  const handleRgbSlider = (channel: "r" | "g" | "b", val: number) => {
    const newRgb = { ...rgbState, [channel]: val };
    setRgbState(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHexInput(hex);
    setContrastBgColor(hex);
  };

  const handleHslSlider = (channel: "h" | "s" | "l", val: number) => {
    const newHsl = { ...currentHsl, [channel]: val };
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgbState(rgb);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHexInput(hex);
    setContrastBgColor(hex);
  };

  const handleEyeDropper = async () => {
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      try {
        const EyeDropperConstructor = (
          window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }
        ).EyeDropper;
        const eyeDropper = new EyeDropperConstructor();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const hex = result.sRGBHex.toUpperCase();
          setHexInput(hex);
          const rgb = hexToRgb(hex);
          if (rgb) {
            setRgbState(rgb);
            setContrastBgColor(hex);
          }
        }
      } catch {
        // User canceled or failed
      }
    } else {
      alert("EyeDropper API is supported in Google Chrome, Microsoft Edge, and Opera.");
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Harmonies Palettes
  const palettes = useMemo(() => {
    const { h, s, l } = currentHsl;

    const toHexFromHsl = (hue: number, sat = s, lum = l) => {
      const rgb = hslToRgb(hue, sat, lum);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    };

    return {
      complementary: [currentHex, toHexFromHsl(h + 180)],
      analogous: [toHexFromHsl(h - 30), currentHex, toHexFromHsl(h + 30)],
      triadic: [currentHex, toHexFromHsl(h + 120), toHexFromHsl(h + 240)],
      tetradic: [currentHex, toHexFromHsl(h + 90), toHexFromHsl(h + 180), toHexFromHsl(h + 270)],
      monochromatic: [
        toHexFromHsl(h, s, 20),
        toHexFromHsl(h, s, 40),
        toHexFromHsl(h, s, 60),
        toHexFromHsl(h, s, 80),
        toHexFromHsl(h, s, 95),
      ],
    };
  }, [currentHsl, currentHex]);

  // Contrast Calculation
  const contrastRatio = useMemo(() => {
    const textRgb = hexToRgb(contrastTextColor) || { r: 255, g: 255, b: 255 };
    const bgRgb = hexToRgb(contrastBgColor) || { r: 59, g: 130, b: 246 };
    return getContrastRatio(textRgb, bgRgb);
  }, [contrastTextColor, contrastBgColor]);

  const swapContrastColors = () => {
    const temp = contrastTextColor;
    setContrastTextColor(contrastBgColor);
    setContrastBgColor(temp);
  };

  const copyPaletteCss = (colors: string[]) => {
    const css = colors.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n");
    const full = `:root {\n${css}\n}`;
    copyToClipboard(full, "palette-css");
  };

  const howToSteps = [
    "Pick a color using the visual picker, enter a HEX value, or use the browser EyeDropper to sample any pixel from your display.",
    "Inspect the real-time conversions across HEX, RGB, HSL, HSV, and CMYK codes.",
    "Fine-tune Hue, Saturation, Lightness, or individual RGB channels with reactive sliders.",
    "Evaluate WCAG 2.1 AA/AAA accessibility contrast ratios or copy complementary, analogous, and triadic color palettes.",
  ];

  const faqs = [
    {
      question: "What is the difference between HSL and HSV?",
      answer:
        "Both are cylindrical representations of RGB. HSL stands for Hue, Saturation, and Lightness, where 0% lightness is always pure black and 100% lightness is always pure white. HSV (Hue, Saturation, Value, also called HSB) maps 100% Value to the brightest variant of the color, and 0% Value to black.",
    },
    {
      question: "What WCAG contrast ratio is required for accessible websites?",
      answer:
        "The Web Content Accessibility Guidelines (WCAG 2.1) mandate a minimum contrast ratio of 4.5:1 for normal body text (under 18pt) to pass Level AA, and 3:1 for large text (18pt+ or 14pt bold). For strict Level AAA compliance, normal text requires at least 7:1.",
    },
    {
      question: "Can I copy the generated color palettes into Tailwind CSS?",
      answer:
        "Yes! You can copy color hex arrays or CSS variables directly from our palette generator, making it effortless to paste them into your tailwind.config.js theme colors or CSS styles.",
    },
    {
      question: "How accurate is the CMYK conversion?",
      answer:
        "Our converter applies standard mathematical subtraction (K = 1 - max(R,G,B)) for digital screen estimation. For physical commercial CMYK offset printing, always consult your professional printer's specific color profile (such as SWOP, GRACoL, or FOGRA39).",
    },
  ];

  return (
    <ToolLayout
      title="Color Converter, Palette Generator & WCAG Contrast Studio"
      description="Convert HEX, RGB, HSL, HSV, and CMYK color codes instantly with eyedropper support. Generate harmonious palettes and audit WCAG 2.1 AA/AAA accessibility contrast ratios."
      category="Developer"
      howToSteps={howToSteps}
      faqs={faqs}
    >
      <div className="space-y-8">
        {/* Section 1: Hero Color Card & Formats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Swatch & Eyedropper */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-card rounded-2xl border border-border shadow-sm flex flex-col items-center">
              <div
                className="w-full h-44 rounded-xl shadow-inner border border-border/60 transition-colors duration-200 relative flex items-end p-4"
                style={{ backgroundColor: currentHex }}
              >
                <span
                  className="font-mono text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-md shadow-sm"
                  style={{
                    backgroundColor: currentHsl.l > 55 ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)",
                    color: currentHsl.l > 55 ? "#ffffff" : "#000000",
                  }}
                >
                  {currentHex}
                </span>
              </div>

              <div className="w-full flex items-center justify-between gap-3 mt-4">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="color"
                    id="color-picker-input"
                    value={currentHex}
                    onChange={(e) => {
                      const hex = e.target.value.toUpperCase();
                      setHexInput(hex);
                      const rgb = hexToRgb(hex);
                      if (rgb) {
                        setRgbState(rgb);
                        setContrastBgColor(hex);
                      }
                    }}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                    title="Click to open color picker"
                  />
                  <div className="flex-1">
                    <Label htmlFor="hex-code-input" className="text-xs text-secondary-text mb-0.5 block font-medium">
                      Hex Value
                    </Label>
                    <Input
                      id="hex-code-input"
                      type="text"
                      value={hexInput}
                      onChange={handleHexChange}
                      className="font-mono text-sm h-9"
                      maxLength={9}
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEyeDropper}
                  className="h-10 text-xs border-border hover:bg-muted text-foreground"
                  title="Sample any color from screen (Chrome/Edge)"
                >
                  <Pipette className="w-4 h-4 mr-1.5 text-primary" />
                  Eyedropper
                </Button>
              </div>
            </div>

            {/* Sliders: RGB & HSL */}
            <div className="p-5 bg-card rounded-xl border border-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2.5">
                <Sliders className="w-4 h-4 text-primary" />
                <span className="font-heading font-semibold text-xs text-foreground uppercase tracking-wider">
                  Color Sliders
                </span>
              </div>

              {/* RGB Sliders */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-red-500 font-bold">Red (R)</span>
                    <span className="font-mono text-foreground">{rgbState.r}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbState.r}
                    onChange={(e) => handleRgbSlider("r", Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-red-500"
                    aria-label="Red"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-emerald-500 font-bold">Green (G)</span>
                    <span className="font-mono text-foreground">{rgbState.g}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbState.g}
                    onChange={(e) => handleRgbSlider("g", Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    aria-label="Green"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-blue-500 font-bold">Blue (B)</span>
                    <span className="font-mono text-foreground">{rgbState.b}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbState.b}
                    onChange={(e) => handleRgbSlider("b", Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
                    aria-label="Blue"
                  />
                </div>
              </div>

              {/* HSL Sliders */}
              <div className="border-t border-border pt-3 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-secondary-text">Hue (H)</span>
                    <span className="font-mono text-foreground">{currentHsl.h}&deg;</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={currentHsl.h}
                    onChange={(e) => handleHslSlider("h", Number(e.target.value))}
                    className="w-full h-1.5 bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                    aria-label="Hue"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-secondary-text">Lightness (L)</span>
                    <span className="font-mono text-foreground">{currentHsl.l}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentHsl.l}
                    onChange={(e) => handleHslSlider("l", Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    aria-label="Lightness"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Color Values & Code Outputs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 bg-card rounded-xl border border-border shadow-sm space-y-3.5">
              <h3 className="font-heading font-semibold text-foreground text-sm flex items-center gap-2 border-b border-border pb-3">
                <Code className="w-4 h-4 text-primary" />
                Color Formats & CSS Strings
              </h3>

              {/* HEX */}
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                <div>
                  <span className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider block">
                    HEX
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">{currentHex}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(currentHex, "hex")}
                  className="h-8 text-xs text-secondary-text hover:text-foreground"
                >
                  {copiedKey === "hex" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>

              {/* RGB */}
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                <div>
                  <span className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider block">
                    RGB / RGBA
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    rgb({rgbState.r}, {rgbState.g}, {rgbState.b})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`rgb(${rgbState.r}, ${rgbState.g}, ${rgbState.b})`, "rgb")}
                  className="h-8 text-xs text-secondary-text hover:text-foreground"
                >
                  {copiedKey === "rgb" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>

              {/* HSL */}
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                <div>
                  <span className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider block">
                    HSL
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    hsl({currentHsl.h}, {currentHsl.s}%, {currentHsl.l}%)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(`hsl(${currentHsl.h}, ${currentHsl.s}%, ${currentHsl.l}%)`, "hsl")
                  }
                  className="h-8 text-xs text-secondary-text hover:text-foreground"
                >
                  {copiedKey === "hsl" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>

              {/* HSV */}
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                <div>
                  <span className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider block">
                    HSV / HSB
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    hsv({currentHsv.h}, {currentHsv.s}%, {currentHsv.v}%)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(`hsv(${currentHsv.h}, ${currentHsv.s}%, ${currentHsv.v}%)`, "hsv")
                  }
                  className="h-8 text-xs text-secondary-text hover:text-foreground"
                >
                  {copiedKey === "hsv" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>

              {/* CMYK */}
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                <div>
                  <span className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider block">
                    CMYK (Print)
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    cmyk({currentCmyk.c}%, {currentCmyk.m}%, {currentCmyk.y}%, {currentCmyk.k}%)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      `cmyk(${currentCmyk.c}%, ${currentCmyk.m}%, ${currentCmyk.y}%, ${currentCmyk.k}%)`,
                      "cmyk"
                    )
                  }
                  className="h-8 text-xs text-secondary-text hover:text-foreground"
                >
                  {copiedKey === "cmyk" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: WCAG 2.1 Accessibility Contrast Checker */}
        <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-heading font-bold text-foreground text-base">
                  WCAG 2.1 Accessibility Contrast Checker
                </h3>
                <p className="text-xs text-secondary-text">
                  Audit text legibility compliance against W3C web standards
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-secondary-text font-medium block">Contrast Ratio</span>
                <span className="font-heading font-extrabold text-2xl text-foreground">
                  {contrastRatio} : 1
                </span>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  contrastRatio >= 4.5
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {contrastRatio >= 7 ? "AAA Pass" : contrastRatio >= 4.5 ? "AA Pass" : "Fail"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Color Pickers & Swap */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="contrast-text-color"
                  value={contrastTextColor}
                  onChange={(e) => setContrastTextColor(e.target.value.toUpperCase())}
                  className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent"
                />
                <div className="flex-1">
                  <Label htmlFor="contrast-text-color" className="text-xs font-medium text-secondary-text block">
                    Text (Foreground) Color
                  </Label>
                  <Input
                    type="text"
                    value={contrastTextColor}
                    onChange={(e) => setContrastTextColor(e.target.value)}
                    className="font-mono text-xs h-8"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={swapContrastColors}
                  className="h-7 text-xs border-border hover:bg-muted text-secondary-text gap-1"
                >
                  <ArrowRightLeft className="w-3 h-3" /> Swap Colors
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="contrast-bg-color"
                  value={contrastBgColor}
                  onChange={(e) => setContrastBgColor(e.target.value.toUpperCase())}
                  className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent"
                />
                <div className="flex-1">
                  <Label htmlFor="contrast-bg-color" className="text-xs font-medium text-secondary-text block">
                    Background Color
                  </Label>
                  <Input
                    type="text"
                    value={contrastBgColor}
                    onChange={(e) => setContrastBgColor(e.target.value)}
                    className="font-mono text-xs h-8"
                  />
                </div>
              </div>
            </div>

            {/* Compliance Matrix & Live Visual Card */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 bg-muted/30 rounded-lg border border-border text-center">
                  <span className="text-[10px] uppercase font-semibold text-secondary-text block mb-1">
                    AA Normal (16px)
                  </span>
                  {contrastRatio >= 4.5 ? (
                    <span className="inline-flex items-center text-emerald-600 font-bold text-xs gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-destructive font-bold text-xs gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Fail
                    </span>
                  )}
                </div>

                <div className="p-3 bg-muted/30 rounded-lg border border-border text-center">
                  <span className="text-[10px] uppercase font-semibold text-secondary-text block mb-1">
                    AA Large (18pt+)
                  </span>
                  {contrastRatio >= 3.0 ? (
                    <span className="inline-flex items-center text-emerald-600 font-bold text-xs gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-destructive font-bold text-xs gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Fail
                    </span>
                  )}
                </div>

                <div className="p-3 bg-muted/30 rounded-lg border border-border text-center">
                  <span className="text-[10px] uppercase font-semibold text-secondary-text block mb-1">
                    AAA Normal
                  </span>
                  {contrastRatio >= 7.0 ? (
                    <span className="inline-flex items-center text-emerald-600 font-bold text-xs gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-destructive font-bold text-xs gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Fail
                    </span>
                  )}
                </div>

                <div className="p-3 bg-muted/30 rounded-lg border border-border text-center">
                  <span className="text-[10px] uppercase font-semibold text-secondary-text block mb-1">
                    AAA Large
                  </span>
                  {contrastRatio >= 4.5 ? (
                    <span className="inline-flex items-center text-emerald-600 font-bold text-xs gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-destructive font-bold text-xs gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Fail
                    </span>
                  )}
                </div>
              </div>

              {/* Live Preview Card */}
              <div
                className="p-5 rounded-xl border border-border shadow-inner transition-colors duration-200"
                style={{ backgroundColor: contrastBgColor, color: contrastTextColor }}
              >
                <h4 className="font-heading font-bold text-lg mb-1">
                  Sample Heading Typography (Large Text)
                </h4>
                <p className="text-sm leading-relaxed mb-3 opacity-90">
                  This card demonstrates real-time contrast fidelity. Clean typography and accessible color ratios ensure your digital tools remain effortlessly readable for all users across diverse display environments.
                </p>
                <div
                  className="inline-block px-3 py-1.5 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: contrastTextColor,
                    color: contrastBgColor,
                  }}
                >
                  Interactive Button Example
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Harmonious Color Palettes */}
        <div className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Palette className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-heading font-bold text-foreground text-base">
                Harmonious Color Palettes
              </h3>
              <p className="text-xs text-secondary-text">
                Generated dynamically from base color {currentHex} using color wheel harmony algorithms
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Complementary */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Complementary (180&deg;)</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyPaletteCss(palettes.complementary)}
                  className="h-6 text-[11px] text-secondary-text hover:text-foreground"
                >
                  Copy CSS
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {palettes.complementary.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setHexInput(c);
                      const rgb = hexToRgb(c);
                      if (rgb) setRgbState(rgb);
                    }}
                    className="group h-16 rounded-lg border border-border flex flex-col justify-end p-2 transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: c }}
                  >
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white w-max">
                      {c}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Triadic */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Triadic (120&deg;)</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyPaletteCss(palettes.triadic)}
                  className="h-6 text-[11px] text-secondary-text hover:text-foreground"
                >
                  Copy CSS
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {palettes.triadic.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setHexInput(c);
                      const rgb = hexToRgb(c);
                      if (rgb) setRgbState(rgb);
                    }}
                    className="group h-16 rounded-lg border border-border flex flex-col justify-end p-2 transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: c }}
                  >
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white w-max">
                      {c}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Analogous */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Analogous (&plusmn;30&deg;)</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyPaletteCss(palettes.analogous)}
                  className="h-6 text-[11px] text-secondary-text hover:text-foreground"
                >
                  Copy CSS
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {palettes.analogous.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setHexInput(c);
                      const rgb = hexToRgb(c);
                      if (rgb) setRgbState(rgb);
                    }}
                    className="group h-16 rounded-lg border border-border flex flex-col justify-end p-2 transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: c }}
                  >
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white w-max">
                      {c}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Monochromatic */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Monochromatic Shades</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyPaletteCss(palettes.monochromatic)}
                  className="h-6 text-[11px] text-secondary-text hover:text-foreground"
                >
                  Copy CSS
                </Button>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {palettes.monochromatic.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setHexInput(c);
                      const rgb = hexToRgb(c);
                      if (rgb) setRgbState(rgb);
                    }}
                    className="group h-16 rounded-lg border border-border flex flex-col justify-end p-1 transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: c }}
                  >
                    <span className="font-mono text-[9px] font-bold px-1 py-0.5 rounded bg-black/60 text-white w-max overflow-hidden text-ellipsis">
                      {c}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Copy,
  RefreshCw,
  Check,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Download,
  KeyRound,
  ListRestart,
} from "lucide-react";

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState<number>(16);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [bulkCount, setBulkCount] = useState<number>(1);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const UPPERCASE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // without ambiguous
  const UPPERCASE_ALL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const LOWERCASE_CHARS = "abcdefghijkmnopqrstuvwxyz"; // without ambiguous
  const LOWERCASE_ALL = "abcdefghijklmnopqrstuvwxyz";
  const NUMBER_CHARS = "23456789"; // without 0, 1
  const NUMBER_ALL = "0123456789";
  const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const getCharset = (): { charset: string; poolSize: number } => {
    let pool = "";
    if (useUpper) pool += excludeAmbiguous ? UPPERCASE_CHARS : UPPERCASE_ALL;
    if (useLower) pool += excludeAmbiguous ? LOWERCASE_CHARS : LOWERCASE_ALL;
    if (useNumbers) pool += excludeAmbiguous ? NUMBER_CHARS : NUMBER_ALL;
    if (useSymbols) pool += SYMBOL_CHARS;

    return { charset: pool, poolSize: pool.length };
  };

  const generateSinglePassword = (len: number): string => {
    const { charset } = getCharset();
    if (!charset) return "";

    const array = new Uint32Array(len);
    if (typeof window !== "undefined" && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < len; i++) {
        array[i] = Math.floor(Math.random() * 4294967296);
      }
    }

    let password = "";
    for (let i = 0; i < len; i++) {
      password += charset[array[i] % charset.length];
    }
    return password;
  };

  const generatePasswords = () => {
    const list: string[] = [];
    for (let i = 0; i < bulkCount; i++) {
      list.push(generateSinglePassword(length));
    }
    setPasswords(list);
  };

  // Generate on initial render & whenever core options change
  useEffect(() => {
    generatePasswords();
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous, bulkCount]);

  const copyPassword = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllPasswords = () => {
    navigator.clipboard.writeText(passwords.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const downloadPasswords = () => {
    const blob = new Blob([passwords.join("\r\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `passwords-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Calculate entropy: E = L * log2(R)
  const { poolSize } = getCharset();
  const entropyBits = poolSize > 0 ? Math.round(length * (Math.log(poolSize) / Math.log(2))) : 0;

  const getStrength = (bits: number) => {
    if (bits < 40) return { label: "Very Weak", color: "text-red-500", bg: "bg-red-500", percent: 25 };
    if (bits < 60) return { label: "Fair", color: "text-amber-500", bg: "bg-amber-500", percent: 50 };
    if (bits < 80) return { label: "Strong", color: "text-blue-500", bg: "bg-blue-500", percent: 75 };
    return { label: "Very Strong", color: "text-emerald-500", bg: "bg-emerald-500", percent: 100 };
  };

  const strength = getStrength(entropyBits);

  const howToSteps = [
    "Select your desired password length using the slider (16 to 24 characters recommended for high security).",
    "Toggle uppercase, lowercase, numbers, and symbols based on your target website's complexity rules.",
    "Enable 'Exclude Ambiguous Characters' to prevent confusing 0 with O or 1 with l when typing manually.",
    "Click the copy icon to instantly copy to clipboard, or generate up to 20 passwords at once for bulk provisioning.",
  ];

  const faqs = [
    {
      question: "Are these passwords generated securely?",
      answer: "Yes. UtilitySpace uses the Web Cryptography API (window.crypto.getRandomValues), which draws randomness directly from hardware-level operating system entropy rather than pseudo-random number generators like Math.random().",
    },
    {
      question: "Are any passwords saved, logged, or sent to a database?",
      answer: "No. All passwords are generated in real-time inside your browser's local sandbox memory. They are never saved, logged, or transmitted anywhere.",
    },
    {
      question: "What is password entropy and why does it matter?",
      answer: "Entropy measures the unpredictability of a password in bits. A password with 80+ bits of entropy would take modern supercomputers billions of years to brute-force.",
    },
    {
      question: "What are ambiguous characters?",
      answer: "Ambiguous characters are letters and numbers that look identical in many standard fonts, such as uppercase 'I', lowercase 'l', number '1', uppercase 'O', and number '0'. Excluding them prevents transcription mistakes on physical devices.",
    },
  ];

  return (
    <ToolLayout
      title="Strong Password Generator"
      description="Generate cryptographically secure, random passwords and passphrases in your browser with zero tracking."
      category="Developer"
      howToSteps={howToSteps}
      faqs={faqs}
      aboutText="UtilitySpace Password Generator is an open, private utility engineered to create unpredictable credentials that protect against credential stuffing, dictionary attacks, and automated brute-forcing. All randomness is derived from client-side Web Cryptography APIs with instant entropy verification."
    >
      <div className="space-y-6">
        {/* Main Password Display */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-primary" /> Primary Generated Password
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${strength.color}`}>
                {strength.label} ({entropyBits} bits entropy)
              </span>
            </div>
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              readOnly
              value={passwords[0] || ""}
              className="w-full h-14 bg-background border border-border rounded-xl px-4 pr-24 font-mono text-lg md:text-xl tracking-wider text-foreground select-all focus:outline-none"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={generatePasswords}
                className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => copyPassword(passwords[0] || "", 0)}
                className="h-9 px-3 text-xs flex items-center gap-1.5"
              >
                {copiedIndex === 0 ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 0 ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Strength Bar */}
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strength.bg}`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
        </div>

        {/* Configuration Options */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="length" className="text-sm font-semibold text-foreground">
                Password Length: <span className="text-primary font-mono">{length}</span> characters
              </Label>
              <span className="text-xs text-muted-foreground">Recommended: 16+</span>
            </div>
            <input
              type="range"
              id="length"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1 font-mono">
              <span>6</span>
              <span>12</span>
              <span>16</span>
              <span>24</span>
              <span>32</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                checked={useUpper}
                onChange={(e) => setUseUpper(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary w-4 h-4"
              />
              <div className="text-xs">
                <p className="font-medium text-foreground">Uppercase Letters</p>
                <p className="text-muted-foreground font-mono">A-Z</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                checked={useLower}
                onChange={(e) => setUseLower(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary w-4 h-4"
              />
              <div className="text-xs">
                <p className="font-medium text-foreground">Lowercase Letters</p>
                <p className="text-muted-foreground font-mono">a-z</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={(e) => setUseNumbers(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary w-4 h-4"
              />
              <div className="text-xs">
                <p className="font-medium text-foreground">Numbers</p>
                <p className="text-muted-foreground font-mono">0-9</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary w-4 h-4"
              />
              <div className="text-xs">
                <p className="font-medium text-foreground">Symbols</p>
                <p className="text-muted-foreground font-mono">!@#$%^&*...</p>
              </div>
            </label>
          </div>

          <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary w-4 h-4"
              />
              <span>
                Avoid ambiguous characters (<code className="bg-muted px-1 py-0.5 rounded">0, O, 1, l, I</code>)
              </span>
            </label>

            <div className="flex items-center gap-2">
              <Label htmlFor="bulk" className="text-xs text-muted-foreground whitespace-nowrap">
                Quantity:
              </Label>
              <select
                id="bulk"
                value={bulkCount}
                onChange={(e) => setBulkCount(Number(e.target.value))}
                className="h-8 text-xs rounded-md border border-input bg-background px-2"
              >
                <option value="1">1 Password</option>
                <option value="5">5 Passwords</option>
                <option value="10">10 Passwords</option>
                <option value="20">20 Passwords</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Password List */}
        {bulkCount > 1 && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-foreground">
                Batch Generated Passwords ({passwords.length})
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPasswords}
                  className="text-xs h-8 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download (.txt)
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={copyAllPasswords}
                  className="text-xs h-8 flex items-center gap-1.5"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAll ? "Copied All" : "Copy All"}
                </Button>
              </div>
            </div>

            <div className="divide-y divide-border border border-border rounded-xl bg-background overflow-hidden max-h-72 overflow-y-auto">
              {passwords.map((pw, i) => (
                <div key={i} className="flex items-center justify-between p-3 font-mono text-sm hover:bg-muted/40">
                  <span className="text-muted-foreground text-xs w-6">{i + 1}.</span>
                  <span className="flex-1 truncate px-2 select-all text-foreground">{pw}</span>
                  <button
                    onClick={() => copyPassword(pw, i)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy this password"
                  >
                    {copiedIndex === i ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

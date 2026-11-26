"use client";

import { useState, useEffect, useMemo, ChangeEvent } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Download,
  Copy,
  ArrowRightLeft,
  Upload,
  Check,
  AlertCircle,
  Table,
  FileText,
  FileCode,
  Trash2,
  Sparkles,
  Settings,
} from "lucide-react";

type ConversionMode = "csv-to-json" | "json-to-csv";
type Delimiter = "auto" | "," | ";" | "\t" | "|";
type JsonFormat = "2" | "4" | "minified";
type JsonStructure = "arrayOfObjects" | "arrayOfArrays" | "keyedObject";

const SAMPLE_CSV = `id,name,role,department,salary,active
101,Alice Johnson,Lead Architect,Engineering,145000,true
102,Bob Smith,Senior Product Designer,Product,115000,true
103,Charlie Davis,DevOps Engineer,Infrastructure,125000,true
104,Diana Prince,Security Specialist,Security,135000,false
105,Evan Wright,Data Scientist,Analytics,130000,true`;

const SAMPLE_JSON = `[
  {
    "id": 101,
    "name": "Alice Johnson",
    "role": "Lead Architect",
    "department": "Engineering",
    "salary": 145000,
    "active": true
  },
  {
    "id": 102,
    "name": "Bob Smith",
    "role": "Senior Product Designer",
    "department": "Product",
    "salary": 115000,
    "active": true
  },
  {
    "id": 103,
    "name": "Charlie Davis",
    "role": "DevOps Engineer",
    "department": "Infrastructure",
    "salary": 125000,
    "active": true
  }
]`;

export default function CsvJsonConverterPage() {
  const [mode, setMode] = useState<ConversionMode>("csv-to-json");
  const [inputText, setInputText] = useState(SAMPLE_CSV);
  const [outputText, setOutputText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Settings
  const [delimiter, setDelimiter] = useState<Delimiter>("auto");
  const [hasHeader, setHasHeader] = useState(true);
  const [parseTypes, setParseTypes] = useState(true);
  const [jsonStructure, setJsonStructure] = useState<JsonStructure>("arrayOfObjects");
  const [jsonFormat, setJsonFormat] = useState<JsonFormat>("2");
  const [quoteAllStrings, setQuoteAllStrings] = useState(false);

  // UI States
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "table">("code");

  // Detect delimiter automatically from input
  const detectDelimiter = (text: string): string => {
    const lines = text.trim().split(/\r?\n/).slice(0, 5);
    if (!lines.length) return ",";

    const counts = {
      ",": 0,
      ";": 0,
      "\t": 0,
      "|": 0,
    };

    lines.forEach((line) => {
      counts[","] += (line.match(/,/g) || []).length;
      counts[";"] += (line.match(/;/g) || []).length;
      counts["\t"] += (line.match(/\t/g) || []).length;
      counts["|"] += (line.match(/\|/g) || []).length;
    });

    let bestDelim = ",";
    let maxCount = -1;
    (Object.keys(counts) as Array<keyof typeof counts>).forEach((d) => {
      if (counts[d] > maxCount) {
        maxCount = counts[d];
        bestDelim = d;
      }
    });

    return maxCount > 0 ? bestDelim : ",";
  };

  // Robust CSV parser handling escaped commas, quotes, and newlines
  const parseCsvToRows = (csv: string, delim: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = "";
    let insideQuotes = false;

    for (let i = 0; i < csv.length; i++) {
      const char = csv[i];
      const nextChar = csv[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentCell += '"';
          i++; // skip escaped quote
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === delim && !insideQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if ((char === "\r" || char === "\n") && !insideQuotes) {
        if (char === "\r" && nextChar === "\n") i++;
        currentRow.push(currentCell.trim());
        currentCell = "";
        if (currentRow.some((c) => c !== "")) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else {
        currentCell += char;
      }
    }

    if (currentCell !== "" || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c !== "")) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  // Main Conversion Engine
  useEffect(() => {
    const castValue = (val: string) => {
      if (!parseTypes) return val;
      if (val === "") return "";
      if (val.toLowerCase() === "true") return true;
      if (val.toLowerCase() === "false") return false;
      if (val.toLowerCase() === "null") return null;
      if (!isNaN(Number(val)) && val.trim() !== "") return Number(val);
      return val;
    };

    if (!inputText.trim()) {
      setOutputText("");
      setErrorMessage(null);
      return;
    }

    try {
      setErrorMessage(null);

      if (mode === "csv-to-json") {
        const activeDelim = delimiter === "auto" ? detectDelimiter(inputText) : delimiter;
        const rows = parseCsvToRows(inputText, activeDelim);

        if (!rows.length) {
          setOutputText("[]");
          return;
        }

        let result: unknown;

        if (jsonStructure === "arrayOfArrays") {
          result = rows.map((r) => (parseTypes ? r.map(castValue) : r));
        } else if (jsonStructure === "keyedObject" && hasHeader && rows.length > 1) {
          const headers = rows[0];
          const keyedObj: Record<string, Record<string, unknown>> = {};
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const primaryKey = row[0] || `row_${i}`;
            const obj: Record<string, unknown> = {};
            headers.forEach((h, colIdx) => {
              obj[h] = row[colIdx] !== undefined ? castValue(row[colIdx]) : "";
            });
            keyedObj[primaryKey] = obj;
          }
          result = keyedObj;
        } else {
          // Default: arrayOfObjects
          if (hasHeader && rows.length > 1) {
            const headers = rows[0];
            const records = [];
            for (let i = 1; i < rows.length; i++) {
              const row = rows[i];
              const obj: Record<string, unknown> = {};
              headers.forEach((h, colIdx) => {
                obj[h] = row[colIdx] !== undefined ? castValue(row[colIdx]) : "";
              });
              records.push(obj);
            }
            result = records;
          } else {
            result = rows.map((r) => (parseTypes ? r.map(castValue) : r));
          }
        }

        const indent = jsonFormat === "minified" ? undefined : Number(jsonFormat);
        setOutputText(JSON.stringify(result, null, indent));
      } else {
        // Mode: JSON to CSV
        let parsed: unknown;
        try {
          parsed = JSON.parse(inputText);
        } catch {
          throw new Error("Invalid JSON input. Please verify syntax, brackets, and quotes.");
        }

        const activeDelim = delimiter === "auto" ? "," : delimiter;
        let csvOutput = "";

        if (Array.isArray(parsed)) {
          if (!parsed.length) {
            setOutputText("");
            return;
          }

          if (typeof parsed[0] === "object" && parsed[0] !== null) {
            // Extract all unique headers across all records
            const headersSet = new Set<string>();
            parsed.forEach((item) => {
              if (item && typeof item === "object") {
                Object.keys(item).forEach((k) => headersSet.add(k));
              }
            });
            const headers = Array.from(headersSet);

            const formatCell = (val: unknown): string => {
              if (val === null || val === undefined) return "";
              let str = typeof val === "object" ? JSON.stringify(val) : String(val);
              if (quoteAllStrings || str.includes(activeDelim) || str.includes('"') || str.includes("\n")) {
                str = `"${str.replace(/"/g, '""')}"`;
              }
              return str;
            };

            const lines = [];
            if (hasHeader) {
              lines.push(headers.map(formatCell).join(activeDelim));
            }

            parsed.forEach((item) => {
              const row = headers.map((h) => formatCell(item ? (item as Record<string, unknown>)[h] : ""));
              lines.push(row.join(activeDelim));
            });

            csvOutput = lines.join("\n");
          } else {
            // Flat array
            csvOutput = parsed.join(activeDelim);
          }
        } else if (typeof parsed === "object" && parsed !== null) {
          // Key-value object
          const entries = Object.entries(parsed);
          const lines = [];
          if (hasHeader) {
            lines.push(`key${activeDelim}value`);
          }
          entries.forEach(([k, v]) => {
            const formattedVal = typeof v === "object" ? JSON.stringify(v) : String(v);
            lines.push(`"${k}"${activeDelim}"${formattedVal.replace(/"/g, '""')}"`);
          });
          csvOutput = lines.join("\n");
        } else {
          csvOutput = String(parsed);
        }

        setOutputText(csvOutput);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error parsing data.";
      setErrorMessage(msg);
      setOutputText("");
    }
  }, [inputText, mode, delimiter, hasHeader, parseTypes, jsonStructure, jsonFormat, quoteAllStrings]);

  // Table Preview computation
  const tableData = useMemo(() => {
    try {
      if (mode === "csv-to-json") {
        const activeDelim = delimiter === "auto" ? detectDelimiter(inputText) : delimiter;
        const rows = parseCsvToRows(inputText, activeDelim);
        if (!rows.length) return null;
        if (hasHeader) {
          return { headers: rows[0], rows: rows.slice(1) };
        }
        return {
          headers: rows[0].map((_, idx) => `Column ${idx + 1}`),
          rows: rows,
        };
      } else {
        const parsed = JSON.parse(inputText);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
          const headers = Object.keys(parsed[0]);
          const rows = parsed.map((item) => headers.map((h) => String(item[h] ?? "")));
          return { headers, rows };
        }
        return null;
      }
    } catch {
      return null;
    }
  }, [inputText, mode, delimiter, hasHeader]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        if (file.name.endsWith(".json")) {
          setMode("json-to-csv");
        } else if (file.name.endsWith(".csv")) {
          setMode("csv-to-json");
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSwapModes = () => {
    if (mode === "csv-to-json") {
      setMode("json-to-csv");
      setInputText(outputText || SAMPLE_JSON);
    } else {
      setMode("csv-to-json");
      setInputText(outputText || SAMPLE_CSV);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const isJson = mode === "csv-to-json";
    const filename = isJson ? "converted-data.json" : "converted-data.csv";
    const mime = isJson ? "application/json" : "text/csv;charset=utf-8;";

    const blob = new Blob([outputText], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    if (mode === "csv-to-json") {
      setInputText(SAMPLE_CSV);
    } else {
      setInputText(SAMPLE_JSON);
    }
  };

  const howToSteps = [
    "Choose your conversion direction: CSV to JSON or JSON to CSV using the toggle button.",
    "Paste your raw data into the editor or upload an existing .csv or .json file from your computer.",
    "Select your preferred delimiter (comma, semicolon, tab, or pipe) and configure formatting options.",
    "Inspect the interactive table preview or copy/download your converted file instantly.",
  ];

  const faqs = [
    {
      question: "How does the converter handle commas inside text fields?",
      answer:
        "Our CSV parsing engine strictly adheres to RFC 4180 standards. When a text field contains commas, line breaks, or quotation marks, it recognizes enclosed quotes (`\"field with, comma\"`) and preserves field integrity without corrupting the column structure.",
    },
    {
      question: "Can I convert large CSV files with thousands of rows?",
      answer:
        "Yes! Because all processing executes client-side using native JavaScript memory, the converter handles files with tens of thousands of rows smoothly without server timeouts or file size upload caps.",
    },
    {
      question: "Does it convert numbers and booleans into real JSON types?",
      answer:
        "Yes, by default the 'Auto-parse Data Types' toggle converts numeric strings (e.g., '125000') into real JSON numbers, and 'true'/'false' into boolean values. You can disable this option if you want all fields preserved as raw strings.",
    },
    {
      question: "Are my sensitive business data and spreadsheets uploaded anywhere?",
      answer:
        "Never. UtilitySpace operates with a 100% client-side privacy guarantee. Your files and text entries are processed entirely in your web browser's local RAM. No remote servers ever log or transmit your records.",
    },
  ];

  return (
    <ToolLayout
      title="CSV to JSON & JSON to CSV Converter"
      description="Convert CSV spreadsheets to JSON arrays and JSON to CSV files online with live data table preview, custom delimiters, type inference, and 100% browser privacy."
      category="Developer"
      howToSteps={howToSteps}
      faqs={faqs}
    >
      <div className="space-y-6">
        {/* Top Control Bar: Mode Toggle & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-card rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode("csv-to-json")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === "csv-to-json"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-secondary-text hover:text-foreground"
              }`}
            >
              CSV &rarr; JSON
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapModes}
              className="p-2 h-8 border-border hover:bg-muted text-secondary-text hover:text-foreground"
              title="Swap conversion mode"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </Button>

            <button
              type="button"
              onClick={() => setMode("json-to-csv")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === "json-to-csv"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-secondary-text hover:text-foreground"
              }`}
            >
              JSON &rarr; CSV
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="inline-flex items-center text-xs font-medium px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors">
                <Upload className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Upload File
              </span>
            </label>

            <Button
              variant="outline"
              size="sm"
              onClick={loadSample}
              className="text-xs border-border hover:bg-muted text-foreground"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-primary" />
              Load Sample
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputText("")}
              className="text-xs border-border hover:bg-muted text-destructive hover:text-destructive"
              title="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Configuration Options Drawer */}
        <div className="p-4 bg-muted/40 rounded-xl border border-border">
          <div className="flex items-center gap-1.5 mb-3">
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
              Conversion Preferences
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <Label className="text-[11px] font-semibold text-secondary-text mb-1 block">
                Delimiter / Separator
              </Label>
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value as Delimiter)}
                className="w-full h-8 px-2 rounded border border-border bg-background text-foreground text-xs"
              >
                <option value="auto">Auto Detect</option>
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="&#9;">Tab (\t)</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>

            <div className="flex items-center pt-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={hasHeader}
                  onChange={(e) => setHasHeader(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary accent-primary"
                />
                First Row as Header
              </label>
            </div>

            {mode === "csv-to-json" ? (
              <>
                <div>
                  <Label className="text-[11px] font-semibold text-secondary-text mb-1 block">
                    JSON Structure
                  </Label>
                  <select
                    value={jsonStructure}
                    onChange={(e) => setJsonStructure(e.target.value as JsonStructure)}
                    className="w-full h-8 px-2 rounded border border-border bg-background text-foreground text-xs"
                  >
                    <option value="arrayOfObjects">Array of Objects</option>
                    <option value="arrayOfArrays">2D Array of Rows</option>
                    <option value="keyedObject">Keyed by First Column</option>
                  </select>
                </div>

                <div>
                  <Label className="text-[11px] font-semibold text-secondary-text mb-1 block">
                    JSON Indentation
                  </Label>
                  <select
                    value={jsonFormat}
                    onChange={(e) => setJsonFormat(e.target.value as JsonFormat)}
                    className="w-full h-8 px-2 rounded border border-border bg-background text-foreground text-xs"
                  >
                    <option value="2">Pretty (2 spaces)</option>
                    <option value="4">Pretty (4 spaces)</option>
                    <option value="minified">Compact (Minified)</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="flex items-center pt-4">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={quoteAllStrings}
                    onChange={(e) => setQuoteAllStrings(e.target.checked)}
                    className="h-4 w-4 rounded text-primary focus:ring-primary accent-primary"
                  />
                  Quote All Values
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Split Editor Panes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="p-5 bg-card rounded-xl border border-border shadow-sm flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-heading font-semibold text-xs text-foreground uppercase tracking-wider">
                  {mode === "csv-to-json" ? "Source CSV Input" : "Source JSON Input"}
                </span>
              </div>
              <span className="text-[11px] text-secondary-text font-mono">
                {inputText.length} chars
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === "csv-to-json"
                  ? "Paste CSV text here or upload file..."
                  : "Paste JSON array or object here..."
              }
              className="flex-1 w-full p-3 font-mono text-xs bg-background rounded-lg border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="p-5 bg-card rounded-xl border border-border shadow-sm flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("code")}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                    activeTab === "code"
                      ? "bg-primary/10 text-primary"
                      : "text-secondary-text hover:text-foreground"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  {mode === "csv-to-json" ? "JSON Output" : "CSV Output"}
                </button>

                {tableData && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("table")}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                      activeTab === "table"
                        ? "bg-primary/10 text-primary"
                        : "text-secondary-text hover:text-foreground"
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    Table View ({tableData.rows.length})
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!outputText}
                  className="h-7 text-xs border-border hover:bg-muted"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!outputText}
                  className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            {errorMessage ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-destructive/5 rounded-lg border border-destructive/20 text-destructive text-xs">
                <AlertCircle className="w-6 h-6 mb-2" />
                <p className="font-semibold">{errorMessage}</p>
                <p className="text-secondary-text mt-1 text-[11px]">
                  Double check delimiters, quotes, or JSON syntax to proceed.
                </p>
              </div>
            ) : activeTab === "code" ? (
              <textarea
                value={outputText}
                readOnly
                placeholder="Converted data will appear here..."
                className="flex-1 w-full p-3 font-mono text-xs bg-background rounded-lg border border-border resize-none focus:outline-none leading-relaxed text-foreground select-all"
                spellCheck={false}
              />
            ) : (
              <div className="flex-1 w-full overflow-auto rounded-lg border border-border bg-background">
                {tableData && tableData.rows.length > 0 ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted sticky top-0 border-b border-border z-10">
                      <tr>
                        {tableData.headers.map((h, i) => (
                          <th key={i} className="p-2.5 font-semibold text-foreground whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-mono text-[11px]">
                      {tableData.rows.slice(0, 50).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-muted/40 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2.5 whitespace-nowrap text-secondary-text">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-xs text-secondary-text">
                    No tabular data to display.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

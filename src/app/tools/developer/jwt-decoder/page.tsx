"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState<string | null>(null);

  const decodeJWT = (t: string) => {
    setError(null);
    setHeader("");
    setPayload("");

    if (!t.trim()) return;

    const parts = t.split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT format. A valid JWT contains three base64url encoded parts separated by dots.");
      return;
    }

    try {
      // Decode Base64URL
      const decodeB64 = (str: string) => {
         const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
         const padLength = (4 - base64.length % 4) % 4;
         const padded = base64 + '='.repeat(padLength);
         return decodeURIComponent(atob(padded).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      };

      const decodedHeader = decodeB64(parts[0]);
      const decodedPayload = decodeB64(parts[1]);

      setHeader(JSON.stringify(JSON.parse(decodedHeader), null, 2));
      setPayload(JSON.stringify(JSON.parse(decodedPayload), null, 2));

    } catch (e: any) {
      setError("Failed to decode token. Ensure it is a valid Base64URL encoded JWT.");
    }
  };

  const handleClear = () => {
    setToken("");
    setHeader("");
    setPayload("");
    setError(null);
  };

  const handleCopy = (text: string) => {
    if (text) navigator.clipboard.writeText(text);
  };

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode JSON Web Tokens (JWT) instantly in your browser."
      category="Developer"
    >
      <div className="space-y-6">
         <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3 text-amber-700 dark:text-amber-400 text-sm">
           <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
           <p><strong>Security Note:</strong> This tool only decodes the Base64 payload. It <em>does not</em> verify the token signature or validate its authenticity. Never share sensitive tokens.</p>
         </div>

         <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-secondary-text uppercase">Encoded Token</label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-secondary-text">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
            <textarea
              className={`w-full h-32 p-4 bg-background border ${error ? 'border-red-500 focus:ring-red-500/50' : 'border-border focus:ring-primary/50'} rounded-lg resize-none outline-none font-mono text-sm break-all`}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                decodeJWT(e.target.value);
              }}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
               <CardHeader className="py-4 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
                 <CardTitle className="text-base text-secondary-text uppercase tracking-wider">Header</CardTitle>
                 <Button variant="ghost" size="icon" onClick={() => handleCopy(header)} disabled={!header} className="h-8 w-8">
                   <Copy className="w-4 h-4" />
                 </Button>
               </CardHeader>
               <CardContent className="p-0">
                 <textarea
                    className="w-full h-48 p-4 bg-background border-0 resize-none outline-none font-mono text-sm text-blue-600 dark:text-blue-400"
                    readOnly
                    value={header}
                    placeholder="Decoded header JSON..."
                 />
               </CardContent>
            </Card>

            <Card className="shadow-sm">
               <CardHeader className="py-4 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
                 <CardTitle className="text-base text-secondary-text uppercase tracking-wider">Payload</CardTitle>
                 <Button variant="ghost" size="icon" onClick={() => handleCopy(payload)} disabled={!payload} className="h-8 w-8">
                   <Copy className="w-4 h-4" />
                 </Button>
               </CardHeader>
               <CardContent className="p-0">
                 <textarea
                    className="w-full h-48 p-4 bg-background border-0 resize-none outline-none font-mono text-sm text-green-600 dark:text-green-400"
                    readOnly
                    value={payload}
                    placeholder="Decoded payload JSON..."
                 />
               </CardContent>
            </Card>
         </div>
      </div>
    </ToolLayout>
  );
}

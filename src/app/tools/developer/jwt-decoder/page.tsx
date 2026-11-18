"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, ShieldAlert, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<string | null>(null);

  const decodeJWT = (t: string) => {
    setError(null);
    setHeader("");
    setPayload("");
    setSignature("");

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
      setSignature(parts[2]);

    } catch (e: unknown) {
      setError("Failed to decode token. Ensure it is a valid Base64URL encoded JWT.");
    }
  };

  const handleClear = () => {
    setToken("");
    setHeader("");
    setPayload("");
    setSignature("");
    setError(null);
  };

  const handleCopy = (text: string) => {
    if (text) navigator.clipboard.writeText(text);
  };

  const howToSteps = [
    "Paste your JSON Web Token (JWT) into the Encoded Token input box above.",
    "The tool instantly parses and separates the token into its three distinct parts: Header, Payload, and Signature.",
    "Inspect the decoded Header to verify the signing algorithm (e.g., HS256, RS256, ES256) and token type.",
    "Review the decoded Payload claims such as expiration time (exp), issued-at timestamp (iat), subject (sub), issuer (iss), and custom user claims.",
    "Examine the signature status to verify that the cryptographic signature segment is properly formatted.",
    "Click the copy button on any section to export the formatted JSON claims directly to your clipboard.",
  ];

  const faqs = [
    {
      question: "Is decoding a JWT secure on UtilitySpace?",
      answer: "Yes, completely secure. All JWT decoding is performed 100% locally inside your browser using client-side JavaScript. Your token, authorization headers, and session credentials are never transmitted over the internet, sent to remote servers, or stored in any database.",
    },
    {
      question: "What is the difference between decoding and verifying a JWT?",
      answer: "Decoding a JWT simply converts the Base64URL-encoded Header and Payload strings back into readable JSON text—anyone who has the token can decode it without a secret key. Verifying a JWT, in contrast, requires cryptographically validating the third segment (the signature) against a secret key (HMAC) or public key (RSA/ECDSA) to confirm that the token was issued by a trusted party and has not been altered in transit.",
    },
    {
      question: "Why shouldn't sensitive secrets or passwords be stored in JWT payloads?",
      answer: "Standard JSON Web Tokens (JWS) are digitally signed, not encrypted. Because the payload is merely Base64URL encoded, anyone who intercepts or accesses the token can easily decode and read all claims inside. Storing sensitive data like user passwords, private encryption keys, or credit card information in a JWT payload exposes that data to severe security risks.",
    },
    {
      question: "What do standard JWT claims like exp, iat, sub, and iss mean?",
      answer: "Under the RFC 7519 standard: 'exp' (Expiration Time) specifies the Unix timestamp after which the token must not be accepted; 'iat' (Issued At) denotes when the token was generated; 'sub' (Subject) identifies the principal or user ID; and 'iss' (Issuer) identifies the authentication server or authority that issued the token.",
    },
  ];

  const aboutText = "UtilitySpace JWT Decoder is a lightweight, secure developer tool for inspecting JSON Web Tokens (RFC 7519) in real time. Because all parsing happens entirely client-side without network requests, you can safely inspect authorization headers, check token expiration, and debug claims without compromising confidential tokens or user privacy.";

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode JSON Web Tokens (JWT) instantly in your browser."
      category="Developer"
      howToSteps={howToSteps}
      faqs={faqs}
      aboutText={aboutText}
    >
      <div className="space-y-6">
         <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3 text-amber-700 dark:text-amber-400 text-sm">
           <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
           <p><strong>Security Note:</strong> This tool decodes the Base64URL payload for local inspection. It <em>does not</em> verify the token signature against a secret key. All operations run strictly on your device.</p>
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

         {signature && (
           <Card className="shadow-sm">
             <CardHeader className="py-4 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
               <div className="flex items-center gap-2">
                 <KeyRound className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                 <CardTitle className="text-base text-secondary-text uppercase tracking-wider">Signature Status</CardTitle>
               </div>
               <Button variant="ghost" size="icon" onClick={() => handleCopy(signature)} disabled={!signature} className="h-8 w-8">
                 <Copy className="w-4 h-4" />
               </Button>
             </CardHeader>
             <CardContent className="p-4 space-y-2">
               <div className="font-mono text-xs text-purple-600 dark:text-purple-400 break-all p-3 bg-muted/30 rounded border border-border">
                 {signature}
               </div>
               <p className="text-xs text-secondary-text">
                 The 256/384/512-bit signature segment is present. Full cryptographic verification requires your server&apos;s signing secret or public certificate.
               </p>
             </CardContent>
           </Card>
         )}
      </div>
    </ToolLayout>
  );
}

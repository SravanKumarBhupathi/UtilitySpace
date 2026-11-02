import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder — Inspect JSON Web Tokens",
  description: "Decode and inspect JSON Web Tokens (JWT) headers and payloads securely without sending tokens to any server.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/jwt-decoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strong Password Generator — Cryptographically Secure & Random",
  description: "Generate highly secure, random passwords and passphrases instantly. 100% client-side with entropy calculation, bulk generation, and customizable symbols.",
  alternates: {
    canonical: "https://utilityspace.online/tools/developer/password-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

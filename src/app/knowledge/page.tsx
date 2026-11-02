import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Practical Guides | UtilitySpace",
  description: "Explore practical guides and step-by-step instructions for everyday digital tools on UtilitySpace.",
  alternates: {
    canonical: "https://utilityspace.online/guides",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function KnowledgeRedirectPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-24 text-center">
      <head>
        <meta httpEquiv="refresh" content="0; url=/guides" />
      </head>
      <h1 className="font-heading text-2xl font-bold mb-4">Redirecting to Guides...</h1>
      <p className="text-secondary-text mb-6">
        Our knowledge articles have moved to our practical guides section.
      </p>
      <Link href="/guides" className="text-primary hover:underline font-medium">
        Click here if you are not redirected automatically &rarr;
      </Link>
    </div>
  );
}

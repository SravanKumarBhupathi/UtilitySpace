import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | UtilitySpace",
    default: "UtilitySpace — Free Online Tools, Calculators & Practical Guides",
  },
  description: "Free, private, and fast online tools, calculators, and practical guides for everyday digital tasks. Run calculations, convert files, format text, and optimize workflows.",
  metadataBase: new URL("https://utilityspace.online"),
  openGraph: {
    title: "UtilitySpace — Free Online Tools, Calculators & Practical Guides",
    description: "Free, private, and fast online tools, calculators, and practical guides for everyday digital tasks. Run calculations, convert files, format text, and optimize workflows.",
    url: "https://utilityspace.online",
    siteName: "UtilitySpace",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UtilitySpace — Free Online Tools, Calculators & Practical Guides",
    description: "Free, private, and fast online tools, calculators, and practical guides for everyday digital tasks.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://utilityspace.online/#organization",
      name: "UtilitySpace",
      url: "https://utilityspace.online",
      logo: "https://utilityspace.online/globe.svg",
      email: "contact@utilityspace.online",
      description: "Free, private, and fast online tools, calculators, and practical guides for everyday digital tasks.",
    },
    {
      "@type": "WebSite",
      "@id": "https://utilityspace.online/#website",
      url: "https://utilityspace.online",
      name: "UtilitySpace",
      publisher: {
        "@id": "https://utilityspace.online/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://utilityspace.online/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-sans min-h-screen flex flex-col bg-background text-foreground antialiased overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

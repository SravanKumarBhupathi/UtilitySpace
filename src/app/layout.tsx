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
  description: "Useful online tools, calculators and practical guides for everyday digital tasks. Convert, calculate, organize and learn with UtilitySpace.",
  metadataBase: new URL("https://utilityspace.online"),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "UtilitySpace — Free Online Tools, Calculators & Practical Guides",
    description: "Useful online tools, calculators and practical guides for everyday digital tasks. Convert, calculate, organize and learn with UtilitySpace.",
    url: "https://utilityspace.online",
    siteName: "UtilitySpace",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UtilitySpace — Free Online Tools, Calculators & Practical Guides",
    description: "Useful online tools, calculators and practical guides for everyday digital tasks. Convert, calculate, organize and learn with UtilitySpace.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} font-sans min-h-screen flex flex-col bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

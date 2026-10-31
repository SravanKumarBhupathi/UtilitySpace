import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          <div className="flex flex-col space-y-4 md:col-span-2">
            <span className="font-heading font-bold text-xl tracking-tight text-foreground">
              UtilitySpace.online
            </span>
            <p className="text-sm text-secondary-text max-w-sm leading-relaxed">
              Your everyday digital toolbox. Free online tools, calculators, and guides designed to make your daily tasks simple, private, and fast.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="font-heading font-semibold text-foreground">Tools</h4>
            <Link href="/tools" className="text-sm text-secondary-text hover:text-primary transition-colors">All Tools</Link>
            <Link href="/tools/pdf" className="text-sm text-secondary-text hover:text-primary transition-colors">PDF Tools</Link>
            <Link href="/tools/images" className="text-sm text-secondary-text hover:text-primary transition-colors">Image Tools</Link>
            <Link href="/tools/text" className="text-sm text-secondary-text hover:text-primary transition-colors">Text Tools</Link>
            <Link href="/tools/developer" className="text-sm text-secondary-text hover:text-primary transition-colors">Developer Tools</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="font-heading font-semibold text-foreground">Calculators & Content</h4>
            <Link href="/calculators" className="text-sm text-secondary-text hover:text-primary transition-colors">All Calculators</Link>
            <Link href="/guides" className="text-sm text-secondary-text hover:text-primary transition-colors">Guides</Link>
            <Link href="/blog" className="text-sm text-secondary-text hover:text-primary transition-colors">Blog</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="font-heading font-semibold text-foreground">Information</h4>
            <Link href="/about" className="text-sm text-secondary-text hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-secondary-text hover:text-primary transition-colors">Contact</Link>
            <Link href="/privacy" className="text-sm text-secondary-text hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-secondary-text hover:text-primary transition-colors">Terms of Service</Link>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-text">
            © {year} UtilitySpace.online. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

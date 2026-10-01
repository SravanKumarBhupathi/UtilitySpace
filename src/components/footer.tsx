import Link from "next/link";

export function Footer() {
  const year = "2026";

  return (
    <footer className="w-full border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <span className="font-heading font-bold text-xl tracking-tight text-foreground">
              UtilitySpace
            </span>
            <p className="text-sm text-secondary-text max-w-xs">
              Your everyday digital toolbox.
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="font-heading font-semibold text-foreground">Resources</h4>
            <Link href="/exam-tools" className="text-sm text-secondary-text hover:text-primary transition-colors">Exam Tools</Link>
            <Link href="/tools" className="text-sm text-secondary-text hover:text-primary transition-colors">Tools</Link>
            <Link href="/calculators" className="text-sm text-secondary-text hover:text-primary transition-colors">Calculators</Link>
            <Link href="/guides" className="text-sm text-secondary-text hover:text-primary transition-colors">Guides</Link>
            <Link href="/knowledge" className="text-sm text-secondary-text hover:text-primary transition-colors">Knowledge</Link>
            <Link href="/blog" className="text-sm text-secondary-text hover:text-primary transition-colors">Blog</Link>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="font-heading font-semibold text-foreground">Company</h4>
            <Link href="/about" className="text-sm text-secondary-text hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-secondary-text hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="font-heading font-semibold text-foreground">Legal</h4>
            <Link href="/privacy" className="text-sm text-secondary-text hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-secondary-text hover:text-primary transition-colors">Terms</Link>
            <Link href="/disclaimer" className="text-sm text-secondary-text hover:text-primary transition-colors">Disclaimer</Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-secondary-text">
            © {year} UtilitySpace
          </p>
        </div>
      </div>
    </footer>
  );
}

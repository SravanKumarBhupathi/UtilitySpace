export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-10">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground mb-2">Terms of Use</h1>
        <p className="text-sm text-secondary-text">Last updated: October 2026</p>
      </header>
      <main className="prose prose-slate dark:prose-invert max-w-none text-secondary-text">
        <p>By accessing and using UtilitySpace, you agree to comply with these Terms of Use.</p>
        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">1. Use of Tools</h2>
        <p>The tools and calculators provided on UtilitySpace are free for personal and reasonable commercial use. You may not automate, scrape, or programmatically access these tools without explicit permission.</p>
        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">2. Accuracy of Information</h2>
        <p>While we strive for accuracy, the results provided by our calculators and tools are for informational purposes only. You should not rely solely on these results for critical financial, legal, or educational decisions.</p>
        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">3. Modifications</h2>
        <p>We reserve the right to modify or discontinue any tool or feature at any time without prior notice.</p>
      </main>
    </div>
  );
}

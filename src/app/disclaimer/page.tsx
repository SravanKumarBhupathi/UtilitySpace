export default function DisclaimerPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-10">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground mb-2">Disclaimer</h1>
      </header>
      <main className="prose prose-slate dark:prose-invert max-w-none text-secondary-text">
        <p>The information, tools, and calculators on UtilitySpace are provided &quot;as is&quot; and without warranties of any kind, either express or implied.</p>
        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">No Professional Advice</h2>
        <p>The financial, mathematical, and educational calculators are designed to provide rough estimates and general information. They do not constitute professional financial, tax, legal, or academic advice.</p>
        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">Limitation of Liability</h2>
        <p>UtilitySpace and its creators shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, or use of, the website and its tools.</p>
      </main>
    </div>
  );
}

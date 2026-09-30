export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-10">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-secondary-text">Last updated: October 2026</p>
      </header>
      <main className="prose prose-slate dark:prose-invert max-w-none text-secondary-text">
        <p>At UtilitySpace, your privacy is a priority. This Privacy Policy outlines how we handle information when you use our website and tools.</p>
        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">1. Information Processing</h2>
        <p>Most of the tools and calculators on UtilitySpace process data locally within your web browser. This means that files, images, and text inputs typically do not leave your device and are not uploaded to our servers.</p>
        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">2. Server-side Processing</h2>
        <p>If a specific tool requires server-side processing, this will be clearly indicated. In such cases, uploaded files are temporarily stored for the purpose of processing and are automatically deleted immediately after the task is completed.</p>
        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">3. Local Storage</h2>
        <p>We may use local storage (like cookies or HTML5 localStorage) to remember your preferences, such as your theme choice (light or dark mode).</p>
        <h2 className="font-heading text-xl font-bold text-foreground mt-8 mb-4">4. Third-party Analytics</h2>
        <p>We may use basic analytics to understand how our tools are used in order to improve them. This data is aggregated and anonymized.</p>
      </main>
    </div>
  );
}

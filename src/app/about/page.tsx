export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-10 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          About UtilitySpace
        </h1>
        <p className="text-xl text-secondary-text">
          Your everyday digital toolbox.
        </p>
      </header>
      <main className="prose prose-slate dark:prose-invert max-w-none text-lg text-secondary-text leading-relaxed">
        <p>
          UtilitySpace is designed to make everyday digital tasks simpler through useful tools, calculators and practical information.
        </p>
        <p>
          We believe that standard utilities shouldn&apos;t be cluttered with excessive advertising, slow load times, or confusing interfaces. Whether you need to quickly resize an image, format some JSON, or calculate a percentage, our goal is to provide a clean, fast, and reliable tool for the job.
        </p>
        <h2 className="font-heading text-2xl font-bold text-foreground mt-10 mb-4">Our Core Principles</h2>
        <ul className="space-y-2">
          <li><strong>Simplicity:</strong> Tools should just work without unnecessary steps.</li>
          <li><strong>Privacy:</strong> We process files locally in your browser whenever technically possible.</li>
          <li><strong>Speed:</strong> A tool is only useful if it saves you time.</li>
          <li><strong>Accessibility:</strong> Everyone should be able to use these utilities, regardless of their device or abilities.</li>
        </ul>
        <p className="mt-8">
          Thank you for using UtilitySpace. We are constantly working to improve existing tools and add new ones based on what is genuinely useful.
        </p>
      </main>
    </div>
  );
}

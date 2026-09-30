import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background px-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="font-heading text-6xl md:text-8xl font-bold tracking-tight text-primary">
          404
        </h1>
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
            Looks like this page got lost.
          </h2>
          <p className="text-secondary-text">
            The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been created yet.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/tools">Explore Tools</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

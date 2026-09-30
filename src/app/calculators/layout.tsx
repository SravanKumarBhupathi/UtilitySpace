import { ReactNode } from "react";

export default function CalculatorsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      {children}
    </div>
  );
}

import * as LucideIcons from "lucide-react";

export function getIcon(iconName: string, className?: string) {
  const Icon = (LucideIcons as any)[iconName];
  if (!Icon) return <LucideIcons.HelpCircle className={className} />;
  return <Icon className={className} />;
}

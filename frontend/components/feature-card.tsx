import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";

export function FeatureCard({
  href,
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="focus-ring group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 h-full transition-colors hover:border-teal/40"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wide text-muted">{eyebrow}</span>
          <Icon className="h-4 w-4 text-teal" strokeWidth={1.5} />
        </div>
        <h3 className="mt-4 font-display text-xl text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      </div>
      <div className="mt-6 flex items-center gap-1 text-sm text-teal opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
        Open <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActivationTicker } from "./activation-ticker";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/explainer", label: "Explainer" },
  { href: "/inspector", label: "Inspector" },
  { href: "/benchmarks", label: "Benchmarks" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-base/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg tracking-tight">
          <span className="inline-block h-2 w-2 rounded-full bg-teal shadow-[0_0_12px_2px_rgba(94,234,212,0.7)]" />
          BDH Lab
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`focus-ring px-3 py-1.5 rounded-full text-sm transition-colors ${
                  active ? "bg-surface2 text-ink" : "text-muted hover:text-ink hover:bg-surface2/60"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="focus-ring text-sm px-3 py-1.5 rounded-full border border-border text-muted hover:text-ink hover:border-teal/50 transition-colors"
        >
          GitHub
        </a>
      </div>
      <ActivationTicker />
    </header>
  );
}

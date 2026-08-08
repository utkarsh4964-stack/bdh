// Used everywhere a chart or number appears, so it's never ambiguous
// whether a value is a published BDH result, something this app actually
// measured, or synthetic demo data standing in for both.

type Kind = "demo" | "measured" | "published" | "hypothesis";

const STYLES: Record<Kind, { label: string; className: string }> = {
  demo: {
    label: "Synthetic demo data",
    className: "border-amber/40 text-amber bg-amber/10",
  },
  measured: {
    label: "Measured in this app",
    className: "border-teal/40 text-teal bg-teal/10",
  },
  published: {
    label: "Published BDH result",
    className: "border-violet/40 text-violet bg-violet/10",
  },
  hypothesis: {
    label: "Our hypothesis",
    className: "border-muted/40 text-muted bg-muted/10",
  },
};

export function DataBadge({ kind = "demo" }: { kind?: Kind }) {
  const s = STYLES[kind];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full border ${s.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

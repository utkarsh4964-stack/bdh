"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PIPELINE } from "@/lib/pipeline-data";
import { DataBadge } from "@/components/data-badge";

export default function ExplainerPage() {
  const [activeId, setActiveId] = useState(PIPELINE[0].id);
  const active = PIPELINE.find((s) => s.id === activeId)!;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Interactive explainer</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl tracking-tight">The inference pipeline</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Click a stage to see its tensor shape, an illustrative example, and a note on how confident this
        explainer is in the detail shown.
      </p>

      <div className="mt-12 flex flex-wrap items-center gap-1">
        {PIPELINE.map((stage, i) => (
          <div key={stage.id} className="flex items-center">
            <button
              onClick={() => setActiveId(stage.id)}
              className={`focus-ring rounded-full px-4 py-2 text-sm font-mono transition-colors border ${
                activeId === stage.id
                  ? "border-teal bg-teal/10 text-teal"
                  : "border-border text-muted hover:text-ink hover:border-ink/30"
              }`}
            >
              <span className="text-[10px] text-muted mr-1.5">{String(i + 1).padStart(2, "0")}</span>
              {stage.title}
            </button>
            {i < PIPELINE.length - 1 && <ArrowRight className="mx-1 h-3.5 w-3.5 text-border" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="mt-8 rounded-2xl border border-border bg-surface p-8"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-display text-2xl">{active.title}</h2>
              <p className="text-muted mt-1">{active.short}</p>
            </div>
            <DataBadge kind={active.noteKind} />
          </div>

          <p className="mt-6 leading-relaxed text-ink/90 max-w-2xl">{active.description}</p>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-surface2 p-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted">Tensor shape</p>
              <p className="mt-1 font-mono text-teal">{active.tensorShape}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface2 p-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted">Example</p>
              <p className="mt-1 font-mono text-ink/90 text-sm break-words">{active.exampleValues}</p>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted border-l-2 border-border pl-3">{active.note}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

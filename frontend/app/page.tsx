import Link from "next/link";
import { Waypoints, Microscope, BarChart3 } from "lucide-react";
import { SignalHero } from "@/components/signal-hero";
import { FeatureCard } from "@/components/feature-card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="pt-16 sm:pt-24 pb-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">
          Research platform · post-transformer architectures
        </p>
        <h1 className="mt-4 font-display text-5xl sm:text-7xl leading-[0.98] tracking-tight text-ink max-w-3xl">
          BDH Lab
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted leading-relaxed">
          An interactive inspector for sparse-neuron, post-transformer models — trace activations,
          compare architectures, and read benchmark numbers that are always labeled as demo,
          measured, or published.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/explainer"
            className="focus-ring rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-base hover:opacity-90 transition-opacity"
          >
            Explore the pipeline
          </Link>
          <Link
            href="/inspector"
            className="focus-ring rounded-full border border-border px-5 py-2.5 text-sm font-medium text-ink hover:border-teal/50 transition-colors"
          >
            Launch demo inspector
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="focus-ring rounded-full px-5 py-2.5 text-sm font-medium text-muted hover:text-ink transition-colors"
          >
            View on GitHub →
          </a>
        </div>

        <div className="mt-14">
          <SignalHero />
        </div>
      </section>

      <section className="pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          <FeatureCard
            href="/explainer"
            icon={Waypoints}
            eyebrow="01 · Explainer"
            title="Architecture pipeline"
            description="Click through tokenization, embedding, neuron activation, sparse routing, memory formation, and prediction — each stage with tensor shapes and notes."
          />
          <FeatureCard
            href="/inspector"
            icon={Microscope}
            eyebrow="02 · Inspector"
            title="Model inspector"
            description="Browse a bundled demo model's layer tree, parameter counts, and activation histograms, fetched live from the FastAPI backend."
          />
          <FeatureCard
            href="/benchmarks"
            icon={BarChart3}
            eyebrow="03 · Benchmarks"
            title="Benchmark dashboard"
            description="Compare demo models on accuracy, latency, memory, and throughput. All numbers are synthetic and labeled as such."
          />
        </div>
      </section>
    </div>
  );
}

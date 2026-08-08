"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, ActivationHistogram, ModelInfo } from "@/lib/api";
import { DataBadge } from "@/components/data-badge";

const MODEL_ID = "bdh-demo-small";

export default function InspectorPage() {
  const [model, setModel] = useState<ModelInfo | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [histogram, setHistogram] = useState<ActivationHistogram | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .modelInfo(MODEL_ID)
      .then((res) => {
        setModel(res.model);
        setSelectedLayer(res.model.layers[0]?.name ?? null);
      })
      .catch(() => setError("Couldn't reach the backend — start it with `uvicorn main:app` in /backend."));
  }, []);

  useEffect(() => {
    if (!selectedLayer) return;
    api
      .activations(MODEL_ID, selectedLayer)
      .then((res) => setHistogram(res.histogram))
      .catch(() => {});
  }, [selectedLayer]);

  const chartData =
    histogram?.counts.map((count, i) => ({
      bin: histogram.bin_edges[i].toFixed(2),
      count,
    })) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Model inspector</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl tracking-tight">
            {model?.name ?? "Loading model…"}
          </h1>
        </div>
        <DataBadge kind="demo" />
      </div>
      <p className="mt-3 max-w-2xl text-muted">
        Only the bundled demo model is supported in this scaffold — arbitrary checkpoint upload is not yet
        implemented.
      </p>

      {error && (
        <div className="mt-8 rounded-xl border border-amber/40 bg-amber/10 p-4 text-sm text-amber">{error}</div>
      )}

      {model && (
        <div className="mt-10 grid lg:grid-cols-[1fr_1.2fr] gap-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="font-mono text-[11px] uppercase tracking-wide text-muted">Layer tree</p>
            <div className="mt-4 space-y-1">
              {model.layers.map((layer) => (
                <button
                  key={layer.name}
                  onClick={() => setSelectedLayer(layer.name)}
                  className={`focus-ring w-full text-left rounded-lg px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                    selectedLayer === layer.name ? "bg-surface2 text-ink" : "text-muted hover:bg-surface2/60"
                  }`}
                >
                  <span className="font-mono">{layer.name}</span>
                  <span className="text-xs text-muted">{layer.type}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Stat label="Total params" value={model.total_params.toLocaleString()} />
              <Stat label="Hidden dim" value={model.hidden_dim.toString()} />
              <Stat label="Latency / token" value={`${model.latency_ms_per_token} ms`} />
              <Stat label="Memory" value={`${model.memory_mb} MB`} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted">
                Activation histogram — {selectedLayer}
              </p>
              {histogram && (
                <span className="font-mono text-xs text-teal">
                  {(histogram.fraction_near_zero * 100).toFixed(0)}% near-zero
                </span>
              )}
            </div>
            <div className="mt-4 h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="bin" tick={{ fill: "#8B909C", fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#8B909C", fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#1B1D22",
                        border: "1px solid #24262C",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "#8B909C" }}
                    />
                    <Bar dataKey="count" fill="#5EEAD4" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-muted">
                  Select a layer to see its activation distribution.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface2 px-3 py-2">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="font-mono text-ink mt-0.5">{value}</p>
    </div>
  );
}

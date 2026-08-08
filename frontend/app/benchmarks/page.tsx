"use client";

import { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { api, BenchmarkRow } from "@/lib/api";
import { DataBadge } from "@/components/data-badge";

export default function BenchmarksPage() {
  const [rows, setRows] = useState<BenchmarkRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .benchmark()
      .then((res) => setRows(res.rows))
      .catch(() => setError("Couldn't reach the backend — start it with `uvicorn main:app` in /backend."));
  }, []);

  const radarData = rows
    ? [
        { metric: "Accuracy", ...Object.fromEntries(rows.map((r) => [r.name, r.accuracy])) },
        { metric: "Speed (inv. latency)", ...Object.fromEntries(rows.map((r) => [r.name, 1 / r.latency_ms])) },
        { metric: "Efficiency (inv. mem)", ...Object.fromEntries(rows.map((r) => [r.name, 1 / r.memory_mb])) },
        { metric: "Throughput", ...Object.fromEntries(rows.map((r) => [r.name, r.throughput_tok_s / 2500])) },
      ]
    : [];

  const colors = ["#5EEAD4", "#7C6FFF"];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Benchmarks</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl tracking-tight">Model comparison</h1>
        </div>
        <DataBadge kind="demo" />
      </div>
      <p className="mt-3 max-w-2xl text-muted">
        Synthetic numbers comparing the two bundled demo model configs — not measured on real hardware.
      </p>

      {error && (
        <div className="mt-8 rounded-xl border border-amber/40 bg-amber/10 p-4 text-sm text-amber">{error}</div>
      )}

      {rows && (
        <>
          <div className="mt-10 grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">
                Normalized comparison
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#24262C" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#8B909C", fontSize: 11 }} />
                    {rows.map((r, i) => (
                      <Radar
                        key={r.name}
                        name={r.name}
                        dataKey={r.name}
                        stroke={colors[i % colors.length]}
                        fill={colors[i % colors.length]}
                        fillOpacity={0.2}
                      />
                    ))}
                    <Legend wrapperStyle={{ fontSize: 12, color: "#8B909C" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">
                Throughput (tokens/sec)
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rows}>
                    <XAxis dataKey="name" tick={{ fill: "#8B909C", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#8B909C", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#1B1D22",
                        border: "1px solid #24262C",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "#8B909C" }}
                    />
                    <Bar dataKey="throughput_tok_s" fill="#7C6FFF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="px-4 py-3 font-mono text-xs font-normal">Model</th>
                  <th className="px-4 py-3 font-mono text-xs font-normal">Accuracy</th>
                  <th className="px-4 py-3 font-mono text-xs font-normal">Latency</th>
                  <th className="px-4 py-3 font-mono text-xs font-normal">Memory</th>
                  <th className="px-4 py-3 font-mono text-xs font-normal">Params</th>
                  <th className="px-4 py-3 font-mono text-xs font-normal">Throughput</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.model_id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 font-mono text-teal">{(r.accuracy * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 font-mono">{r.latency_ms} ms</td>
                    <td className="px-4 py-3 font-mono">{r.memory_mb} MB</td>
                    <td className="px-4 py-3 font-mono">{r.params_m}M</td>
                    <td className="px-4 py-3 font-mono">{r.throughput_tok_s.toLocaleString()} tok/s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

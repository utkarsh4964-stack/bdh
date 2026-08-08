const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export type ModelInfo = {
  id: string;
  name: string;
  total_params: number;
  hidden_dim: number;
  layers: {
    name: string;
    type: string;
    params: number;
    shape: number[];
    activation_sparsity: number;
  }[];
  latency_ms_per_token: number;
  memory_mb: number;
};

export type ActivationHistogram = {
  bin_edges: number[];
  counts: number[];
  n_neurons: number;
  fraction_near_zero: number;
};

export type BenchmarkRow = {
  model_id: string;
  name: string;
  accuracy: number;
  latency_ms: number;
  memory_mb: number;
  params_m: number;
  throughput_tok_s: number;
};

export const api = {
  models: () => getJSON<{ data_source: string; models: { id: string; name: string; params: number }[] }>(
    "/api/models"
  ),
  modelInfo: (modelId: string) =>
    getJSON<{ data_source: string; model: ModelInfo }>(`/api/model-info?model_id=${modelId}`),
  activations: (modelId: string, layer: string) =>
    getJSON<{ data_source: string; histogram: ActivationHistogram }>(
      `/api/activations?model_id=${modelId}&layer=${layer}`
    ),
  benchmark: () => getJSON<{ data_source: string; note: string; rows: BenchmarkRow[] }>("/api/benchmark"),
};

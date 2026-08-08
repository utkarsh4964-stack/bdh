"""
Synthetic data generators for the BDH Lab demo backend.

Everything here is deterministic given a seed and explicitly synthetic —
no real checkpoints are loaded. Replace these functions with real
`torch.load` / model-inspection code to go from demo to live.
"""

from __future__ import annotations

import random

DEMO_MODELS: dict[str, dict] = {
    "bdh-demo-small": {
        "name": "BDH-Demo-Small",
        "params": 12_582_912,
        "layers": 8,
        "hidden_dim": 512,
        "sparsity_target": 0.05,
    },
    "bdh-demo-base": {
        "name": "BDH-Demo-Base",
        "params": 87_031_808,
        "layers": 16,
        "hidden_dim": 1024,
        "sparsity_target": 0.03,
    },
}


def build_model_info(model_id: str) -> dict:
    cfg = DEMO_MODELS[model_id]
    rng = random.Random(model_id)
    layers = []
    for i in range(cfg["layers"]):
        layers.append(
            {
                "name": f"layer_{i}",
                "type": rng.choice(["neuron_block", "sparse_router", "memory_gate"]),
                "params": rng.randint(200_000, 2_000_000),
                "shape": [cfg["hidden_dim"], cfg["hidden_dim"] * rng.choice([2, 4])],
                "activation_sparsity": round(rng.uniform(0.01, 0.12), 4),
            }
        )
    return {
        "id": model_id,
        "name": cfg["name"],
        "total_params": cfg["params"],
        "hidden_dim": cfg["hidden_dim"],
        "layers": layers,
        "latency_ms_per_token": round(rng.uniform(1.2, 6.5), 2),
        "memory_mb": round(cfg["params"] * 4 / 1_000_000 * rng.uniform(1.1, 1.4), 1),
    }


def build_activation_histogram(seed: int, n_neurons: int = 512, n_bins: int = 24) -> dict:
    rng = random.Random(seed)
    # Skewed toward zero to emulate sparse activation, per BDH's sparsity claims.
    values = [max(0.0, rng.gammavariate(1.2, 0.15)) for _ in range(n_neurons)]
    lo, hi = 0.0, max(values) if values else 1.0
    width = (hi - lo) / n_bins if hi > lo else 1.0
    bins = [0] * n_bins
    for v in values:
        idx = min(int((v - lo) / width), n_bins - 1)
        bins[idx] += 1
    return {
        "bin_edges": [round(lo + i * width, 4) for i in range(n_bins + 1)],
        "counts": bins,
        "n_neurons": n_neurons,
        "fraction_near_zero": round(sum(1 for v in values if v < 0.05) / n_neurons, 3),
    }


def build_benchmark_table() -> list[dict]:
    rng = random.Random("benchmark")
    rows = []
    for model_id, cfg in DEMO_MODELS.items():
        rows.append(
            {
                "model_id": model_id,
                "name": cfg["name"],
                "accuracy": round(rng.uniform(0.62, 0.89), 3),
                "latency_ms": round(rng.uniform(8, 40), 1),
                "memory_mb": round(cfg["params"] * 4 / 1_000_000, 1),
                "params_m": round(cfg["params"] / 1_000_000, 1),
                "throughput_tok_s": round(rng.uniform(400, 2200), 0),
            }
        )
    return rows

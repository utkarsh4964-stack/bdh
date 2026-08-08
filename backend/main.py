"""
BDH Lab backend — FastAPI service.

Scope note: this is a scoped-down scaffold. Endpoints below return clearly
labeled synthetic/demo data (data_source: "demo") so the frontend can be
built and exercised end-to-end. Swapping in a real model requires replacing
the functions in `demo_data.py` with real PyTorch inspection code — the
route signatures and response shapes are designed to stay stable when you
do that.
"""

from __future__ import annotations

import random
import time
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from demo_data import (
    DEMO_MODELS,
    build_activation_histogram,
    build_benchmark_table,
    build_model_info,
)

app = FastAPI(
    title="BDH Lab API",
    description="Backend for BDH Lab — a research-inspector UI for post-transformer models.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # scoped-down demo: tighten this before deploying
    allow_methods=["*"],
    allow_headers=["*"],
)


class DataEnvelope(BaseModel):
    data_source: Literal["demo", "measured", "published"]
    generated_at: float


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "time": time.time()}


@app.get("/api/models")
def list_models() -> dict:
    """List the bundled demo models available to inspect."""
    return {
        "data_source": "demo",
        "models": [{"id": k, "name": v["name"], "params": v["params"]} for k, v in DEMO_MODELS.items()],
    }


@app.get("/api/model-info")
def model_info(model_id: str = "bdh-demo-small") -> dict:
    if model_id not in DEMO_MODELS:
        raise HTTPException(status_code=404, detail=f"Unknown model_id '{model_id}'. See /api/models.")
    return {
        "data_source": "demo",
        "generated_at": time.time(),
        "model": build_model_info(model_id),
    }


@app.get("/api/activations")
def activations(model_id: str = "bdh-demo-small", layer: str = "layer_0") -> dict:
    if model_id not in DEMO_MODELS:
        raise HTTPException(status_code=404, detail=f"Unknown model_id '{model_id}'. See /api/models.")
    return {
        "data_source": "demo",
        "generated_at": time.time(),
        "layer": layer,
        "histogram": build_activation_histogram(seed=hash((model_id, layer)) % (2**31)),
    }


@app.get("/api/benchmark")
def benchmark() -> dict:
    """Comparison across bundled demo models. Numbers are synthetic, not measured on real hardware."""
    return {
        "data_source": "demo",
        "generated_at": time.time(),
        "note": "Synthetic benchmark numbers for demo purposes only — not measured on real hardware.",
        "rows": build_benchmark_table(),
    }


@app.get("/api/neurons/{neuron_id}")
def neuron_detail(neuron_id: str) -> dict:
    rng = random.Random(neuron_id)
    return {
        "data_source": "demo",
        "generated_at": time.time(),
        "neuron_id": neuron_id,
        "activation_strength": round(rng.uniform(0.05, 0.98), 3),
        "top_tokens": rng.sample(
            ["the", "graph", "sparse", "route", "memory", "signal", "gate", "token", "context", "residual"], k=5
        ),
        "nearest_neurons": [f"n_{rng.randint(0, 4095)}" for _ in range(4)],
        "note": "Synthetic — not derived from a real forward pass.",
    }


@app.get("/api/future")
def future_bdh() -> dict:
    return {
        "data_source": "demo",
        "available": False,
        "message": "Evaluation against a released BDH checkpoint is not yet available. This endpoint is a placeholder for future integration.",
    }

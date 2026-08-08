# BDH Lab (scaffold)

An interactive inspector for post-transformer, sparse-neuron model architectures.
This repo is a **scoped-down scaffold**, not the full platform described in the
original brief — see [What's here vs. the full vision](#whats-here-vs-the-full-vision)
below for exactly what was cut and why.

## What's here

- **Home** — hero with a custom "activation trace" visual (not a generic particle
  network — it's a signal trace, tying the hero to the product's actual subject),
  plus links to the three working sections.
- **Explainer** (`/explainer`) — click through the 7-stage inference pipeline
  (Input → Tokenization → Embedding → Neuron Activations → Sparse Routing →
  Memory Formation → Prediction). Each stage shows a tensor shape, an example, and
  a badge stating whether the detail is a demo illustration or a hypothesis.
- **Model Inspector** (`/inspector`) — fetches a bundled demo model's layer tree,
  parameter counts, and per-layer activation histogram from the FastAPI backend.
  Arbitrary checkpoint upload is **not implemented** — the UI says so.
- **Benchmarks** (`/benchmarks`) — radar chart, throughput bar chart, and a ranking
  table comparing the two bundled demo model configs. All numbers are synthetic.
- **Backend** (`/backend`) — FastAPI service with `/api/models`, `/api/model-info`,
  `/api/activations`, `/api/benchmark`, `/api/neurons/{id}`, `/api/future`. Every
  response includes a `data_source` field (`demo`, `measured`, or `published`) so
  the frontend never has to guess.

Every page and API response is explicit about data provenance — synthetic demo
data is never presented as a real measurement.

## What's here vs. the full vision

The original brief asked for an 8-page platform (add Neuron Explorer, Research
Notebook, Documentation, About) with a 3D NeuronVerse (Three.js), checkpoint
upload + real PyTorch inspection, PDF/Markdown/CSV report export, a command
palette, attention/memory-evolution animations, and Vercel/Railway deployment
config. None of that is in this scaffold. What's built is a working vertical
slice — real frontend↔backend wiring, real (if synthetic) data, a working build —
that the rest can be extended from, rather than stub pages for all eight sections.

## Running it

**Backend**

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend** (in a second terminal)

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Visit `http://localhost:3000`. The frontend expects the backend at
`http://localhost:8000` (configurable via `NEXT_PUBLIC_API_BASE`).

> Note: `npm run build` fetches Space Grotesk / Inter / IBM Plex Mono from Google
> Fonts at build time via `next/font/google`. This was verified to compile cleanly
> with the font imports stubbed out (no other build errors); it just needs normal
> internet access to fetch the actual font files, which a sandboxed build
> environment may not have.

## Tech stack

- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts
- Backend: FastAPI, Pydantic, Uvicorn

## Design tokens

- Palette: base `#0A0B0D`, surface `#131417`/`#1B1D22`, ink `#EDEFF2`, muted `#8B909C`,
  teal `#5EEAD4`, violet `#7C6FFF`, amber `#F5A623` (reserved for "this is demo data" labeling)
- Type: Space Grotesk (display), Inter (body), IBM Plex Mono (data/tensors/labels)
- Signature element: the activation-ticker strip under the nav — a persistent bar
  of animated pulses standing in for live neuron activity, present on every page

## Folder structure

```
BDH-Lab/
  frontend/
    app/            Next.js routes (home, explainer, inspector, benchmarks)
    components/     Nav, activation ticker, data badge, feature card, signal hero
    lib/             API client + pipeline content
  backend/
    main.py          FastAPI routes
    demo_data.py     Deterministic synthetic data generators
  README.md
```

## Extending toward the full brief

Roughly in order of leverage:

1. Wire `demo_data.py` functions to real `torch.load` + module inspection —
   the API response shapes are already designed to stay stable.
2. Add checkpoint upload (`/api/upload`) with a strict allow-list of tensor ops
   before trusting arbitrary uploaded weights.
3. Add the Neuron Explorer and NeuronVerse (Three.js / React Three Fiber) pages —
   `/api/neurons/{id}` already exists as a backend seam for this.
4. Add report/notebook export (PDF/Markdown/CSV) once there's real data worth exporting.

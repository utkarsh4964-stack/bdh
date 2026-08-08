export type Stage = {
  id: string;
  title: string;
  short: string;
  description: string;
  tensorShape: string;
  exampleValues: string;
  note: string;
  noteKind: "demo" | "hypothesis";
};

export const PIPELINE: Stage[] = [
  {
    id: "input",
    title: "Input",
    short: "Raw text enters the system",
    description:
      "A raw string is passed to the model. Nothing numeric has happened yet — this stage exists to anchor what the rest of the pipeline transforms.",
    tensorShape: "string (variable length)",
    exampleValues: '"the sparse network routes signal"',
    note: "Illustrative example — not run through a real tokenizer here.",
    noteKind: "demo",
  },
  {
    id: "tokenization",
    title: "Tokenization",
    short: "Text becomes integer IDs",
    description:
      "The string is split into subword tokens and mapped to integer IDs via a fixed vocabulary. Sequence length determines the shape of everything downstream.",
    tensorShape: "[seq_len] int64",
    exampleValues: "[1832, 204, 88, 5510, 12]",
    note: "Demo vocabulary — IDs shown are illustrative, not from a trained tokenizer.",
    noteKind: "demo",
  },
  {
    id: "embedding",
    title: "Embedding",
    short: "Tokens become vectors",
    description:
      "Each token ID is looked up in an embedding table and becomes a dense vector. This is the first point where the model has a continuous representation to work with.",
    tensorShape: "[seq_len, hidden_dim]",
    exampleValues: "hidden_dim = 512 in the bundled demo model",
    note: "Shape matches the demo model config; values are randomly initialized, not trained.",
    noteKind: "demo",
  },
  {
    id: "neuron-activations",
    title: "Neuron activations",
    short: "Sparse, interpretable units fire",
    description:
      "Instead of dense attention over all positions, individual neuron-like units activate based on their inputs. Most stay near zero — sparsity is the point, not a side effect.",
    tensorShape: "[seq_len, n_neurons]",
    exampleValues: "typical demo sparsity target: ~3–5% active",
    note: "Sparsity level shown reflects the demo config's target, not a measurement on real data.",
    noteKind: "hypothesis",
  },
  {
    id: "sparse-routing",
    title: "Sparse routing",
    short: "Active neurons determine the path",
    description:
      "Which neurons fired determines which downstream pathways get used. This is where post-transformer architectures diverge most from dense attention — routing is a function of activation pattern, not a fixed all-to-all computation.",
    tensorShape: "[seq_len, k_active] indices",
    exampleValues: "k_active « n_neurons",
    note: "Conceptual illustration of sparse routing, simplified for this explainer.",
    noteKind: "hypothesis",
  },
  {
    id: "memory-formation",
    title: "Memory formation",
    short: "State persists across steps",
    description:
      "Some routed activity is written into a persistent memory structure that future steps can read from, rather than being recomputed from scratch each time.",
    tensorShape: "[memory_slots, hidden_dim]",
    exampleValues: "memory_slots grows/decays over an inference run",
    note: "Simplified illustration of the memory-formation idea, not a specific implementation.",
    noteKind: "hypothesis",
  },
  {
    id: "prediction",
    title: "Prediction",
    short: "Next-token distribution",
    description:
      "The final hidden state is projected back to vocabulary size and turned into a probability distribution over the next token.",
    tensorShape: "[vocab_size] float32",
    exampleValues: "softmax over ~32k demo vocabulary",
    note: "Demo vocabulary size — not tied to a specific trained checkpoint.",
    noteKind: "demo",
  },
];

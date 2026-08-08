// Signature brand element: a strip of bars that behaves like a live neuron
// activation trace. It appears under the nav on every page — the idea is
// that the chrome itself looks like the thing the product measures, rather
// than a decorative gradient. Heights/delays are derived deterministically
// from index so server and client render identically (no hydration mismatch).

const BAR_COUNT = 96;

function seededHeight(i: number) {
  // cheap deterministic pseudo-noise, no Math.random (keeps SSR/CSR identical)
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function ActivationTicker() {
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
    const h = 0.15 + seededHeight(i) * 0.85;
    const delay = (seededHeight(i * 3.1) * 1.4).toFixed(2);
    const isViolet = i % 5 === 0;
    return { h, delay, isViolet };
  });

  return (
    <div
      aria-hidden="true"
      className="w-full h-6 border-b border-border bg-surface/60 backdrop-blur-sm overflow-hidden flex items-center gap-[3px] px-4"
    >
      {bars.map((bar, i) => (
        <span
          key={i}
          className={`inline-block w-[3px] rounded-full animate-pulseBar ${
            bar.isViolet ? "bg-violet" : "bg-teal"
          }`}
          style={{
            height: `${bar.h * 16}px`,
            animationDelay: `${bar.delay}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

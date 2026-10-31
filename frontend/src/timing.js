// Real timing helpers. Browsers round performance.now() to ~0.1 ms, so a single
// call can't show nanoseconds. Instead we repeat the work many times and divide.

export function formatTime(ns) {
  if (ns === null || ns === undefined || !Number.isFinite(ns)) return "—";
  if (ns < 1000) return `${ns < 10 ? ns.toFixed(1) : Math.round(ns)} ns`;
  if (ns < 1e6) return `${(ns / 1e3).toFixed(ns < 1e4 ? 2 : 1)} µs`;
  if (ns < 1e9) return `${(ns / 1e6).toFixed(2)} ms`;
  return `${(ns / 1e9).toFixed(2)} s`;
}

// Average nanoseconds per call of fn, measured over roughly budgetMs.
export function measure(fn, budgetMs = 10) {
  try {
    fn(); // warm-up so the JIT has compiled it
  } catch {
    return { ns: null, runs: 0 };
  }
  let runs = 0;
  let batch = 1;
  const start = performance.now();
  let now = start;
  while (now - start < budgetMs) {
    for (let i = 0; i < batch; i++) fn();
    runs += batch;
    now = performance.now();
    if (now - start < budgetMs / 4) batch *= 2;
  }
  return { ns: ((now - start) * 1e6) / runs, runs };
}

// Same as measure, minus the cost of a setup/copy step that is not part of the work.
export function measureNet(work, baseline, budgetMs = 10) {
  const a = measure(work, budgetMs);
  const b = measure(baseline, budgetMs / 2);
  if (a.ns === null) return a;
  return { ns: Math.max(a.ns - (b.ns || 0), 0.5), runs: a.runs };
}

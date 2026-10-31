import { useState } from "react";
import "./Extras.css";

/* Each sorter works on a copy and returns { comparisons, writes }. */
const sorters = {
  "Bubble Sort": (a) => {
    let c = 0, w = 0;
    for (let i = 0; i < a.length - 1; i++) {
      let swapped = false;
      for (let j = 0; j < a.length - 1 - i; j++) {
        c++;
        if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; w += 2; swapped = true; }
      }
      if (!swapped) break;
    }
    return { c, w };
  },
  "Selection Sort": (a) => {
    let c = 0, w = 0;
    for (let i = 0; i < a.length - 1; i++) {
      let m = i;
      for (let j = i + 1; j < a.length; j++) { c++; if (a[j] < a[m]) m = j; }
      if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; w += 2; }
    }
    return { c, w };
  },
  "Insertion Sort": (a) => {
    let c = 0, w = 0;
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      while (j >= 0) {
        c++;
        if (a[j] > key) { a[j + 1] = a[j]; w++; j--; } else break;
      }
      a[j + 1] = key; w++;
    }
    return { c, w };
  },
  "Merge Sort": (a) => {
    let c = 0, w = 0;
    const tmp = new Array(a.length);
    const sort = (lo, hi) => {
      if (lo >= hi) return;
      const mid = (lo + hi) >> 1;
      sort(lo, mid); sort(mid + 1, hi);
      let i = lo, j = mid + 1, k = lo;
      while (i <= mid && j <= hi) { c++; tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++]; w++; }
      while (i <= mid) { tmp[k++] = a[i++]; w++; }
      while (j <= hi) { tmp[k++] = a[j++]; w++; }
      for (let t = lo; t <= hi; t++) { a[t] = tmp[t]; w++; }
    };
    sort(0, a.length - 1);
    return { c, w };
  },
  "Quick Sort": (a) => {
    let c = 0, w = 0;
    const sort = (lo, hi) => {
      while (lo < hi) {
        // median-of-three pivot keeps sorted/reverse inputs from going quadratic
        const mid = (lo + hi) >> 1;
        if (a[mid] < a[lo]) { [a[mid], a[lo]] = [a[lo], a[mid]]; w += 2; }
        if (a[hi] < a[lo]) { [a[hi], a[lo]] = [a[lo], a[hi]]; w += 2; }
        if (a[hi] < a[mid]) { [a[hi], a[mid]] = [a[mid], a[hi]]; w += 2; }
        c += 3;
        [a[mid], a[hi]] = [a[hi], a[mid]]; w += 2;
        const pivot = a[hi];
        let i = lo;
        for (let j = lo; j < hi; j++) {
          c++;
          if (a[j] < pivot) { [a[i], a[j]] = [a[j], a[i]]; w += 2; i++; }
        }
        [a[i], a[hi]] = [a[hi], a[i]]; w += 2;
        if (i - lo < hi - i) { sort(lo, i - 1); lo = i + 1; } else { sort(i + 1, hi); hi = i - 1; }
      }
    };
    sort(0, a.length - 1);
    return { c, w };
  },
  "Heap Sort": (a) => {
    let c = 0, w = 0;
    const n = a.length;
    const sift = (i, size) => {
      for (;;) {
        let big = i;
        const l = 2 * i + 1, r = l + 1;
        if (l < size) { c++; if (a[l] > a[big]) big = l; }
        if (r < size) { c++; if (a[r] > a[big]) big = r; }
        if (big === i) return;
        [a[i], a[big]] = [a[big], a[i]]; w += 2; i = big;
      }
    };
    for (let i = (n >> 1) - 1; i >= 0; i--) sift(i, n);
    for (let end = n - 1; end > 0; end--) { [a[0], a[end]] = [a[end], a[0]]; w += 2; sift(0, end); }
    return { c, w };
  },
};

const datasets = {
  Random: (n) => Array.from({ length: n }, () => Math.floor(Math.random() * n * 5)),
  Sorted: (n) => Array.from({ length: n }, (_, i) => i),
  "Reverse sorted": (n) => Array.from({ length: n }, (_, i) => n - i),
  "Nearly sorted": (n) => {
    const a = Array.from({ length: n }, (_, i) => i);
    for (let k = 0; k < Math.max(1, n / 20); k++) {
      const i = Math.floor(Math.random() * n), j = Math.floor(Math.random() * n);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  "Many duplicates": (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 5)),
};

const REFERENCE = [
  ["Bubble Sort", "O(n)", "O(n²)", "O(n²)", "O(1)", "Yes"],
  ["Selection Sort", "O(n²)", "O(n²)", "O(n²)", "O(1)", "No"],
  ["Insertion Sort", "O(n)", "O(n²)", "O(n²)", "O(1)", "Yes"],
  ["Merge Sort", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)", "Yes"],
  ["Quick Sort", "O(n log n)", "O(n log n)", "O(n²)", "O(log n)", "No"],
  ["Heap Sort", "O(n log n)", "O(n log n)", "O(n log n)", "O(1)", "No"],
  ["Linear Search", "O(1)", "O(n)", "O(n)", "O(1)", "—"],
  ["Binary Search", "O(1)", "O(log n)", "O(log n)", "O(1)", "—"],
];

export default function ExperimentLab() {
  const [size, setSize] = useState(500);
  const [dataset, setDataset] = useState("Random");
  const [results, setResults] = useState([]);
  const [ran, setRan] = useState("");

  function run() {
    const base = datasets[dataset](size);
    const rows = Object.entries(sorters).map(([name, sorter]) => {
      const copy = [...base];
      const t0 = performance.now();
      const { c, w } = sorter(copy);
      const ms = performance.now() - t0;
      const ok = copy.every((v, i) => i === 0 || copy[i - 1] <= v);
      return { name, c, w, ms, ok };
    });
    setResults(rows);
    setRan(`${dataset}, n = ${size}`);
  }

  const bestC = results.length ? Math.min(...results.map((r) => r.c)) : 0;
  const maxC = results.length ? Math.max(...results.map((r) => r.c)) : 1;

  return (
    <div className="x-page">
      <section className="x-card">
        <h3>Sorting Experiment Lab</h3>
        <p className="x-sub">Run all six sorts on the same input and compare the operation counts.</p>

        <div className="x-row" style={{ marginTop: 0 }}>
          <select value={dataset} onChange={(e) => setDataset(e.target.value)} aria-label="Dataset">
            {Object.keys(datasets).map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} aria-label="Input size">
            {[50, 100, 500, 1000, 2000].map((n) => <option key={n} value={n}>n = {n}</option>)}
          </select>
          <button className="x-btn primary" onClick={run}>Run experiment</button>
        </div>

        {results.length > 0 && (
          <>
            <p className="x-sub" style={{ marginTop: 16 }}>Results for {ran}. Lowest comparison count is highlighted.</p>
            <div className="lab-scroll">
              <table className="lab-table">
                <thead>
                  <tr><th>Algorithm</th><th>Comparisons</th><th>Writes</th><th>Time (ms)</th><th>Sorted?</th><th style={{ width: "22%" }}>Comparisons (relative)</th></tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.name} className={r.c === bestC ? "best" : ""}>
                      <td>{r.name}</td>
                      <td>{r.c.toLocaleString()}</td>
                      <td>{r.w.toLocaleString()}</td>
                      <td>{r.ms.toFixed(2)}</td>
                      <td>{r.ok ? "✓" : "✗"}</td>
                      <td><div className="lab-bar" style={{ width: `${(r.c / maxC) * 100}%` }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section className="x-card">
        <h3>Complexity cheat sheet</h3>
        <div className="lab-scroll">
          <table className="lab-table">
            <thead><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable</th></tr></thead>
            <tbody>
              {REFERENCE.map((row) => (
                <tr key={row[0]}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

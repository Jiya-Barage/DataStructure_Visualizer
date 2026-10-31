import { useEffect, useMemo, useRef, useState } from "react";
import { bfsSteps, dfsSteps, dijkstra } from "./algorithms";
import { formatTime, measure } from "./timing";
import "./Extras.css";

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A connected graph: random spanning tree plus a few extra edges.
function randomEdges(n, seed) {
  const rand = rng(seed);
  const edges = [];
  const key = new Set();
  const add = (a, b) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (a === b || key.has(k)) return;
    key.add(k);
    edges.push({ a, b, w: 1 + Math.floor(rand() * 9) });
  };
  for (let i = 1; i < n; i++) add(i, Math.floor(rand() * i));
  const extra = Math.max(1, Math.floor(n / 2));
  for (let i = 0; i < extra * 3 && edges.length < n - 1 + extra; i++) {
    add(Math.floor(rand() * n), Math.floor(rand() * n));
  }
  return edges;
}

function buildAdj(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const { a, b, w } of edges) {
    adj[a].push({ to: b, w });
    adj[b].push({ to: a, w });
  }
  adj.forEach((list) => list.sort((x, y) => x.to - y.to));
  return adj;
}

const ALGOS = ["BFS", "DFS", "Dijkstra"];

export default function GraphVisualizer() {
  const [n, setN] = useState(7);
  const [seed, setSeed] = useState(7);
  const [zoom, setZoom] = useState(100);
  const [edges, setEdges] = useState(() => randomEdges(7, 7));
  const [algo, setAlgo] = useState("BFS");
  const [start, setStart] = useState(0);
  const [shown, setShown] = useState([]);
  const [pathEdges, setPathEdges] = useState([]);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("Pick an algorithm and press Run.");
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1);
  const [weight, setWeight] = useState(3);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const adj = useMemo(() => buildAdj(n, edges), [n, edges]);

  function regenerate(nextN = n, nextSeed = seed + 1) {
    clearInterval(timer.current);
    setSeed(nextSeed);
    setEdges(randomEdges(nextN, nextSeed));
    setShown([]);
    setPathEdges([]);
    setResult(null);
    setStart(0);
    setFrom(0);
    setTo(Math.min(1, nextN - 1));
    setMessage("New graph generated.");
  }

  function changeSize(value) {
    setN(value);
    regenerate(value, seed);
  }

  function addEdge() {
    const a = Number(from), b = Number(to), w = Number(weight);
    if (a === b) return setMessage("Choose two different vertices.");
    if (edges.some((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))) {
      return setMessage("That edge already exists.");
    }
    if (!Number.isInteger(w) || w < 1) return setMessage("Weight must be a positive whole number.");
    setEdges([...edges, { a, b, w }]);
    setShown([]); setPathEdges([]); setResult(null);
    setMessage(`Added edge ${a} — ${b} (weight ${w}).`);
  }

  function run() {
    clearInterval(timer.current);
    let order;
    let extra = null;
    let fn;
    if (algo === "BFS") { fn = () => bfsSteps(adj, start); order = fn(); }
    else if (algo === "DFS") { fn = () => dfsSteps(adj, start); order = fn(); }
    else { fn = () => dijkstra(adj, start); extra = fn(); order = extra.order; }

    const timing = measure(fn, 8);
    setResult({ algo, order, extra, ns: timing.ns, runs: timing.runs });
    setPathEdges([]);
    setShown([]);

    let i = 0;
    timer.current = setInterval(() => {
      i++;
      setShown(order.slice(0, i));
      if (i >= order.length) {
        clearInterval(timer.current);
        if (extra) {
          const used = [];
          extra.prev.forEach((p, v) => { if (p !== -1) used.push([p, v]); });
          setPathEdges(used);
        }
        setMessage(
          algo === "Dijkstra"
            ? `Shortest paths from ${start} computed.`
            : `${algo} visited ${order.length} of ${n} vertices.`
        );
      }
    }, 650);
    setMessage(`Running ${algo} from vertex ${start}…`);
  }

  const R = 230;
  const cx = 300, cy = 270;
  const pos = (i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
  };
  const nodeR = Math.max(16, 26 - n);
  const current = shown[shown.length - 1];
  const inPath = (a, b) => pathEdges.some(([p, q]) => (p === a && q === b) || (p === b && q === a));
  const V = n, E = edges.length;
  const vertexOptions = Array.from({ length: n }, (_, i) => i);

  return (
    <div className="x-page">
      <section className="x-stats">
        <div className="x-stat"><span>Vertices</span><strong>{V}</strong></div>
        <div className="x-stat"><span>Edges</span><strong>{E}</strong></div>
        <div className="x-stat"><span>Visited</span><strong>{shown.length}</strong></div>
        <div className="x-stat">
          <span>Actual run time</span>
          <strong>{result ? formatTime(result.ns) : "—"}</strong>
          {result && <small>avg of {result.runs.toLocaleString()} runs</small>}
        </div>
      </section>

      <section className="x-card">
        <div className="x-heading">
          <div>
            <h3>Graph Explorer</h3>
            <p className="x-sub">Undirected weighted graph. Resize it with the sliders.</p>
          </div>
          <span className="x-pill">{algo === "Dijkstra" ? `O(V²) ≈ ${V * V} steps` : `O(V+E) = ${V + E} steps`}</span>
        </div>

        <div className="x-sliders">
          <label>
            <span>Number of vertices <b>{n}</b></span>
            <input type="range" min="3" max="14" value={n} onChange={(e) => changeSize(Number(e.target.value))} />
          </label>
          <label>
            <span>Graph size (zoom) <b>{zoom}%</b></span>
            <input type="range" min="60" max="160" step="10" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          </label>
        </div>

        <div className="x-stage graph-stage">
          <svg viewBox="0 0 600 540" style={{ width: `${zoom * 6.4}px`, maxWidth: "none", margin: "0 auto", display: "block" }}>
            {edges.map((e, i) => {
              const p = pos(e.a), q = pos(e.b);
              return (
                <g key={i}>
                  <line className={`graph-edge ${inPath(e.a, e.b) ? "path" : ""}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} />
                  <g transform={`translate(${(p.x + q.x) / 2}, ${(p.y + q.y) / 2})`}>
                    <rect className="graph-wbox" x="-11" y="-9" width="22" height="18" rx="5" />
                    <text className="graph-weight" textAnchor="middle" dominantBaseline="central">{e.w}</text>
                  </g>
                </g>
              );
            })}
            {vertexOptions.map((i) => {
              const p = pos(i);
              const cls = i === current ? "now" : shown.includes(i) ? "seen" : i === start ? "start" : "";
              return (
                <g key={i} className={`graph-node ${cls}`}>
                  <circle cx={p.x} cy={p.y} r={nodeR} />
                  <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central">{i}</text>
                  {result?.extra && shown.includes(i) && (
                    <text className="graph-dist" x={p.x} y={p.y - nodeR - 7} textAnchor="middle">
                      {Number.isFinite(result.extra.dist[i]) ? `d=${result.extra.dist[i]}` : "∞"}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="x-row">
          <select value={algo} onChange={(e) => setAlgo(e.target.value)} aria-label="Algorithm">
            {ALGOS.map((a) => <option key={a}>{a}</option>)}
          </select>
          <select value={start} onChange={(e) => setStart(Number(e.target.value))} aria-label="Start vertex">
            {vertexOptions.map((i) => <option key={i} value={i}>Start at {i}</option>)}
          </select>
          <button className="x-btn primary" onClick={run}>Run</button>
          <button className="x-btn" onClick={() => regenerate()}>New random graph</button>
        </div>

        <div className="x-row">
          <select value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Edge from">
            {vertexOptions.map((i) => <option key={i} value={i}>From {i}</option>)}
          </select>
          <select value={to} onChange={(e) => setTo(e.target.value)} aria-label="Edge to">
            {vertexOptions.map((i) => <option key={i} value={i}>To {i}</option>)}
          </select>
          <input type="number" min="1" value={weight} onChange={(e) => setWeight(e.target.value)} aria-label="Weight" style={{ minWidth: 80, width: 90 }} />
          <button className="x-btn" onClick={addEdge}>Add edge</button>
        </div>

        <div className="x-msg" role="status" aria-live="polite">{message}</div>

        {result && (
          <div className="x-chips">
            <span className="x-chip-label">Visit order</span>
            {result.order.map((v, i) => <span key={i} className="x-chip on">{v}</span>)}
          </div>
        )}
      </section>

      {result?.extra && shown.length === result.order.length && (
        <section className="x-card">
          <h3>Shortest distances from {start}</h3>
          <div className="lab-scroll">
            <table className="lab-table">
              <thead><tr><th>Vertex</th><th>Distance</th><th>Came from</th></tr></thead>
              <tbody>
                {result.extra.dist.map((d, i) => (
                  <tr key={i}><td>{i}</td><td>{Number.isFinite(d) ? d : "unreachable"}</td><td>{result.extra.prev[i] === -1 ? "—" : result.extra.prev[i]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

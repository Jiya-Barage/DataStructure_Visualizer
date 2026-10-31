import { useEffect, useRef, useState } from "react";
import "./Extras.css";

const make = (key) => ({ key, left: null, right: null });

function insert(node, key) {
  if (!node) return make(key);
  if (key < node.key) return { ...node, left: insert(node.left, key) };
  if (key > node.key) return { ...node, right: insert(node.right, key) };
  return node;
}

function minNode(node) {
  while (node.left) node = node.left;
  return node;
}

function remove(node, key) {
  if (!node) return null;
  if (key < node.key) return { ...node, left: remove(node.left, key) };
  if (key > node.key) return { ...node, right: remove(node.right, key) };
  if (!node.left) return node.right;
  if (!node.right) return node.left;
  const successor = minNode(node.right);
  return { ...node, key: successor.key, right: remove(node.right, successor.key) };
}

function has(node, key) {
  while (node) {
    if (key === node.key) return true;
    node = key < node.key ? node.left : node.right;
  }
  return false;
}

function height(node) {
  return node ? 1 + Math.max(height(node.left), height(node.right)) : 0;
}

function searchPath(node, key) {
  const path = [];
  while (node) {
    path.push(node.key);
    if (key === node.key) break;
    node = key < node.key ? node.left : node.right;
  }
  return path;
}

const traversals = {
  Inorder: (n, out = []) => (n && (traversals.Inorder(n.left, out), out.push(n.key), traversals.Inorder(n.right, out)), out),
  Preorder: (n, out = []) => (n && (out.push(n.key), traversals.Preorder(n.left, out), traversals.Preorder(n.right, out)), out),
  Postorder: (n, out = []) => (n && (traversals.Postorder(n.left, out), traversals.Postorder(n.right, out), out.push(n.key)), out),
  "Level order": (root) => {
    const out = [];
    const queue = root ? [root] : [];
    while (queue.length) {
      const n = queue.shift();
      out.push(n.key);
      if (n.left) queue.push(n.left);
      if (n.right) queue.push(n.right);
    }
    return out;
  },
};

function layout(root) {
  const nodes = [];
  const edges = [];
  let counter = 0;
  function walk(node, depth) {
    if (!node) return null;
    const left = walk(node.left, depth + 1);
    const pos = { key: node.key, x: counter++, y: depth };
    const right = walk(node.right, depth + 1);
    nodes.push(pos);
    if (left) edges.push([pos, left]);
    if (right) edges.push([pos, right]);
    return pos;
  }
  walk(root, 0);
  return { nodes, edges, width: counter };
}

const SAMPLE = [50, 30, 70, 20, 40, 60, 80];

export default function TreeVisualizer() {
  const [root, setRoot] = useState(() => SAMPLE.reduce(insert, null));
  const [value, setValue] = useState("");
  const [lit, setLit] = useState([]);
  const [message, setMessage] = useState("Insert values to grow the tree.");
  const [visited, setVisited] = useState([]);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const num = Number(value);
  const valid = value.trim() !== "" && Number.isSafeInteger(num);

  function animate(sequence, label) {
    clearInterval(timer.current);
    setVisited([]);
    let i = 0;
    timer.current = setInterval(() => {
      if (i >= sequence.length) {
        clearInterval(timer.current);
        setLit([]);
        setMessage(`${label}: ${sequence.join(", ") || "(empty)"}`);
        return;
      }
      setLit([sequence[i]]);
      setVisited(sequence.slice(0, i + 1));
      i++;
    }, 600);
  }

  function doInsert() {
    if (!valid) return setMessage("Enter a valid integer.");
    if (has(root, num)) return setMessage(`${num} is already in the tree (BST keys are unique).`);
    setRoot(insert(root, num));
    setLit([num]);
    setMessage(`Inserted ${num}.`);
    setValue("");
  }

  function doDelete() {
    if (!valid) return setMessage("Enter a valid integer.");
    if (!has(root, num)) return setMessage(`${num} is not in the tree.`);
    setRoot(remove(root, num));
    setLit([]);
    setMessage(`Deleted ${num}.`);
    setValue("");
  }

  function doSearch() {
    if (!valid) return setMessage("Enter a valid integer.");
    const path = searchPath(root, num);
    const found = path[path.length - 1] === num;
    animate(path, found ? `Found ${num} via path` : `${num} not found; path taken`);
  }

  const { nodes, edges, width } = layout(root);
  const h = height(root);
  const GAP = 56;
  const LEVEL = 70;
  const W = Math.max(width, 1) * GAP + 40;
  const H = Math.max(h, 1) * LEVEL + 30;
  const px = (n) => n.x * GAP + 40;
  const py = (n) => n.y * LEVEL + 36;

  return (
    <div className="x-page">
      <section className="x-card">
        <h3>Binary Search Tree</h3>
        <p className="x-sub">Smaller keys go left, larger keys go right.</p>

        <div className="x-stage">
          {nodes.length === 0 ? (
            <p>The tree is empty.</p>
          ) : (
            <svg className="tree-svg" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: Math.min(W, 900) }}>
              {edges.map(([a, b]) => (
                <line key={`${a.key}-${b.key}`} className="tree-edge" x1={px(a)} y1={py(a)} x2={px(b)} y2={py(b)} />
              ))}
              {nodes.map((n) => (
                <g key={n.key} className={`tree-node ${lit.includes(n.key) ? "hit" : ""}`}>
                  <circle cx={px(n)} cy={py(n)} r="20" />
                  <text x={px(n)} y={py(n)}>{n.key}</text>
                </g>
              ))}
            </svg>
          )}
        </div>

        <div className="x-row">
          <input
            type="number"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doInsert()}
          />
          <button className="x-btn primary" onClick={doInsert}>Insert</button>
          <button className="x-btn" onClick={doDelete}>Delete</button>
          <button className="x-btn" onClick={doSearch}>Search</button>
          <button className="x-btn" onClick={() => { clearInterval(timer.current); setRoot(SAMPLE.reduce(insert, null)); setLit([]); setVisited([]); setMessage("Tree reset."); }}>Reset</button>
          <button className="x-btn" onClick={() => { clearInterval(timer.current); setRoot(null); setLit([]); setVisited([]); setMessage("Tree cleared."); }}>Clear</button>
        </div>

        <div className="x-row">
          {Object.entries(traversals).map(([name, fn]) => (
            <button key={name} className="x-btn" onClick={() => animate(fn(root), name)}>{name}</button>
          ))}
        </div>

        {visited.length > 0 && (
          <div className="x-chips">
            {visited.map((k, i) => <span key={i} className="x-chip on">{k}</span>)}
          </div>
        )}

        <div className="x-msg" role="status" aria-live="polite">{message}</div>
      </section>

      <section className="x-card">
        <h3>Tree facts</h3>
        <div className="lab-scroll">
          <table className="lab-table">
            <thead><tr><th>Metric</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td>Nodes</td><td>{nodes.length}</td></tr>
              <tr><td>Height</td><td>{h}</td></tr>
              <tr><td>Search / insert / delete</td><td>O(h) — O(log n) balanced, O(n) skewed</td></tr>
              <tr><td>Inorder output is sorted</td><td>Yes</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

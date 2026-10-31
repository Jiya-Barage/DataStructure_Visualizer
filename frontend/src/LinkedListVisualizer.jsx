import { useState } from "react";
import { formatTime, measure } from "./timing";
import "./Extras.css";

const sink = { n: 0 }; // keeps the JIT from discarding the work being timed

function toNodes(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) head = { v: arr[i], next: head };
  return head;
}

function reverseHolder(h) {
  let prev = null;
  let cur = h.head;
  while (cur) { const nx = cur.next; cur.next = prev; prev = cur; cur = nx; }
  h.head = prev;
}

// Average nanoseconds for one real pointer operation on a chain built from `arr`.
// Every operation undoes itself so it can be repeated thousands of times.
function timeNodes(kind, arr, index, target) {
  const h = { head: toNodes(arr) };
  const spare = { v: 0, next: null };
  const walkTo = (steps) => { let c = h.head; for (let k = 0; k < steps && c; k++) c = c.next; return c; };
  const ops = {
    head: () => { const n = { v: 1, next: h.head }; sink.n += n.v; },
    tail: () => { let c = h.head; while (c && c.next) c = c.next; if (c) { c.next = spare; c.next = null; } },
    insertAt: () => { const c = walkTo(Math.max(index - 1, 0)); if (c) { const t = c.next; c.next = spare; c.next = t; } },
    deleteAt: () => { const c = walkTo(Math.max(index - 1, 0)); if (c && c.next) { const t = c.next; c.next = t.next; c.next = t; } },
    search: () => { let c = h.head; while (c && c.v !== target) c = c.next; sink.n += c ? 1 : 0; },
    reverse: () => { reverseHolder(h); reverseHolder(h); },
  };
  const { ns } = measure(ops[kind], 5);
  return kind === "reverse" ? ns / 2 : ns;
}

const DEFAULT_LIST = [10, 20, 30];

export default function LinkedListVisualizer() {
  const [list, setList] = useState(DEFAULT_LIST);
  const [value, setValue] = useState("");
  const [position, setPosition] = useState("");
  const [hit, setHit] = useState(-1);
  const [message, setMessage] = useState("Linked list is ready.");
  const [lastOp, setLastOp] = useState(null);

  const num = Number(value);
  const validValue = value.trim() !== "" && Number.isFinite(num);
  const idx = Number(position);
  const validIndex = (max) =>
    position.trim() !== "" && Number.isInteger(idx) && idx >= 0 && idx <= max;

  function say(text) {
    setMessage(text);
    setHit(-1);
  }

  function record(name, kind, arr, index = 0, target = 0) {
    setLastOp({ name, ns: timeNodes(kind, arr, index, target), nodes: arr.length });
  }

  function insertBeginning() {
    if (!validValue) return say("Enter a valid number first.");
    setList([num, ...list]);
    say(`Inserted ${num} at the head (O(1)).`);
    record("Insert head", "head", list);
    setValue("");
  }

  function insertEnd() {
    if (!validValue) return say("Enter a valid number first.");
    setList([...list, num]);
    say(`Inserted ${num} at the tail after traversing ${list.length} node(s).`);
    record("Insert tail", "tail", list);
    setValue("");
  }

  function insertAt() {
    if (!validValue) return say("Enter a valid number first.");
    if (!validIndex(list.length)) return say(`Index must be between 0 and ${list.length}.`);
    const copy = [...list];
    copy.splice(idx, 0, num);
    setList(copy);
    say(`Inserted ${num} at index ${idx}.`);
    record("Insert at index", "insertAt", list, idx);
    setValue("");
    setPosition("");
  }

  function deleteAt() {
    if (!validIndex(list.length - 1)) return say(`Enter an index between 0 and ${list.length - 1}.`);
    const copy = [...list];
    const [removed] = copy.splice(idx, 1);
    setList(copy);
    say(`Deleted ${removed} from index ${idx}.`);
    record("Delete at index", "deleteAt", list, idx);
    setPosition("");
  }

  function search() {
    if (!validValue) return say("Enter a number to search for.");
    const found = list.indexOf(num);
    record("Search", "search", list, 0, num);
    if (found === -1) {
      say(`${num} not found after checking ${list.length} node(s).`);
    } else {
      setHit(found);
      setMessage(`${num} found at index ${found} after ${found + 1} comparison(s).`);
    }
  }

  function reverse() {
    setList([...list].reverse());
    say("List reversed by re-pointing every next link.");
    record("Reverse", "reverse", list);
  }

  return (
    <div className="x-page">
      <section className="x-stats">
        <div className="x-stat"><span>Nodes</span><strong>{list.length}</strong></div>
        <div className="x-stat"><span>Last operation</span><strong>{lastOp ? lastOp.name : "—"}</strong></div>
        <div className="x-stat">
          <span>Actual time</span>
          <strong>{lastOp ? formatTime(lastOp.ns) : "—"}</strong>
          {lastOp && <small>on {lastOp.nodes} node{lastOp.nodes === 1 ? "" : "s"}, measured average</small>}
        </div>
        <div className="x-stat"><span>Memory</span><strong>O(n)</strong><small>one node per value</small></div>
      </section>

      <section className="x-card">
        <h3>Singly Linked List</h3>
        <p className="x-sub">Each node stores a value and a pointer to the next node.</p>

        <div className="x-stage">
          {list.length === 0 ? (
            <p>HEAD → NULL (empty list)</p>
          ) : (
            <div className="ll-chain">
              <span className="ll-tag">HEAD</span>
              {list.map((node, i) => (
                <div key={i} style={{ display: "contents" }}>
                  <div className={`ll-node ${hit === i ? "hit" : ""}`}>
                    <div className="ll-val">
                      {node}
                      <small>idx {i}</small>
                    </div>
                    <div className="ll-ptr">next</div>
                  </div>
                  <span className="ll-arrow">→</span>
                </div>
              ))}
              <span className="ll-tag">NULL</span>
            </div>
          )}
        </div>

        <div className="x-row">
          <input type="number" placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} />
          <input type="number" placeholder="Index" value={position} onChange={(e) => setPosition(e.target.value)} />
        </div>
        <div className="x-row">
          <button className="x-btn primary" onClick={insertBeginning}>Insert head</button>
          <button className="x-btn primary" onClick={insertEnd}>Insert tail</button>
          <button className="x-btn" onClick={insertAt}>Insert at index</button>
          <button className="x-btn" onClick={deleteAt}>Delete at index</button>
          <button className="x-btn" onClick={search}>Search value</button>
          <button className="x-btn" onClick={reverse}>Reverse</button>
          <button className="x-btn" onClick={() => { setList([]); say("List cleared."); }}>Clear</button>
          <button className="x-btn" onClick={() => { setList(DEFAULT_LIST); say("List reset."); }}>Reset</button>
        </div>

        <div className="x-msg" role="status" aria-live="polite">{message}</div>
      </section>

      <section className="x-card">
        <h3>Complexity</h3>
        <div className="lab-scroll">
          <table className="lab-table">
            <thead><tr><th>Operation</th><th>Time</th></tr></thead>
            <tbody>
              <tr><td>Insert at head</td><td>O(1)</td></tr>
              <tr><td>Insert at tail (no tail pointer)</td><td>O(n)</td></tr>
              <tr><td>Delete / insert at index</td><td>O(n)</td></tr>
              <tr><td>Search</td><td>O(n)</td></tr>
              <tr><td>Reverse</td><td>O(n)</td></tr>
              <tr><td>Space</td><td>O(n)</td></tr>
            </tbody>
          </table>
        </div>
        <p className="x-sub" style={{ marginTop: 12 }}>Nodes now: {list.length}</p>
      </section>
    </div>
  );
}

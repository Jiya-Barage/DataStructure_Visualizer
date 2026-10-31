import { useState } from "react";
import "./Extras.css";

const DEFAULT_LIST = [10, 20, 30];

export default function LinkedListVisualizer() {
  const [list, setList] = useState(DEFAULT_LIST);
  const [value, setValue] = useState("");
  const [position, setPosition] = useState("");
  const [hit, setHit] = useState(-1);
  const [message, setMessage] = useState("Linked list is ready.");

  const num = Number(value);
  const validValue = value.trim() !== "" && Number.isFinite(num);
  const idx = Number(position);
  const validIndex = (max) =>
    position.trim() !== "" && Number.isInteger(idx) && idx >= 0 && idx <= max;

  function say(text) {
    setMessage(text);
    setHit(-1);
  }

  function insertBeginning() {
    if (!validValue) return say("Enter a valid number first.");
    setList([num, ...list]);
    say(`Inserted ${num} at the head (O(1)).`);
    setValue("");
  }

  function insertEnd() {
    if (!validValue) return say("Enter a valid number first.");
    setList([...list, num]);
    say(`Inserted ${num} at the tail after traversing ${list.length} node(s).`);
    setValue("");
  }

  function insertAt() {
    if (!validValue) return say("Enter a valid number first.");
    if (!validIndex(list.length)) return say(`Index must be between 0 and ${list.length}.`);
    const copy = [...list];
    copy.splice(idx, 0, num);
    setList(copy);
    say(`Inserted ${num} at index ${idx}.`);
    setValue("");
    setPosition("");
  }

  function deleteAt() {
    if (!validIndex(list.length - 1)) return say(`Enter an index between 0 and ${list.length - 1}.`);
    const copy = [...list];
    const [removed] = copy.splice(idx, 1);
    setList(copy);
    say(`Deleted ${removed} from index ${idx}.`);
    setPosition("");
  }

  function search() {
    if (!validValue) return say("Enter a number to search for.");
    const found = list.indexOf(num);
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
  }

  return (
    <div className="x-page">
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


import { useState } from "react";

export default function LinkedListVisualizer() {
  const [list, setList] = useState([10, 20, 30]);
  const [value, setValue] = useState("");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("Linked List is ready!");

  function insertEnd() {
    if (value.trim() === "" || !Number.isFinite(Number(value))) {
      setMessage("Enter a valid number.");
      return;
    }

    setList([...list, Number(value)]);
    setMessage(`${value} inserted at the end.`);
    setValue("");
  }

  function insertBeginning() {
    if (value.trim() === "" || !Number.isFinite(Number(value))) {
      setMessage("Enter a valid number.");
      return;
    }

    setList([Number(value), ...list]);
    setMessage(`${value} inserted at the beginning.`);
    setValue("");
  }

  function deleteNode() {
    const index = Number(position);

    if (position.trim() === "" || !Number.isInteger(index) ||
        index < 0 || index >= list.length) {
      setMessage("Enter a valid index.");
      return;
    }

    const updated = [...list];
    const removed = updated.splice(index, 1)[0];
    setList(updated);
    setMessage(`${removed} deleted from index ${index}.`);
    setPosition("");
  }

  function searchNode() {
    if (value.trim() === "" || !Number.isFinite(Number(value))) {
      setMessage("Enter a number to search.");
      return;
    }

    const index = list.indexOf(Number(value));

    setMessage(
      index === -1
        ? `${value} was not found.`
        : `${value} found at index ${index}.`
    );
  }

  return (
    <section style={{ padding: "24px", borderRadius: "16px" }}>
      <h2>Linked List Visualizer</h2>
      <p>Explore nodes, links, insertion, deletion and searching.</p>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="number"
          placeholder="Enter value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={insertBeginning}>Insert Beginning</button>
        <button onClick={insertEnd}>Insert End</button>
        <button onClick={searchNode}>Search</button>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap",
                    alignItems: "center", margin: "28px 0" }}>
        {list.map((node, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center",
                                    gap: "12px" }}>
            <div style={{
              border: "2px solid #38bdf8",
              borderRadius: "10px",
              padding: "16px 22px",
              minWidth: "45px",
              textAlign: "center",
              background: "#0f172a",
              color: "#ffffff",
              fontWeight: "bold"
            }}>
              {node}
              <div style={{ fontSize: "11px", color: "#7dd3fc" }}>
                Index {index}
              </div>
            </div>
            {index < list.length - 1 && <span>⟶</span>}
          </div>
        ))}
        <span>⟶ NULL</span>
      </div>

      {list.length === 0 && <p>Head → NULL (empty list)</p>}

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="number"
          placeholder="Index to delete"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <button onClick={deleteNode}>Delete at Index</button>
        <button onClick={() => {
          setList([]);
          setMessage("Linked List cleared.");
        }}>
          Clear List
        </button>
        <button onClick={() => {
          setList([10, 20, 30]);
          setMessage("List reset to default.");
        }}>
          Reset
        </button>
      </div>

      <p style={{ marginTop: "20px" }}>{message}</p>
      <p>Total nodes: {list.length}</p>
    </section>
  );
}

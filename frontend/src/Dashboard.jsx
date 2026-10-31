import { useState } from "react";
import { plainSorters, linearSearch, binarySearch } from "./algorithms";
import { formatTime, measure, measureNet } from "./timing";
import "./Extras.css";

const SORTS = [
  ["Bubble Sort", "Swaps neighbouring items that are out of order until none are left.", "O(n)", "O(n²)", "O(n²)", "O(1)", "Yes"],
  ["Selection Sort", "Finds the smallest remaining item and places it next in line.", "O(n²)", "O(n²)", "O(n²)", "O(1)", "No"],
  ["Insertion Sort", "Grows a sorted section by inserting each new item into its place.", "O(n)", "O(n²)", "O(n²)", "O(1)", "Yes"],
  ["Merge Sort", "Splits the array in half, sorts each half, then merges them.", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)", "Yes"],
  ["Quick Sort", "Partitions around a pivot, then sorts each side recursively.", "O(n log n)", "O(n log n)", "O(n²)", "O(log n)", "No"],
  ["Heap Sort", "Builds a max-heap, then repeatedly moves the largest item to the end.", "O(n log n)", "O(n log n)", "O(n log n)", "O(1)", "No"],
];

const TOPIC_CARDS = [
  { key: "Stack", title: "Stack", text: "Last In, First Out. Push, pop and peek with live timing.", tag: "Linear" },
  { key: "Queue", title: "Queue", text: "First In, First Out. Enqueue at the rear, dequeue from the front.", tag: "Linear" },
  { key: "Linked List", title: "Linked List", text: "Nodes joined by pointers. Insert, delete, search and reverse.", tag: "Linear" },
  { key: "Trees", title: "Binary Search Tree", text: "Insert, delete and search, with animated traversals.", tag: "Non-linear" },
  { key: "Graph", title: "Graphs", text: "BFS, DFS and Dijkstra on a graph you can resize.", tag: "Non-linear" },
  { key: "Sorting", title: "Sorting", text: "Step through Bubble, Selection, Insertion and Merge Sort.", tag: "Algorithm" },
  { key: "Searching", title: "Searching", text: "Linear vs binary search, plus a large-array benchmark.", tag: "Algorithm" },
  { key: "Experiment Lab", title: "Experiment Lab", text: "Compare six sorts on five kinds of input data.", tag: "Analysis" },
  { key: "Quiz", title: "Quiz & Test", text: "Practice or timed tests at Easy, Medium and Hard levels.", tag: "Learn" },
];

export default function Dashboard({ onOpen }) {
  const [bench, setBench] = useState(null);

  function runBench() {
    const big = Array.from({ length: 100000 }, (_, i) => i * 2);
    const target = big[big.length - 1];
    const lin = measure(() => linearSearch(big, target), 15);
    const bin = measure(() => binarySearch(big, target), 15);

    const base = Array.from({ length: 2000 }, () => Math.floor(Math.random() * 100000));
    const copy = () => base.slice();
    const merge = measureNet(() => plainSorters["Merge Sort"](copy()), copy, 20);
    const bubble = measureNet(() => plainSorters["Bubble Sort"](copy()), copy, 20);
    setBench({ lin, bin, merge, bubble });
  }

  return (
    <div className="x-page">
      <section className="hero">
        <div>
          <p className="x-kicker">DSA STUDIO · DATA STRUCTURE-II PROJECT</p>
          <h3>See how data structures and algorithms really behave.</h3>
          <p>
            DSA Studio is a hands-on lab for learning. Watch each operation happen step by step,
            compare algorithms using real measured run times, and test yourself with quizzes.
            It pairs a from-scratch C++ toolkit with this interactive web visualizer.
          </p>
          <div className="x-row">
            <button className="x-btn primary" onClick={() => onOpen("Sorting")}>Start with sorting</button>
            <button className="x-btn" onClick={() => onOpen("Quiz")}>Take a quiz</button>
          </div>
        </div>
        <div className="hero-facts">
          <div><strong>11</strong><span>data structures in the C++ toolkit</span></div>
          <div><strong>8</strong><span>sorting and searching algorithms</span></div>
          <div><strong>3</strong><span>graph algorithms</span></div>
          <div><strong>3</strong><span>quiz levels</span></div>
        </div>
      </section>

      <section>
        <h3 className="x-section">Explore</h3>
        <div className="topic-grid">
          {TOPIC_CARDS.map((c) => (
            <button key={c.key} className="topic-card" onClick={() => onOpen(c.key)}>
              <span className="topic-tag">{c.tag}</span>
              <strong>{c.title}</strong>
              <span>{c.text}</span>
              <em>Open →</em>
            </button>
          ))}
        </div>
      </section>

      <section className="x-card">
        <h3>How it works</h3>
        <div className="steps3">
          <div><b>1 · Pick a topic</b><p>Choose any structure or algorithm from the sidebar.</p></div>
          <div><b>2 · Interact</b><p>Add values, press play or step through, and watch every change.</p></div>
          <div><b>3 · Read the numbers</b><p>Each page shows comparisons and the actual time the code took, in ns, µs or ms.</p></div>
        </div>
      </section>

      <section className="x-card">
        <div className="x-heading">
          <div>
            <h3>Live benchmark</h3>
            <p className="x-sub">Measured in your browser right now, so the numbers are real and change from machine to machine.</p>
          </div>
          <button className="x-btn primary" onClick={runBench}>Run benchmark</button>
        </div>
        {bench ? (
          <div className="x-stats" style={{ marginTop: 6 }}>
            <div className="x-stat"><span>Linear search · 100,000 items</span><strong>{formatTime(bench.lin.ns)}</strong></div>
            <div className="x-stat"><span>Binary search · 100,000 items</span><strong>{formatTime(bench.bin.ns)}</strong></div>
            <div className="x-stat"><span>Bubble sort · 2,000 items</span><strong>{formatTime(bench.bubble.ns)}</strong></div>
            <div className="x-stat"><span>Merge sort · 2,000 items</span><strong>{formatTime(bench.merge.ns)}</strong></div>
          </div>
        ) : (
          <p className="x-sub" style={{ margin: 0 }}>Press the button to compare linear and binary search, and bubble and merge sort.</p>
        )}
      </section>

      <section className="x-card">
        <h3>Sorting algorithms at a glance</h3>
        <div className="lab-scroll">
          <table className="lab-table">
            <thead><tr><th>Algorithm</th><th style={{ textAlign: "left" }}>Idea</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable</th></tr></thead>
            <tbody>
              {SORTS.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td><td style={{ textAlign: "left", maxWidth: 320 }}>{r[1]}</td>
                  {r.slice(2).map((c, i) => <td key={i}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="two-col">
        <section className="x-card">
          <h3>Searching</h3>
          <dl className="info-list">
            <dt>Linear search</dt>
            <dd>Checks items one by one from the start. Works on any list. Worst case O(n).</dd>
            <dt>Binary search</dt>
            <dd>Compares with the middle of a sorted array and discards half each step. Worst case O(log n), so a million items need about 20 steps.</dd>
          </dl>
        </section>
        <section className="x-card">
          <h3>Graphs</h3>
          <dl className="info-list">
            <dt>BFS</dt>
            <dd>Visits vertices level by level using a queue. Finds the fewest-edge path. O(V+E).</dd>
            <dt>DFS</dt>
            <dd>Goes as deep as possible, then backtracks, using a stack or recursion. O(V+E).</dd>
            <dt>Dijkstra</dt>
            <dd>Finds the shortest weighted paths from one source when no edge is negative.</dd>
          </dl>
        </section>
      </div>

      <div className="two-col">
        <section className="x-card">
          <h3>Linear structures</h3>
          <dl className="info-list">
            <dt>Stack · Queue</dt>
            <dd>LIFO and FIFO access. Constant-time push, pop, enqueue and dequeue.</dd>
            <dt>Linked list</dt>
            <dd>Flexible size and O(1) insert at the head, but reaching a position costs O(n).</dd>
            <dt>Circular queue · Deque</dt>
            <dd>Included in the C++ toolkit. They reuse space and allow insertion at both ends.</dd>
          </dl>
        </section>
        <section className="x-card">
          <h3>Trees, heaps and hashing</h3>
          <dl className="info-list">
            <dt>BST · AVL</dt>
            <dd>Ordered trees. A BST costs O(h), and an AVL tree rotates to keep height near log n.</dd>
            <dt>Heap</dt>
            <dd>A complete tree stored in an array, with the largest (or smallest) key at the root. Powers heap sort.</dd>
            <dt>Hash table</dt>
            <dd>Maps keys to buckets for average O(1) lookup. The C++ version resolves collisions by chaining.</dd>
          </dl>
        </section>
      </div>
    </div>
  );
}

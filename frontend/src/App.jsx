
import { useEffect, useState } from "react";
import SortingVisualizer from "./SortingVisualizer";
import SearchingVisualizer from "./SearchingVisualizer";
import LinkedListVisualizer from "./LinkedListVisualizer";
import TreeVisualizer from "./TreeVisualizer";
import ExperimentLab from "./ExperimentLab";
import GraphVisualizer from "./GraphVisualizer";
import QuizLab from "./QuizLab";
import Dashboard from "./Dashboard";
import { formatTime, measure } from "./timing";
import "./Extras.css";
import "./Polish.css";
import "./App.css";

function App() {
  const [activeStructure, setActiveStructure] = useState("Dashboard");
  const [stack, setStack] = useState([10, 20, 30]);
  const [queue, setQueue] = useState([10, 20, 30]);
  const [input, setInput] = useState("40");
  const [operations, setOperations] = useState(0);
  const [lastOp, setLastOp] = useState(null);
  const [notice, setNotice] = useState("Choose an operation to begin.");
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("dsa-theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });
  const [activity, setActivity] = useState([
    "Stack initialized with 10, 20, 30",
  ]);

  useEffect(() => {
    try {
      localStorage.setItem("dsa-theme", theme);
    } catch {
      /* storage unavailable: ignore */
    }
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const PAGES = {
    Sorting: { title: "Sorting Visualizer", view: <SortingVisualizer /> },
    Searching: { title: "Searching Visualizer", view: <SearchingVisualizer /> },
    "Linked List": { title: "Linked List Visualizer", view: <LinkedListVisualizer /> },
    Trees: { title: "Binary Search Tree", view: <TreeVisualizer /> },
    Graph: { title: "Graph Explorer", view: <GraphVisualizer /> },
    Quiz: { title: "Quiz & Test", view: <QuizLab /> },
    Dashboard: { title: "Dashboard", view: <Dashboard onOpen={switchStructure} /> },
    "Experiment Lab": { title: "Experiment Lab & Complexity", view: <ExperimentLab /> },
  };
  const page = PAGES[activeStructure];
  const isSorting = Boolean(page);
  const isStack = activeStructure === "Stack";
  const values = isStack ? stack : queue;


  // Average time of one operation, measured on a throw-away copy so the demo state is untouched.
  function timeOp(kind) {
    const copy = values.slice();
    let ns;
    if (isStack) {
      if (kind === "peek") ns = measure(() => copy[copy.length - 1], 4).ns;
      else ns = measure(() => { copy.push(7); copy.pop(); }, 4).ns / 2;
    } else {
      // queue modelled with head/tail indices so enqueue and dequeue are O(1)
      const buf = new Array(256).fill(0);
      let head = 0;
      let tail = copy.length;
      if (kind === "peek") ns = measure(() => buf[head & 255], 4).ns;
      else ns = measure(() => { buf[tail & 255] = 7; tail++; head++; }, 4).ns / 2;
    }
    return ns;
  }

  function recordOp(name, kind) {
    setLastOp({ name, ns: timeOp(kind) });
  }

  function log(message) {
    setActivity((previous) => [message, ...previous].slice(0, 6));
    setNotice(message);
  }

  function switchStructure(name) {
    setActiveStructure(name);
    setInput("40");
    setLastOp(null);
    setNotice(`${name} selected.`);
  }

  function addValue() {
    const number = Number(input);

    if (input.trim() === "" || !Number.isSafeInteger(number)) {
      setNotice("Please enter a valid integer.");
      return;
    }

    if (values.length >= 100) {
      setNotice(`${activeStructure} is full.`);
      return;
    }

    if (isStack) {
      setStack((previous) => [...previous, number]);
      log(`Pushed ${number} onto the stack.`);
      recordOp("Push", "update");
    } else {
      setQueue((previous) => [...previous, number]);
      log(`Enqueued ${number} at the rear.`);
      recordOp("Enqueue", "update");
    }

    setOperations((previous) => previous + 1);
  }

  function removeValue() {
    if (values.length === 0) {
      setNotice(`${activeStructure} is empty.`);
      return;
    }

    const removed = isStack
      ? stack[stack.length - 1]
      : queue[0];

    if (isStack) {
      setStack((previous) => previous.slice(0, -1));
      log(`Popped ${removed} from the stack.`);
      recordOp("Pop", "update");
    } else {
      setQueue((previous) => previous.slice(1));
      log(`Dequeued ${removed} from the front.`);
      recordOp("Dequeue", "update");
    }

    setOperations((previous) => previous + 1);
  }

  function peekValue() {
    if (values.length === 0) {
      setNotice(`${activeStructure} is empty.`);
      return;
    }

    const value = isStack
      ? stack[stack.length - 1]
      : queue[0];

    log(`${isStack ? "Top" : "Front"} element: ${value}`);
    recordOp("Peek", "peek");
  }

  function resetStructure() {
    if (isStack) {
      setStack([10, 20, 30]);
    } else {
      setQueue([10, 20, 30]);
    }

    setOperations(0);
    setLastOp(null);
    setActivity([`${activeStructure} reset to sample values.`]);
    setNotice("Structure reset successfully.");
  }

  const visibleValues = isStack ? [...values].reverse() : values;

  return (
    <div className={`app-shell ${theme === "light" ? "light-theme" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">D</div>
          <div>
            <h1>DSA Studio</h1>
            <p>Toolkit &amp; Visualizer</p>
          </div>
        </div>

        <button
          className={`nav-item ${activeStructure === "Dashboard" ? "active" : ""}`}
          onClick={() => switchStructure("Dashboard")}
        >
          <span>⌂</span> Dashboard
        </button>

        <div className="nav-label">PLAYGROUND</div>

        <button
          className={`nav-item ${isStack ? "active" : ""}`}
          onClick={() => switchStructure("Stack")}
        >
          <span>▤</span> Stack
        </button>

        <button
          className={`nav-item ${
            activeStructure === "Queue" ? "active" : ""
          }`}
          onClick={() => switchStructure("Queue")}
        >
          <span>⇥</span> Queue
        </button>

        <div className="nav-label">ALGORITHMS</div>
        {[
          ["Sorting", "▥", "Sorting Visualizer"],
          ["Searching", "⌕", "Searching Visualizer"],
        ].map(([key, icon, label]) => (
          <button
            key={key}
            className={`nav-item ${activeStructure === key ? "active" : ""}`}
            onClick={() => switchStructure(key)}
          >
            <span>{icon}</span> {label}
          </button>
        ))}

        <div className="nav-label">MORE STRUCTURES</div>
        {[
          ["Linked List", "⟶", "Linked List"],
          ["Trees", "⑂", "Binary Search Tree"],
          ["Graph", "◎", "Graphs"],
        ].map(([key, icon, label]) => (
          <button
            key={key}
            className={`nav-item ${activeStructure === key ? "active" : ""}`}
            onClick={() => switchStructure(key)}
          >
            <span>{icon}</span> {label}
          </button>
        ))}

        <div className="nav-label">ANALYSIS</div>
        <button
          className={`nav-item ${activeStructure === "Experiment Lab" ? "active" : ""}`}
          onClick={() => switchStructure("Experiment Lab")}
        >
          <span>⚗</span> Experiment Lab
        </button>

        <div className="nav-label">LEARN</div>
        <button
          className={`nav-item ${activeStructure === "Quiz" ? "active" : ""}`}
          onClick={() => switchStructure("Quiz")}
        >
          <span>✎</span> Quiz &amp; Test
        </button>

        <div className="sidebar-footer">
          <span className="status-dot" />
          <span>Interactive web edition</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">LEARN BY DOING</p>
            <h2>{page ? page.title : "Structure Playground"}</h2>
          </div>

          <div className="topbar-actions">
            <button
              className="theme-toggle"
              onClick={() =>
                setTheme((current) =>
                  current === "dark" ? "light" : "dark"
                )
              }
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}
              aria-pressed={theme === "light"}
            >
              {theme === "dark" ? "☀ Light mode" : "☾ Dark mode"}
            </button>
          </div>
        </header>

        {isSorting ? (
          page.view
        ) : (
          <>
            <section className="welcome">
              <div>
                <p className="welcome-kicker">YOUR DATA STRUCTURE LAB</p>
                <h3>Make every operation visible.</h3>
                <p>
                  Explore how data moves, changes, and behaves with each
                  operation.
                </p>
              </div>
              <div className="welcome-symbol" aria-hidden="true">⌘</div>
            </section>

            <section className="stats-grid">
              <StatCard
                label="ACTIVE STRUCTURE"
                value={activeStructure}
                detail="Current playground"
              />
              <StatCard
                label="CURRENT ELEMENTS"
                value={values.length}
                detail="Stored values"
              />
              <StatCard
                label="LAST OPERATION TIME"
                value={lastOp ? formatTime(lastOp.ns) : "—"}
                detail={lastOp ? `${lastOp.name}, measured average` : "Run an operation"}
              />
              <StatCard
                label="OPERATIONS"
                value={operations}
                detail="Successful changes"
              />
            </section>

            <div className="content-grid">
              <section className="panel visualization-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">LIVE VIEW</p>
                    <h3>{activeStructure} Visualization</h3>
                  </div>
                  <span className="complexity-pill">
                    {isStack ? "LIFO" : "FIFO"}
                  </span>
                </div>

                <div className="visual-stage">
                  {values.length === 0 ? (
                    <div className="empty-state">
                      <span>○</span>
                      <p>Your {activeStructure.toLowerCase()} is empty.</p>
                      <small>Add a value to get started.</small>
                    </div>
                  ) : isStack ? (
                    <div className="stack-visual">
                      {visibleValues.map((value, index) => (
                        <div className="stack-row" key={index}>
                          <span className="element-label">
                            {index === 0 ? "TOP →" : ""}
                          </span>
                          <div
                            className={`data-block ${
                              index === 0 ? "highlight" : ""
                            }`}
                          >
                            {value}
                          </div>
                        </div>
                      ))}
                      <div className="structure-base">STACK BASE</div>
                    </div>
                  ) : (
                    <div className="queue-visual">
                      <div className="queue-end-labels">
                        <span>FRONT</span>
                        <span>REAR</span>
                      </div>
                      <div className="queue-track">
                        {values.map((value, index) => (
                          <div
                            className={`queue-block ${
                              index === 0 ? "highlight" : ""
                            }`}
                            key={index}
                          >
                            {value}
                          </div>
                        ))}
                      </div>
                      <p className="visual-hint">
                        Items leave from the front and enter at the rear.
                      </p>
                    </div>
                  )}
                </div>

                <div className="controls">
                  <label htmlFor="valueInput">Value</label>
                  <input
                    id="valueInput"
                    type="number"
                    step="1"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") addValue();
                    }}
                    placeholder="Enter an integer"
                  />

                  <button className="primary-btn" onClick={addValue}>
                    {isStack ? "+ Push" : "+ Enqueue"}
                  </button>

                  <button className="secondary-btn" onClick={removeValue}>
                    {isStack ? "− Pop" : "− Dequeue"}
                  </button>

                  <button className="secondary-btn" onClick={peekValue}>
                    Peek
                  </button>

                  <button className="reset-btn" onClick={resetStructure}>
                    Reset
                  </button>
                </div>

                <div className="notice" role="status" aria-live="polite">
                  <span className="notice-dot" />
                  {notice}
                </div>
              </section>

              <aside className="panel activity-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">SESSION</p>
                    <h3>Activity Log</h3>
                  </div>
                  <span className="live-label">LIVE</span>
                </div>

                <div className="activity-list">
                  {activity.map((message, index) => (
                    <div
                      className="activity-entry"
                      key={`${message}-${index}`}
                    >
                      <div className="activity-line">
                        <span className="activity-dot" />
                      </div>
                      <p>{message}</p>
                    </div>
                  ))}
                </div>

                <div className="concept-card">
                  <p className="eyebrow">CORE CONCEPT</p>
                  <h4>
                    {isStack ? "Last In, First Out" : "First In, First Out"}
                  </h4>
                  <p>
                    {isStack
                      ? "A stack removes the most recently added element first."
                      : "A queue removes the earliest added element first."}
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}

        <footer className="page-footer">
          <span>DSA Toolkit &amp; Visualizer</span>
          <span>C++ core + React visualizer · Group 15</span>
        </footer>
      </main>
    </div>
  );
}

function StatCard({ label, value, detail }) {
  return (
    <div className="stat-card">
      <p>{label}</p>
      <h3>{value}</h3>
      <span>{detail}</span>
    </div>
  );
}

export default App;

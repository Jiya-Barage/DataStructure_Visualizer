
import { useState } from "react";
import SortingVisualizer from "./SortingVisualizer";
import "./App.css";

function App() {
  const [activeStructure, setActiveStructure] = useState("Stack");
  const [stack, setStack] = useState([10, 20, 30]);
  const [queue, setQueue] = useState([10, 20, 30]);
  const [input, setInput] = useState("40");
  const [operations, setOperations] = useState(0);
  const [notice, setNotice] = useState("Choose an operation to begin.");
  const [theme, setTheme] = useState("dark");
  const [activity, setActivity] = useState([
    "Stack initialized with 10, 20, 30",
  ]);

  const isSorting = activeStructure === "Sorting";
  const isStack = activeStructure === "Stack";
  const values = isStack ? stack : queue;

  function log(message) {
    setActivity((previous) => [message, ...previous].slice(0, 6));
    setNotice(message);
  }

  function switchStructure(name) {
    setActiveStructure(name);
    setInput("40");
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
    } else {
      setQueue((previous) => [...previous, number]);
      log(`Enqueued ${number} at the rear.`);
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
    } else {
      setQueue((previous) => previous.slice(1));
      log(`Dequeued ${removed} from the front.`);
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
  }

  function resetStructure() {
    if (isStack) {
      setStack([10, 20, 30]);
    } else {
      setQueue([10, 20, 30]);
    }

    setOperations(0);
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

        <button
          className={`nav-item ${isSorting ? "active" : ""}`}
          onClick={() => switchStructure("Sorting")}
        >
          <span>▥</span> Sorting Visualizer
        </button>

        <div className="nav-label">COMING NEXT</div>
        <div className="upcoming-item">Linked List</div>
        <div className="upcoming-item">Trees &amp; Graphs</div>
        <div className="upcoming-item">Experiment Lab</div>
        <div className="upcoming-item">Complexity Analysis</div>

        <div className="sidebar-footer">
          <span className="status-dot" />
          <span>Interactive preview</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">LEARN BY DOING</p>
            <h2>{isSorting ? "Sorting Visualizer" : "Structure Playground"}</h2>
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

            <div className="version-pill">WEB PREVIEW · V1</div>
          </div>
        </header>

        {isSorting ? (
          <SortingVisualizer />
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
                label="MAX CAPACITY"
                value="100"
                detail="Fixed-size model"
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
          <span>Built step by step · C++ integration comes later</span>
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

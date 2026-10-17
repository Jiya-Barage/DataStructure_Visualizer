
import { useEffect, useMemo, useState } from "react";
import "./SortingVisualizer.css";

const STARTING_ARRAY = [64, 34, 25, 12, 22, 11, 90];

function buildBubbleSortFrames(input) {
  const array = [...input];
  const frames = [{
    array: [...array],
    left: -1,
    right: -1,
    comparisons: 0,
    swaps: 0,
    sortedCount: 0,
    message: "Ready! Press Play or Step to begin.",
  }];

  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      comparisons++;

      frames.push({
        array: [...array],
        left: j,
        right: j + 1,
        comparisons,
        swaps,
        sortedCount: i,
        message: `Compare ${array[j]} and ${array[j + 1]}.`,
      });

      if (array[j] > array[j + 1]) {
        const first = array[j];
        array[j] = array[j + 1];
        array[j + 1] = first;
        swaps++;

        frames.push({
          array: [...array],
          left: j,
          right: j + 1,
          comparisons,
          swaps,
          sortedCount: i,
          message: `Swap ${array[j]} and ${array[j + 1]}.`,
        });
      }
    }
  }

  frames.push({
    array: [...array],
    left: -1,
    right: -1,
    comparisons,
    swaps,
    sortedCount: array.length,
    message: "Sorting complete! The array is now in ascending order.",
  });

  return frames;
}

function SortingVisualizer() {
  const [inputArray, setInputArray] = useState(STARTING_ARRAY);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [customInput, setCustomInput] = useState(
    STARTING_ARRAY.join(", ")
  );
  const [error, setError] = useState("");

  const frames = useMemo(
    () => buildBubbleSortFrames(inputArray),
    [inputArray]
  );

  const frame = frames[currentFrame] ?? frames[0];
  const isComplete = currentFrame === frames.length - 1;

  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = window.setInterval(() => {
      setCurrentFrame((current) =>
        Math.min(current + 1, frames.length - 1)
      );
    }, speed);

    return () => window.clearInterval(timer);
  }, [isPlaying, speed, frames.length]);

  useEffect(() => {
    if (isComplete) {
      setIsPlaying(false);
    }
  }, [isComplete]);

  function play() {
    if (isComplete) {
      setCurrentFrame(0);
    }

    setIsPlaying(true);
  }

  function pause() {
    setIsPlaying(false);
  }

  function stepForward() {
    setIsPlaying(false);
    setCurrentFrame((current) =>
      Math.min(current + 1, frames.length - 1)
    );
  }

  function reset() {
    setIsPlaying(false);
    setCurrentFrame(0);
    setError("");
  }

  function loadArray(event) {
    event.preventDefault();
    setIsPlaying(false);

    const parts = customInput
      .split(",")
      .map((item) => item.trim());

    if (
      parts.length < 2 ||
      parts.length > 20 ||
      parts.some((item) => item === "" || !/^-?\d+$/.test(item))
    ) {
      setError("Enter 2–20 integers separated by commas.");
      return;
    }

    const values = parts.map(Number);

    if (!values.every(Number.isSafeInteger)) {
      setError("Please enter safe integer values.");
      return;
    }

    setInputArray(values);
    setCurrentFrame(0);
    setError("");
  }

  function shuffleArray() {
    setIsPlaying(false);

    const values = Array.from(
      { length: 7 },
      () => Math.floor(Math.random() * 90) + 10
    );

    setInputArray(values);
    setCustomInput(values.join(", "));
    setCurrentFrame(0);
    setError("");
  }

  return (
    <section className="sorting-visualizer">
      <div className="sv-heading">
        <div>
          <p className="sv-eyebrow">ALGORITHM PLAYGROUND</p>
          <h2>Bubble Sort Visualizer</h2>
          <p className="sv-description">
            Watch adjacent elements compare and swap, one step at a time.
          </p>
        </div>
        <span className="sv-badge">O(n²) worst case</span>
      </div>

      <form className="sv-input-form" onSubmit={loadArray}>
        <label htmlFor="sv-array-input">Your array</label>
        <div className="sv-input-row">
          <input
            id="sv-array-input"
            value={customInput}
            onChange={(event) => setCustomInput(event.target.value)}
            placeholder="64, 34, 25, 12, 22"
          />
          <button className="sv-btn sv-primary" type="submit">
            Load array
          </button>
          <button
            className="sv-btn"
            type="button"
            onClick={shuffleArray}
          >
            Shuffle
          </button>
        </div>
        {error && <p className="sv-error" role="alert">{error}</p>}
      </form>

      <div className="sv-stats">
        <div className="sv-stat">
          <span>Comparisons</span>
          <strong>{frame.comparisons}</strong>
        </div>
        <div className="sv-stat">
          <span>Swaps</span>
          <strong>{frame.swaps}</strong>
        </div>
        <div className="sv-stat">
          <span>Array size</span>
          <strong>{inputArray.length}</strong>
        </div>
        <div className="sv-stat">
          <span>Progress</span>
          <strong>
            {Math.round((currentFrame / (frames.length - 1)) * 100)}%
          </strong>
        </div>
      </div>

      <div className="sv-panel">
        <div className="sv-panel-heading">
          <div>
            <p className="sv-eyebrow">LIVE VISUALIZATION</p>
            <h3>Array state</h3>
          </div>
          <span className={`sv-status ${isComplete ? "complete" : ""}`}>
            {isComplete ? "SORTED" : isPlaying ? "RUNNING" : "PAUSED"}
          </span>
        </div>

        <div className="sv-chart" aria-label="Current array visualization">
          {frame.array.map((value, index) => {
            const isCompared =
              index === frame.left || index === frame.right;
            const isSorted =
              frame.sortedCount > 0 &&
              index >= frame.array.length - frame.sortedCount;

            const height = Math.max(
              28,
              Math.min(190, Math.abs(value) * 1.8 + 28)
            );

            return (
              <div className="sv-bar-column" key={index}>
                <div className="sv-bar-space">
                  <div
                    className={[
                      "sv-bar",
                      isCompared ? "compared" : "",
                      isSorted ? "sorted" : "",
                    ].filter(Boolean).join(" ")}
                    style={{ height: `${height}px` }}
                    title={`Index ${index}: ${value}`}
                  >
                    <span>{value}</span>
                  </div>
                </div>
                <span className="sv-index">Index {index}</span>
              </div>
            );
          })}
        </div>

        <div className="sv-legend">
          <span><i className="legend-compare" /> Compared elements</span>
          <span><i className="legend-sorted" /> Sorted section</span>
        </div>

        <div className="sv-message" role="status" aria-live="polite">
          <span className="sv-message-icon">↗</span>
          <p>{frame.message}</p>
        </div>

        <div className="sv-controls">
          {!isPlaying ? (
            <button className="sv-btn sv-primary" onClick={play}>
              {isComplete ? "↻ Play again" : "▶ Play"}
            </button>
          ) : (
            <button className="sv-btn sv-primary" onClick={pause}>
              Ⅱ Pause
            </button>
          )}

          <button
            className="sv-btn"
            onClick={stepForward}
            disabled={isComplete}
          >
            Step →
          </button>

          <button className="sv-btn" onClick={reset}>
            ↺ Reset
          </button>

          <label className="sv-speed">
            Speed
            <select
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            >
              <option value={1000}>Slow</option>
              <option value={500}>Normal</option>
              <option value={150}>Fast</option>
            </select>
          </label>
        </div>
      </div>

      <div className="sv-explanation">
        <h3>How Bubble Sort works</h3>
        <p>
          Bubble Sort compares adjacent elements. If the left element is
          larger than the right one, it swaps them. After each full pass,
          the largest remaining element reaches its correct position.
        </p>
        <div className="sv-complexities">
          <span><strong>Best time:</strong> O(n²)</span>
          <span><strong>Average time:</strong> O(n²)</span>
          <span><strong>Worst time:</strong> O(n²)</span>
          <span><strong>Auxiliary space:</strong> O(1)</span>
        </div>
        <p className="sv-note">
          This implementation uses standard Bubble Sort without early-exit
          optimization, so even an already sorted array takes O(n²) time.
        </p>
      </div>
    </section>
  );
}

export default SortingVisualizer;

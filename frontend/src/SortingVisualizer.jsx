
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./SortingVisualizer.css";

const STARTING_ARRAY = [64, 34, 25, 12, 22, 11, 90];

function makeFlags(length, condition) {
  return Array.from({ length }, (_, index) => condition(index));
}

function copyArray(items) {
  return items.map((item) => ({ ...item }));
}

function buildSortFrames(items, algorithm) {
  const array = copyArray(items);
  const n = array.length;
  const frames = [];

  let comparisons = 0;
  let swaps = 0;

  const addFrame = (
    action,
    left,
    right,
    message,
    sortedIndices = makeFlags(n, () => false)
  ) => {
    frames.push({
      array: copyArray(array),
      left,
      right,
      comparisons,
      swaps,
      sortedIndices: [...sortedIndices],
      action,
      message,
    });
  };

  addFrame(
    "ready",
    -1,
    -1,
    `Ready to run ${algorithm}. Press Play or Step to begin.`
  );

  if (algorithm === "Bubble Sort") {
    for (let i = 0; i < n - 1; i++) {
      const sorted = makeFlags(n, (index) => index >= n - i);

      for (let j = 0; j < n - i - 1; j++) {
        const first = array[j].value;
        const second = array[j + 1].value;

        comparisons++;

        addFrame(
          "compare",
          j,
          j + 1,
          first > second
            ? `Compare ${first} and ${second}. The left value is larger, so they need to swap.`
            : `Compare ${first} and ${second}. They are already in the correct relative order.`,
          sorted
        );

        if (first > second) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          swaps++;

          addFrame(
            "swap",
            j,
            j + 1,
            `Swap ${first} and ${second}. Their cards exchange positions.`,
            sorted
          );
        }
      }

      addFrame(
        "pass",
        -1,
        -1,
        `Pass ${i + 1} complete. ${array[n - i - 1].value} is now in its final position.`,
        makeFlags(n, (index) => index >= n - i - 1)
      );
    }
  }

  if (algorithm === "Selection Sort") {
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      const sortedPrefix = makeFlags(n, (index) => index < i);

      for (let j = i + 1; j < n; j++) {
        const minimum = array[minIndex].value;
        const candidate = array[j].value;

        comparisons++;

        addFrame(
          "compare",
          minIndex,
          j,
          `Compare the current minimum ${minimum} with ${candidate}.`,
          sortedPrefix
        );

        if (candidate < minimum) {
          minIndex = j;

          addFrame(
            "select",
            minIndex,
            -1,
            `${candidate} is the new minimum. Keep track of its position.`,
            sortedPrefix
          );
        }
      }

      if (minIndex !== i) {
        const first = array[i].value;
        const second = array[minIndex].value;

        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        swaps++;

        addFrame(
          "swap",
          i,
          minIndex,
          `Place minimum ${second} at index ${i} by swapping it with ${first}.`,
          sortedPrefix
        );
      }

      addFrame(
        "pass",
        -1,
        -1,
        `Position ${i} is now sorted.`,
        makeFlags(n, (index) => index <= i)
      );
    }
  }

  if (algorithm === "Insertion Sort") {
    for (let i = 1; i < n; i++) {
      let j = i;

      while (j > 0) {
        const first = array[j - 1].value;
        const second = array[j].value;

        comparisons++;

        addFrame(
          "compare",
          j - 1,
          j,
          `Compare ${first} with ${second}. Decide whether ${second} needs to move left.`,
          makeFlags(n, () => false)
        );

        if (first > second) {
          [array[j - 1], array[j]] = [array[j], array[j - 1]];
          swaps++;

          addFrame(
            "swap",
            j - 1,
            j,
            `${second} is smaller than ${first}, so move ${second} one position left.`,
            makeFlags(n, () => false)
          );

          j--;
        } else {
          break;
        }
      }

      addFrame(
        "pass",
        -1,
        -1,
        `Insertion ${i} complete. The first ${i + 1} elements are sorted.`,
        makeFlags(n, (index) => index <= i)
      );
    }
  }

  addFrame(
    "complete",
    -1,
    -1,
    `${algorithm} complete! The array is sorted in ascending order.`,
    makeFlags(n, () => true)
  );

  return frames;
}

const ALGORITHM_INFO = {
  "Bubble Sort": {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    note:
      "This version does not use early-exit optimization, so even sorted input takes O(n²) time.",
  },
  "Selection Sort": {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    note:
      "Selection Sort scans the remaining unsorted section to find its minimum on every pass.",
  },
  "Insertion Sort": {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    note:
      "This version moves elements left using adjacent swaps. Already sorted input requires only linear comparisons.",
  },
};

function SortingVisualizer() {
  const [algorithm, setAlgorithm] = useState("Bubble Sort");

  const [originalItems, setOriginalItems] = useState(() =>
    STARTING_ARRAY.map((value, index) => ({
      id: `initial-${index}`,
      value,
    }))
  );

  const nextId = useRef(STARTING_ARRAY.length);
  const itemRefs = useRef(new Map());
  const previousPositions = useRef(new Map());

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [customInput, setCustomInput] = useState(
    STARTING_ARRAY.join(", ")
  );
  const [error, setError] = useState("");

  const frames = useMemo(
    () => buildSortFrames(originalItems, algorithm),
    [originalItems, algorithm]
  );

  const safeFrameIndex = Math.min(currentFrame, frames.length - 1);
  const frame = frames[safeFrameIndex];
  const isComplete = safeFrameIndex === frames.length - 1;
  const info = ALGORITHM_INFO[algorithm];

  useLayoutEffect(() => {
    const currentPositions = new Map();

    frame.array.forEach((item) => {
      const node = itemRefs.current.get(item.id);
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const previous = previousPositions.current.get(item.id);

      if (previous) {
        const dx = previous.left - rect.left;
        const dy = previous.top - rect.top;

        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          node.getAnimations().forEach((animation) => animation.cancel());

          const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;

          node.animate(
            [
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: "translate(0, 0)" },
            ],
            {
              duration: reducedMotion ? 0 : 550,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            }
          );
        }
      }

      currentPositions.set(item.id, {
        left: rect.left,
        top: rect.top,
      });
    });

    previousPositions.current = currentPositions;
  });

  useEffect(() => {
    if (!isPlaying || isComplete) {
      if (isComplete) setIsPlaying(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCurrentFrame((current) =>
        Math.min(current + 1, frames.length - 1)
      );
    }, speed);

    return () => window.clearTimeout(timer);
  }, [isPlaying, isComplete, currentFrame, frames.length, speed]);

  function changeAlgorithm(event) {
    setIsPlaying(false);
    previousPositions.current.clear();
    setAlgorithm(event.target.value);
    setCurrentFrame(0);
    setError("");
  }

  function play() {
    if (isComplete) setCurrentFrame(0);
    setIsPlaying(true);
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
    previousPositions.current.clear();
    setError("");
  }

  function loadArray(event) {
    event.preventDefault();
    setIsPlaying(false);

    const parts = customInput.split(",").map((item) => item.trim());

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
      setError("Please enter valid safe integers.");
      return;
    }

    const newItems = values.map((value) => ({
      id: `item-${nextId.current++}`,
      value,
    }));

    previousPositions.current.clear();
    setOriginalItems(newItems);
    setCurrentFrame(0);
    setError("");
  }

  function shuffleArray() {
    setIsPlaying(false);

    const values = Array.from(
      { length: 7 },
      () => Math.floor(Math.random() * 90) + 10
    );

    const newItems = values.map((value) => ({
      id: `item-${nextId.current++}`,
      value,
    }));

    previousPositions.current.clear();
    setOriginalItems(newItems);
    setCustomInput(values.join(", "));
    setCurrentFrame(0);
    setError("");
  }

  function registerItem(id, node) {
    if (node) itemRefs.current.set(id, node);
    else itemRefs.current.delete(id);
  }

  const status = {
    ready: "READY",
    compare: "COMPARING",
    select: "NEW MINIMUM",
    swap: "SWAPPING",
    pass: "PASS COMPLETE",
    complete: "SORTED",
  }[frame.action];

  const progress = Math.round(
    (safeFrameIndex / Math.max(1, frames.length - 1)) * 100
  );

  return (
    <section className="sorting-visualizer">
      <header className="sv-heading">
        <div>
          <p className="sv-eyebrow">ALGORITHM PLAYGROUND</p>
          <h2>Sorting Studio</h2>
          <p className="sv-description">
            Choose an algorithm and watch each comparison and movement.
          </p>
        </div>

        <span className="sv-badge">{info.worst} worst case</span>
      </header>

      <div className="sv-algorithm-select">
        <label htmlFor="sv-algorithm">Sorting algorithm</label>
        <select
          id="sv-algorithm"
          value={algorithm}
          onChange={changeAlgorithm}
        >
          <option>Bubble Sort</option>
          <option>Selection Sort</option>
          <option>Insertion Sort</option>
        </select>
      </div>

      <form className="sv-input-form" onSubmit={loadArray}>
        <label htmlFor="sv-array-input">Create your own array</label>

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

          <button className="sv-btn" type="button" onClick={shuffleArray}>
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
          <strong>{originalItems.length}</strong>
        </div>
        <div className="sv-stat">
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>
      </div>

      <section className="sv-panel">
        <div className="sv-panel-heading">
          <div>
            <p className="sv-eyebrow">LIVE ARRAY</p>
            <h3>Compare · Swap · Settle</h3>
          </div>

          <span className={`sv-status sv-status-${frame.action}`}>
            {status}
          </span>
        </div>

        <div className="sv-progress-track">
          <div
            className="sv-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="sv-stage">
          <div
            className="sv-array-grid"
            style={{
              "--array-columns": frame.array.length,
              minWidth:
                frame.array.length > 10
                  ? `${frame.array.length * 62}px`
                  : "100%",
            }}
          >
            {frame.array.map((item, index) => {
              const isActive =
                index === frame.left || index === frame.right;
              const isSorted = frame.sortedIndices[index];

              let cardState = "";

              if (isActive) {
                if (frame.action === "swap") {
                  cardState = "sv-card-swapping";
                } else if (frame.action === "select") {
                  cardState = "sv-card-select";
                } else {
                  cardState = "sv-card-comparing";
                }
              } else if (isSorted) {
                cardState = "sv-card-sorted";
              }

              return (
                <div
                  className="sv-array-item"
                  key={item.id}
                  ref={(node) => registerItem(item.id, node)}
                >
                  <div className={`sv-cell ${cardState}`}>
                    <div className="sv-card">
                      <span className="sv-card-value">{item.value}</span>
                    </div>
                  </div>

                  <span className="sv-index">[{index}]</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sv-legend">
          <span><i className="sv-legend-compare" /> Comparing · Lavender</span>
          <span><i className="sv-legend-swap" /> Swapping · Coral</span>
          <span><i className="sv-legend-sorted" /> Sorted · Mint</span>
        </div>

        <div className={`sv-message sv-message-${frame.action}`} role="status" aria-live="polite">
          <span className="sv-message-icon">
            {frame.action === "swap"
              ? "⇄"
              : frame.action === "complete"
                ? "✓"
                : frame.action === "compare"
                  ? "↔"
                  : frame.action === "select"
                    ? "✦"
                    : "→"}
          </span>

          <div>
            <strong>
              {frame.action === "compare"
                ? "Comparison"
                : frame.action === "swap"
                  ? "Swapping elements"
                  : frame.action === "select"
                    ? "New minimum"
                    : frame.action === "pass"
                      ? "Pass finished"
                      : frame.action === "complete"
                        ? "All sorted!"
                        : "Ready to begin"}
            </strong>

            <p>{frame.message}</p>
          </div>
        </div>

        <div className="sv-controls">
          {!isPlaying ? (
            <button className="sv-btn sv-primary" onClick={play}>
              {isComplete ? "↻ Play again" : "▶ Play"}
            </button>
          ) : (
            <button className="sv-btn sv-primary" onClick={() => setIsPlaying(false)}>
              Ⅱ Pause
            </button>
          )}

          <button className="sv-btn" onClick={stepForward} disabled={isComplete}>
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
              <option value={2000}>Slow</option>
              <option value={1200}>Normal</option>
              <option value={750}>Fast</option>
            </select>
          </label>
        </div>
      </section>

      <section className="sv-explanation">
        <p className="sv-eyebrow">UNDERSTAND THE ALGORITHM</p>
        <h3>How {algorithm} works</h3>

        <p>
          {algorithm === "Bubble Sort"
            ? "Bubble Sort compares neighbouring elements and swaps them when they are out of order. Larger values gradually move toward the right."
            : algorithm === "Selection Sort"
              ? "Selection Sort scans the unsorted section, remembers the smallest value, and moves it to the next position in the sorted prefix."
              : "Insertion Sort takes the next element and moves it left through adjacent swaps until it fits in the sorted prefix."}
        </p>

        <div className="sv-complexities">
          <span><strong>Best time:</strong> {info.best}</span>
          <span><strong>Average time:</strong> {info.average}</span>
          <span><strong>Worst time:</strong> {info.worst}</span>
          <span><strong>Auxiliary space:</strong> {info.space}</span>
        </div>

        <p className="sv-note">{info.note}</p>
      </section>
    </section>
  );
}

export default SortingVisualizer;

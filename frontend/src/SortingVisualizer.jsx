
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./SortingVisualizer.css";

const STARTING_ARRAY = [64, 34, 25, 12, 22, 11, 90];

function copyArray(items) {
  return items.map((item) => ({ ...item }));
}

function buildBubbleSortFrames(items) {
  const array = copyArray(items);
  const frames = [
    {
      array: copyArray(array),
      left: -1,
      right: -1,
      comparisons: 0,
      swaps: 0,
      sortedFrom: array.length,
      action: "ready",
      message: "Ready! Press Play or Step to begin.",
    },
  ];

  let comparisons = 0;
  let swaps = 0;
  const length = array.length;

  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      const first = array[j].value;
      const second = array[j + 1].value;

      comparisons++;

      frames.push({
        array: copyArray(array),
        left: j,
        right: j + 1,
        comparisons,
        swaps,
        sortedFrom: length - i,
        action: "compare",
        message:
          first > second
            ? `Compare ${first} with ${second}. Since ${first} is larger, these cards need to swap.`
            : `Compare ${first} with ${second}. They are already in ascending order, so keep them in place.`,
      });

      if (first > second) {
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        swaps++;

        frames.push({
          array: copyArray(array),
          left: j,
          right: j + 1,
          comparisons,
          swaps,
          sortedFrom: length - i,
          action: "swap",
          message: `Swap ${first} and ${second}. Each card moves into the other card's position.`,
        });
      }
    }

    frames.push({
      array: copyArray(array),
      left: -1,
      right: -1,
      comparisons,
      swaps,
      sortedFrom: length - i - 1,
      action: "pass",
      message: `Pass ${i + 1} complete. The largest remaining value, ${array[length - i - 1].value}, is now in its final position.`,
    });
  }

  frames.push({
    array: copyArray(array),
    left: -1,
    right: -1,
    comparisons,
    swaps,
    sortedFrom: length,
    action: "complete",
    message: "Sorting complete! All elements are now in ascending order.",
  });

  return frames;
}

function SortingVisualizer() {
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
  const [speed, setSpeed] = useState(650);
  const [customInput, setCustomInput] = useState(
    STARTING_ARRAY.join(", ")
  );
  const [error, setError] = useState("");

  const frames = useMemo(
    () => buildBubbleSortFrames(originalItems),
    [originalItems]
  );

  const frame = frames[currentFrame] ?? frames[0];
  const isComplete = currentFrame === frames.length - 1;

  // Animate each card from its previous screen position to its new one.
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

          node.animate(
            [
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: "translate(0, 0)" },
            ],
            {
              duration: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
              ).matches
                ? 0
                : 360,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "none",
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

  // Play advances one recorded comparison/swap step at a time.
  useEffect(() => {
    if (!isPlaying) return undefined;

    if (currentFrame >= frames.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCurrentFrame((current) =>
        Math.min(current + 1, frames.length - 1)
      );
    }, speed);

    return () => window.clearTimeout(timer);
  }, [isPlaying, currentFrame, frames.length, speed]);

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

    const parts = customInput.split(",").map((item) => item.trim());

    if (
      parts.length < 2 ||
      parts.length > 20 ||
      parts.some((item) => item === "" || !/^-?\d+$/.test(item))
    ) {
      setError("Enter between 2 and 20 integers, separated by commas.");
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

    previousPositions.current = new Map();
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

    previousPositions.current = new Map();
    setOriginalItems(newItems);
    setCustomInput(values.join(", "));
    setCurrentFrame(0);
    setError("");
  }

  function registerItem(id, node) {
    if (node) {
      itemRefs.current.set(id, node);
    } else {
      itemRefs.current.delete(id);
    }
  }

  const statusLabel = {
    ready: "READY",
    compare: "COMPARING",
    swap: "SWAPPING",
    pass: "PASS COMPLETE",
    complete: "SORTED",
  }[frame.action];

  const progress = Math.round(
    (currentFrame / Math.max(1, frames.length - 1)) * 100
  );

  return (
    <section className="sorting-visualizer">
      <header className="sv-heading">
        <div>
          <p className="sv-eyebrow">ALGORITHM PLAYGROUND</p>
          <h2>Bubble Sort Studio</h2>
          <p className="sv-description">
            Watch each comparison, then see the number cards glide
            into their new positions.
          </p>
        </div>

        <span className="sv-badge">O(n²) worst case</span>
      </header>

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

        {error && (
          <p className="sv-error" role="alert">
            {error}
          </p>
        )}
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

          <span
            className={`sv-status sv-status-${frame.action}`}
            aria-live="polite"
          >
            {statusLabel}
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
              const isSorted = index >= frame.sortedFrom;

              let cardState = "";

              if (isActive) {
                cardState =
                  frame.action === "swap"
                    ? "sv-card-swapping"
                    : "sv-card-comparing";
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

        <div
          className={`sv-message sv-message-${frame.action}`}
          role="status"
          aria-live="polite"
        >
          <span className="sv-message-icon">
            {frame.action === "swap"
              ? "⇄"
              : frame.action === "complete"
                ? "✓"
                : frame.action === "compare"
                  ? "↔"
                  : "✦"}
          </span>

          <div>
            <strong>
              {frame.action === "compare"
                ? "Comparison"
                : frame.action === "swap"
                  ? "Swapping elements"
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
              <option value={1100}>Slow</option>
              <option value={650}>Normal</option>
              <option value={420}>Fast</option>
            </select>
          </label>
        </div>
      </section>

      <section className="sv-explanation">
        <p className="sv-eyebrow">UNDERSTAND THE ALGORITHM</p>
        <h3>Why do the cards move?</h3>

        <p>
          Bubble Sort compares neighbouring elements. If the left value is
          greater than the right value, the two elements exchange positions.
          Each swap moves a larger value closer to the right side of the array.
        </p>

        <div className="sv-complexities">
          <span><strong>Best time:</strong> O(n²)</span>
          <span><strong>Average time:</strong> O(n²)</span>
          <span><strong>Worst time:</strong> O(n²)</span>
          <span><strong>Extra space:</strong> O(1)</span>
        </div>

        <p className="sv-note">
          This version uses standard Bubble Sort without early-exit
          optimization. It takes O(n²) time even when the input is already
          sorted.
        </p>
      </section>
    </section>
  );
}

export default SortingVisualizer;

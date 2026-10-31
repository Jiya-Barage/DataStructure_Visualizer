
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { plainSorters } from "./algorithms";
import { formatTime, measureNet } from "./timing";
import "./SortingVisualizer.css";

const STARTING_ARRAY = [64, 34, 25, 12, 22, 11, 90];

function copyArray(items) {
  return items.map((item) => ({ ...item }));
}

function makeFlags(length, condition) {
  return Array.from({ length }, (_, index) => condition(index));
}

// Build the comparison, swap, and merge steps before animation begins.
function buildSortFrames(items, algorithm) {
  const array = copyArray(items);
  const n = array.length;
  const frames = [];

  let comparisons = 0;
  let swaps = 0;

  function addFrame(
    action,
    left,
    right,
    message,
    sortedIndices = makeFlags(n, () => false),
    extra = {}
  ) {
    frames.push({
      array: copyArray(array),
      left,
      right,
      comparisons,
      swaps,
      sortedIndices: [...sortedIndices],
      action,
      message,
      ...extra,
    });
  }

  addFrame(
    "ready",
    -1,
    -1,
    `Ready to run ${algorithm}. Press Play or Step to begin.`
  );

  // BUBBLE SORT
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
            ? `Compare ${first} and ${second}. ${first} is larger, so these elements must swap.`
            : `Compare ${first} and ${second}. Their relative order is already correct.`,
          sorted
        );

        if (first > second) {
          [array[j], array[j + 1]] = [
            array[j + 1],
            array[j],
          ];
          swaps++;

          addFrame(
            "swap",
            j,
            j + 1,
            `Swap ${first} and ${second}. The cards exchange positions.`,
            sorted
          );
        }
      }

      addFrame(
        "pass",
        -1,
        -1,
        `Pass ${i + 1} complete. ${array[n - i - 1].value} has reached its final position.`,
        makeFlags(n, (index) => index >= n - i - 1)
      );
    }
  }

  // SELECTION SORT
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
          `Compare current minimum ${minimum} with ${candidate}.`,
          sortedPrefix
        );

        if (candidate < minimum) {
          minIndex = j;

          addFrame(
            "select",
            minIndex,
            -1,
            `${candidate} is the new minimum. Remember its index.`,
            sortedPrefix
          );
        }
      }

      if (minIndex !== i) {
        const first = array[i].value;
        const second = array[minIndex].value;

        [array[i], array[minIndex]] = [
          array[minIndex],
          array[i],
        ];
        swaps++;

        addFrame(
          "swap",
          i,
          minIndex,
          `Move minimum ${second} to index ${i} by swapping it with ${first}.`,
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

  // INSERTION SORT
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
          `Compare ${first} with ${second}. Should ${second} move left?`
        );

        if (first > second) {
          [array[j - 1], array[j]] = [
            array[j],
            array[j - 1],
          ];
          swaps++;

          addFrame(
            "swap",
            j - 1,
            j,
            `${second} is smaller than ${first}. Move it one position left.`
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

  // MERGE SORT
  if (algorithm === "Merge Sort") {
    function mergeSort(left, right) {
      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);

      addFrame(
        "split",
        -1,
        -1,
        `Split range [${left}, ${right}] into [${left}, ${mid}] and [${mid + 1}, ${right}].`,
        makeFlags(n, () => false),
        {
          rangeStart: left,
          rangeEnd: right,
          splitAt: mid + 1,
        }
      );

      mergeSort(left, mid);
      mergeSort(mid + 1, right);

      const temp = [];
      let i = left;
      let j = mid + 1;

      // Compare the front elements of the two sorted groups.
      while (i <= mid && j <= right) {
        const first = array[i].value;
        const second = array[j].value;

        comparisons++;

        addFrame(
          "merge-compare",
          i,
          j,
          `Compare ${first} from the left group with ${second} from the right group.`,
          makeFlags(n, () => false),
          {
            rangeStart: left,
            rangeEnd: right,
            splitAt: mid + 1,
            mergeOutput: copyArray(temp),
          }
        );

        if (first <= second) {
          temp.push(array[i]);

          addFrame(
            "merge-select",
            i,
            -1,
            `${first} is smaller or equal. Take it from the left group into the merge buffer.`,
            makeFlags(n, () => false),
            {
              rangeStart: left,
              rangeEnd: right,
              splitAt: mid + 1,
              mergeOutput: copyArray(temp),
            }
          );

          i++;
        } else {
          temp.push(array[j]);

          addFrame(
            "merge-select",
            j,
            -1,
            `${second} is smaller. Take it from the right group into the merge buffer.`,
            makeFlags(n, () => false),
            {
              rangeStart: left,
              rangeEnd: right,
              splitAt: mid + 1,
              mergeOutput: copyArray(temp),
            }
          );

          j++;
        }
      }

      while (i <= mid) {
        temp.push(array[i]);

        addFrame(
          "merge-select",
          i,
          -1,
          `The right group is exhausted. Take ${array[i].value} from the left group.`,
          makeFlags(n, () => false),
          {
            rangeStart: left,
            rangeEnd: right,
            splitAt: mid + 1,
            mergeOutput: copyArray(temp),
          }
        );

        i++;
      }

      while (j <= right) {
        temp.push(array[j]);

        addFrame(
          "merge-select",
          j,
          -1,
          `The left group is exhausted. Take ${array[j].value} from the right group.`,
          makeFlags(n, () => false),
          {
            rangeStart: left,
            rangeEnd: right,
            splitAt: mid + 1,
            mergeOutput: copyArray(temp),
          }
        );

        j++;
      }

      // Place the merged group back into the array.
      for (let k = 0; k < temp.length; k++) {
        array[left + k] = temp[k];
      }

      addFrame(
        "merge-place",
        -1,
        -1,
        `Merge complete! Range [${left}, ${right}] is now sorted. Its cards move into their new positions.`,
        makeFlags(n, () => false),
        {
          rangeStart: left,
          rangeEnd: right,
          splitAt: -1,
          mergeOutput: [],
        }
      );
    }

    mergeSort(0, n - 1);
  }

  addFrame(
    "complete",
    -1,
    -1,
    `${algorithm} complete! The array is sorted in ascending order.`,
    makeFlags(n, () => true),
    {
      rangeStart: 0,
      rangeEnd: n - 1,
      splitAt: -1,
      mergeOutput: [],
    }
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
      "This version has no early-exit optimization, so even sorted input takes O(n²) time.",
  },
  "Selection Sort": {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    note:
      "Selection Sort scans the remaining unsorted section on every pass.",
  },
  "Insertion Sort": {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    note:
      "This adjacent-swap version takes O(n) time on sorted input and O(n²) in the average and worst cases.",
  },
  "Merge Sort": {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    note:
      "Merge Sort recursively divides the array and combines sorted groups using a temporary buffer.",
  },
};

// Graph-style tree for Merge Sort.
function MergeSortTree({ items, frame }) {
  const isMergeAction = frame.action.startsWith("merge");

  function renderNode(left, right) {
    const values = items
      .slice(left, right + 1)
      .map((item) => item.value);

    const isActive =
      frame.rangeStart === left &&
      frame.rangeEnd === right &&
      (frame.action === "split" || isMergeAction);

    let state = "";

    if (isActive && frame.action === "split") {
      state = "sv-tree-splitting";
    } else if (isActive && frame.action === "merge-place") {
      state = "sv-tree-placed";
    } else if (isActive && isMergeAction) {
      state = "sv-tree-merging";
    }

    const middle = Math.floor((left + right) / 2);
    const isLeaf = left === right;

    return (
      <div className="sv-tree-node" key={`${left}-${right}`}>
        <div className={`sv-tree-card ${state}`}>
          <span className="sv-tree-range">
            [{left}–{right}]
          </span>

          <div className="sv-tree-values">
            {values.join(" · ")}
          </div>

          <span className="sv-tree-node-caption">
            {isLeaf
              ? "Single element"
              : isActive && frame.action === "split"
                ? "Splitting..."
                : isActive && frame.action === "merge-place"
                  ? "Merged"
                  : isActive && isMergeAction
                    ? "Merging..."
                    : `${values.length} elements`}
          </span>
        </div>

        {!isLeaf && (
          <div className="sv-tree-children">
            <div className="sv-tree-child">
              {renderNode(left, middle)}
            </div>

            <div className="sv-tree-child">
              {renderNode(middle + 1, right)}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="sv-merge-tree-panel">
      <div className="sv-panel-heading">
        <div>
          <p className="sv-eyebrow">RECURSION MAP</p>
          <h3>How the array splits</h3>
        </div>

        <span className="sv-status sv-status-split">
          TOP → DOWN
        </span>
      </div>

      <p className="sv-tree-description">
        Follow the branches from the original array to single elements.
        Then watch each group merge back in sorted order.
      </p>

      <div className="sv-tree-scroll">
        <div
          className="sv-tree"
          style={{
            minWidth: `${Math.max(620, items.length * 84)}px`,
          }}
        >
          {renderNode(0, items.length - 1)}
        </div>
      </div>

      <div className="sv-legend">
        <span>
          <i className="sv-legend-compare" />
          Splitting · Lavender
        </span>

        <span>
          <i className="sv-legend-swap" />
          Merging · Coral
        </span>

        <span>
          <i className="sv-legend-sorted" />
          Merged · Mint
        </span>
      </div>
    </section>
  );
}

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

  // Real run time of this algorithm on the current array (no animation involved).
  const runtime = useMemo(() => {
    const values = originalItems.map((item) => item.value);
    const sorter = plainSorters[algorithm];
    return measureNet(() => sorter(values.slice()), () => values.slice(), 8);
  }, [originalItems, algorithm]);

  // Animate each card from its previous position to its new position.
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
    if (!isPlaying || isComplete) return undefined;

    const timer = window.setTimeout(() => {
      const nextFrame = Math.min(
        currentFrame + 1,
        frames.length - 1
      );

      setCurrentFrame(nextFrame);

      if (nextFrame >= frames.length - 1) {
        setIsPlaying(false);
      }
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
    split: "SPLITTING",
    "merge-compare": "MERGING · COMPARE",
    "merge-select": "MERGING · SELECT",
    "merge-place": "MERGE COMPLETE",
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
            Explore comparisons, swaps, recursive splits, and merge steps.
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
          <option>Merge Sort</option>
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
          <span>Actual run time</span>
          <strong>{formatTime(runtime.ns)}</strong>
          <small>average of {runtime.runs.toLocaleString()} runs</small>
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
            <h3>
              {algorithm === "Merge Sort"
                ? "Split · Compare · Merge"
                : "Compare · Swap · Settle"}
            </h3>
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
                  ? `${frame.array.length * 72}px`
                  : "100%",
            }}
          >
            {frame.array.map((item, index) => {
              const isActive =
                index === frame.left || index === frame.right;
              const isSorted = frame.sortedIndices[index];

              const inSplitRange =
                frame.rangeStart !== undefined &&
                index >= frame.rangeStart &&
                index <= frame.rangeEnd;

              let cardState = "";

              if (isActive) {
                if (frame.action === "swap") {
                  cardState = "sv-card-swapping";
                } else if (
                  frame.action === "select" ||
                  frame.action === "merge-select"
                ) {
                  cardState =
                    frame.action === "merge-select"
                      ? "sv-card-merging"
                      : "sv-card-select";
                } else {
                  cardState = "sv-card-comparing";
                }
              } else if (isSorted) {
                cardState = "sv-card-sorted";
              }

              const itemClasses = [
                "sv-array-item",
                frame.action === "split" && inSplitRange
                  ? "sv-in-split"
                  : "",
                frame.action === "split" && frame.splitAt === index
                  ? "sv-split-before"
                  : "",
                frame.action === "merge-place" && inSplitRange
                  ? "sv-in-merge"
                  : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  className={itemClasses}
                  key={item.id}
                  ref={(node) => registerItem(item.id, node)}
                >
                  <span className="sv-split-marker">
                    {frame.action === "split" && frame.splitAt === index
                      ? "SPLIT"
                      : "\u00a0"}
                  </span>

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

          {frame.mergeOutput && frame.mergeOutput.length > 0 && (
            <div className="sv-merge-tray">
              <div className="sv-merge-tray-heading">
                <span className="sv-eyebrow">MERGE BUFFER</span>
                <span className="sv-merge-count">
                  {frame.mergeOutput.length} selected
                </span>
              </div>

              <div className="sv-merge-output">
                {frame.mergeOutput.map((item, index) => (
                  <div
                    className="sv-merge-chip"
                    key={`${item.id}-${index}`}
                  >
                    {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {algorithm === "Merge Sort" && (
          <MergeSortTree items={frame.array} frame={frame} />
        )}

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
              : frame.action === "split"
                ? "⑂"
                : frame.action.startsWith("merge")
                  ? "↘"
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
                  : frame.action === "select"
                    ? "New minimum"
                    : frame.action === "pass"
                      ? "Pass finished"
                      : frame.action === "split"
                        ? "Divide the array"
                        : frame.action === "merge-compare"
                          ? "Compare merge candidates"
                          : frame.action === "merge-select"
                            ? "Add to merge buffer"
                            : frame.action === "merge-place"
                              ? "Place merged group"
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
            <button
              className="sv-btn sv-primary"
              onClick={() => setIsPlaying(false)}
            >
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
            ? "Bubble Sort compares neighbouring elements and swaps them when they are out of order. Larger values move toward the right."
            : algorithm === "Selection Sort"
              ? "Selection Sort finds the minimum in the unsorted section and places it at the beginning of that section."
              : algorithm === "Insertion Sort"
                ? "Insertion Sort takes the next element and moves it left through adjacent swaps until it fits in the sorted prefix."
                : "Merge Sort recursively divides the array into smaller groups, then combines those groups by choosing the smallest available front element."}
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

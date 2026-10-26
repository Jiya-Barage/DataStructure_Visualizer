
import { useState } from "react";
import "./SearchingVisualizer.css";

const SAMPLE_ARRAY = [4, 9, 13, 18, 24, 31, 42];

function createSteps(array, target, mode) {
  const steps = [];

  if (mode === "Linear Search") {
    for (let i = 0; i < array.length; i++) {
      const found = array[i] === target;

      steps.push({
        index: i,
        message: found
          ? `Found ${target} at index ${i}!`
          : `Checking index ${i}: ${array[i]} is not ${target}.`,
        comparison: true,
        found,
      });

      if (found) break;
    }
  } else {
    let low = 0;
    let high = array.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const value = array[mid];

      if (value === target) {
        steps.push({
          index: mid,
          message: `Found ${target} at index ${mid}!`,
          comparison: true,
          found: true,
        });
        break;
      }

      steps.push({
        index: mid,
        message: value < target
          ? `${value} is smaller than ${target}. Search the right half.`
          : `${value} is larger than ${target}. Search the left half.`,
        comparison: true,
        found: false,
      });

      if (value < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }

  if (!steps.some((step) => step.found)) {
    steps.push({
      index: -1,
      message: `${target} was not found in the array.`,
      comparison: false,
      notFound: true,
    });
  }

  return steps;
}

function SearchingVisualizer() {
  const [mode, setMode] = useState("Linear Search");
  const [targetInput, setTargetInput] = useState("24");
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);

  const currentStep = steps[stepIndex];

  const comparisons = steps
    .slice(0, stepIndex + 1)
    .filter((step) => step.comparison).length;

  function startSearch() {
    const target = Number(targetInput);

    if (targetInput.trim() === "" || !Number.isSafeInteger(target)) {
      return;
    }

    const newSteps = createSteps(SAMPLE_ARRAY, target, mode);
    setSteps(newSteps);
    setStepIndex(0);
  }

  function resetSearch() {
    setSteps([]);
    setStepIndex(-1);
  }

  function nextStep() {
    if (stepIndex < steps.length - 1) {
      setStepIndex((previous) => previous + 1);
    }
  }

  return (
    <div className="search-page">
      <section className="search-hero">
        <p className="search-eyebrow">ALGORITHM PLAYGROUND</p>
        <h2>Searching Visualizer</h2>
        <p>Follow each comparison to discover how searching algorithms work.</p>
      </section>

      <section className="search-stats">
        <div className="search-stat">
          <span>ALGORITHM</span>
          <strong>{mode}</strong>
        </div>
        <div className="search-stat">
          <span>ARRAY SIZE</span>
          <strong>{SAMPLE_ARRAY.length}</strong>
        </div>
        <div className="search-stat">
          <span>COMPARISONS</span>
          <strong>{comparisons}</strong>
        </div>
        <div className="search-stat">
          <span>STATUS</span>
          <strong>
            {!currentStep
              ? "Ready"
              : currentStep.found
                ? "Found!"
                : currentStep.notFound
                  ? "Not found"
                  : "Searching"}
          </strong>
        </div>
      </section>

      <section className="search-panel">
        <div className="search-panel-heading">
          <div>
            <p className="search-eyebrow">LIVE VIEW</p>
            <h3>Array Visualization</h3>
          </div>
          <span className="search-complexity">
            {mode === "Linear Search" ? "O(n)" : "O(log n)"}
          </span>
        </div>

        <div className="search-array">
          {SAMPLE_ARRAY.map((value, index) => {
            const active = currentStep?.index === index;
            const found = active && currentStep?.found;

            return (
              <div className="search-cell-wrap" key={index}>
                <div
                  className={`search-cell ${active ? "current" : ""} ${
                    found ? "found" : ""
                  }`}
                >
                  {value}
                </div>
                <span className="search-index">Index {index}</span>
                {active && (
                  <span className="search-marker">
                    {found ? "FOUND" : "CHECKING"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="search-controls">
          <label htmlFor="search-mode">Algorithm</label>
          <select
            id="search-mode"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value);
              resetSearch();
            }}
          >
            <option>Linear Search</option>
            <option>Binary Search</option>
          </select>

          <label htmlFor="search-target">Target</label>
          <input
            id="search-target"
            type="number"
            value={targetInput}
            onChange={(event) => {
              setTargetInput(event.target.value);
              resetSearch();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") startSearch();
            }}
            placeholder="Enter a number"
          />

          <button className="search-primary" onClick={startSearch}>
            Start Search
          </button>

          <button
            className="search-secondary"
            onClick={nextStep}
            disabled={stepIndex < 0 || stepIndex >= steps.length - 1}
          >
            Next Step →
          </button>

          <button className="search-secondary" onClick={resetSearch}>
            Reset
          </button>
        </div>

        <div className="search-message" role="status" aria-live="polite">
          <span className="search-message-dot" />
          {currentStep
            ? currentStep.message
            : "Choose an algorithm and target, then start searching."}
        </div>
      </section>

      <section className="search-explanation">
        <h3>How it works</h3>
        {mode === "Linear Search" ? (
          <p>
            Linear Search checks elements one by one until the target is found
            or the array ends. Its worst-case time complexity is O(n).
          </p>
        ) : (
          <p>
            Binary Search checks the middle element and eliminates half of the
            remaining search range. It requires a sorted array and has
            worst-case time complexity O(log n).
          </p>
        )}
      </section>
    </div>
  );
}

export default SearchingVisualizer;

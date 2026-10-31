import { useEffect, useMemo, useRef, useState } from "react";
import { LEVELS, QUESTIONS, TOPICS } from "./quizData";
import "./Extras.css";

const SECONDS_PER_QUESTION = { Easy: 30, Medium: 40, Hard: 60, Mixed: 40 };

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadBest() {
  try { return JSON.parse(localStorage.getItem("dsa-quiz-best") || "{}"); } catch { return {}; }
}

export default function QuizLab() {
  const [stage, setStage] = useState("setup"); // setup | running | done
  const [mode, setMode] = useState("Practice");
  const [level, setLevel] = useState("Easy");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [count, setCount] = useState(8);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState([]); // chosen option per question
  const [locked, setLocked] = useState(false); // practice mode: answer revealed
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [best, setBest] = useState(loadBest);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const finishRef = useRef(null);

  const pool = useMemo(
    () => QUESTIONS.filter((q) => (level === "Mixed" || q.level === level) && (topic === TOPICS[0] || q.topic === topic)),
    [level, topic]
  );
  const available = pool.length;
  const effectiveCount = Math.min(count, available);

  function start() {
    const chosen = shuffle(pool).slice(0, effectiveCount).map((q) => {
      const order = shuffle(q.options.map((text, i) => ({ text, i })));
      return { ...q, order, answerPos: order.findIndex((o) => o.i === q.answer) };
    });
    setQuestions(chosen);
    setPicked(Array(chosen.length).fill(null));
    setIndex(0);
    setLocked(false);
    setStartedAt(Date.now());
    setSecondsLeft(mode === "Test" ? chosen.length * SECONDS_PER_QUESTION[level] : 0);
    setStage("running");
  }

  function finish(finalPicked) {
    const score = questions.reduce((s, q, i) => s + (finalPicked[i] === q.answerPos ? 1 : 0), 0);
    const seconds = Math.round((Date.now() - startedAt) / 1000);
    setElapsed(seconds);
    const key = `${mode}-${level}`;
    const pct = Math.round((score / questions.length) * 100);
    if (questions.length && (best[key] === undefined || pct > best[key])) {
      const next = { ...best, [key]: pct };
      setBest(next);
      try { localStorage.setItem("dsa-quiz-best", JSON.stringify(next)); } catch { /* ignore */ }
    }
    setStage("done");
  }
  useEffect(() => {
    finishRef.current = finish;
  });

  // Test mode countdown for the whole test.
  useEffect(() => {
    if (stage !== "running" || mode !== "Test") return undefined;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setTimeout(() => finishRef.current(picked), 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [stage, mode, picked]);

  function choose(pos) {
    if (locked) return;
    const next = [...picked];
    next[index] = pos;
    setPicked(next);
    if (mode === "Practice") setLocked(true);
  }

  function next() {
    if (index + 1 >= questions.length) return finish(picked);
    setIndex(index + 1);
    setLocked(false);
  }

  const q = questions[index];
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  /* ---------------- Setup ---------------- */
  if (stage === "setup") {
    return (
      <div className="x-page">
        <section className="x-card">
          <h3>Quiz &amp; Test</h3>
          <p className="x-sub">Choose how you want to be challenged. Practice explains every answer straight away. Test is timed and shows results at the end.</p>

          <div className="quiz-setup">
            <div>
              <p className="quiz-label">Mode</p>
              <div className="seg">
                {["Practice", "Test"].map((m) => (
                  <button key={m} className={mode === m ? "on" : ""} onClick={() => setMode(m)}>{m}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="quiz-label">Difficulty</p>
              <div className="seg">
                {[...LEVELS, "Mixed"].map((l) => (
                  <button key={l} className={level === l ? "on" : ""} onClick={() => setLevel(l)}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="quiz-label">Topic</p>
              <select className="quiz-select" value={topic} onChange={(e) => setTopic(e.target.value)}>
                {TOPICS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <p className="quiz-label">Questions</p>
              <div className="seg">
                {[5, 8, 12].map((c) => (
                  <button key={c} className={count === c ? "on" : ""} onClick={() => setCount(c)}>{c}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="x-row" style={{ marginTop: 22 }}>
            <button className="x-btn primary" onClick={start} disabled={available === 0}>Start {mode.toLowerCase()}</button>
            <span className="x-sub" style={{ margin: 0 }}>
              {available === 0
                ? "No questions match this combination. Try another topic or difficulty."
                : `${effectiveCount} question${effectiveCount > 1 ? "s" : ""} available${effectiveCount < count ? " for this filter" : ""}` +
                  (mode === "Test" ? ` · ${fmt(effectiveCount * SECONDS_PER_QUESTION[level])} time limit` : "")}
            </span>
          </div>
        </section>

        {Object.keys(best).length > 0 && (
          <section className="x-card">
            <h3>Your best scores</h3>
            <div className="x-chips" style={{ marginTop: 8 }}>
              {Object.entries(best).map(([k, v]) => (
                <span key={k} className="x-chip">{k.replace("-", " · ")}: <b>{v}%</b></span>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  /* ---------------- Results ---------------- */
  if (stage === "done") {
    const score = questions.reduce((s, qq, i) => s + (picked[i] === qq.answerPos ? 1 : 0), 0);
    const pct = Math.round((score / questions.length) * 100);
    const byTopic = {};
    questions.forEach((qq, i) => {
      byTopic[qq.topic] ||= { right: 0, total: 0 };
      byTopic[qq.topic].total++;
      if (picked[i] === qq.answerPos) byTopic[qq.topic].right++;
    });
    return (
      <div className="x-page">
        <section className="x-stats">
          <div className="x-stat"><span>Score</span><strong>{score} / {questions.length}</strong></div>
          <div className="x-stat"><span>Percentage</span><strong>{pct}%</strong></div>
          <div className="x-stat"><span>Time taken</span><strong>{fmt(elapsed)}</strong></div>
          <div className="x-stat"><span>Level</span><strong>{mode} · {level}</strong></div>
        </section>

        <section className="x-card">
          <h3>{pct >= 80 ? "Strong result" : pct >= 50 ? "Good progress" : "Keep practising"}</h3>
          <div className="x-chips" style={{ marginTop: 6 }}>
            {Object.entries(byTopic).map(([t, v]) => (
              <span key={t} className="x-chip">{t}: <b>{v.right}/{v.total}</b></span>
            ))}
          </div>
          <div className="x-row">
            <button className="x-btn primary" onClick={start}>Try again</button>
            <button className="x-btn" onClick={() => setStage("setup")}>Change settings</button>
          </div>
        </section>

        <section className="x-card">
          <h3>Review</h3>
          <div className="quiz-review">
            {questions.map((qq, i) => {
              const ok = picked[i] === qq.answerPos;
              return (
                <div key={i} className={`review-item ${ok ? "right" : "wrong"}`}>
                  <p className="review-q">{i + 1}. {qq.q}</p>
                  <p className="review-a">
                    Your answer: <b>{picked[i] === null ? "not answered" : qq.order[picked[i]].text}</b>
                    {!ok && <> · Correct: <b>{qq.order[qq.answerPos].text}</b></>}
                  </p>
                  <p className="review-e">{qq.explain}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  /* ---------------- Running ---------------- */
  return (
    <div className="x-page">
      <section className="x-card">
        <div className="x-heading">
          <div>
            <p className="x-kicker">{mode.toUpperCase()} · {level.toUpperCase()} · {q.topic.toUpperCase()}</p>
            <h3>Question {index + 1} of {questions.length}</h3>
          </div>
          {mode === "Test" && <span className={`x-pill ${secondsLeft <= 15 ? "warn" : ""}`}>{fmt(secondsLeft)} left</span>}
        </div>

        <div className="quiz-progress"><div style={{ width: `${(index / questions.length) * 100}%` }} /></div>

        <p className="quiz-question">{q.q}</p>

        <div className="quiz-options">
          {q.order.map((opt, pos) => {
            let state = "";
            if (mode === "Practice" && locked) {
              if (pos === q.answerPos) state = "correct";
              else if (pos === picked[index]) state = "incorrect";
            } else if (picked[index] === pos) state = "chosen";
            return (
              <button key={pos} className={`quiz-option ${state}`} onClick={() => choose(pos)}>
                <span className="quiz-letter">{String.fromCharCode(65 + pos)}</span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {mode === "Practice" && locked && (
          <div className="x-msg" role="status">
            <b>{picked[index] === q.answerPos ? "Correct. " : "Not quite. "}</b>{q.explain}
          </div>
        )}

        <div className="x-row">
          <button
            className="x-btn primary"
            onClick={next}
            disabled={mode === "Practice" && !locked}
          >
            {index + 1 === questions.length ? "Finish" : mode === "Test" && picked[index] === null ? "Skip" : "Next question"}
          </button>
          <button className="x-btn" onClick={() => setStage("setup")}>Quit</button>
        </div>
      </section>
    </div>
  );
}

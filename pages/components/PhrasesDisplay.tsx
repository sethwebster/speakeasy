import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useKeyPress, { useScopedKeyPress } from "../../hooks/useKeypress";
import { useMouseDown } from "../../hooks/useMouseDown";
import { inspect } from "../../helpers/inspect";
import Letter from "./Letter";
import useAppState from "../../data/app-state";
import { useMouseUp } from "../../hooks/useMouseUp";
import useInterval from "../../hooks/useInterval";

interface PhraseDisplayProps {
  play: boolean;
  speedMs: number;
}

export default function PhrasesDisplay({ play, speedMs }: PhraseDisplayProps) {
  const [appState, setAppState] = useAppState();
  const [current, setCurrent] = useState(0);
  const [sentence, setSentence] = useState("");
  const [adding, setAdding] = useState(false);
  const [newPhrase, setNewPhrase] = useState("");
  const phrasesDiv = useRef<HTMLDivElement>(null);
  const sentenceDiv = useRef<HTMLDivElement>(null);

  const addToSentence = useCallback(() => {
    startTransition(() => {
      setSentence((s) => s + appState.phrases[current] + " ");
    });
  }, [appState.phrases, current]);

  const leftPressed = useKeyPress("ArrowLeft", () => {
    setCurrent((c) => (c === 0 ? appState.phrases.length - 1 : c - 1));
  });

  const backspacePressed = useKeyPress("Backspace", () => {
    setSentence((s) =>
      s
        .split(" ")
        .slice(0, s.split(" ").length - 1)
        .join(" ")
    );
  });
  const deletePressed = useKeyPress("Delete", () => {
    setSentence("");
    setCurrent(0);
  });
  const spacePressed = useKeyPress(" ", () => {
    setSentence((s) => s + " ");
    setCurrent(0);
  });

  const handleNewPhraseChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPhrase(e.target.value);
    },
    []
  );

  const handleAddingKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        setAppState((s) => ({
          ...s,
          phrases: [...s.phrases, newPhrase],
        }));
        setAdding(false);
      }
    },
    [newPhrase, setAppState]
  );

  useInterval(() => {
    if (play) {
      setCurrent((c) => (c + 1) % appState.phrases.length);
    }
  }, speedMs);

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      id="phrases-wrapper"
      onMouseUp={addToSentence}
    >
      <div
        ref={phrasesDiv}
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {appState.phrases.map((phrase, i) => (
          <div
            onDoubleClick={() => {
              setAppState((s) => ({
                ...s,
                phrases: s.phrases.filter((p) => p !== phrase),
              }));
            }}
            onClick={addToSentence}
            style={{
              padding: 20,
              fontSize: "4em",
              border: "1px solid #333",
              margin: 4,
              backgroundColor:
                appState.phrases[i] === appState.phrases[current]
                  ? "#AAA"
                  : "#333",
            }}
            key={i + "" + phrase}
          >
            {phrase}
          </div>
        ))}
      </div>
      {!adding && (
        <button
          style={{
            padding: 20,
            fontSize: "4em",
            border: "1px solid #333",
            margin: 4,
            backgroundColor: "#333",
            cursor: "pointer",
          }}
          onClick={() => setAdding(true)}
        >
          +
        </button>
      )}
      {adding && (
        <div style={{ margin: 4, width: "100%" }}>
          <input
            style={{ fontSize: "2em", padding: 20 }}
            type="text"
            value={newPhrase}
            onChange={handleNewPhraseChanged}
            onKeyUp={handleAddingKeyUp}
            autoFocus
          />
        </div>
      )}
      <div
        style={{ fontSize: "10em", height: "100%" }}
        ref={sentenceDiv}
        onClick={addToSentence}
      >
        {sentence}
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          color: "#ccc",
          padding: 40,
          border: "1px solid #333",
          width: "100%",
          background: "#222",
        }}
      >
        <span style={{ padding: 20, border: "1px solid #aaa" }}>
          Mouse Click, Enter/Return: Add Phrase
        </span>
        <span style={{ padding: 20, border: "1px solid #aaa", marginLeft: 10 }}>
          Left Arrow: Go Back
        </span>
        <span style={{ padding: 20, border: "1px solid #aaa", marginLeft: 10 }}>
          Space Bar: Space
        </span>
        <span style={{ padding: 20, border: "1px solid #aaa", marginLeft: 10 }}>
          Backspace: Delete Last Word
        </span>
        <span style={{ padding: 20, border: "1px solid #aaa", marginLeft: 10 }}>
          Delete: Clear entire sentence
        </span>
      </div>
    </div>
  );
}

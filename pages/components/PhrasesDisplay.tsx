import { useEffect, useMemo, useRef, useState } from "react";
import useKeyPress from "../../hooks/useKeypress";
import { useMouseDown } from "../../hooks/useMouseDown";
import { inspect } from "../../helpers/inspect";
import Letter from "./Letter";

interface PhraseDisplayProps {
  play: boolean;
  speedMs: number;
}
if (typeof window !== "undefined") window.speechSynthesis.cancel();

const PossiblePhraseOptions = [
  "Thirsty",
  "Hungry",
  "Pain",
  "Tired",
  "Medicine",
  "Dirty",
  "Need a Change",
  "Dry Mouth",
  "Get up",
  "Love",
  "You",
] as const;

type PossiblePhrase = typeof PossiblePhraseOptions[number];

export default function PhrasesDisplay({ play, speedMs }: PhraseDisplayProps) {
  const [current, setCurrent] = useState(0);
  const [sentence, setSentence] = useState("");
  const parent = useRef<HTMLDivElement>(null);

  const enterPressed = useKeyPress("Enter", () => {
    setSentence((s) => s + PossiblePhraseOptions[current] + " ");
  });
  const leftPressed = useKeyPress("ArrowLeft", () => {
    setCurrent((c) => (c === 0 ? PossiblePhraseOptions.length - 1 : c - 1));
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

  const mousePressed = useMouseDown(parent.current, () => {
    setSentence((s) => s + PossiblePhraseOptions[current] + " ");
  });

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (play) {
      interval = setInterval(() => {
        setCurrent((c) => (c + 1) % PossiblePhraseOptions.length);
      }, speedMs);
    }
    return () => clearInterval(interval);
  }, [play, current, speedMs, sentence]);
  return (
    <div ref={parent} style={{ height: "100vh", width: "100vw" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {PossiblePhraseOptions.map((phrase, i) => (
          <div
            style={{
              padding: 20,
              fontSize: "4em",
              border: "1px solid #333",
              margin: 4,
              backgroundColor:
                PossiblePhraseOptions[i] === PossiblePhraseOptions[current]
                  ? "#AAA"
                  : "#333",
            }}
            key={i + "" + phrase}
          >
            {phrase}
          </div>
        ))}
      </div>
      <div style={{ fontSize: "10em" }}>{sentence}</div>
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

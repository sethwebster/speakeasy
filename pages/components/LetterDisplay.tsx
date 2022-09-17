import { useEffect, useMemo, useRef, useState } from "react";
import useKeyPress from "../../hooks/useKeypress";
import { useMouseDown } from "../../hooks/useMouseDown";
import Letter from "./Letter";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SPLIT = LETTERS.split("");

interface LettersDisplayProps {
  play: boolean;
  words: string[];
  speedMs: number;
}

function possibleLetters(sentence: string, words: string[]) {
  const sentenceWords = sentence.split(" ");
  const lastWord = sentenceWords[sentenceWords.length - 1].trim();
  if (lastWord.length === 0) {
    return { letters: SPLIT, words: [] };
  }
  const possibleWords = words.filter((word) => word.startsWith(lastWord));
  const suffixes = possibleWords.map((word) => word.replace(lastWord, ""));
  const possibleLetters = suffixes.reduce((all, suffix) => {
    const letters = suffix.split("");
    const nextLetter = letters[0];
    const existing = all.find((l) => l.letter === nextLetter);
    if (existing) {
      existing.count += 1;
    } else {
      if (LETTERS.includes(nextLetter)) {
        all.push({ letter: nextLetter, count: 1 });
      }
    }

    return all;
  }, [] as { letter: string; count: number }[]);
  return {
    letters: possibleLetters
      .sort((a, b) => b.count - a.count)
      .map((l) => l.letter),
    words: possibleWords,
  };
}

function inspect<T>(item: T, label: string): T {
  console.log(label, item);
  return item;
}

export default function LettersDisplay({
  play,
  words,
  speedMs,
}: LettersDisplayProps) {
  const [current, setCurrent] = useState(0);
  const [sentence, setSentence] = useState("");
  const parent = useRef<HTMLDivElement>(null);

  const { letters: letterSet, words: possibleWords } = useMemo(() => {
    return possibleLetters(sentence, words);
  }, [sentence, words]);

  const enterPressed = useKeyPress("Enter", () => {
    setSentence((s) => s + letterSet[current]);
    setCurrent(0);
  });
  const leftPressed = useKeyPress("ArrowLeft", () => {
    setCurrent((c) => (c === 0 ? letterSet.length - 1 : c - 1));
  });
  const backspacePressed = useKeyPress("Backspace", () => {
    setSentence((s) => s.trim().slice(0, s.trim().length - 1));
    setCurrent(0);
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
    setSentence((s) => s + letterSet[current]);
    setCurrent(0);
  });

  useEffect(() => {
    if (letterSet.length === 0) {
      setSentence((s) => s + " ");
      setCurrent(0);
    }
    // if (letterSet.length === 1 && !["Y", "S"].includes(letterSet[0])) {
    //   setSentence((s) => s + letterSet[0]);
    //   setCurrent(0);
    // }
  }, [letterSet, letterSet.length]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (play) {
      interval = setInterval(() => {
        setCurrent((c) => inspect((c + 1) % letterSet.length, "current"));
      }, speedMs);
    }
    return () => clearInterval(interval);
  }, [play, current, letterSet.length, speedMs, sentence]);

  const prePost = 3;
  let segment: string[] = [];

  const size = 7 > letterSet.length ? letterSet.length : 7;
  for (let x = 0; x < size; x++) {
    const index = inspect(
      (current + x - prePost + letterSet.length) % letterSet.length,
      "index"
    );

    segment.push(letterSet[index < 0 ? letterSet.length + index : index]);
  }

  segment = inspect(padBoth(segment.join(""), 7).split(""), "test");

  return (
    <div ref={parent} style={{ height: "100vh", width: "100vw" }}>
      <div
        style={{
          display: "flex",
        }}
      >
        {segment.map((letter, i) => (
          <Letter
            letter={letter}
            key={i + "" + letter}
            color={segment[i] === letterSet[current] ? "light" : "dark"}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          height: "2em",
          overflow: "hidden",
        }}
      >
        {possibleWords.slice(0, 20).map((word) => (
          <div
            key={word}
            style={{ padding: 10, marginLeft: 3, border: "1px solid #222" }}
          >
            {word}
          </div>
        ))}
      </div>
      <div style={{ fontSize: "10em", marginTop: 40 }}>{sentence}</div>
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
          Mouse Click, Enter/Return: Add Letter
        </span>
        <span style={{ padding: 20, border: "1px solid #aaa", marginLeft: 10 }}>
          Left Arrow: Go Back
        </span>
        <span style={{ padding: 20, border: "1px solid #aaa", marginLeft: 10 }}>
          Space Bar: Space, start new word
        </span>
        <span style={{ padding: 20, border: "1px solid #aaa", marginLeft: 10 }}>
          Backspace: Delete Last Character
        </span>
        <span style={{ padding: 20, border: "1px solid #aaa", marginLeft: 10 }}>
          Delete: Clear entire sentence
        </span>
      </div>
    </div>
  );
}

function padBoth(source: string, length: number) {
  const spaces = length - source.length;
  const padLeft = spaces / 2 + source.length;
  return source.padStart(padLeft).padEnd(length);
}

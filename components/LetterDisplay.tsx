import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useAppState from "../data/app-state";
import useKeyPress from "../hooks/useKeypress";
import { useMouseDown } from "../hooks/useMouseDown";
import Instructions from "./Instructions";
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

export default function LettersDisplay({
  play,
  words,
  speedMs,
}: LettersDisplayProps) {
  const [appState, setAppState] = useAppState();
  const [current, setCurrent] = useState(0);
  const parent = useRef<HTMLDivElement>(null);

  const sentence = appState.letterSentence || "";

  const setSentence = useCallback(
    (value: string | ((value: string) => void)) => {
      if (typeof value === "string") {
        setAppState((state) => ({
          ...state,
          letterSentence: value,
        }));
      }
      if (typeof value === "function") {
        setAppState((state) => ({
          ...state,
          letterSentence: value(state.letterSentence),
        }));
      }
    },
    [setAppState]
  );

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
  }, [letterSet, letterSet.length, setSentence]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (play) {
      interval = setInterval(() => {
        setCurrent((c) => (c + 1) % letterSet.length);
      }, speedMs);
    }
    return () => clearInterval(interval);
  }, [play, current, letterSet.length, speedMs, sentence]);

  const prePost = 3;
  let segment: string[] = [];

  const size = 7 > letterSet.length ? letterSet.length : 7;
  for (let x = 0; x < size; x++) {
    const index = (current + x - prePost + letterSet.length) % letterSet.length;

    segment.push(letterSet[index < 0 ? letterSet.length + index : index]);
  }

  segment = padBoth(segment.join(""), 7).split("");

  return (
    <div ref={parent} className="h-full w-full">
      <div className="flex">
        {segment.map((letter, i) => (
          <Letter
            letter={letter}
            key={i + "" + letter}
            color={segment[i] === letterSet[current] ? "light" : "dark"}
          />
        ))}
      </div>
      <div className="flex flex-wrap h-11 mt-2 overflow-hidden">
        {possibleWords.slice(0, 20).map((word) => (
          <div
            key={word}
            className="p-2 text-slate-500 ml-3 border border-slate-600 rounded-md mb-2 shadow-md"
          >
            {word}
          </div>
        ))}
      </div>
      <div className="text-9xl text-slate-300">{sentence}</div>
      <Instructions
        instructions={[
          "Mouse Click, Enter/Return: Add Letter",
          "Left Arrow: Go Back",
          "Space Bar: Space, start new word",
          "Backspace: Delete Last Character",

          "Delete: Clear entire sentence",
        ]}
      />
    </div>
  );
}

function padBoth(source: string, length: number) {
  const spaces = length - source.length;
  const padLeft = spaces / 2 + source.length;
  return source.padStart(padLeft).padEnd(length);
}

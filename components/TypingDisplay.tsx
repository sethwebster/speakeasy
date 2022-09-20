import { useEffect, useMemo, useRef, useState } from "react";
import useAppState from "../data/app-state";
import useKeyPress from "../hooks/useKeypress";
import { useMouseDown } from "../hooks/useMouseDown";
import Instructions from "./Instructions";
import Letter from "./Letter";

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-!@#$%^&*(){}|":?><,./=- ';
const SPLIT = LETTERS.split("");

interface TypingDisplayProps {}

export default function TypingDisplay({}: TypingDisplayProps) {
  const [state, setAppState] = useAppState();
  const textRef = useRef<HTMLTextAreaElement>(null);
  useKeyPress("Delete", () => setAppState((s) => ({ ...s, text: "" })));

  useEffect(() => {
    textRef.current?.focus();
  }, []);

  return (
    <div className="h-full w-full">
      <textarea
        ref={textRef}
        className="absolute opacity-0"
        value={state.typedSentence}
        autoFocus
        onChange={(e) =>
          setAppState((s) => ({ ...s, typedSentence: e.target.value }))
        }
      />
      <div className="text-9xl text-slate-300">{state.typedSentence}</div>
      <Instructions instructions={["Type to add letters"]} />
    </div>
  );
}

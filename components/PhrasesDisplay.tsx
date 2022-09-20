import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useKeyPress, { useScopedKeyPress } from "../hooks/useKeypress";
import { useMouseDown } from "../hooks/useMouseDown";
import { inspect } from "../helpers/inspect";
import Letter from "./Letter";
import useAppState from "../data/app-state";
import { useMouseUp } from "../hooks/useMouseUp";
import useInterval from "../hooks/useInterval";
import InstructionItem from "./InstructionItem";
import Instructions from "./Instructions";

interface PhraseDisplayProps {
  play: boolean;
  speedMs: number;
}

function DeleteConfirmButton({
  text,
  onConfirm,
}: {
  text: string;
  onConfirm: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      {!confirming && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setConfirming(true);
          }}
        >
          {text}
        </button>
      )}
      {confirming && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onConfirm();
          }}
        >
          Sure?
        </button>
      )}
    </>
  );
}

export default function PhrasesDisplay({ play, speedMs }: PhraseDisplayProps) {
  const [appState, setAppState] = useAppState();
  const [current, setCurrent] = useState(0);
  const [sentence, setSentence] = useState("");
  const [adding, setAdding] = useState(false);
  const [newPhrase, setNewPhrase] = useState("");
  const phrasesDiv = useRef<HTMLDivElement>(null);
  const sentenceDiv = useRef<HTMLDivElement>(null);
  const [mouseOverPause, setMouseOverPause] = useState(false);
  const [mousedOver, setMousedOver] = useState(-1);

  const addToSentence = useCallback(() => {
    startTransition(() => {
      setSentence((s) => s + appState.phrases[current] + " ");
    });
  }, [appState.phrases, current]);

  useKeyPress("ArrowLeft", () => {
    setCurrent((c) => (c === 0 ? appState.phrases.length - 1 : c - 1));
  });

  useKeyPress("Backspace", () => {
    setSentence((s) =>
      s
        .split(" ")
        .slice(0, s.split(" ").length - 1)
        .join(" ")
    );
  });

  useKeyPress("Delete", () => {
    setSentence("");
    setCurrent(0);
  });

  useKeyPress(" ", () => {
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

  const handleMouseOver = useCallback((index: number) => {
    setCurrent(index);
    setMousedOver(index);
    setMouseOverPause(true);
  }, []);

  const handleMouseOut = useCallback(() => {
    setMouseOverPause(false);
    setMousedOver(-1);
  }, []);

  useInterval(() => {
    if (play && !mouseOverPause) {
      setCurrent((c) => (c + 1) % appState.phrases.length);
    }
  }, speedMs);

  return (
    <div className="w-full h-full flex flex-col" id="phrases-wrapper">
      <div ref={phrasesDiv} className="flex flex-wrap w-full">
        {appState.phrases.map((phrase, i) => (
          <>
            <div
              onClick={addToSentence}
              onMouseOver={() => handleMouseOver(i)}
              onMouseOut={handleMouseOut}
              className={`text-6xl p-10 border-slate-600 border m-2 shadow-md rounded-sm ${
                appState.phrases[i] === appState.phrases[current]
                  ? "bg-gray-600  text-white"
                  : "bg-gray-900  text-slate-500"
              }`}
              key={i + "" + phrase}
            >
              {phrase}
              {mousedOver === i && (
                <div className="absolute text-sm">
                  <DeleteConfirmButton
                    onConfirm={() => {
                      setMousedOver(-1);
                      setMouseOverPause(false);
                      setAppState((s) => ({
                        ...s,
                        phrases: s.phrases.filter((p) => p !== phrase),
                      }));
                    }}
                    text={"Delete"}
                  />
                </div>
              )}
            </div>
            {/* Add the add button last */}
            {i === appState.phrases.length - 1 && !adding && (
              <button
                className="p-10 m-2 text-6xl bg-gray-900 text-slate-500 border cursor-pointer"
                onClick={() => setAdding(true)}
              >
                +
              </button>
            )}
          </>
        ))}
      </div>
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
        ref={sentenceDiv}
        onClick={addToSentence}
        className="text-8xl text-slate-300 h-full"
      >
        {sentence}
      </div>
      <Instructions
        instructions={[
          "Mouse Click, Enter/Return: Add Phrase",
          "Left Arrow: Go Back",
          "Space Bar: Space",
          "Backspace: Delete Last Word",
          "Delete: Clear entire sentence",
        ]}
      />
    </div>
  );
}

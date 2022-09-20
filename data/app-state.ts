import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { MenuSelection } from "../components/Menu";

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


interface AppState {
  mode: MenuSelection,
  phrases: string[],
}

export default function useAppState(): [AppState, (state: AppState | ((state: AppState) => void)) => void] {
  const [savedState, setSavedState] = useLocalStorage<AppState>("app-state", { mode: "Phrases", phrases: [...PossiblePhraseOptions] })
  return [savedState, setSavedState]
}

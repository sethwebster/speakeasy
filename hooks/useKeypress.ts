import { useCallback, useEffect, useState } from "react";

export function useScopedKeyPress(parent: HTMLElement | null | undefined, targetKey: string, callback: () => void) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);
  // If pressed key is our target key then set to true

  // If released key is our target key then set to false
  const upHandler = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    event.preventDefault();
    console.log("up", `'${key}'`);
    if (key === targetKey) {
      callback()
    }
  }, [callback, targetKey]);
  // Add event listeners
  useEffect(() => {
    if (!parent) return;
    parent.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keyup", upHandler);
    };
  }, [parent, upHandler]); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
}

export default function useKeyPress(targetKey: string, callback: () => void) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);
  // If pressed key is our target key then set to true

  // If released key is our target key then set to false
  const upHandler = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    event.preventDefault();
    console.log("up", `'${key}'`);
    if (key === targetKey) {
      callback()
    }
  }, [callback, targetKey]);
  // Add event listeners
  useEffect(() => {
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keyup", upHandler);
    };
  }, [upHandler]); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
}
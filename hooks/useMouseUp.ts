import { useCallback, useEffect, useState } from "react";

export function useMouseUp(parent: HTMLElement | null | undefined, callback: () => void) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);
  // If pressed key is our target key then set to true
  // If released key is our target key then set to false
  const upHandler = useCallback((event: MouseEvent) => {
    event.preventDefault();
    callback();
  }, [callback]);
  // Add event listeners
  useEffect(() => {
    if (!parent) return;
    parent.addEventListener("mouseup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      parent.removeEventListener("mouseup", upHandler);
    };
  }, [parent, upHandler]); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
}

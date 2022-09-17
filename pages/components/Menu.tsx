import { Children, useState } from "react";

const MenuOptions = ["Phrases", "Letters"] as const;

export type MenuSelection = typeof MenuOptions[number];

interface MenuProps {
  current: MenuSelection;
  onChange: (selection: MenuSelection) => void;
  children?: React.ReactNode | React.ReactNode[];
}

export default function Menu({ current, onChange, children }: MenuProps) {
  const kids = Children.toArray(children);
  return (
    <nav>
      <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
        {MenuOptions.map((option) => (
          <li key={option}>
            <button
              style={{
                background: current === option ? "#aaa" : "none",
                border: "1px solid #333",
                padding: 20,
                cursor: "pointer",
                fontSize: "1.5em",
              }}
              onClick={(e) => {
                e.preventDefault();
                onChange(option);
              }}
            >
              {option}
            </button>
          </li>
        ))}
        {kids?.map((child, i) => (
          <li key={`child-${i}`}>{child}</li>
        ))}
      </ul>
    </nav>
  );
}

import { Children, useState } from "react";

const MenuOptions = ["Phrases", "Letters", "Typing"] as const;

export type MenuSelection = typeof MenuOptions[number];

interface MenuProps {
  current: MenuSelection;
  onChange: (selection: MenuSelection) => void;
  children?: React.ReactNode | React.ReactNode[];
}

function MenuItem({
  selected,
  title,
  onClick,
}: {
  selected: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        className={`${
          selected ? "bg-gray-400" : "bg-gray-600"
        } cursor-pointer p-2 text-2xl text-white m-2 h-full shadow-md rounded-sm`}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        {title}
      </button>
    </li>
  );
}

export default function Menu({ current, onChange, children }: MenuProps) {
  const kids = Children.toArray(children);
  return (
    <nav className="h-20 bg-gray-700 shadow-md fixed w-full">
      <ul className="flex-row flex">
        {MenuOptions.map((option) => (
          <MenuItem
            key={option}
            selected={current === option}
            title={option}
            onClick={() => onChange(option)}
          />
        ))}
        {kids?.map((child, i) => (
          <li key={`child-${i}`}>{child}</li>
        ))}
      </ul>
    </nav>
  );
}

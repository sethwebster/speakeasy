export default function Letter({
  letter,
  color,
}: {
  letter: string;
  color: "dark" | "light";
}) {
  return (
    <div
      className={`text-9xl text-center h-36 w-1/6 border border-slate-800 ${
        color === "dark" ? "text-slate-600" : "text-slate-400"
      } `}
    >
      {letter}
    </div>
  );
}

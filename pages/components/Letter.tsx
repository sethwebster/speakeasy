export default function Letter({
  letter,
  color,
}: {
  letter: string;
  color: "dark" | "light";
}) {
  return (
    <div
      style={{
        fontSize: "11em",
        textAlign: "center",
        height: "200px",
        width: "200px",
        margin: 0,
        padding: 0,
        flex: 1,
        border: "1px solid #333",
        color: color === "dark" ? "#333" : "white",
      }}
    >
      {letter}
    </div>
  );
}

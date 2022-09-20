import InstructionItem from "./InstructionItem";

export default function Instructions({
  instructions,
}: {
  instructions: string[];
}) {
  return (
    <div className="fixed bottom-0 w-full bg-slate-900 p-4 border-t border-t-slate-700 flex justify-center ">
      {instructions.map((instruction) => (
        <InstructionItem key={instruction} title={instruction} />
      ))}
    </div>
  );
}

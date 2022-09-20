export default function InstructionItem({ title }: { title: string }) {
  return (
    <div className="border border-slate-700 p-5 text-slate-300 mr-2 justify-evenly rounded-sm shadow-sm">
      {title}
    </div>
  );
}

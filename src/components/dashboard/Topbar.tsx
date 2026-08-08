export default function Topbar({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 lg:px-8 pt-8 pb-2">
      <h1 className="font-display text-2xl text-text">{title}</h1>
      {right}
    </div>
  );
}

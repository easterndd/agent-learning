export function EmptyState({ title, detail }: Readonly<{ title: string; detail: string }>) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-white p-8">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </div>
  );
}

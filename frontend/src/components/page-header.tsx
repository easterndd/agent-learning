export function PageHeader({
  title,
  description
}: Readonly<{ title: string; description: string }>) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold tracking-normal text-ink">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>
    </header>
  );
}

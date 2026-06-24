import { PageHeader } from "@/components/page-header";

const metrics = [
  { label: "Knowledge bases", value: "0" },
  { label: "Documents", value: "0" },
  { label: "Chunks", value: "0" },
  { label: "Answers", value: "0" }
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Track the MVP RAG loop across knowledge bases, documents, chunks, and answers."
      />
      <section className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div className="rounded-lg border border-border bg-white p-4" key={metric.label}>
            <div className="text-sm text-muted">{metric.label}</div>
            <div className="mt-2 text-2xl font-semibold text-ink">{metric.value}</div>
          </div>
        ))}
      </section>
    </>
  );
}

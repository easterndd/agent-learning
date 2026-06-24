import { PageHeader } from "@/components/page-header";

export default function RagPage() {
  return (
    <>
      <PageHeader
        title="RAG Q&A"
        description="Choose a knowledge base and prompt template, then inspect answers, citations, and retrieved chunks."
      />
      <section className="rounded-lg border border-border bg-white p-5">
        <textarea className="min-h-32 w-full rounded-md border border-border p-3 text-sm" placeholder="Ask a question" />
        <button className="mt-4 h-10 rounded-md bg-brand px-4 text-sm font-medium text-white" type="button">
          Ask
        </button>
      </section>
    </>
  );
}

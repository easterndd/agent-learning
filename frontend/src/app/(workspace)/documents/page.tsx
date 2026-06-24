import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        title="Documents"
        description="Upload PDF, Markdown, TXT, and CSV files, then track parsing, chunking, and indexing status."
      />
      <EmptyState title="No documents yet" detail="M2 will add upload, parsing, chunk storage, and embedding status." />
    </>
  );
}

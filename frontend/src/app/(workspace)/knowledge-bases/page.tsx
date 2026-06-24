import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export default function KnowledgeBasesPage() {
  return (
    <>
      <PageHeader
        title="Knowledge Bases"
        description="Create and manage enterprise knowledge bases, document counts, and indexing status."
      />
      <EmptyState
        title="No knowledge bases yet"
        detail="A later vertical slice will add create, list, delete, and ownership checks."
      />
    </>
  );
}

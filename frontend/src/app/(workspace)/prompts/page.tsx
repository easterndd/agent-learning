import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export default function PromptsPage() {
  return (
    <>
      <PageHeader title="Prompt Templates" description="Manage prompt templates, task types, variables, and versions." />
      <EmptyState title="No prompt templates yet" detail="M4 will add template creation, versioning, and RAG binding." />
    </>
  );
}

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export default function LogsPage() {
  return (
    <>
      <PageHeader
        title="System Logs"
        description="Inspect upload, parsing, Q&A, and error logs for evaluation and troubleshooting."
      />
      <EmptyState title="No logs yet" detail="Backend use cases will write structured system logs as they are implemented." />
    </>
  );
}

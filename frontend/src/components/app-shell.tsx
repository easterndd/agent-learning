import Link from "next/link";
import { BookOpen, FileText, LayoutDashboard, MessageSquare, ScrollText, Terminal } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/knowledge-bases", label: "Knowledge", icon: BookOpen },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/rag", label: "RAG Q&A", icon: MessageSquare },
  { href: "/prompts", label: "Prompt", icon: ScrollText },
  { href: "/logs", label: "Logs", icon: Terminal }
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-white lg:block">
        <div className="border-b border-border px-5 py-4">
          <div className="text-sm font-semibold">Enterprise AI Copilot Lab</div>
          <div className="mt-1 text-xs text-muted">MVP RAG Workspace</div>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className="flex h-10 items-center gap-3 rounded-md px-3 text-sm text-ink hover:bg-surface"
                href={item.href}
                key={item.href}
              >
                <Icon aria-hidden className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-6">{children}</div>
      </main>
    </div>
  );
}

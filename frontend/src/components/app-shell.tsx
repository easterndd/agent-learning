"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, HelpCircle, Search, Zap } from "lucide-react";
import { cn } from "@/components/ui-primitives";
import { navGroups } from "@/lib/mock-data";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-[250px] border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold leading-tight text-slate-950">Enterprise AI</div>
            <div className="text-sm font-bold leading-tight text-slate-950">Copilot Lab</div>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-3">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="mb-2 px-2 text-xs font-medium text-slate-400">{group.label}</div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  const className = cn(
                    "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
                    active ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                    item.disabled && "cursor-not-allowed opacity-45"
                  );
                  return item.disabled ? (
                    <div className={className} key={item.label}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  ) : (
                    <Link className={className} href={item.href} key={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="h-8 w-8 rounded-full bg-slate-900 text-center text-xs font-bold leading-8 text-white">A</div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900">admin</div>
              <div className="text-xs text-slate-400">MVP Workspace</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[250px]">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-100 bg-white/85 px-6 backdrop-blur">
          <div className="relative hidden w-[360px] md:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="lab-input w-full pl-11" placeholder="搜索知识库、文档、问答..." />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-400">⌘ K</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100" type="button">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" type="button">
              <HelpCircle className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-500 text-center text-sm font-bold leading-9 text-white">A</div>
              <span className="text-sm font-semibold text-slate-900">admin</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </header>
        <main className="px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

import { ChevronRight, Megaphone } from "lucide-react";
import { documents, metrics, quickActions, recentQuestions } from "@/lib/mock-data";
import { MetricCard, PageTitle, ProgressBar, StatusBadge } from "@/components/ui-primitives";

export default function DashboardPage() {
  return (
    <div>
      <PageTitle title="Dashboard" description="欢迎回来，admin！这里是 Enterprise AI Copilot Lab 的工作中心。" />

      <section className="grid gap-4 xl:grid-cols-6 md:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr_0.8fr]">
        <div className="lab-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-950">最近上传的文档</h2>
            <button className="text-sm font-medium text-blue-600" type="button">查看全部</button>
          </div>
          <div className="space-y-4">
            {documents.slice(0, 5).map((doc) => (
              <div className="grid grid-cols-[1fr_120px_90px] items-center gap-3 text-sm" key={doc.name}>
                <div className="font-medium text-slate-800">{doc.name}</div>
                <div className="text-slate-500">{doc.kb}</div>
                <StatusBadge value={doc.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="lab-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-950">最近的问答记录</h2>
            <button className="text-sm font-medium text-blue-600" type="button">查看全部</button>
          </div>
          <div className="space-y-4">
            {recentQuestions.map((item) => (
              <div className="grid grid-cols-[1fr_80px_96px] items-center gap-3 text-sm" key={item.question}>
                <div className="font-medium text-slate-800">{item.question}</div>
                <div className="text-orange-400">{item.score}</div>
                <div className="text-xs text-slate-500">{item.time.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lab-card p-5">
          <h2 className="font-bold text-slate-950">任务状态统计</h2>
          <div className="mt-6 flex items-center justify-center">
            <div className="grid h-40 w-40 place-items-center rounded-full bg-[conic-gradient(#22c55e_0_62%,#f97316_62%_81%,#3b82f6_81%_94%,#ef4444_94%_100%)]">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center">
                <div>
                  <div className="text-2xl font-bold">32</div>
                  <div className="text-xs text-slate-500">总任务数</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr_0.8fr]">
        <div className="lab-card p-5">
          <h2 className="font-bold text-slate-950">任务队列</h2>
          <div className="mt-5 space-y-4">
            {documents.slice(0, 4).map((doc) => (
              <div className="grid grid-cols-[1fr_90px_130px_44px] items-center gap-3 text-sm" key={doc.name}>
                <div>
                  <div className="font-medium text-slate-800">{doc.name}</div>
                  <div className="text-xs text-slate-400">{doc.kb}</div>
                </div>
                <div className="text-slate-500">{doc.stage}</div>
                <ProgressBar value={doc.progress} tone={doc.progress === 100 ? "emerald" : doc.progress < 40 ? "orange" : "blue"} />
                <div className="text-xs text-slate-500">{doc.progress}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lab-card p-5">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-bold text-slate-950">近 7 天问答趋势</h2>
            <span className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500">近 7 天</span>
          </div>
          <div className="flex h-40 items-end gap-3 border-b border-slate-100 px-2">
            {[140, 230, 180, 315, 190, 310, 260, 410].map((value, index) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={value}>
                <div className="w-full rounded-t-lg bg-blue-500/80" style={{ height: `${value / 4}px` }} />
                <span className="text-[11px] text-slate-400">05-{14 + index}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lab-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-blue-600" />
            <h2 className="font-bold text-slate-950">系统公告</h2>
          </div>
          {["系统版本更新至 v1.2.0", "新增 Markdown 格式解析", "优化了 RAG 检索算法"].map((item) => (
            <div className="flex items-center justify-between border-b border-slate-100 py-3 text-sm last:border-0" key={item}>
              <span className="text-slate-700">{item}</span>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
          ))}
        </div>
      </section>

      <section className="lab-card mt-4 p-5">
        <h2 className="font-bold text-slate-950">快捷操作</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <button className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50" key={item.label} type="button">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{item.label}</div>
                  <div className="text-sm text-slate-500">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

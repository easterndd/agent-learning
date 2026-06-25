import { Copy, Edit3, MoreHorizontal, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { prompts } from "@/lib/mock-data";
import { MetricCard, PageTitle, StatusBadge } from "@/components/ui-primitives";
import { BarChart3, MessageSquare, PenLine, ScrollText } from "lucide-react";

const promptMetrics = [
  { label: "全部模板", value: "32", icon: ScrollText, tone: "blue" },
  { label: "通用模板", value: "12", icon: MessageSquare, tone: "emerald" },
  { label: "问答模板", value: "8", icon: MessageSquare, tone: "orange" },
  { label: "分析模板", value: "4", icon: BarChart3, tone: "violet" },
  { label: "写作模板", value: "2", icon: PenLine, tone: "blue" }
];

export default function PromptsPage() {
  return (
    <div>
      <PageTitle title="Prompt 模板" description="创建、管理和复用 Prompt 模板，提升 AI 回答的质量和一致性。" />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button className="lab-button-primary" type="button"><Plus className="h-4 w-4" />新建模板</button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="lab-input w-80 pl-9" placeholder="搜索模板名称、描述、标签..." />
        </div>
        <select className="lab-input w-40"><option>全部分类</option></select>
        <select className="lab-input w-40"><option>全部状态</option></select>
        <button className="lab-button w-10 px-0" type="button"><RefreshCw className="h-4 w-4" /></button>
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        {promptMetrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </section>

      <section className="lab-card mt-4 overflow-hidden p-5">
        <h2 className="mb-4 font-bold text-slate-950">模板列表</h2>
        <div className="grid grid-cols-[1.2fr_100px_1.4fr_90px_190px_100px_130px_90px_120px] border-b border-slate-100 py-3 text-xs font-bold text-slate-500">
          <div>模板名称</div><div>分类</div><div>描述</div><div>模型</div><div>标签</div><div>创建人</div><div>更新时间</div><div>状态</div><div>操作</div>
        </div>
        {prompts.map((prompt) => (
          <div className="grid grid-cols-[1.2fr_100px_1.4fr_90px_190px_100px_130px_90px_120px] items-center border-b border-slate-100 py-4 text-sm last:border-0" key={prompt.name}>
            <div>
              <div className="font-bold text-slate-900">{prompt.name}</div>
              <div className="text-xs text-slate-400">{prompt.version}</div>
            </div>
            <span className="w-fit rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">{prompt.category}</span>
            <div className="text-slate-600">{prompt.desc}</div>
            <div className="font-mono text-xs text-slate-700">{prompt.model}</div>
            <div className="flex flex-wrap gap-1">{prompt.tags.map((tag) => <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600" key={tag}>{tag}</span>)}</div>
            <div className="text-slate-700">admin</div>
            <div className="text-slate-500">{prompt.updated}</div>
            <StatusBadge value={prompt.status} />
            <div className="flex gap-3 text-slate-500"><Edit3 className="h-4 w-4" /><Copy className="h-4 w-4" /><Trash2 className="h-4 w-4 text-rose-500" /><MoreHorizontal className="h-4 w-4" /></div>
          </div>
        ))}
      </section>
    </div>
  );
}

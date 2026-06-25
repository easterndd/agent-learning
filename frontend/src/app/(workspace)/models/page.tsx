import { Activity, CheckCircle2, Eye, KeyRound, Plus, RefreshCw, Route, ShieldCheck, Zap } from "lucide-react";
import { modelProviders } from "@/lib/mock-data";
import { MetricCard, PageTitle, StatusBadge } from "@/components/ui-primitives";

const modelMetrics = [
  { label: "供应商", value: "3", icon: Route, tone: "blue" },
  { label: "可用模型", value: "9", icon: Zap, tone: "emerald" },
  { label: "默认模型", value: "1", icon: CheckCircle2, tone: "violet" },
  { label: "平均延迟", value: "314ms", icon: Activity, tone: "orange" }
];

export default function ModelsPage() {
  return (
    <div>
      <PageTitle
        title="模型中心"
        description="参考 cc-switch 的供应商切换思路，统一管理自定义大模型接入，为 RAG、Prompt 和 Agent 提供默认模型配置。"
      />

      <section className="grid gap-4 md:grid-cols-4">
        {modelMetrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="lab-card overflow-hidden p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold text-slate-950">模型供应商</h2>
            <div className="flex gap-3">
              <button className="lab-button" type="button"><RefreshCw className="h-4 w-4" />健康检查</button>
              <button className="lab-button-primary" type="button"><Plus className="h-4 w-4" />添加供应商</button>
            </div>
          </div>
          <div className="grid grid-cols-[1.2fr_150px_1.2fr_140px_140px_150px_90px_110px] border-b border-slate-100 py-3 text-xs font-bold text-slate-500">
            <div>供应商</div><div>类型</div><div>API 地址</div><div>聊天模型</div><div>Embedding</div><div>能力</div><div>状态</div><div>操作</div>
          </div>
          {modelProviders.map((provider) => (
            <div className="grid grid-cols-[1.2fr_150px_1.2fr_140px_140px_150px_90px_110px] items-center border-b border-slate-100 py-4 text-sm last:border-0" key={provider.name}>
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-950">
                  {provider.name}
                  {provider.isDefault ? <span className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600">默认</span> : null}
                </div>
                <div className="mt-1 text-xs text-slate-400">延迟 {provider.latency}</div>
              </div>
              <div className="text-slate-600">{provider.providerType}</div>
              <div className="truncate font-mono text-xs text-slate-500">{provider.baseUrl}</div>
              <div className="font-mono text-xs text-slate-700">{provider.chatModel}</div>
              <div className="font-mono text-xs text-slate-700">{provider.embeddingModel}</div>
              <div className="flex flex-wrap gap-1">
                {provider.capabilities.map((capability) => <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600" key={capability}>{capability}</span>)}
              </div>
              <StatusBadge value={provider.status} />
              <div className="flex gap-3 text-slate-500"><Eye className="h-4 w-4" /><KeyRound className="h-4 w-4 text-blue-600" /></div>
            </div>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="lab-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-600" />
              <h2 className="font-bold text-slate-950">添加自定义接入</h2>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">供应商名称<input className="lab-input mt-2 w-full" placeholder="例如：DMXAPI / 硅基流动 / 公司网关" /></label>
              <label className="block text-sm font-semibold text-slate-700">协议类型<select className="lab-input mt-2 w-full"><option>OpenAI Compatible</option><option>Ollama</option><option>Anthropic</option><option>Custom</option></select></label>
              <label className="block text-sm font-semibold text-slate-700">Base URL<input className="lab-input mt-2 w-full" placeholder="https://api.example.com/v1" /></label>
              <label className="block text-sm font-semibold text-slate-700">API Key<input className="lab-input mt-2 w-full" placeholder="仅保存到后端，不在列表回显" type="password" /></label>
              <label className="block text-sm font-semibold text-slate-700">Chat Model<input className="lab-input mt-2 w-full" placeholder="deepseek-chat / qwen-plus" /></label>
              <label className="block text-sm font-semibold text-slate-700">Embedding Model<input className="lab-input mt-2 w-full" placeholder="BAAI/bge-m3" /></label>
              <button className="lab-button-primary w-full" type="button">保存供应商配置</button>
            </div>
          </div>

          <div className="lab-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h2 className="font-bold text-slate-950">RAG 使用方式</h2>
            </div>
            <ol className="space-y-3 text-sm text-slate-600">
              <li>1. 默认 Chat Model 用于 RAG 答案生成。</li>
              <li>2. Embedding Model 用于文档向量化和问题向量化。</li>
              <li>3. Rerank Model 后续用于混合检索后的重排。</li>
              <li>4. 供应商不可用时可切换备用网关。</li>
            </ol>
          </div>
        </aside>
      </section>
    </div>
  );
}

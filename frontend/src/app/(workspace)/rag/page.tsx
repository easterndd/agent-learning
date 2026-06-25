import { Link2, RotateCw, Send, SlidersHorizontal, ThumbsDown, ThumbsUp } from "lucide-react";
import { PageTitle } from "@/components/ui-primitives";

const sources = [
  ["员工手册.pdf", "企业制度库", "0.92", "第4.2.1条"],
  ["人力资源管理制度.pdf", "企业制度库", "0.89", "第7.3条"],
  ["考勤与假期管理规定.pdf", "企业制度库", "0.85", "第3.1-3.3条"],
  ["常见问题解答.docx", "企业制度库", "0.78", "年假相关"]
];

export default function RagPage() {
  return (
    <div>
      <PageTitle title="RAG 问答" description="基于企业知识库的智能问答，提供准确、可靠的知识检索与回答服务。" />
      <div className="lab-card mb-4 flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <div className="text-sm font-bold text-slate-900">当前默认模型：OpenAI Compatible Gateway / gpt-4o-mini</div>
          <div className="mt-1 text-xs text-slate-500">RAG 生成、Embedding 和后续 Rerank 会统一读取模型中心的默认供应商配置。</div>
        </div>
        <a className="lab-button" href="/models">配置模型中心</a>
      </div>
      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="lab-card p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">选择知识库</span>
              <select className="lab-input min-w-80 flex-1"><option>企业制度库、技术文档库、产品资料库</option></select>
              <button className="lab-button" type="button"><SlidersHorizontal className="h-4 w-4" />检索设置</button>
              <button className="lab-button" type="button">对话历史</button>
            </div>
          </div>

          <div className="lab-card p-5">
            <div className="rounded-2xl bg-blue-50 p-5">
              <div className="font-semibold text-slate-900">请问公司年假政策是怎样的？最多可以请多少天年假？</div>
              <div className="mt-2 text-sm text-slate-500">2024-05-20 14:30</div>
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200 p-5">
              <div className="prose prose-sm max-w-none text-slate-700">
                <p>根据公司《员工手册》和《人力资源管理制度》的相关规定，年假政策如下：</p>
                <p><strong>1. 年假天数</strong></p>
                <ul>
                  <li>工作满 1 年不满 5 年的员工，年假为 5 天；</li>
                  <li>工作满 5 年不满 10 年的员工，年假为 10 天；</li>
                  <li>工作满 10 年及以上的员工，年假为 15 天。</li>
                </ul>
                <p><strong>2. 年假使用规则</strong></p>
                <ul>
                  <li>年假应在当年度内使用完毕，原则上不跨年度累计；</li>
                  <li>连续休假需提前 3 个工作日提交审批。</li>
                </ul>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
                <span>回答完成</span><span>引用 5 个来源</span><span>耗时 3.2s</span>
                <div className="ml-auto flex gap-3"><ThumbsUp className="h-4 w-4" /><ThumbsDown className="h-4 w-4" /></div>
              </div>
            </div>
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">相关问题推荐</h3>
                <RotateCw className="h-4 w-4 text-slate-400" />
              </div>
              <div className="flex flex-wrap gap-3">
                {["年假可以累计到下一年吗？", "年假的申请流程是什么？", "试用期员工有年假吗？", "病假会影响年假吗？"].map((item) => (
                  <button className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600" key={item} type="button">{item}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="lab-card border-blue-300 p-4">
            <textarea className="min-h-24 w-full resize-none rounded-xl border-0 bg-transparent text-sm outline-none" placeholder="输入你的问题，Enter 发送，Shift + Enter 换行" />
            <div className="flex items-center justify-between">
              <button className="lab-button" type="button"><Link2 className="h-4 w-4" />深度思考（R1）</button>
              <button className="lab-button-primary h-11 w-11 px-0" type="button"><Send className="h-5 w-5" /></button>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="lab-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-950">参考来源</h2>
              <span className="text-sm text-slate-500">共 5 个来源</span>
            </div>
            <div className="space-y-4">
              {sources.map((source, index) => (
                <div className="grid grid-cols-[28px_1fr_70px] gap-3" key={source[0]}>
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-blue-600 text-xs font-bold text-white">{index + 1}</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{source[0]}</div>
                    <div className="mt-1 text-xs text-slate-500">{source[1]}</div>
                  </div>
                  <div className="text-right text-xs text-slate-500">相似度 {source[2]}<br /><span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-1">{source[3]}</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className="lab-card p-5">
            <h2 className="font-bold text-slate-950">检索设置</h2>
            <div className="mt-5 space-y-5 text-sm">
              <label className="flex items-center justify-between">召回 Top K<input className="lab-input w-16 text-center" defaultValue="10" /></label>
              <label className="flex items-center justify-between">相似度阈值<input className="lab-input w-16 text-center" defaultValue="0.70" /></label>
              <label className="block">重排模型<select className="lab-input mt-2 w-full"><option>bge-reranker-v2-m3</option></select></label>
              <label className="flex items-center justify-between">混合检索<span className="h-6 w-11 rounded-full bg-blue-600 p-0.5"><span className="block h-5 w-5 translate-x-5 rounded-full bg-white" /></span></label>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

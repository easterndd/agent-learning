import { Eye, FileArchive, FileText, Settings, Trash2, UploadCloud } from "lucide-react";
import { documents } from "@/lib/mock-data";
import { PageTitle, ProgressBar, StatusBadge } from "@/components/ui-primitives";

export default function DocumentsPage() {
  return (
    <div>
      <PageTitle title="上传文档" description="将文档上传到知识库进行解析、切分和向量化处理，完成后可用于 RAG 检索和问答。" />
      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr_0.9fr]">
        <div className="lab-card p-5">
          <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-blue-300 bg-blue-50/30 p-8 text-center">
            <div>
              <UploadCloud className="mx-auto h-14 w-14 text-blue-600" />
              <div className="mt-4 font-semibold text-slate-900">将文件拖拽到此处，或点击选择文件</div>
              <div className="mt-2 text-sm text-slate-500">支持 PDF、DOCX、TXT、MD、CSV，单个文件最大 200MB</div>
              <button className="lab-button-primary mt-5" type="button"><UploadCloud className="h-4 w-4" />选择文件</button>
            </div>
          </div>
          <label className="mt-5 block text-sm font-semibold text-slate-700">当前知识库</label>
          <select className="lab-input mt-2 w-full"><option>企业制度库</option><option>技术文档库</option></select>
        </div>

        <div className="lab-card p-5">
          <h2 className="font-bold text-slate-950">上传设置</h2>
          <div className="mt-5 space-y-4">
            {["自动选择（推荐）", "快速解析", "高精度解析"].map((item, index) => (
              <label className="flex gap-3 text-sm" key={item}>
                <input defaultChecked={index === 0} name="parser" type="radio" />
                <span>
                  <span className="block font-semibold text-slate-800">{item}</span>
                  <span className="text-slate-500">{index === 0 ? "系统自动选择最优解析方式" : index === 1 ? "适合结构简单的文档" : "适合复杂版式，耗时较长"}</span>
                </span>
              </label>
            ))}
          </div>
          <label className="mt-6 block text-sm font-semibold text-slate-700">切分策略</label>
          <select className="lab-input mt-2 w-full"><option>默认切分策略（推荐）</option></select>
          <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600" type="button"><Settings className="h-4 w-4" />高级设置</button>
        </div>

        <div className="space-y-4">
          <div className="lab-card p-5">
            <h2 className="font-bold text-slate-950">上传说明</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li>文档将自动解析、切分并生成向量。</li>
              <li>处理完成后即可用于 RAG 检索和问答。</li>
              <li>建议单个文件不超过 200MB。</li>
            </ul>
          </div>
          <div className="lab-card p-5">
            <h2 className="font-bold text-slate-950">支持的文件格式</h2>
            <div className="mt-4 flex gap-3">
              {["PDF", "DOC", "TXT", "MD", "CSV"].map((item) => (
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700" key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lab-card mt-4 overflow-hidden p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-950">上传任务</h2>
          <button className="lab-button" type="button">清空已完成</button>
        </div>
        <div className="grid grid-cols-[1.2fr_1fr_90px_90px_150px_130px_160px_80px] border-b border-slate-100 py-3 text-xs font-bold text-slate-500">
          <div>文件名称</div><div>知识库</div><div>大小</div><div>状态</div><div>进度</div><div>处理阶段</div><div>创建时间</div><div>操作</div>
        </div>
        {documents.map((doc) => (
          <div className="grid grid-cols-[1.2fr_1fr_90px_90px_150px_130px_160px_80px] items-center border-b border-slate-100 py-4 text-sm last:border-0" key={doc.name}>
            <div className="flex items-center gap-2 font-medium text-slate-900"><FileText className="h-4 w-4 text-blue-600" />{doc.name}</div>
            <div className="text-slate-600">{doc.kb}</div>
            <div className="text-slate-500">{doc.size}</div>
            <StatusBadge value={doc.status} />
            <div className="flex items-center gap-2"><span className="w-9 text-xs text-slate-500">{doc.progress}%</span><ProgressBar value={doc.progress} tone={doc.progress === 100 ? "emerald" : doc.progress < 40 ? "orange" : "blue"} /></div>
            <div className="text-slate-500">{doc.stage}</div>
            <div className="text-slate-500">{doc.created}</div>
            <div className="flex gap-3"><Eye className="h-4 w-4 text-blue-600" /><FileArchive className="h-4 w-4 text-slate-500" /><Trash2 className="h-4 w-4 text-rose-500" /></div>
          </div>
        ))}
      </section>
    </div>
  );
}

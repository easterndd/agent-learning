import { Download, RefreshCw, Search } from "lucide-react";
import { logs } from "@/lib/mock-data";
import { PageTitle, StatusBadge } from "@/components/ui-primitives";

export default function LogsPage() {
  return (
    <div>
      <PageTitle title="系统日志" description="记录系统中各类操作行为，支持查询、筛选和导出日志。" />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input className="lab-input w-80" defaultValue="2024-05-13 00:00:00  ~  2024-05-20 23:59:59" />
        <select className="lab-input w-40"><option>全部模块</option></select>
        <select className="lab-input w-44"><option>全部操作类型</option></select>
        <select className="lab-input w-40"><option>全部状态</option></select>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="lab-input w-80 pr-9" placeholder="搜索用户名、操作内容、IP 地址..." />
        </div>
        <button className="lab-button" type="button"><RefreshCw className="h-4 w-4" />刷新</button>
        <button className="lab-button" type="button"><Download className="h-4 w-4" />导出日志</button>
      </div>

      <section className="lab-card overflow-hidden p-5">
        <div className="grid grid-cols-[160px_130px_120px_140px_1.4fr_90px_130px_150px_70px] border-b border-slate-100 py-3 text-xs font-bold text-slate-500">
          <div>时间</div><div>用户</div><div>模块</div><div>操作类型</div><div>操作内容</div><div>状态</div><div>IP 地址</div><div>浏览器</div><div>操作</div>
        </div>
        {logs.map((log) => (
          <div className="grid grid-cols-[160px_130px_120px_140px_1.4fr_90px_130px_150px_70px] items-center border-b border-slate-100 py-4 text-sm last:border-0" key={`${log.time}-${log.detail}`}>
            <div className="font-mono text-xs text-slate-600">{log.time}</div>
            <div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-xs font-bold">{log.user[0].toUpperCase()}</span>{log.user}</div>
            <div>{log.module}</div>
            <div><span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />{log.action}</div>
            <div className="text-slate-700">{log.detail}</div>
            <StatusBadge value={log.status} />
            <div className="font-mono text-xs text-slate-600">{log.ip}</div>
            <div className="text-slate-600">{log.browser}</div>
            <button className="font-semibold text-blue-600" type="button">详情</button>
          </div>
        ))}
        <div className="flex items-center justify-between pt-5 text-sm text-slate-500">
          <span>共 1,256 条</span>
          <div className="flex gap-2"><button className="lab-button h-9 w-9 px-0" type="button">1</button><button className="lab-button h-9 w-9 px-0" type="button">2</button><button className="lab-button h-9 w-9 px-0" type="button">3</button></div>
        </div>
      </section>
    </div>
  );
}

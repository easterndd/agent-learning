import type { LucideIcon } from "lucide-react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function StatusBadge({ value }: { value: string }) {
  const style =
    value.includes("失败") || value.includes("禁用")
      ? "bg-rose-50 text-rose-600"
      : value.includes("中") || value.includes("上传")
        ? "bg-orange-50 text-orange-600"
        : "bg-emerald-50 text-emerald-600";
  return <span className={cn("rounded-md px-2 py-1 text-xs font-semibold", style)}>{value}</span>;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  delta,
  tone = "blue"
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  tone?: string;
}) {
  const tones: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    orange: "bg-orange-50 text-orange-600",
    cyan: "bg-cyan-50 text-cyan-600",
    rose: "bg-rose-50 text-rose-600"
  };
  return (
    <div className="lab-card p-5">
      <div className="flex items-center gap-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", tones[tone])}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-700">{label}</div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</div>
          {delta ? <div className="mt-2 text-xs text-slate-500">较昨日 <span className="font-semibold text-emerald-600">{delta}</span></div> : null}
        </div>
      </div>
    </div>
  );
}

export function PageTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export function ProgressBar({ value, tone = "blue" }: { value: number; tone?: "blue" | "orange" | "emerald" }) {
  const colors = { blue: "bg-blue-600", orange: "bg-orange-500", emerald: "bg-emerald-500" };
  return (
    <div className="h-1.5 w-32 rounded-full bg-slate-100">
      <div className={cn("h-1.5 rounded-full", colors[tone])} style={{ width: `${value}%` }} />
    </div>
  );
}

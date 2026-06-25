"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, Github, Loader2, Lock, User, Zap } from "lucide-react";

import { login, saveAuthToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123456");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login({ username, password });
      saveAuthToken(response.access_token);
      router.replace("/dashboard");
    } catch {
      setError("用户名或密码不正确");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03111f] text-white">
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(120deg,rgba(37,99,235,0.35),rgba(20,184,166,0.24),transparent)] [clip-path:polygon(0_55%,15%_45%,35%_60%,55%_40%,75%_52%,100%_35%,100%_100%,0_100%)]" />
      <header className="relative z-10 flex items-center justify-between p-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-400/15">
            <Zap className="h-5 w-5 text-cyan-100" />
          </div>
          <span className="text-xl font-bold">Enterprise AI Copilot Lab</span>
        </div>
        <span className="text-sm text-cyan-100">简体中文</span>
      </header>

      <section className="relative z-10 grid min-h-[calc(100vh-112px)] items-center gap-10 px-8 pb-10 lg:grid-cols-[1fr_520px] lg:px-32 xl:px-40">
        <div>
          <h1 className="text-5xl font-bold leading-tight text-cyan-100">Enterprise AI Copilot Lab</h1>
          <h2 className="mt-5 text-3xl font-bold">企业级 AI 应用工程实验台</h2>
          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
            从知识库、文档入库到 RAG 问答和评估日志，把 MVP 主线连成一个可验证的工作台。
          </p>
          <div className="mt-10 grid max-w-3xl gap-5 sm:grid-cols-5">
            {["知识库", "文档", "RAG", "Prompt", "日志"].map((item) => (
              <div className="text-center" key={item}>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-cyan-200">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="mt-3 text-sm font-semibold">{item}</div>
              </div>
            ))}
          </div>
        </div>

        <form className="rounded-2xl bg-white p-10 text-slate-950 shadow-2xl" onSubmit={handleSubmit}>
          <div className="text-center">
            <h2 className="text-3xl font-bold">欢迎登录</h2>
            <p className="mt-3 text-sm text-slate-500">使用管理员账号进入 MVP 工作台</p>
          </div>

          {error ? (
            <div className="mt-8 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          ) : null}

          <label className="mt-8 block text-sm font-bold" htmlFor="username">
            用户名
          </label>
          <div className="relative mt-2">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              className="lab-input h-14 w-full pl-12"
              id="username"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="请输入用户名"
              value={username}
            />
          </div>

          <label className="mt-6 block text-sm font-bold" htmlFor="password">
            密码
          </label>
          <div className="relative mt-2">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              className="lab-input h-14 w-full px-12"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="请输入密码"
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "隐藏密码" : "显示密码"}
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
              onClick={() => setShowPassword((value) => !value)}
              type="button"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>

          <button className="lab-button-primary mt-8 h-14 w-full text-base" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            登录
          </button>

          <div className="my-8 flex items-center gap-4 text-sm text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            其他方式
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <button className="lab-button h-14 w-full text-base" disabled type="button">
            <Github className="h-5 w-5" />
            GitHub 登录
          </button>
        </form>
      </section>
    </main>
  );
}

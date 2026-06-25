"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, Edit3, Eye, Loader2, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";

import { PageTitle, StatusBadge } from "@/components/ui-primitives";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

type KnowledgeBase = {
  // 字段名称保持和后端响应一致，减少映射代码，便于对照 API 调试。
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  document_count: number;
  chunk_count: number;
  status: string;
  created_at: string;
  updated_at: string;
};

type KnowledgeBasePayload = {
  name: string;
  description?: string | null;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  // 后端用 409 表示同 workspace 下 active 名称重复。
  if (error instanceof Error && error.message.includes("409")) {
    return "当前工作区已存在同名知识库";
  }

  return "请求失败，请稍后重试";
}

export default function KnowledgeBasesPage() {
  const [items, setItems] = useState<KnowledgeBase[]>([]);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    // 搜索只在前端过滤当前列表；数据量变大后再改成后端 query 参数。
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const descriptionText = item.description ?? "";
      return `${item.name} ${descriptionText}`.toLowerCase().includes(normalizedQuery);
    });
  }, [items, query]);

  async function loadKnowledgeBases() {
    // 页面进入和点击刷新都复用这个函数，避免两处请求逻辑不一致。
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiGet<KnowledgeBase[]>("/knowledge-bases", { auth: true });
      setItems(data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // React 19 lint 不鼓励 effect 里同步 setState；用 timer 延后到当前渲染结束后加载。
    const timer = window.setTimeout(() => {
      void loadKnowledgeBases();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    // 表单提交的 happy path：POST 成功后直接把新项插到列表顶部，不必整页刷新。
    event.preventDefault();
    if (!name.trim()) {
      setError("请输入知识库名称");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const created = await apiPost<KnowledgeBase, KnowledgeBasePayload>(
        "/knowledge-bases",
        {
          name,
          description: description.trim() || null,
        },
        { auth: true },
      );
      setItems((current) => [created, ...current]);
      setName("");
      setDescription("");
    } catch (createError) {
      setError(getErrorMessage(createError));
    } finally {
      setIsSaving(false);
    }
  }

  function startEditing(item: KnowledgeBase) {
    // 编辑态使用独立 state，用户取消时不会污染原始列表数据。
    setEditingId(item.id);
    setEditingName(item.name);
    setEditingDescription(item.description ?? "");
  }

  async function handleUpdate(item: KnowledgeBase) {
    // PATCH 只提交可编辑字段，计数和状态仍由后端维护。
    if (!editingName.trim()) {
      setError("请输入知识库名称");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const updated = await apiPatch<KnowledgeBase, KnowledgeBasePayload>(
        `/knowledge-bases/${item.id}`,
        {
          name: editingName,
          description: editingDescription.trim() || null,
        },
        { auth: true },
      );
      setItems((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
      setEditingId(null);
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(item: KnowledgeBase) {
    // 前端提示“删除后列表不显示”，后端实际执行软删除。
    const confirmed = window.confirm(`确认删除知识库“${item.name}”？删除后列表将不再显示，但历史数据会保留。`);
    if (!confirmed) {
      return;
    }

    setError(null);
    try {
      await apiDelete(`/knowledge-bases/${item.id}`, { auth: true });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  return (
    <div>
      <PageTitle
        description="管理企业知识库，支持创建、编辑和软删除；同一工作区内知识库名称保持唯一。"
        title="知识库管理"
      />

      <form className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[220px_1fr_auto]" onSubmit={handleCreate}>
        <input
          className="lab-input"
          disabled={isSaving}
          onChange={(event) => setName(event.target.value)}
          placeholder="知识库名称"
          value={name}
        />
        <input
          className="lab-input"
          disabled={isSaving}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="描述，可选"
          value={description}
        />
        <button className="lab-button-primary" disabled={isSaving} type="submit">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          新建知识库
        </button>
      </form>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="lab-input w-80 pl-9"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索知识库名称或描述"
            value={query}
          />
        </div>
        <button className="lab-button w-10 px-0" onClick={loadKnowledgeBases} type="button">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {error ? (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : null}

      <section className="lab-card overflow-hidden">
        <div className="grid grid-cols-[1.7fr_90px_110px_120px_150px_140px] border-b border-slate-100 px-5 py-4 text-xs font-bold text-slate-500">
          <div>知识库名称</div>
          <div>文档数量</div>
          <div>Chunk 数量</div>
          <div>状态</div>
          <div>创建时间</div>
          <div>操作</div>
        </div>

        {isLoading ? (
          <div className="grid place-items-center px-5 py-16 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : null}

        {!isLoading && filteredItems.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-slate-500">
            {items.length === 0 ? "暂无知识库，先创建一个用于文档入库。" : "没有匹配的知识库。"}
          </div>
        ) : null}

        {!isLoading
          ? filteredItems.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <div
                  className="grid grid-cols-[1.7fr_90px_110px_120px_150px_140px] items-center border-b border-slate-100 px-5 py-4 last:border-0"
                  key={item.id}
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                      <Eye className="h-5 w-5" />
                    </div>
                    {isEditing ? (
                      <div className="grid flex-1 gap-2">
                        <input
                          className="lab-input"
                          onChange={(event) => setEditingName(event.target.value)}
                          value={editingName}
                        />
                        <input
                          className="lab-input"
                          onChange={(event) => setEditingDescription(event.target.value)}
                          placeholder="描述，可选"
                          value={editingDescription}
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="font-bold text-slate-950">{item.name}</div>
                        <div className="mt-1 text-sm text-slate-500">{item.description || "暂无描述"}</div>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-slate-700">{item.document_count}</div>
                  <div className="text-sm text-slate-700">{item.chunk_count.toLocaleString()}</div>
                  <StatusBadge value={item.status === "active" ? "正常" : "停用"} />
                  <div className="text-sm text-slate-500">{formatDate(item.created_at)}</div>
                  <div className="flex items-center gap-2 text-slate-500">
                    {isEditing ? (
                      <>
                        <button className="lab-button h-9 w-9 px-0" onClick={() => handleUpdate(item)} type="button">
                          <Check className="h-4 w-4 text-emerald-600" />
                        </button>
                        <button className="lab-button h-9 w-9 px-0" onClick={() => setEditingId(null)} type="button">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="lab-button h-9 w-9 px-0" onClick={() => startEditing(item)} type="button">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="lab-button h-9 w-9 px-0" onClick={() => handleDelete(item)} type="button">
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          : null}
      </section>
    </div>
  );
}

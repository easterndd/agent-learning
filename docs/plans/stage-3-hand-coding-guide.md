# 阶段 3 手敲练习：知识库 CRUD

这份文档用于边敲边理解阶段 3。建议按顺序做，每完成一个小块就跑一次测试。

## 目标

把知识库页面从 mock 数据切到真实 API：

```text
前端表单 -> FastAPI 路由 -> Repository -> SQLAlchemy model -> 数据库
```

业务规则：

- 删除采用软删除：`status = "deleted"`。
- 名称在同一个 `workspace_id` 下唯一。
- 不同 workspace 可以重名。
- deleted 后允许重新创建同名知识库。

## 后端手敲步骤

### 1. 给知识库模型加 workspace

文件：`backend/app/models/knowledge_base.py`

需要字段：

```python
workspace_id: Mapped[str] = mapped_column(String(36), default="default", index=True, nullable=False)
```

理解点：

- 现在还没有 workspace 表，所以先用字符串。
- 后续多租户阶段再把它改成外键。

TODO：

- [ ] 引入 `workspaces` 表。
- [ ] 从当前登录用户推导 `workspace_id`。

### 2. Repository 只暴露业务需要的查询

文件：`backend/app/repositories/knowledge_bases.py`

要实现：

- `list_active(workspace_id, limit, offset)`
- `get_active(entity_id, workspace_id)`
- `find_active_by_name(name, workspace_id)`

关键条件：

```python
KnowledgeBase.workspace_id == workspace_id
KnowledgeBase.status != "deleted"
```

理解点：

- 软删除最容易漏的是查询过滤。
- Repository 可以把过滤规则集中起来，减少路由层重复。

### 3. 路由 schema 先写清楚

文件：`backend/app/modules/knowledge_bases/api/router.py`

三个 Pydantic schema：

- `KnowledgeBaseCreate`
- `KnowledgeBaseUpdate`
- `KnowledgeBaseSummary`

练习建议：

1. 先只写 `GET /knowledge-bases`。
2. 再写 `POST /knowledge-bases`。
3. 最后补 `GET/PATCH/DELETE /knowledge-bases/{id}`。

### 4. 名称唯一检查

核心函数：

```python
def ensure_unique_active_name(repository, *, name, workspace_id, current_id=None):
    existing = repository.find_active_by_name(name, workspace_id=workspace_id)
    if existing is not None and existing.id != current_id:
        raise HTTPException(status_code=409, detail="...")
```

理解点：

- 创建时 `current_id=None`。
- 更新时传入当前知识库 id，避免自己和自己冲突。

### 5. 软删除

不要调用 `repository.delete()`。

写成：

```python
knowledge_base.status = "deleted"
session.commit()
```

TODO：

- [ ] 软删除时记录 `deleted_at`。
- [ ] 软删除时写入 `system_logs`。

## 前端手敲步骤

### 1. 扩展 API helper

文件：`frontend/src/lib/api.ts`

补：

- `apiPatch`
- `apiDelete`
- `auth: true` 时自动加 `Authorization`

理解点：

- 页面不要到处手写 `fetch`。
- token 透传统一做，以后处理 401 也只改一个地方。

TODO：

- [ ] 新增 `ApiError`，让页面能读取 `status` 和后端 `detail`。
- [ ] 401 时自动清 token 并跳转登录页。

### 2. 定义页面数据类型

文件：`frontend/src/app/(workspace)/knowledge-bases/page.tsx`

让类型和后端响应字段一致：

```ts
type KnowledgeBase = {
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
```

### 3. 先实现列表读取

状态：

- `items`
- `isLoading`
- `error`

请求：

```ts
const data = await apiGet<KnowledgeBase[]>("/knowledge-bases", { auth: true });
```

### 4. 再实现创建

提交表单：

```ts
const created = await apiPost<KnowledgeBase, KnowledgeBasePayload>(
  "/knowledge-bases",
  { name, description },
  { auth: true },
);
```

成功后：

```ts
setItems((current) => [created, ...current]);
```

### 5. 最后实现编辑和删除

编辑：

```ts
apiPatch(`/knowledge-bases/${item.id}`, payload, { auth: true })
```

删除：

```ts
apiDelete(`/knowledge-bases/${item.id}`, { auth: true })
```

删除成功后从本地列表移除即可，因为后端已经软删除。

## 每次手敲后的验证

后端：

```powershell
python -m ruff check backend
python -m pytest backend/tests
```

前端：

```powershell
npm.cmd run typecheck --prefix frontend
npm.cmd run lint --prefix frontend
npm.cmd run build --prefix frontend
```

## 你可以刻意练习的点

- 先写测试，再写实现。
- 删除接口先写成硬删除，然后改成软删除，观察测试怎么保护行为。
- 把 `workspace_id` 改成另一个值，验证不同 workspace 可以重名。
- 故意创建重复名称，观察后端 409 和前端错误提示。

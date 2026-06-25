# 下一阶段实现步骤

## 目标

把当前“前端原型 + 后端路由骨架”推进到可运行的 MVP 主线：

```text
登录 -> 创建知识库 -> 上传文档 -> 解析切分 -> 向量化入库 -> RAG 问答 -> 引用来源 -> Prompt 管理 -> 日志评估
```

下一阶段不追求 Agent、MCP、LoRA，而是优先把 PRD 中的 RAG 闭环跑通。

## 当前基线

已具备：

- Next.js 前端页面骨架和原型样式。
- FastAPI 模块化路由骨架。
- 模型中心基础 API 和前端页面。
- 基础 lint、typecheck、build、pytest 验证。

尚未具备：

- 前端页面真实调用后端 API。
- 数据库表、迁移和仓储层。
- 文件上传、文档解析、chunk、embedding、向量库写入。
- 真实 RAG 检索、LLM 调用、引用来源。
- Prompt CRUD、问答记录、检索日志、人工评分。

## 阶段 1：补齐数据层和基础仓储

### 1.1 建立数据库迁移

新增 Alembic 配置和首个迁移，覆盖 MVP 核心表：

- `users`
- `knowledge_bases`
- `documents`
- `document_chunks`
- `prompt_templates`
- `prompt_versions`
- `chat_sessions`
- `chat_messages`
- `rag_retrieval_logs`
- `model_call_logs`
- `system_logs`
- `model_providers`

验收：

- 空数据库可以执行迁移成功。
- 迁移可以通过 Docker Compose 使用 PostgreSQL 验证。

### 1.2 建立 SQLAlchemy 基础设施

新增：

- 数据库 session 管理。
- Base model。
- repository 基类或按模块仓储。
- 测试数据库 fixture。

验收：

- 后端测试可以在隔离测试库或临时 SQLite/PostgreSQL 中运行。
- 业务模块不直接依赖 FastAPI request 对象。

## 阶段 2：登录和鉴权

### 2.1 后端登录

实现：

- 用户表初始化 admin 用户。
- 密码 hash。
- JWT 创建和校验。
- `POST /api/v1/auth/login` 返回真实 JWT。

### 2.2 前端登录对接

实现：

- 登录表单提交到后端。
- 保存 token。
- API 请求附带 `Authorization: Bearer <token>`。
- 登录失败提示。

验收：

- 可以使用 admin 账号登录。
- 未登录访问工作台时跳转登录页。

## 阶段 3：知识库管理闭环

### 3.1 后端知识库 API

实现：

- `GET /api/v1/knowledge-bases`
- `POST /api/v1/knowledge-bases`
- `GET /api/v1/knowledge-bases/{id}`
- `PATCH /api/v1/knowledge-bases/{id}`
- `DELETE /api/v1/knowledge-bases/{id}`

字段至少包括：

- `id`
- `name`
- `description`
- `document_count`
- `chunk_count`
- `status`
- `created_at`
- `updated_at`

### 3.2 前端知识库页对接

实现：

- 列表读取后端。
- 创建知识库弹窗或内联表单。
- 删除确认。
- loading、empty、error 状态。

验收：

- 前端创建知识库后，刷新页面仍存在。
- 删除后列表同步更新。

## 阶段 4：文档上传和入库任务

### 4.1 后端文件上传

实现：

- `POST /api/v1/documents/upload`
- `GET /api/v1/documents`
- `GET /api/v1/documents/{id}`
- `GET /api/v1/documents/{id}/chunks`

文件支持：

- PDF
- Markdown
- TXT
- CSV

### 4.2 本地文件存储

实现：

- 原始文件保存到 `storage/uploads/`。
- 数据库存储文件 metadata。
- 禁止提交上传文件。

### 4.3 文档解析和切分

实现：

- TXT / Markdown 文本读取。
- CSV 按行或表格转文本。
- PDF 文本型解析。
- chunk 切分策略。
- chunk metadata 保存。

### 4.4 前端文档页对接

实现：

- 选择知识库。
- 上传文件。
- 展示上传、解析、切分、向量化状态。
- 新增文档详情页 `/documents/[id]`，展示 metadata 和 chunks。

验收：

- 上传 TXT/Markdown 后能看到 chunk 列表。
- 文档状态从上传中变为完成或失败。

## 阶段 5：模型供应商和 embedding 接入

### 5.1 模型供应商持久化

把当前内存版 `model_providers` 改为数据库持久化：

- Base URL
- provider type
- chat model
- embedding model
- rerank model
- encrypted API key 或本地开发明文占位
- default flag
- health status

### 5.2 Embedding 服务抽象

新增 infrastructure adapter：

- OpenAI-compatible embedding。
- Ollama embedding。
- Mock embedding for tests。

验收：

- 文档 chunk 可以生成 embedding。
- 测试环境不依赖真实外部模型。

## 阶段 6：向量库写入和检索

### 6.1 Qdrant 接入

实现：

- collection 初始化。
- chunk vector upsert。
- top-k search。
- metadata filter by knowledge base。

### 6.2 检索日志

保存：

- question
- query embedding model
- retrieved chunk ids
- similarity score
- top_k
- latency

验收：

- 给定问题可以检索出同知识库下的相关 chunks。
- 检索日志可在数据库查询。

## 阶段 7：基础 RAG 问答

### 7.1 后端 RAG API

完善 `POST /api/v1/rag/ask`：

- 读取知识库。
- 生成问题 embedding。
- top-k 检索。
- 组装 prompt。
- 调用默认 chat model。
- 返回 answer、citations、retrieved_chunks。
- 保存 chat session、message、retrieval logs、model call logs。

### 7.2 前端 RAG 页对接

实现：

- 知识库选择读取真实数据。
- Prompt 模板选择。
- 问题提交到后端。
- 展示答案、引用来源、检索 chunks。
- 人工点赞/点踩。

验收：

- 基于已上传文档提问，能返回带引用来源的答案。
- 问答记录被保存。

## 阶段 8：Prompt 管理

### 8.1 后端 Prompt API

实现：

- `GET /api/v1/prompts`
- `POST /api/v1/prompts`
- `GET /api/v1/prompts/{id}`
- `PATCH /api/v1/prompts/{id}`
- `POST /api/v1/prompts/{id}/versions`

支持：

- 模板名称。
- 任务类型。
- 模板内容。
- 变量。
- 版本号。
- 启用状态。

### 8.2 前端 Prompt 页对接

实现：

- 模板列表读取后端。
- 新建/编辑模板。
- 版本展示。
- RAG 问答页可以选择模板。

验收：

- 新建 Prompt 后可在 RAG 页面选择并用于问答。

## 阶段 9：日志和基础评估

### 9.1 系统日志

写入以下事件：

- 登录成功/失败。
- 创建知识库。
- 上传文档。
- 解析成功/失败。
- RAG 问答。
- 模型调用成功/失败。

### 9.2 人工评分

实现：

- `POST /api/v1/rag/messages/{id}/feedback`
- 保存 good/bad 和备注。
- Dashboard 展示基础统计。

验收：

- 系统日志页显示真实日志。
- Dashboard 的知识库、文档、chunk、问答数量来自后端统计。

## 阶段 10：前端全面去 mock

将以下页面全部从 `mock-data.ts` 切换为真实 API：

- Dashboard
- 知识库
- 文档管理
- 文档详情
- RAG 问答
- Prompt 管理
- 系统日志
- 模型中心

保留 mock 的唯一场景：

- Story/demo 数据。
- 测试 fixture。
- 后端不可用时的开发 fallback，但不能作为默认生产路径。

验收：

- 关闭 mock 数据后，页面仍能完整运行。
- 刷新页面不丢失业务数据。

## 推荐开发顺序

1. 数据库迁移和 repository。
2. 登录 JWT。
3. 知识库 CRUD。
4. 文档上传、解析、chunk。
5. 模型供应商持久化和 embedding。
6. Qdrant 写入和检索。
7. RAG 问答。
8. Prompt CRUD。
9. 日志和评分。
10. Dashboard 统计。

## 每阶段验证命令

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

集成：

```powershell
docker compose up --build
```

手工验收：

```text
登录 -> 创建知识库 -> 上传文档 -> 查看 chunks -> RAG 提问 -> 查看引用 -> 点赞/点踩 -> 查看日志
```

## 完成定义

下一阶段完成时，至少满足：

- 前端主要页面不再依赖静态 mock 数据。
- 后端核心数据写入 PostgreSQL。
- 文档可以解析成 chunk。
- chunk 可以向量化并写入 Qdrant。
- RAG 问答返回真实引用来源。
- Prompt 模板可创建并用于问答。
- 系统日志和人工评分可查询。
- Docker Compose 能启动完整 MVP。

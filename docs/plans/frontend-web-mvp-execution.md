# 前端 Web MVP 执行文档

## 目标

先完成 Enterprise AI Copilot Lab 的 Web 管理台前端闭环，覆盖 PRD 中 MVP 页面：登录、Dashboard、知识库、文档上传、RAG 问答、Prompt 模板、模型中心和系统日志。当前阶段以原型还原和静态业务状态为主，后续再对接 FastAPI。

## 原型基准

- 参考 `image/` 下 8 张 Figma 导出图。
- 视觉方向：企业控制台、左侧导航、顶部全局搜索、白底卡片、蓝色主操作、紧凑表格。
- 文案使用正常中文，替换导出代码中的编码异常内容。

## 实施顺序

1. 建立共享视觉组件：工作台外壳、状态标签、指标卡、进度条、按钮和输入框。
2. 实现 Dashboard：指标、最近文档、问答记录、任务队列、趋势和公告。
3. 实现知识库页：筛选区、知识库列表、状态和操作入口。
4. 实现文档页：上传区域、解析设置、格式说明和上传任务表。
5. 实现 RAG 页：知识库选择、问答内容、引用来源和检索设置。
6. 实现 Prompt 页：模板统计、筛选和模板列表。
7. 实现模型中心：参考 cc-switch 的供应商管理方式，支持自定义 OpenAI-compatible、Ollama、Anthropic 和企业网关配置。
8. 实现日志页：筛选、搜索、导出入口和日志表。
9. 实现登录页：深色品牌首屏和登录表单。

## 对接计划

- M1：保留静态 mock 数据，确认信息架构和样式。
- M2：用 `frontend/src/lib/api.ts` 接入知识库、文档、日志列表接口。
- M3：RAG 问答接入 `/rag/ask`，展示 citations、retrieved chunks 和评价动作。
- M4：Prompt 页接入模板 CRUD 和版本管理。
- M5：模型中心接入 `/model-providers`，让 RAG 生成、Embedding 和后续 Rerank 统一读取默认模型供应商。
- M6：补充加载、空状态、错误态、权限态和响应式细节。

## 验收标准

- 页面路由可访问：`/login`、`/dashboard`、`/knowledge-bases`、`/documents`、`/rag`、`/prompts`、`/logs`。
- 主要布局与原型一致：侧边栏、顶部栏、卡片、表格和操作按钮完整。
- 模型中心可表达供应商、Base URL、API Key、Chat Model、Embedding Model、默认启用和健康检查状态。
- 前端通过 lint、typecheck 和 build。
- 不引入后端耦合，mock 数据集中维护，便于后续替换为接口数据。

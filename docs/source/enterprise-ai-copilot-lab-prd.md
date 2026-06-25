# PRD 草稿：Enterprise AI Copilot Lab

## 1. 项目定位



Enterprise AI Copilot Lab

&#x20;是一个面向学习和技术实践的企业级大模型应用开发项目。

项目目标不是交付商业产品，而是通过一个完整系统，系统性实践以下能力：

- 数据预处理
- RAG 知识库
- Prompt Engineering
- LangGraph Agent
- MCP 工具接入
- LoRA 微调
- 模型部署
- 权限控制
- 评估监控
- Docker / Kubernetes 工程部署

项目最终形态可以理解为：

> 一个企业 AI 中台实验室，集知识库问答、文档处理、Agent 工作流、工具调用、模型微调和效果评估于一体。

## 2. 现有方案不足

### 2.1 范围过大

一次性融合：

- RAG
- LangGraph
- MCP
- LoRA
- 多模型部署
- 权限系统
- 监控告警
- 前端管理台
- 小程序 / 插件 / App

容易变成“大而散”的项目，最后每个技术都只做了浅层 demo。

### 2.2 缺少主线任务

如果只是堆功能，比如“有 RAG、有微调、有 MCP”，学习效果会变差。

更好的方式是围绕一个主线闭环：

> 文档进入系统 -> 被处理成知识 -> 被检索和问答 -> 被 Agent 调用 -> 被评估优化 -> 必要时用于微调。

### 2.3 LoRA 不适合太早做

LoRA 微调需要：

- 数据集
- GPU 环境
- 模型选择
- 训练脚本
- 评估指标
- 对比实验

如果太早做，会拖慢基础系统搭建。应该作为中后期模块。

### 2.4 MCP 不应一开始就复杂化

MCP 适合用来学习“工具标准化接入”，但 MVP 阶段可以先用普通 tool calling，等 Agent 流程跑通后再替换成 MCP。

### 2.5 前端形态不宜太多

网页、小程序、插件、App 都做会分散精力。

学习项目建议：

-   MVP：Web 管理台
-   后期：浏览器插件
-   不建议早期做小程序和 App

## 3. 产品目标

### 3.1 学习目标

通过项目掌握：

1. 企业级 FastAPI 后端开发
2. 文档解析与数据预处理
3. RAG 检索增强生成
4. Prompt 模板管理与版本控制
5. LangGraph 状态机式 Agent 编排
6. MCP 工具协议接入
7. LoRA / QLoRA 微调流程
8. 模型服务部署
9. RAG 与 Agent 评估
10. 权限、安全、日志、监控

### 3.2 项目目标

构建一个可运行的完整系统：

- 能上传文档
- 能解析并切分文档
- 能构建知识库
- 能进行 RAG 问答
- 能展示引用来源
- 能管理 Prompt
- 能通过 Agent 执行多步骤任务
- 能接入 MCP 工具
- 能进行基础评估
- 能预留 LoRA 微调模块

## 4. 产品边界

### 4.1 本项目做什么

做一个企业 AI 应用学习平台，重点在：

- 后端架构
- AI 应用链路
- 工程化实践
- RAG / Agent / MCP / LoRA 技术融合

### 4.2 本项目不做什么

MVP 阶段不做：

- 商业化多租户 SaaS
- 复杂计费系统
- 真实企业 IM 集成
- 小程序
- 移动 App
- 浏览器插件
- Kubernetes 生产级高可用
- 大规模 GPU 集群训练
- 复杂可视化 Agent 编排器
- 完整 Dify 级别平台能力

## 5. MVP 范围

MVP 目标：

> 做出一个最小但完整的“企业知识库 RAG 闭环”。

### 5.1 MVP 必做功能

#### 1. 基础 Web 管理台

页面：

- 登录页
- 首页 Dashboard
- 知识库列表页
- 文档上传页
- 文档详情页
- RAG 问答页
- Prompt 模板页
- 系统日志页

#### 2. 后端基础能力

功能：

- 用户登录
- JWT 鉴权
- PostgreSQL 数据库
- Redis 缓存
- 文件上传
- 后台任务处理
- 基础日志

#### 3. 文档预处理

支持：

- PDF
- Markdown
- TXT
- CSV

处理流程：

```text
上传文件
  -> 保存原始文件
  -> 解析文本
  -> 清洗文本
  -> 切分 chunk
  -> 保存 chunk 和 metadata
```

#### 4. 基础 RAG

支持：

- embedding
- 向量入库
- top-k 检索
- prompt 拼接
- LLM 生成回答
- 返回引用来源

#### 5. Prompt 管理

支持：

- 创建 Prompt 模板
- 编辑 Prompt 模板
- 选择 Prompt 用于问答
- Prompt 版本号

#### 6. 基础评估

支持：

- 保存每次问答记录
- 保存检索到的 chunk
- 保存模型回答
- 人工标记回答好/差
- 查看简单统计

## 6. MVP 暂不做功能

以下功能先不做，避免项目一开始失控。

| 功能                 | 暂不做原因                |
| ------------------ | -------------------- |
| LangGraph 复杂 Agent | 等 RAG 稳定后再加          |
| MCP                | 先用普通工具函数，后期替换        |
| LoRA 微调            | 需要数据和训练环境，后期做        |
| vLLM 部署            | MVP 可先用 API 或 Ollama |
| Kubernetes         | Docker Compose 足够    |
| 小程序                | 不利于学习主技术栈            |
| App                | 成本高，收益低              |
| 浏览器插件              | 可作为后期扩展              |
| 多租户                | 学习项目没必要一开始复杂化        |
| 复杂权限               | MVP 只做用户登录和知识库归属     |
| 复杂审计               | 先做基础日志               |
| 自动化报告导出            | Agent 阶段再做           |
| 可视化 Agent 编排器      | 后期再考虑                |

## 7. 最终形态规划

### 7.1 最终推荐形态

优先级：

1.   Web 管理台：必须做
2.   浏览器插件：后期可做
3.   小程序：不建议做
4.   移动 App：不建议做

### 7.2 为什么先做 Web

Web 最适合承载：

- 文档上传
- 知识库管理
- Prompt 管理
- Agent 任务执行
- 评估面板
- 日志监控
- 模型配置

小程序和 App 更偏终端使用体验，不适合作为学习企业 AI 工程架构的主战场。

### 7.3 浏览器插件的价值

后期可以做一个 Chrome 插件：

- 选中网页内容，发送到知识库
- 在网页侧边栏调用企业知识问答
- 把当前页面作为 RAG 上下文

这个很适合作为进阶扩展。

## 8. 页面清单

### 8.1 MVP 页面

#### 1. 登录页

功能：

- 用户名密码登录
- 获取 JWT token

#### 2. Dashboard

展示：

- 知识库数量
- 文档数量
- chunk 数量
- 最近问答
- 最近任务状态

#### 3. 知识库列表页

功能：

- 创建知识库
- 查看知识库
- 删除知识库
- 查看文档数量

#### 4. 文档上传页

功能：

- 选择知识库
- 上传文件
- 显示解析状态
- 显示入库状态

#### 5. 文档详情页

功能：

- 查看文档 metadata
- 查看切分后的 chunk
- 查看 embedding 状态

#### 6. RAG 问答页

功能：

- 选择知识库
- 输入问题
- 选择 Prompt 模板
- 查看回答
- 查看引用来源
- 查看检索 chunk
- 标记回答质量

#### 7. Prompt 模板页

功能：

- 新建模板
- 编辑模板
- 设置模板类型
- 查看版本

#### 8. 系统日志页

功能：

- 查看上传日志
- 查看解析日志
- 查看问答日志
- 查看错误日志

### 8.2 第二阶段页面

- Agent 任务页
- Agent 执行轨迹页
- 工具管理页
- MCP Server 管理页
- 评估数据集页
- RAG 实验对比页

### 8.3 第三阶段页面

- 微调数据集页
- LoRA 训练任务页
- 模型管理页
- 模型对比页
- 监控面板页
- 审计日志页

## 9. 核心流程

### 9.1 文档入库流程

```text
创建知识库
  -> 上传文档
  -> 保存原始文件
  -> 解析文档
  -> 清洗文本
  -> 切分 chunk
  -> 生成 embedding
  -> 写入向量库
  -> 写入 metadata
  -> 入库完成
```

### 9.2 RAG 问答流程

```text
用户选择知识库
  -> 输入问题
  -> 选择 Prompt 模板
  -> 问题 embedding
  -> 向量检索 top-k chunk
  -> 组装上下文
  -> 调用 LLM
  -> 生成答案
  -> 返回引用来源
  -> 保存问答记录
  -> 用户人工评分
```

### 9.3 Prompt 管理流程

```text
创建 Prompt 模板
  -> 设置变量
  -> 绑定任务类型
  -> 保存版本
  -> RAG 问答时选择模板
  -> 记录模板效果
```

### 9.4 Agent 流程，第二阶段

```text
用户提交复杂任务
  -> LangGraph 判断任务类型
  -> 检索知识库
  -> 调用工具
  -> 整理中间结果
  -> 生成人工确认节点
  -> 继续执行
  -> 生成最终结果
  -> 保存执行轨迹
```

### 9.5 MCP 流程，第二阶段

```text
注册 MCP Server
  -> 获取 tools/resources
  -> Agent 选择工具
  -> 调用 MCP tool
  -> 返回工具结果
  -> 写入 Agent state
  -> 继续推理
```

### 9.6 LoRA 微调流程，第三阶段

```text
收集问答数据
  -> 清洗为 instruction 数据集
  -> 划分 train/eval
  -> 启动 LoRA 训练
  -> 保存 adapter
  -> 部署模型
  -> 与基础模型对比
```

## 10. 技术方案

### 10.1 前端

MVP：

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
```

原因：

- 企业后台页面开发效率高
- TypeScript 适合学习前端工程
- 组件生态成熟

### 10.2 后端

MVP：

```text
Python
FastAPI
SQLAlchemy
Alembic
Pydantic
Celery / RQ
Redis
PostgreSQL
```

原因：

- Python 是 LLM 应用主流语言
- FastAPI 与 AI 工程结合度高
- PostgreSQL 适合存业务数据和 metadata
- Redis 适合缓存和任务队列

### 10.3 文件存储

MVP：

```text
本地文件系统
```

进阶：

```text
MinIO
S3
```

### 10.4 文档解析

MVP：

```text
pymupdf
python-docx
markdown
pandas
```

进阶：

```text
unstructured
docling
```

### 10.5 RAG

MVP：

```text
LangChain
Qdrant 或 Milvus
bge-m3 / Qwen embedding
DeepSeek / Qwen / OpenAI API
```

建议 MVP 用 Qdrant，部署更轻。

如果想贴近企业大规模知识库，可以用 Milvus。

### 10.6 Prompt

```text
Prompt 模板表
Prompt 变量
Prompt 版本号
Prompt 类型
Prompt 使用记录
```

### 10.7 Agent

第二阶段：

```text
LangGraph
Tool calling
Checkpoint
Human-in-the-loop
```

### 10.8 MCP

第二阶段：

```text
Python MCP SDK
自定义 MCP Server
MCP Client
```

先做：

- file server
- database server
- knowledge server

### 10.9 LoRA

第三阶段：

```text
Hugging Face Transformers
PEFT
TRL
bitsandbytes
Qwen 小模型
```

### 10.10 模型部署

MVP：

```text
API 模型 或 Ollama
```

进阶：

```text
vLLM
OpenAI-compatible API
```

### 10.11 评估监控

MVP：

```text
问答日志
人工评分
检索 chunk 记录
基础统计
```

进阶：

```text
RAGAS
DeepEval
LangSmith
Prometheus
Grafana
```

### 10.12 部署

MVP：

```text
Docker Compose
```

进阶：

```text
Nginx
GitHub Actions
Kubernetes
```

## 11. 数据库核心表设计草案

MVP 核心表：

```text
users
knowledge_bases
documents
document_chunks
prompt_templates
prompt_versions
chat_sessions
chat_messages
rag_retrieval_logs
model_call_logs
system_logs
```

第二阶段新增：

```text
agent_tasks
agent_steps
tools
mcp_servers
mcp_tool_calls
```

第三阶段新增：

```text
eval_datasets
eval_cases
eval_runs
finetune_datasets
finetune_jobs
models
model_versions
```

## 12. 主要风险

### 12.1 范围失控

风险：

功能太多，每个都做不深。

应对：

严格分阶段。MVP 只做 RAG 闭环。

### 12.2 RAG 效果不稳定

风险：

检索不到、回答幻觉、引用不准确。

应对：

先保存检索日志，再做 rerank、混合检索和评估。

### 12.3 文档解析复杂

风险：

PDF、表格、扫描件、格式混乱。

应对：

MVP 只支持文本型 PDF、Markdown、TXT、CSV。OCR 后期再做。

### 12.4 LoRA 环境成本高

风险：

没有 GPU，训练慢，调参复杂。

应对：

LoRA 放第三阶段。先用小模型和小数据集跑通流程。

### 12.5 MCP 学习曲线

风险：

一开始接 MCP 会打乱 Agent 主线。

应对：

先用普通工具函数，Agent 稳定后再 MCP 化。

### 12.6 模型 API 成本

风险：

频繁调 API 花费高。

应对：

加缓存、限制请求、支持 Ollama 本地模型。

### 12.7 前端消耗过多精力

风险：

大量时间花在 UI 细节上。

应对：

用 shadcn/ui 快速搭建管理台，优先保证流程完整。

### 12.8 部署复杂度过高

风险：

一开始上 K8s 会拖垮进度。

应对：

先 Docker Compose，最后再迁移 K8s。

## 13. 里程碑规划

### M1：项目骨架

目标：

- FastAPI 后端
- Next.js 前端
- PostgreSQL
- Redis
- Docker Compose
- 登录鉴权

### M2：文档入库

目标：

- 文件上传
- 文档解析
- chunk 切分
- metadata 存储

### M3：基础 RAG

目标：

- embedding
- 向量库
- 检索
- LLM 回答
- 引用来源

### M4：Prompt 管理

目标：

- Prompt 模板
- Prompt 版本
- 问答时选择模板

### M5：RAG 评估

目标：

- 保存问答记录
- 保存检索日志
- 人工评分
- 简单统计

### M6：高级 RAG

目标：

- BM25
- 混合检索
- rerank
- query rewrite

### M7：LangGraph Agent

目标：

- 多步骤任务
- 工具调用
- 执行轨迹
- 人工确认

### M8：MCP

目标：

- 自定义 MCP Server
- Agent 通过 MCP 调用工具

### M9：LoRA

目标：

- 数据集构造
- LoRA 微调
- 模型对比

### M10：部署与监控

目标：

- vLLM / Ollama
- Prometheus
- Grafana
- Nginx
- CI/CD
- K8s 选做

## 14. MVP 成功标准

MVP 完成时，至少做到：

1. 可以登录系统
2. 可以创建知识库
3. 可以上传文档
4. 系统能解析并切分文档
5. 系统能生成 embedding 并写入向量库
6. 用户可以基于知识库提问
7. 回答能展示引用来源
8. 系统能保存问答记录和检索日志
9. 可以管理 Prompt 模板
10. 整个系统可以通过 Docker Compose 启动

## 15. 最终学习成果

完成这个项目后，应该能讲清楚：

- 企业知识库为什么不能只靠 prompt
- RAG 为什么需要 chunk、embedding、rerank
- Prompt Engineering 在工程里怎么管理
- Agent 为什么需要 LangGraph 这类状态编排
- MCP 解决了什么工具接入问题
- LoRA 和 RAG 分别解决什么问题
- 大模型应用如何评估
- 企业级项目如何设计权限、日志、监控和部署

这个 PRD 的核心原则是：

> 先做完整闭环，再逐步加深技术复杂度。

MVP 不追求“大而全”，而是把   文档入库 -> RAG 问答 -> Prompt 管理 -> 日志评估   这条主线跑通。后面的 LangGraph、MCP、LoRA、vLLM、监控部署，都是在这条主线之上自然生长出来的。

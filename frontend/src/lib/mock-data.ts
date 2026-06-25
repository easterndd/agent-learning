import {
  BarChart3,
  BookOpen,
  Bot,
  Boxes,
  Code2,
  Database,
  FileText,
  Gauge,
  MessageSquare,
  PenLine,
  ScrollText,
  Settings,
  ShieldCheck,
  Upload,
  Wrench,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "核心功能",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: Gauge },
      { href: "/knowledge-bases", label: "知识库", icon: Database },
      { href: "/documents", label: "文档管理", icon: FileText },
      { href: "/rag", label: "RAG 问答", icon: MessageSquare },
      { href: "/prompts", label: "Prompt 管理", icon: Code2 },
      { href: "/logs", label: "系统日志", icon: ScrollText }
    ]
  },
  {
    label: "二期能力",
    items: [
      { href: "#", label: "Agent 任务", icon: Bot, disabled: true },
      { href: "#", label: "MCP 工具", icon: Wrench, disabled: true },
      { href: "#", label: "评估中心", icon: BarChart3, disabled: true }
    ]
  },
  {
    label: "三期能力",
    items: [
      { href: "/models", label: "模型中心", icon: Boxes },
      { href: "#", label: "LoRA 训练", icon: ShieldCheck, disabled: true },
      { href: "#", label: "系统设置", icon: Settings, disabled: true }
    ]
  }
];

export const metrics = [
  { label: "知识库总数", value: "12", delta: "+2", icon: Database, tone: "blue" },
  { label: "文档总数", value: "156", delta: "+8", icon: FileText, tone: "emerald" },
  { label: "Chunk 总数", value: "18,256", delta: "+1,256", icon: Boxes, tone: "violet" },
  { label: "问答总数", value: "2,345", delta: "+342", icon: MessageSquare, tone: "orange" },
  { label: "Prompt 模板", value: "32", delta: "+3", icon: PenLine, tone: "blue" },
  { label: "平均响应", value: "2.45s", delta: "-0.32s", icon: Zap, tone: "emerald" }
];

export const knowledgeBases = [
  { name: "企业制度库", desc: "公司制度、流程、规范与员工手册", docs: 20, chunks: 1500, questions: "2,356,320", status: "正常", created: "2024-04-10 10:20", tone: "blue" },
  { name: "技术文档库", desc: "内部技术文档、开发规范、接口文档", docs: 56, chunks: 5000, questions: "7,856,210", status: "正常", created: "2024-04-12 15:30", tone: "violet" },
  { name: "产品资料库", desc: "产品介绍资料、PRD、竞品分析资料", docs: 18, chunks: 900, questions: "1,256,890", status: "正常", created: "2024-04-15 09:15", tone: "orange" },
  { name: "数据分析库", desc: "内部数据分析报告、统计结果与模型说明", docs: 12, chunks: 3200, questions: "4,125,670", status: "正常", created: "2024-04-18 11:45", tone: "cyan" },
  { name: "人力资源库", desc: "招聘资料、培训资料、薪酬福利制度", docs: 15, chunks: 1100, questions: "1,589,320", status: "构建中", created: "2024-05-20 09:30", tone: "blue" },
  { name: "历史归档库", desc: "历史项目文档归档", docs: 8, chunks: 560, questions: "785,420", status: "已禁用", created: "2024-03-01 16:20", tone: "rose" }
];

export const documents = [
  { name: "员工手册.pdf", kb: "企业制度库", size: "12.4 MB", status: "已完成", progress: 100, stage: "向量化完成", created: "2024-05-20 14:30:25" },
  { name: "技术方案文档.docx", kb: "技术文档库", size: "8.7 MB", status: "解析中", progress: 66, stage: "解析中", created: "2024-05-20 14:25:10" },
  { name: "产品需求文档.xlsx", kb: "产品资料库", size: "2.1 MB", status: "切分中", progress: 30, stage: "切分中", created: "2024-05-20 14:20:05" },
  { name: "会议纪要.txt", kb: "企业制度库", size: "156 KB", status: "上传中", progress: 45, stage: "上传中", created: "2024-05-20 14:18:42" },
  { name: "数据分析报告.csv", kb: "数据分析库", size: "1.3 MB", status: "失败", progress: 0, stage: "解析失败", created: "2024-05-20 14:10:15" }
];

export const prompts = [
  { name: "通用问答模板", category: "通用模板", desc: "适用于多数问答场景，提供准确、全面的回答", model: "gpt-4o", tags: ["通用", "问答", "准确"], version: "v1.2.0", status: "已启用", updated: "2024-05-20 14:30" },
  { name: "文档总结模板", category: "总结模板", desc: "对文档内容进行结构化总结，提炼关键信息", model: "gpt-4o", tags: ["总结", "文档", "提炼"], version: "v1.1.0", status: "已启用", updated: "2024-05-19 10:15" },
  { name: "数据分析模板", category: "分析模板", desc: "对数据进行分析，生成洞察和可视化建议", model: "gpt-4o", tags: ["分析", "数据", "洞察"], version: "v1.0.1", status: "已启用", updated: "2024-05-18 16:45" },
  { name: "代码解释模板", category: "问答模板", desc: "解释代码逻辑，提供优化建议和最佳实践", model: "gpt-4o", tags: ["代码", "解释", "技术"], version: "v1.0.0", status: "已启用", updated: "2024-05-17 09:20" },
  { name: "邮件写作模板", category: "写作模板", desc: "根据场景生成专业、得体的邮件内容", model: "gpt-4o", tags: ["写作", "邮件", "商务"], version: "v1.0.0", status: "已禁用", updated: "2024-05-16 11:30" }
];

export const logs = [
  { time: "2024-05-20 14:35:22", user: "admin", module: "知识库", action: "创建知识库", detail: "创建知识库“企业制度库”", status: "成功", ip: "192.168.1.100", browser: "Chrome 124.0.0.0" },
  { time: "2024-05-20 14:30:15", user: "admin", module: "文档管理", action: "上传文档", detail: "上传文档“员工手册.pdf”", status: "成功", ip: "192.168.1.100", browser: "Chrome 124.0.0.0" },
  { time: "2024-05-20 14:28:07", user: "zhangsan", module: "RAG 问答", action: "创建对话", detail: "发起新对话", status: "成功", ip: "192.168.1.101", browser: "Edge 124.0.0.0" },
  { time: "2024-05-20 14:25:31", user: "zhangsan", module: "RAG 问答", action: "发送消息", detail: "问题：年假政策是怎样的？", status: "成功", ip: "192.168.1.101", browser: "Edge 124.0.0.0" },
  { time: "2024-05-20 14:22:19", user: "lisi", module: "Prompt 管理", action: "编辑模板", detail: "编辑模板“通用问答模板”", status: "成功", ip: "192.168.1.102", browser: "Chrome 124.0.0.0" },
  { time: "2024-05-20 14:10:05", user: "zhangsan", module: "文档管理", action: "删除文档", detail: "删除文档“旧版制度.docx”", status: "成功", ip: "192.168.1.101", browser: "Edge 124.0.0.0" }
];

export const recentQuestions = [
  { question: "公司的请假制度是怎样的？", kb: "企业制度库", score: "★★★★★", time: "2024-05-20 14:35" },
  { question: "如何申请加班？", kb: "企业制度库", score: "★★★★☆", time: "2024-05-20 14:22" },
  { question: "项目开发流程是怎样的？", kb: "技术文档库", score: "★★★★★", time: "2024-05-20 11:05" },
  { question: "数据库如何备份？", kb: "技术文档库", score: "★★★☆☆", time: "2024-05-19 17:30" }
];

export const quickActions = [
  { label: "创建知识库", desc: "新建知识库", icon: Database },
  { label: "上传文档", desc: "上传文件到知识库", icon: Upload },
  { label: "开始问答", desc: "进行 RAG 问答", icon: MessageSquare },
  { label: "新建 Prompt", desc: "创建 Prompt 模板", icon: BookOpen }
];

export const modelProviders = [
  {
    name: "OpenAI Compatible Gateway",
    providerType: "OpenAI Compatible",
    baseUrl: "https://api.openai.com/v1",
    chatModel: "gpt-4o-mini",
    embeddingModel: "text-embedding-3-small",
    capabilities: ["Chat", "Embedding"],
    status: "未配置 Key",
    isDefault: true,
    latency: "320ms"
  },
  {
    name: "Local Ollama",
    providerType: "Ollama",
    baseUrl: "http://localhost:11434/v1",
    chatModel: "qwen2.5:7b",
    embeddingModel: "nomic-embed-text",
    capabilities: ["Chat", "Embedding"],
    status: "可用",
    isDefault: false,
    latency: "42ms"
  },
  {
    name: "SiliconFlow",
    providerType: "OpenAI Compatible",
    baseUrl: "https://api.siliconflow.cn/v1",
    chatModel: "Qwen/Qwen3-32B",
    embeddingModel: "BAAI/bge-m3",
    capabilities: ["Chat", "Embedding", "Rerank"],
    status: "可用",
    isDefault: false,
    latency: "580ms"
  }
];

import { links } from './links.ts'
export interface EngineeringCase {
  id: string
  number: string
  title: string
  category: string
  period?: string
  role: string
  context: string
  problem: string
  built: string[]
  decision: string
  outcome: string
  stack: string[]
  sourcePage: number
  href?: string
}
export const novaWing = {
  id: 'novawing',
  number: '01',
  title: 'NovaWing',
  fullName: 'NovaWing Development Guardian',
  category: 'Agent 工程化',
  period: '2026.07 — 至今',
  role: '独立研发 · 设计与实现',
  headline: 'AI 不应该自己给自己的作业打满分。',
  description:
    '基于 Claude Code、Codex 等成熟 Agent Runtime 二次建设，把单轮 AI Coding 推进为受约束、可验证、可恢复的研发系统。',
  problem:
    '当执行者同时负责自测与宣布完成，代码生成并不等于结果可信。决策、执行和验收，需要清晰的职责边界。',
  solution:
    'Brain / Reviewer 负责判断与审查，通过结构化协议驱动 Executor；独立验证、人工决策门与 checkpoint 共同约束交付。',
  flow: [
    { label: '执行任务', english: 'EXECUTE' },
    { label: '独立验证', english: 'VERIFY' },
    { label: '审查结果', english: 'REVIEW' },
    { label: '风险判断', english: 'DECIDE' },
    { label: '人工决策', english: 'HUMAN' },
    { label: '审计轨迹', english: 'AUDIT' },
  ],
  evidence: [
    {
      id: 'review',
      title: '执行结束，不代表验收结束。',
      label: '独立 Final Review',
      image: '/projects/nova-wing/review.webp',
      width: 1320,
      height: 570,
      alt: 'NovaWing 执行日志真实局部，显示 Executor、验证和 Final Review 阶段及完成记录',
      text: '任务实现、验证与 Final Review 分别记录。过程中的失败也保留在证据链里。',
      source: '03-work-session-final-review.webp',
    },
    {
      id: 'human',
      title: '需要人的判断，就明确暂停。',
      label: 'Human-in-the-loop',
      image: '/projects/nova-wing/human-review.webp',
      width: 1320,
      height: 1190,
      alt: 'NovaWing 真实活动与执行日志局部，显示 HUMAN_REQUIRED、审批请求和批准记录',
      text: '从 HUMAN_REQUIRED 到审批记录，人的决定进入可追溯的工作流，而不是一句隐含授权。',
      source: '04-observability-debug.webp',
    },
    {
      id: 'recovery',
      title: '中断之后，从可信进度继续。',
      label: 'Checkpoint / Recovery',
      image: '/projects/nova-wing/recovery.webp',
      width: 1320,
      height: 314,
      alt: 'NovaWing 真实恢复提示局部，说明 Brain transport 不可用、checkpoint 已保存和恢复后继续',
      text: '基础设施异常与任务失败被区分。保存 checkpoint，再恢复 Review，不要求重新生成已经完成的工作。',
      source: '05-brain-degraded-recovery.webp',
    },
  ],
  demo: {
    src: '/projects/nova-wing/demo.mp4',
    poster: '/projects/nova-wing/demo-poster.webp',
    description: '真实原始录屏 · NovaWing 完整运行过程',
    duration: '13:01',
    originalDuration: '13:01.75',
  },
  links: { showcase: links.novaShowcase, project: links.novaProject, demo: links.novaDemo },
  sourcePage: 3,
}
export const projects: EngineeringCase[] = [
  {
    id: 'analytics',
    number: '02',
    title: '游戏行为分析与异常监控平台',
    category: '复杂企业工程',
    period: '2025.08 — 2026.05',
    role: '前端开发工程师 · 友谊时光科技股份有限公司',
    context: '面向游戏运营与分析人员的行为查询、异常监控和聚合分析平台。',
    problem:
      '高状态密度的分析页面，需要同时组织动态字段、聚合查询、明细下钻、图表表格联动与数据导出。',
    built: [
      '负责玩家行为查询、聚合分析、明细下钻等核心模块。',
      '参与字段 schema 建设，让组件类型、操作符、校验与接口语义可配置。',
      '通过 adapter / mapper / resolver 收敛列表、聚合、明细与导出数据链路。',
    ],
    decision: '不整体推倒老系统。通过页面状态收敛、公共逻辑抽象与数据转换层，逐步建立可维护边界。',
    outcome: '工程实践进一步沉淀为页面级开源资产；部分构建场景由约 300 秒降低至约 30 秒。',
    stack: ['Vue 2.6', 'single-spa', 'Lerna Monorepo', 'Webpack'],
    sourcePage: 2,
  },
  {
    id: 'offerflow',
    number: '03',
    title: 'OfferFlow',
    category: '全栈 AI 产品',
    role: '个人项目 · 独立开发',
    href: 'https://github.com/weijianjunwjj/offer-flow',
    context: 'AI 求职决策台。强调结构化业务数据，而不只是聊天界面。',
    problem: '自然语言分析如果不能保存、比较和进入后续业务流程，就很难成为可持续使用的产品能力。',
    built: [
      '独立完成产品设计、前端交互、服务端接口、数据模型与本地持久化。',
      '将岗位、公司、流程、策略与版本记录组织为可追踪实体。',
      '通过 SSE 接入 LLM 流式输出，处理连接中断、取消、异常与结构化展示。',
    ],
    decision: '将模型输出转换为技能、风险、匹配度和行动建议等字段，使 AI 结果进入业务数据链路。',
    outcome:
      '完成从页面、API、数据模型到 AI 服务的闭环；分析结果能够保存、比较并继续参与后续流程。',
    stack: ['Vue 3 / TypeScript', 'Node.js / Fastify', 'Prisma / SQLite', 'LLM / SSE'],
    sourcePage: 3,
  },
]
export const selectedWork = [
  { number: '01', title: 'NovaWing', category: 'Agent 工程化 / 独立研发', href: '#novawing' },
  {
    number: '02',
    title: '游戏行为分析与异常监控平台',
    category: '复杂企业前端 / 数据平台',
    href: '#analytics',
  },
  { number: '03', title: 'OfferFlow', category: '全栈 AI 产品 / 独立开发', href: '#offerflow' },
]

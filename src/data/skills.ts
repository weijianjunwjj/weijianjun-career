export interface EvolutionStage {
  number: string
  period: string
  phase: string
  company: string
  title: string
  summary: string
  breakthrough: string
  stack: string[]
}

export interface StackDomain {
  category: string
  tag: string
  items: string[]
  note: string
}

export const evolutionStages: EvolutionStage[] = [
  {
    number: '01',
    period: '2019.03 — 2023.07',
    phase: '多端业务与实时通信底盘',
    company: '文思海辉智科科技',
    title: '从单一页面，到多端协同与实时音视频。',
    summary:
      '独立搭建售后客服 Web 系统，主导售后服务商 Android App、管理端与设备物联小程序；参与雅迪品牌官网 Nuxt 3 按路由选择性预渲染配置。',
    breakthrough:
      '攻克 TRTC / TIM 拨号/被呼叫/通话三态互斥与忙线派生，以及 Android WakeLock 后台保活与 30 分钟先登出重登机制。',
    stack: ['Vue 2 / 3', 'TypeScript', 'uni-app', '腾讯 TRTC / TIM', 'Nuxt 3 SSR'],
  },
  {
    number: '02',
    period: '2023.08 — 2025.05',
    phase: '交易支付闭环与复杂 B 端',
    company: '南京递吾件融网络科技',
    title: '把真实交易、异步支付与多系统联调做成确定流程。',
    summary:
      '主导中邮通/逍遥邮寄件小程序与运营后台；主导 LiveShop 海外社交电商 App 社区/电商/登录/支付模块与后台协作；参与企业级低代码平台图表数据层、CRUD 轮询与企业 AI 对话应用维护。',
    breakthrough:
      '设计微信支付分异步出单 WebSocket + 3s 阶梯轮询兜底状态机；修复企业 AI 对话“重新生成”累计流式文本误作增量导致的回答重复。',
    stack: ['微信原生小程序', '微信支付分', 'WebSocket', 'Vue 3 / Pinia', 'Naive UI'],
  },
  {
    number: '03',
    period: '2025.08 — 2026.05',
    phase: '高状态密度数据平台与渐进治理',
    company: '友谊时光科技',
    title: '在不推倒老系统的前提下，建立清晰的状态与工程边界。',
    summary:
      '负责 EBI 游戏行为分析平台单用户查询、漏斗详情、设备明细聚合、SDK 异常监控与 CRM 活动奖品规则配置；主导页面级状态收敛、接口 adapter/mapper 与微前端构建缓存治理。',
    breakthrough:
      '识别 Vue 2.6 + composition-api RefImpl 失活并用 Options API 落地页面级 Store；通过 resolutions 统一 Webpack 5 实现本机二次构建约 300s → 30s；抽象沉淀 3 个 npm 开源包。',
    stack: ['Vue 2.6', 'single-spa', 'Lerna Monorepo', 'Webpack 5', 'ECharts', 'VXE Table'],
  },
  {
    number: '04',
    period: '2026.07 — 至今',
    phase: 'AI 应用全栈与 Agent 工程化',
    company: '个人深度研发',
    title: '从调用模型，进化为设计受约束、可验证的 AI 工程系统。',
    summary:
      '独立架构并交付 NovaWing Development Guardian（AI Coding 独立审查、人工审批门与断点恢复系统）与 OfferFlow（全栈 LLM + SSE 结构化求职决策台），将隐性协作约束沉淀为 ai-code-rules。',
    breakthrough:
      '把 7 年复杂前端的状态机思维、边界治理与可观测经验迁移到 Agent Runtime 编排中：执行、验证、审查与决策权清晰解耦。',
    stack: ['Agent Runtime 编排', 'LLM / SSE', 'Node.js / Fastify', 'Prisma / SQLite', 'TypeScript'],
  },
]

export const stackDomains: StackDomain[] = [
  {
    category: '核心框架与微前端',
    tag: 'FOUNDATION',
    items: ['Vue 2 / Vue 3', 'TypeScript', 'Pinia / Vuex', 'Vite / Webpack 5', 'single-spa', 'Lerna Monorepo'],
    note: '覆盖新架构选型与老系统渐进治理，具备构建链路根因排查能力',
  },
  {
    category: '复杂页面与状态治理',
    tag: 'ARCHITECTURE',
    items: ['页面级 Store 边界', '多模块局部状态', '路由上下文承接', 'adapter / mapper 转换层', '异步状态机兜底'],
    note: '真实业务经验已抽象并发布为 vue-page-store / vue-page-scope / vue-page-runtime',
  },
  {
    category: '配置化与数据可视化',
    tag: 'DATA & SCHEMA',
    items: ['字段 Schema 驱动表单', '嵌套与多区域拖拽配置', '跨项联动与全量校验', 'ECharts', 'Element / Naive UI / VXE Table'],
    note: '支撑图表、表格、明细下钻联动、双视图聚合与批量导入导出',
  },
  {
    category: '多端交付与原生能力',
    tag: 'MULTI-PLATFORM',
    items: ['微信原生小程序', '微信支付 / 支付分', 'uni-app', '腾讯 TRTC / TIM', 'Nuxt 3 SSR 预渲染', 'OAuth / 定位设置'],
    note: '熟悉微信生态支付回调、分包架构、App 原生插件与常驻保活边界',
  },
  {
    category: 'AI 应用与 Agent 工程化',
    tag: 'AI EVOLUTION',
    items: ['Agent 执行/验证/审查分离', 'Human-in-the-loop 审批门', 'Checkpoint 断点恢复', 'LLM / SSE 流式协议', 'Node.js / Fastify / SQLite'],
    note: '用传统工程确定性约束模型不确定性，让 AI 结果真正进入业务数据链路',
  },
  {
    category: '工程质量与可观测交付',
    tag: 'DELIVERY',
    items: ['自动化测试与接口覆测', 'Sentry 监控与 Sourcemap 隔离', 'Stale Chunk 恢复', 'strict CSP 静态安全', 'AI 协作规则沉淀'],
    note: '从代码实现、验证、发布追溯（version.json）到故障恢复全流程负责',
  },
]

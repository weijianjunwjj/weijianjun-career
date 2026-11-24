export interface StackDomain {
  category: string
  tag: string
  items: string[]
  note: string
}

export const stackDomains: StackDomain[] = [
  {
    category: '核心框架与微前端',
    tag: 'FOUNDATION',
    items: ['Vue 2 / Vue 3', 'TypeScript', 'Webpack 5 / Vite', 'single-spa / Lerna'],
    note: '兼顾新项目架构选型与老系统渐进治理，具备构建链路根因排查能力',
  },
  {
    category: '复杂页面与状态边界',
    tag: 'ARCHITECTURE',
    items: ['页面级 Store', 'adapter / mapper', '异步状态机', 'vue-page-* 开源库'],
    note: '将高状态密度页面的治理经验抽象并发布为 3 个 npm 开源包',
  },
  {
    category: '配置化与数据可视化',
    tag: 'DATA & SCHEMA',
    items: ['Schema 物料协议', 'ECharts / 多维透视', 'VXE Table / Naive UI', '跨项全量校验'],
    note: '支撑图表配置化编译、明细下钻联动、双视图聚合与批量异步导入导出',
  },
  {
    category: '多端交付与原生能力',
    tag: 'MULTI-PLATFORM',
    items: ['微信原生小程序', '微信支付 / 支付分', 'uni-app / OAuth', 'TRTC / Nuxt 3 SSR'],
    note: '熟悉微信支付异步回调、App 原生插件桥接、常驻保活与选择性预渲染',
  },
  {
    category: 'AI 工程化加持',
    tag: 'AI LEVERAGE',
    items: ['Agent 职责分离', 'Human-in-the-loop', 'LLM / SSE 流式协议', 'Node.js / Fastify'],
    note: '用传统前端确定性思维约束模型输出，覆盖企业流式排障与 Agent 守护系统',
  },
  {
    category: '工程质量与可观测交付',
    tag: 'DELIVERY',
    items: ['TS AST 接口覆测', 'Sentry / Sourcemap', 'Stale Chunk 恢复', 'AI 协作规则沉淀'],
    note: '从契约校验、自动化测试到发布追溯（version.json）与异常兜底全程负责',
  },
]

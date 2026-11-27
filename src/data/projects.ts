import { publicAsset } from '../utils/publicAsset.ts'
import { links } from './links.ts'

export interface HeroStageItem {
  id: 'courier' | 'analytics' | 'lowcode' | 'liveshop'
  tabLabel: string
  badge: string
  desktopLabel?: string
  secondaryTitle?: string
  title: string
  subtitle: string
  provenance: string
  image: string
  thumb?: string
  secondaryImage?: string
  secondaryThumb?: string
  layout: 'dual' | 'desktop'
  alt: string
  secondaryAlt?: string
  highlight: string
  actionLabel: string
  actionHref: string
}

export interface GatewayAppPreview {
  label: string
  src: string
  thumb?: string
  alt: string
  provenance: string
}

export interface GatewayProject {
  id: 'courier' | 'analytics' | 'lowcode' | 'liveshop'
  number: string
  tier: '核心业务' | '架构治理' | '平台工程' | '跨端电商'
  company: string
  period: string
  title: string
  summary: string
  keyProof: string
  metricsOrDecision: string[]
  stack: string[]
  primaryImage: string
  primaryThumb?: string
  primaryAlt: string
  secondaryImage?: string
  secondaryThumb?: string
  secondaryAlt?: string
  appPreviews?: GatewayAppPreview[]
  provenance: string
  workHref: string
  ctaLabel: string
  subLinks?: { label: string; href: string }[]
}

export const heroStageItems: HeroStageItem[] = [
  {
    id: 'courier',
    tabLabel: '01 中邮通',
    badge: '核心业务 · 双端证据',
    desktopLabel: '逍遥邮管理后台 · Vue 3 / Naive UI',
    secondaryTitle: '逍遥邮微信小程序 · 移动端真机视图',
    title: '中邮通 · 逍遥邮小程序 × 运营后台',
    subtitle: '微信支付分先寄后付 + 异步出单状态机 + 双 CSV 异常对账',
    provenance: '脱敏真机截图 & 历史后台 Mock',
    image: publicAsset('evidence/courier/admin-orders.webp'),
    secondaryImage: publicAsset('evidence/courier/mini-booking.webp'),
    layout: 'dual',
    alt: '逍遥邮运营管理后台订单列表，支持地区、服务商、运单号与三态检索',
    secondaryAlt: '逍遥邮微信小程序扫码寄件真机脱敏界面，展示微信支付分先寄后付下单',
    highlight: 'WebSocket 监听异步出单，异常降级 3s 轮询，17s 停轮询、20s 终检防滞留。',
    actionLabel: '查看录屏与状态机证据',
    actionHref: links.workCourier,
  },
  {
    id: 'analytics',
    tabLabel: '02 友谊时光',
    badge: '架构治理 · 微前端数据平台',
    title: '友谊时光 · EBI 行为分析与 SDK 监控',
    subtitle: 'Vue 2.6 页面级 Store 治边界 + Webpack 5 缓存 300s → 30s',
    provenance: '脱敏功能复现（SQLite 固定样本）',
    image: publicAsset('evidence/portfolio/sdk-monitor.webp'),
    thumb: publicAsset('evidence/portfolio/sdk-monitor-720.webp'),
    layout: 'desktop',
    alt: '友谊时光 EBI / CRM 脱敏复现界面，展示多地区 SDK 实时异常事件监控图表与下钻导航',
    highlight: '根治 Vue 2.6 RefImpl 失活并抽象 3 个 npm 开源包；统一 Webpack 5 提效 10 倍。',
    actionLabel: '查看 EBI 复现与治理决策',
    actionHref: links.workAnalytics,
  },
  {
    id: 'lowcode',
    tabLabel: '03 低代码',
    badge: '平台工程 · 可交互沙盒',
    title: '企业级低代码平台 · 物料与数据层',
    subtitle: '4 类图表统一数据层 + O(n) 多维透视 + 字段权限与 CRUD 轮询',
    provenance: '脱敏独立复现（可实时交互沙盒）',
    image: publicAsset('evidence/portfolio/lowcode-workbench.webp'),
    thumb: publicAsset('evidence/portfolio/lowcode-workbench-720.webp'),
    layout: 'desktop',
    alt: '企业级低代码平台独立复现沙盒，左侧展示设计态属性面板，右侧展示多维透视堆叠柱状图与查询 JSON',
    highlight: '在平台既有基座上重构统一图表数据层（+365 / −735 行），闭环导入映射与轮询。',
    actionLabel: '实操 3 合 1 低代码沙盒',
    actionHref: links.workLowcode,
  },
  {
    id: 'liveshop',
    tabLabel: '04 LiveShop',
    badge: '跨端电商 · App 与后台',
    desktopLabel: 'LiveShop 运营后台 · Vue 3 / Naive UI',
    secondaryTitle: 'LiveShop uni-app 客户端 · 首页发现流（H5 Mock）',
    title: 'LiveShop 海外社交电商 App × 后台',
    subtitle: 'uni-app 7 屏核心流程 + 海外 OAuth / PayPal + 109 接口覆测',
    provenance: '历史源码运行 · 本地 SQLite & H5 Mock',
    image: publicAsset('evidence/portfolio/liveshop-orders.webp'),
    thumb: publicAsset('evidence/portfolio/liveshop-orders-720.webp'),
    secondaryImage: publicAsset('evidence/liveshop/app-home.webp'),
    secondaryThumb: publicAsset('evidence/liveshop/app-home-720.webp'),
    layout: 'dual',
    alt: 'LiveShop 海外社交电商管理后台商品订单页，展示组合支付、订单状态与权限菜单',
    secondaryAlt: 'LiveShop uni-app 客户端首页发现流与创作者推荐界面（本地 H5 Mock 演示数据）',
    highlight: 'App 覆盖社区/商城/五态订单与 X OAuth 回跳；后台 TS AST 核验 109 唯一接口。',
    actionLabel: '查看双端证据与权责边界',
    actionHref: links.workLiveshop,
  },
]

export const gatewayProjects: GatewayProject[] = [
  {
    id: 'courier',
    number: '01',
    tier: '核心业务',
    company: '递吾件融网络科技有限公司',
    period: '2023.08 — 2025.05',
    title: '中邮通快递体系 · 逍遥邮小程序与运营后台',
    summary:
      '独立主导快递履约双端前端：C 端/站长端微信原生小程序完成扫码寄件与微信支付分「先寄后付」，Vue 3 后台承载订单检索、出账统计与双账单对账。',
    keyProof: '真机支付分录屏 · 51s 后台录屏 · 9 张脱敏截图 · 线上小程序码',
    metricsOrDecision: [
      '异步出单有界状态机：WebSocket 推送 → 异常降级 3s 轮询 → 17s 停轮询 → 20s 终检防卡死',
      '双账单 CSV 差异比对 + 站长端独立分包（station/），将人工对账压缩为秒级核验',
    ],
    stack: ['微信原生小程序', '微信支付分', 'WebSocket', 'Vue 3 / Pinia'],
    primaryImage: publicAsset('evidence/courier/admin-orders.webp'),
    primaryThumb: publicAsset('evidence/courier/admin-orders.webp'),
    primaryAlt: '逍遥邮运营后台订单管理界面（Mock 数据 · 原始历史后台）',
    secondaryImage: publicAsset('evidence/courier/mini-success.webp'),
    secondaryThumb: publicAsset('evidence/courier/mini-success-720.webp'),
    secondaryAlt: '逍遥邮微信小程序先享后付服务通知与下单成功真机截图',
    provenance: '历史真机脱敏截图 & 原始历史后台 Mock 运行截图',
    workHref: links.workCourier,
    ctaLabel: '验证双端录屏与状态机',
    subLinks: [
      { label: '小程序真机证据', href: links.workCourierMini },
      { label: '后台与对账证据', href: links.workCourierAdmin },
    ],
  },
  {
    id: 'analytics',
    number: '02',
    tier: '架构治理',
    company: '友谊时光科技股份有限公司',
    period: '2025.08 — 2026.05',
    title: '友谊时光 · EBI 游戏行为分析与 SDK 异常监控平台',
    summary:
      '在高状态密度 Vue 2.6 + single-spa 微前端平台负责单用户 7 模块行为查询、异常监控下钻与 CRM 规则配置，以零推倒的渐进治理攻克状态失活与构建瓶颈。',
    keyProof: '3 组脱敏业务复现视图 · 构建提效排查记录 · 3 个已发布 npm 开源包',
    metricsOrDecision: [
      '定位 Vue 2.6 + composition-api 切回前台 RefImpl 失活，以 Options API 页面级 Store 治理并开源',
      '排查子包 webpack@4 导致缓存失效与 Jenkins OOM，resolutions 统一 Webpack 5 提效 300s → 30s',
    ],
    stack: ['Vue 2.6', 'single-spa', 'Webpack 5', 'ECharts / VXE Table'],
    primaryImage: publicAsset('evidence/portfolio/sdk-monitor.webp'),
    primaryThumb: publicAsset('evidence/portfolio/sdk-monitor-720.webp'),
    primaryAlt: '友谊时光 EBI / CRM 实时异常事件监控脱敏复现截图',
    secondaryImage: publicAsset('evidence/portfolio/ebi-user-query.webp'),
    secondaryThumb: publicAsset('evidence/portfolio/ebi-user-query-720.webp'),
    secondaryAlt: '友谊时光单用户行为查询 7 模块独立局部状态脱敏复现截图',
    provenance: '脱敏功能复现（SQLite 固定模拟样本，非生产数据）',
    workHref: links.workAnalytics,
    ctaLabel: '查看 EBI 复现与架构决策',
    subLinks: [{ label: '关联 3 个 npm 开源包', href: '#credentials' }],
  },
  {
    id: 'lowcode',
    number: '03',
    tier: '平台工程',
    company: '企业级低代码平台（脱敏展示）',
    period: 'Vue 3 低代码引擎组件库',
    title: '企业级低代码平台 · 物料协议、图表数据层与渲染权限',
    summary:
      '在团队既有设计器与物料三件套协议之上，聚焦图表统一数据源与多维透视、CRUD 异步导入轮询及审批流字段级权限透传。',
    keyProof: '四层架构与改动落点图 · 3 组可实时操作的低代码交互沙盒',
    metricsOrDecision: [
      '统一 4 类图表数据源（+365 / −735 行），二维 Map O(n) 透视生成堆叠系列并兜底补零',
      'CRUD 异步导入并发轮询（Promise.allSettled）自动停表 + 审批节点字段权限合流隐藏',
    ],
    stack: ['Vue 3', 'Schema 物料协议', 'ECharts', '异步轮询'],
    primaryImage: publicAsset('evidence/portfolio/lowcode-workbench.webp'),
    primaryThumb: publicAsset('evidence/portfolio/lowcode-workbench-720.webp'),
    primaryAlt: '企业级低代码平台独立复现交互沙盒，展示设计态属性面板、多维透视堆叠柱状图与查询 JSON',
    provenance: '脱敏独立复现（本地模拟样本，原平台代码不公开）',
    workHref: links.workLowcode,
    ctaLabel: '实操低代码 3 合 1 沙盒',
    subLinks: [{ label: '四层架构落点图', href: `${links.workLowcode}#lowcode-arch` }],
  },
  {
    id: 'liveshop',
    number: '04',
    tier: '跨端电商',
    company: '递吾件融网络科技有限公司',
    period: '2023.08 — 2025.05',
    title: 'LiveShop 海外社交电商 App 与运营管理后台',
    summary:
      '负责 uni-app（Vue 3 + TS）海外社区/商城/五态订单主流程与海外第三方登录、支付桥接；协同完成 Vue 3 运营后台动态路由与接口契约核验。',
    keyProof: '7 屏 uni-app H5 Mock 演示 · 历史后台订单图 · TS AST 109 接口盘点',
    metricsOrDecision: [
      'App 跨端与原生兜底：X OAuth 跳系统浏览器 onShow 解析回跳；PayPal / Google Play IAP 与双端定位跳转',
      '清晰区分本人主导与团队协作边界，TS AST 盘点并本地覆测 109 个后台唯一接口路径',
    ],
    stack: ['uni-app (Vue 3)', 'TypeScript', 'OAuth / PayPal', 'Naive UI'],
    primaryImage: publicAsset('evidence/portfolio/liveshop-orders.webp'),
    primaryThumb: publicAsset('evidence/portfolio/liveshop-orders-720.webp'),
    primaryAlt: 'LiveShop 后台管理商品订单与金币积分结算界面（本地合成样本）',
    secondaryImage: publicAsset('evidence/liveshop/app-home.webp'),
    secondaryThumb: publicAsset('evidence/liveshop/app-home-720.webp'),
    secondaryAlt: 'LiveShop uni-app 客户端首页发现流与创作者推荐界面（本地 H5 Mock 演示数据）',
    appPreviews: [
      {
        label: '首页发现',
        src: publicAsset('evidence/liveshop/app-home.webp'),
        thumb: publicAsset('evidence/liveshop/app-home-720.webp'),
        alt: 'LiveShop App 首页发现流与创作者推荐界面（本地 H5 Mock 演示）',
        provenance: '原始 uni-app 源码 H5 视图 · 本地 Mock 数据',
      },
      {
        label: '个人主页',
        src: publicAsset('evidence/liveshop/app-person.webp'),
        thumb: publicAsset('evidence/liveshop/app-person-720.webp'),
        alt: 'LiveShop App 创作者个人主页与相册/动态双栏界面（本地 H5 Mock 演示）',
        provenance: '原始 uni-app 源码 H5 视图 · 本地 Mock 数据',
      },
      {
        label: '商城商品',
        src: publicAsset('evidence/liveshop/app-shop.webp'),
        thumb: publicAsset('evidence/liveshop/app-shop-720.webp'),
        alt: 'LiveShop App 商城类目与双列商品列表界面（本地 H5 Mock 演示）',
        provenance: '原始 uni-app 源码 H5 视图 · 本地 Mock 数据',
      },
      {
        label: '五态订单',
        src: publicAsset('evidence/liveshop/app-order.webp'),
        thumb: publicAsset('evidence/liveshop/app-order-720.webp'),
        alt: 'LiveShop App 五态订单列表与待支付倒计时界面（本地 H5 Mock 演示）',
        provenance: '原始 uni-app 源码 H5 视图 · 本地 Mock 数据',
      },
    ],
    provenance: '原始历史源码运行 · 后台本地 SQLite 样本 & App 本地 H5 Mock 演示',
    workHref: links.workLiveshop,
    ctaLabel: '查看双端证据与 109 API',
  },
]

export const novaWing = {
  id: 'novawing',
  number: '01',
  title: 'NovaWing',
  fullName: 'NovaWing Development Guardian',
  category: 'Agent 工程化 · 独立架构与实现',
  period: '2026.07 — 至今',
  role: '独立研发 · 架构边界、协议设计与验收',
  headline: 'AI 不应该自己给自己的作业打满分。',
  description:
    '基于 Claude Code、Codex 等 Agent Runtime 二次工程化建设，将复杂前端的状态机与边界治理迁移至 AI Coding：实现执行、独立验证、人工审批门与断点恢复的职责解耦。',
  problem:
    '同一个执行 Agent 同时写代码、跑自测并宣布通过，结果并不可信。执行权、验证权与决策权必须分离。',
  solution:
    'Brain / Reviewer 通过结构化协议驱动 Executor，将独立验证失败、人工审批（HUMAN_REQUIRED）与基础设施故障 checkpoint 显式写入审计轨迹。',
  flow: [
    {
      id: 'execute',
      label: '执行任务',
      english: 'EXECUTE',
      boundary: '受限作用域内的代码实现与变更生成，由结构化任务契约约束允许修改路径与轮次上限。',
    },
    {
      id: 'verify',
      label: '独立验证',
      english: 'VERIFY',
      boundary: '脱离执行者自述，独立触发类型检查、构建与自动化测试；失败证据完整落盘保留。',
    },
    {
      id: 'review',
      label: '审查结果',
      english: 'REVIEW',
      boundary: 'Brain / Reviewer 依据 diff 与验证日志进行独立 Final Review，防止漏检与越界修改。',
    },
    {
      id: 'decide',
      label: '风险判断',
      english: 'DECIDE',
      boundary: '区分任务本身失败与基础设施/传输故障：传输中断只保存 checkpoint，不丢弃已完成工作。',
    },
    {
      id: 'human',
      label: '人工决策',
      english: 'HUMAN',
      boundary: '触发高风险或需确认动作时进入 HUMAN_REQUIRED 挂起态，显式记录审批请求与批准消费。',
    },
    {
      id: 'audit',
      label: '审计轨迹',
      english: 'AUDIT',
      boundary: '从阶段启动、失败重试、人工批准到最终完成全程时间戳留痕，支持回放与恢复。',
    },
  ],
  evidence: [
    {
      id: 'review',
      title: '执行结束，不代表验收结束。',
      label: '独立 Final Review',
      image: publicAsset('projects/nova-wing/review.webp'),
      thumb: publicAsset('projects/nova-wing/review-660.webp'),
      width: 1320,
      height: 570,
      alt: 'NovaWing 执行日志真实局部，显示 Executor、验证失败与 Final Review 阶段及完成记录',
      text: '任务实现、独立验证与 Final Review 分离记录；验证失败完整留在证据链内，不被静默覆盖。',
    },
    {
      id: 'human',
      title: '需要人的判断，就明确暂停。',
      label: 'Human-in-the-loop',
      image: publicAsset('projects/nova-wing/human-review.webp'),
      thumb: publicAsset('projects/nova-wing/human-review-660.webp'),
      width: 1320,
      height: 1190,
      alt: 'NovaWing 真实活动与执行日志局部，显示 HUMAN_REQUIRED、审批请求与批准消费记录',
      text: '从 HUMAN_REQUIRED 挂起到审批批准，人的决策成为一等状态机事件而非隐含授权。',
    },
    {
      id: 'recovery',
      title: '中断之后，从可信进度继续。',
      label: 'Checkpoint / Recovery',
      image: publicAsset('projects/nova-wing/recovery.webp'),
      thumb: publicAsset('projects/nova-wing/recovery-660.webp'),
      width: 1320,
      height: 314,
      alt: 'NovaWing 真实恢复提示局部，说明 Brain transport 不可用、checkpoint 已保留和恢复后继续',
      text: '解耦基础设施异常与代码任务失败：保存 checkpoint，恢复后继续 Review 无需重跑已完成变更。',
    },
  ],
  demo: {
    src: publicAsset('projects/nova-wing/demo-preview.mp4'),
    fullSrc: publicAsset('projects/nova-wing/demo.mp4'),
    poster: publicAsset('projects/nova-wing/demo-poster.webp'),
    description: '75 秒 720p 精华预览 · 按需加载，默认不消耗首屏带宽',
    duration: '1:15',
    originalDuration: '13:01',
    fullDescription: '真实原始录屏 · NovaWing 完整运行过程（按需加载）',
    switchFullLabel: '切换 13 分钟完整原始录屏',
    switchPreviewLabel: '切回 75 秒精华预览',
    // 后续可替换为 B 站播放页；空字符串表示暂未接入。
    bilibiliUrl: '',
  },
  links: {
    repo: links.novaRepo,
    showcase: links.novaShowcase,
    project: links.novaProject,
    demo: links.novaDemo,
  },
}

export const aiCompanions = [
  {
    id: 'ai-enterprise-fix',
    badge: '企业 AI 生产排障 · 流式协议治理',
    title: '企业 AI 对话应用流式协议修复与状态兜底',
    summary:
      '接手维护企业 AI 对话应用，根治“重新生成”把累计流式响应误按增量拼接导致的回答重复与漏帧，并补齐异常中断后的光标残留兜底。',
    decisions: [
      '厘清 axios onDownloadProgress 累计文本与增量片段语义，统一按完整 data: 事件幂等重建',
      '将 loading 结束态从业务 done 分支收口至请求终态兜底，消除光标持续闪烁回归',
    ],
    stack: ['LLM Streaming', 'Vue 3', 'axios Progress', 'SSE 解析'],
    href: undefined,
    actionLabel: undefined,
  },
  {
    id: 'offerflow',
    badge: '全栈 AI 应用 · 独立闭环',
    title: 'OfferFlow · AI 求职决策台',
    summary:
      '把岗位、公司、投递流程与面试策略建模为结构化业务实体，LLM 经 SSE 流式分析后由人工确认入库，支持持续对比而非一次性聊天框。',
    decisions: [
      '完整处理 SSE 流式输出、连接中断、主动取消与结构化业务字段映射',
      '实战消费自研 npm 包 vue-page-store 与 vue-page-runtime，验证跨项目复用边界',
    ],
    stack: ['Vue 3 / TS', 'Node.js / Fastify', 'Prisma / SQLite', 'LLM / SSE'],
    href: links.offerFlowRepo,
    actionLabel: '查看 GitHub 源码',
  },
]

import { publicAsset } from '../utils/publicAsset.ts'
import { links } from './links.ts'

export interface HeroStageItem {
  id: string
  tabLabel: string
  badge: string
  desktopLabel?: string
  secondaryTitle?: string
  title: string
  subtitle: string
  provenance: string
  image: string
  secondaryImage?: string
  layout: 'dual' | 'desktop' | 'log'
  alt: string
  secondaryAlt?: string
  highlight: string
  actionLabel: string
  actionHref: string
  isExternal: boolean
}

export interface GatewayAppPreview {
  label: string
  src: string
  alt: string
  provenance: string
}

export interface GatewayProject {
  id: 'courier' | 'lowcode' | 'analytics' | 'liveshop'
  number: string
  tier: '核心项目' | '平台工程' | '真实企业案例' | '补充案例'
  company: string
  period: string
  title: string
  summary: string
  keyProof: string
  metricsOrDecision: string[]
  stack: string[]
  primaryImage: string
  primaryAlt: string
  secondaryImage?: string
  secondaryAlt?: string
  appPreviews?: GatewayAppPreview[]
  provenance: string
  workHref: string
  subLinks?: { label: string; href: string }[]
}

export const heroStageItems: HeroStageItem[] = [
  {
    id: 'courier',
    tabLabel: '中邮通 · 逍遥邮',
    badge: '核心业务 · 双端证据',
    desktopLabel: '逍遥邮管理后台 · Vue 3 / Naive UI',
    secondaryTitle: '逍遥邮微信小程序 · 移动端真机视图',
    title: '逍遥邮微信小程序 × 运营管理后台',
    subtitle: '微信支付分先寄后付 + WebSocket / 阶梯轮询异步出单 + CSV 双账单差异对账',
    provenance: '脱敏真机截图 & 原始历史后台（Mock 样本）',
    image: publicAsset('evidence/courier/admin-orders.webp'),
    secondaryImage: publicAsset('evidence/courier/mini-booking.webp'),
    layout: 'dual',
    alt: '逍遥邮运营管理后台订单列表，支持地区、服务商、运单号、付款状态、订单状态与物流状态多维检索',
    secondaryAlt: '逍遥邮微信小程序扫码寄件真机脱敏界面，展示 EMS 经济快递与微信支付分先寄后付下单',
    highlight: '按订单号建立 WebSocket 监听异步出单，异常降级 3s 轮询，17s 停轮询、20s 终检防滞留。',
    actionLabel: '在项目体验中心查看全套录屏与证据',
    actionHref: links.workCourier,
    isExternal: true,
  },
  {
    id: 'lowcode',
    tabLabel: '低代码引擎',
    badge: '平台工程 · 可交互沙盒',
    title: '企业级低代码平台 · 物料与数据层',
    subtitle: '配置驱动图表数据层与 O(n) 多维透视 + CRUD 异步导入轮询 + 审批节点字段权限',
    provenance: '脱敏独立复现（可实时交互的引擎沙盒）',
    image: publicAsset('evidence/portfolio/lowcode-workbench.jpg'),
    layout: 'desktop',
    alt: '企业级低代码平台独立复现沙盒，左侧展示设计态属性配置面板，右侧展示多维透视堆叠柱状图与编译后查询体 JSON',
    highlight: '在平台既有设计器与物料三件套协议之上，统一 4 类图表数据源（+365 / −735），闭环 CRUD 导入映射与任务轮询。',
    actionLabel: '在体验中心实操低代码交互沙盒',
    actionHref: links.workLowcode,
    isExternal: true,
  },
  {
    id: 'analytics',
    tabLabel: '友谊时光 · EBI',
    badge: '企业数据平台 · 渐进治理',
    title: '游戏行为分析与 SDK 异常监控',
    subtitle: 'Vue 2.6 微前端 7 模块独立局部状态 + Webpack 5 持久化缓存 300s → 30s',
    provenance: '脱敏功能复现（SQLite 固定模拟样本）',
    image: publicAsset('evidence/portfolio/sdk-monitor.jpg'),
    layout: 'desktop',
    alt: '友谊时光 EBI / CRM 脱敏复现界面，展示多地区 SDK 实时异常事件监控图表与下钻导航',
    highlight: '定位 Vue 2.6 + composition-api 切回前台 RefImpl 失活缺陷，以 Options API 页面级 Store 统一治理。',
    actionLabel: '查看 EBI 架构决策与多视图复现',
    actionHref: links.workAnalytics,
    isExternal: true,
  },
  {
    id: 'liveshop',
    tabLabel: 'LiveShop 双端',
    badge: '海外社交电商 · App 与后台',
    desktopLabel: 'LiveShop 运营后台 · Vue 3 / Naive UI',
    secondaryTitle: 'LiveShop uni-app 客户端 · 首页发现流（H5 Mock）',
    title: 'LiveShop 海外社交电商 App × 运营管理后台',
    subtitle: 'uni-app（Vue 3 + TS）7 屏核心界面 + Vue 3 / Pinia 动态路由 + 109 个唯一 API 路径覆测',
    provenance: '原始历史源码运行 · 后台本地 SQLite & App 本地 H5 Mock',
    image: publicAsset('evidence/portfolio/liveshop-orders.jpg'),
    secondaryImage: publicAsset('evidence/liveshop/app-home.webp'),
    layout: 'dual',
    alt: 'LiveShop 海外社交电商管理后台商品订单页，展示金币与积分组合支付、订单状态与侧边业务导航',
    secondaryAlt: 'LiveShop uni-app 客户端首页发现流与创作者推荐界面（本地 H5 Mock 演示数据）',
    highlight: 'App 侧覆盖首页、个人主页、登录、社区、商城/详情与五态订单及 X OAuth / PayPal；后台覆测 109 个唯一接口。',
    actionLabel: '查看 LiveShop 7 屏 App 与后台证据',
    actionHref: links.workLiveshop,
    isExternal: true,
  },
  {
    id: 'novawing',
    tabLabel: 'NovaWing · AI',
    badge: 'Agent 工程化 · 独立研发',
    title: 'NovaWing Development Guardian',
    subtitle: 'Brain / Reviewer 与 Executor 职责分离 · 独立验证 · 人工决策门 · Checkpoint 恢复',
    provenance: '真实运行执行日志截屏（含 13:01 完整录屏）',
    image: publicAsset('projects/nova-wing/review.webp'),
    layout: 'log',
    alt: 'NovaWing 真实执行日志截屏，完整记录 Executor 执行、独立验证失败与 Final Review 验收阶段',
    highlight: '让 AI Coding 不再自测自评：将失败记录保留在证据链中，基础设施异常后从可信断点恢复审查。',
    actionLabel: '下方查看 NovaWing 架构与 13 分钟录屏',
    actionHref: '#ai-engineering',
    isExternal: false,
  },
]

export const gatewayProjects: GatewayProject[] = [
  {
    id: 'courier',
    number: '01',
    tier: '核心项目',
    company: '南京递吾件融网络科技有限公司',
    period: '2023.08 — 2025.05',
    title: '中邮通快递体系 · 逍遥邮小程序与运营后台',
    summary:
      '同一套快递履约业务的双向闭环：C 端/站长端微信原生小程序承担扫码寄件、微信支付与微信支付分「先寄后付」；B 端 Vue 3 + Naive UI 后台负责多维订单检索、出账统计、双 CSV 异常对账与 RBAC 角色权限。',
    keyProof: '真机支付分下单录屏 + 51 秒后台操作录屏 + 9 张脱敏界面截图 + 可扫码真机小程序码',
    metricsOrDecision: [
      '异步出单状态机：WebSocket 推送 → 异常降级 3s 轮询 → 17s 停轮询 → 20s 最终确认并引导订单列表',
      '双账单比对工具：前端直接解析两份账单 CSV，输出缺失项、字段重复项与同键异值差异并一键复制/下载',
      '独立站长分包（station/）：将寄件下单主链路与站长登录/账单管理解耦，保障首包加载体验',
    ],
    stack: ['微信原生小程序', '微信支付 / 支付分', 'WebSocket', 'Vue 3', 'Pinia', 'Naive UI'],
    primaryImage: publicAsset('evidence/courier/admin-orders.webp'),
    primaryAlt: '逍遥邮运营后台订单管理界面（Mock 数据 · 原始历史后台）',
    secondaryImage: publicAsset('evidence/courier/mini-success.webp'),
    secondaryAlt: '逍遥邮微信小程序先享后付服务通知与下单成功真机截图',
    provenance: '历史真机脱敏截图 & 原始历史后台 Mock 运行截图',
    workHref: links.workCourier,
    subLinks: [
      { label: '小程序真机与支付分证据', href: links.workCourierMini },
      { label: '运营后台与账单比对证据', href: links.workCourierAdmin },
    ],
  },
  {
    id: 'lowcode',
    number: '02',
    tier: '平台工程',
    company: '企业级低代码平台（脱敏展示）',
    period: 'Vue 3 低代码引擎组件库',
    title: '企业级低代码平台 · 物料协议、图表数据层与渲染权限',
    summary:
      '以独立组件库包集成到宿主管理后台的 Vue 3 低代码引擎。在团队既有设计器与物料协议之上，聚焦图表物料的配置驱动数据层与多维透视、CRUD 异步导入导出闭环、渲染器审批流字段级权限透传及多款配置物料扩展。',
    keyProof: '四层架构落点图 + 3 组可实时交互的低代码演练台（图表透视 / 字段权限 / 异步任务轮询）',
    metricsOrDecision: [
      '统一图表数据层（+365 / −735 行）：抽离公共数据源处理器，支持分组、汇总与日期/数值分桶，二维 Map O(n) 透视生成堆叠系列',
      'CRUD 通用异步导入导出：模板选择、表头映射、3 种判重策略与仅待处理任务 Promise.allSettled 并发进度轮询 + 自动停表',
      '物料三件套与渲染权限：遵循 config / panel / runtime 扩展配置物料并隔离设计态脏请求；渲染器透传审批节点字段权限实现合流隐藏',
    ],
    stack: ['Vue 3', 'ECharts', 'Element Plus', 'Schema / 物料协议', '多维透视', '异步轮询'],
    primaryImage: publicAsset('evidence/portfolio/lowcode-workbench.jpg'),
    primaryAlt: '企业级低代码平台独立复现交互沙盒，展示设计态属性面板、多维透视堆叠柱状图与编译查询 JSON',
    provenance: '脱敏独立复现（本地模拟样本，原平台代码不公开）',
    workHref: links.workLowcode,
    subLinks: [
      { label: '看四层架构落点图', href: `${links.workLowcode}#lowcode-arch` },
      { label: '体验交互式低代码沙盒', href: `${links.workLowcode}#lowcode-sandbox` },
    ],
  },
  {
    id: 'analytics',
    number: '03',
    tier: '真实企业案例',
    company: '友谊时光科技股份有限公司',
    period: '2025.08 — 2026.05',
    title: 'EBI 游戏行为分析与 SDK 异常监控平台',
    summary:
      '面向游戏运营与分析团队的高状态密度微前端平台。负责单用户 7 类行为查询、漏斗详情下钻、设备明细/分组聚合、SDK 异常监控与 CRM 活动奖品规则配置，并在不推倒老系统的前提下推进页面级状态与构建治理。',
    keyProof: 'SDK 异常监控 / 单用户 7 模块查询 / CRM 奖品配置 3 组脱敏复现视图 + 构建耗时排查记录',
    metricsOrDecision: [
      '页面级 Store 治理：定位 Vue 2.6 + composition-api 切回前台 RefImpl 失活，改回 Options API 实现页面级 Store',
      '构建提效 300s → 30s：排查 Jenkins OOM 与子包显式 webpack@4 导致缓存失效，用根目录 resolutions 统一 Webpack 5',
      'CRM 校验绕过拦截：识别多奖品切换时仅校验当前项的漏洞，主张复用 hasError 全量拦截未删除奖品',
    ],
    stack: ['Vue 2.6', 'single-spa', 'Lerna Monorepo', 'Webpack 5', 'ECharts', 'VXE Table'],
    primaryImage: publicAsset('evidence/portfolio/sdk-monitor.jpg'),
    primaryAlt: '友谊时光 EBI / CRM 实时异常事件监控脱敏复现截图',
    secondaryImage: publicAsset('evidence/portfolio/ebi-user-query.jpg'),
    secondaryAlt: '友谊时光单用户行为查询 7 模块独立局部状态脱敏复现截图',
    provenance: '脱敏功能复现（SQLite 固定模拟样本，非生产数据）',
    workHref: links.workAnalytics,
  },
  {
    id: 'liveshop',
    number: '04',
    tier: '补充案例',
    company: '南京递吾件融网络科技有限公司',
    period: '2023.08 — 2025.05',
    title: 'LiveShop 海外社交电商 App 与管理后台',
    summary:
      '海外社交电商双端协作项目：App 侧基于 uni-app（Vue 3 + TS）主导首页、个人主页、登录、社区、商城与订单及海外支付/OAuth；后台覆盖商品/拼团/众筹/充值订单、运营活动与 RBAC 权限。',
    keyProof: '7 屏 uni-app 客户端 H5 Mock 演示 + 历史后台订单运行截图 + TypeScript AST 109 路径盘点',
    metricsOrDecision: [
      'App 跨端业务闭环：uni-app（Vue 3 + TS）交付首页发现、个人主页、登录、社区、商城/SKU 详情与五态订单',
      '原生系统边界：X OAuth 走系统浏览器回跳 App 在 onShow 解析参数；定位永久拒绝按 iOS/Android 跳转系统设置',
      '后台权限与 109 路径覆测：Vue 3 + Pinia 登录后按菜单动态注入路由，AST 盘点并验证 109 个唯一接口契约',
    ],
    stack: ['uni-app (Vue 3)', 'TypeScript', 'Pinia', 'Naive UI', 'OAuth / PayPal / IAP'],
    primaryImage: publicAsset('evidence/portfolio/liveshop-orders.jpg'),
    primaryAlt: 'LiveShop 后台管理商品订单与金币积分结算界面（本地合成样本）',
    secondaryImage: publicAsset('evidence/liveshop/app-home.webp'),
    secondaryAlt: 'LiveShop uni-app 客户端首页发现流与创作者推荐界面（本地 H5 Mock 演示数据）',
    appPreviews: [
      {
        label: '首页发现',
        src: publicAsset('evidence/liveshop/app-home.webp'),
        alt: 'LiveShop App 首页发现流与创作者推荐界面（本地 H5 Mock 演示）',
        provenance: '原始 uni-app 源码 H5 视图 · 本地 Mock 数据',
      },
      {
        label: '个人主页',
        src: publicAsset('evidence/liveshop/app-person.webp'),
        alt: 'LiveShop App 创作者个人主页与相册/动态双栏界面（本地 H5 Mock 演示）',
        provenance: '原始 uni-app 源码 H5 视图 · 本地 Mock 数据',
      },
      {
        label: '商城商品',
        src: publicAsset('evidence/liveshop/app-shop.webp'),
        alt: 'LiveShop App 商城类目与双列商品列表界面（本地 H5 Mock 演示）',
        provenance: '原始 uni-app 源码 H5 视图 · 本地 Mock 数据',
      },
      {
        label: '五态订单',
        src: publicAsset('evidence/liveshop/app-order.webp'),
        alt: 'LiveShop App 五态订单列表与待支付倒计时界面（本地 H5 Mock 演示）',
        provenance: '原始 uni-app 源码 H5 视图 · 本地 Mock 数据',
      },
    ],
    provenance: '原始历史源码运行 · 后台本地 SQLite 样本 & App 本地 H5 Mock 演示',
    workHref: links.workLiveshop,
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
    '基于 Claude Code、Codex 等成熟 Agent Runtime 进行二次工程化建设，将单轮不可控的 AI Coding 改造为具备职责分离、独立验证、人工决策门与断点恢复能力的受约束研发系统。',
  problem:
    '当同一个执行 Agent 同时负责写代码、跑自测与宣布任务完成，表面“通过”并不等于工程可信。执行权、验证权与最终决策权必须分离。',
  solution:
    '由 Brain / Reviewer 负责审查与风险判断，通过结构化协议驱动 Executor；将独立验证失败、人工审批（HUMAN_REQUIRED）与基础设施故障 checkpoint 显式纳入审计轨迹。',
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
      text: '任务实现、独立验证与 Final Review 分离记录。过程中的验证失败同样完整保留在证据链内，不被静默覆盖。',
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
      text: '从 HUMAN_REQUIRED 挂起到 VERIFICATION_APPROVAL_REQUESTED / APPROVED，人的决策是一等状态机事件。',
    },
    {
      id: 'recovery',
      title: '中断之后，从可信进度继续。',
      label: 'Checkpoint / Recovery',
      image: publicAsset('projects/nova-wing/recovery.webp'),
      thumb: publicAsset('projects/nova-wing/recovery-660.webp'),
      width: 1320,
      height: 314,
      alt: 'NovaWing 真实恢复提示局部，说明 Brain transport 不可用、checkpoint 已保留和修复后恢复继续',
      text: '将基础设施异常与代码任务失败清晰解耦：保存 checkpoint，恢复后继续当前 Review，无需重跑已完成的 Executor 变更。',
    },
  ],
  demo: {
    src: publicAsset('projects/nova-wing/demo.mp4'),
    poster: publicAsset('projects/nova-wing/demo-poster.webp'),
    description: '真实原始录屏 · NovaWing 完整运行过程（点击按需加载）',
    duration: '13:01',
    originalDuration: '13:01.75',
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
    id: 'offerflow',
    badge: '全栈 AI 产品 · 独立开发',
    title: 'OfferFlow · AI 求职决策台',
    summary:
      '拒绝“一次性聊天框”形态：把岗位、公司、投递流程、面试策略与版本记录建模为结构化业务实体，LLM 经 SSE 流式输出分析结果，经人工确认后持久化入库，支持持续对比与迭代。',
    decisions: [
      '通过 SSE 接入 LLM 流式响应，完整处理连接中断、取消请求、异常恢复与结构化字段映射',
      '真实落地消费自研开源包 vue-page-store 与 vue-page-runtime，验证跨项目复用边界',
    ],
    stack: ['Vue 3 / TypeScript', 'Node.js / Fastify', 'Prisma / SQLite', 'LLM / SSE'],
    href: links.offerFlowRepo,
    actionLabel: '查看 GitHub 源码',
  },
  {
    id: 'ai-enterprise-fix',
    badge: '企业 AI 生产排障 · 流式响应治理',
    title: '企业 AI 对话应用流式协议修复与状态兜底',
    summary:
      '不仅做个人 AI 系统，也在企业真实产品中排查生产级流式渲染缺陷：接手维护企业 AI 对话应用，精准修复“重新生成”路径把累计流式响应误按增量拼接导致的回答重复与漏帧问题，并补齐流式结束态兜底避免生成光标残留闪烁。',
    decisions: [
      '流式协议幂等重建：厘清 axios onDownloadProgress 累计文本与增量片段语义边界，统一按完整 data: 事件重算，根治重复拼接与半包漏字',
      '完成态统一收口：将 loading 结束态从业务 done 分支放回请求终态兜底，消除异常中断后的光标持续闪烁回归',
    ],
    stack: ['LLM Streaming', 'Vue 3', 'TypeScript', 'axios Progress', 'SSE / 流式解析'],
    href: undefined,
    actionLabel: undefined,
  },
]

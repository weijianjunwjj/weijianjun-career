export interface ExperienceItem {
  company: string
  role: string
  period: string
  department: string
  stack: string[]
  highlights: string[]
}

export interface EducationItem {
  school: string
  major: string
  degree: string
  period: string
}

export const experience: ExperienceItem[] = [
  {
    company: '友谊时光科技股份有限公司',
    role: '前端开发工程师',
    period: '2025.08 — 2026.05',
    department: '平台技术部 · 游戏行为分析平台（EBI）与 CRM',
    stack: ['Vue 2.6', 'single-spa', 'Webpack 5', 'ECharts / VXE Table'],
    highlights: [
      '负责单用户 7 类行为查询、漏斗与事件分析下钻、SDK 异常监控与 CRM 奖品树规则校验（拦截跨项切换校验绕过）。',
      '定位 Vue 2.6 + composition-api 切回前台 RefImpl 失活缺陷，改以 Options API 落地页面级 Store 分离局部与全局状态，沉淀为 3 个 npm 开源包。',
      '排查微前端子包显式 webpack@4 导致的缓存失效与 Jenkins OOM，以根目录 resolutions 统一 Webpack 5 持久化缓存，二次构建约 300s → 30s。',
    ],
  },
  {
    company: '南京递吾件融网络科技有限公司',
    role: '前端开发工程师',
    period: '2023.08 — 2025.05',
    department: '快递业务平台 · 低代码引擎 · 海外社交电商',
    stack: ['Vue 3 / Pinia', '微信原生小程序', 'uni-app', 'Naive UI'],
    highlights: [
      '主导中邮通/逍遥邮寄件小程序（扫码寄件、微信支付分 WebSocket + 3s 阶梯轮询异步出单、站长分包）与运营后台（订单、出账、双 CSV 账单比对）。',
      '参与企业级低代码平台图表数据层重构（+365 / −735 行，O(n) 多维透视）、CRUD 异步导入轮询与审批节点字段权限；修复企业 AI 对话流式重新生成重复输出缺陷。',
      '主导 LiveShop 海外社交电商 App 核心业务模块（首页/社区/商城/订单）、系统浏览器 X OAuth 回跳、PayPal/Google Play 支付及双端定位权限兜底，协同完成后台 109 接口契约核验。',
    ],
  },
  {
    company: '文思海辉智科科技有限公司无锡分公司',
    role: 'Web 前端工程师',
    period: '2019.03 — 2023.07',
    department: '码上售后音视频客服 · 设备物联 · 品牌官网',
    stack: ['Vue 2 / 3', 'TypeScript', '腾讯 TRTC / TIM', 'Nuxt 3'],
    highlights: [
      '独立搭建售后客服 Web 系统，设计拨号中/被呼叫/通话中三态互斥与忙线派生；主导 Android 服务商 App WakeLock 后台保活与 30 分钟完整重登 TRTC/IM 机制。',
      '负责设备物联小程序核心页面与雅迪品牌官网（Nuxt 3 + Strapi），配置按路由选择性预渲染以兼顾 SEO 与构建速度。',
    ],
  },
]

export const education: EducationItem[] = [
  {
    school: '南京邮电大学',
    major: '计算机科学与技术',
    degree: '本科（继续教育）',
    period: '2024 — 2026',
  },
  {
    school: '上海电子信息职业技术学院',
    major: '移动互联应用技术',
    degree: '大专',
    period: '2016 — 2019',
  },
]

export const languageSkill = '大学英语四级（CET-4），可流畅阅读英文技术文档与第三方 SDK 文档。'

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
    stack: ['Vue 2.6', 'single-spa', 'Lerna Monorepo', 'Webpack 5', 'ECharts', 'VXE Table'],
    highlights: [
      '负责单用户 7 类行为查询、漏斗详情、事件分析到设备明细/分组聚合的下钻链路，以及日志上报配置、SDK 异常监控与 CRM 活动奖品规则配置。',
      '推进页面状态与接口数据转换治理：以 Options API 实现页面级 Store 收敛局部状态与定时生命周期，与全局 Vuex 职责分离；沉淀为开源包。',
      '排查并解决微前端构建缓存从未生效问题：用根目录 resolutions 统一 Webpack 5 并启用 filesystem 缓存，本机二次构建约 300s → 30s。',
    ],
  },
  {
    company: '南京递吾件融网络科技有限公司',
    role: '前端开发工程师',
    period: '2023.08 — 2025.05',
    department: '快递业务平台 · 海外社交电商 · 低代码与 AI 应用',
    stack: ['Vue 3', 'Vite', 'Pinia', 'Naive UI', '微信原生小程序', 'uni-app'],
    highlights: [
      '主导中邮通/逍遥邮快递寄件小程序（下单、微信支付/支付分异步出单状态机、扫站点码寄件、站长端账单）与运营后台（订单、账单、站点申请与批量激活）。',
      '主导 LiveShop 海外社交电商 App 社区、电商、登录与支付模块及后台协作：落地系统浏览器 X OAuth 回跳解析与双端定位权限设置引导。',
      '参与企业级低代码平台图表数据层重构（+365 / −735 行）、CRUD 异步导入导出与渲染器字段权限；接手维护企业 AI 对话应用并修复流式重新生成重复输出问题。',
    ],
  },
  {
    company: '文思海辉智科科技有限公司无锡分公司',
    role: 'Web 前端工程师',
    period: '2019.03 — 2023.07',
    department: '码上售后音视频客服 · 设备物联 · 品牌官网',
    stack: ['Vue 2 / 3', 'TypeScript', 'uni-app', '腾讯 TRTC / TIM', '微信小程序', 'Nuxt 3'],
    highlights: [
      '独立搭建售后客服 Web 系统，设计拨号中/被呼叫/通话中三态互斥与忙线派生；主导 Android 服务商 App WakeLock 保活与 30 分钟完整重登 TRTC/IM 机制。',
      '负责设备物联小程序核心页面与雅迪品牌官网（Nuxt 3 + Strapi），编写 Nuxt 配置实现按路由选择性预渲染。',
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

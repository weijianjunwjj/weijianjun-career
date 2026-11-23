import { publicAsset } from '../utils/publicAsset.ts'
import type { LightboxChapter } from '../components/MediaLightbox.vue'

export type WorkCaseId = 'all' | 'courier' | 'analytics' | 'liveshop'
export type CourierSubView = 'overview' | 'mini' | 'admin'

export interface EvidenceMedia {
  id: string
  title: string
  tag: string
  src: string
  alt: string
  caption: string
  provenance: string
  aspect: 'desktop' | 'phone'
}

export interface VideoEvidence {
  id: string
  title: string
  duration: string
  src: string
  poster: string
  provenance: string
  description: string
  chapters: LightboxChapter[]
}

export interface DecisionCard {
  index: string
  title: string
  problem: string
  decision: string
  outcome: string
}

export interface AsyncScenario {
  id: string
  label: string
  badge: string
  tone: 'cyan' | 'emerald' | 'amber' | 'violet'
  trigger: string
  steps: { time: string; channel: string; action: string; guard: string }[]
  terminalState: string
  uxGuarantee: string
}

export const workOverviewStats = [
  {
    value: '3 大真实业务体系',
    label: '中邮通（核心）/ 友谊时光 / LiveShop',
    detail: '覆盖微信原生小程序、复杂中后台与微前端数据平台',
  },
  {
    value: '13 张实拍 + 2 段录屏',
    label: '真机脱敏与历史后台证据',
    detail: '含真机微信支付分下单录屏、51 秒后台录屏与扫码小程序码',
  },
  {
    value: '100% 边界可核验',
    label: '明确标注样本来源与个人职责',
    detail: '严格区分真机历史记录、脱敏复现样本与本地 Mock 演示',
  },
]

export const courierCase = {
  id: 'courier' as const,
  number: '01',
  tier: '核心项目 · 快递履约双端体系',
  company: '南京递吾件融网络科技有限公司',
  period: '2023.08 — 2025.05',
  title: '中邮通快递体系 · 逍遥邮小程序与运营管理后台',
  subtitle:
    '同一套快递业务的双向前端交付：C 端/站长端微信原生小程序承担扫码寄件与微信支付分「先寄后付」，B 端 Vue 3 + Naive UI 后台承担多维订单管理、出账汇总、双账单 CSV 差异比对与角色权限管控。',
  stack: [
    '微信原生小程序',
    '微信支付 / 微信支付分',
    'WebSocket + 阶梯轮询',
    'Vue 3',
    'Vite',
    'Pinia',
    'Naive UI',
  ],
  miniProgramName: '逍遥邮',
  qrCode: {
    src: publicAsset('evidence/courier/mini-qr.png'),
    alt: '逍遥邮微信小程序真实二维码，支持微信扫码查看线上主体',
    caption: '微信扫码可体验线上「逍遥邮」小程序（实际服务状态以当前线上运营主体为准）',
  },
  crossEndFlow: [
    {
      step: '01',
      side: '小程序端',
      title: '扫码寄件与支付分授权',
      detail: '识别站点码上下文、填写寄收件与物品估重，拉起微信支付分 wxpayScoreUse 或普通微信支付。',
    },
    {
      step: '02',
      side: '异步出单层',
      title: 'WebSocket + 阶梯轮询收敛',
      detail: '等待服务端异步分配运单号并校验服务商余额，异常自动降级 3s 轮询，17s 停止、20s 终检防滞留。',
    },
    {
      step: '03',
      side: '运营后台',
      title: '多维检索与出账监控',
      detail: '同屏核对地区、服务商、运单号、微信支付单号与付款/订单/物流三态，按日/月汇总收款与坏账占比。',
    },
    {
      step: '04',
      side: '财务与权限',
      title: 'CSV 双账单比对 & RBAC',
      detail: '前端直接比对两份账单 CSV 定位缺失、重复与同键异值（如 16 / 18），按角色隔离服务商与站点权限。',
    },
  ],
  miniEvidence: [
    {
      id: 'mini-booking',
      title: '扫码寄件与预估运费',
      tag: '01 寄件下单',
      src: publicAsset('evidence/courier/mini-booking.webp'),
      alt: '逍遥邮微信小程序扫码寄件真机脱敏界面，展示 EMS 经济快递、微信支付分先寄后付与预估运费 8 元',
      caption: '扫站点码自动带入站点上下文，支持地址簿管理、承运商选择与微信支付分先寄后付。',
      provenance: '历史真机脱敏截图（地址与运单已遮蔽）',
      aspect: 'phone',
    },
    {
      id: 'mini-pay-score',
      title: '微信支付分「先寄件后付款」授权',
      tag: '02 支付分授权',
      src: publicAsset('evidence/courier/mini-pay-score.webp'),
      alt: '微信支付分先寄件后付款授权成功弹窗，显示已下单状态',
      caption: '调用 wx.openBusinessView(wxpayScoreUse) 拉起微信原生支付分授权并承接回跳结果。',
      provenance: '历史真机脱敏截图',
      aspect: 'phone',
    },
    {
      id: 'mini-success',
      title: '先享后付服务通知与下单成功',
      tag: '03 异步出单确认',
      src: publicAsset('evidence/courier/mini-success.webp'),
      alt: '微信支付先享后付服务使用通知与逍遥邮下单成功页面，提供查看订单与再来一单入口',
      caption: '服务端异步分配运单号确认后跳转支付分结果页，明确提供「查看订单」与「再来一单」。',
      provenance: '历史真机脱敏截图',
      aspect: 'phone',
    },
    {
      id: 'mini-detail',
      title: '订单详情与运单追踪',
      tag: '04 订单核验',
      src: publicAsset('evidence/courier/mini-detail.webp'),
      alt: '逍遥邮小程序订单详情页，展示下单时间 2023-12-11、脱敏运单号与物品类型',
      caption: '保留单号复制、下单时间与寄收状态核验；异常或未支付订单支持防抖发起普通微信支付。',
      provenance: '历史真机脱敏截图（2023-12-11 留档）',
      aspect: 'phone',
    },
    {
      id: 'mini-settlement',
      title: '履约后微信支付按时扣款',
      tag: '05 结算闭环',
      src: publicAsset('evidence/courier/mini-settlement.webp'),
      alt: '微信支付按时支付成功通知与递吾件融 2 元扣款完成页面',
      caption: '完整闭合「先寄后付」履约周期，验证真实商户主体（递吾件融）的扣款回调通知。',
      provenance: '历史真机脱敏截图',
      aspect: 'phone',
    },
  ] satisfies EvidenceMedia[],
  adminEvidence: [
    {
      id: 'admin-orders',
      title: '订单列表 · 多维检索与三态核对',
      tag: '01 订单中心',
      src: publicAsset('evidence/courier/admin-orders.webp'),
      alt: '逍遥邮管理后台订单列表界面，展示服务商、地区、运单号、付款状态、订单状态和物流状态',
      caption: '支持地区/服务商联动、运单号、微信支付单号等 10 余项筛选条件与表格导出，同屏核对三类业务状态。',
      provenance: '原始历史后台 · Mock 样本数据',
      aspect: 'desktop',
    },
    {
      id: 'admin-compare',
      title: '订单比对 · 双 CSV 账单异常核验',
      tag: '02 账单对账',
      src: publicAsset('evidence/courier/admin-compare.webp'),
      alt: '逍遥邮后台订单比对页，自动识别两份 CSV 账单的缺失单号、重复项与相同单号下不同金额',
      caption: '运营上传两份对账表格后，在前端直接计算独有项、字段重复项与同单号异值（如 16 / 18），一键下载或复制。',
      provenance: '原始历史后台 · Mock 样本数据',
      aspect: 'desktop',
    },
    {
      id: 'admin-billing',
      title: '出账数据 · 收款与坏账统计看板',
      tag: '03 出账统计',
      src: publicAsset('evidence/courier/admin-billing.webp'),
      alt: '逍遥邮后台出账数据页，展示今日与本月总订单款、已收款、未收款与坏账款及环比',
      caption: '按服务商、地区与揽收/下单时间口径聚合今日与本月款项，直观呈现已收、未收与坏账占比。',
      provenance: '原始历史后台 · Mock 样本数据',
      aspect: 'desktop',
    },
    {
      id: 'admin-roles',
      title: '角色管理 · 服务商与站点权限边界',
      tag: '04 RBAC 权限',
      src: publicAsset('evidence/courier/admin-roles.webp'),
      alt: '逍遥邮后台系统管理角色权限列表，区分管理员、北区服务商与南区站点角色',
      caption: '围绕管理员、区域服务商与站点角色配置菜单与操作权限，配套商户账号管理与站点批量激活流程。',
      provenance: '原始历史后台 · Mock 样本数据',
      aspect: 'desktop',
    },
  ] satisfies EvidenceMedia[],
  miniVideo: {
    id: 'mini-demo-video',
    title: '逍遥邮微信小程序 · 真机脱敏录屏',
    duration: '真机录屏',
    src: publicAsset('evidence/courier/mini-demo.mp4'),
    poster: publicAsset('evidence/courier/mini-booking.webp'),
    provenance: '公开脱敏版真机录屏（跳过地址簿与支付分分值）',
    description: '完整呈现扫码寄件填写、拉起微信支付分先寄后付授权、异步下单确认、订单详情与扣款通知。',
    chapters: [
      { label: '扫码寄件与估价', seconds: 0, timeText: '00:00' },
      { label: '支付分授权下单', seconds: 8, timeText: '00:08' },
      { label: '订单确认与详情', seconds: 18, timeText: '00:18' },
    ],
  } satisfies VideoEvidence,
  adminVideo: {
    id: 'admin-demo-video',
    title: '逍遥邮运营管理后台 · 51 秒实操录屏',
    duration: '00:51',
    src: publicAsset('evidence/courier/admin-demo.mp4'),
    poster: publicAsset('evidence/courier/admin-orders.webp'),
    provenance: '原始历史后台 · 本地 Mock 数据实录',
    description: '连续演示订单多维检索、出账统计口径切换、双 CSV 账单差异比对导出与系统角色权限配置。',
    chapters: [
      { label: '订单多维筛选', seconds: 0, timeText: '00:00' },
      { label: '出账数据统计', seconds: 14, timeText: '00:14' },
      { label: '双账单 CSV 比对', seconds: 27, timeText: '00:27' },
      { label: '角色与权限管理', seconds: 40, timeText: '00:40' },
    ],
  } satisfies VideoEvidence,
  asyncScenarios: [
    {
      id: 'ws-success',
      label: '路径 A · WS 实时推送出单',
      badge: 'HAPPY PATH',
      tone: 'emerald',
      trigger: '微信支付分授权返回 outOrderNo，组件建立 wss://.../websocket/{outOrderNo} 连接',
      steps: [
        {
          time: 'T + 0.0s',
          channel: 'WebSocket',
          action: 'wx.connectSocket() 握手成功，触发 onOpen',
          guard: '若存在历史轮询 interval，立即 clearInterval 防双轨并发',
        },
        {
          time: 'T + 1.2s',
          channel: 'WS Push',
          action: '收到服务端推送 { code: 0 }，标记 isOrderSuccess = true',
          guard: '避免客户端盲跳：仍调用 handleQueryOrderStatus() 校验最新订单落库',
        },
        {
          time: 'T + 1.6s',
          channel: 'Navigation',
          action: '确认 waybillCode 已分配，跳转 /pages/order-success-payScore',
          guard: '组件 detached 生命周期自动 websock.close() 释放连接',
        },
      ],
      terminalState: '已出单 · 展示运单号与下单成功页',
      uxGuarantee: '秒级实时反馈，零无效轮询消耗。',
    },
    {
      id: 'ws-fallback-hit',
      label: '路径 B · WS 断连 → 3s 轮询命中',
      badge: 'DEGRADED RECOVERY',
      tone: 'cyan',
      trigger: '弱网或网关抖动触发 websock.onError()，自动切换为无感降级轮询',
      steps: [
        {
          time: 'T + 0.0s',
          channel: 'WS Error',
          action: '捕获 onError，清理遗留 timeout 并立即执行首轮 selectOrder()',
          guard: '传参 showAlert: false 静默查询，避免中间态弹窗打断用户',
        },
        {
          time: 'T + 3.0s',
          channel: 'HTTP Poll',
          action: '启动 3000ms 周期轮询 selectOrder({ orderId: outOrderNo })',
          guard: '监听全局事件总线 closeClearInterval，防止页面切换后内存泄漏',
        },
        {
          time: 'T + 6.0s',
          channel: 'State Match',
          action: '响应命中 waybillCode && orderStatus ∈ ["0", "1"]',
          guard: '执行 clearAll() 清除全部定时器，跳转支付分成功页',
        },
      ],
      terminalState: '降级恢复成功 · 自动跳至成功页',
      uxGuarantee: 'WebSocket 不可用时对寄件用户完全无感，不丢单不卡死。',
    },
    {
      id: 'balance-fail',
      label: '路径 C · 服务商余额不足 / 出单失败',
      badge: 'BUSINESS REJECT',
      tone: 'amber',
      trigger: '服务端异步校验发现服务商余额不足或无法分到运单号',
      steps: [
        {
          time: 'T + 1.4s',
          channel: 'WS / Poll',
          action: 'WS 推送 code === 500 或轮询返回 waybillCode == null && orderStatus === "-1"',
          guard: '立即执行 clearAll() 终止所有轮询与倒计时',
        },
        {
          time: 'T + 1.5s',
          channel: 'Feedback',
          action: '写入 isOrderSuccess = false，弹出明确业务失败原因 Toast',
          guard: '清晰区分“业务出单失败”与“网络未返回”，不误导用户重复支付',
        },
      ],
      terminalState: '明确失败态 · 提示原因并允许重新下单',
      uxGuarantee: '快速止损，将服务端异步资金校验准确翻译为用户可执行提示。',
    },
    {
      id: 'timeout-fallback',
      label: '路径 D · 17s 停轮询 → 20s 终检兜底',
      badge: 'HARD BOUNDARY',
      tone: 'violet',
      trigger: '持续 17 秒仍未收到明确出单/失败状态（如三方承运商回调延迟）',
      steps: [
        {
          time: 'T + 17.0s',
          channel: 'Guard Timer',
          action: '触发 setTimeout(17000)，执行 clearInterval(interval) 停止常规轮询',
          guard: '封顶请求次数，保护弱网设备电量与接口配额',
        },
        {
          time: 'T + 20.0s',
          channel: 'Final Probe',
          action: '触发 setTimeout(20000)，执行最后一次确认查询 query(last = 1)',
          guard: '给异步链路预留最后 3 秒缓冲窗口捕捉迟到回写',
        },
        {
          time: 'T + 20.3s',
          channel: 'Safe Exit',
          action: '若仍返回 code 500 或异常，清理全部句柄并跳转 /pages/order-history',
          guard: '另在当前寄件页启用了 750ms 轮询 payscoreStatus / 10s 超时回退列表的轻量化路径',
        },
      ],
      terminalState: '收敛至订单列表 · 绝不停留在不确定等待态',
      uxGuarantee: '最坏情况也有确定出口，用户可在订单列表继续跟进或补付。',
    },
  ] satisfies AsyncScenario[],
  decisions: [
    {
      index: '01',
      title: '异步出单不确定性收敛（小程序）',
      problem: '微信支付分授权成功只代表信用锁定，能否分到运单号、服务商余额是否充足需等服务端异步结果。',
      decision:
        '设计 WebSocket 主通道 + 3s 静默轮询降级 + 17s 停轮询 + 20s 终检回退订单列表的有界状态机，并配合 online-shipping.js 的 750ms/10s payscoreStatus 轮询契约。',
      outcome: '彻底消除用户卡在“加载中”的死角，任何异常都能收敛到成功页、失败提示或订单列表。',
    },
    {
      index: '02',
      title: '微信支付与微信支付分双轨封装',
      problem: '订单详情与历史列表存在普通微信支付补付，寄件页存在 wxpayScoreUse 先享后付，签名参数与回调语义不同。',
      decision:
        '普通支付防抖调用 preparePay 并显式将 packageVal 映射为 package 后调起 wx.requestPayment；支付分通过 wx.openBusinessView 承接独立状态轮询。',
      outcome: '两条支付链路职责清晰隔离，并支持脱离微信真机的 Node VM 替身回归测试验证。',
    },
    {
      index: '03',
      title: 'C 端主包与站长端分包隔离',
      problem: '寄件用户高频扫码直达下单页，而站长登录、站点订单与账单属于低频运营能力。',
      decision: '在 app.json 中将 station/ 拆为独立分包，主包聚焦扫码寄件、地址簿与支付核心路径。',
      outcome: '保持扫码即寄的轻快首包体验，同时共享统一请求拦截器与登录会话工具。',
    },
    {
      index: '04',
      title: '前端 CSV 双账单差异比对（运营后台）',
      problem: '财务与运营经常需要核对平台订单与承运商账单差异，手工在 Excel 中 VLOOKUP 耗时且易漏错。',
      decision:
        '在运营后台内置订单比对页，直接解析两份上传表格并按主单号/金额字段输出缺失项、重复项与同键异值差异，支持一键复制与结果下载。',
      outcome: '把高频人工对账变成秒级可复现的后台工具，减少人工核对差错。',
    },
  ] satisfies DecisionCard[],
}

export const analyticsCase = {
  id: 'analytics' as const,
  number: '02',
  tier: '真实企业案例 · 微前端数据平台与渐进治理',
  company: '友谊时光科技股份有限公司',
  period: '2025.08 — 2026.05',
  title: 'EBI 游戏行为分析、SDK 异常监控与 CRM 规则配置',
  subtitle:
    '面向游戏运营、数据与研发团队的高状态密度微前端平台。在既有 Vue 2.6 + single-spa + Lerna Monorepo 体系内，不做推倒重来，而是通过页面级 Store、adapter/mapper 数据层与构建缓存根因治理，让复杂页面长期可维护。',
  stack: ['Vue 2.6', 'single-spa 微前端', 'Lerna Monorepo', 'Webpack 5', 'ECharts', 'VXE Table', 'Element UI'],
  evidenceNote:
    '以下 3 组界面来自独立脱敏功能复现工作台（原生 ESM + 本地 SQLite 固定模拟样本，不含任何公司源码或生产数据），用于直观还原单用户 7 模块局部状态、SDK 异常监控与 CRM 奖品规则联动。',
  evidence: [
    {
      id: 'sdk-monitor',
      title: 'SDK 实时异常事件监控',
      tag: '01 异常监控与图表下钻',
      src: publicAsset('evidence/portfolio/sdk-monitor.jpg'),
      alt: '友谊时光 EBI / CRM 脱敏复现界面，展示多地区 SDK 实时异常事件监控图表与下钻导航',
      caption: '支持多发行地区切换、平台/粒度/指标口径筛选与 4 组实时异常趋势堆叠柱状图，点击时段即可下钻设备分布。',
      provenance: '脱敏功能复现 · SQLite 固定模拟样本',
      aspect: 'desktop',
    },
    {
      id: 'ebi-user-query',
      title: '单用户行为查询 · 7 模块局部状态边界',
      tag: '02 页面级 Store 治理',
      src: publicAsset('evidence/portfolio/ebi-user-query.jpg'),
      alt: '单用户行为查询界面，展示公共设备与日期条件上提，以及 7 类行为模块独立筛选、列配置与首次展开按需加载',
      caption: '同一设备的 7 类行为同页展示：公共日期与设备 ID 上提，各模块独立维护筛选、分页与列配置，未展开模块延迟加载。',
      provenance: '脱敏功能复现 · SQLite 固定模拟样本',
      aspect: 'desktop',
    },
    {
      id: 'crm-activities',
      title: 'CRM 活动与抽奖配置 · 奖品树规则校验',
      tag: '03 配置化表单与校验治理',
      src: publicAsset('evidence/portfolio/crm-activities.jpg'),
      alt: 'CRM 活动与抽奖配置界面，展示活动配置列表与奖品树概率校验联动说明',
      caption: '三步向导配置奖品树并保留各节点编辑草稿，覆盖产品组总概率 ≤ 100%、SKU、库存与限领等复杂业务校验。',
      provenance: '脱敏功能复现 · SQLite 固定模拟样本',
      aspect: 'desktop',
    },
  ] satisfies EvidenceMedia[],
  decisions: [
    {
      index: '01',
      title: 'Vue 2.6 老系统页面级 Store：不盲目升级，先治边界',
      problem:
        '单用户 7 模块查询在联调时出现子应用切回前台后模块自动收起且无法展开的隐蔽缺陷；全局 Vuex 又被塞满页面级临时状态。',
      decision:
        '对比刷新与切回两条路径日志，精准定位 Vue 2.6 + composition-api 返回列数据变成 RefImpl 导致响应式丢失。评估后不升级 Vue 2.7，回归 Options API 实现页面级 Store 收敛局部状态/可见性生命周期/定时器，与全局 Vuex 职责彻底分开。',
      outcome:
        '不仅解决子应用切回失活问题，出现第二套同类方案时坚持统一到既有实现，并抽象沉淀为 npm 开源包 vue-page-store / vue-page-scope / vue-page-runtime。',
    },
    {
      index: '02',
      title: '微前端构建耗时根因排查：300s → 30s 且零侵入可回滚',
      problem:
        'Lerna + yarn workspaces 约 10 个子应用在 Jenkins 近 10 次构建平均 8.6 分钟；直接开启并发打包虽本地降速，但在 Jenkins 触发 OOM (exit 137)。',
      decision:
        '深入依赖树发现两个子包显式声明 webpack@4，导致已配置的持久化缓存从未真正生效。采用根目录 resolutions 统一至 Webpack 5（零业务代码改动，删掉即可回滚）并启用 filesystem 缓存。',
      outcome: '本机无改动二次构建由约 300 秒降至约 30 秒；运维在 Jenkins 挂载缓存目录后同样生效。',
    },
    {
      index: '03',
      title: '同路由双视图聚合：一处承接上下文，零页面复制',
      problem: '设备明细页同时承接漏斗详情与事件分析两个上游入口，新增“分组聚合”需求时若复制新路由会导致上下文逻辑分叉。',
      decision: '在同一路由内组织“明细 / 分组”双视图与分组弹窗：路由上下文只承接一处，各视图与弹窗分页状态严格独立，弹窗直接复用设备表格组件。',
      outcome: '消除双份维护成本，上游任意下钻路径均保持行为一致。',
    },
    {
      index: '04',
      title: 'CRM 奖品表单校验绕过漏洞发现与收敛方案',
      problem: 'PrizeForm 只渲染当前选中奖品并上报 hasError，而“下一步”仅校验当前激活表单——切到已通过的奖品即可绕过其他奖品错误。',
      decision: '主动发现并上报该边界漏洞；在方案评审中主张复用已有 hasError 状态拦截全部未删除奖品，而非在数据层重复维护第二套校验规则。',
      outcome: '以最小改造成本堵住多树节点表单校验漏网风险，保证校验逻辑单一真相源。',
    },
  ] satisfies DecisionCard[],
}

export const liveshopCase = {
  id: 'liveshop' as const,
  number: '03',
  tier: '补充案例 · 海外社交电商后台与跨端 App',
  company: '南京递吾件融网络科技有限公司',
  period: '2023.08 — 2025.05',
  title: 'LiveShop 海外社交电商管理后台与 uni-app 客户端',
  subtitle:
    '覆盖海外社交电商多类型交易后台（商品、拼团、众筹、充值订单、运营活动、社区与系统权限）与移动端社区、电商、登录、支付模块交付。',
  stack: ['Vue 3', 'TypeScript', 'Pinia', 'Naive UI', 'Vite', 'uni-app', 'OAuth / 跨端支付'],
  evidenceNote:
    '下图展示原始历史后台前端界面运行于本地隔离 SQLite 合成样本服务（不含真实线上用户、支付凭据或生产数据），用于验证动态路由、表格筛选与 109 接口路径联调覆盖。',
  evidence: [
    {
      id: 'liveshop-orders',
      title: '商品订单管理 · 金币与积分组合结算',
      tag: '01 交易订单与权限导航',
      src: publicAsset('evidence/portfolio/liveshop-orders.jpg'),
      alt: 'LiveShop 海外社交电商后台商品订单页面，展示用户 ID、支付金币、支付积分、付款时间、订单状态与动态权限菜单',
      caption: '涵盖商品/拼团/众筹/充值四类订单视图，结合用户 ID、订单状态与时间窗检索，并支持发货与退款流转。',
      provenance: '原始历史后台界面 · 本地 SQLite 合成样本',
      aspect: 'desktop',
    },
  ] satisfies EvidenceMedia[],
  contractMetrics: [
    { value: '109 / 109', label: 'TypeScript AST 盘点唯一接口路径', detail: '覆盖订单、商品规格、运营统计与权限菜单' },
    { value: '动态 RBAC', label: '登录后按菜单动态注入路由', detail: 'router/beforeEach 与后端接口鉴权双向一致' },
    { value: '双端原生兜底', label: 'X OAuth 回跳 + iOS/Android 定位跳转', detail: 'onShow 解析启动参数，拒绝权限精准导流系统设置' },
  ],
  decisions: [
    {
      index: '01',
      title: '动态菜单路由注入与接口覆盖盘点',
      problem: '多角色电商运营后台涉及商品、活动、订单、社区与推广 8 大业务域，权限错配或接口契约漂移极易引发线上事故。',
      decision:
        '基于 Vue 3 + Pinia + beforeEach 登录后按菜单动态注册路由，统一 http/request.ts 拦截规范，并通过 TypeScript AST 脚本自动扫描 src/api/ 核验全部 109 个唯一接口路径。',
      outcome: '菜单权限、路由可达性与前后端接口契约保持严格一致，本地 SQLite 自动化测试完整覆盖核心状态流转。',
    },
    {
      index: '02',
      title: '海外 App 第三方 OAuth 登录闭环（uni-app）',
      problem: '海外 X (Twitter) 登录受限于内嵌 WebView 安全策略，无法直接在应用内完成授权。',
      decision: '将 X 授权切换至系统默认浏览器完成 OAuth，再通过自定义 Scheme 回跳 App，在 App 生命周期 onShow 中解析启动参数完成会话建立。',
      outcome: '兼容海外账号安全策略，解决内嵌 WebView 拦截导致的登录中断。',
    },
    {
      index: '03',
      title: '定位权限永久拒绝的平台差异化兜底',
      problem: '用户首次点击“不再询问 / 拒绝”后，再次调用定位 API 会静默失败，导致依赖区域的社交与电商功能不可用。',
      decision: '识别永久拒绝状态后，按 iOS 与 Android 平台差异直接调起对应系统设置页面并给出清晰引导文案。',
      outcome: '减少海外用户因权限卡死造成的流失，保持多端体验一致性。',
    },
  ] satisfies DecisionCard[],
}

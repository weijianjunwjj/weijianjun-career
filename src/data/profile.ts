import { POSITIONING } from './siteConfig.ts'

export const profile = {
  name: '魏建军',
  englishName: 'WEI JIANJUN',
  positioning: POSITIONING,
  role: POSITIONING,
  chineseRole: POSITIONING,
  experience: '7 年前端工程经验',
  location: '江苏 / 上海 · 可远程或现场协同',
  headlineTop: '7 年复杂前端底盘',
  headlineBottom: '× AI 应用工程化交付',
  intro: '面向高状态密度业务系统、微信原生小程序与可验证 AI Agent 工程架构。',
  description:
    '从微信支付分异步出单、百万级事件行为分析平台，到具备独立验证与断点恢复能力的 AI Coding 守护系统。习惯先划清状态边界与数据转换层，再交付经得起验证的结果。',
  email: '2661043132@qq.com',
  phone: '18352517082',
  statement: '代码可以被加速生成，系统边界与交付确定性需要工程判断。',
  heroFacts: [
    {
      value: '7 年',
      label: '复杂业务交付底盘',
      detail: '快递寄件、游戏数据平台、海外电商与音视频客服',
    },
    {
      value: '300s → 30s',
      label: 'EBI 微前端构建治理',
      detail: '根目录 resolutions 统一 Webpack 5 持久化缓存实测',
    },
    {
      value: '3 开源 + 2 AI',
      label: 'npm 资产与 AI 工程演进',
      detail: 'vue-page-* 开源库、NovaWing 与 OfferFlow 闭环',
    },
  ],
  valuePillars: [
    {
      index: '01',
      title: '先划边界，再写页面',
      text: '把局部状态、可见性生命周期、定时器与接口适配层收敛清晰，不在 Vue 2 老系统里盲目推倒重来，而是通过渐进治理建立可维护边界。',
    },
    {
      index: '02',
      title: '把不确定性收敛为确定状态',
      text: '从微信支付分异步出单的 WebSocket + 3s 阶梯轮询兜底，到 CRM 奖品树跨项校验绕过识别，专注极端路径与异常收敛。',
    },
    {
      index: '03',
      title: 'AI 工程化：可验证而非盲信',
      text: '从修复企业 AI 对话流式增量重复，到独立架构 OfferFlow 与 NovaWing，让模型输出进入结构化业务实体、独立审查与人工决策门。',
    },
  ],
  meta: {
    title: `魏建军 · ${POSITIONING}`,
    description:
      '7 年前端工程经验，聚焦复杂中后台、微信小程序、微前端数据平台与 AI 应用/Agent 工程化。查看中邮通、友谊时光 EBI、LiveShop、NovaWing 真实工程证据与完整简历。',
  },
}

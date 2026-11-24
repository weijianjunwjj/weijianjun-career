import { MAIN_SITE_URL, RESUME_HREF, WORK_SITE_URL, workUrl } from './siteConfig.ts'

export const links = {
  main: MAIN_SITE_URL,
  work: WORK_SITE_URL,
  workCourier: workUrl('projects/courier/'),
  workCourierMini: workUrl('projects/courier/mini/'),
  workCourierAdmin: workUrl('projects/courier/admin/'),
  workAnalytics: workUrl('projects/analytics/'),
  workLowcode: workUrl('projects/lowcode/'),
  workLiveshop: workUrl('projects/liveshop/'),
  github: 'https://github.com/weijianjunwjj',
  repositories: 'https://github.com/weijianjunwjj?tab=repositories',
  novaRepo: 'https://github.com/weijianjunwjj/nova-wing',
  novaShowcase: 'https://github.com/weijianjunwjj/nova-wing-showcase',
  novaProject: 'https://weijianjunwjj.github.io/nova-wing-showcase/',
  novaDemo: 'https://weijianjunwjj.github.io/nova-wing-showcase/#demo',
  offerFlowRepo: 'https://github.com/weijianjunwjj/offer-flow',
  articles: 'https://juejin.cn/column/7649686982609469475',
  resume: RESUME_HREF,
}

export const navigation = [
  { label: '代表项目', accessibleLabel: '跳转到四大真实企业项目证据', href: '#projects' },
  { label: '核心能力', accessibleLabel: '跳转到前端核心与 AI 工程能力矩阵', href: '#capabilities' },
  { label: 'AI 工程化', accessibleLabel: '跳转到 AI 工程化加持案例', href: '#ai-engineering' },
  { label: '履历与开源', accessibleLabel: '跳转到工作经历、教育背景与开源沉淀', href: '#credentials' },
]

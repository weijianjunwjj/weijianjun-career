import { MAIN_SITE_URL, RESUME_HREF, WORK_SITE_URL, workUrl } from './siteConfig.ts'

export const links = {
  main: MAIN_SITE_URL,
  work: WORK_SITE_URL,
  workCourier: workUrl('projects/courier/'),
  workCourierMini: workUrl('projects/courier/mini/'),
  workCourierAdmin: workUrl('projects/courier/admin/'),
  workAnalytics: workUrl('projects/analytics/'),
  workLiveshop: workUrl('projects/liveshop/'),
  github: 'https://github.com/weijianjunwjj',
  repositories: 'https://github.com/weijianjunwjj?tab=repositories',
  novaShowcase: 'https://github.com/weijianjunwjj/nova-wing-showcase',
  novaProject: 'https://weijianjunwjj.github.io/nova-wing-showcase/',
  novaDemo: 'https://weijianjunwjj.github.io/nova-wing-showcase/#demo',
  offerFlowRepo: 'https://github.com/weijianjunwjj/offer-flow',
  articles: 'https://juejin.cn/column/7649686982609469475',
  resume: RESUME_HREF,
}

export const navigation = [
  { label: '核心证据', accessibleLabel: '跳转到核心项目证据入口', href: '#projects' },
  { label: '能力演进', accessibleLabel: '跳转到技术底盘与能力演进', href: '#evolution' },
  { label: 'AI 工程化', accessibleLabel: '跳转到 AI 应用与 Agent 工程化', href: '#ai-engineering' },
  { label: '履历与开源', accessibleLabel: '跳转到工作经历与开源沉淀', href: '#credentials' },
]

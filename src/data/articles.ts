import { links } from './links.ts'

export interface Publication {
  title: string
  summary: string
  source: string
  type: string
  href: string
  action: string
}

export const articles: Publication[] = [
  {
    title: '页面级 Scope：复杂页面的状态边界',
    summary: '源自真实高状态密度业务平台，系统拆解局部状态、副作用、可见性生命周期与全局状态的职责边界。',
    source: '掘金专栏',
    type: '技术专栏',
    href: links.articles,
    action: '阅读专栏',
  },
]

export const openSource: Publication[] = [
  {
    title: 'vue-page-store',
    summary: '由 Vue 2 业务平台治理实践抽象而来的页面级状态与生命周期管理库（npm 已发布，OfferFlow 实战在用）。',
    source: 'GitHub / npm',
    type: '页面状态治理',
    href: 'https://github.com/weijianjunwjj/vue-page-store',
    action: '查看源码',
  },
  {
    title: 'vue-page-runtime',
    summary: '在页面作用域上组织声明式异步任务、依赖调度、竞态收敛与请求中断（npm 已发布）。',
    source: 'GitHub / npm',
    type: '任务编排运行时',
    href: 'https://github.com/weijianjunwjj/vue-page-runtime',
    action: '查看源码',
  },
  {
    title: 'vue-page-scope',
    summary: '轻量级页面作用域容器抽象，衔接多模块局部隔离与组件生命周期清理（npm 已发布）。',
    source: 'GitHub / npm',
    type: '作用域抽象',
    href: 'https://github.com/weijianjunwjj/vue-page-scope',
    action: '查看源码',
  },
  {
    title: 'ai-code-rules',
    summary: '将复杂前端系统的架构边界、代码规范与排障纪律沉淀为 AI Agent 可稳定执行的工程规则集。',
    source: 'GitHub',
    type: 'AI 协作工程规则',
    href: 'https://github.com/weijianjunwjj/ai-code-rules',
    action: '查看规则',
  },
]

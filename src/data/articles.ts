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
    summary: '从真实业务页面出发，持续梳理状态、副作用与生命周期的组织方式。',
    source: '掘金',
    type: '技术专栏',
    href: links.articles,
    action: '阅读专栏',
  },
]
export const openSource: Publication[] = [
  {
    title: 'vue-page-store',
    summary: '源于 Vue 2 业务平台的页面级状态、通信与生命周期治理。',
    source: 'GitHub',
    type: '开源工程资产',
    href: 'https://github.com/weijianjunwjj/vue-page-store',
    action: '查看源码',
  },
  {
    title: 'vue-page-runtime',
    summary: '在页面作用域上组织声明式任务、依赖调度与请求中断。',
    source: 'GitHub',
    type: '任务编排',
    href: 'https://github.com/weijianjunwjj/vue-page-runtime',
    action: '查看源码',
  },
  {
    title: 'ai-code-rules',
    summary: '将复杂系统里的隐性知识与协作边界，沉淀成 AI 可执行的项目规则。',
    source: 'GitHub',
    type: 'AI 协作规则',
    href: 'https://github.com/weijianjunwjj/ai-code-rules',
    action: '查看规则',
  },
]

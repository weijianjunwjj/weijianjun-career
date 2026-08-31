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
    summary: '围绕复杂页面的状态组织与边界划分，沉淀可复用的前端工程思考。',
    source: '掘金',
    type: '技术专栏',
    href: links.articles,
    action: '查看专栏',
  },
]

export const openSource: Publication[] = [
  {
    title: 'NovaWing Showcase',
    summary: '从产品理念、真实 Demo 到高层架构，查看 AI 工程化的实践证据。核心实现保持私有。',
    source: 'GitHub',
    type: '公开项目展示',
    href: links.novaShowcase,
    action: '查看 Showcase',
  },
  {
    title: '代码之外，也持续分享',
    summary: '更多个人公开仓库与工程探索，集中在 GitHub 主页。',
    source: 'GitHub',
    type: '个人公开仓库',
    href: links.repositories,
    action: '查看公开仓库',
  },
]

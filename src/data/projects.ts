import { links } from './links.ts'

export interface Project {
  id: string
  number: string
  eyebrow: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  capabilities: { title: string; text: string }[]
}

export const novaWing = {
  id: 'novawing',
  number: '01',
  eyebrow: 'FEATURED PROJECT / AI ENGINEERING',
  title: 'NovaWing',
  subtitle: '让 AI 开发，从代码生成走向可信交付。',
  description:
    'AI 开发任务的执行、验证、Review 与人类决策闭环。让执行结果经过独立验证与审查，而不止于 AI 自己宣布完成。',
  tags: ['Agent', 'Tool Calling', 'Guardian', 'Review', 'Human-in-the-loop', 'Audit Trail'],
  capabilities: [
    { title: '职责分离', text: 'Brain / Reviewer 判断与审查，Executor 负责工程执行。' },
    { title: '证据驱动', text: '以变更、测试与构建结果验证任务完成状态。' },
    { title: '人类控制', text: '关键决策受控暂停，保留审计轨迹与恢复路径。' },
  ],
  flow: ['任务执行', '独立验证', 'Brain / Reviewer 审查', '风险判断', '必要时人工决策', '审计轨迹'],
  image: '/novawing-review.webp',
  imageAlt: 'NovaWing 真实 Work Session 界面，展示 Task 状态、执行记录与独立 Final Review',
  links: { showcase: links.novaShowcase, project: links.novaProject, demo: links.novaDemo },
} satisfies Project & {
  flow: string[]
  image: string
  imageAlt: string
  links: Record<string, string>
}

export const projects: Project[] = [
  {
    id: 'enterprise',
    number: '02',
    eyebrow: 'ENTERPRISE FRONTEND',
    title: '复杂企业 B 端',
    subtitle: '让复杂业务，成为清晰可维护的产品。',
    description:
      '长期参与企业级产品研发，关注的不只是页面实现，更是业务流程、状态边界与多系统协作。以下展示工程方向，不披露企业业务数据。',
    tags: ['Vue / TypeScript', '微前端', '状态管理', '数据可视化'],
    capabilities: [
      { title: '复杂页面', text: '大型表格、动态表单与复杂交互的组件化组织。' },
      { title: '业务建模', text: '权限、业务流程与页面状态的清晰边界。' },
      { title: '工程体系', text: '微前端、多系统集成与可复用组件体系。' },
    ],
  },
  {
    id: 'delivery',
    number: '03',
    eyebrow: 'END-TO-END DELIVERY',
    title: '全栈 / AI 产品交付',
    subtitle: '从一个页面，走到完整的交付链路。',
    description:
      '前端出身，把产品推进到接口、数据与 AI 服务。用 Node.js / BFF 连接业务能力，让交互、服务和结果验证形成闭环。',
    tags: ['Vue / Nuxt', 'Node.js / BFF', 'REST API', 'WebSocket / SSE'],
    capabilities: [
      { title: '连接服务', text: '通过 BFF 与 REST API 组织数据和业务接口。' },
      { title: '实时交互', text: 'WebSocket / SSE 与 AI API 的流式交互。' },
      { title: '产品交付', text: '业务工具集成，从需求实现推进到结果验证。' },
    ],
  },
]

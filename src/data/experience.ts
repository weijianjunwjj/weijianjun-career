export interface Experience {
  stage: string
  role: string
  direction: string
  capabilities: string[]
}

// Capability stages, not fabricated employment dates or company names.
// Replace with verified CV entries when the user supplies them.
export const experience: Experience[] = [
  {
    stage: '企业项目积累',
    role: '前端研发',
    direction: '长期参与复杂企业级 B 端产品研发，在真实业务中积累前端交付能力。',
    capabilities: ['复杂页面与业务流程', 'Vue / TypeScript'],
  },
  {
    stage: '工程能力拓展',
    role: '前端架构与全栈交付',
    direction: '从组件、状态和工程体系，延伸到 Node.js / BFF、服务接口与多系统集成。',
    capabilities: ['架构与工程化', '端到端交付'],
  },
  {
    stage: 'AI 工程实践',
    role: 'NovaWing · 个人项目',
    direction: '围绕 Agent 执行、独立验证、Review 与人类决策构建可验证的研发闭环。',
    capabilities: ['Agent 工程化', 'Human-in-the-loop'],
  },
]

export const experienceNote = '以能力阶段概览呈现；具体公司、任职时间与完整履历待补充。'

import { publicAsset } from '../utils/publicAsset.ts'

export const links = {
  github: 'https://github.com/weijianjunwjj',
  repositories: 'https://github.com/weijianjunwjj?tab=repositories',
  novaShowcase: 'https://github.com/weijianjunwjj/nova-wing-showcase',
  novaProject: 'https://weijianjunwjj.github.io/nova-wing-showcase/',
  novaDemo: 'https://weijianjunwjj.github.io/nova-wing-showcase/#demo',
  articles: 'https://juejin.cn/column/7649686982609469475',
  resume: publicAsset('resume/wei-jianjun-resume.pdf'),
}
export const navigation = [
  { label: '代表作品', accessibleLabel: '代表作品', href: '#work' },
  { label: '能力演化', accessibleLabel: '能力演化', href: '#evolution' },
  { label: '职业经历', accessibleLabel: '职业经历', href: '#experience' },
  { label: '开源与文章', accessibleLabel: '开源与文章', href: '#writing' },
]

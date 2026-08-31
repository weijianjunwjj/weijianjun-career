# 魏建军 · Frontend & AI Engineering

面向 HR、技术负责人和猎头的单页职业产品页，V0.1。Vue 3 + TypeScript + Vite + pnpm，纯静态，无后端、数据库、登录或统计追踪。

## 本地开发

在原生 Windows 上只使用 `D:/Git/bin/bash.exe`，Node.js 22.18+（已验收 24.14.1），pnpm 9.15.2。

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm test
pnpm preview
```

`pnpm build` 包含严格 TypeScript 检查；`pnpm test` 检查内容约束、资源与构建后的 HTML，因此先 build 再 test。

## 修改内容

| 内容                       | 位置                     |
| -------------------------- | ------------------------ |
| 姓名、定位、简介、价值主张 | `src/data/profile.ts`    |
| 三个项目方向与封面         | `src/data/projects.ts`   |
| 四个能力区域               | `src/data/skills.ts`     |
| 阶段概览 / 真实任职经历    | `src/data/experience.ts` |
| 技术文章、专栏与公开仓库   | `src/data/articles.ts`   |
| 所有外部链接与简历路径     | `src/data/links.ts`      |

个人数据集中于 data，页面结构在 sections，复用组件在 components。`index.html` 为分享标题与摘要的静态入口；修改定位时同步更新。无需引入路由器和全局状态库。

### 补充简历

将经本人确认可公开的真实简历放到 `public/resume.pdf`，把 `links.resume` 改为 `/resume.pdf`。入口会自动从“PDF 待补充”变为下载链接。不要上传未脱敏版本或伪造文件。

### 内容边界

- 当前不存在简历 PDF、具体公司 / 任职日期和公开联系方式；不猜测、不从私人记忆导入。
- 企业 B 端和全栈部分是用户给定能力方向，不冒充具名项目或量化业务案例。
- Experience 是能力阶段概览，不是任职时间轴；获得真实简历后再替换。
- NovaWing 是公开 Showcase，核心源码私有，不标注为核心开源项目。

## 资源来源

- NovaWing 封面：本人公开 [NovaWing Showcase](https://github.com/weijianjunwjj/nova-wing-showcase) 中 `assets/screenshots/03-work-session-final-review.webp`。保留真实截图，仅由 CSS 适应展示区域。
- 项目 / Demo：[公开产品页](https://weijianjunwjj.github.io/nova-wing-showcase/)。不嵌入、不预加载视频，避免影响首屏。
- 文章：[页面级 Scope：复杂页面的状态边界](https://juejin.cn/column/7649686982609469475)，仅标题与一句摘要，不复制全文。
- `public/og.png`：本项目生成的职业分享卡片，仅用于社交预览，不加载到首屏。
- 系统字体、原生 CSS、少量内联线性图标；无远程字体和 CDN 运行时依赖。

## Vercel 部署

`vercel.json` 已配置冻结锁文件安装、Vite 构建、dist 输出与基础安全头。

1. 在 Git Bash 中完成 `gh auth login` 和 `pnpm dlx vercel login`；不要将凭据贴进聊天或仓库。
2. 登录后核验 GitHub 账号确为 `weijianjunwjj`，确认同名仓库不存在，创建 `weijianjun-career` 并推送本项目。只推送本目录，不包含其他项目、记忆库、`.env` 或 `.qa`。
3. 执行 `pnpm dlx vercel --prod`，或在 Vercel 导入对应 GitHub 仓库。使用免费个人项目；如要求付费或改变现有账户权限，停下确认。
4. 配置构建期系统变量自动暴露。`VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` 用于生成绝对 OG 图片 URL，参见 [Vercel 系统环境变量](https://vercel.com/docs/environment-variables/system-environment-variables)。
5. 获得稳定正式域名后设置 `VITE_SITE_URL=https://实际域名` 并重建，自动添加 canonical。未确认域名前不生成假 canonical。本地无域名时不输出图片绝对 URL，图片文件始终就绪。
6. 使用无登录浏览器核对根页面、`/og.png`、所有外链、PDF（补充后）和分享 metadata；确认生产站不要求 Vercel 登录，再交付公开 HTTPS 地址。

当前部署状态与实际测试记录见 [docs/handoff.md](docs/handoff.md)。不以临时、待认领的匿名部署替代稳定职业链接。

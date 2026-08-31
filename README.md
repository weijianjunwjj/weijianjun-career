# 魏建军 · Frontend & AI Product Engineer

V0.2 Visual & Content Rebuild。面向招聘决策者的工程作品主页，以真实简历、真实项目和运行证据说明从复杂前端到全栈 AI / Agent 工程化的能力延伸。

Vue 3 + TypeScript + Vite + pnpm，纯静态；没有后端、CMS、登录、表单或追踪。

## 本轮状态与边界

- 工作分支：`feat/v0.2-visual-rebuild`。
- 只做本地审核，**未 merge / push main，未执行生产部署**。
- 当前生产站仍为 [V0.1](https://weijianjun-career.vercel.app/)；不代表本轮 V0.2 已发布。
- 四种尺寸完整审核图与验收说明：[`docs/v0.2-review/`](docs/v0.2-review/README.md)。
- 原始 `assets/` 全部保留，仍是用户原有未跟踪素材；不要为部署盲目 stage 全部文件。

## 本地开发

原生 Windows 使用 `D:/Git/bin/bash.exe`，已验证 Node.js 24.14.1、pnpm 9.15.2。

```bash
pnpm install --frozen-lockfile
pnpm dev --port 5173 --strictPort
pnpm build
pnpm test
pnpm preview --port 4173 --strictPort
```

开发预览：[127.0.0.1:5173](http://127.0.0.1:5173/)。
生产构建本地预览：[127.0.0.1:4173](http://127.0.0.1:4173/)。

build 包含严格 TypeScript 检查；测试验证构建后的产物，因此先 build 再 test。

## 数据与组件

| 内容                       | 位置                     |
| -------------------------- | ------------------------ |
| 姓名、定位、邮箱、SEO 文案 | `src/data/profile.ts`    |
| NovaWing 证据及真实 Case   | `src/data/projects.ts`   |
| 真实工作与教育经历         | `src/data/experience.ts` |
| 能力演化与日期             | `src/data/skills.ts`     |
| 专栏、开源项目             | `src/data/articles.ts`   |
| 导航、主页链接、简历路径   | `src/data/links.ts`      |

共享样式在 `src/style.css`，项目与正文版式在 `src/sections.css`。
正文按 section 拆分；媒体预览使用原生 dialog / video，没有 UI 库或路由基础设施。
原来的 Why Section 思想已融入 Evolution，旧展示组件和旧派生图不再参与产物，可从 Git 历史恢复。

## 真实简历与内容边界

`assets/resume/魏建军-高级前端工程师-AI应用与Agent工程化.pdf` 是履历事实源，三页已完整阅读。
公开副本：`public/resume/wei-jianjun-resume.pdf`，与原件 SHA-256 一致。

主页展示三段任职、两段教育、真实邮箱，以及三个 Case：NovaWing、游戏行为分析与异常监控平台、OfferFlow。没有推测 OfferFlow 的起止日期，没有伪造业务数字或企业 UI。

**待本人确认的原件冲突：原 PDF 第三页仍包含本轮要求不在主页展示的未完成项目。**
主页正文、展示图片和 SEO 已排除该项目；下载简历原件未擅自改写。如果下载版也必须排除，需要本人提供修订后的 PDF，或明确授权制作删项公开版。

手机号仅保留在原始简历中，首页优先使用真实邮箱。没有从其他私人文件或跨项目记忆导入个人资料。

## 媒体与性能

- 三张真实 NovaWing 截图局部：Final Review / Human Required / Checkpoint Recovery。
- WebP 660px / 1320px 版本；窄屏保持原尺寸并在图片容器内滚动，另有原尺寸弹窗。
- 使用完整原始录屏 `demo.mp4`（13:01.75，75,386,754 bytes），页面加载后通过隐藏预加载器 `preload="auto"` 开始缓存。
- 视频不 autoplay；点击“查看演示”后打开原始视频播放器，由用户点击播放，提供首帧 poster。
- 原始素材未改动。处理参数见 [媒体清单](docs/v0.2-review/README.md#真实素材处理)。
- 新分享图 `public/og.png` 仅供社交预览，不进入首页资源请求。
- 无远程字体、运行时 CDN 或大型视觉依赖。

## SEO 与未来发布

`scripts/site-meta.ts` 从 profile 统一生成 title、description、OG、X 与 canonical。
默认使用用户已确认的生产域名；`VITE_SITE_URL` 可覆盖为另一个确认过的纯 HTTPS origin。
Vercel 配置及安全头保留。

**任何 merge / push main / Production Deploy 都必须先获得用户新的明确确认。**
本轮到本地视觉验收为止，不自动继续 V0.3。

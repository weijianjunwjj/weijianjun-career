# V0.2 Visual Review

本地审核版，2026-08-31。**没有生产发布。**

## 审核入口

- [开发预览](http://127.0.0.1:5173/)
- [生产构建本地预览](http://127.0.0.1:4173/)
- [真实简历](http://127.0.0.1:5173/resume/wei-jianjun-resume.pdf)

| 检查视口   | 完整页面截图                         |
| ---------- | ------------------------------------ |
| 390 × 844  | [mobile-390.png](mobile-390.png)     |
| 430 × 932  | [mobile-430.png](mobile-430.png)     |
| 768 × 1024 | [tablet-768.png](tablet-768.png)     |
| 1440 × 900 | [desktop-1440.png](desktop-1440.png) |

截图覆盖整个页面，而非仅首屏。内置 full-page 捕获出现重复拼接，因此最终使用同一浏览器、同一真实视口逐段截图，按实际 scrollY 去除重叠并拼接为 PNG；将浏览器返回的缩放图规范到目标像素宽度。未生成或改写页面内容。截图中的侧边滚动条属于捕获环境；页面自身无全局横向滚动。

## 视觉与 Typography

深黑蓝 `#080c12`、浅白 `#f0f3f8`、冷薄荷青 `#83e8da`。
正文用系统字体；少量工程标签用 Consolas。没有远程字体请求。
强调字号、留白、非对称构图和真实运行界面，不依赖大面积卡片或动效。

- Desktop：正文 17–18px，次级 15px，信息 Tag 14px；Hero 64–96px，Section H2 36–52px。
- Mobile：正文 16–17px，次级 14px，Tag 13px；Hero 42–58px，Section H2 30–40px。
- 正文行高 1.65–1.75。10–11px 仅用于非关键装饰标签，不承载履历事实。
- NovaWing 大字号品牌字是展示标识，章节 H2 是“AI 不应该自己给自己的作业打满分”。
- 窄屏截图采用原尺寸局部滚动，不把 4K 原图缩成不可读缩略图；原尺寸弹窗保留 1320px。

## 实际检查

- `pnpm install --frozen-lockfile`：通过；保持原依赖体系。
- `pnpm build`：通过，包括 vue-tsc。
- `pnpm test`：7 / 7，通过原测试设施扩展的事实、资源、元数据、媒体和交互约束。
- `git diff --check`：通过；Windows Git 提示换行规范化，不是错误。
- 四个目标视口均无横向溢出，Hero 无截断，项目图不造成页面溢出。
- 手机菜单展开 / Escape / 点击锚点收起通过。
- 三类运行证据切换、原尺寸预览、关闭、Escape 与焦点恢复通过。
- 页面加载后存在隐藏的完整视频预加载器（preload=auto）；打开播放器后仍 autoplay=false，由用户点击播放。完整原始录屏时长约 13:01.75。
- 真实邮箱复制成功；mailto 与 PDF 联系方式一致。没有发送测试邮件。
- PDF 浏览器阅读器显示 3 页；下载文件 462,734 bytes，与原 PDF 哈希一致。
- 内部锚点无失效，单一 H1，图片有 alt，无失败图片。
- 最终重载后的 console error / warning 为 0；开发中间态 HMR 旧错误不计入最终结果。
- 生产产物根页面、PDF、favicon、OG、全部 NovaWing 派生图片与视频均 200，MIME 正确。
- focus-visible、语义 button/link、原生 modal 对话框、reduced-motion 样式已检查。
- 无可见页面正文或元数据包含被排除项目；原 PDF 原件例外见下方。

主要色对的实算对比度：正文 17.62:1、次级正文 8.55:1、最浅表面上的辅助文字 5.71:1、主按钮 12.89:1。生产 JS gzip 38.05 KB，CSS gzip 7.67 KB。详细测量见 [audit.json](audit.json)。

## 外链核验

2026-08-31 核验下列真实公开资源可访问，专栏与仓库名称未虚构：

- [GitHub 主页](https://github.com/weijianjunwjj)
- [NovaWing Showcase](https://github.com/weijianjunwjj/nova-wing-showcase)
- [NovaWing 产品 / 完整 Demo](https://weijianjunwjj.github.io/nova-wing-showcase/#demo)
- [OfferFlow 仓库](https://github.com/weijianjunwjj/offer-flow)
- [掘金专栏](https://juejin.cn/column/7649686982609469475)
- [vue-page-store](https://github.com/weijianjunwjj/vue-page-store)
- [vue-page-runtime](https://github.com/weijianjunwjj/vue-page-runtime)
- [ai-code-rules](https://github.com/weijianjunwjj/ai-code-rules)

## 真实素材处理

原文件全部在 `assets/`，未改动。

| 派生素材          | 来源与处理                                                     |
| ----------------- | -------------------------------------------------------------- |
| review.webp       | 03-work-session-final-review.webp；x1250 y1360，1320×570       |
| human-review.webp | 04-observability-debug.webp；x1225 y255，1320×1190             |
| recovery.webp     | 05-brain-degraded-recovery.webp；x1250 y341，1320×314          |
| \*-660.webp       | 同一局部缩放为 660px，WebP quality 91                          |
| demo.mp4          | 原始录屏完整文件；1920×1080，H.264，13:01.75，75,386,754 bytes |
| demo-poster.webp  | 节选第一帧，约 5.5 KiB                                         |

原录屏：MP4 / H.264，1920×1080，约 29.02fps，13:01.75，无音轨，75,386,754 bytes。
不是加速演示；只做时间节选、局部裁切与压缩。原始录屏未放入 public。

## 内容事实与待确认点

已从原简历使用：姓名和职业定位、7 年前端经验、三段任职及其日期、两段教育、真实项目职责与技术、邮箱、开源资产。
除简历明确的“部分构建场景约 300 秒 → 约 30 秒”外，没有增加成果数字；OfferFlow 未补造日期。
未提供企业项目真实公开截图，因此采用明确标注的结构示意。

**原 PDF 第三页仍含 Fly-Weave。主页、展示截图、视频局部和 SEO 已排除，但下载原件未擅自改写。**
如果要求下载资料也不出现此项目，需要本人提供删项后的真实简历或授权制作公开副本。这是原件内容冲突，不应把它默认为已经解决。

## Git 与发布

分支 `feat/v0.2-visual-rebuild`；修改未提交。main 未改变。
本轮没有 merge、push 或 Production Deploy。生产站当前仍是原版，必须先完成用户人工视觉验收。

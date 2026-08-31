# V0.1 Handoff

更新时间：2026-08-31

## 已完成

- 单页职业产品页：Navbar、Hero、三个代表方向、四区能力地图、Why Me、开源与文章、经历概览、Contact CTA、Footer。
- NovaWing 是最高视觉权重项目；使用本人公开 Showcase 的真实 Final Review 截图，项目页 / Demo / Showcase 均为外链，不在首屏加载视频。
- 内容数据集中于 `src/data`；组件与 section 不存放需要经常更新的个人履历数据。
- 手机菜单、键盘 focus、跳过导航、reduced motion、图片 lazy load / decoding、favicon、OG 分享卡片、轻量 SEO 和 Vercel 安全头。
- PDF 不存在时入口明确显示 “PDF 待补充” 且不可点击，不产生虚假下载。

## 已验证

- `pnpm install --frozen-lockfile`：通过。
- `pnpm build`：通过，包含 `vue-tsc --noEmit`；生产 JS gzip 约 33 KB，CSS gzip 约 5 KB，HTML gzip 不足 1 KB。
- `pnpm test`：5 / 5 通过；覆盖项目边界、HTTPS 资源、缺失简历、内容结构、分享域名校验和生产产物。
- 浏览器：390、430、768、1440 四个目标宽度均无横向溢出；390 手机菜单、锚点导航通过；console error / warning 为 0。
- 外链状态：GitHub 主页、NovaWing Showcase、NovaWing 项目页、掘金专栏均返回 HTTP 200。
- `pnpm audit --audit-level high`：未发现已知漏洞。
- 页面不存在失效内部锚点、重复 ID 或缺少 noopener 的新窗口外链，封面图片已加载。

## 当前外部阻塞

- GitHub CLI 未登录，因此没有创建或推送 `weijianjun-career` 远程仓库，也没有 GitHub URL。
- Vercel CLI 未登录，因此没有创建稳定生产部署，也没有公开 HTTPS URL。
- 匿名临时部署不作为职业产品页最终链接；登录后应按 README 的部署顺序继续。

## 尚缺真实内容

- 经确认可公开的 PDF 简历。
- 真实公司、岗位、任职时间与经确认可以公开的代表案例；目前 Experience 是能力阶段概览。
- 可公开联系方式；当前只提供 GitHub、NovaWing 和技术文章入口。
- 正式域名；因此 canonical 按需求暂不输出，部署时生成绝对 OG URL，确认正式域名后再固定 canonical。

## 部署后复核

1. 核验 GitHub 仓库只包含本项目公开内容。
2. 使用生产 URL 打开根页面和 `/og.png`，检查 Vercel 安全头。
3. 使用无登录窗口核对公开访问、四个外链与分享预览。
4. 如果补充 PDF，检查下载文件名、内容和隐私脱敏。

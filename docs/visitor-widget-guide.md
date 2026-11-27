# 访客组件操作说明（国内解耦底座）

本站主站 `weijianjun.me` 与子站 `work.weijianjun.me` 共用一套**账号无关**的访客底座。默认面向中国大陆不翻墙直连，不加载海外聊天脚本。站长浏览时必须先排除自己，否则会污染欢迎频次与百度统计。

## 架构

1. **采集前守卫**：`isOwnerExcluded()` 为真时，绝不插入 `https://hm.baidu.com/hm.js`、绝不初始化 `window._hmt`、绝不弹欢迎气泡、绝不渲染联系卡或胶囊。loopback 默认也不注入真实百度脚本。
2. **可插拔 Adapter**：`none` / `baidu` / `preview`。生产域（`weijianjun.me` / `*.weijianjun.me`）走 `baidu`（合法 ID 才注入 hm.js，联系卡始终可用）；loopback 带 `?visitor-preview=1` 走 `preview`（完整欢迎与联系卡，不发 hm.js）；其余为 `none`。
3. **前端自主欢迎 + 自研深空联系卡**：与任何第三方客服账号解耦。非站长、本轮未欢迎、页面可见、停留约 4 秒时弹出一次欢迎气泡；点击后展开邮箱 / 微信直联卡片。

主站 `src/main.ts` 与子站 `work/main.ts` 都调用同一套 `setupVisitorWidget`（防重复初始化）。子站 `WorkApp.vue` 在路由变化后调用 `notifyVisitorRouteChange`。

## 公开环境变量

构建期只读取仓库根目录 `.env*` 与进程环境（Vite `envDir` 指向仓库根，子站 `work/` 为 Vite root 时同样生效）：

| 变量 | 含义 | 备注 |
| --- | --- | --- |
| `VITE_BAIDU_HM_ID_MAIN` | 主站 `weijianjun.me` 百度统计 ID | 32 位十六进制公开 ID，不是密钥 |
| `VITE_BAIDU_HM_ID_WORK` | 子站 `work.weijianjun.me` 百度统计 ID | 留空回退 `VITE_BAIDU_HM_ID_MAIN` |

格式须匹配 `/^[a-f0-9]{32}$/i`。留空则优雅跳过脚本注入，**零外链请求**，生产域仍展示欢迎与联系卡。请把真实值写在未跟踪的 `.env` / `.env.local` 或 CI `vars.VITE_BAIDU_HM_ID_MAIN` / `vars.VITE_BAIDU_HM_ID_WORK`（使用 `vars.*`，不要用 `secrets.*`），不要提交进仓库。占位写法见根目录 `.env.example`。

仅在**生产域 + 合法 ID + 非站长**时动态插入 `https://hm.baidu.com/hm.js?<id>`（带 `data-wjj-baidu="1"` 防重）。静态 `dist/index.html` 与 `dist-work/index.html` 不含任何 `src="https?://"` 外链。loopback 即使填了 ID，默认也不向真实百度发数据；`?visitor-preview=1` 只用于本地预览 UI。

## SPA 虚拟 PV（零 PII）

挂载时 `window._hmt = window._hmt || []`。`work.weijianjun.me` 经 `notifyVisitorRouteChange` 的 SPA `pushState` 切页：跳过与初始落地页相同的首条（避免首屏重复记两次 PV）；相同路径去重；只 `window._hmt.push(['_trackPageview', sanitizedPath])`，路径经白名单脱敏，不含 query / PII / 用户输入。

## 微信二维码槽位

真实二维码**不要**提交进未跟踪的 `assets/`，放入站点 public：

- 主站：`public/contact/wechat-qr.webp` → 运行时 `/contact/wechat-qr.webp`
- 子站：`work/public/contact/wechat-qr.webp` → 运行时 `/contact/wechat-qr.webp`

文件尚未放入或图片 `onerror` 时不显示破图，改为占位提示 +「复制微信号 / 电话」。禁止使用中邮通快递的 `mini-qr.png`。

## 站长排除（免 DevTools）

排除标记是双保险：

- Cookie：`wjj_owner_exclude=1`。生产域（`weijianjun.me` 与 `*.weijianjun.me`）写入 `Domain=.weijianjun.me; Path=/; Max-Age=31536000; SameSite=Lax; Secure`，主站与子站共享。
- `localStorage`：`wjj.owner_exclude = '1'`，规避 Safari ITP 对 JS Cookie 的短期限制，以及本地预览。

任意页面打开以下 hash（执行后立刻 `history.replaceState` 清掉，**不写** `location.hash = ''`，避免复制链接误伤访客、也不新增尾部 `#` 历史记录）：

| Hash | 作用 |
| --- | --- |
| `#owner-exclude` | 开启站长排除 |
| `#owner-include` | 解除排除 |
| `#owner-status` | 只查看当前状态 |

页面会出现仅站长可见的浮动提示条：显示当前状态、「切换排除状态」、「同步标记另一站」、Esc 关闭。普通访客看不到该提示条。解除排除时会同步清理 host-only Cookie。

中途开启排除会立即止血：取消欢迎定时器、关闭气泡、关闭联系卡、隐藏「联系魏建军」胶囊、调用 `adapter.stop()` 且不再 `_hmt.push`。若此前已注入真实 hm.js，提示条会请你刷新一次以彻底断开。

### 常用浏览器 / 新设备 / 无痕

1. 用日常浏览的浏览器打开主站或子站任意页，地址栏补上 `#owner-exclude` 回车。
2. 看到提示条显示「站长排除已开启」即可。同一台电脑的主站与子站会共享根域 Cookie。
3. `localStorage` 按源隔离。若某一侧仍出现欢迎气泡，点提示条里的「同步标记另一站」，在另一源再写一次标记。
4. **新设备、无痕窗口、清站点数据、换浏览器配置文件** 都不会带上旧标记，需要再走一遍 `#owner-exclude`。
5. 排除一旦生效：采集前即终止，**不会**挂载 Adapter、**不会**发外链请求、**不会**弹欢迎气泡、**不会**渲染联系入口。

## 到站单次自动欢迎

触发条件（需全部满足）：

- 非站长
- 未标记 `welcome_shown`
- `document.visibilityState === 'visible'`
- 停留约 4 秒（延迟可注入，便于单测）
- 生产域，或本地带 `?visitor-preview=1`

loopback 默认静默。

防连弹：

- 根域会话 Cookie `wjj_welcome_shown=1`（生产域带 `Domain=.weijianjun.me`，**不设 Max-Age/Expires**）
- 同源 `sessionStorage` 键 `wjj.welcome_shown=1`

同一次来访内刷新、SPA 切项目、主/子站互跳只弹一次。关标签即重置。页面隐藏时暂停定时器。

欢迎文案随项目自适应：

| 项目 id | 中文名 |
| --- | --- |
| `courier` | 中邮通快递双端 |
| `analytics` | 友谊时光 EBI 与微前端 |
| `lowcode` | 企业级低代码引擎 |
| `liveshop` | LiveShop 跨端电商 |
| `ai-engineering` | NovaWing AI 工程化 |

有项目：「正在看「企业级低代码引擎」？有想交流的技术细节或岗位机会，欢迎直接联系我。」
无项目：「你好，正在看哪个项目？有想交流的技术细节或岗位机会，欢迎直接联系我。」
主按钮：「邮箱 / 微信直联」；右上角关闭（Esc）。

点击后展开深空玻璃直联卡片（邮箱、微信号取自 `src/data/profile.ts`）：

1. `mailto:` 一键发邮件（打开 Mail），`subject` / `body` 自动编码当前项目中文名；不设 `target="_blank"`。旁配「复制邮箱」，点击后约 2 秒显示「已复制」。
2. 个人微信二维码槽位 `publicAsset('contact/wechat-qr.webp')`。「复制微信号」复制电话 `18352517082`。
3. 欢迎关闭后，左下角极克制胶囊「联系魏建军」可再次打开卡片。站长排除开启时该按钮绝不渲染。

`Esc` 关闭、`role="dialog"`、尊重 `prefers-reduced-motion`。390px 窄屏与桌面均停在左下，不遮挡主按钮。

## 匿名项目上下文

仅同步白名单字段：`site`、脱敏 `path`、项目名（`courier` / `analytics` / `lowcode` / `liveshop` / `ai-engineering`）。不采集 PII、输入值或聊天正文。

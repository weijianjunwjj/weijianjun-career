# 访客组件操作说明（tawk.to）

本站主站 `weijianjun.me` 与子站 `work.weijianjun.me` 共用一套 tawk.to 访客组件。站长浏览时必须先排除自己，否则会污染每日访问次数与对话统计。

## 公开环境变量

构建期只读取仓库根目录 `.env*` 与进程环境（Vite `envDir` 指向仓库根，子站 `work/` 为 Vite root 时同样生效）：

| 变量 | 含义 | 备注 |
| --- | --- | --- |
| `VITE_TAWK_PROPERTY_ID` | tawk.to Property ID | 公开标识，不是密钥 |
| `VITE_TAWK_WIDGET_ID` | tawk.to Widget ID | 公开标识，不是密钥 |

两者任一为空、或不符合 `/^[a-zA-Z0-9_-]+$/` 时，运行时**优雅跳过**，不插入脚本、不报错。请把真实 ID 写在未跟踪的 `.env` / `.env.local` 或 CI 环境变量里，不要提交进仓库。占位写法见根目录 `.env.example`。

本地 loopback（`localhost` / `127.0.0.1` / `::1`）默认不注入外部脚本，避免开发流量污染统计。需要本地预览时在 URL 加上 `?tawk-preview=1`。

## 站长排除（免 DevTools）

排除标记是双保险：

- Cookie：`wjj_owner_exclude=1`。生产域（`weijianjun.me` 与 `*.weijianjun.me`）写入 `Domain=.weijianjun.me; Path=/; Max-Age=31536000; SameSite=Lax; Secure`，主站与子站共享。
- `localStorage`：`wjj.owner_exclude = '1'`，规避 Safari ITP 对 JS Cookie 的短期限制，以及本地预览。

任意页面打开以下 hash（执行后会立刻从地址栏清掉，避免复制链接误伤访客）：

| Hash | 作用 |
| --- | --- |
| `#owner-exclude` | 开启站长排除 |
| `#owner-include` | 解除排除 |
| `#owner-status` | 只查看当前状态 |

页面会出现仅站长可见的浮动提示条：显示当前状态、「切换排除状态」、「同步标记另一站」、Esc 关闭。普通访客看不到该提示条。

### 常用浏览器 / 新设备 / 无痕

1. 用日常浏览的浏览器打开主站或子站任意页，地址栏补上 `#owner-exclude` 回车。
2. 看到提示条显示「站长排除已开启」即可。同一台电脑的主站与子站会共享根域 Cookie。
3. `localStorage` 按源隔离。若某一侧仍加载了聊天气泡，点提示条里的「同步标记另一站」，在另一源再写一次标记。
4. **新设备、无痕窗口、清站点数据、换浏览器配置文件** 都不会带上旧标记，需要再走一遍 `#owner-exclude`。
5. 排除一旦生效：采集前即终止，**不会**插入 `embed.tawk.to` 脚本、**不会**发网络请求、**不会**弹欢迎气泡。

## tawk.to 后台核对

Property 只建一个，Widget 同时放在主站与子站（运行时 JS 注入，HTML 里没有写死的 `https://` 脚本）。

请在 tawk.to 控制台核对：

1. **时区**：`Asia/Shanghai`。
2. **Triggers / 站点通知**：启用 `Basic - Site Notification`（在线时由原生触发器发欢迎，前端不会再弹一次）。
3. **在线**：客服在线时走 tawk 原生欢迎；访客主动打开聊天框后，前端会记下「本轮已欢迎」，刷新或主/子站互跳不再连弹。
4. **离线**：tawk 返回 `offline` 且页面仍可见时，前端约 4 秒后弹出一次轻气泡；点「聊聊 / 留言」会 `maximize()` 打开离线留言框（访客免注册）。页面切到后台会取消未触发的定时器。
5. 单次来访防重使用会话 Cookie `wjj_welcome_shown=1`（生产域带 `Domain=.weijianjun.me`，**不设 Max-Age/Expires**）以及 `sessionStorage` 键 `wjj.welcome_shown`。关标签即重置，同一会话内刷新或跨站不连弹。

## 匿名项目上下文

仅发送白名单字段：`site`、脱敏 `path`、项目名（`courier` / `analytics` / `lowcode` / `liveshop` / `ai-engineering`）。不采集 PII、输入值或聊天正文。每日访问次数直接看 tawk.to 后台，不另接统计服务。

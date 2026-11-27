# 访客组件操作说明（国内解耦底座）

本站主站 `weijianjun.me` 与子站 `work.weijianjun.me` 共用一套**账号无关**的访客回聊底座。默认面向中国大陆不翻墙直连，不加载海外聊天脚本。站长浏览时必须先排除自己，否则会污染欢迎频次与后续通道统计。

## 架构

1. **采集前守卫**：站长排除或 loopback 默认（除非显式 `?visitor-preview=1`）在挂载任何回聊 Adapter、加载任何第三方脚本之前终止。
2. **可插拔 Adapter**：`none` / `pop800` / `preview`。有效 POP800 配置优先；否则本地预览查询走 `preview`；都没有则 `none`（不向生产访客弹空按钮）。
3. **前端自主欢迎**：与客服账号、在线状态解耦。非站长、本轮未欢迎、页面可见、停留约 3–4 秒、且存在可用交互承载层时，弹出一次轻气泡。

主站 `src/main.ts` 与子站 `work/main.ts` 都调用同一套 `setupVisitorWidget`（防重复初始化）。子站 `WorkApp.vue` 在路由变化后调用 `notifyVisitorRouteChange`。

## 公开环境变量

构建期只读取仓库根目录 `.env*` 与进程环境（Vite `envDir` 指向仓库根，子站 `work/` 为 Vite root 时同样生效）：

| 变量 | 含义 | 备注 |
| --- | --- | --- |
| `VITE_POP800_JOB_NO` | POP800 工号 | 纯数字公开标识，不是密钥 |
| `VITE_POP800_UKEY` | POP800 ukey | 安全字母数字公开标识，不是密钥 |

两者任一为空或格式不合法时，运行时优雅回退 `none`，**零外链请求**。请把真实值写在未跟踪的 `.env` / `.env.local` 或 CI `vars.VITE_POP800_JOB_NO` / `vars.VITE_POP800_UKEY`，不要提交进仓库。占位写法见根目录 `.env.example`。

本阶段只预置 POP800 容器与 `openChat` 调用位，不硬编码真实账号，也不写入 `800.js` 的 `src`。loopback 即使填了 ID，默认仍不加载第三方脚本，除非带 `?visitor-preview=1`。

本地 loopback（`localhost` / `127.0.0.1` / `::1`）默认不挂载通道。需要本地预览欢迎气泡与回执面板时，在 URL 加上 **`?visitor-preview=1`**。

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

中途开启排除会立即止血：取消欢迎定时器、关闭气泡、调用 `adapter.stop()`。若此前已激活外部通道（如 POP800），提示条会请你刷新一次以彻底断开。

### 常用浏览器 / 新设备 / 无痕

1. 用日常浏览的浏览器打开主站或子站任意页，地址栏补上 `#owner-exclude` 回车。
2. 看到提示条显示「站长排除已开启」即可。同一台电脑的主站与子站会共享根域 Cookie。
3. `localStorage` 按源隔离。若某一侧仍出现欢迎气泡，点提示条里的「同步标记另一站」，在另一源再写一次标记。
4. **新设备、无痕窗口、清站点数据、换浏览器配置文件** 都不会带上旧标记，需要再走一遍 `#owner-exclude`。
5. 排除一旦生效：采集前即终止，**不会**挂载 Adapter、**不会**发外链请求、**不会**弹欢迎气泡。

## 到站单次自动欢迎

触发条件（需全部满足）：

- 非站长
- 未标记 `welcome_shown`
- `document.visibilityState === 'visible'`
- 停留约 3–4 秒（延迟可注入，便于单测）
- 存在可用交互承载层：已配置有效 POP800 Adapter，或本地带 `?visitor-preview=1`

未配置通道且非预览时，**不向生产访客弹空按钮**。

防连弹：

- 根域会话 Cookie `wjj_welcome_shown=1`（生产域带 `Domain=.weijianjun.me`，**不设 Max-Age/Expires**）
- 同源 `sessionStorage` 键 `wjj.welcome_shown=1`

同一次来访内刷新、SPA 切项目、主/子站互跳只弹一次。关标签即重置。

在页约束：`visibilitychange -> hidden` 时取消未触发定时器；返回可见且尚未展示过时再重新计时。

交互：自然可忽略轻气泡（「你好，正在看哪个项目？有想了解的细节可以直接聊聊或留言。」）。「聊聊 / 留言」调用 `adapter.openChat(projectCtx)`；「关闭」或 Esc 关闭，本轮不再弹。

`preview` Adapter 会打开极简本地回执面板，展示当前匿名项目上下文（`site` / `path` / `project`）与「回聊通道待接入」，不发外网请求。

## 匿名项目上下文

仅同步白名单字段：`site`、脱敏 `path`、项目名（`courier` / `analytics` / `lowcode` / `liveshop` / `ai-engineering`）。不采集 PII、输入值或聊天正文。

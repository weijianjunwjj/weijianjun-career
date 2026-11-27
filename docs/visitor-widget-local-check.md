# 阶段 A 本地检查记录

分支：`feat/visitor-core-cn`（由已过审基线 `9e2d7a8` 切出）。`feat/visitor-chat-tawkto` 指针仍停在 `9e2d7a8`。未推送、未合并 `main`。

## 命令结果

`pnpm check && pnpm build:all && pnpm test`：exit 0。

- `vue-tsc --noEmit` 通过
- 主站 `vite build`：331 modules，`dist/index.html` 2.89 kB，JS `dist/assets/index-Dq-TMbKI.js`
- 子站 `vite build --config vite.work.config.mjs`：55 modules，`dist-work/index.html` 1.36 kB，JS `dist-work/assets/index-CIweskd2.js`
- `pnpm test`：**32/32 pass**（含 `tests/content.test.mjs`、`tests/lowcode.test.mjs`、`tests/visitor-widget.test.mjs`）

源码、`.env.example`、`.github/workflows/deploy-pages.yml`、`dist/index.html`、`dist-work/index.html` 及构建 JS **零** `tawk.to` / `embed.tawk.to` / `VITE_TAWK_` / `Tawk_API` 残留。两站 `index.html` 均无 `src="https?://"` 静态外链。

## 浏览器核对（隔离预览 4173 / 4174）

使用 Orca 内置浏览器实际点击，不是单张静态截图。

### 主站未标记直入

1. 清空 Cookie / `localStorage` / `sessionStorage` 后打开 `http://127.0.0.1:4173/?visitor-preview=1`。
2. 约 4 秒后自动出现欢迎气泡（「你好，正在看哪个项目？…」+「聊聊 / 留言」）。
3. 点击「聊聊 / 留言」打开本地回执：`site=main`，`path=/`，`project=（未指定）`，状态「回聊通道待接入」。不发外网请求。
4. 刷新同一 URL，再等 5 秒：**不再弹出**。`wjj_welcome_shown=1` Cookie 与 `sessionStorage.wjj.welcome_shown=1` 已写入。脚本仅有本站 `assets/index-Dq-TMbKI.js`。

### 子站未标记直入 + SPA 切页

1. 在 `127.0.0.1:4174` 源上清空标记后打开 `http://127.0.0.1:4174/projects/lowcode/?visitor-preview=1`。
2. 约 4 秒后自动出现欢迎气泡。
3. 点击「聊聊 / 留言」：`site=work`，`path=/projects/lowcode`，`project=lowcode`，状态「回聊通道待接入」。
4. 点击导航「02 友谊时光」SPA 切到 `/projects/analytics/`，标题变为「02 友谊时光 EBI 与微前端治理 · 工程证据｜魏建军」。再等 5 秒：**不连弹**。脚本仅有本站 `assets/index-CIweskd2.js`。

### 站长排除

1. 清空标记后打开 `http://127.0.0.1:4173/?visitor-preview=1#owner-exclude`。
2. hash 被 `history.replaceState` 清掉，地址变为 `http://127.0.0.1:4173/?visitor-preview=1`（无尾部 `#`）。
3. 出现站长提示条：「站长排除已开启 · 访客回聊通道不会加载，也不会产生访问记录。」含「解除排除」「同步标记另一站」「关闭」。
4. 写入 `wjj_owner_exclude=1` Cookie 与 `localStorage.wjj.owner_exclude=1`。欢迎未标记。
5. 再等 5 秒：**绝不弹欢迎气泡**。Network 仅 127.0.0.1 的 HTML / JS / CSS / 证据图，无任何第三方聊天脚本。
6. 点击「关闭」提示条消失。

## 确认

- 未推送任何远程
- 未合并 `main`
- 未改生产部署目标（workflow 仅把公开变量从海外聊天 ID 换成 `vars.VITE_POP800_JOB_NO` / `vars.VITE_POP800_UKEY` 预留透传）
- 未提交未跟踪的 `assets/`
- 源码与构建产物无 tawk.to 残留

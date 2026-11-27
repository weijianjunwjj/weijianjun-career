# Phase 1 本地检查记录

分支：`feat/visitor-chat-tawkto`（由 `994c022` 创建，未推送、未合并 `main`）。

## 命令结果

`pnpm check`：exit 0（`vue-tsc --noEmit` 通过）。

`pnpm build:all`：exit 0。

- 主站 `vite build`：330 modules，`dist/index.html` 2.89 kB
- 子站 `vite build --config vite.work.config.mjs`：54 modules，`dist-work/index.html` 1.36 kB

`pnpm test`：exit 0，**28/28 pass**（含 `tests/content.test.mjs`、`tests/lowcode.test.mjs`、`tests/visitor-widget.test.mjs`）。

## 浏览器核对（preview）

- `http://127.0.0.1:4173/#owner-exclude`：hash 被清掉，出现站长提示条，写入 `wjj_owner_exclude` Cookie 与 `localStorage`，无 `embed.tawk.to` 脚本。
- 点击「解除排除」后状态变为未开启，Cookie / localStorage 清除；「同步标记另一站」指向 `http://127.0.0.1:4174/#owner-include`。
- `http://127.0.0.1:4174/projects/courier/#owner-status`：保留路径 `/projects/courier/`，标题正确，Esc 关闭提示条；SPA 切到 `/projects/analytics/` 正常。

## 确认

- 未推送任何远程
- 未合并 `main`
- 未改生产配置 / GitHub Actions
- 未提交未跟踪的 `assets/`

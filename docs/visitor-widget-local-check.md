# 阶段 B1 本地检查记录

分支：`feat/visitor-core-cn`。未推送、未合并 `main`。

## 命令结果

`pnpm check && pnpm build:all && pnpm test`：exit 0。

- `vue-tsc --noEmit` 通过
- 主站 `vite build`：331 modules，`dist/index.html` 2.89 kB，JS `dist/assets/index-DftI1N6u.js`
- 子站 `vite build --config vite.work.config.mjs`：55 modules，`dist-work/index.html` 1.36 kB，JS `dist-work/assets/index-Dfk7v0Cl.js`
- `pnpm test`：**38/38 pass**（含两站 + 两份 dist 的微信二维码 SHA-256 一致）

源码、`.env.example`、`.github/workflows/deploy-pages.yml`、两站 `index.html` 及构建 JS **零** `tawk` / `pop800` 残留。两站 `index.html` 均无 `src="https?://"` 静态外链。

## 浏览器核对（隔离预览 4173 / 4174）

使用 Orca 内置浏览器实际点击，不是单张静态截图。本地带 `?visitor-preview=1`，不向真实百度发数据。

### 主站未标记直入

1. 清空 Cookie / `localStorage` / `sessionStorage` 后打开 `http://127.0.0.1:4173/?visitor-preview=1`。
2. 进站即可看到右下角霓虹胶囊「聊聊 / 联系魏建军」；约 2.5 秒后自动出现欢迎气泡（无项目文案 +「一键发邮件 / 加微信」），气泡在胶囊正上方。
3. 点击主按钮打开联系卡：`mailto:` 指向 `2661043132@qq.com`，无 `target`；微信图 `/contact/wechat-qr.webp`（约 440×560）解码成功，jpg 仅作兜底，占位隐藏，未使用 `mini-qr.png`。
4. 关闭卡片后右下角胶囊仍在。loopback 即使构建时注入了百度公开 ID，也**不**加载 `hm.baidu.com`、不初始化 `_hmt`。

### 子站项目页

1. 在 `127.0.0.1:4174` 源上清空标记后打开 `http://127.0.0.1:4174/projects/lowcode/?visitor-preview=1`。
2. 约 2.5 秒后欢迎文案为「正在看「企业级低代码引擎」？…」。
3. 点击直联后 `mailto:` 的 `subject` 为编码后的 `交流《企业级低代码引擎》项目 / 岗位沟通`；微信图同样 888×1131。脚本仅 `assets/index-BYUgCfkf.js`，无 `hm.baidu.com`。
4. `#owner-exclude` 后气泡/卡片/胶囊全部不渲染，hash 被清掉。

### 站长排除与窄屏

1. 主站打开 `#owner-exclude`：提示条「站长排除已开启」，胶囊消失，href 无尾部 `#`。
2. 390×844 视口联系卡宽约 358px、right 16、不溢出。

## 确认

- 未推送任何远程
- 未合并 `main`
- 未提交未跟踪的 `assets/`
- 微信二维码 jpg 保持无损 888×1131；双站 webp 轻量清晰版 SHA-256 一致，体积 < 40 KB
- 百度公开 ID 仅通过临时进程环境变量构建验证，未写入源码或 `.env`
- 源码与构建产物无 tawk / pop800 残留

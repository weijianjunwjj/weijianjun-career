# 阶段 B1 本地检查记录

分支：`feat/visitor-core-cn`。未推送、未合并 `main`。

## 命令结果

`pnpm check && pnpm build:all && pnpm test`：exit 0。

- `vue-tsc --noEmit` 通过
- 主站 `vite build`：331 modules，`dist/index.html` 2.89 kB，JS `dist/assets/index-D4iz1A__.js`
- 子站 `vite build --config vite.work.config.mjs`：55 modules，`dist-work/index.html` 1.36 kB，JS `dist-work/assets/index-Ddo8P5O6.js`
- `pnpm test`：**35/35 pass**

源码、`.env.example`、`.github/workflows/deploy-pages.yml`、两站 `index.html` 及构建 JS **零** `tawk` / `pop800` 残留。两站 `index.html` 均无 `src="https?://"` 静态外链。

## 浏览器核对（隔离预览 4173 / 4174）

使用 Orca 内置浏览器实际点击，不是单张静态截图。本地带 `?visitor-preview=1`，不向真实百度发数据。

### 主站未标记直入

1. 清空 Cookie / `localStorage` / `sessionStorage` 后打开 `http://127.0.0.1:4173/?visitor-preview=1`。
2. 约 4 秒后自动出现欢迎气泡（无项目文案 +「邮箱 / 微信直联」）。
3. 点击主按钮打开联系卡：`mailto:2661043132@qq.com?subject=交流项目 / 岗位沟通`，`target` 为空；微信槽位 `onerror` 后 `img.hidden=true`，展示「微信二维码尚未放入…18352517082」，未使用 `mini-qr.png`。
4. 点击「复制邮箱」按钮变为「已复制」。关闭卡片后左下角出现「联系魏建军」胶囊，可再次打开。
5. 脚本仅 `assets/index-D4iz1A__.js`，Network 无 `hm.baidu.com`。

### 子站项目页

1. 在 `127.0.0.1:4174` 源上清空标记后打开 `http://127.0.0.1:4174/projects/lowcode/?visitor-preview=1`。
2. 约 4 秒后欢迎文案为「正在看「企业级低代码引擎」？…」。
3. 点击直联后 `mailto:` 的 `subject` 为编码后的 `交流《企业级低代码引擎》项目 / 岗位沟通`，无 `target`。脚本仅 `assets/index-Ddo8P5O6.js`。
4. 关闭卡片后胶囊出现；`#owner-exclude` 后气泡/卡片/胶囊全部不渲染，hash 被清掉。

### 站长排除与窄屏

1. 主站打开 `#owner-exclude`：提示条「站长排除已开启」，胶囊消失，href 无尾部 `#`。
2. 390×844 视口联系卡宽 358px、left 16、不溢出。

## 确认

- 未推送任何远程
- 未合并 `main`
- 未提交未跟踪的 `assets/`
- 未伪造微信二维码图片；缺文件时走 `onerror` 占位
- 源码与构建产物无 tawk / pop800 残留

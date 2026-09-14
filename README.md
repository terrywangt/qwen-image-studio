# Qwen Image Studio

自托管 Qwen 免费图文生成站：Next.js Web UI + FreeQwenApi 代理（Qwen Chat 免费额度，无水印）。

## 架构

```
Qwen 账号(token) → FreeQwenApi 代理(3264) → Next.js Web(3000) → 浏览器用户
```

- `proxy/` — [FreeQwenApi](https://github.com/VernaculusF/FreeQwenApi)（MIT），Node + Puppeteer 模拟浏览器登录 chat.qwen.ai，输出 OpenAI 兼容 API；默认走 Qwen Chat 免费额度出图（不加水印）。
- `web/` — Next.js 14 (App Router, standalone)：生成页 + 管理后台，token/API key 只在服务端。
- `.github/workflows/docker-build.yml` — push main 自动构建两镜像推 GHCR (GitHub Container Registry)。

## 本地开发

```bash
# proxy
cd proxy && cp .env.example .env && npm install
node scripts/auth.js          # 浏览器登录 Qwen 账号 → session/tokens.json
npm start                     # 监听 3264

# web
cd web && npm install && npm run dev
```

## Docker 部署

```bash
cp .env.example .env       # 改 PROXY_API_KEY
# 准备代理 API key(每行一个)：
echo 'your-secret-key' > Authorization.txt
docker compose up -d --build
# → http://<host>:3000  (生成页)  /admin (管理页)
```

## GitHub Actions 构建

无需额外凭据：GitHub Actions 自动用 `GITHUB_TOKEN` 登录 GHCR 推送镜像。

push 到 main 自动构建 `ghcr.io/terrywangt/qwen-image-studio-web` 与 `-proxy` 并推送 GHCR。

## 说明

- 图片水印：Qwen Chat 网页版免费生成的图片不带角标水印；本仓库不额外加水印处理。
- 合规：逆向免费额度仅供自用/测试，商用请走阿里云百炼官方 API。
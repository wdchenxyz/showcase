要將 Next.js 靜態頁面部署到 GitHub Pages，您需要進行以下步驟：

## 1. 配置 Next.js 為靜態導出

在 `next.config.js` 或 `next.config.mjs` 中添加配置：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 如果部署在 username.github.io/repo-name，需要設置 basePath
  // basePath: '/your-repo-name',
  // assetPrefix: '/your-repo-name',
}

module.exports = nextConfig
```

**注意**：
- 如果是部署到 `username.github.io`（用戶頁面），不需要 `basePath`
- 如果是部署到 `username.github.io/repo-name`（項目頁面），需要設置 `basePath` 和 `assetPrefix`

## 2. 修改 package.json

添加 build 腳本：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next build"
  }
}
```

## 3. 使用 GitHub Actions 自動部署

在項目根目錄創建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # 或 master，根據您的主分支名稱

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'  # 或您使用的 Node 版本

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Add .nojekyll file
        run: touch ./out/.nojekyll

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v3
```

## 4. 在 GitHub 上設置 Pages

1. 進入您的 GitHub 倉庫
2. 點擊 **Settings** > **Pages**
3. 在 **Source** 下選擇 **GitHub Actions**

## 5. 推送代碼

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

## 6. 處理常見問題

### 如果使用自定義域名
在 `public` 目錄下創建 `CNAME` 文件，內容為您的域名：
```
yourdomain.com
```

### 如果圖片或資源無法加載
確保在代碼中使用相對路徑，或使用 Next.js 的 `basePath`：

```jsx
// 使用 next/image
import Image from 'next/image'

<Image src="/image.png" alt="..." width={500} height={300} />

// 或使用普通 img 標籤時
<img src={`${process.env.basePath || ''}/image.png`} alt="..." />
```

## 7. 本地測試靜態導出

在部署前，可以本地測試：

```bash
npm run build
npx serve out
```

這樣就可以成功將 Next.js 靜態頁面部署到 GitHub Pages 了！部署完成後，您的網站會在 `https://username.github.io/repo-name` 上線。



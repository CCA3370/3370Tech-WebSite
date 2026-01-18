# 个人产品展示网站

一个基于 Next.js 16 + TypeScript + fullpage.js 的个人产品展示网站，支持中英双语切换和三种主题风格。

## 技术栈

- **框架**: Next.js 16.1.3 (App Router + Turbopack)
- **语言**: TypeScript 5
- **UI 库**: React 19.2.3
- **样式**: Tailwind CSS 3.4
- **滚动效果**: @fullpage/react-fullpage
- **国际化**: next-intl 3.26
- **图标**: lucide-react

## 功能特性

### 核心功能
- ✅ 首页全屏滚动展示产品（使用 fullpage.js）
- ✅ 每个产品独立详情页
- ✅ About 页面（个人介绍 + 社交链接）
- ✅ 中英双语支持（URL: `/zh/...` 和 `/en/...`）
- ✅ 三种下载方式：
  - GitHub Release
  - 本站直接下载
  - 阿里云 CDN 下载

### 主题系统
提供三种预设主题供选择：

1. **简约现代 (Minimal)**
   - 纯白背景，黑色主色调
   - 蓝色强调色
   - 大号标题，充足留白

2. **科技感 (Tech)**
   - 深蓝黑背景
   - 渐变紫蓝主色
   - 青色强调色
   - 微弱光晕效果

3. **柔和温暖 (Soft)**
   - 米白背景
   - 暖棕主色
   - 珊瑚色强调色
   - 圆角设计，柔和阴影

## 项目结构

```
mysite/
├── src/
│   ├── app/
│   │   ├── [locale]/           # 国际化路由
│   │   │   ├── layout.tsx      # 布局组件
│   │   │   ├── page.tsx        # 首页（fullpage滚动）
│   │   │   ├── about/          # About页面
│   │   │   └── products/       # 产品详情页
│   │   │       └── [slug]/
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 根页面（重定向）
│   │   └── globals.css         # 全局样式
│   ├── components/
│   │   ├── FullPageWrapper.tsx    # fullpage.js封装
│   │   ├── ProductSection.tsx     # 产品展示section
│   │   ├── Header.tsx             # 顶部导航
│   │   ├── Footer.tsx             # 底部
│   │   ├── DownloadButton.tsx     # 下载按钮
│   │   ├── SocialLinks.tsx        # 社交链接
│   │   ├── LanguageSwitcher.tsx   # 语言切换
│   │   └── ThemeSwitcher.tsx      # 主题切换
│   ├── data/
│   │   └── products.json       # 产品数据
│   ├── lib/
│   │   └── products.ts         # 产品数据工具函数
│   ├── types/
│   │   └── product.ts          # TypeScript类型定义
│   ├── i18n.ts                 # 国际化配置
│   └── middleware.ts           # 中间件（语言路由）
├── messages/
│   ├── en.json                 # 英文翻译
│   └── zh.json                 # 中文翻译
├── public/
│   ├── images/products/        # 产品图片
│   └── downloads/              # 下载文件
└── package.json
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看网站。

### 构建生产版本

```bash
npm run build
npm start
```

## 自定义配置

### 1. 添加产品

编辑 `src/data/products.json`：

```json
{
  "products": [
    {
      "id": "product-1",
      "slug": "my-app",
      "name": {
        "zh": "我的应用",
        "en": "My App"
      },
      "description": {
        "zh": "应用描述",
        "en": "App description"
      },
      "longDescription": {
        "zh": "详细描述...",
        "en": "Detailed description..."
      },
      "image": "/images/products/my-app.png",
      "downloads": [
        {
          "type": "github",
          "label": { "zh": "GitHub Release", "en": "GitHub Release" },
          "url": "https://github.com/user/repo/releases"
        },
        {
          "type": "local",
          "label": { "zh": "本站下载", "en": "Direct Download" },
          "url": "/downloads/my-app-v1.0.zip"
        },
        {
          "type": "cdn",
          "label": { "zh": "CDN下载", "en": "CDN Download" },
          "url": "http://cdn.cloverta.top/d/my-app-v1.0.zip"
        }
      ],
      "version": "1.0.0",
      "tags": ["windows", "mac"],
      "features": [
        { "zh": "功能1", "en": "Feature 1" },
        { "zh": "功能2", "en": "Feature 2" }
      ]
    }
  ]
}
```

### 2. 修改社交链接

编辑 `src/components/SocialLinks.tsx`，更新 `socialLinks` 数组：

```typescript
const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/yourusername',
    icon: <Github className="w-6 h-6" />,
  },
  // 添加更多社交链接...
];
```

### 3. 更新翻译文本

编辑 `messages/zh.json` 和 `messages/en.json` 文件来修改界面文案。

### 4. 添加产品图片

将产品图片放入 `public/images/products/` 目录，然后在 `products.json` 中引用：

```json
"image": "/images/products/your-image.png"
```

### 5. 添加下载文件

将下载文件放入 `public/downloads/` 目录，然后在产品数据中引用：

```json
"url": "/downloads/your-file.zip"
```

## 主题切换

网站右上角提供主题切换器，可以在三种主题间切换：
- 简约现代 (Minimal)
- 科技感 (Tech)
- 柔和温暖 (Soft)

主题配置在 `src/app/globals.css` 中定义，可以根据需要自定义颜色。

## 语言切换

网站支持中英双语：
- 中文：`/zh/...`
- 英文：`/en/...`

点击右上角的语言切换按钮可以切换语言。

## 注意事项

### fullpage.js 许可证

本项目使用 `@fullpage/react-fullpage` 的开源 GPLv3 许可证。如果用于商业项目，请购买商业许可证：
https://alvarotrigo.com/fullPage/pricing/

### CDN 配置

如果使用阿里云 CDN，请确保在 `next.config.js` 中配置了正确的域名：

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'cdn.cloverta.top',
    },
  ],
}
```

## 部署

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 自动部署完成

### 其他平台

```bash
npm run build
```

将 `.next` 目录和 `public` 目录部署到服务器。

## 开发说明

- 使用 Next.js 16 的 App Router
- 启用了 Turbopack 以提升开发体验
- 使用 TypeScript 进行类型检查
- 使用 Tailwind CSS 进行样式开发
- 响应式设计，支持移动端

## License

MIT

---

**提示**: 这是一个模板项目，请根据实际需求修改内容和样式。

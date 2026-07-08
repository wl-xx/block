# 个人博客

一个完全静态的个人博客系统，使用 VitePress、Pages CMS、GitHub Pages、GitHub Actions、Markdown 和 pnpm 构建。

## 特性

- 纯静态站点，无后端服务、数据库或云函数
- GitHub Repository 存储全部内容
- GitHub Pages 托管
- GitHub Actions 自动构建与发布
- Pages CMS 在线新增、编辑、删除 Markdown 文章
- 图片上传到 `docs/public/images`
- 本地搜索、深色模式、代码高亮、Mermaid、数学公式
- 文章阅读时间、分类、标签、归档、自动目录
- RSS、Sitemap、robots.txt、Open Graph、favicon
- Giscus 评论入口

## 技术栈

- VitePress
- Pages CMS
- GitHub Pages
- GitHub Actions
- Markdown
- pnpm

## 目录结构

```text
.
├─ .github/workflows/deploy.yml
├─ .pages.yml
├─ docs
│  ├─ .vitepress
│  │  ├─ config.ts
│  │  └─ theme
│  ├─ posts
│  ├─ public
│  │  ├─ images
│  │  ├─ favicon.svg
│  │  └─ og.svg
│  ├─ index.md
│  ├─ categories.md
│  ├─ tags.md
│  └─ archive.md
├─ package.json
└─ pnpm-lock.yaml
```

## 本地开发

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm dev
```

构建生产版本：

```bash
pnpm build
```

预览生产构建：

```bash
pnpm preview
```

## GitHub Pages

当前仓库地址：

```text
git@github.com:wl-xx/block.git
```

部署地址：

```text
https://wl-xx.github.io/block
```

GitHub Pages 需要在仓库设置中选择：

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

推送到 `main` 或 `master` 后，`.github/workflows/deploy.yml` 会自动构建并发布站点。

## 环境变量

复制 `.env.example` 作为本地环境变量参考。

```env
VITEPRESS_BASE=/block/
VITEPRESS_SITE_URL=https://wl-xx.github.io/block
VITE_GISCUS_REPO=wl-xx/block
VITE_GISCUS_REPO_ID=
VITE_GISCUS_CATEGORY=Announcements
VITE_GISCUS_CATEGORY_ID=
```

GitHub Actions 中，`VITE_GISCUS_*` 建议配置为 Repository Variables。

## Pages CMS

Pages CMS 配置文件：

```text
.pages.yml
```

在线管理入口：

```text
https://app.pagescms.org
```

用 GitHub 登录后选择 `wl-xx/block` 仓库，即可管理文章。

文章存放目录：

```text
docs/posts
```

图片上传目录：

```text
docs/public/images
```

## 文章格式

推荐文章 frontmatter：

```md
---
title: 文章标题
description: 文章摘要，建议 180 字以内
date: 2026-07-08
category: 项目
tags:
  - VitePress
  - GitHub Pages
cover: /images/posts/example.webp
draft: false
---

# 文章标题

正文内容。
```

`draft: true` 的文章不会出现在首页、文章列表、分类、标签、归档、RSS 中。

## Giscus 评论

启用评论需要完成以下设置：

1. 在 GitHub 仓库开启 Discussions。
2. 安装并启用 Giscus App。
3. 在 Giscus 官网生成 `repoId` 和 `categoryId`。
4. 在 GitHub Repository Variables 中配置：

```text
VITE_GISCUS_REPO
VITE_GISCUS_REPO_ID
VITE_GISCUS_CATEGORY
VITE_GISCUS_CATEGORY_ID
```

变量完整后，文章页会自动显示评论区。

## RSS 和 Sitemap

构建后会生成：

```text
docs/.vitepress/dist/feed.xml
docs/.vitepress/dist/sitemap.xml
docs/.vitepress/dist/robots.txt
```

线上地址：

```text
https://wl-xx.github.io/block/feed.xml
https://wl-xx.github.io/block/sitemap.xml
https://wl-xx.github.io/block/robots.txt
```

import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import mathjax3 from 'markdown-it-mathjax3'
import { Feed } from 'feed'
import matter from 'gray-matter'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const base = normalizeBase(process.env.VITEPRESS_BASE)
const siteUrl = normalizeUrl(process.env.VITEPRESS_SITE_URL ?? 'https://wl-xx.github.io/block')
const defaultOgImage = `${siteUrl}/og.svg`

export default withMermaid(
  defineConfig({
    lang: 'zh-CN',
    title: '个人博客',
    description: '一个使用 VitePress、Pages CMS 和 GitHub Pages 构建的纯静态个人博客。',
    base,
    cleanUrls: true,
    appearance: true,
    lastUpdated: true,
    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
      ['link', { rel: 'alternate', type: 'application/rss+xml', title: '个人博客 RSS', href: `${base}feed.xml` }],
      ['meta', { name: 'theme-color', content: '#ffffff' }],
      ['meta', { name: 'color-scheme', content: 'light dark' }]
    ],

    markdown: {
      lineNumbers: true,
      image: {
        lazyLoading: true
      },
      config(md) {
        md.use(mathjax3)
      }
    },

    mermaid: {
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'default'
    },

    themeConfig: {
      nav: [
        { text: '首页', link: '/' },
        { text: '文章', link: '/posts/' },
        { text: '分类', link: '/categories' },
        { text: '标签', link: '/tags' },
        { text: '归档', link: '/archive' },
        { text: '关于', link: '/about' },
        { text: '管理', link: 'https://app.pagescms.org' }
      ],

      sidebar: {
        '/posts/': [
          {
            text: '文章',
            items: [{ text: '文章列表', link: '/posts/' }]
          }
        ]
      },

      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '搜索',
              buttonAriaLabel: '搜索'
            },
            modal: {
              displayDetails: '显示详情',
              resetButtonTitle: '清除查询条件',
              backButtonTitle: '关闭搜索',
              noResultsText: '没有找到相关内容',
              footer: {
                selectText: '选择',
                selectKeyAriaLabel: '回车',
                navigateText: '切换',
                navigateUpKeyAriaLabel: '上箭头',
                navigateDownKeyAriaLabel: '下箭头',
                closeText: '关闭',
                closeKeyAriaLabel: 'ESC'
              }
            }
          }
        }
      },

      outline: {
        level: [2, 3],
        label: '本页目录'
      },

      docFooter: {
        prev: '上一篇',
        next: '下一篇'
      },

      darkModeSwitchLabel: '切换深色模式',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',
      sidebarMenuLabel: '菜单',
      returnToTopLabel: '返回顶部',
      langMenuLabel: '切换语言',
      lastUpdatedText: '最后更新',
      externalLinkIcon: true
    },

    transformHead({ pageData }) {
      const url = getPageUrl(pageData.relativePath)
      const title = pageData.title ? `${pageData.title} | 个人博客` : '个人博客'
      const description =
        pageData.frontmatter.description ??
        '一个使用 VitePress、Pages CMS 和 GitHub Pages 构建的纯静态个人博客。'
      const cover = pageData.frontmatter.cover
      const image = typeof cover === 'string' ? getAssetUrl(cover) : defaultOgImage
      const isArticle = pageData.relativePath.startsWith('posts/') && pageData.relativePath !== 'posts/index.md'
      const tags = Array.isArray(pageData.frontmatter.tags) ? pageData.frontmatter.tags : []

      return [
        ['link', { rel: 'canonical', href: url }],
        ['meta', { property: 'og:type', content: isArticle ? 'article' : 'website' }],
        ['meta', { property: 'og:title', content: title }],
        ['meta', { property: 'og:description', content: description }],
        ['meta', { property: 'og:url', content: url }],
        ['meta', { property: 'og:image', content: image }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:title', content: title }],
        ['meta', { name: 'twitter:description', content: description }],
        ['meta', { name: 'twitter:image', content: image }],
        ...(isArticle && pageData.frontmatter.date
          ? [['meta', { property: 'article:published_time', content: String(pageData.frontmatter.date) }]]
          : []),
        ...(isArticle && pageData.frontmatter.category
          ? [['meta', { property: 'article:section', content: String(pageData.frontmatter.category) }]]
          : []),
        ...tags.map((tag) => ['meta', { property: 'article:tag', content: String(tag) }])
      ]
    },

    async buildEnd(siteConfig) {
      await generateFeed(siteConfig.srcDir, siteConfig.outDir)
      await generateRobots(siteConfig.outDir)
      await generateSitemap(siteConfig.pages, siteConfig.outDir)
    }
  })
)

function normalizeBase(value: string | undefined) {
  if (!value) return '/'
  return `/${value.replace(/^\/|\/$/g, '')}/`
}

function normalizeUrl(value: string) {
  return value.replace(/\/$/g, '')
}

function getPageUrl(relativePath: string) {
  const route = relativePath
    .replace(/\\/g, '/')
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')
  return `${siteUrl}${route ? `/${route.replace(/\/$/, '')}` : ''}`
}

function getAssetUrl(value: string) {
  if (/^https?:\/\//.test(value)) return value
  return `${siteUrl}/${value.replace(/^\//, '')}`
}

async function generateFeed(srcDir: string, outDir: string) {
  const postsDir = join(srcDir, 'posts')
  const files = await listMarkdownFiles(postsDir)
  const feed = new Feed({
    title: '个人博客',
    description: '技术笔记、项目经验、生活思考和长期积累的知识。',
    id: siteUrl,
    link: siteUrl,
    language: 'zh-CN',
    favicon: `${siteUrl}/favicon.svg`,
    copyright: `Copyright ${new Date().getFullYear()}`
  })

  for (const file of files) {
    if (file.endsWith('index.md')) continue
    const raw = await readFile(file, 'utf-8')
    const parsed = matter(raw)
    if (parsed.data.draft) continue

    const slug = relative(postsDir, file).replace(/\\/g, '/').replace(/\.md$/, '')
    const url = `${siteUrl}/posts/${slug}`
    feed.addItem({
      title: parsed.data.title ?? slug,
      id: url,
      link: url,
      description: parsed.data.description ?? '',
      date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
      category: Array.isArray(parsed.data.tags)
        ? parsed.data.tags.map((tag: string) => ({ name: tag }))
        : []
    })
  }

  await writeFile(join(outDir, 'feed.xml'), feed.rss2(), 'utf-8')
}

async function generateRobots(outDir: string) {
  const robots = ['User-agent: *', 'Allow: /', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n')
  await writeFile(join(outDir, 'robots.txt'), robots, 'utf-8')
}

async function generateSitemap(pages: string[], outDir: string) {
  const urls = pages
    .filter((page) => !page.includes('404'))
    .map((page) => `  <url><loc>${escapeXml(getPageUrl(page))}</loc></url>`)
    .join('\n')
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    ''
  ].join('\n')
  await writeFile(join(outDir, 'sitemap.xml'), sitemap, 'utf-8')
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function listMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) return listMarkdownFiles(fullPath)
      return entry.name.endsWith('.md') ? [fullPath] : []
    })
  )
  return files.flat()
}

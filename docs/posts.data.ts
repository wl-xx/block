import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  cover?: string
  url: string
  excerpt?: string
  readingTime: number
}

export default createContentLoader('posts/*.md', {
  includeSrc: true,
  excerpt: true,
  transform(raw): Post[] {
    return raw
      .filter((item) => item.url !== '/posts/' && !item.frontmatter.draft)
      .map((item) => ({
        title: item.frontmatter.title ?? '未命名文章',
        description: item.frontmatter.description ?? '',
        date: normalizeDate(item.frontmatter.date),
        category: item.frontmatter.category ?? '随笔',
        tags: Array.isArray(item.frontmatter.tags) ? item.frontmatter.tags : [],
        cover: item.frontmatter.cover,
        url: item.url,
        excerpt: item.excerpt,
        readingTime: getReadingTime(item.src ?? '')
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  }
})

function normalizeDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string' && value) return value.slice(0, 10)
  return '1970-01-01'
}

function getReadingTime(source: string) {
  const text = source
    .replace(/```[\s\S]*?```/g, '')
    .replace(/---[\s\S]*?---/, '')
    .replace(/<[^>]+>/g, '')

  const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length ?? 0
  const words = text.match(/[A-Za-z0-9]+/g)?.length ?? 0
  return Math.max(1, Math.ceil((chineseChars + words * 1.5) / 400))
}

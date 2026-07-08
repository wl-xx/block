<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../../../posts.data'

const latestPosts = computed(() => posts.slice(0, 6))

const categories = computed(() => {
  const counts = new Map<string, number>()
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1)
  }
  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => {
    return b.count - a.count || a.name.localeCompare(b.name)
  })
})

const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(counts, ([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 16)
})

const readingMinutes = computed(() => {
  return posts.reduce((total, post) => total + post.readingTime, 0)
})

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(`${value}T00:00:00`))
}
</script>

<template>
  <div class="blog-home">
    <section class="intro">
      <p class="eyebrow">Personal Blog</p>
      <h1>记录技术、项目与长期思考</h1>
      <p class="summary">
        这里会沉淀工程实践、阅读笔记、产品观察和一些持续生长的想法。
      </p>
      <div class="actions">
        <a class="primary" :href="withBase('/posts/')">浏览文章</a>
        <a :href="withBase('/archive')">查看归档</a>
      </div>
      <dl class="stats">
        <div>
          <dt>{{ posts.length }}</dt>
          <dd>文章</dd>
        </div>
        <div>
          <dt>{{ categories.length }}</dt>
          <dd>分类</dd>
        </div>
        <div>
          <dt>{{ readingMinutes }}</dt>
          <dd>分钟阅读</dd>
        </div>
      </dl>
    </section>

    <section class="section">
      <div class="section-heading">
        <h2>最近文章</h2>
        <a :href="withBase('/posts/')">全部文章</a>
      </div>

      <div v-if="latestPosts.length" class="post-grid">
        <article v-for="post in latestPosts" :key="post.url" class="post-card">
          <a class="post-link" :href="withBase(post.url)">
            <span class="meta">{{ formatDate(post.date) }} · {{ post.readingTime }} 分钟</span>
            <h3>{{ post.title }}</h3>
            <p>{{ post.description }}</p>
            <div class="post-footer">
              <span>{{ post.category }}</span>
              <span v-if="post.tags.length">{{ post.tags.slice(0, 2).join(' / ') }}</span>
            </div>
          </a>
        </article>
      </div>

      <div v-else class="empty">
        <h3>还没有发布文章</h3>
        <p>通过 Pages CMS 新建第一篇 Markdown 文章后，它会自动出现在这里。</p>
      </div>
    </section>

    <section v-if="categories.length || tags.length" class="taxonomy">
      <div class="taxonomy-group">
        <div class="section-heading compact">
          <h2>分类</h2>
          <a :href="withBase('/categories')">查看分类</a>
        </div>
        <div class="pill-list">
          <a v-for="item in categories" :key="item.name" :href="withBase('/categories')">
            {{ item.name }}
            <span>{{ item.count }}</span>
          </a>
        </div>
      </div>

      <div class="taxonomy-group">
        <div class="section-heading compact">
          <h2>标签</h2>
          <a :href="withBase('/tags')">查看标签</a>
        </div>
        <div class="pill-list">
          <a v-for="item in tags" :key="item.name" :href="withBase('/tags')">
            {{ item.name }}
            <span>{{ item.count }}</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog-home {
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding: 64px 0 88px;
}

.intro {
  padding: 48px 0 40px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 700;
}

h1 {
  max-width: 760px;
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 56px;
  line-height: 1.08;
  font-weight: 760;
  letter-spacing: 0;
}

.summary {
  max-width: 640px;
  margin: 22px 0 0;
  color: var(--vp-c-text-2);
  font-size: 19px;
  line-height: 1.8;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.actions a {
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.2s, background-color 0.2s, color 0.2s;
}

.actions a:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.actions .primary {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #ffffff;
}

.actions .primary:hover {
  background: var(--vp-c-brand-2);
  color: #ffffff;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 160px));
  gap: 16px;
  margin: 40px 0 0;
}

.stats div {
  padding-top: 18px;
  border-top: 1px solid var(--vp-c-divider);
}

.stats dt {
  color: var(--vp-c-text-1);
  font-size: 30px;
  font-weight: 760;
  line-height: 1;
}

.stats dd {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.section,
.taxonomy {
  margin-top: 48px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
}

.section-heading h2 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 24px;
  line-height: 1.3;
  letter-spacing: 0;
}

.section-heading a {
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.post-card {
  min-height: 210px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  transition: border-color 0.2s, background-color 0.2s;
}

.post-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.post-link {
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 22px;
  color: inherit;
  text-decoration: none;
}

.meta {
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.post-card h3 {
  margin: 12px 0 0;
  color: var(--vp-c-text-1);
  font-size: 21px;
  line-height: 1.35;
  letter-spacing: 0;
}

.post-card p {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.7;
}

.post-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 22px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.empty {
  padding: 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.empty h3 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 20px;
}

.empty p {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
}

.taxonomy {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
}

.compact {
  margin-bottom: 16px;
}

.pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pill-list a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  text-decoration: none;
}

.pill-list a:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.pill-list span {
  color: var(--vp-c-text-3);
  font-size: 12px;
}

@media (max-width: 768px) {
  .blog-home {
    width: min(100% - 32px, 1120px);
    padding: 28px 0 56px;
  }

  .intro {
    padding: 32px 0;
  }

  h1 {
    font-size: 38px;
  }

  .summary {
    font-size: 17px;
  }

  .stats,
  .post-grid,
  .taxonomy {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>

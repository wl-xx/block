<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as posts } from '../../../posts.data'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(`${value}T00:00:00`))
}
</script>

<template>
  <main class="listing">
    <header>
      <p>Articles</p>
      <h1>全部文章</h1>
    </header>

    <div class="post-list">
      <article v-for="post in posts" :key="post.url">
        <a :href="withBase(post.url)">
          <span>{{ formatDate(post.date) }} · {{ post.readingTime }} 分钟</span>
          <h2>{{ post.title }}</h2>
          <p>{{ post.description }}</p>
          <div>{{ post.category }} · {{ post.tags.join(' / ') }}</div>
        </a>
      </article>
    </div>
  </main>
</template>

<style scoped>
.listing {
  width: min(900px, calc(100% - 48px));
  margin: 0 auto;
  padding: 56px 0 88px;
}

header {
  padding-bottom: 28px;
  border-bottom: 1px solid var(--vp-c-divider);
}

header p {
  margin: 0 0 10px;
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

h1 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 44px;
  letter-spacing: 0;
}

.post-list {
  display: grid;
  gap: 14px;
  margin-top: 28px;
}

article a {
  display: block;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: inherit;
  text-decoration: none;
}

article a:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

span,
article div {
  color: var(--vp-c-text-3);
  font-size: 13px;
}

h2 {
  margin: 10px 0 0;
  color: var(--vp-c-text-1);
  font-size: 22px;
  letter-spacing: 0;
}

article p {
  margin: 10px 0 14px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}
</style>

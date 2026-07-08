<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../../../posts.data'

const years = computed(() => {
  const map = new Map<string, typeof posts>()
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    const list = map.get(year) ?? []
    list.push(post)
    map.set(year, list)
  }
  return Array.from(map, ([year, items]) => ({ year, items })).sort((a, b) => {
    return b.year.localeCompare(a.year)
  })
})
</script>

<template>
  <main class="archive-page">
    <header>
      <p>Archive</p>
      <h1>归档</h1>
    </header>
    <section v-for="group in years" :key="group.year">
      <h2>{{ group.year }}</h2>
      <ul>
        <li v-for="post in group.items" :key="post.url">
          <span>{{ post.date.slice(5) }}</span>
          <a :href="withBase(post.url)">{{ post.title }}</a>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.archive-page {
  width: min(820px, calc(100% - 48px));
  margin: 0 auto;
  padding: 56px 0 88px;
}

header {
  margin-bottom: 32px;
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

section {
  padding: 24px 0;
  border-top: 1px solid var(--vp-c-divider);
}

h2 {
  margin: 0 0 16px;
  color: var(--vp-c-text-1);
  font-size: 26px;
  letter-spacing: 0;
}

ul {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 18px;
  align-items: baseline;
}

li span {
  color: var(--vp-c-text-3);
  font-size: 14px;
}

a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

a:hover {
  color: var(--vp-c-brand-1);
}
</style>

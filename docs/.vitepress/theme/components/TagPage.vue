<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../../../posts.data'

const groups = computed(() => {
  const map = new Map<string, typeof posts>()
  for (const post of posts) {
    for (const tag of post.tags) {
      const list = map.get(tag) ?? []
      list.push(post)
      map.set(tag, list)
    }
  }
  return Array.from(map, ([name, items]) => ({ name, items })).sort((a, b) => {
    return b.items.length - a.items.length || a.name.localeCompare(b.name)
  })
})
</script>

<template>
  <main class="tag-page">
    <header>
      <p>Tags</p>
      <h1>标签</h1>
    </header>

    <section v-for="group in groups" :key="group.name">
      <h2>#{{ group.name }} <span>{{ group.items.length }}</span></h2>
      <ul>
        <li v-for="post in group.items" :key="post.url">
          <a :href="withBase(post.url)">{{ post.title }}</a>
          <span>{{ post.date }}</span>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.tag-page {
  width: min(900px, calc(100% - 48px));
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
  margin: 0 0 14px;
  color: var(--vp-c-text-1);
  font-size: 24px;
  letter-spacing: 0;
}

h2 span {
  color: var(--vp-c-text-3);
  font-size: 15px;
  font-weight: 500;
}

ul {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

a:hover {
  color: var(--vp-c-brand-1);
}

li span {
  flex: none;
  color: var(--vp-c-text-3);
  font-size: 14px;
}
</style>

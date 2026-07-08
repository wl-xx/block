<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { data as posts } from '../../../posts.data'
import GiscusComments from './GiscusComments.vue'

const route = useRoute()

const currentIndex = computed(() => {
  const path = route.path.replace(/\.html$/, '')
  return posts.findIndex((item) => item.url === path)
})

const current = computed(() => posts[currentIndex.value])
const newer = computed(() => posts[currentIndex.value - 1])
const older = computed(() => posts[currentIndex.value + 1])
const isPost = computed(() => currentIndex.value >= 0)
</script>

<template>
  <div v-if="isPost && current" class="article-footer">
    <div v-if="current.tags.length" class="tags">
      <a v-for="tag in current.tags" :key="tag" :href="withBase('/tags')">#{{ tag }}</a>
    </div>

    <nav v-if="newer || older" class="post-nav" aria-label="文章导航">
      <a v-if="older" :href="withBase(older.url)">
        <span>上一篇</span>
        {{ older.title }}
      </a>
      <a v-if="newer" :href="withBase(newer.url)">
        <span>下一篇</span>
        {{ newer.title }}
      </a>
    </nav>

    <GiscusComments />
  </div>
</template>

<style scoped>
.article-footer {
  margin-top: 44px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 8px;
}

.tags a {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  text-decoration: none;
}

.tags a:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.post-nav {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 32px;
}

.post-nav a {
  min-height: 92px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.post-nav a:hover {
  border-color: var(--vp-c-brand-1);
}

.post-nav span {
  display: block;
  margin-bottom: 8px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

@media (max-width: 640px) {
  .post-nav {
    grid-template-columns: 1fr;
  }
}
</style>

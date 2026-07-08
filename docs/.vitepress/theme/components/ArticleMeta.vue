<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as posts } from '../../../posts.data'

const route = useRoute()

const post = computed(() => {
  const path = route.path.replace(/\.html$/, '')
  return posts.find((item) => item.url === path)
})

const isPost = computed(() => Boolean(post.value))

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(`${value}T00:00:00`))
}
</script>

<template>
  <div v-if="isPost && post" class="article-meta">
    <div class="meta-line">
      <span>{{ formatDate(post.date) }}</span>
      <span>{{ post.readingTime }} 分钟阅读</span>
      <span>{{ post.category }}</span>
    </div>
    <p v-if="post.description" class="description">{{ post.description }}</p>
  </div>
</template>

<style scoped>
.article-meta {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.meta-line {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

.meta-line span:not(:last-child)::after {
  content: "/";
  margin-left: 10px;
  color: var(--vp-c-divider);
}

.description {
  max-width: 680px;
  margin: 14px 0 0;
  color: var(--vp-c-text-2);
  font-size: 16px;
  line-height: 1.8;
}
</style>

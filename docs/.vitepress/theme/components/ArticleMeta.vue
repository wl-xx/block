<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../../../posts.data'
import PostBreadcrumb from './PostBreadcrumb.vue'
import { getPostUrl } from '../utils/postRoutes'

const { page } = useData()

const post = computed(() => {
  return posts.find((item) => item.url === getPostUrl(page.value.relativePath))
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
    <PostBreadcrumb :folders="post.folders" link-folders current-folder-link />
    <div class="meta-line">
      <span>{{ formatDate(post.date) }}</span>
      <span>{{ post.readingTime }} 分钟阅读</span>
      <span>{{ post.category }}</span>
    </div>
  </div>
</template>

<style scoped>
.article-meta {
  margin-bottom: 26px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.meta-line {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.meta-line span:not(:last-child)::after {
  content: "/";
  margin-left: 8px;
  color: var(--vp-c-divider);
}

</style>

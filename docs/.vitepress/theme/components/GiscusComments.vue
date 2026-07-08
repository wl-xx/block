<script setup lang="ts">
import { computed } from 'vue'
import Giscus from '@giscus/vue'

const repo = import.meta.env.VITE_GISCUS_REPO
const repoId = import.meta.env.VITE_GISCUS_REPO_ID
const category = import.meta.env.VITE_GISCUS_CATEGORY
const categoryId = import.meta.env.VITE_GISCUS_CATEGORY_ID

const enabled = computed(() => {
  return Boolean(repo && repoId && category && categoryId)
})
</script>

<template>
  <section v-if="enabled" class="comments">
    <h2>评论</h2>
    <Giscus
      :repo="repo"
      :repo-id="repoId"
      :category="category"
      :category-id="categoryId"
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="bottom"
      theme="preferred_color_scheme"
      lang="zh-CN"
      crossorigin="anonymous"
    />
  </section>
</template>

<style scoped>
.comments {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--vp-c-divider);
}

.comments h2 {
  margin: 0 0 18px;
  color: var(--vp-c-text-1);
  font-size: 22px;
  letter-spacing: 0;
}
</style>

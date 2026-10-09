<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted } from 'vue'
import { data as posts } from '../../../posts.data'
import PostDirectoryTree from './PostDirectoryTree.vue'
import { buildPostFolderTree, countPostFolders } from '../utils/postFolders'

const folderTree = computed(() => buildPostFolderTree(posts))

const folderCount = computed(() => countPostFolders(folderTree.value))

const readingMinutes = computed(() => {
  return posts.reduce((total, post) => total + post.readingTime, 0)
})

function openFolderFromHash() {
  const hash = window.location.hash.slice(1)
  if (!hash.startsWith('post-folder-')) return

  const target = document.getElementById(hash)
  if (!target) return

  let element: HTMLElement | null = target
  while (element) {
    if (element instanceof HTMLDetailsElement) element.open = true
    element = element.parentElement
  }

  target.scrollIntoView({ block: 'start' })
}

function handleHashChange() {
  void nextTick(openFolderFromHash)
}

onMounted(() => {
  handleHashChange()
  window.addEventListener('hashchange', handleHashChange)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
})

</script>

<template>
  <section class="listing">
    <header class="listing-header">
      <h1 class="listing-title">全部文章</h1>
      <dl class="listing-stats">
        <div class="listing-stat">
          <dt>{{ posts.length }}</dt>
          <dd>文章</dd>
        </div>
        <div class="listing-stat">
          <dt>{{ folderCount }}</dt>
          <dd>文件夹</dd>
        </div>
        <div class="listing-stat">
          <dt>{{ readingMinutes }}</dt>
          <dd>分钟阅读</dd>
        </div>
      </dl>
    </header>

    <PostDirectoryTree v-if="posts.length" :nodes="folderTree" />
    <p v-else class="listing-empty">还没有发布文章。</p>
  </section>
</template>

<style scoped>
.listing {
  width: 100%;
  padding: 0;
}

.listing-header {
  padding-bottom: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.listing-title {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 32px;
  font-weight: 720;
  letter-spacing: 0;
}

.listing-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 120px));
  gap: 24px;
  margin: 24px 0 0;
}

.listing-stat {
  padding-left: 12px;
  border-left: 2px solid var(--vp-c-brand-3);
}

.listing-stat dt {
  color: var(--vp-c-text-1);
  font-size: 24px;
  font-weight: 760;
  line-height: 1;
}

.listing-stat dd {
  margin: 8px 0 0;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

.listing-empty {
  margin: 28px 0 0;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .listing-stats {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
import { withBase } from 'vitepress'

const props = defineProps<{
  folders: string[]
  linkFolders?: boolean
  currentFolderLink?: boolean
}>()

function getFolderUrl(folders: string[]) {
  if (!folders.length) return withBase('/posts/')
  return withBase(`/posts/#post-folder-${encodeURIComponent(folders.join('/'))}`)
}
</script>

<template>
  <nav v-if="props.folders.length || props.linkFolders" class="post-breadcrumb" aria-label="文章所在目录">
    <ol class="post-breadcrumb-list">
      <li class="post-breadcrumb-item">
        <a v-if="props.linkFolders" class="post-breadcrumb-link" :href="getFolderUrl([])">文章</a>
        <span v-else>文章</span>
      </li>
      <li v-for="(folder, index) in props.folders" :key="`${index}-${folder}`" class="post-breadcrumb-item">
        <a
          v-if="props.linkFolders && (props.currentFolderLink || index < props.folders.length - 1)"
          class="post-breadcrumb-link"
          :href="getFolderUrl(props.folders.slice(0, index + 1))"
        >
          {{ folder }}
        </a>
        <span v-else :aria-current="props.linkFolders ? 'page' : undefined">{{ folder }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.post-breadcrumb {
  min-width: 0;
}

.post-breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 1.5;
  list-style: none;
}

.post-breadcrumb-item {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.post-breadcrumb-item:not(:last-child)::after {
  margin-left: 6px;
  color: var(--vp-c-divider);
  content: "/";
}

.post-breadcrumb-link {
  padding: 0;
  color: inherit;
  font: inherit;
  text-decoration: none;
}

.post-breadcrumb-link:hover {
  color: var(--vp-c-brand-1);
}

.post-breadcrumb-link:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
</style>

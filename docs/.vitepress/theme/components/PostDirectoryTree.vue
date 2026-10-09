<script setup lang="ts">
import { withBase } from 'vitepress'
import type { PostFolderNode } from '../utils/postFolders'

const props = defineProps<{
  nodes: PostFolderNode[]
}>()

function getFolderId(path: string[]) {
  return `post-folder-${encodeURIComponent(path.join('/'))}`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(`${value}T00:00:00`))
}
</script>

<template>
  <ul class="post-directory-tree">
    <li v-for="node in props.nodes" :key="node.path.join('/')" class="post-directory-node">
      <details :id="getFolderId(node.path)" class="post-directory-folder">
        <summary class="post-directory-summary">
          <svg class="post-directory-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h4.2c.6 0 1.16.24 1.58.66l.84.84H18a2.25 2.25 0 0 1 2.25 2.25v8.25A2.25 2.25 0 0 1 18 18.75H6a2.25 2.25 0 0 1-2.25-2.25V6.75Z" />
          </svg>
          <span class="post-directory-name">{{ node.name }}</span>
          <span class="post-directory-count">{{ node.postCount }}</span>
        </summary>

        <div class="post-directory-children">
          <PostDirectoryTree v-if="node.children.length" :nodes="node.children" />
          <ul v-if="node.posts.length" class="post-directory-articles">
            <li v-for="post in node.posts" :key="post.url" class="post-directory-article">
              <a class="post-directory-link" :href="withBase(post.url)">
                <span class="post-directory-title">{{ post.title }}</span>
                <span class="post-directory-date">{{ formatDate(post.date) }}</span>
              </a>
            </li>
          </ul>
        </div>
      </details>
    </li>
  </ul>
</template>

<style scoped>
.post-directory-tree,
.post-directory-articles {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.post-directory-folder {
  border-radius: 6px;
  background: transparent;
}

.post-directory-folder[open] {
  background: transparent;
}

.post-directory-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 10px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  list-style: none;
}

.post-directory-summary::-webkit-details-marker {
  display: none;
}

.post-directory-summary::before {
  width: 8px;
  height: 8px;
  border-right: 1.5px solid var(--vp-c-text-3);
  border-bottom: 1.5px solid var(--vp-c-text-3);
  content: '';
  transform: rotate(-45deg);
  transition: transform 0.2s;
}

.post-directory-folder[open] > .post-directory-summary::before {
  transform: rotate(45deg);
}

.post-directory-summary:hover {
  background: var(--vp-c-bg-soft);
}

.post-directory-icon {
  width: 20px;
  height: 20px;
  flex: none;
  fill: var(--vp-c-brand-soft);
  stroke: var(--vp-c-brand-1);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.post-directory-name {
  font-weight: 650;
}

.post-directory-count {
  margin-left: auto;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.post-directory-children {
  display: grid;
  gap: 8px;
  margin: 0 10px 12px 24px;
  padding-left: 14px;
}

.post-directory-articles {
  gap: 4px;
}

.post-directory-link {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 10px;
  border-radius: 5px;
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.post-directory-link:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
}

.post-directory-date {
  flex: none;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

@media (max-width: 640px) {
  .post-directory-link {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }
}
</style>

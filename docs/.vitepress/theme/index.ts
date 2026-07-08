import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import ArchivePage from './components/ArchivePage.vue'
import ArticleFooter from './components/ArticleFooter.vue'
import ArticleMeta from './components/ArticleMeta.vue'
import CategoryPage from './components/CategoryPage.vue'
import HomePage from './components/HomePage.vue'
import PostsPage from './components/PostsPage.vue'
import TagPage from './components/TagPage.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(ArticleMeta),
      'doc-after': () => h(ArticleFooter)
    })
  },
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('PostsPage', PostsPage)
    app.component('CategoryPage', CategoryPage)
    app.component('TagPage', TagPage)
    app.component('ArchivePage', ArchivePage)
  }
} satisfies Theme

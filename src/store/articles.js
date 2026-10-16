import { defineStore } from 'pinia'

import { loadJSON, saveJSON } from './storage.js'

// ---------- 文章 Store（实验四新增） ----------
// 文章列表页（公开）、文章详情页（公开）与后台「文章管理」（需登录）共用同一份数据，
// 展示文章的增删改查与跨页面状态共享：
//   state   —— articles 数组，初始化时从 localStorage 恢复（刷新不丢失）
//   getters —— total（总数）、sortedArticles（按日期倒序）、getById（按 id 查找）、
//             categories（去重后的分类列表，供筛选按钮使用）
//   actions —— addArticle / updateArticle / removeArticle，修改后统一 persist

const STORAGE_KEY = 'cqie-articles'

const DEFAULT_ARTICLES = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 学习笔记',
    category: '学习笔记',
    date: '2026.09.20',
    summary: '从选项式到组合式：setup、ref、reactive 与生命周期钩子的对照理解。',
    content: '组合式 API 把同一功能的数据、逻辑组织在一起，替代了选项式 API 中按 data / methods / computed 拆分的方式。\n\nref 用于包装基础类型的响应式数据，访问时需要 .value；reactive 用于对象，不需要 .value。\n\n在 <script setup> 中声明的变量可以直接在模板中使用，编译器会自动处理。'
  },
  {
    id: 2,
    title: '实验三总结：Vue Router 嵌套路由与插槽',
    category: '项目总结',
    date: '2026.10.05',
    summary: '用嵌套路由组织项目列表与详情页，用作用域插槽复用项目卡片组件。',
    content: '嵌套路由让父路由只提供页面骨架，子路由渲染在 <RouterView> 出口中。\n\n作用域插槽把组件内部的数据（每条项目）暴露给父组件，父组件决定如何渲染，实现了「数据在子组件、样式在父组件」的分工。\n\n路由守卫 beforeEach 统一处理页面标题与登录校验。'
  },
  {
    id: 3,
    title: 'Pinia 状态管理入门',
    category: '技术分享',
    date: '2026.10.12',
    summary: '为什么需要 Pinia？state、getters、actions 分别扮演什么角色？',
    content: '跨组件、跨页面共享的数据如果散落在多个文件里，修改时容易出现不同步。Pinia 把共享状态集中到 Store 中统一管理。\n\nstate 是数据源，getters 是从 state 派生的计算属性，actions 是修改 state 的业务方法。\n\n组件中用 storeToRefs 解构 Store 数据，既能保持响应式，又能避免解构丢失响应的问题。'
  }
]

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: loadJSON(STORAGE_KEY, DEFAULT_ARTICLES)
  }),

  getters: {
    // 文章总数
    total: (state) => state.articles.length,
    // 返回新数组（不修改 state 原数组），保证不会意外改变 state 的顺序
    sortedArticles: (state) => [...state.articles].sort((a, b) => (a.date < b.date ? 1 : -1)),
    getById: (state) => (id) => state.articles.find((article) => article.id === Number(id)),
    // 去重后的文章分类：Set 去重后转回数组，列表页筛选按钮使用
    categories: (state) => [...new Set(state.articles.map((article) => article.category))]
  },

  actions: {
    // 新增：id 取当前最大 id + 1
    addArticle(data) {
      const maxId = this.articles.reduce((max, article) => Math.max(max, article.id), 0)
      this.articles.push({ id: maxId + 1, ...data })
      this.persist()
    },
    // 更新：按 id 找到后合并新数据（保留未修改的字段）
    updateArticle(id, data) {
      const index = this.articles.findIndex((article) => article.id === Number(id))
      if (index !== -1) {
        this.articles[index] = { ...this.articles[index], ...data }
        this.persist()
      }
    },
    // 删除：过滤掉目标文章
    removeArticle(id) {
      this.articles = this.articles.filter((article) => article.id !== Number(id))
      this.persist()
    },

    // 统一持久化：把最新文章列表写入 localStorage
    persist() {
      saveJSON(STORAGE_KEY, this.articles)
    }
  }
})

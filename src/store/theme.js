import { defineStore } from 'pinia'

import { loadJSON, saveJSON } from './storage.js'

// ---------- 主题 Store ----------
// 全局亮 / 暗主题状态，从 App.vue 的局部 ref + v-model 传递升级为 Pinia Store：
//   state   —— isDark，初始化时从 localStorage 恢复（刷新页面后主题选择保留）
//   actions —— toggleTheme：唯一允许修改 state 的入口，
//              修改后同时完成两件组件之外的事：
//              1. applyTheme() 切换 DOM class —— html.dark 激活 Element Plus 暗色变量
//                 （main.js 引入的 theme-chalk/dark/css-vars.css），body.dark 切换
//                 本项目自定义 CSS 变量（--bg-color 等）；
//              2. saveJSON 写回 localStorage 持久化。
// 副作用（DOM 操作）收进 Store 后，任何组件都能切换主题，无需再把 isDark
// 一层层用 props / v-model 传递。

const STORAGE_KEY = 'cqie-theme'

export const useThemeStore = defineStore('theme', {
  // 初始化时优先读取 localStorage，首次访问（没有缓存）默认亮色
  state: () => ({
    isDark: loadJSON(STORAGE_KEY, false)
  }),

  actions: {
    // 切换亮 / 暗主题：翻转状态 → 应用 DOM class → 持久化
    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
      saveJSON(STORAGE_KEY, this.isDark)
    },

    // 把当前主题应用到 DOM：html / body 都在组件模板之外，
    // 模板指令管不到，所以用原生 classList 修改。
    // 应用启动时（App.vue）也会调用一次，恢复上次保存的主题
    applyTheme() {
      document.documentElement.classList.toggle('dark', this.isDark)
      document.body.classList.toggle('dark', this.isDark)
    }
  }
})

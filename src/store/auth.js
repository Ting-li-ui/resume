import { defineStore } from 'pinia'

// ---------- 身份认证 Store ----------
// 登录页、后台管理页、导航栏和路由守卫共用同一份登录状态。
// 从实验三的「reactive 模块」升级为 Pinia Store：
//   state   —— username，初始化时从 localStorage 恢复（刷新后登录状态保留）
//   getters —— isLoggedIn，由 username 派生，组件里只读
//   actions —— login / logout，唯一允许修改 state 并同步 localStorage 的入口
// 命名约定：defineStore 的第一个参数是全局唯一的 id（DevTools 里显示的名字），
// 返回的函数按 useXxxStore 命名。

const STORAGE_KEY = 'cqie-auth-username'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    username: localStorage.getItem(STORAGE_KEY) || ''
  }),

  getters: {
    // getter 依赖 state，结果会被缓存；username 变化时自动重算
    isLoggedIn: (state) => state.username !== ''
  },

  actions: {
    login(name) {
      this.username = name
      localStorage.setItem(STORAGE_KEY, name)
    },

    logout() {
      this.username = ''
      localStorage.removeItem(STORAGE_KEY)
    }
  }
})

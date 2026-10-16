import { defineStore } from 'pinia'

import { loadJSON, saveJSON } from './storage.js'

// ---------- 个人简介 Store ----------
// 首页（ProfileCard）、页脚（PageFooter）与后台「个人简介管理」共用这份数据，
// 从实验三的 data/user.js（ref 模块）升级为 Pinia Store。
// state 用嵌套对象 user 组织：这样 storeToRefs 解构出唯一的 user 引用，
// 方便整对象传给 ProfileCard / PageFooter 的 user prop。
// 保存后写入 localStorage：刷新页面后修改的资料依然保留。

const STORAGE_KEY = 'cqie-user'

const DEFAULT_USER = {
  avatar: '/avatar.svg',
  name: '李婷',
  studentId: '249980417',
  major: '24计科1班',
  intro: '热爱前端开发，正在学习Vue 3，喜欢动手做小项目。',
  hobby: '跑步、听音乐',
  motto: '学而不思则罔，思而不学则殆。',
  detailIntro: '来自重庆，性格开朗，希望通过不断地学习与练习，成为一名优秀的前端开发工程师。'
}

export const useUserStore = defineStore('user', {
  // 初始化时优先读取 localStorage，首次访问（没有缓存）才使用默认数据
  state: () => ({
    user: loadJSON(STORAGE_KEY, DEFAULT_USER)
  }),

  getters: {
    // 派生的身份信息：后台首页快捷操作里展示用
    fullIdentity: (state) => `${state.user.name}（${state.user.major}）`
  },

  actions: {
    // 整体替换个人资料（首页编辑卡片 / 后台简介管理共用），并同步持久化
    updateUser(data) {
      this.user = data
      saveJSON(STORAGE_KEY, this.user)
    }
  }
})

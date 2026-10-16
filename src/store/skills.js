import { defineStore } from 'pinia'

import { loadJSON, saveJSON } from './storage.js'

// ---------- 技能 Store ----------
// 首页 SkillCard 展示与后台「技能管理」的增删改查共用同一份数据，
// 从实验三的 data/skills.js（ref 模块）升级为 Pinia Store。
// 后台保存后首页实时同步，且修改结果写入 localStorage，刷新页面不丢失。

const STORAGE_KEY = 'cqie-skills'

const DEFAULT_SKILLS = [
  { id: 1, name: 'HTML', type: '前端', level: '熟练' },
  { id: 2, name: 'CSS', type: '前端', level: '熟练' },
  { id: 3, name: 'JavaScript', type: '前端', level: '掌握' },
  { id: 4, name: 'Vue 3', type: '前端', level: '学习中' },
  { id: 5, name: 'Java', type: '后端', level: '了解' }
]

export const useSkillStore = defineStore('skill', {
  state: () => ({
    skills: loadJSON(STORAGE_KEY, DEFAULT_SKILLS)
  }),

  getters: {
    // 技能总数：后台首页统计卡片使用
    total: (state) => state.skills.length
  },

  actions: {
    // ---------- 增删改 ----------
    // 新增：id 取当前最大值 + 1，保证唯一
    addSkill(data) {
      const maxId = Math.max(...this.skills.map(skill => skill.id), 0)
      this.skills.push({ id: maxId + 1, ...data })
      this.persist()
    },

    // 修改：按 id 找到对应技能，合并替换为新数据
    updateSkill(id, data) {
      const index = this.skills.findIndex(skill => skill.id === id)
      if (index !== -1) {
        this.skills[index] = { id, ...data }
        this.persist()
      }
    },

    // 删除：过滤掉指定 id 的技能
    removeSkill(id) {
      this.skills = this.skills.filter(skill => skill.id !== id)
      this.persist()
    },

    // 统一持久化：把最新技能列表写入 localStorage
    persist() {
      saveJSON(STORAGE_KEY, this.skills)
    }
  }
})

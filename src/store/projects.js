import { defineStore } from 'pinia'

import { loadJSON, saveJSON } from './storage.js'

// ---------- 项目作品 Store ----------
// 首页项目卡片、项目列表页、项目详情页与后台「项目管理」共用同一份数据，
// 从实验三的 data/projects.js（ref 模块）升级为 Pinia Store：
//   state   —— projects 数组，初始化时从 localStorage 恢复
//   getters —— total（总数）、getById（按 id 查找，返回函数形式）
//   actions —— addProject / updateProject / removeProject，修改后统一 persist 持久化
// 后台管理页修改后，首页 / 列表页 / 详情页自动响应式更新，且刷新页面不丢失。

const STORAGE_KEY = 'cqie-projects'

const DEFAULT_PROJECTS = [
  {
    id: 1,
    name: '个人博客网站',
    time: '2025.09 - 2025.11',
    desc: '基于 Vue 3 + Vite 搭建的个人博客，支持文章列表与分类浏览。',
    intro: '这是学习 Vue 3 组件化开发后的第一个完整作品。网站采用组件化思想拆分文章卡片、分类标签等模块，通过响应式布局适配手机与电脑屏幕，并实现了暗色主题切换。',
    tags: ['Vue 3', 'Vite', 'CSS'],
    link: '#',
    // 开发历程时间线：详情页用 el-timeline 展示，每个节点 = { time, title, desc }
    timeline: [
      { time: '2025.09', title: '需求分析与原型设计', desc: '确定博客的功能范围，绘制文章列表与详情页的线框原型。' },
      { time: '2025.10', title: '核心功能开发', desc: '用 Vue 3 组件化拆分模块，完成文章列表、分类筛选与详情页。' },
      { time: '2025.11', title: '优化与部署', desc: '响应式布局适配移动端，实现暗色主题切换，构建上线。' }
    ]
  },
  {
    id: 2,
    name: '待办事项小程序',
    time: '2025.12 - 2026.01',
    desc: '实现待办的增删改查与本地存储，支持按状态筛选。',
    intro: '练习 JavaScript 数据操作的小项目。待办数据使用 localStorage 持久化，刷新页面不丢失；支持按「全部 / 进行中 / 已完成」三个状态筛选，并对完成率做了简单的统计展示。',
    tags: ['JavaScript', 'localStorage'],
    link: '#',
    timeline: [
      { time: '2025.12', title: '功能设计', desc: '梳理待办的增删改查流程，设计数据结构与状态筛选规则。' },
      { time: '2025.12', title: '功能实现', desc: '完成待办的增删改查与状态筛选，用 localStorage 做持久化。' },
      { time: '2026.01', title: '统计与收尾', desc: '增加完成率统计展示，完善空列表提示与交互细节。' }
    ]
  },
  {
    id: 3,
    name: '学生成绩管理系统',
    time: '2026.03 - 2026.05',
    desc: '课程设计作品，使用 Java 实现成绩录入、统计与导出。',
    intro: '数据库课程设计作品，后端使用 Java + MySQL，实现了学生信息管理、成绩录入、平均分统计与成绩导出功能，配套了简单的命令行交互界面。',
    tags: ['Java', 'MySQL'],
    link: '#',
    timeline: [
      { time: '2026.03', title: '数据库设计', desc: '设计学生表、课程表与成绩表，确定表之间的关联关系。' },
      { time: '2026.04', title: '功能开发', desc: '用 Java + MySQL 实现信息管理、成绩录入、统计与导出。' },
      { time: '2026.05', title: '答辩与完善', desc: '编写课程设计文档，完成答辩演示，修复边界情况的问题。' }
    ]
  },
  {
    id: 4,
    name: '天气查询工具',
    time: '2026.06 - 2026.08',
    desc: '调用公开天气接口，展示当日天气与未来几日预报。',
    intro: '练习网络请求与 API 调用的作品。输入城市名后调用公开天气接口，展示当日天气、温度与未来几天的预报，并对请求失败、城市不存在等异常情况做了提示处理。',
    tags: ['JavaScript', 'API'],
    link: '#',
    timeline: [
      { time: '2026.06', title: '接口调研', desc: '对比多个公开天气接口，确定数据格式与调用方式。' },
      { time: '2026.07', title: '功能开发', desc: '实现城市查询、当日天气与未来预报的展示，处理加载状态。' },
      { time: '2026.08', title: '异常处理', desc: '补充请求失败、城市不存在等异常情况的提示与兜底。' }
    ]
  }
]

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: loadJSON(STORAGE_KEY, DEFAULT_PROJECTS)
  }),

  getters: {
    // 项目总数：后台首页统计卡片使用
    total: (state) => state.projects.length,

    // 按 id 查找项目：返回「函数形式」的 getter，调用时传参。
    // 路由参数是字符串，这里统一转成数字再比较
    getById: (state) => (id) => state.projects.find((project) => project.id === Number(id))
  },

  actions: {
    // ---------- 项目管理：新增 / 更新 / 删除 ----------
    // 新增：id 取当前最大 id + 1，保证不重复
    addProject(data) {
      const maxId = this.projects.reduce((max, project) => Math.max(max, project.id), 0)
      this.projects.push({ id: maxId + 1, ...data })
      this.persist()
    },

    // 更新：按 id 找到后合并新数据（保留未修改的字段）
    updateProject(id, data) {
      const index = this.projects.findIndex((project) => project.id === Number(id))
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...data }
        this.persist()
      }
    },

    // 删除：过滤掉目标项目
    removeProject(id) {
      this.projects = this.projects.filter((project) => project.id !== Number(id))
      this.persist()
    },

    // 统一持久化：三个动作修改完 state 后调用，保证 localStorage 与内存同步
    persist() {
      saveJSON(STORAGE_KEY, this.projects)
    }
  }
})

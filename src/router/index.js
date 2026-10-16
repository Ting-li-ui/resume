import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '../store/auth.js'
import { useProjectStore } from '../store/projects.js'
import { useArticleStore } from '../store/articles.js'

// 路由组件统一放在 src/views（完整页面，按路由规则展示），并按业务模块分子文件夹：
//   home（首页）、projects（项目）、articles（文章）、admin（后台管理）、
//   auth（登录认证）、about（关于）、error（404 错误页）
// 普通可复用组件放在 src/components（UI 片段，由父组件展示）
import HomePage from '../views/home/HomePage.vue'
import ProjectsPage from '../views/projects/ProjectsPage.vue'
import ProjectListPage from '../views/projects/ProjectListPage.vue'
import ProjectDetailPage from '../views/projects/ProjectDetailPage.vue'
import ArticlesPage from '../views/articles/ArticlesPage.vue'
import ArticleListPage from '../views/articles/ArticleListPage.vue'
import ArticleDetailPage from '../views/articles/ArticleDetailPage.vue'
import AboutPage from '../views/about/AboutPage.vue'
import LoginPage from '../views/auth/LoginPage.vue'
import AdminPage from '../views/admin/AdminPage.vue'
import AdminDashboardPage from '../views/admin/AdminDashboardPage.vue'
import AdminProfilePage from '../views/admin/AdminProfilePage.vue'
import AdminProjectsPage from '../views/admin/AdminProjectsPage.vue'
import AdminSkillsPage from '../views/admin/AdminSkillsPage.vue'
import AdminArticlesPage from '../views/admin/AdminArticlesPage.vue'
import NotFoundPage from '../views/error/NotFoundPage.vue'

// ---------- 路由表 ----------
// meta 用来携带与路由无关的附加信息：
//   title        —— 页面标题，beforeEach 守卫里统一更新 document.title
//   requiresAuth —— 是否需要登录，beforeEach 守卫里做权限校验
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { title: '首页' }
  },
  {
    // 项目页（父路由）：自身只提供页面骨架 + 嵌套路由出口 RouterView
    path: '/projects',
    name: 'projects',
    component: ProjectsPage,
    meta: { title: '项目' },
    children: [
      {
        // 嵌套子路由一：项目列表（path 留空作为默认子路由，访问 /projects 时渲染）
        path: '',
        name: 'project-list',
        component: ProjectListPage,
        meta: { title: '项目列表' }
      },
      {
        // 嵌套子路由二：项目详情（:id 是动态路由参数，匹配 /projects/1、/projects/2 ……）
        path: ':id',
        name: 'project-detail',
        component: ProjectDetailPage,
        meta: { title: '项目详情' }
      }
    ]
  },
  {
    // 文章页（父路由）：与项目页一样，自身只提供页面骨架 + 嵌套路由出口 RouterView
    path: '/articles',
    name: 'articles',
    component: ArticlesPage,
    meta: { title: '文章' },
    children: [
      {
        // 嵌套子路由一：文章列表（path 留空作为默认子路由，访问 /articles 时渲染）
        path: '',
        name: 'article-list',
        component: ArticleListPage,
        meta: { title: '文章列表' }
      },
      {
        // 嵌套子路由二：文章详情（:id 动态参数，匹配 /articles/1、/articles/2 ……）
        path: ':id',
        name: 'article-detail',
        component: ArticleDetailPage,
        meta: { title: '文章详情' }
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: { title: '关于' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { title: '登录' }
  },
  {
    // 后台管理（父路由）：meta.requiresAuth 标记为需要登录，beforeEach 守卫负责拦截未登录访问。
    // 注意：meta 会沿嵌套链合并到子路由上，所以五个子页面同样受权限保护
    path: '/admin',
    name: 'admin',
    component: AdminPage,
    meta: { title: '后台管理', requiresAuth: true },
    children: [
      {
        // 后台首页（默认子路由，访问 /admin 时渲染）
        path: '',
        name: 'admin-dashboard',
        component: AdminDashboardPage,
        meta: { title: '后台首页' }
      },
      {
        // 个人简介管理：修改 user 数据，首页与页脚同步更新
        path: 'profile',
        name: 'admin-profile',
        component: AdminProfilePage,
        meta: { title: '个人简介管理' }
      },
      {
        // 项目管理：项目的新增 / 编辑 / 删除
        path: 'projects',
        name: 'admin-projects',
        component: AdminProjectsPage,
        meta: { title: '项目管理' }
      },
      {
        // 技能管理：技能的新增 / 编辑 / 删除
        path: 'skills',
        name: 'admin-skills',
        component: AdminSkillsPage,
        meta: { title: '技能管理' }
      },
      {
        // 文章管理：文章的新增 / 编辑 / 删除
        path: 'articles',
        name: 'admin-articles',
        component: AdminArticlesPage,
        meta: { title: '文章管理' }
      }
    ]
  },
  {
    // 404 兜底路由：pathMatch 参数配合 (.*)* 匹配任意未命中路径
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  // HTML5 history 工作模式：URL 干净无 # 号，部署时需要服务器配合回退到 index.html
  history: createWebHistory(),
  routes,
  // 切换路由后回到页面顶部，避免沿用上一页的滚动位置
  scrollBehavior() {
    return { top: 0 }
  }
})

// ---------- 全局前置守卫 ----------
// 每个路由跳转前都会先经过这里，return 路由对象表示“重定向到那里”，return 空/true 表示放行
router.beforeEach((to) => {
  // 守卫回调里才能调用 useAuthStore()：此时 Pinia 已在 main.js 中注册完成，
  // 而模块顶层（import 阶段）Pinia 还没激活，提前调用会报错
  const authStore = useAuthStore()

  // 1. 根据 meta.title 更新浏览器标签页标题（详情页再拼接上具体项目名 / 文章名）
  const baseTitle = '个人名片'
  let title = baseTitle
  if (to.meta.title) {
    if (to.name === 'project-detail') {
      title = `${to.meta.title} · ${useProjectStore().getById(to.params.id)?.name ?? '未知项目'}`
    } else if (to.name === 'article-detail') {
      title = `${to.meta.title} · ${useArticleStore().getById(to.params.id)?.title ?? '未知文章'}`
    } else {
      title = `${to.meta.title} · ${baseTitle}`
    }
  }
  document.title = title

  // 2. 权限校验：目标路由需要登录但当前未登录时，重定向到登录页，
  //    并通过 query 把原地址带上，登录成功后跳回原页面。
  //    isLoggedIn 是 auth Store 的 getter，登录 / 退出后自动重算
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router

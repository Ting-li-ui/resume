<script setup>
  import { useRouter, useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import {
    HomeFilled,
    User,
    FolderOpened,
    MagicStick,
    Document,
    ArrowDown
  } from '@element-plus/icons-vue'
  import { useAuthStore } from '../../store/auth.js'

  const router = useRouter()
  const route = useRoute()

  // 登录用户信息来自 auth Store：storeToRefs 解构出响应式 username，模板中自动解包
  const authStore = useAuthStore()
  const { username } = storeToRefs(authStore)

  // 子导航：后台管理的五个功能入口。
  // 每个 el-menu-item 的 index 写完整路径（el-menu 的 router 模式会按 index 跳转），
  // icon 字段存图标组件，el-icon 包裹渲染
  const subNav = [
    { path: '/admin', name: 'admin-dashboard', label: '后台首页', icon: HomeFilled },
    { path: '/admin/profile', name: 'admin-profile', label: '个人简介管理', icon: User },
    { path: '/admin/projects', name: 'admin-projects', label: '项目管理', icon: FolderOpened },
    { path: '/admin/skills', name: 'admin-skills', label: '技能管理', icon: MagicStick },
    { path: '/admin/articles', name: 'admin-articles', label: '文章管理', icon: Document }
  ]

  // 下拉菜单「退出登录」回调
  function handleLogout() {
    authStore.logout()
    router.push({ name: 'home' })
  }
</script>

<template>
  <!-- 后台管理（嵌套路由的父路由组件）
       实验九改造：改用 Element Plus 经典的后台布局：
         el-container —— 外层左右布局容器（内部有 el-aside 时自动横向排布）
         el-aside     —— 左侧边栏，放 el-menu 垂直菜单
         el-container —— 右侧容器：顶部用户信息栏 + 主体路由出口
         el-header    —— 顶部栏：欢迎语 + el-dropdown 用户下拉菜单
         el-main      —— <RouterView /> 渲染各管理子页面 -->
  <el-container class="admin-wrap">
    <el-aside width="200px" class="admin-aside">
      <!-- el-menu 菜单组件：router 模式按 index 路径跳转；
           default-active 绑定当前路径，刷新后高亮不丢失 -->
      <el-menu
        router
        :default-active="route.path"
        class="admin-menu"
      >
        <el-menu-item v-for="item in subNav" :key="item.name" :index="item.path">
          <!-- el-icon 图标容器：展示菜单项图标 -->
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-head" height="auto">
        <p class="admin-welcome">欢迎回来，<strong>{{ username }}</strong></p>

        <!-- el-dropdown 下拉菜单：收纳用户相关操作（退出登录） -->
        <el-dropdown trigger="click">
          <span class="admin-user">
            {{ username }}
            <el-icon class="admin-arrow"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <!-- 嵌套子路由出口：/admin 渲染后台首页，
           /admin/profile、/admin/projects、/admin/skills、/admin/articles 渲染对应管理页 -->
      <el-main class="admin-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
  /* 后台整体：限高 100vh 以内并独立滚动，避免与全局页头页脚混排 */
  .admin-wrap {
    min-height: calc(100vh - 170px);
  }

  .admin-aside {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
  }

  /* 侧边菜单：去边框、全高、背景透明，与边栏（--card-bg）融为一体 */
  .admin-menu {
    height: 100%;
    border-right: none;
    background-color: transparent;
  }

  .admin-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 0 0 14px;
  }

  .admin-welcome {
    margin: 0;
    color: var(--muted-color);
  }

  /* 用户下拉入口：可点击，悬浮出现手型 */
  .admin-user {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--primary-color);
    font-weight: 600;
    cursor: pointer;
    outline: none;
  }

  .admin-arrow {
    font-size: 12px;
  }

  .admin-main {
    padding: 0 0 0 16px;
  }
</style>

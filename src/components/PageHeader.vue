<script setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '../store/auth.js'
  import { useThemeStore } from '../store/theme.js'

  const router = useRouter()
  const route = useRoute()

  // 登录状态来自 auth Store：storeToRefs 解构 getter 依然是响应式 ref，
  // 登录 / 退出后 navItems 计算属性自动重算，导航入口实时切换
  const { isLoggedIn } = storeToRefs(useAuthStore())

  // DOM class 切换与 localStorage 持久化全部由 Store 内部完成，
  const themeStore = useThemeStore()
  const { isDark } = storeToRefs(themeStore)

  // 导航数据：index 用于菜单高亮（父路由 name），target 用于跳转。
  // 项目 / 文章 / 后台管理都是「带默认子路由的父路由」，
  // 跳转目标直接写默认子路由 name，避免命名路由跳到父路由时
  // 默认子路由不参与匹配导致内容区空白的问题
  const navItems = computed(() => {
    const items = [
      { name: 'home', label: '首页', target: 'home' },
      { name: 'projects', label: '项目', target: 'project-list' },
      { name: 'articles', label: '文章', target: 'article-list' },
      { name: 'about', label: '关于', target: 'about' }
    ]
    // 登录后显示「后台管理」，未登录只显示「登录」入口
    if (isLoggedIn.value) {
      items.push({ name: 'admin', label: '后台管理', target: 'admin-dashboard' })
    } else {
      items.push({ name: 'login', label: '登录', target: 'login' })
    }
    return items
  })

  // 当前高亮的菜单项：取 matched 链最外层父路由的 name。
  // 例如访问 /projects/1 时 route.name 是 project-detail，
  // 但顶部菜单要一直高亮「项目」，matched[0].name 恰好就是 projects
  const activeMenu = computed(() => route.matched[0]?.name ?? route.name)

  // 避免与 el-menu 内置 router 模式的路径约定耦合
  function handleSelect(name) {
    const item = navItems.value.find((nav) => nav.name === name)
    if (item) {
      router.push({ name: item.target })
    }
  }
</script>

<template>
  <header class="page-header">
    <h1 class="logo">个人名片</h1>

    <!-- el-menu 菜单组件：mode="horizontal" 顶部横排导航。
         index 存父路由 name，@select 里用 router.push 跳转；
         default-active 绑定 activeMenu 计算属性，详情页等子路由下高亮不丢失 -->
    <el-menu mode="horizontal" :ellipsis="false" :default-active="activeMenu" class="nav-menu" @select="handleSelect">
      <el-menu-item v-for="item in navItems" :key="item.name" :index="item.name">
        {{ item.label }}
      </el-menu-item>
    </el-menu>

    <!-- el-switch 开关组件：亮 / 暗主题切换。
    model-value 单向显示 + @change 触发 action -->
    <el-switch :model-value="isDark" class="theme-switch" inline-prompt active-text="暗" inactive-text="亮"
      title="切换亮色 / 暗色主题" @change="themeStore.toggleTheme" />
  </header>
</template>

<style scoped>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    /* 32px 与内容区 .page-main 的水平留白一致：logo、菜单与下方内容左边缘对齐 */
    padding: 0 32px;
    background-color: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
  }

  /* 窄屏跟随内容区收紧到 16px */
  @media (max-width: 767px) {
    .page-header {
      padding: 0 16px;
    }
  }

  .logo {
    margin: 0;
    font-size: 20px;
    white-space: nowrap;
  }

  /* 导航菜单：占满剩余空间，去掉 el-menu 默认下边框（header 已有），
     背景透明让菜单与页头容器融为一体（暗色主题下尤其明显） */
  .nav-menu {
    flex: 1;
    border-bottom: none;
    background-color: transparent;
  }

  .theme-switch {
    flex-shrink: 0;
  }
</style>

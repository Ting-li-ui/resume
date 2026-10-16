<script setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../../store/auth.js'
  import { useUserStore } from '../../store/user.js'
  import { useProjectStore } from '../../store/projects.js'
  import { useSkillStore } from '../../store/skills.js'
  import { useArticleStore } from '../../store/articles.js'

  const router = useRouter()

  // username / user 在模板中直接展示，用 storeToRefs 解构成响应式 ref
  const { username } = storeToRefs(useAuthStore())
  const { user } = storeToRefs(useUserStore())

  // 统计数据直接读取各 Store 的 total getter：
  // getter 有缓存且依赖 state，后台增删项目 / 技能 / 文章后这里实时变化
  const projectStore = useProjectStore()
  const skillStore = useSkillStore()
  const articleStore = useArticleStore()

  const stats = computed(() => [
    { num: projectStore.total, label: '项目作品', path: '/admin/projects' },
    { num: skillStore.total, label: '技能数量', path: '/admin/skills' },
    { num: articleStore.total, label: '文章数量', path: '/admin/articles' },
    { num: 1, label: '个人简介', path: '/admin/profile' }
  ])

  // 快捷入口：点击跳转到对应管理页
  function goManage(path) {
    router.push(path)
  }
</script>

<template>
  <div>
    <!-- el-alert 提示组件：说明本页的权限机制 -->
    <el-alert
      class="welcome"
      :title="`欢迎回来，${username}！本页及所有子页面在路由表中被标记了 meta.requiresAuth，未登录访问会被 beforeEach 守卫拦截并重定向到登录页（守卫内部读取 auth Store 的 isLoggedIn getter）。`"
      type="success"
      show-icon
      :closable="false"
    />

    <!-- 统计卡片：el-row / el-col 栅格四列排布，窄屏两列，
         数字用 el-statistic 统计组件展示，点击卡片进入对应管理页 -->
    <el-row :gutter="16">
      <el-col v-for="item in stats" :key="item.label" :xs="12" :md="6" class="stat-col">
        <el-card class="stat-card" shadow="hover" @click="goManage(item.path)">
          <el-statistic :value="item.num" />
          <p class="stat-label">{{ item.label }}</p>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-card class="ops">
      <template #header>
        <h2 class="ops-title">快捷操作</h2>
      </template>
      <p class="ops-tip">当前名片主人：{{ user.name }} · 学号 {{ user.studentId }}</p>
      <div class="action-bar">
        <el-button type="primary" @click="goManage('/admin/profile')">修改个人简介</el-button>
        <el-button @click="goManage('/admin/projects')">管理项目作品</el-button>
        <el-button @click="goManage('/admin/skills')">管理技能</el-button>
        <el-button @click="goManage('/admin/articles')">管理文章</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
  .welcome {
    margin-bottom: 16px;
  }

  /* 栅格列：窄屏单列堆叠时留出间距 */
  .stat-col {
    margin-bottom: 16px;
  }

  .stat-card {
    text-align: center;
    cursor: pointer;
  }

  .stat-label {
    margin: 4px 0 0;
    color: var(--muted-color);
  }

  .ops-title {
    margin: 0;
  }

  .ops-tip {
    margin: 0 0 12px;
    color: var(--muted-color);
  }

  .action-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
</style>

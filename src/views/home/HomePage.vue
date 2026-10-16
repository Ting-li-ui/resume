<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import ProfileCard from '../../components/ProfileCard.vue'
  import SkillCard from '../../components/SkillCard.vue'
  import ProjectCard from '../../components/ProjectCard.vue'
  import TimelineCard from '../../components/TimelineCard.vue'
  // 共享数据全部来自 Pinia Store（实验四升级）：
  // user / projects / skills / articles 用 storeToRefs 解构成响应式 ref，
  // isLoggedIn 决定 ProfileCard 是否显示编辑入口；
  // actions（updateUser）直接从 store 上调用，不能解构
  import { useAuthStore } from '../../store/auth.js'
  import { useUserStore } from '../../store/user.js'
  import { useProjectStore } from '../../store/projects.js'
  import { useSkillStore } from '../../store/skills.js'
  import { useArticleStore } from '../../store/articles.js'

  const { isLoggedIn } = storeToRefs(useAuthStore())
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)
  const { projects } = storeToRefs(useProjectStore())
  const { skills } = storeToRefs(useSkillStore())
  const { articles } = storeToRefs(useArticleStore())

  // ---------- 学习经历时间轴（数组数据，传给 TimelineCard） ----------
  // 仅本页面使用，不跨页面共享，所以保留为组件内的局部状态
  const timeline = ref([
    { id: 1, time: '2021 - 2024', title: '高中阶段', desc: '接触计算机基础，对编程产生浓厚兴趣。' },
    { id: 2, time: '2024 - 至今', title: '大学阶段 · 计算机科学与技术', desc: '系统学习编程语言、数据结构与前端开发。' },
    { id: 3, time: '2025', title: '前端开发入门', desc: '学习 HTML / CSS / JavaScript，完成第一个静态页面。' },
    { id: 4, time: '2026', title: 'Vue 3 学习', desc: '学习组件化开发、路由与插槽，正在积累项目经验。' }
  ])

  // Hero 欢迎区的时段问候语：按当前小时数派生，computed 缓存结果
  const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 6) return '夜深了'
    if (hour < 12) return '早上好'
    if (hour < 14) return '中午好'
    if (hour < 18) return '下午好'
    return '晚上好'
  })

  // 组件挂载完成时输出信息
  onMounted(() => {
    console.log('个人信息页面加载完成，欢迎访问！')
  })

  // 接收 ProfileCard 保存的新资料，调用 user Store 的 action 更新共享状态
  function handleSave(newUser) {
    userStore.updateUser(newUser)
    console.log('个人信息已更新：', user.value)
  }
</script>

<template>
  <!-- 首页内容区：三段式布局（页头/页脚）已提升到 App.vue，这里只负责页面内容。
       布局自上而下：Hero 欢迎横幅 → 双栏卡片 → 通栏的项目展示与学习历程 -->
  <div class="home-page">
    <!-- Hero 欢迎区：主题绿渐变横幅，左侧问候语 + 座右铭 + 快捷入口，
         右侧用 el-statistic 展示站点内容统计（数据实时来自各 Store） -->
    <section class="hero">
      <div class="hero-main">
        <!-- 头像：白色描边浮在渐变背景上，强化「个人主页」氛围 -->
        <el-avatar :size="72" :src="user.avatar" class="hero-avatar" />
        <div class="hero-text">
          <p class="hero-greeting">{{ greeting }}，欢迎访问</p>
          <h2 class="hero-name">{{ user.name }} 的个人主页</h2>
          <p class="hero-motto">「 {{ user.motto }} 」</p>
          <div class="hero-actions">
            <!-- 快捷入口：RouterLink 负责跳转，el-button 负责外观 -->
            <RouterLink :to="{ name: 'project-list' }" class="hero-link">
              <el-button round>查看我的项目</el-button>
            </RouterLink>
            <RouterLink :to="{ name: 'article-list' }" class="hero-link">
              <el-button round plain class="hero-btn-ghost">阅读文章</el-button>
            </RouterLink>
          </div>
        </div>
      </div>
      <!-- el-statistic 统计组件：title 标题 + value 数值，展示站点内容规模 -->
      <div class="hero-stats">
        <el-statistic title="项目作品" :value="projects.length" />
        <el-statistic title="技能标签" :value="skills.length" />
        <el-statistic title="文章笔记" :value="articles.length" />
      </div>
    </section>

    <!-- 双栏区域：ProfileCard 个人卡片 + SkillCard 技能卡片
         el-row :gutter="16" —— 行容器，gutter 控制列之间的 16px 间距
         el-col :xs="24" :md="12" —— 栅格列，窄屏（xs）占满 24 格单列堆叠，
                                     宽屏（≥768px，md 断点）各占 12 格左右并排 -->
    <el-row :gutter="16" class="card-row">
      <el-col :xs="24" :md="12">
        <ProfileCard id="profile" :user="user" :can-edit="isLoggedIn" @save="handleSave" />
      </el-col>
      <el-col :xs="24" :md="12">
        <SkillCard id="skills" :skills="skills" />
      </el-col>
    </el-row>

    <!-- 下方通栏区域 -->
    <div class="more-section">
      <!-- 项目展示模块：全项目唯一使用插槽的地方，
           通过作用域插槽接收每条项目数据并定制渲染 -->
      <ProjectCard id="projects" :projects="projects">
        <template #project-item="{ project }">
          <h3 class="p-name">
            {{ project.name }}
            <!-- 「查看」从外链改为动态路由跳转：点击进入对应项目的详情页 -->
            <RouterLink class="p-link" :to="{ name: 'project-detail', params: { id: project.id } }">
              查看详情
            </RouterLink>
          </h3>
          <p class="p-desc">{{ project.desc }}</p>
          <p class="p-tags">
            <!-- el-tag 标签组件：每个技术标签一个，size=small 圆角胶囊效果 -->
            <el-tag v-for="tag in project.tags" :key="tag" size="small" class="p-tag">{{ tag }}</el-tag>
          </p>
        </template>
      </ProjectCard>
      <TimelineCard id="timeline" :timeline="timeline" />
    </div>
  </div>
</template>

<style scoped>
  /* ---------- Hero 欢迎区 ---------- */
  /* 主题绿渐变横幅：亮色 / 暗色主题下都使用同一渐变，
     文字统一白色，不受 CSS 变量切换影响 */
  .hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
    padding: 28px 32px;
    margin-bottom: 16px;
    border-radius: 12px;
    color: #ffffff;
    background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
    box-shadow: 0 4px 14px rgba(66, 184, 131, 0.25);
  }

  /* 头像 + 文字为一组，与右侧统计区分列两端 */
  .hero-main {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
    min-width: 300px;
  }

  .hero-avatar {
    flex-shrink: 0;
    border: 3px solid rgba(255, 255, 255, 0.65);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .hero-greeting {
    margin: 0 0 4px;
    font-size: 14px;
    opacity: 0.85;
  }

  .hero-name {
    margin: 0 0 8px;
    font-size: 26px;
  }

  .hero-motto {
    margin: 0 0 16px;
    font-size: 14px;
    opacity: 0.9;
  }

  /* 快捷入口按钮：RouterLink 渲染出的 a 标签去掉下划线 */
  .hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .hero-link {
    text-decoration: none;
  }

  /* 渐变背景上的幽灵按钮：白边白字半透明底 */
  .hero-btn-ghost {
    background-color: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.8);
    color: #ffffff;
  }

  .hero-btn-ghost:hover {
    background-color: rgba(255, 255, 255, 0.25);
    border-color: #ffffff;
    color: #ffffff;
  }

  /* 统计区：三个 el-statistic 横向排布；
     :deep() 穿透 scoped，把组件内部的标题与数字都改为白色 */
  .hero-stats {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
  }

  .hero-stats :deep(.el-statistic__head) {
    color: rgba(255, 255, 255, 0.85);
  }

  .hero-stats :deep(.el-statistic__content) {
    color: #ffffff;
  }

  /* ---------- 双栏区域 ---------- */
  /* 双栏卡片等高：el-row 是 flex 容器，el-col 默认拉伸到行高，
     :deep() 让子组件根元素 el-card 高度填满所在列 */
  .card-row :deep(.el-card) {
    height: 100%;
    box-sizing: border-box;
  }

  /* 双栏区域的窄屏单列堆叠样式：el-col 的 xs/md 断点已实现响应式，
     这里只需给窄屏下堆叠的两个卡片之间留出间距 */
  @media (max-width: 767px) {
    .el-col {
      margin-bottom: 16px;
    }

    .hero {
      padding: 20px;
    }

    .hero-stats {
      gap: 24px;
    }
  }

  /* 下方通栏区域：与上方双栏拉开间距，内部卡片纵向排布 */
  .more-section {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* 项目展示模块作用域插槽的定制渲染样式 */
  .p-name {
    margin: 0 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .p-link {
    font-size: 13px;
    color: var(--primary-color);
    text-decoration: none;
  }

  .p-desc {
    margin: 0 0 10px;
    color: var(--muted-color);
    font-size: 14px;
    line-height: 1.6;
  }

  .p-tags {
    margin: 0;
  }

  .p-tag {
    margin: 0 6px 6px 0;
  }
</style>

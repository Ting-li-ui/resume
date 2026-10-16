<script setup>
  import { storeToRefs } from 'pinia'
  import PageHeader from './components/PageHeader.vue'
  import PageFooter from './components/PageFooter.vue'
  import { useUserStore } from './store/user.js'
  import { useThemeStore } from './store/theme.js'

  // 页脚信息由 user Store 驱动：storeToRefs 解构出响应式 ref（模板中自动解包），
  // 后台修改简介后这里同步更新
  const { user } = storeToRefs(useUserStore())

  // 主题状态已收进 theme Store（Pinia），不再用组件内 ref + v-model 层层传递。
  // 应用启动时调用一次 applyTheme()：把 localStorage 里保存的主题恢复到
  // html / body 的 class 上（之后的切换由 PageHeader 开关触发 toggleTheme action，
  // DOM class 与持久化都由 Store 内部完成）
  const themeStore = useThemeStore()
  themeStore.applyTheme()
</script>

<template>
  <!-- 三段式布局：页头 + 主体（路由出口）+ 页脚，由 el-container 自动纵向排布 -->
  <el-container class="page">
    <el-header class="page-header-wrap" height="auto">
      <PageHeader />
    </el-header>

    <!-- 路由组件渲染出口：当前地址匹配到哪个路由组件，就渲染在这里 -->
    <el-main class="page-main">
      <RouterView />
    </el-main>

    <!-- 页脚信息由共享的 user 数据驱动，首页编辑资料后这里同步更新 -->
    <el-footer class="page-footer-wrap" height="auto">
      <PageFooter :user="user" />
    </el-footer>
  </el-container>
</template>

<!-- 注意：这里不能加 scoped！因为样式中有 :root 和 body 这类全局选择器，
     加了 scoped 后 body 相关规则将无法作用到 index.html 中的 <body> 上 -->
<style>
  :root {
    --bg-color: #f4f6f9;
    --card-bg: #ffffff;
    --text-color: #303133;
    --muted-color: #909399;
    --border-color: #dcdfe6;
    --primary-color: #42b883;
    --el-color-primary: #42b883;
    --el-color-primary-light-3: #7bcda8;
    --el-color-primary-light-5: #a0dcc1;
    --el-color-primary-light-7: #c6ead9;
    --el-color-primary-light-8: #d9f1e6;
    --el-color-primary-light-9: #ecf8f3;
    --el-color-primary-dark-2: #359368;
  }

  body.dark {
    --bg-color: #171722;
    --card-bg: #232335;
    --text-color: #e6e6ef;
    --muted-color: #8a8aa0;
    --border-color: #3a3a52;
  }

  html.dark {
    --el-color-primary: #42b883;
    --el-color-primary-light-3: #349b62;
    --el-color-primary-light-5: #2b664b;
    --el-color-primary-light-7: #224535;
    --el-color-primary-light-8: #1d352a;
    --el-color-primary-light-9: #19241f;
    --el-color-primary-dark-2: #68c69c;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
    transition: background-color 0.3s, color 0.3s;
  }

  .page {
    min-height: 100vh;
    flex-direction: column;
  }

  .page-header-wrap {
    padding: 0;
  }

  .page-footer-wrap {
    padding: 0;
  }

  /* 内容区宽度策略：
     普通屏幕铺满整屏（去掉原来的 1000px 限宽，消除两侧大片空白造成的割裂感），
     超宽屏（≥1600px）限宽 1520px 居中——行宽过长会严重损害阅读体验，
     个人主页双栏卡片拉得太开也会显得空旷 */
  .page-main {
    width: 100%;
    box-sizing: border-box;
    padding: 24px 32px;
  }

  @media (min-width: 1600px) {
    .page-main {
      max-width: 1520px;
      margin: 0 auto;
    }
  }

  /* 窄屏：32px 水平留白占屏比例过大，收紧到 16px */
  @media (max-width: 767px) {
    .page-main {
      padding: 16px;
    }
  }

  /* ---------- el-card 全局美化 ---------- */
  /* Element Plus 卡片默认是「细边框 + 硬阴影」，缝隙处透出灰色背景显得割裂。
     这里全局改为：无边框 + 大圆角 + 双层柔和阴影（近处一层淡的、远处一层更淡的），
     让卡片像浮在背景上，卡片之间的缝隙呈现层次感而不是边界感。
     transition 让 hover 时阴影加深有过渡动画 */
  .el-card {
    border: none;
    border-radius: 12px;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.06),
      0 6px 16px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;
  }

  /* 卡片头部的下边框分隔线去掉：标题靠图标与字号区分，
     卡片不再被分成两截，整体感更强 */
  .el-card__header {
    border-bottom: none;
    padding-bottom: 10px;
  }

  /* hover 时阴影加深：轻微的「浮起」反馈，位置不动避免影响表格等内部布局 */
  .el-card:hover {
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.08),
      0 10px 24px rgba(0, 0, 0, 0.08);
  }

  /* 暗色主题下阴影要更深才看得见 */
  body.dark .el-card {
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.35),
      0 6px 16px rgba(0, 0, 0, 0.25);
  }

  body.dark .el-card:hover {
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.4),
      0 10px 24px rgba(0, 0, 0, 0.35);
  }

  h1,
  h2 {
    margin-top: 0;
  }

  .empty {
    color: var(--muted-color);
    text-align: center;
    padding: 12px 0;
  }
</style>

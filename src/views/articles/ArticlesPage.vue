<script setup>
  // 文章页（嵌套路由的父路由组件）：
  // 自身只负责页面标题骨架，子路由（列表 / 详情）渲染在下方 <RouterView /> 出口中
</script>

<template>
  <div class="articles-page">
    <h1 class="page-title">学习文章</h1>
    <p class="page-sub">记录学习过程的技术笔记，点击文章卡片可进入详情页（文章数据由 Pinia Store 统一管理）</p>

    <!-- 嵌套子路由出口：/articles 渲染文章列表，/articles/:id 渲染文章详情 -->
    <RouterView />
  </div>
</template>

<style scoped>
  .page-title {
    margin: 0 0 6px;
  }

  .page-sub {
    margin: 0 0 16px;
    color: var(--muted-color);
    font-size: 14px;
  }
</style>

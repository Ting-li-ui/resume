<script setup>
  // 项目页（嵌套路由的父路由组件）：
  // 自身只负责页面标题骨架，子路由（列表 / 详情）渲染在下方 <RouterView /> 出口中
</script>

<template>
  <div class="projects-page">
    <h1 class="page-title">项目作品</h1>
    <p class="page-sub">点击项目卡片可进入详情页，这是「嵌套路由」的父页面</p>

    <!-- 嵌套子路由出口：/projects 渲染项目列表，/projects/:id 渲染项目详情 -->
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

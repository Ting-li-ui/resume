<script setup>
  import { storeToRefs } from 'pinia'
  import ProjectCard from '../../components/ProjectCard.vue'
  import { useProjectStore } from '../../store/projects.js'

  // 项目数据来自 project Store：storeToRefs 解构出响应式 ref，
  // 后台管理页增删项目后，这里自动更新，无需手动刷新
  const { projects } = storeToRefs(useProjectStore())
</script>

<template>
  <!-- 项目列表（嵌套子路由一）：
       直接复用 ProjectCard（全项目唯一使用插槽的组件），
       通过 project-item 作用域插槽把每条项目定制成「可点击进入详情」的样式 -->
  <ProjectCard :projects="projects">
    <template #header>
      <h2>项目列表（共 {{ projects.length }} 个）</h2>
    </template>

    <template #project-item="{ project }">
      <h3 class="p-name">
        {{ project.name }}
        <!-- 用命名路由 + params 跳转详情页，路径写死后改路由表也不会坏 -->
        <RouterLink class="p-link" :to="{ name: 'project-detail', params: { id: project.id } }">
          查看详情
        </RouterLink>
      </h3>
      <p class="p-desc">{{ project.desc }}</p>
      <p class="p-tags">
        <!-- el-tag 标签组件：与首页一致的标签展示 -->
        <el-tag v-for="tag in project.tags" :key="tag" size="small" class="p-tag">{{ tag }}</el-tag>
      </p>
    </template>
  </ProjectCard>
</template>

<style scoped>
  /* 作用域插槽定制样式：与首页保持一致的标签风格 */
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

<script setup>
  import { FolderOpened } from '@element-plus/icons-vue'

  // 接收父组件传入的项目列表
  defineProps({
    projects: {
      type: Array,
      required: true
    }
  })
</script>

<template>
  <!-- 卡片三：项目作品展示
       项目展示模块是全项目中唯一使用插槽的模块：
       header 具名插槽定制卡片头部，
       project-item 作用域插槽把每条项目数据交给父组件定制渲染。 -->
  <el-card>
    <template #header>
      <slot name="header">
        <div class="card-head">
          <span class="card-icon"><el-icon><FolderOpened /></el-icon></span>
          <h2 class="card-title">项目作品</h2>
        </div>
      </slot>
    </template>

    <!-- 项目块：通栏下用栅格两列排布，窄屏（xs）自动单列 -->
    <el-row v-if="projects.length > 0" :gutter="16">
      <el-col v-for="project in projects" :key="project.id" :xs="24" :md="12" class="project-col">
        <div class="project-item">
          <!-- 作用域插槽：把每条项目的数据暴露给父组件，父组件按自己的方式渲染 -->
          <slot name="project-item" :project="project">
            <!-- 后备内容：父组件没有传入插槽内容时，使用这里的默认渲染 -->
            <h3>
              {{ project.name }}
              <a class="project-link" :href="project.link" target="_blank">查看</a>
            </h3>
            <p class="project-desc">{{ project.desc }}</p>
            <p class="project-tags">
              <el-tag v-for="tag in project.tags" :key="tag" size="small" type="info" class="tag">
                {{ tag }}
              </el-tag>
            </p>
          </slot>
        </div>
      </el-col>
    </el-row>
    <el-empty v-else description="暂无项目作品" :image-size="60" />
  </el-card>
</template>

<style scoped>
  .card-head {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* 标题图标：主题绿浅色圆角底托 + 绿色图标（与 ProfileCard 同一约定） */
  .card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 8px;
    background-color: var(--el-color-primary-light-9);
    color: var(--primary-color);
    font-size: 18px;
  }

  .card-title {
    margin: 0;
  }

  /* 栅格列在窄屏单列堆叠时，列与列之间留出间距 */
  .project-col {
    margin-bottom: 16px;
  }

  /* 项目小块：不用边框（白卡里套边框会显得「框中框」），
     改用页面背景色做浅底，嵌在卡片里层次更柔和 */
  .project-item {
    background-color: var(--bg-color);
    border-radius: 10px;
    padding: 14px;
    height: 100%;
    box-sizing: border-box;
  }

  .project-item h3 {
    margin: 0 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .project-link {
    font-size: 13px;
    color: var(--primary-color);
    text-decoration: none;
  }

  .project-desc {
    margin: 0 0 10px;
    color: var(--muted-color);
    font-size: 14px;
    line-height: 1.6;
  }

  .project-tags {
    margin: 0;
  }

  /* 技术栈标签 */
  .tag {
    margin: 0 6px 6px 0;
  }
</style>

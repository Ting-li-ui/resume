<script setup>
  import { Clock } from '@element-plus/icons-vue'

  // 接收父组件传入的学习经历列表
  defineProps({
    timeline: {
      type: Array,
      required: true
    }
  })

  // 时间线节点颜色循环表：按条目顺序轮流取用，
  // 让每个节点的 el-timeline-item 主题色错落有致
  const NODE_TYPES = ['primary', 'success', 'warning', 'info']

  function nodeType(index) {
    return NODE_TYPES[index % NODE_TYPES.length]
  }
</script>

<template>
  <!-- 卡片四：学习历程时间轴
       实验九改造：手写的「竖线 + 圆点」时间轴改用 Element Plus 的
       el-timeline / el-timeline-item 时间线组件实现：
         timestamp —— 右侧灰色时间标注（2021 - 2024 等）
         type      —— 节点圆点颜色，按顺序轮流取色
         hollow    —— 空心节点样式 -->
  <el-card>
    <template #header>
      <div class="card-head">
        <span class="card-icon"><el-icon><Clock /></el-icon></span>
        <h2 class="card-title">学习历程</h2>
      </div>
    </template>

    <el-timeline v-if="timeline.length > 0">
      <el-timeline-item
        v-for="(item, index) in timeline"
        :key="item.id"
        :timestamp="item.time"
        :type="nodeType(index)"
        placement="top"
        hollow
      >
        <h3 class="tl-title">{{ item.title }}</h3>
        <p class="tl-desc">{{ item.desc }}</p>
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else description="暂无学习记录" :image-size="60" />
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

  .tl-title {
    margin: 0 0 4px;
  }

  .tl-desc {
    margin: 0;
    color: var(--muted-color);
    font-size: 14px;
    line-height: 1.6;
  }
</style>

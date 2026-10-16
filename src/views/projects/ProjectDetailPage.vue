<script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Flag } from '@element-plus/icons-vue'
  import { useProjectStore } from '../../store/projects.js'

  // useRoute 拿到当前路由对象，route.params.id 就是路由表中 :id 动态参数
  const route = useRoute()
  // useRouter 拿到路由器实例，用于编程式导航（不依赖 <RouterLink> 的跳转）
  const router = useRouter()

  const projectStore = useProjectStore()

  // 通过 Store 的 getter 按动态参数查找项目：
  // getById 是「函数形式」的 getter，在 computed 中调用并依赖 params.id，
  // 同一页面切换不同项目 id 时也能正确响应
  const project = computed(() => projectStore.getById(route.params.id))

  // 时间线节点颜色循环表：按节点顺序轮流取色（与首页 TimelineCard 同一约定）
  const NODE_TYPES = ['primary', 'success', 'warning', 'info']

  function nodeType(index) {
    return NODE_TYPES[index % NODE_TYPES.length]
  }

  // ---------- 编程式导航：用代码控制跳转 ----------
  // 返回项目列表：push 指定命名路由，等价于点击「项目」列表页
  function goList() {
    router.push({ name: 'project-list' })
  }

  // 返回上一页：历史栈后退一步（详情页可能从列表进入，也可能从首页进入）
  function goBack() {
    router.back()
  }

  // 回到首页
  function goHome() {
    router.push({ name: 'home' })
  }
</script>

<template>
  <div>
    <!-- 详情正常展示：根据 :id 找到对应项目。
         实验九改造：外层改用 el-card；基本信息改用 el-descriptions 描述列表；
         技术标签改用 el-tag；操作按钮改用 el-button -->
    <el-card v-if="project">
      <template #header>
        <h2 class="detail-name">{{ project.name }}</h2>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="项目时间">{{ project.time }}</el-descriptions-item>
        <el-descriptions-item label="一句话描述">{{ project.desc }}</el-descriptions-item>
        <el-descriptions-item label="详细介绍" :span="2">{{ project.intro }}</el-descriptions-item>
      </el-descriptions>

      <p class="detail-tags">
        <el-tag v-for="tag in project.tags" :key="tag" size="small" type="success" class="detail-tag">
          {{ tag }}
        </el-tag>
      </p>

      <!-- 开发历程时间线：el-timeline 渲染项目的 timeline 字段。
           v-if + 可选链兜底：旧 localStorage 缓存或手动新增的项目没有
           timeline 字段时整块不显示，页面不报错 -->
      <div v-if="project.timeline?.length" class="timeline-section">
        <h3 class="section-title">
          <span class="section-icon"><el-icon><Flag /></el-icon></span>
          开发历程
        </h3>
        <el-timeline>
          <el-timeline-item
            v-for="(node, index) in project.timeline"
            :key="index"
            :timestamp="node.time"
            :type="nodeType(index)"
            placement="top"
            hollow
          >
            <h4 class="tl-title">{{ node.title }}</h4>
            <p class="tl-desc">{{ node.desc }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 编程式导航按钮组：返回列表（push） / 返回上一页（back） -->
      <div class="action-bar">
        <el-button type="primary" @click="goList">返回项目列表</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </el-card>

    <!-- 无效详情地址处理：/projects/999 这类不存在的 id，用 el-result 结果组件反馈 -->
    <el-result v-else icon="warning" title="项目不存在" :sub-title="`没有找到编号为 ${route.params.id} 的项目，可能已删除或地址有误。`">
      <template #extra>
        <el-button type="primary" @click="goList">返回项目列表</el-button>
        <el-button @click="goHome">回到首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
  .detail-name {
    margin: 0;
  }

  .detail-tags {
    margin: 16px 0;
  }

  .detail-tag {
    margin: 0 6px 6px 0;
  }

  /* 开发历程时间线：与上方描述列表拉开间距 */
  .timeline-section {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px dashed var(--border-color);
  }

  .section-title {
    margin: 0 0 14px;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* 小节图标：与首页卡片标题图标同一约定（主题绿浅色底托） */
  .section-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 8px;
    background-color: var(--el-color-primary-light-9);
    color: var(--primary-color);
    font-size: 16px;
  }

  .tl-title {
    margin: 0 0 4px;
    font-size: 15px;
  }

  .tl-desc {
    margin: 0;
    color: var(--muted-color);
    font-size: 14px;
    line-height: 1.6;
  }

  /* 按钮组：横向排布 */
  .action-bar {
    display: flex;
    gap: 8px;
    margin-top: 14px;
  }
</style>

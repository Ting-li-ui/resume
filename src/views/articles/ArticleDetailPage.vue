<script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useArticleStore } from '../../store/articles.js'

  // useRoute 拿到当前路由对象，route.params.id 就是路由表中 :id 动态参数
  const route = useRoute()
  // useRouter 拿到路由器实例，用于编程式导航（不依赖 <RouterLink> 的跳转）
  const router = useRouter()

  const articleStore = useArticleStore()

  // 通过 Store 的 getter 按动态参数查找文章：
  // getById 是「函数形式」的 getter，需要在 computed 里调用并依赖 params.id，
  // 这样同一页面切换不同文章 id 时也能正确响应
  const article = computed(() => articleStore.getById(route.params.id))

  // ---------- 编程式导航 ----------
  function goList() {
    router.push({ name: 'article-list' })
  }

  function goBack() {
    router.back()
  }

  function goHome() {
    router.push({ name: 'home' })
  }
</script>

<template>
  <div>
    <!-- 详情正常展示：根据 :id 找到对应文章。
         实验九改造：外层改用 el-card；分类 / 日期改用 el-descriptions；
         摘要与正文之间用 el-divider 分割线；操作按钮改用 el-button -->
    <el-card v-if="article">
      <template #header>
        <h2 class="detail-title">{{ article.title }}</h2>
      </template>

      <el-descriptions :column="2">
        <el-descriptions-item label="分类">
          <el-tag size="small" type="success">{{ article.category }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发布日期">{{ article.date }}</el-descriptions-item>
      </el-descriptions>

      <p class="detail-summary">{{ article.summary }}</p>

      <!-- el-divider 分割线：把摘要与正文区分开 -->
      <el-divider content-position="left">正文</el-divider>

      <!-- white-space: pre-line 让 content 中的换行符正常显示 -->
      <div class="detail-content">{{ article.content }}</div>

      <!-- 编程式导航按钮组：返回列表（push） / 返回上一页（back） -->
      <div class="action-bar">
        <el-button type="primary" @click="goList">返回文章列表</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </el-card>

    <!-- 无效详情地址处理：/articles/999 这类不存在的 id，用 el-result 结果组件反馈 -->
    <el-result v-else icon="warning" title="文章不存在" :sub-title="`没有找到编号为 ${route.params.id} 的文章，可能已删除或地址有误。`">
      <template #extra>
        <el-button type="primary" @click="goList">返回文章列表</el-button>
        <el-button @click="goHome">回到首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
  .detail-title {
    margin: 0;
  }

  .detail-summary {
    margin: 16px 0;
    font-weight: 600;
  }

  .detail-content {
    line-height: 1.8;
    white-space: pre-line;
  }

  /* 按钮组：横向排布 */
  .action-bar {
    display: flex;
    gap: 8px;
    margin-top: 14px;
  }
</style>

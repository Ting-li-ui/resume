<script setup>
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  // 返回上一页：历史栈有记录就后退，否则退回首页
  function goBack() {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push({ name: 'home' })
    }
  }
</script>

<template>
  <!-- 404 兜底页：实验九改造，改用 el-result 结果组件，
       status="404" 自带 404 插画与标题排版 -->
  <el-result status="404" title="页面走丢了" :sub-title="`你访问的地址 ${route.fullPath} 不存在，请检查地址是否正确。`">
    <template #extra>
      <RouterLink :to="{ name: 'home' }">
        <el-button type="primary">返回首页</el-button>
      </RouterLink>
      <el-button @click="goBack">返回上一页</el-button>
    </template>
  </el-result>
</template>

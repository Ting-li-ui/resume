<script setup>
  import { computed } from 'vue'
  defineProps({
    user: {
      type: Object,
      required: true
    }
  })

  const year = computed(() => new Date().getFullYear())

</script>

<template>
  <footer class="page-footer">
    <p>© {{ year }} {{ user.name }} · {{ user.major }} · 学号 {{ user.studentId }}</p>
    <p>{{ user.motto }}</p>

    <!-- el-backtop 返回顶部：固定在右下角的圆形悬浮按钮，自带淡入淡出 -->
    <el-backtop :right="24" :bottom="24" />
  </footer>
</template>

<style scoped>
  .page-footer {
    padding: 16px;
    text-align: center;
    color: var(--muted-color);
    background-color: var(--card-bg);
    border-top: 1px solid var(--border-color);
  }

  .page-footer p {
    margin: 4px 0;
  }
</style>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { Search, Star } from '@element-plus/icons-vue'

  // 接收父组件传入的技能列表
  const props = defineProps({
    skills: {
      type: Array,
      required: true
    }
  })

  const keyword = ref('') // 搜索关键词

  // 根据关键词筛选技能：按名称或类型匹配
  const filteredSkills = computed(() => {
    const kw = keyword.value.trim()
    if (kw === '') {
      return props.skills
    }
    return props.skills.filter(skill =>
      skill.name.includes(kw) || skill.type.includes(kw)
    )
  })

  // 掌握程度映射为进度条百分比：store 里存的是文字等级（了解 / 学习中 / 掌握 / 熟练），
  // 这里换算成 0-100 的数值供 el-progress 展示
  const LEVEL_PERCENT = { '了解': 25, '学习中': 45, '掌握': 70, '熟练': 90 }

  function levelPercent(level) {
    return LEVEL_PERCENT[level] ?? 50
  }

  // 监听搜索关键词的变化
  watch(keyword, (newValue, oldValue) => {
    console.log(`搜索关键词变化："${oldValue}" -> "${newValue}"`)
  })
</script>

<template>
  <!-- 卡片二：技能/兴趣列表 + 关键词搜索
       外层改用 el-card；搜索框改用 el-input（带搜索图标、可清空）；
       每条技能用 el-tag 展示类型，掌握程度用 el-progress 进度条可视化；
       无匹配结果时用 el-empty 空状态组件 -->
  <el-card>
    <template #header>
      <div class="card-head">
        <span class="card-icon"><el-icon><Star /></el-icon></span>
        <h2 class="card-title">技能 / 兴趣</h2>
      </div>
    </template>

    <!-- el-input 搜索框：prefix-icon 放大镜图标，clearable 一键清空 -->
    <el-input v-model="keyword" placeholder="输入关键词搜索技能，例如：前端" clearable :prefix-icon="Search" />
    <p class="hint">当前关键词：{{ keyword || '（空）' }}</p>

    <!-- v-for 渲染筛选结果，:key 保证列表更新效率 -->
    <div v-if="filteredSkills.length > 0" class="skill-list">
      <div v-for="skill in filteredSkills" :key="skill.id" class="skill-row">
        <div class="skill-head">
          <strong>{{ skill.name }}</strong>
          <!-- el-tag 标签组件：技能类型，success 类型绿色系与主题一致 -->
          <el-tag size="small" type="success">{{ skill.type }}</el-tag>
        </div>
        <!-- el-progress 进度条：把文字等级换算成百分比，直观展示掌握程度 -->
        <el-progress :percentage="levelPercent(skill.level)" :stroke-width="8">
          <span class="skill-level">掌握程度：{{ skill.level }}</span>
        </el-progress>
      </div>
    </div>
    <el-empty v-else description="没有找到匹配的技能，换个关键词试试" :image-size="60" />
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

  .hint {
    color: var(--muted-color);
    font-size: 14px;
  }

  /* 技能列表：逐条上下排列 */
  .skill-list {
    margin-top: 10px;
  }

  .skill-row {
    padding: 10px 0;
    border-top: 1px solid var(--border-color);
  }

  .skill-row:first-child {
    border-top: none;
  }

  .skill-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .skill-level {
    font-size: 12px;
    color: var(--muted-color);
  }
</style>

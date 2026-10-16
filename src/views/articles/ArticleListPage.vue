<script setup>
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useArticleStore } from '../../store/articles.js'

  // ---------- 文章列表（公开页面，无需登录） ----------
  // 文章数据来自 article Store，用 storeToRefs 解构：
  //   sortedArticles —— getter，解构后依然是响应式 ref（后台增删文章后这里自动更新）
  //   categories    —— getter，去重后的分类，用于筛选按钮
  // 注意：如果不用 storeToRefs 而直接解构 store.sortedArticles，
  // 拿到的是「解构那一刻的普通数组」，会丢失响应式！
  const articleStore = useArticleStore()
  const { sortedArticles, categories } = storeToRefs(articleStore)

  // 当前筛选分类：空字符串表示全部
  const activeCategory = ref('')

  // 按分类过滤：计算属性依赖 activeCategory 与 sortedArticles，
  // 任意一个变化都会自动重算
  const filteredArticles = computed(() =>
    activeCategory.value
      ? sortedArticles.value.filter((article) => article.category === activeCategory.value)
      : sortedArticles.value
  )
</script>

<template>
  <!-- 文章列表（嵌套子路由一）
       实验十改造：分类筛选改用 el-radio-group / el-radio-button 单选按钮组，
       文章条目改用 el-list / el-list-item 列表组件展示 -->
  <div>
    <!-- 分类筛选：radio-button 形式，选中的自动高亮；空字符串代表「全部」 -->
    <div class="filter-bar">
      <el-radio-group v-model="activeCategory">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <p class="list-count">共 {{ filteredArticles.length }} 篇文章</p>

    <!-- 空状态：分类下没有文章，用 el-empty 占位 -->
    <el-empty
      v-if="filteredArticles.length === 0"
      :description="activeCategory ? `「${activeCategory}」分类下暂无文章` : '暂无文章，登录后可在后台管理中添加'"
    />

    <!-- 文章列表：el-list 列表组件包裹 el-list-item，
         每条是标题（链接到详情）、分类徽标（el-tag）、日期、摘要 -->
    <el-card v-else>
      <el-list>
        <el-list-item v-for="article in filteredArticles" :key="article.id" class="article-item">
          <div class="article-main">
            <div class="article-head">
              <h2 class="article-title">
                <RouterLink :to="{ name: 'article-detail', params: { id: article.id } }">
                  {{ article.title }}
                </RouterLink>
              </h2>
              <!-- el-tag 标签组件：文章分类徽标 -->
              <el-tag size="small" type="success">{{ article.category }}</el-tag>
            </div>
            <p class="article-date">{{ article.date }}</p>
            <p class="article-summary">{{ article.summary }}</p>
          </div>
        </el-list-item>
      </el-list>
    </el-card>
  </div>
</template>

<style scoped>
  /* 筛选按钮组：与列表拉开间距 */
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
  }

  .list-count {
    margin: 0 0 12px;
    color: var(--muted-color);
    font-size: 14px;
  }

  .article-item {
    padding: 12px 0;
  }

  .article-main {
    flex: 1;
  }

  .article-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .article-title {
    margin: 0;
    font-size: 18px;
  }

  .article-title a {
    color: var(--text-color);
    text-decoration: none;
    transition: color 0.2s;
  }

  .article-title a:hover {
    color: var(--primary-color);
  }

  .article-date {
    margin: 6px 0;
    color: var(--muted-color);
    font-size: 13px;
  }

  .article-summary {
    margin: 0;
    color: var(--muted-color);
    font-size: 14px;
    line-height: 1.6;
  }
</style>

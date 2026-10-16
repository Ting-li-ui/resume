<script setup>
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { useArticleStore } from '../../store/articles.js'

  const router = useRouter()

  // ---------- 文章 Store ----------
  // storeToRefs 解构出响应式 ref：模板里自动解包（articles.length），脚本里写 .value。
  // actions（addArticle / updateArticle / removeArticle）不能解构，直接从 store 上调用
  const articleStore = useArticleStore()
  const { articles } = storeToRefs(articleStore)

  // ---------- 对话框与表单状态 ----------
  // 实验十改造：表单改用 el-dialog 模态对话框 + el-form 规则校验
  const dialogVisible = ref(false) // 对话框是否显示
  const editingId = ref(null) // null 表示新增，有值表示正在编辑的文章 id
  const form = ref({ title: '', category: '学习笔记', date: '', summary: '', content: '' })
  const formRef = ref(null)

  // 分类下拉选项（el-select 使用；文章列表页的筛选按钮也由 Store getter 动态生成）
  const categoryOptions = ['学习笔记', '项目总结', '技术分享', '生活随笔']

  // el-form 规则校验：标题 / 日期 / 摘要 / 正文必填。
  // 日期交给 el-date-picker 选择（value-format 输出 YYYY.MM.DD 字符串，
  // 与 Store 中既有数据的日期格式一致，排序 getter 的字符串比较仍然有效）
  const rules = {
    title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }],
    date: [{ required: true, message: '请选择发布日期', trigger: 'change' }],
    summary: [{ required: true, message: '文章摘要不能为空', trigger: 'blur' }],
    content: [{ required: true, message: '文章内容不能为空', trigger: 'blur' }]
  }

  // ---------- 表单操作 ----------
  // 打开新增对话框：清空所有字段
  function startAdd() {
    editingId.value = null
    form.value = { title: '', category: '学习笔记', date: '', summary: '', content: '' }
    dialogVisible.value = true
  }

  // 打开编辑对话框：用已有文章数据预填
  function startEdit(article) {
    editingId.value = article.id
    form.value = {
      title: article.title,
      category: article.category,
      date: article.date,
      summary: article.summary,
      content: article.content
    }
    dialogVisible.value = true
  }

  // 保存：新增与编辑共用，el-form 校验通过后调用 Store 的 action 写回共享状态
  async function handleSave() {
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) {
      ElMessage.warning('请先修正表单中的错误')
      return
    }
    const data = {
      ...form.value,
      title: form.value.title.trim(),
      summary: form.value.summary.trim(),
      content: form.value.content.trim()
    }
    if (editingId.value === null) {
      articleStore.addArticle(data)
      ElMessage.success('新增成功，文章列表页已同步更新')
    } else {
      articleStore.updateArticle(editingId.value, data)
      ElMessage.success('修改已保存')
    }
    dialogVisible.value = false
  }

  // 取消修改：清空表单状态并关闭对话框
  function handleCancel() {
    dialogVisible.value = false
  }

  // 删除：el-popconfirm 气泡二次确认（替代 window.confirm），确认后调用 Store 的 action 移除
  function handleDelete(article) {
    articleStore.removeArticle(article.id)
    ElMessage.success('文章已删除')
  }

  // 查看：跳转到公开的文章详情页（跨页面共享 Store 状态，详情页实时看到最新内容）
  function goDetail(id) {
    router.push({ name: 'article-detail', params: { id } })
  }
</script>

<template>
  <!-- 文章管理：实验十改造
       el-card + el-table 表格展示列表；
       el-dialog 模态对话框承载新增 / 编辑的 el-form 表单
       （分类 el-select、日期 el-date-picker）；
       删除用 el-popconfirm 气泡确认；反馈统一用 el-message -->
  <el-card>
    <template #header>
      <div class="list-head">
        <h2 class="list-title">文章列表（共 {{ articles.length }} 篇）</h2>
        <el-button type="primary" @click="startAdd">新增文章</el-button>
      </div>
    </template>

    <!-- el-table 表格组件：empty-text 定制空数据提示 -->
    <el-table :data="articles" empty-text="暂无文章，点击「新增文章」发布第一篇">
      <el-table-column prop="title" label="文章标题" min-width="200" show-overflow-tooltip />
      <el-table-column label="分类" width="120">
        <template #default="{ row }">
          <el-tag size="small" type="success">{{ row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="发布日期" width="120" />
      <el-table-column label="操作" width="230">
        <template #default="{ row }">
          <el-button size="small" @click="goDetail(row.id)">查看</el-button>
          <el-button size="small" type="primary" @click="startEdit(row)">编辑</el-button>
          <!-- el-popconfirm 气泡确认框：悬浮在删除按钮上，确认后执行 handleDelete -->
          <el-popconfirm
            :title="`确定删除文章「${row.title}」吗？删除后文章列表页将同步移除。`"
            confirm-button-text="删除"
            cancel-button-text="取消"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- el-dialog 模态对话框：新增 / 编辑文章共用。
       destroy-on-close：关闭时销毁表单内容，下次打开错误状态自动清空 -->
  <el-dialog
    v-model="dialogVisible"
    :title="editingId === null ? '新增文章' : '编辑文章'"
    width="600px"
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model.trim="form.title" placeholder="如：Pinia 状态管理入门" />
      </el-form-item>

      <el-form-item label="文章分类">
        <!-- el-select 下拉选择框：分类选项固定四种 -->
        <el-select v-model="form.category" placeholder="请选择文章分类">
          <el-option v-for="opt in categoryOptions" :key="opt" :label="opt" :value="opt" />
        </el-select>
      </el-form-item>

      <el-form-item label="发布日期" prop="date">
        <!-- el-date-picker 日期选择器：value-format 指定输出 YYYY.MM.DD 字符串，
             与 Store 既有数据格式保持一致 -->
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="请选择发布日期"
          value-format="YYYY.MM.DD"
        />
      </el-form-item>

      <el-form-item label="文章摘要" prop="summary">
        <el-input v-model.trim="form.summary" type="textarea" :rows="2" placeholder="一句话概括文章内容" />
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <el-input v-model.trim="form.content" type="textarea" :rows="6" placeholder="正文内容，段落之间用空行分隔" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
  .list-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .list-title {
    margin: 0;
  }
</style>

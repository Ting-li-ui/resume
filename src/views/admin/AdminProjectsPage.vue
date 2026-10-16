<script setup>
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { useProjectStore } from '../../store/projects.js'

  const router = useRouter()

  // ---------- 项目 Store ----------
  // storeToRefs 解构出响应式 projects（表格数据源），
  // actions（addProject / updateProject / removeProject）直接从 store 上调用
  const projectStore = useProjectStore()
  const { projects } = storeToRefs(projectStore)

  // ---------- 对话框与表单状态 ----------
  // 实验十改造：原来「表单与列表互斥显示」改为 el-dialog 模态对话框，
  // 新增 / 编辑共用同一个弹窗表单
  const dialogVisible = ref(false) // 对话框是否显示
  const editingId = ref(null) // null 表示新增，有值表示正在编辑的项目 id
  // form.timeline 是「文本形式」的时间线：每行一个节点，格式「时间 | 标题 | 描述」，
  // 保存时解析成数组写回 Store（见 handleSave）
  const form = ref({ name: '', time: '', desc: '', intro: '', tags: '', link: '', timeline: '' })
  const formRef = ref(null)

  // el-form 规则校验：必填字段 + 地址格式
  const rules = {
    name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
    time: [{ required: true, message: '项目时间不能为空', trigger: 'blur' }],
    desc: [{ required: true, message: '项目描述不能为空', trigger: 'blur' }],
    intro: [{ required: true, message: '详细介绍不能为空', trigger: 'blur' }],
    tags: [
      {
        validator: (rule, value, callback) => {
          // 标签支持逗号、顿号、空格分隔，拆分后至少一个
          const tags = value.split(/[、,，\s]+/).filter(Boolean)
          tags.length === 0 ? callback(new Error('至少填写一个技术标签（用逗号或顿号分隔）')) : callback()
        },
        trigger: 'blur'
      }
    ],
    link: [
      {
        pattern: /^https?:\/\/.+/,
        message: '项目地址需以 http:// 或 https:// 开头',
        trigger: 'blur'
      }
    ]
  }

  // ---------- 表单操作 ----------
  // 打开新增对话框：清空所有字段
  function startAdd() {
    editingId.value = null
    form.value = { name: '', time: '', desc: '', intro: '', tags: '', link: '', timeline: '' }
    dialogVisible.value = true
  }

  // 打开编辑对话框：用已有项目数据预填（标签数组转成顿号分隔的字符串，
  // 时间线数组转成「时间 | 标题 | 描述」的多行文本；旧数据没有 timeline 字段时用空串兜底）
  function startEdit(project) {
    editingId.value = project.id
    form.value = {
      name: project.name,
      time: project.time,
      desc: project.desc,
      intro: project.intro,
      tags: project.tags.join('、'),
      link: project.link,
      timeline: (project.timeline ?? [])
        .map((node) => `${node.time} | ${node.title} | ${node.desc}`)
        .join('\n')
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
    const tags = form.value.tags.split(/[、,，\s]+/).filter(Boolean)
    // 时间线文本解析成节点数组：按行拆分、跳过空行，
    // 每行按竖线（中英文均可）拆出 时间 / 标题 / 描述
    const timeline = form.value.timeline
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [time = '', title = '', desc = ''] = line.split(/[|｜]/).map((part) => part.trim())
        return { time, title, desc }
      })
    const data = { ...form.value, tags, timeline, link: form.value.link.trim() || '#' }
    if (editingId.value === null) {
      projectStore.addProject(data)
      ElMessage.success('新增成功，项目列表已同步更新')
    } else {
      projectStore.updateProject(editingId.value, data)
      ElMessage.success('修改已保存')
    }
    dialogVisible.value = false
  }

  // 取消修改：清空表单状态并关闭对话框
  function handleCancel() {
    dialogVisible.value = false
  }

  // 删除：el-popconfirm 气泡二次确认（替代 window.confirm），确认后调用 Store 的 action 移除
  function handleDelete(project) {
    projectStore.removeProject(project.id)
    ElMessage.success('项目已删除')
  }

  // 查看详情：跳转到公开的项目详情页
  function goDetail(id) {
    router.push({ name: 'project-detail', params: { id } })
  }
</script>

<template>
  <!-- 项目管理：实验十改造
       el-card + el-table 表格展示列表；
       el-dialog 模态对话框承载新增 / 编辑的 el-form 表单；
       删除用 el-popconfirm 气泡确认；反馈统一用 el-message -->
  <el-card>
    <template #header>
      <div class="list-head">
        <h2 class="list-title">项目列表（共 {{ projects.length }} 个）</h2>
        <el-button type="primary" @click="startAdd">新增项目</el-button>
      </div>
    </template>

    <!-- el-table 表格组件：empty-text 定制空数据提示 -->
    <el-table :data="projects" empty-text="暂无项目，点击「新增项目」添加第一个作品">
      <el-table-column prop="name" label="项目名称" min-width="140" />
      <el-table-column prop="time" label="项目时间" min-width="130" />
      <el-table-column label="技术标签" min-width="160">
        <template #default="{ row }">
          <!-- 标签列：每个标签渲染成一个 el-tag -->
          <el-tag v-for="tag in row.tags" :key="tag" size="small" class="tag-item">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230">
        <template #default="{ row }">
          <el-button size="small" @click="goDetail(row.id)">查看</el-button>
          <el-button size="small" type="primary" @click="startEdit(row)">编辑</el-button>
          <!-- el-popconfirm 气泡确认框：悬浮在删除按钮上，确认后执行 handleDelete -->
          <el-popconfirm
            :title="`确定删除「${row.name}」吗？删除后首页与列表页将同步移除。`"
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

  <!-- el-dialog 模态对话框：新增 / 编辑项目共用，标题随 editingId 切换。
       destroy-on-close：关闭时销毁表单内容，下次打开错误状态自动清空 -->
  <el-dialog
    v-model="dialogVisible"
    :title="editingId === null ? '新增项目' : '编辑项目'"
    width="520px"
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model.trim="form.name" placeholder="如：个人博客网站" />
      </el-form-item>

      <el-form-item label="项目时间" prop="time">
        <el-input v-model.trim="form.time" placeholder="如：2026.09 - 2026.11" />
      </el-form-item>

      <el-form-item label="项目描述" prop="desc">
        <el-input v-model.trim="form.desc" type="textarea" :rows="2" placeholder="一句话描述项目" />
      </el-form-item>

      <el-form-item label="详细介绍" prop="intro">
        <el-input v-model.trim="form.intro" type="textarea" :rows="3" placeholder="项目背景、功能与实现细节" />
      </el-form-item>

      <el-form-item label="技术标签" prop="tags">
        <el-input v-model.trim="form.tags" placeholder="如：Vue 3、Vite、CSS（逗号或顿号分隔）" />
      </el-form-item>

      <!-- 开发历程（选填，不参与校验）：多行文本，每行一个时间节点 -->
      <el-form-item label="开发历程">
        <el-input
          v-model="form.timeline"
          type="textarea"
          :rows="4"
          placeholder="每行一个节点，格式：时间 | 标题 | 描述&#10;例如：2026.09 | 需求分析 | 确定功能范围，绘制原型"
        />
      </el-form-item>

      <el-form-item label="项目地址" prop="link">
        <el-input v-model.trim="form.link" placeholder="如：https://github.com/xxx（选填）" />
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

  /* 表格内标签之间的间距 */
  .tag-item {
    margin: 0 6px 6px 0;
  }
</style>

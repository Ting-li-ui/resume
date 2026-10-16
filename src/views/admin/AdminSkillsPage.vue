<script setup>
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { ElMessage } from 'element-plus'
  import { useSkillStore } from '../../store/skills.js'

  // ---------- 技能 Store ----------
  // storeToRefs 解构出响应式 skills（表格数据源），actions 从 store 上调用
  const skillStore = useSkillStore()
  const { skills } = storeToRefs(skillStore)

  // ---------- 对话框与表单状态 ----------
  // 实验十改造：表单改用 el-dialog 模态对话框 + el-form 规则校验
  const dialogVisible = ref(false) // 对话框是否显示
  const editingId = ref(null) // null 表示新增，有值表示正在编辑的技能 id
  const form = ref({ name: '', type: '前端', level: '了解' })
  const formRef = ref(null)

  // 类型与掌握程度的下拉选项（el-select 使用）
  const typeOptions = ['前端', '后端', '其他']
  const levelOptions = ['了解', '掌握', '熟练', '学习中']

  // el-form 规则校验：名称必填且不能与已有技能重名
  const rules = {
    name: [
      { required: true, message: '技能名称不能为空', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          const duplicated = skills.value.some(
            (skill) => skill.name === value.trim() && skill.id !== editingId.value
          )
          duplicated ? callback(new Error('该技能已存在，请勿重复添加')) : callback()
        },
        trigger: 'blur'
      }
    ]
  }

  // ---------- 表单操作 ----------
  // 打开新增对话框：恢复默认值
  function startAdd() {
    editingId.value = null
    form.value = { name: '', type: '前端', level: '了解' }
    dialogVisible.value = true
  }

  // 打开编辑对话框：用已有技能数据预填
  function startEdit(skill) {
    editingId.value = skill.id
    form.value = { name: skill.name, type: skill.type, level: skill.level }
    dialogVisible.value = true
  }

  // 保存：新增与编辑共用，el-form 校验通过后调用 Store 的 action 写回共享状态
  async function handleSave() {
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) {
      ElMessage.warning('请先修正表单中的错误')
      return
    }
    const data = { ...form.value, name: form.value.name.trim() }
    if (editingId.value === null) {
      skillStore.addSkill(data)
      ElMessage.success('新增成功，首页技能卡片已同步更新')
    } else {
      skillStore.updateSkill(editingId.value, data)
      ElMessage.success('修改已保存')
    }
    dialogVisible.value = false
  }

  // 取消修改：清空表单状态并关闭对话框
  function handleCancel() {
    dialogVisible.value = false
  }

  // 删除：el-popconfirm 气泡二次确认（替代 window.confirm），确认后调用 Store 的 action 移除
  function handleDelete(skill) {
    skillStore.removeSkill(skill.id)
    ElMessage.success('技能已删除')
  }
</script>

<template>
  <!-- 技能管理：实验十改造
       el-card + el-table 表格展示列表；
       el-dialog 模态对话框承载新增 / 编辑的 el-form 表单（类型 / 程度用 el-select 下拉）；
       删除用 el-popconfirm 气泡确认；反馈统一用 el-message -->
  <el-card>
    <template #header>
      <div class="list-head">
        <h2 class="list-title">技能列表（共 {{ skills.length }} 个）</h2>
        <el-button type="primary" @click="startAdd">新增技能</el-button>
      </div>
    </template>

    <!-- el-table 表格组件：empty-text 定制空数据提示 -->
    <el-table :data="skills" empty-text="暂无技能，点击「新增技能」添加第一个技能">
      <el-table-column prop="name" label="技能名称" min-width="140" />
      <el-table-column label="技能类型" width="120">
        <template #default="{ row }">
          <el-tag size="small" type="success">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="掌握程度" width="140" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="startEdit(row)">编辑</el-button>
          <!-- el-popconfirm 气泡确认框：悬浮在删除按钮上，确认后执行 handleDelete -->
          <el-popconfirm
            :title="`确定删除技能「${row.name}」吗？删除后首页技能卡片将同步移除。`"
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

  <!-- el-dialog 模态对话框：新增 / 编辑技能共用。
       destroy-on-close：关闭时销毁表单内容，下次打开错误状态自动清空 -->
  <el-dialog
    v-model="dialogVisible"
    :title="editingId === null ? '新增技能' : '编辑技能'"
    width="480px"
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="技能名称" prop="name">
        <el-input v-model.trim="form.name" placeholder="如：Vue 3" />
      </el-form-item>

      <el-form-item label="技能类型">
        <!-- el-select 下拉选择框：类型选项固定三种 -->
        <el-select v-model="form.type" placeholder="请选择技能类型">
          <el-option v-for="opt in typeOptions" :key="opt" :label="opt" :value="opt" />
        </el-select>
      </el-form-item>

      <el-form-item label="掌握程度">
        <!-- el-select 下拉选择框：程度选项固定四种 -->
        <el-select v-model="form.level" placeholder="请选择掌握程度">
          <el-option v-for="opt in levelOptions" :key="opt" :label="opt" :value="opt" />
        </el-select>
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

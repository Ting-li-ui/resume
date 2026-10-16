<script setup>
  import { ref } from 'vue'
  import { User } from '@element-plus/icons-vue'

  const props = defineProps({
    user: {
      type: Object,
      required: true
    },
    // 是否允许编辑：普通访客只读浏览，登录后才显示修改入口
    canEdit: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['save'])

  const isEditing = ref(false)
  const editForm = ref({
    name: '',
    studentId: '',
    major: '',
    avatar: '',
    intro: ''
  })

  // 编辑表单的 el-form 模板引用：保存时调用 validate() 做规则校验
  const formRef = ref(null)

  // 表单校验规则：姓名与学号必填，学号限制 6-12 位数字。
  // el-form 会在每个字段失焦 / 校验触发时自动执行对应规则
  const rules = {
    name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    studentId: [
      { required: true, message: '学号不能为空', trigger: 'blur' },
      { pattern: /^\d{6,12}$/, message: '学号需为 6-12 位数字', trigger: 'blur' }
    ]
  }

  // 详情是否展开
  const showDetail = ref(false)


  // 进入编辑模式：把当前信息拷贝到表单
  function startEdit() {
    editForm.value = { ...props.user }
    isEditing.value = true
  }

  // 保存修改：先走 el-form 规则校验，通过后把表单内容通过事件交给父组件
  async function saveEdit() {
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) {
      return
    }
    emit('save', { ...editForm.value })
    isEditing.value = false
  }

  // 取消编辑
  function cancelEdit() {
    isEditing.value = false
  }
</script>

<template>
  <!-- 卡片一：个人基本信息（查看模式 / 编辑模式）
       外层改用 el-card 卡片组件，标题放入 #header 具名插槽；
       查看模式用 el-avatar（头像）+ el-descriptions（描述列表）展示基本信息，
       「更多信息」用 el-collapse 折叠面板收纳 -->
  <el-card>
    <template #header>
      <div class="card-head">
        <span class="card-icon"><el-icon><User /></el-icon></span>
        <h2 class="card-title">{{ isEditing ? '编辑个人信息' : '个人名片' }}</h2>
      </div>
    </template>

    <!-- 查看模式：v-if 控制 -->
    <div v-if="!isEditing" class="profile-top">
      <el-avatar class="avatar" :size="96" :src="user.avatar" :alt="user.name" />
      <!-- el-descriptions 描述列表：label 居右，逐行展示姓名 / 学号 / 专业班级 / 个人简介 -->
      <el-descriptions class="profile-desc" :column="1" label-width="80px">
        <el-descriptions-item label="姓名">{{ user.name }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ user.studentId }}</el-descriptions-item>
        <el-descriptions-item label="专业班级">{{ user.major }}</el-descriptions-item>
        <el-descriptions-item label="个人简介">{{ user.intro }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 编辑模式：v-if 与查看模式互斥，el-form 表单 + rules 规则校验 -->
    <el-form v-if="isEditing" ref="formRef" :model="editForm" :rules="rules" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model.trim="editForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="学号" prop="studentId">
        <el-input v-model.trim="editForm.studentId" placeholder="请输入学号" />
      </el-form-item>
      <el-form-item label="专业班级">
        <el-input v-model.trim="editForm.major" placeholder="请输入专业班级" />
      </el-form-item>
      <el-form-item label="头像">
        <el-avatar class="avatar avatar-edit" :size="72" :src="editForm.avatar" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input v-model.trim="editForm.intro" type="textarea" :rows="3" placeholder="请输入个人简介" />
      </el-form-item>
    </el-form>

    <!-- 底部按钮区：查看模式是操作按钮并排，编辑模式是保存/取消 -->
    <div v-if="!isEditing">
      <div class="action-bar">
        <!-- 修改入口与访客浏览区分：只有登录用户（canEdit）才能看到「编辑资料」按钮 -->
        <el-button v-if="canEdit" type="primary" @click="startEdit">编辑资料</el-button>
        <el-button @click="showDetail = !showDetail">
          {{ showDetail ? '收起更多信息' : '展开更多信息' }}
        </el-button>
      </div>
      <p v-if="!canEdit" class="edit-hint">登录后可编辑资料，或在「后台管理」中统一修改</p>

      <!-- el-collapse 折叠面板：收纳兴趣爱好 / 座右铭 / 详细自我介绍，
           展开收起动画由组件自带，替代原来 v-show 的手动切换 -->
      <el-collapse v-show="showDetail" class="detail-collapse">
        <el-collapse-item title="更多信息" name="more">
          <p>兴趣爱好：{{ user.hobby }}</p>
          <p>座右铭：{{ user.motto }}</p>
          <p>详细自我介绍：{{ user.detailIntro }}</p>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-else class="action-bar">
      <el-button type="primary" @click="saveEdit">保存</el-button>
      <el-button @click="cancelEdit">取消</el-button>
    </div>
  </el-card>
</template>

<style scoped>
  .card-head {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* 标题图标：主题绿浅色圆角底托 + 绿色图标。
     light-9 变量在暗色主题（html.dark）下已被覆盖为深绿，两种主题都协调 */
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

  .profile-top {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  /* el-descriptions 在窄屏下换行排列 */
  .profile-desc {
    flex: 1;
    min-width: 220px;
  }


  /* 底部操作按钮：横向并排 */
  .action-bar {
    display: flex;
    gap: 8px;
    margin-top: 14px;
  }

  /* 未登录时的提示文字 */
  .edit-hint {
    margin: 10px 0 0;
    color: var(--muted-color);
    font-size: 13px;
  }

  /* 折叠面板与按钮区的间距 */
  .detail-collapse {
    margin-top: 12px;
  }

  .detail-collapse p {
    margin: 6px 0;
  }
</style>

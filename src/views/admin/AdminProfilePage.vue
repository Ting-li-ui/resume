<script setup>
  import { reactive, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '../../store/user.js'

  const userStore = useUserStore()
  // storeToRefs 解构出响应式 user（模板里展示头像用），actions 从 store 上直接调用
  const { user } = storeToRefs(userStore)

  // ---------- 表单与提示 ----------
  // 表单用 reactive 拷贝一份当前数据，保存前不影响共享状态
  const form = reactive({ ...userStore.user })
  const formRef = ref(null)

  // el-form 规则校验：姓名必填、学号 6-12 位数字、简介必填
  const rules = {
    name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    studentId: [
      { required: true, message: '学号不能为空', trigger: 'blur' },
      { pattern: /^\d{6,12}$/, message: '学号需为 6-12 位数字', trigger: 'blur' }
    ],
    intro: [{ required: true, message: '个人简介不能为空', trigger: 'blur' }]
  }

  // 保存：el-form 规则校验通过后调用 user Store 的 action 写回共享状态，
  // 首页与页脚同步更新，且持久化到 localStorage
  async function handleSave() {
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) {
      ElMessage.warning('请先修正表单中的错误')
      return
    }
    userStore.updateUser({ ...form })
    ElMessage.success('保存成功，首页与页脚信息已同步更新')
  }

  // 取消修改：把表单还原为当前已保存的数据
  function handleCancel() {
    Object.assign(form, userStore.user)
    ElMessage.info('已取消修改，表单已还原')
  }
</script>

<template>
  <!-- 个人简介管理：实验十改造，改用 el-card + el-form（rules 规则校验），
       操作反馈改用 el-message 消息提示 -->
  <el-card>
    <template #header>
      <h2 class="form-title">个人简介管理</h2>
    </template>
    <p class="form-tip">修改保存后，首页个人卡片与页面底部信息会同步变化。</p>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="头像">
        <!-- el-avatar 头像组件：演示环境不支持更换，仅展示 -->
        <el-avatar :size="72" :src="user.avatar" :alt="user.name" />
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入姓名" />
      </el-form-item>

      <el-form-item label="学号" prop="studentId">
        <el-input v-model.trim="form.studentId" placeholder="6-12 位数字" />
      </el-form-item>

      <el-form-item label="专业班级">
        <el-input v-model.trim="form.major" placeholder="如：24计科1班" />
      </el-form-item>

      <el-form-item label="个人简介" prop="intro">
        <el-input v-model.trim="form.intro" type="textarea" :rows="2" placeholder="一句话介绍自己" />
      </el-form-item>

      <el-form-item label="兴趣爱好">
        <el-input v-model.trim="form.hobby" placeholder="如：跑步、听音乐" />
      </el-form-item>

      <el-form-item label="座右铭">
        <el-input v-model.trim="form.motto" placeholder="如：学而不思则罔" />
      </el-form-item>

      <el-form-item label="详细自我介绍">
        <el-input v-model.trim="form.detailIntro" type="textarea" :rows="3" placeholder="更详细的介绍" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSave">保存修改</el-button>
        <el-button @click="handleCancel">取消修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
  .form-title {
    margin: 0;
  }

  .form-tip {
    margin: 0 0 14px;
    color: var(--muted-color);
    font-size: 14px;
  }
</style>

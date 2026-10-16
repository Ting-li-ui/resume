<script setup>
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { useAuthStore } from '../../store/auth.js'

  const route = useRoute()
  const router = useRouter()

  // ---------- 表单局部状态 ----------
  const form = ref({ username: '', password: '' })
  const error = ref('')
  const formRef = ref(null)

  // el-form 规则校验：两个字段都必填
  const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }

  // ---------- auth Store ----------
  // storeToRefs 解构 state 与 getter：模板里用 isLoggedIn / currentUser 展示登录状态；
  // 注意把 Store 的 username 取别名 currentUser，避免与表单输入框的 username 重名
  const authStore = useAuthStore()
  const { isLoggedIn, username: currentUser } = storeToRefs(authStore)

  // 守卫拦截时会以 ?redirect=/admin 的形式把原地址带过来，登录成功后跳回原页面
  const redirectTarget = computed(() => route.query.redirect || { name: 'home' })

  async function handleLogin() {
    // 先走 el-form 的规则校验，不通过直接返回（错误显示在输入框下方）
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) {
      return
    }
    error.value = ''
    // 这里用固定密码做演示：真实项目中密码要交给后端校验
    if (form.value.password !== '123456') {
      error.value = '密码错误（演示密码：123456）'
      return
    }
    // 调用 action 修改登录状态：状态写入 Store 并同步 localStorage
    authStore.login(form.value.username.trim())
    ElMessage.success(`欢迎回来，${form.value.username.trim()}！`)
    router.push(redirectTarget.value)
  }

  function handleLogout() {
    authStore.logout()
    ElMessage.info('已退出登录')
    router.push({ name: 'home' })
  }
</script>

<template>
  <el-card class="login-card">
    <!-- 已登录状态：用 el-result 结果组件展示当前用户并提供进入后台 / 退出登录 -->
    <el-result v-if="isLoggedIn" icon="success" title="已登录" :sub-title="`当前用户：${currentUser}`">
      <template #extra>
        <RouterLink :to="{ name: 'admin' }">
          <el-button type="primary">进入后台管理</el-button>
        </RouterLink>
        <el-button @click="handleLogout">退出登录</el-button>
      </template>
    </el-result>

    <!-- 未登录状态：el-form 登录表单 + rules 规则校验 -->
    <template v-else>
      <h1 class="login-title">身份认证</h1>
      <!-- 从守卫重定向过来时，用 el-alert 给出友好提示 -->
      <el-alert
        v-if="route.query.redirect"
        class="login-tip"
        title="请先登录，再访问「后台管理」页面"
        type="warning"
        show-icon
        :closable="false"
      />

      <el-form ref="formRef" :model="form" :rules="rules" label-width="60px" class="login-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <!-- show-password 提供明文切换按钮 -->
          <el-input v-model.trim="form.password" type="password" show-password placeholder="请输入密码（123456）" />
        </el-form-item>
      </el-form>

      <!-- el-alert 错误提示：密码错误时显示 -->
      <el-alert
        v-if="error"
        class="login-error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
      />

      <el-button type="primary" class="login-btn" @click="handleLogin">登录</el-button>
    </template>
  </el-card>
</template>

<style scoped>
  .login-card {
    max-width: 420px;
    margin: 0 auto;
  }

  .login-title {
    margin: 0 0 12px;
  }

  .login-tip {
    margin: 0 0 12px;
  }

  .login-form {
    margin-top: 4px;
  }

  .login-error {
    margin: 0 0 10px;
  }

  .login-btn {
    width: 100%;
  }
</style>

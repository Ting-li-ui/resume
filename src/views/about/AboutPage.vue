<script setup>
  // 关于页：介绍本项目与本次实验内容
  // 实验十要求「不少于 10 种 Element Plus 组件并说明其作用」：
  // 这里把全项目实际用到的组件整理成清单，用 el-table 表格组件集中展示

  // 组件清单：component 组件名 / usage 使用位置 / role 组件作用
  const componentList = [
    { component: 'el-container / el-header / el-main / el-footer', usage: 'App.vue 全局布局', role: '页面骨架：页头-主体-页脚三段式布局容器' },
    { component: 'el-aside', usage: '后台管理 AdminPage', role: '后台左侧边栏容器，承载侧边菜单' },
    { component: 'el-row / el-col', usage: '首页、后台首页', role: '24 栅格系统，实现响应式卡片排布' },
    { component: 'el-card', usage: '首页各卡片、关于页、详情页等', role: '内容卡片容器，统一圆角阴影外观' },
    { component: 'el-menu / el-menu-item', usage: '顶部导航、后台侧边菜单', role: '导航菜单，支持横向 / 纵向模式与选中高亮' },
    { component: 'el-table / el-table-column', usage: '后台项目 / 技能 / 文章管理', role: '表格形式展示列表数据，支持列配置' },
    { component: 'el-form / el-form-item', usage: '登录页、各管理页', role: '表单容器，配合 rules 做输入校验' },
    { component: 'el-input', usage: '登录、编辑资料、技能搜索等', role: '文本输入框，支持清空、前缀图标' },
    { component: 'el-select / el-option', usage: '技能类型 / 程度、文章分类', role: '下拉选择框' },
    { component: 'el-date-picker', usage: '文章管理发布日期', role: '日期选择器，value-format 定制输出格式' },
    { component: 'el-dialog', usage: '后台新增 / 编辑项目、技能、文章', role: '模态对话框，表单在弹窗中填写' },
    { component: 'el-button', usage: '全站', role: '操作按钮，统一类型与尺寸体系' },
    { component: 'el-tag', usage: '项目标签、文章分类、技能类型', role: '小型标签徽标，突出元信息' },
    { component: 'el-timeline / el-timeline-item', usage: '首页学习历程', role: '竖向时间线，展示阶段经历' },
    { component: 'el-avatar', usage: '个人卡片、后台简介管理', role: '圆形头像展示' },
    { component: 'el-descriptions', usage: '个人卡片、项目 / 文章详情', role: '描述列表，成组展示键值信息' },
    { component: 'el-empty', usage: '各类列表空状态', role: '空数据占位图，替代纯文字提示' },
    { component: 'el-message', usage: '各管理页操作反馈', role: '轻量全局消息提示（成功 / 警告）' },
    { component: 'el-popconfirm', usage: '后台删除确认', role: '气泡二次确认框，替代浏览器 confirm' },
    { component: 'el-switch', usage: '顶部导航主题切换', role: '开关组件，亮色 / 暗色主题切换' },
    { component: 'el-statistic', usage: '后台首页统计卡片', role: '统计数字展示' },
    { component: 'el-progress', usage: '技能卡片', role: '进度条，可视化技能掌握程度' },
    { component: 'el-result', usage: '404 页、无效详情地址', role: '结果反馈页（成功 / 警告 / 404）' },
    { component: 'el-divider', usage: '文章详情、关于页', role: '分割线，划分内容区块' },
    { component: 'el-alert', usage: '登录页、后台首页', role: '信息警示条，突出提示文案' },
    { component: 'el-radio-group / el-radio-button', usage: '文章列表分类筛选', role: '单选按钮组，互斥分类切换' },
    { component: 'el-backtop', usage: '页脚', role: '返回顶部悬浮按钮，滚动监听内置' },
    { component: 'el-dropdown / el-dropdown-item', usage: '后台顶栏用户菜单', role: '下拉菜单，收纳用户操作' },
    { component: 'el-collapse / el-collapse-item', usage: '个人卡片更多信息', role: '折叠面板，展开 / 收起详细内容' },
    { component: 'el-list / el-list-item', usage: '文章列表', role: '列表容器，逐条排布文章摘要' }
  ]
</script>

<template>
  <div class="about-page">
    <el-card class="about-card">
      <template #header>
        <h1 class="about-title">关于本站</h1>
      </template>
      <p>
        本站是《Vue 3 前端开发》课程的阶段性综合练习，基于
        <strong>Vue 3 + Vite + Vue Router + Pinia + Element Plus</strong> 搭建的个人名片应用。
      </p>
      <p>本次实验在原有名片项目的基础上，综合应用了以下知识点：</p>
      <el-timeline class="about-list">
        <el-timeline-item timestamp="实验九" placement="top" type="success">
          用 Element Plus 布局组件（el-container / el-row / el-col）重构页面结构，首页新增 el-timeline 学习历程时间线
        </el-timeline-item>
        <el-timeline-item timestamp="实验十" placement="top" type="primary">
          el-menu 菜单导航、el-table / el-list 列表展示、el-form + el-dialog 弹窗实现新增与编辑，全项目使用 30 种组件
        </el-timeline-item>
        <el-timeline-item timestamp="实验十一" placement="top" type="warning">
          Vue Router（路由守卫 + 动态参数）、Pinia（共享状态 + 持久化）、Element Plus（UI 组件）三者整合联调
        </el-timeline-item>
      </el-timeline>

      <el-divider content-position="left">Element Plus 组件清单（共 {{ componentList.length }} 种）</el-divider>

      <!-- el-table 表格组件：集中展示本实验使用的组件、位置与作用 -->
      <el-table :data="componentList" stripe>
        <el-table-column prop="component" label="组件" min-width="280" />
        <el-table-column prop="usage" label="使用位置" min-width="170" />
        <el-table-column prop="role" label="作用" min-width="220" />
      </el-table>

      <div class="back-bar">
        <RouterLink class="back-link" :to="{ name: 'home' }">← 返回首页</RouterLink>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
  .about-title {
    margin: 0;
  }

  .about-card p {
    margin: 8px 0;
    line-height: 1.8;
  }

  .about-list {
    margin: 8px 0 16px;
  }

  .back-bar {
    margin-top: 16px;
  }

  .back-link {
    color: var(--primary-color);
    text-decoration: none;
    font-size: 14px;
  }
</style>

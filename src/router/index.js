/**
 * Vue Router 路由配置
 * 管理应用的路由规则和导航守卫
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

/**
 * 路由规则配置
 * 每个路由对象包含：
 * - path: 路由路径
 * - name: 路由名称
 * - component: 组件（使用懒加载）
 * - meta: 元数据（如页面标题、是否需要登录）
 */
const routes = [
  {
    path: '/',
    name: 'Poster',
    component: () => import('../views/Poster.vue'),
    meta: { title: '咖啡在线 - 首页海报', requiresAuth: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '咖啡在线 - 首页', requiresAuth: false }
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: () => import('../views/Equipment.vue'),
    meta: { title: '咖啡在线 - 咖啡器具', requiresAuth: false }
  },
  {
    path: '/origin-map',
    name: 'OriginMap',
    component: () => import('../views/OriginMap.vue'),
    meta: { title: '咖啡在线 - 咖啡产地地图', requiresAuth: false }
  },
  {
    path: '/stores',
    name: 'Stores',
    component: () => import('../views/Stores.vue'),
    meta: { title: '咖啡在线 - 线下门店', requiresAuth: false }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue'),
    meta: { title: '咖啡在线 - 购物车', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { title: '咖啡在线 - 个人中心', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '咖啡在线 - 登录', requiresAuth: false, isAuthPage: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: '咖啡在线 - 注册', requiresAuth: false, isAuthPage: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
    meta: { title: '咖啡在线 - 忘记密码', requiresAuth: false, isAuthPage: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '咖啡在线 - 页面未找到', requiresAuth: false }
  }
]

/**
 * 创建路由实例
 * 使用 HTML5 history 模式
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
  /**
   * 路由切换时滚动行为
   */
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

/**
 * 判断用户是否已登录
 * @returns {boolean} - 是否登录
 */
const isAuthenticated = () => {
  const userStore = useUserStore()
  return !!userStore.token
}

/**
 * 全局前置守卫
 * 在路由跳转前执行权限检查
 */
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // 需要登录但未登录，跳转到登录页
    ElMessage.warning('请先登录后再访问')
    next({
      name: 'Login',
      query: { redirect: to.fullPath } // 保存当前路径，登录后跳转回来
    })
    return
  }

  // 已登录用户访问登录页，自动跳转到首页
  if (to.meta.isAuthPage && isAuthenticated()) {
    next({ name: 'Home' })
    return
  }

  // 继续路由跳转
  next()
})

/**
 * 全局后置守卫
 * 在路由跳转后执行
 */
router.afterEach((to, from) => {
  // 可以在这里添加页面访问统计等逻辑
  console.log(`Navigation from ${from.path} to ${to.path}`)
})

export default router
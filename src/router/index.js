import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const routes = [
  { path: '/', name: 'Poster', component: () => import('../views/Poster.vue'), meta: { title: '咖啡在线 - 首页海报', requiresAuth: false } },
  { path: '/home', name: 'Home', component: () => import('../views/Home.vue'), meta: { title: '咖啡在线 - 首页', requiresAuth: false } },
  
  { path: '/coffee-bean/list', name: 'CoffeeBeanList', component: () => import('../views/OriginMap.vue'), meta: { title: '咖啡在线 - 咖啡豆列表', requiresAuth: false } },
  { path: '/coffee-tool/list', name: 'CoffeeToolList', component: () => import('../views/Equipment.vue'), meta: { title: '咖啡在线 - 咖啡器具', requiresAuth: false } },
  { path: '/equipment', redirect: '/coffee-tool/list' },
  { path: '/origin-map', name: 'OriginMap', component: () => import('../views/OriginMap.vue'), meta: { title: '咖啡在线 - 咖啡产地地图', requiresAuth: false } },
  
  { path: '/coffee-bean/ethiopia-yirgacheffe/:beanId', name: 'YirgacheffeDetail', component: () => import('../views/coffee-bean/YirgacheffeDetail.vue'), meta: { title: '咖啡在线 - 耶加雪菲', requiresAuth: false } },
  { path: '/coffee-bean/kenya-aa/:beanId', name: 'KenyaAADetail', component: () => import('../views/coffee-bean/KenyaAADetail.vue'), meta: { title: '咖啡在线 - 肯尼亚AA', requiresAuth: false } },
  { path: '/coffee-bean/kenya-aa-neri/:beanId', name: 'KenyaNeriDetail', component: () => import('../views/coffee-bean/KenyaNeriDetail.vue'), meta: { title: '咖啡在线 - 肯尼亚AA涅里', requiresAuth: false } },
  { path: '/coffee-bean/colombia-huilan/:beanId', name: 'HuilanDetail', component: () => import('../views/coffee-bean/HuilanDetail.vue'), meta: { title: '咖啡在线 - 哥伦比亚蕙兰', requiresAuth: false } },
  { path: '/coffee-bean/brazil-santos/:beanId', name: 'SantosDetail', component: () => import('../views/coffee-bean/SantosDetail.vue'), meta: { title: '咖啡在线 - 巴西桑托斯', requiresAuth: false } },
  { path: '/coffee-bean/guatemala-antigua/:beanId', name: 'AntiguaDetail', component: () => import('../views/coffee-bean/AntiguaDetail.vue'), meta: { title: '咖啡在线 - 危地马拉安提瓜', requiresAuth: false } },
  { path: '/coffee-bean/indonesia-mandarin/:beanId', name: 'MandarinDetail', component: () => import('../views/coffee-bean/MandarinDetail.vue'), meta: { title: '咖啡在线 - 印尼曼特宁', requiresAuth: false } },
  { path: '/coffee-bean/costa-rica/:beanId', name: 'CostaRicaDetail', component: () => import('../views/coffee-bean/CostaRicaDetail.vue'), meta: { title: '咖啡在线 - 哥斯达黎加', requiresAuth: false } },
  { path: '/coffee-bean/panama-geisha/:beanId', name: 'PanamaGeishaDetail', component: () => import('../views/coffee-bean/SantosDetail.vue'), meta: { title: '咖啡在线 - 巴拿马瑰夏', requiresAuth: false } },
  { path: '/coffee-bean/ethiopia-hambella/:beanId', name: 'HambellaDetail', component: () => import('../views/coffee-bean/YirgacheffeDetail.vue'), meta: { title: '咖啡在线 - 埃塞罕贝拉', requiresAuth: false } },
  { path: '/coffee-bean/peru-bourbon/:beanId', name: 'PeruBourbonDetail', component: () => import('../views/coffee-bean/HuilanDetail.vue'), meta: { title: '咖啡在线 - 秘鲁波旁', requiresAuth: false } },
  
  
  
  { path: '/cart', name: 'Cart', component: () => import('../views/Cart.vue'), meta: { title: '咖啡在线 - 购物车', requiresAuth: true } },
  { path: '/checkout', name: 'Checkout', component: () => import('../views/Checkout.vue'), meta: { title: '咖啡在线 - 确认订单', requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: () => import('../views/Profile.vue'), meta: { title: '咖啡在线 - 个人中心', requiresAuth: true } },
  { path: '/orders', name: 'MyOrders', component: () => import('../views/MyOrders.vue'), meta: { title: '咖啡在线 - 我的订单', requiresAuth: true } },
  { path: '/addresses', name: 'MyAddresses', component: () => import('../views/MyAddresses.vue'), meta: { title: '咖啡在线 - 收货地址', requiresAuth: true } },
  { path: '/wallet', name: 'MyWallet', component: () => import('../views/MyWallet.vue'), meta: { title: '咖啡在线 - 我的钱包', requiresAuth: true } },
  { path: '/product/:id', name: 'ProductDetail', component: () => import('../views/ProductDetail.vue'), meta: { title: '咖啡在线 - 咖啡豆详情', requiresAuth: false } },
  { path: '/tool/detail/:toolId', name: 'ToolDetail', component: () => import('../views/ToolDetail.vue'), meta: { title: '咖啡在线 - 咖啡器具详情', requiresAuth: false } },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue'), meta: { title: '咖啡在线 - 登录', requiresAuth: false, isAuthPage: true } },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue'), meta: { title: '咖啡在线 - 注册', requiresAuth: false, isAuthPage: true } },
  { path: '/forgot-password', name: 'ForgotPassword', component: () => import('../views/ForgotPassword.vue'), meta: { title: '咖啡在线 - 忘记密码', requiresAuth: false, isAuthPage: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue'), meta: { title: '咖啡在线 - 页面未找到', requiresAuth: false } }
]

const router = createRouter({ history: createWebHistory(), routes, scrollBehavior(to, from, savedPosition) { return savedPosition || { top: 0 } } })
const isAuthenticated = () => { const userStore = useUserStore(); return !!userStore.token }
router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title
  if (to.meta.requiresAuth && !isAuthenticated()) { ElMessage.warning('请先登录后再访问'); next({ name: 'Login', query: { redirect: to.fullPath } }); return }
  if (to.meta.isAuthPage && isAuthenticated()) { next({ name: 'Home' }); return }
  next()
})
export default router

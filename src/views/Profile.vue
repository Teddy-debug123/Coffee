<script setup>
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
import { ArrowRight, Clock, Help, MapLocation, Setting, Star, Wallet, Coffee, CreditCard, Bell, ShoppingCart, HomeFilled, Refresh, Document, Plus, Minus, Delete, User, Upload, Close } from '@element-plus/icons-vue'
import NavBar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import CartSidebar from '../components/CartSidebar.vue'

const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()
const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const isDrawerOpen = ref(false)
const activeTab = ref('orders')
const orderFilter = ref('all')
const showLogoutConfirm = ref(false)
const showAvatarUpload = ref(false)
const selectedCartItems = ref(new Set())
const allCartSelected = ref(false)
const orderStats = ref({ pendingPayment: 0, pendingShipment: 0, pendingReceipt: 0, pendingReview: 0, total: 0 })
const isLoaded = ref(false)
const animatedPoints = ref(0)
const animatedBalance = ref(0)
const animateNumbers = ref(false)

const loadUserInfo = async () => {
  if (userStore.isLoggedIn && !userStore.userInfo) {
    try {
      await userStore.loadUserInfo()
    } catch {
      userStore.setUserInfo(null)
    }
  }
}

const loadOrderStats = async () => {
  try {
    orderStats.value = {
      pendingPayment: 1,
      pendingShipment: 2,
      pendingReceipt: 1,
      pendingReview: 3,
      total: 8
    }
  } catch {
    orderStats.value = { pendingPayment: 0, pendingShipment: 0, pendingReceipt: 0, pendingReview: 0, total: 0 }
  }
}

const animateValue = (start, end, setter, duration = 1000) => {
  const startTime = performance.now()
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    setter(Math.round(start + (end - start) * easeOut))
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  requestAnimationFrame(animate)
}

const userInfo = computed(() => userStore.userInfo || {
  name: '咖啡爱好者',
  nickname: '咖啡控',
  email: 'coffee@example.com',
  memberLevel: '浅烘会员',
  memberLevelDesc: '升级享烘焙折扣',
  points: 2680,
  pointsDesc: '积分可兑换限定咖啡豆/周边器具',
  balance: 128.50,
  balanceDesc: '可抵扣订单金额',
  phone: '138****8888',
  joinDate: '2024-03-15',
  avatar: ''
})

const quickStats = computed(() => [
  { label: '待付款', count: orderStats.value.pendingPayment, icon: Wallet, filter: 'pending_payment' },
  { label: '待发货', count: orderStats.value.pendingShipment, icon: Clock, filter: 'pending_shipment' },
  { label: '待收货', count: orderStats.value.pendingReceipt, icon: MapLocation, filter: 'pending_receipt' },
  { label: '待评价', count: orderStats.value.pendingReview, icon: Star, filter: 'pending_review' },
  { label: '全部订单', count: orderStats.value.total, icon: Document, isAll: true }
])

const orderFilters = [
  { value: 'all', label: '全部' },
  { value: 'pending_payment', label: '待付款' },
  { value: 'pending_shipment', label: '待发货' },
  { value: 'pending_receipt', label: '待收货' },
  { value: 'completed', label: '已完成' },
  { value: 'after_sale', label: '售后' }
]

const menuGroups = computed(() => [
  {
    title: '',
    items: [
      { id: 'home', label: '返回首页', icon: HomeFilled, desc: '', path: '/home' }
    ]
  },
  {
    title: '订单交易',
    items: [
      { id: 'orders', label: '订单采购', icon: Document, desc: '我的订单', badge: '', path: '/orders' },
      { id: 'cart', label: '购物车管理', icon: ShoppingCart, desc: '管理购物车', badge: cartStore.totalCount > 0 ? String(cartStore.totalCount) : '', path: '/cart' },
      { id: 'address', label: '收货地址管理', icon: MapLocation, desc: '管理常用地址', badge: '', path: '/addresses' }
    ]
  },
])

const mockContents = {
  orders: [
    { 
      id: 1,
      title: '埃塞俄比亚 耶加雪菲',
      roastDate: '2026-06-15',
      spec: '250g · 浅烘焙',
      flavor: '花香 · 柠檬 · 蜂蜜',
      status: '待发货', 
      meta: '订单号 20260616001', 
      price: '¥128',
      shipping: '预计 6月20日 送达',
      image: '/picture/yejiaxuefei.png'
    }, 
    { 
      id: 2,
      title: '哥伦比亚 慧兰',
      roastDate: '2026-06-10',
      spec: '500g · 中烘焙',
      flavor: '坚果 · 焦糖 · 巧克力',
      status: '已完成', 
      meta: '订单号 20260615008', 
      price: '¥198',
      shipping: '已于 6月18日 签收',
      image: '/picture/store1.png'
    },
    { 
      id: 3,
      title: '肯尼亚 AA',
      roastDate: '2026-06-12',
      spec: '250g · 中浅烘焙',
      flavor: '黑醋栗 · 红酒 · 番茄',
      status: '待收货', 
      meta: '订单号 20260614003', 
      price: '¥168',
      shipping: '顺丰速运 SF123456789',
      image: '/picture/kenniya.png'
    }
  ],
  favorites: [
    { title: '肯尼亚 AA', meta: '花香 · 红酒 · 黑醋栗', price: '¥168', image: '/picture/kenniya.png' }, 
    { title: '哥伦比亚 慧兰', meta: '坚果 · 焦糖 · 巧克力', price: '¥98', image: '/picture/store1.png' },
    { title: '埃塞俄比亚 耶加雪菲', meta: '柠檬 · 茉莉 · 蜂蜜', price: '¥128', image: '/picture/yejiaxuefei.png' }
  ],
  address: [
    { title: '张三 138****8888', meta: '北京市朝阳区建国路 88 号', isDefault: true },
    { title: '李四 139****9999', meta: '上海市浦东新区陆家嘴环路 1000 号', isDefault: false }
  ],
  wallet: [
    { title: '新人券包', meta: '满 199 减 20', type: 'coupon', value: 20 }, 
    { title: '会员专属券', meta: '满 399 减 50', type: 'coupon', value: 50 }
  ],
  help: [
    { title: '如何修改订单地址', meta: '下单后 30 分钟内可修改' }, 
    { title: '如何申请退款', meta: '进入订单详情提交申请' }
  ],
  settings: [
    { title: '登录密码', meta: '定期修改保障账户安全' }, 
    { title: '消息通知', meta: '订单与促销消息', toggle: true },
    { title: '隐私设置', meta: '管理个人信息权限' },
    { title: '账号安全', meta: '绑定手机号与邮箱' }
  ],
  cart: [
    { id: 1, product: { name: '埃塞俄比亚 耶加雪菲', price: 128, image: '/picture/yejiaxuefei.png', roast: '浅烘焙', process: '水洗处理', spec: '250g' }, quantity: 2 },
    { id: 2, product: { name: '肯尼亚 AA', price: 168, image: '/picture/kenniya.png', roast: '中浅烘焙', process: '日晒处理', spec: '250g' }, quantity: 1 },
    { id: 3, product: { name: '哥伦比亚 慧兰', price: 98, image: '/picture/store1.png', roast: '中烘焙', process: '水洗处理', spec: '250g' }, quantity: 1 }
  ]
}

const filteredOrders = computed(() => {
  if (orderFilter.value === 'all') return mockContents.orders
  const statusMap = {
    'pending_payment': '待付款',
    'pending_shipment': '待发货',
    'completed': '已完成',
    'after_sale': '售后'
  }
  return mockContents.orders.filter(order => order.status === statusMap[orderFilter.value])
})

const activeSection = computed(() => {
  for (const group of menuGroups.value) {
    const found = group.items.find(item => item.id === activeTab.value)
    if (found) return found
  }
  return null
})

const currentItems = computed(() => {
  if (activeTab.value === 'cart') {
    return cartStore.items.length > 0 ? cartStore.items : mockContents.cart
  }
  return mockContents[activeTab.value] || []
})

const selectedCartTotal = computed(() => {
  let total = 0
  currentItems.value.forEach(item => {
    if (selectedCartItems.value.has(item.id)) {
      total += (item.product?.price || 0) * (item.quantity || 1)
    }
  })
  return total
})

const selectedCartCount = computed(() => {
  let count = 0
  currentItems.value.forEach(item => {
    if (selectedCartItems.value.has(item.id)) {
      count += (item.quantity || 1)
    }
  })
  return count
})

const logout = () => { 
  showLogoutConfirm.value = true
}

const confirmLogout = () => {
  userStore.logout()
  router.push('/login')
}

const loadCartData = async () => {
  if (!cartStore.isLoaded) {
    await cartStore.loadCart()
  }
}

const toggleCartItemSelect = (itemId) => {
  if (selectedCartItems.value.has(itemId)) {
    selectedCartItems.value.delete(itemId)
  } else {
    selectedCartItems.value.add(itemId)
  }
  allCartSelected.value = selectedCartItems.value.size === currentItems.value.length && currentItems.value.length > 0
}

const toggleAllCartSelect = () => {
  if (allCartSelected.value) {
    selectedCartItems.value.clear()
  } else {
    currentItems.value.forEach(item => selectedCartItems.value.add(item.id))
  }
  allCartSelected.value = !allCartSelected.value
}

const removeSelectedCartItems = () => {
  selectedCartItems.value.forEach(id => {
    cartStore.removeItem(id)
  })
  selectedCartItems.value.clear()
  allCartSelected.value = false
}

const clearCart = () => {
  cartStore.clearAll()
  selectedCartItems.value.clear()
  allCartSelected.value = false
}

const handleCartItemClick = (item) => {
  const productType = item.product?.category || item.product?.type
  if (productType === '咖啡机' || productType === '冲煮器具' || productType === '研磨器具' || productType === '杯具' || productType === '辅助器具') {
    router.push(`/tool/detail/${item.product?.id}`)
  } else {
    router.push(`/product/${item.product?.id}`)
  }
}

const updateCartQuantity = async (item, delta) => {
  const newQty = (item.quantity || 1) + delta
  if (newQty >= 1) {
    await cartStore.updateQuantity(item.id, newQty)
  }
}

const handleQuickAction = (stat) => {
  if (stat.count === 0) return
  if (stat.isAll) {
    router.push('/orders')
  } else if (stat.filter) {
    router.push(`/orders?filter=${stat.filter}`)
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'cart') {
    loadCartData()
  }
})

onMounted(async () => {
  await Promise.all([loadCartData(), loadUserInfo(), loadOrderStats()])
  isLoaded.value = true
  nextTick(() => {
    animateValue(0, userInfo.value.points, (v) => { animatedPoints.value = v }, 1200)
    animateValue(0, userInfo.value.balance, (v) => { animatedBalance.value = v }, 1200)
  })
})

onUnmounted(() => {})
</script>

<template>
  <div class="profile-page">
    <NavBar @toggle-menu="isMenuOpen = true" @toggle-cart="isCartOpen = true" />
    <SideMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
    <CartSidebar :is-open="isCartOpen" @close="isCartOpen = false" />

    <section class="hero-section" :class="{ loaded: isLoaded }">
      <div class="hero-bg"></div>
      <div class="hero-content container">
        <div class="user-card animate-card">
          <div class="avatar-section">
            <div class="avatar-wrapper" @click="showAvatarUpload = true">
              <img v-if="userInfo.avatar" :src="userInfo.avatar" :alt="userInfo.name" class="avatar-img" />
              <div v-else class="avatar-placeholder">
                <Coffee :size="40" />
              </div>
              <div class="avatar-upload-overlay">
                <Upload :size="18" />
              </div>
            </div>
            <div class="member-badge">
              <span>{{ userInfo.memberLevel }}</span>
              <span class="member-desc">{{ userInfo.memberLevelDesc }}</span>
            </div>
          </div>
          <div class="user-info">
            <h1 class="user-name">{{ userInfo.nickname || userInfo.name }}</h1>
            <p class="user-meta">
              <span>{{ userInfo.email }}</span>
              <span class="meta-divider">|</span>
              <span>{{ userInfo.phone }}</span>
            </p>
          </div>
          <div class="user-stats">
            <div class="stat-card points-card animate-stat" @click="router.push('/wallet')">
              <div class="stat-icon">
                <Star :size="20" />
              </div>
              <div class="stat-content">
                <span class="stat-label">积分</span>
                <strong class="stat-value">{{ animatedPoints }}</strong>
                <span class="stat-desc">{{ userInfo.pointsDesc }}</span>
              </div>
              <button class="stat-action">兑换</button>
            </div>
            <div class="stat-card balance-card animate-stat" @click="router.push('/wallet')">
              <div class="stat-icon">
                <CreditCard :size="20" />
              </div>
              <div class="stat-content">
                <span class="stat-label">账户余额</span>
                <strong class="stat-value">¥{{ animatedBalance.toFixed(2) }}</strong>
                <span class="stat-desc">{{ userInfo.balanceDesc }}</span>
              </div>
              <button class="stat-action">充值</button>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <button 
            v-for="(stat, index) in quickStats" 
            :key="stat.label" 
            class="action-btn" 
            :class="{ 'all-orders': stat.isAll, 'empty': stat.count === 0 }"
            :style="{ animationDelay: `${index * 0.12}s` }"
            @click="handleQuickAction(stat)"
          >
            <component :is="stat.icon" :size="20" />
            <span class="action-count">{{ stat.count }}</span>
            <span class="action-label">{{ stat.label }}</span>
          </button>
        </div>
      </div>
    </section>

    <section class="main-content container">
      <button class="menu-toggle-btn" @click="isDrawerOpen = true">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <Teleport to="body">
        <Transition name="drawer">
          <div v-if="isDrawerOpen" class="drawer-overlay" @click="isDrawerOpen = false">
            <aside class="sidebar-drawer" @click.stop>
              <div class="drawer-header">
                <div class="drawer-title">菜单</div>
                <button class="drawer-close" @click="isDrawerOpen = false">
                  <Close :size="20" />
                </button>
              </div>
              <nav class="side-nav">
                <div v-for="group in menuGroups" :key="group.title" class="menu-group">
                  <template v-if="group.title">
                    <h4 class="group-title">{{ group.title }}</h4>
                    <div class="group-divider"></div>
                  </template>
                  <button 
                    v-for="item in group.items" 
                    :key="item.id" 
                    class="nav-item" 
                    :class="{ active: activeTab === item.id }"
                    @click="(item.path ? router.push(item.path) : (activeTab = item.id)); isDrawerOpen = false"
                  >
                    <div class="nav-icon">
                      <component :is="item.icon" :size="16" />
                    </div>
                    <div class="nav-info">
                      <span class="nav-label">{{ item.label }}</span>
                      <span v-if="item.desc" class="nav-desc">{{ item.desc }}</span>
                    </div>
                    <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
                    <ArrowRight :size="14" class="nav-arrow" />
                  </button>
                </div>

                <div class="danger-zone">
                  <button class="logout-btn" @click="logout">
                    <ArrowRight :size="16" />
                    <span>退出登录</span>
                  </button>
                </div>
              </nav>
            </aside>
          </div>
        </Transition>
      </Teleport>

      <main class="content-area">
        <div class="content-header">
          <div class="header-left">
            <h2 class="content-title">{{ activeSection?.label }}</h2>
            <p class="content-desc">{{ activeSection?.desc }}</p>
          </div>
          <div v-if="activeTab === 'orders'" class="header-right">
            <select class="order-filter" v-model="orderFilter">
              <option v-for="filter in orderFilters" :key="filter.value" :value="filter.value">{{ filter.label }}</option>
            </select>
          </div>
        </div>

        <div class="content-body">
          <div v-if="activeTab === 'cart'" class="cart-tab-content">
            <div class="cart-header">
              <label class="select-all">
                <input type="checkbox" :checked="allCartSelected" @change="toggleAllCartSelect" />
                <span>全选</span>
              </label>
              <div class="cart-actions">
                <button class="cart-action-btn" @click="removeSelectedCartItems" :disabled="selectedCartItems.size === 0">
                  批量删除选中
                </button>
                <button class="cart-action-btn" @click="clearCart" :disabled="currentItems.length === 0">
                  清空购物车
                </button>
              </div>
            </div>

            <div v-if="currentItems.length === 0" class="empty-cart">
              <ShoppingCart :size="64" />
              <h3>购物车空空如也</h3>
              <p>挑选季节限定咖啡豆</p>
              <button class="empty-action-btn" @click="router.push('/home')">去选购</button>
            </div>

            <div v-else class="cart-items">
              <article v-for="item in currentItems" :key="item.id" class="cart-item" @click="handleCartItemClick(item)">
                <label class="item-checkbox" @click.stop>
                  <input type="checkbox" :checked="selectedCartItems.has(item.id)" @change="toggleCartItemSelect(item.id)" />
                </label>
                <div class="item-thumb">
                  <img :src="item.product?.image || '/picture/yejiaxuefei.png'" :alt="item.product?.name || '咖啡商品'" />
                </div>
                <div class="item-info">
                  <h4 class="item-name">{{ item.product?.name || '咖啡商品' }}</h4>
                  <p class="item-spec">{{ item.product?.roast || '' }} · {{ item.product?.process || '' }} · {{ item.product?.spec || '' }}</p>
                  <span class="item-price">¥{{ item.product?.price || 0 }}</span>
                </div>
                <div class="item-quantity">
                  <button class="qty-btn" @click.stop="updateCartQuantity(item, -1)" :disabled="(item.quantity || 1) <= 1">
                  <Minus :size="14" />
                </button>
                <span class="qty-value">{{ item.quantity || 1 }}</span>
                <button class="qty-btn" @click.stop="updateCartQuantity(item, 1)">
                  <Plus :size="14" />
                </button>
              </div>
              <div class="item-subtotal">
                <span>¥{{ (item.product?.price || 0) * (item.quantity || 1) }}</span>
              </div>
              <button class="item-delete" @click.stop="cartStore.removeItem(item.id)">
                <Delete :size="16" />
              </button>
              </article>
            </div>

            <div v-if="currentItems.length > 0" class="cart-footer">
              <div class="footer-left">
                <span>已选 {{ selectedCartCount }} 件商品</span>
                <span class="footer-divider">|</span>
                <span>合计 <strong>¥{{ selectedCartTotal }}</strong></span>
              </div>
              <div class="footer-right">
                <button class="checkout-btn" :disabled="selectedCartItems.size === 0">
                  去结算
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'orders'" class="orders-list">
            <div v-if="filteredOrders.length === 0" class="empty-orders">
              <Coffee :size="64" />
              <h3>还未选购咖啡豆</h3>
              <p>去商城逛逛</p>
              <button class="empty-action-btn" @click="router.push('/home')">去选购</button>
            </div>
            <article v-for="(item, index) in filteredOrders" :key="index" class="order-card">
              <div class="order-header">
                <span class="order-meta">{{ item.meta }}</span>
                <span class="order-status" :class="item.status">{{ item.status }}</span>
              </div>
              <div class="order-content">
                <div class="order-image">
                  <img :src="item.image || '/picture/yejiaxuefei.png'" :alt="item.title" />
                </div>
                <div class="order-info">
                  <h3 class="order-title">{{ item.title }}</h3>
                  <p class="order-spec">{{ item.spec }} · {{ item.flavor }}</p>
                  <p class="order-shipping">{{ item.shipping }}</p>
                </div>
                <div class="order-price">
                  <span>{{ item.price }}</span>
                </div>
              </div>
              <div class="order-footer">
                <div class="order-date">烘焙日期：{{ item.roastDate }}</div>
                <div class="order-actions">
                  <button class="order-btn">查看详情</button>
                  <button v-if="item.status === '已完成'" class="order-btn secondary">再次购买</button>
                  <button v-if="item.status === '待收货'" class="order-btn secondary">申请售后</button>
                </div>
              </div>
            </article>
          </div>

          <div v-else-if="activeTab === 'favorites'" class="favorites-grid">
            <article v-for="(item, index) in currentItems" :key="index" class="favorite-card">
              <div class="favorite-image">
                <img :src="item.image || '/picture/yejiaxuefei.png'" :alt="item.title" />
              </div>
              <div class="favorite-info">
                <h3 class="favorite-title">{{ item.title }}</h3>
                <p class="favorite-meta">{{ item.meta }}</p>
              </div>
              <span class="favorite-price">{{ item.price }}</span>
            </article>
          </div>

          <div v-else-if="activeTab === 'address'" class="address-list">
            <article v-for="(item, index) in currentItems" :key="index" class="address-card">
              <div class="address-header">
                <h3 class="address-title">{{ item.title }}</h3>
                <span v-if="item.isDefault" class="default-tag">默认</span>
              </div>
              <p class="address-meta">{{ item.meta }}</p>
              <div class="address-actions">
                <button class="address-btn">编辑</button>
                <button class="address-btn">删除</button>
              </div>
            </article>
            <button class="add-address-btn">
              <span>+ 添加新地址</span>
            </button>
          </div>

          <div v-else-if="activeTab === 'wallet'" class="wallet-section">
            <div class="balance-card">
              <div class="balance-header">
                <CreditCard :size="24" />
                <span>账户余额</span>
              </div>
              <div class="balance-amount">¥{{ userInfo.balance }}</div>
              <div class="balance-actions">
                <button class="balance-btn">充值</button>
                <button class="balance-btn">提现</button>
              </div>
            </div>
            <div class="points-card-section">
              <div class="points-header">
                <Star :size="20" />
                <span>我的积分</span>
              </div>
              <div class="points-amount">{{ userInfo.points }}</div>
              <p class="points-desc">{{ userInfo.pointsDesc }}</p>
            </div>
            <div class="coupon-list">
              <h4 class="coupon-title">我的优惠券</h4>
              <article v-for="(item, index) in currentItems" :key="index" class="coupon-card">
                <div class="coupon-left">
                  <span class="coupon-value">¥{{ item.value || 20 }}</span>
                  <span class="coupon-condition">{{ item.meta }}</span>
                </div>
                <div class="coupon-right">
                  <h5>{{ item.title }}</h5>
                  <span class="coupon-expire">有效期至 2026-12-31</span>
                </div>
              </article>
            </div>
          </div>

          <div v-else-if="activeTab === 'help'" class="help-list">
            <article v-for="(item, index) in currentItems" :key="index" class="help-item">
              <Help :size="18" class="help-icon" />
              <div class="help-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.meta }}</p>
              </div>
              <ArrowRight :size="14" />
            </article>
          </div>

          <div v-else-if="activeTab === 'settings'" class="settings-list">
            <article v-for="(item, index) in currentItems" :key="index" class="settings-item">
              <div class="settings-icon">
                <component :is="item.toggle ? Bell : Setting" :size="18" />
              </div>
              <div class="settings-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.meta }}</p>
              </div>
              <ArrowRight :size="14" />
            </article>
          </div>
        </div>
      </main>
    </section>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showLogoutConfirm" class="modal-overlay" @click.self="showLogoutConfirm = false">
          <div class="modal-content">
            <h3>确认退出</h3>
            <p>确定退出当前账号？未结算购物车商品将保留</p>
            <div class="modal-actions">
              <button class="modal-btn cancel" @click="showLogoutConfirm = false">取消</button>
              <button class="modal-btn confirm" @click="confirmLogout">确认退出</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="scale-fade">
        <div v-if="showAvatarUpload" class="modal-overlay" @click.self="showAvatarUpload = false">
          <div class="avatar-modal">
            <button class="close-modal-btn" @click="showAvatarUpload = false">
              <Close :size="20" />
            </button>
            <h3>更换头像</h3>
            <p>上传一张方形图片作为您的个人头像</p>
            <div class="avatar-upload-area">
              <Upload :size="32" />
              <span>点击或拖拽上传图片</span>
            </div>
            <div class="avatar-upload-actions">
              <button class="modal-btn cancel" @click="showAvatarUpload = false">取消</button>
              <button class="modal-btn confirm">保存更改</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--color-bg);
  animation: breathe-bg 6s ease-in-out infinite;
}

@keyframes breathe-bg {
  0%, 100% { background-color: #F5F0E6; }
  50% { background-color: #F8F4ED; }
}

.hero-section {
  position: relative;
  padding-top: 80px;
  padding-bottom: 40px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-out;
}

.hero-section.loaded {
  opacity: 1;
  transform: translateY(0);
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: linear-gradient(135deg, #3A281B 0%, #5C4033 40%, #4A3C31 70%, #3A281B 100%);
  background-size: 200% 200%;
  animation: hero-shift 8s ease-in-out infinite;
}

@keyframes hero-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-bg::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--color-bg);
  border-radius: 50% 50% 0 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.user-card {
  background: var(--color-surface);
  border-radius: 20px;
  border: 1px solid rgba(200, 184, 168, 0.2);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  box-shadow: var(--shadow-soft);
  opacity: 0;
  transform: translateY(30px);
}

.hero-section.loaded .user-card {
  animation: slide-up-card 0.6s ease-out forwards;
}

@keyframes slide-up-card {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.avatar-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-wrapper {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EDE8E0, #D8C8B8);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
}

.avatar-wrapper:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(74, 60, 49, 0.2);
  border-color: var(--color-secondary);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-placeholder {
  color: var(--color-primary);
}

.avatar-upload-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to top, rgba(74, 60, 49, 0.7), transparent);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  opacity: 0;
  transition: opacity var(--transition);
}

.avatar-wrapper:hover .avatar-upload-overlay {
  opacity: 1;
}

.avatar-upload-overlay svg {
  color: #fff;
}

.member-badge {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 20px;
  border-radius: 999px;
  background: rgba(74, 60, 49, 0.9);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(74, 60, 49, 0.2);
}

.member-desc {
  font-size: 11px;
  font-weight: 400;
  opacity: 0.85;
}

.user-info {
  text-align: center;
}

.user-name {
  font-size: 28px;
  font-family: var(--font-display);
  color: var(--color-primary);
  margin: 0;
}

.user-meta {
  font-size: 14px;
  color: var(--color-muted);
  margin: 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.meta-divider {
  color: var(--color-line);
}

.user-stats {
  display: flex;
  gap: 32px;
  width: 100%;
  justify-content: center;
}

.stat-card {
  flex: 1;
  max-width: 240px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  cursor: pointer;
  transition: all var(--transition);
  opacity: 0;
  transform: translateY(20px);
}

.hero-section.loaded .stat-card {
  animation: slide-up-card 0.5s ease-out 0.3s forwards;
}

.stat-card.points-card {
  background: rgba(255, 180, 50, 0.06);
  border: 1px solid rgba(255, 180, 50, 0.15);
}

.stat-card.balance-card {
  background: rgba(74, 60, 49, 0.05);
  border: 1px solid rgba(74, 60, 49, 0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.points-card .stat-icon {
  background: rgba(255, 180, 50, 0.12);
  color: #B8860B;
}

.stat-card.balance-card .stat-icon {
  background: rgba(74, 60, 49, 0.1);
  color: var(--color-primary);
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.stat-label {
  font-size: 12px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-value {
  font-size: 32px;
  font-family: 'SF Mono', monospace;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

.stat-desc {
  font-size: 12px;
  color: var(--color-muted);
}

.stat-action {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  transition: all var(--transition);
  flex-shrink: 0;
}

.stat-card.points-card .stat-action {
  background: rgba(184, 134, 11, 0.1);
  color: #B8860B;
  border: 1px solid rgba(184, 134, 11, 0.2);
}

.stat-card.points-card:hover .stat-action {
  background: #B8860B;
  color: #fff;
}

.stat-card.balance-card .stat-action {
  background: rgba(74, 60, 49, 0.08);
  color: var(--color-primary);
  border: 1px solid rgba(74, 60, 49, 0.15);
}

.stat-card.balance-card:hover .stat-action {
  background: var(--color-primary);
  color: #fff;
}

.quick-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px 28px;
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid rgba(200, 184, 168, 0.2);
  transition: all var(--transition);
  min-width: 108px;
  color: var(--color-primary);
  opacity: 0;
  transform: translateY(20px);
}

.hero-section.loaded .action-btn {
  animation: slide-up-btn 0.4s ease-out forwards;
}

@keyframes slide-up-btn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.action-btn:hover:not(.empty) {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-hover);
  background: rgba(74, 60, 49, 0.05);
}

.action-btn:hover:not(.empty) svg {
  transform: scale(1.15);
}

.action-btn.all-orders {
  background: rgba(74, 60, 49, 0.05);
  border-color: rgba(74, 60, 49, 0.1);
}

.action-btn.empty {
  opacity: 0.4;
  cursor: not-allowed;
}

.action-btn svg {
  transition: transform var(--transition);
}

.action-count {
  font-size: 28px;
  font-family: 'SF Mono', monospace;
  font-weight: 700;
  color: var(--color-primary);
}

.action-label {
  font-size: 13px;
  color: var(--color-muted);
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 48px 0;
}

.menu-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(200, 184, 168, 0.2);
  background: var(--color-surface);
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition);
  align-self: flex-start;
}

.menu-toggle-btn:hover {
  background: rgba(74, 60, 49, 0.05);
  border-color: rgba(74, 60, 49, 0.2);
  transform: scale(1.05);
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(74, 60, 49, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-start;
}

.sidebar-drawer {
  width: 320px;
  max-width: 90vw;
  background: var(--color-surface);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 8px 0 32px rgba(74, 60, 49, 0.15);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid rgba(200, 184, 168, 0.2);
}

.drawer-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
}

.drawer-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(200, 184, 168, 0.1);
  color: var(--color-muted);
  cursor: pointer;
  transition: all var(--transition);
}

.drawer-close:hover {
  background: rgba(200, 184, 168, 0.2);
  color: var(--color-primary);
}

.side-nav {
  background: var(--color-bg);
  border-radius: 16px;
  border: 1px solid rgba(200, 184, 168, 0.2);
  overflow: hidden;
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .sidebar-drawer,
.drawer-leave-to .sidebar-drawer {
  transform: translateX(-100%);
}

.menu-group {
  display: flex;
  flex-direction: column;
}

.group-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 20px 20px 8px;
  margin: 0;
}

.group-divider {
  height: 1px;
  background: rgba(200, 184, 168, 0.2);
  margin: 4px 20px 12px;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  transition: all var(--transition);
  text-align: left;
  color: var(--color-primary);
  position: relative;
}

.nav-item:hover {
  background: #F8F1E7;
  transform: translateY(-2px);
}

.nav-item:hover .nav-arrow {
  transform: translateX(6px);
}

.nav-item:hover .nav-icon {
  color: var(--color-primary);
  background: rgba(74, 60, 49, 0.1);
}

.nav-item:hover .nav-label {
  font-weight: 600;
}

.nav-item.active {
  background: rgba(74, 60, 49, 0.06);
  animation: active-pulse 6s ease-in-out infinite;
}

@keyframes active-pulse {
  0%, 100% { box-shadow: inset 0 0 0 0 rgba(74, 60, 49, 0); }
  50% { box-shadow: inset 0 0 0 1px rgba(74, 60, 49, 0.1); }
}

.nav-item.active .nav-arrow {
  color: var(--color-primary);
  transform: translateX(2px);
}

.nav-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(200, 184, 168, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #998C7E;
  transition: all var(--transition);
  flex-shrink: 0;
}

.nav-item.active .nav-icon {
  background: rgba(74, 60, 49, 0.12);
  color: var(--color-primary);
}

.nav-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.nav-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-desc {
  font-size: 12px;
  color: #998C7E;
  white-space: nowrap;
}

.nav-badge {
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.nav-arrow {
  color: #998C7E;
  transition: all var(--transition);
  flex-shrink: 0;
}

.nav-item.active .nav-arrow {
  color: var(--color-primary);
}

.danger-zone {
  padding: 12px 20px;
  margin-top: 4px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: transparent;
  border-radius: 12px;
  border: 1px solid rgba(200, 184, 168, 0.2);
  color: #998C7E;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition);
  width: 100%;
}

.logout-btn:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.content-area {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-header {
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--color-line);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.content-title {
  font-size: var(--fs-h2);
  font-family: var(--font-display);
  color: var(--color-primary);
  margin: 0;
}

.content-desc {
  font-size: 14px;
  color: var(--color-muted);
  margin: 8px 0 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.order-filter {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  color: var(--color-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition);
}

.order-filter:focus {
  outline: none;
  border-color: var(--color-primary);
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-tab-content {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid var(--color-line);
}

.select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-primary);
  cursor: pointer;
}

.select-all input {
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
}

.cart-actions {
  display: flex;
  gap: 12px;
}

.cart-action-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 13px;
  transition: all var(--transition);
}

.cart-action-btn:hover:not(:disabled) {
  background: rgba(200, 184, 168, 0.15);
}

.cart-action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty-cart, .empty-orders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid var(--color-line);
  gap: 16px;
  color: var(--color-muted);
}

.empty-cart h3, .empty-orders h3 {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0;
}

.empty-cart p, .empty-orders p {
  margin: 0;
  font-size: 14px;
}

.empty-action-btn {
  padding: 12px 24px;
  border-radius: 10px;
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition);
}

.empty-action-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid var(--color-line);
  transition: all var(--transition);
}

.cart-item:hover {
  box-shadow: 0 4px 16px rgba(58, 40, 27, 0.08);
}

.item-checkbox {
  cursor: pointer;
}

.item-checkbox input {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary);
}

.item-thumb {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(200, 184, 168, 0.1);
}

.item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0;
}

.item-spec {
  font-size: 13px;
  color: var(--color-muted);
  margin: 0;
}

.item-price {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary);
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px;
  background: rgba(200, 184, 168, 0.1);
  border-radius: 10px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  transition: all var(--transition);
}

.qty-btn:hover:not(:disabled) {
  background: rgba(58, 40, 27, 0.08);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary);
  min-width: 32px;
  text-align: center;
}

.item-subtotal {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  min-width: 80px;
  text-align: right;
}

.item-delete {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid var(--color-line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
  transition: all var(--transition);
}

.item-delete:hover {
  background: rgba(255, 100, 100, 0.08);
  color: #FF6464;
  border-color: rgba(255, 100, 100, 0.2);
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid var(--color-line);
  position: sticky;
  bottom: 0;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--color-text);
}

.footer-divider {
  color: var(--color-line);
}

.footer-left strong {
  font-size: 18px;
  color: var(--color-primary);
}

.checkout-btn {
  padding: 14px 32px;
  border-radius: 12px;
  background: var(--color-primary);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  transition: all var(--transition);
}

.checkout-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(58, 40, 27, 0.3);
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.order-card {
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid var(--color-line);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-meta {
  font-size: 13px;
  color: var(--color-muted);
  font-family: 'SF Mono', monospace;
}

.order-status {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.order-status.待付款 {
  background: rgba(58, 40, 27, 0.08);
  color: #8B5A5A;
}

.order-status.待发货 {
  background: rgba(255, 180, 50, 0.08);
  color: #B8860B;
}

.order-status.待收货 {
  background: rgba(50, 180, 255, 0.08);
  color: #2F80ED;
}

.order-status.待评价 {
  background: rgba(100, 180, 50, 0.08);
  color: #5F9E41;
}

.order-status.已完成 {
  background: rgba(200, 184, 168, 0.2);
  color: #8B7355;
}

.order-content {
  display: flex;
  gap: 16px;
}

.order-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.order-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-title {
  font-size: 17px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0;
}

.order-spec {
  font-size: 14px;
  color: var(--color-text);
  margin: 0;
}

.order-shipping {
  font-size: 13px;
  color: var(--color-muted);
  margin: 0;
}

.order-price {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  flex-shrink: 0;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px dashed var(--color-line);
}

.order-date {
  font-size: 13px;
  color: var(--color-muted);
}

.order-actions {
  display: flex;
  gap: 12px;
}

.order-btn {
  padding: 8px 18px;
  border-radius: 8px;
  background: var(--color-primary);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  transition: all var(--transition);
}

.order-btn:hover {
  opacity: 0.9;
}

.order-btn.secondary {
  background: rgba(200, 184, 168, 0.15);
  color: var(--color-text);
}

.order-btn.secondary:hover {
  background: rgba(200, 184, 168, 0.25);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.favorite-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid var(--color-line);
}

.favorite-image {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-info {
  flex: 1;
}

.favorite-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0;
}

.favorite-meta {
  font-size: 13px;
  color: var(--color-muted);
  margin: 4px 0 0;
}

.favorite-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.address-card {
  padding: 20px;
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid var(--color-line);
}

.address-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.address-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0;
}

.default-tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(58, 40, 27, 0.1);
  color: var(--color-primary);
  font-size: 12px;
}

.address-meta {
  font-size: 14px;
  color: var(--color-text);
  margin: 8px 0 16px;
  line-height: 1.6;
}

.address-actions {
  display: flex;
  gap: 12px;
}

.address-btn {
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(200, 184, 168, 0.15);
  color: var(--color-text);
  font-size: 13px;
  transition: all var(--transition);
}

.address-btn:hover {
  background: rgba(200, 184, 168, 0.25);
}

.add-address-btn {
  padding: 20px;
  background: rgba(200, 184, 168, 0.1);
  border-radius: 16px;
  border: 2px dashed var(--color-line);
  color: var(--color-muted);
  font-size: 14px;
  transition: all var(--transition);
}

.add-address-btn:hover {
  background: rgba(200, 184, 168, 0.15);
  border-color: var(--color-secondary);
}

.wallet-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.balance-card {
  padding: 32px;
  background: linear-gradient(135deg, #3A281B, #5C4033);
  border-radius: 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.balance-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  opacity: 0.8;
}

.balance-amount {
  font-size: 48px;
  font-family: 'SF Mono', monospace;
  font-weight: 700;
}

.balance-actions {
  display: flex;
  gap: 12px;
}

.balance-btn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 14px;
  transition: all var(--transition);
}

.balance-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.points-card-section {
  padding: 24px;
  background: rgba(255, 180, 50, 0.06);
  border-radius: 16px;
  border: 1px solid rgba(255, 180, 50, 0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.points-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #B8860B;
}

.points-amount {
  font-size: 36px;
  font-family: 'SF Mono', monospace;
  font-weight: 700;
  color: var(--color-primary);
}

.points-desc {
  font-size: 13px;
  color: var(--color-muted);
  margin: 0;
}

.coupon-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 16px;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coupon-card {
  display: flex;
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid var(--color-line);
  overflow: hidden;
}

.coupon-left {
  width: 140px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(200, 184, 168, 0.2), rgba(200, 184, 168, 0.1));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.coupon-value {
  font-size: 32px;
  font-family: 'SF Mono', monospace;
  font-weight: 700;
  color: var(--color-primary);
}

.coupon-condition {
  font-size: 12px;
  color: var(--color-muted);
}

.coupon-right {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.coupon-right h5 {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0;
}

.coupon-expire {
  font-size: 12px;
  color: var(--color-muted);
}

.help-list, .settings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.help-item, .settings-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-line);
  transition: all var(--transition);
}

.help-item:hover, .settings-item:hover {
  background: rgba(200, 184, 168, 0.1);
}

.help-icon, .settings-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(200, 184, 168, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary);
}

.help-content, .settings-content {
  flex: 1;
}

.help-content h3, .settings-content h3 {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0;
}

.help-content p, .settings-content p {
  font-size: 13px;
  color: var(--color-muted);
  margin: 4px 0 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 31, 20, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid var(--color-line);
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: var(--shadow-soft);
}

.modal-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 12px;
}

.modal-content p {
  font-size: 14px;
  color: var(--color-muted);
  margin: 0 0 24px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition);
}

.modal-btn.cancel {
  background: rgba(200, 184, 168, 0.15);
  color: var(--color-text);
}

.modal-btn.cancel:hover {
  background: rgba(200, 184, 168, 0.25);
}

.modal-btn.confirm {
  background: var(--color-primary);
  color: #fff;
}

.modal-btn.confirm:hover {
  opacity: 0.9;
}

.avatar-modal {
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid rgba(200, 184, 168, 0.2);
  padding: 32px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  box-shadow: var(--shadow-soft);
  position: relative;
}

.avatar-modal h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 8px;
}

.avatar-modal p {
  font-size: 14px;
  color: var(--color-muted);
  margin: 0 0 24px;
}

.close-modal-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(200, 184, 168, 0.1);
  color: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}

.close-modal-btn:hover {
  background: rgba(200, 184, 168, 0.2);
  color: var(--color-primary);
}

.avatar-upload-area {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 2px dashed rgba(200, 184, 168, 0.3);
  background: rgba(200, 184, 168, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto 24px;
  cursor: pointer;
  transition: all var(--transition);
}

.avatar-upload-area:hover {
  border-color: var(--color-secondary);
  background: rgba(200, 184, 168, 0.1);
}

.avatar-upload-area svg {
  color: var(--color-secondary);
}

.avatar-upload-area span {
  font-size: 12px;
  color: var(--color-muted);
}

.avatar-upload-actions {
  display: flex;
  gap: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from .modal-content,
.fade-leave-to .modal-content {
  transform: scale(0.95);
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.3s ease;
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
}

.scale-fade-enter-from .avatar-modal,
.scale-fade-leave-to .avatar-modal {
  transform: scale(0.9);
}

@media (max-width: 960px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  .sidebar {
    order: 2;
  }
  .content-area {
    order: 1;
  }
  .quick-actions {
    justify-content: center;
  }
  .action-btn {
    min-width: 80px;
    padding: 16px 12px;
  }
  .user-stats {
    flex-direction: column;
  }
  .stat-card {
    max-width: 100%;
  }
  .order-content {
    flex-direction: column;
  }
  .order-image {
    width: 100%;
    height: 160px;
  }
  .cart-item {
    flex-wrap: wrap;
  }
  .item-info {
    flex: 1;
    min-width: 0;
  }
  .cart-footer {
    flex-direction: column;
    gap: 12px;
  }
}
</style>

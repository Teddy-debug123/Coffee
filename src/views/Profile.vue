<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { ElButton, ElCard, ElIcon, ElMenu, ElMenuItem } from 'element-plus'
import { 
  User, 
  Setting, 
  ShoppingCart, 
  Place, 
  Star, 
  Help, 
  Wallet,
  ZoomOut,
  ArrowRight
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

// 用户信息
const userInfo = ref({
  name: '咖啡爱好者',
  email: 'coffee@example.com',
  memberLevel: 'VIP会员',
  points: 2680,
  avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=elegant%20coffee%20lover%20avatar%20portrait%20minimalist%20style%20warm%20tones&image_size=square'
})

// 订单统计
const orderStats = ref([
  { label: '待付款', count: 2, icon: ShoppingCart },
  { label: '待发货', count: 1, icon: ShoppingCart },
  { label: '待收货', count: 3, icon: ShoppingCart },
  { label: '待评价', count: 5, icon: ShoppingCart }
])

// 菜单列表
const menuItems = [
  { name: '我的订单', icon: ShoppingCart, path: '/profile/orders' },
  { name: '收货地址', icon: Place, path: '/profile/address' },
  { name: '我的收藏', icon: Star, path: '/profile/favorites' },
  { name: '我的钱包', icon: Wallet, path: '/profile/wallet' },
  { name: '帮助中心', icon: Help, path: '/profile/help' },
  { name: '设置', icon: Setting, path: '/profile/settings' }
]

// 退出登录
const logout = () => {
  userStore.logout()
  router.push('/login')
}

onMounted(() => {
  // 可以在这里获取用户信息
})
</script>

<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="header-bg"></div>
      <div class="profile-info">
        <div class="avatar-wrapper">
          <img :src="userInfo.avatar" :alt="userInfo.name" class="avatar" />
          <div class="member-badge">{{ userInfo.memberLevel }}</div>
        </div>
        <div class="user-details">
          <h2 class="user-name">{{ userInfo.name }}</h2>
          <p class="user-email">{{ userInfo.email }}</p>
          <div class="user-points">
            <span class="points-label">积分</span>
            <span class="points-value">{{ userInfo.points }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- 订单统计 -->
      <ElCard class="order-stats-card">
        <div class="order-stats">
          <div 
            v-for="stat in orderStats" 
            :key="stat.label" 
            class="stat-item"
          >
            <div class="stat-icon">
              <ElIcon :size="20" color="#8B7355">
                <component :is="stat.icon" />
              </ElIcon>
            </div>
            <div class="stat-info">
              <span class="stat-count">{{ stat.count }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </ElCard>

      <!-- 功能菜单 -->
      <ElCard class="menu-card">
        <ElMenu mode="vertical" class="profile-menu">
          <ElMenuItem 
            v-for="item in menuItems" 
            :key="item.name"
            class="menu-item"
            @click="router.push(item.path)"
          >
            <ElIcon :size="18" color="#6B5B4F" class="menu-icon">
              <component :is="item.icon" />
            </ElIcon>
            <span class="menu-text">{{ item.name }}</span>
            <ArrowRight :size="16" color="#C4A77D" class="menu-arrow" />
          </ElMenuItem>
        </ElMenu>
      </ElCard>

      <!-- 退出登录 -->
      <ElCard class="logout-card">
        <ElButton 
          class="logout-btn" 
          @click="logout"
        >
          <ElIcon :size="18" class="logout-icon">
            <ZoomOut />
          </ElIcon>
          <span>退出登录</span>
        </ElButton>
      </ElCard>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.profile-header {
  position: relative;
  padding: 3rem 0 4rem;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 220px;
  background: linear-gradient(135deg, var(--coffee-primary) 0%, var(--coffee-accent) 100%);
}

.profile-info {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0 var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.member-badge {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #FAAD14 0%, #FA8C16 100%);
  color: #fff;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  white-space: nowrap;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 500;
  color: #fff;
  margin: 0 0 0.5rem 0;
}

.user-email {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1rem 0;
}

.user-points {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.points-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
}

.points-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #FFD700;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  margin-top: -2rem;
}

.order-stats-card {
  background: var(--bg-card);
  border: none;
  border-radius: var(--radius-lg);
  margin-bottom: 1rem;
  padding: 1.5rem;
}

.order-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  text-align: center;
}

.stat-count {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--coffee-primary);
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.menu-card {
  background: var(--bg-card);
  border: none;
  border-radius: var(--radius-lg);
  margin-bottom: 1rem;
  padding: 0;
}

.profile-menu {
  border: none;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--bg-secondary);
  margin: 0;
  transition: background var(--transition-fast);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: var(--bg-secondary);
}

.menu-icon {
  margin-right: 1rem;
}

.menu-text {
  flex: 1;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.menu-arrow {
  flex-shrink: 0;
}

.logout-card {
  background: var(--bg-card);
  border: none;
  border-radius: var(--radius-lg);
  padding: 1rem 1.5rem;
}

.logout-btn {
  width: 100%;
  background: transparent;
  border: 1px solid var(--coffee-muted);
  color: var(--coffee-muted);
  padding: 1rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
}

.logout-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--coffee-accent);
  color: var(--coffee-accent);
}

.logout-icon {
  margin-right: 0;
}

@media (max-width: 768px) {
  .profile-header {
    padding: 2rem 0 3rem;
  }
  
  .header-bg {
    height: 180px;
  }
  
  .profile-info {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
  }
  
  .user-name {
    font-size: 1.25rem;
  }
  
  .order-stats {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .stat-item {
    flex: 1;
    min-width: 80px;
  }
}
</style>
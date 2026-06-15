<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { ShoppingCart, Menu, Close } from '@element-plus/icons-vue'

const emit = defineEmits(['toggleMenu', 'toggleCart'])

const router = useRouter()
const cartStore = useCartStore()

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const navigateTo = (path) => {
  router.push(path)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  emit('toggleMenu', isMobileMenuOpen.value)
}

const toggleCart = () => {
  emit('toggleCart')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar-container">
      <div class="navbar-brand" @click="navigateTo('/')">
        <span class="brand-text">COFFEE</span>
        <span class="brand-accent">ONLINE</span>
      </div>
      
      <div class="navbar-links">
        <a href="/home" class="nav-link" @click.prevent="navigateTo('/home')">首页</a>
        <a href="/origin-map" class="nav-link" @click.prevent="navigateTo('/origin-map')">咖啡产地地图</a>
        <a href="/equipment" class="nav-link" @click.prevent="navigateTo('/equipment')">咖啡器具</a>
        <a href="/stores" class="nav-link" @click.prevent="navigateTo('/stores')">线下门店</a>
        <a href="/profile" class="nav-link" @click.prevent="navigateTo('/profile')">个人中心</a>
      </div>
      
      <div class="navbar-actions">
        <button class="cart-btn" @click="toggleCart">
          <ShoppingCart :size="20" />
          <span v-if="cartStore.totalCount > 0" class="cart-badge">{{ cartStore.totalCount }}</span>
        </button>
        <button class="login-btn" @click="navigateTo('/login')">登录</button>
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <Menu v-if="!isMobileMenuOpen" :size="24" />
          <Close v-else :size="24" />
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1rem 2rem;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  cursor: pointer;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 300;
  color: #2D1F14;
  letter-spacing: 0.1em;
}

.brand-accent {
  font-size: 0.875rem;
  font-weight: 500;
  color: #8B7355;
  letter-spacing: 0.2em;
}

.navbar-links {
  display: flex;
  gap: 2.5rem;
}

.nav-link {
  font-size: 0.9rem;
  color: #5C4033;
  text-decoration: none;
  position: relative;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #2D1F14;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #8B7355;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cart-btn {
  position: relative;
  background: none;
  border: none;
  color: #5C4033;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.cart-btn:hover {
  background: rgba(45, 31, 20, 0.05);
  color: #2D1F14;
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 18px;
  height: 18px;
  background: #8B7355;
  color: #fff;
  font-size: 0.625rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.3rem;
}

.login-btn {
  background: #2D1F14;
  color: #fff;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: #3D2914;
  transform: translateY(-2px);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: #2D1F14;
  cursor: pointer;
  padding: 0.5rem;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(45, 31, 20, 0.08);
  padding: 0.75rem 2rem;
}

.navbar.scrolled .brand-text {
  color: #2D1F14;
}

.navbar.scrolled .nav-link {
  color: #5C4033;
}

@media (max-width: 960px) {
  .navbar-links {
    display: none;
  }
  
  .login-btn {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .navbar {
    padding: 1rem 1.5rem;
  }
  
  .navbar.scrolled {
    padding: 0.75rem 1.5rem;
  }
}
</style>
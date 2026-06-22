<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { ShoppingCart, Menu, Close } from '@element-plus/icons-vue'

const emit = defineEmits(['toggleMenu', 'toggleCart'])
const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const userStore = useUserStore()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const links = [{ label: '首页', path: '/home' }, { label: '咖啡产地地图', path: '/origin-map' }, { label: '咖啡器具', path: '/equipment' }, { label: '个人中心', path: '/profile' }]
const activePath = computed(() => route.path)
const handleScroll = () => { isScrolled.value = window.scrollY > 24 }
const navigateTo = (path) => router.push(path)
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value; emit('toggleMenu', isMobileMenuOpen.value) }
const toggleCart = () => emit('toggleCart')
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar-container">
      <div class="navbar-brand" @click="navigateTo('/home')">
        <span class="brand-text">COFFEE</span>
        <span class="brand-accent">ONLINE</span>
      </div>
      <div class="navbar-links">
        <a v-for="link in links" :key="link.path" href="#" class="nav-link" :class="{ active: activePath === link.path }" @click.prevent="navigateTo(link.path)">
          {{ link.label }}
        </a>
      </div>
      <div class="navbar-actions">
        <button class="cart-btn" @click="toggleCart" :class="{ 'has-items': cartStore.totalCount > 0 }">
          <ShoppingCart :size="22" />
          <span v-if="cartStore.totalCount > 0" class="cart-badge">{{ cartStore.totalCount }}</span>
        </button>
        <button v-if="!userStore.isLoggedIn" class="login-btn" @click="navigateTo('/login')">登录</button>
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
  inset: 0 0 auto 0; 
  z-index: 999; 
  padding: 20px 0; 
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); 
}
.navbar-container { 
  max-width: 1680px; 
  margin: 0 auto; 
  padding: 0 var(--page-padding); 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  gap: 24px; 
}
.navbar-brand { 
  display: flex; 
  align-items: baseline; 
  gap: 8px; 
  cursor: pointer; 
}
.brand-text { font-size: 18px; letter-spacing: 0.22em; color: #4A3C31; }
.brand-accent { font-size: 12px; letter-spacing: 0.26em; color: #B8A999; }
.navbar-links { display: flex; gap: 28px; }
.nav-link { 
  position: relative; 
  padding: 10px 0; 
  color: #4A3C31; 
  font-size: 14px; 
  font-weight: 500;
}
.nav-link::after { 
  content: ''; 
  position: absolute; 
  left: 0; 
  bottom: 0; 
  width: 100%; 
  height: 2px; 
  transform: scaleX(0); 
  transform-origin: left; 
  background: #59473A; 
  transition: transform 0.3s ease; 
}
.nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
.navbar-actions { display: flex; align-items: center; gap: 16px; }
.cart-btn, .login-btn, .mobile-menu-btn { background: transparent; color: #4A3C31; }
.cart-btn { 
  position: relative; 
  width: 44px; 
  height: 44px; 
  border-radius: 14px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(184, 169, 153, 0.25);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.cart-btn:hover { 
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(58, 40, 27, 0.12);
}
.cart-btn.has-items {
  background: rgba(245, 240, 232, 0.95);
}
.cart-badge { 
  position: absolute; 
  top: -6px; 
  right: -6px; 
  min-width: 22px; 
  height: 22px; 
  padding: 0 6px; 
  border-radius: 11px; 
  background: #59473A; 
  color: white; 
  font-size: 11px; 
  font-weight: 700; 
  display: grid; 
  place-items: center; 
  box-shadow: 0 2px 8px rgba(58, 40, 27, 0.25); 
  animation: badge-pop 0.3s ease-out;
}
@keyframes badge-pop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.login-btn { 
  padding: 10px 18px; 
  border-radius: 10px; 
  background: #59473A; 
  color: #fff; 
  font-weight: 600;
  transition: all 0.3s ease;
}
.login-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(58, 40, 27, 0.2);
}
.mobile-menu-btn { display: none; }
.navbar.scrolled { 
  background: rgba(245, 240, 232, 0.92); 
  backdrop-filter: blur(20px); 
  box-shadow: 0 8px 24px rgba(58, 40, 27, 0.08); 
}
@media (max-width: 960px) { 
  .navbar-links, .login-btn { display: none; } 
  .mobile-menu-btn { display: inline-flex; } 
  .navbar-container { padding: 0 24px; }
  .cart-btn {
    width: 40px;
    height: 40px;
  }
}
</style>

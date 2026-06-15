<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { Close, HomeFilled, Coffee, MapLocation, User, ShoppingBag } from '@element-plus/icons-vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const router = useRouter()

const menuItems = [
  { name: '首页', icon: HomeFilled, path: '/home' },
  { name: '咖啡器具', icon: Coffee, path: '/equipment' },
  { name: '线下门店', icon: MapLocation, path: '/stores' },
  { name: '个人中心', icon: User, path: '/profile' },
  { name: '购物车', icon: ShoppingBag, path: '/cart' }
]

const navigateTo = (path) => {
  router.push(path)
  emit('close')
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Transition name="slide">
    <div v-if="isOpen" class="side-menu-overlay" @click="emit('close')">
      <div class="side-menu" @click.stop>
        <div class="menu-header">
          <span class="menu-brand">COFFEE ONLINE</span>
          <button class="close-btn" @click="emit('close')">
            <Close :size="24" />
          </button>
        </div>
        
        <nav class="menu-nav">
          <ul class="menu-list">
            <li 
              v-for="(item, index) in menuItems" 
              :key="item.path" 
              class="menu-item"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <button class="menu-link" @click="navigateTo(item.path)">
                <component :is="item.icon" :size="20" />
                <span>{{ item.name }}</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div class="menu-footer">
          <button class="login-btn" @click="navigateTo('/login')">登录 / 注册</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.side-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(45, 31, 20, 0.4);
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.side-menu {
  position: absolute;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(45, 31, 20, 0.1);
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #F5F3EF;
}

.menu-brand {
  font-size: 0.875rem;
  font-weight: 500;
  color: #2D1F14;
  letter-spacing: 0.15em;
}

.close-btn {
  background: none;
  border: none;
  color: #5C4033;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #F5F3EF;
  color: #2D1F14;
}

.menu-nav {
  flex: 1;
  padding: 1.5rem 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  opacity: 0;
  animation: slideInFromRight 0.4s ease forwards;
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  text-align: left;
  font-size: 1rem;
  color: #5C4033;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-link:hover {
  background: #F5F3EF;
  color: #2D1F14;
  padding-left: 2rem;
}

.menu-footer {
  padding: 1.5rem;
  border-top: 1px solid #F5F3EF;
}

.login-btn {
  width: 100%;
  background: #2D1F14;
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: #3D2914;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .side-menu,
.slide-leave-to .side-menu {
  transform: translateX(100%);
}

@media (min-width: 961px) {
  .side-menu-overlay {
    display: none;
  }
}
</style>
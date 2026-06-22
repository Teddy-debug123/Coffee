<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { audioManager } from '../utils/audio'
import { ElMessageBox } from 'element-plus'
const props = defineProps({ bean: { type: Object, required: true } })
const cartStore = useCartStore()
const userStore = useUserStore()
const router = useRouter()
const isHovered = ref(false)
const isAdding = ref(false)
const cardRef = ref(null)
const rotation = reactive({ x: 0, y: 0 })
const handleMouseMove = (e) => {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  rotation.x = -y * 8
  rotation.y = x * 8
}
const handleMouseLeave = () => {
  rotation.x = 0
  rotation.y = 0
}
const handleAddToCart = async () => {
  if (!userStore.isLoggedIn) {
    await ElMessageBox.confirm('需要登录后才能加入购物车', '提示', {
      confirmButtonText: '去登录',
      cancelButtonText: '继续浏览',
      type: 'info'
    }).then(() => {
      router.push('/login?redirect=' + encodeURIComponent(router.currentRoute.value.fullPath))
    }).catch(() => {})
    return
  }
  if (isAdding.value) return
  isAdding.value = true
  audioManager.playClick()
  await cartStore.addItem(props.bean)
  setTimeout(() => { isAdding.value = false }, 500)
}
const openDetail = () => {
  const routes = {
    1: '/coffee-bean/ethiopia-yirgacheffe/1',
    2: '/coffee-bean/colombia-huilan/2',
    3: '/coffee-bean/brazil-santos/3',
    4: '/coffee-bean/guatemala-antigua/4',
    5: '/coffee-bean/kenya-aa-neri/5',
    6: '/coffee-bean/panama-geisha/6',
    7: '/coffee-bean/costa-rica/7',
    8: '/coffee-bean/ethiopia-hambella/8',
    9: '/coffee-bean/indonesia-mandarin/9',
    10: '/coffee-bean/peru-bourbon/10'
  }
  router.push(routes[props.bean.id] || `/product/${props.bean.id}`)
}
</script>

<template>
  <div class="coffee-bean-card" :class="{ hovered: isHovered, adding: isAdding }" :style="{ transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }" ref="cardRef" @mouseenter="isHovered = true" @mouseleave="isHovered = false; handleMouseLeave()" @mousemove="handleMouseMove" @click="openDetail">
    <div class="card-image-wrapper">
      <img :src="bean.image" :alt="bean.name" class="card-image" loading="lazy" />
      <button class="quick-add" @click.stop="handleAddToCart">加入购物车</button>
    </div>
    <div class="card-content">
      <div class="origin-badge">{{ bean.origin }}</div>
      <h3 class="card-title">{{ bean.name }}</h3>
      <p class="card-description">{{ bean.description }}</p>
      <div class="card-footer"><div class="price"><span class="currency">¥</span><span class="amount">{{ bean.price }}</span><span class="unit">/{{ bean.weight }}</span></div><div class="rating"><span class="stars">★★★★★</span><span class="count">{{ bean.rating }}</span></div></div>
    </div>
  </div>
</template>

<style scoped>
.coffee-bean-card { height: 440px; display: flex; flex-direction: column; overflow: hidden; background: var(--color-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-soft); border: 1px solid var(--color-line); transition: transform 0.3s ease-out, box-shadow 0.3s ease-out; cursor: pointer; transform-style: preserve-3d; }
.coffee-bean-card:hover { box-shadow: var(--shadow-hover); }
.card-image-wrapper { position: relative; height: 220px; flex-shrink: 0; background: linear-gradient(135deg, rgba(200,184,168,0.24), rgba(248,245,240,0.92)); }
.card-image { width: 100%; height: 100%; object-fit: cover; transition: transform 380ms ease; }
.coffee-bean-card:hover .card-image { transform: scale(1.05); }
.quick-add { position: absolute; right: 16px; bottom: 16px; padding: 10px 14px; border-radius: 999px; background: rgba(58,40,27,0.92); color: #fff; font-size: 12px; opacity: 0; transform: translateY(8px); transition: opacity var(--transition), transform var(--transition); }
.coffee-bean-card:hover .quick-add { opacity: 1; transform: translateY(0); }
.card-content { flex: 1; padding: var(--card-padding) var(--card-padding) var(--card-padding) 28px; display: flex; flex-direction: column; gap: 12px; }
.origin-badge { display: inline-flex; width: fit-content; padding: 4px 10px; border-radius: 999px; background: rgba(200,184,168,0.24); color: var(--color-primary); font-size: var(--fs-small); }
.card-title { font-size: var(--fs-h3); color: var(--color-primary); line-height: 1.4; }
.card-description { color: var(--color-text); font-size: var(--fs-body); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex-shrink: 0; }
.card-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.amount { font-size: var(--fs-price); font-weight: 700; color: var(--color-primary); }
.unit, .currency, .count { color: var(--color-muted); font-size: var(--fs-small); }
</style>

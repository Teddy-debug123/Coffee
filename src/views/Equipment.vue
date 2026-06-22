<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { audioManager } from '../utils/audio'
import NavBar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import CartSidebar from '../components/CartSidebar.vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const activeCategory = ref('全部')
const categories = ['全部', '咖啡机', '冲煮器具', '研磨器具', '杯具', '辅助器具']
const equipmentList = ref([
  { id: 1, name: 'Breville 870 意式咖啡机', category: '咖啡机', price: 4999, weight: '8.5kg', image: '/picture/store1.png', description: '双锅炉系统，精准控温，专业奶泡系统' },
  { id: 2, name: 'Hario V60 手冲壶', category: '冲煮器具', price: 299, weight: '600ml', image: '/picture/store2.png', description: '细长壶嘴，精准控水，不锈钢材质' },
  { id: 3, name: 'Baratza Encore 磨豆机', category: '研磨器具', price: 1299, weight: '2.5kg', image: '/picture/store3.png', description: '锥形刀盘，40档研磨调节' },
  { id: 4, name: 'Wedgwood 骨瓷咖啡杯', category: '杯具', price: 368, weight: '2件套装', image: '/picture/store4.png', description: '英国骨瓷，精致雕花，礼盒包装' },
  { id: 5, name: 'Hario V60 陶瓷滤杯', category: '冲煮器具', price: 128, weight: '1-4人份', image: '/picture/store5.png', description: '螺旋导流槽，均匀萃取' },
  { id: 6, name: 'Milk Boss 电动奶泡器', category: '辅助器具', price: 199, weight: '180W', image: '/picture/store6.png', description: '高速旋转，绵密奶泡，一键操作' },
  { id: 7, name: 'Chemex 手冲壶', category: '冲煮器具', price: 358, weight: '600ml', image: '/picture/store7.png', description: '玻璃材质，经典设计，醇厚口感' },
  { id: 8, name: 'AeroPress 爱乐压', category: '冲煮器具', price: 268, weight: '轻便便携', image: '/picture/store8.png', description: '便携设计，快速萃取，浓郁风味' }
])
const filteredEquipment = computed(() => activeCategory.value === '全部' ? equipmentList.value : equipmentList.value.filter(item => item.category === activeCategory.value))
const selectCategory = (category) => { activeCategory.value = category }
const handleAddToCart = async (equipment) => {
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
  audioManager.playClick()
  await cartStore.addItem(equipment)
}
const openDetail = (equipment) => router.push(`/tool/detail/${equipment.id}`)
onMounted(() => { if (userStore.isLoggedIn) cartStore.loadCart() })
</script>

<template>
  <div class="equipment-page">
    <NavBar @toggle-menu="isMenuOpen = true" @toggle-cart="isCartOpen = true" />
    <SideMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
    <CartSidebar :is-open="isCartOpen" @close="isCartOpen = false" />

    <section class="banner-section">
      <img src="/picture/slide-3.png" alt="Coffee Equipment" class="banner-image" loading="lazy" />
    </section>

    <section class="container section-block">
      <div class="section-head">
        <div>
          <h2 class="section-title">Professional Equipment</h2>
          <p class="section-subtitle">专业咖啡器具</p>
        </div>
      </div>
    </section>

    <section class="container section-block">
      <div class="equipment-grid">
        <article v-for="equipment in filteredEquipment" :key="equipment.id" class="equipment-card card" @click="openDetail(equipment)">
          <div class="image-wrap">
            <img :src="equipment.image" :alt="equipment.name" loading="lazy" />
            <button class="quick-add" @click.stop="handleAddToCart(equipment)">加入购物车</button>
          </div>
          <div class="content">
            <span class="tag">{{ equipment.category }}</span>
            <h3 class="name">{{ equipment.name }}</h3>
            <p class="detail">{{ equipment.description }}</p>
            <div class="footer"><span class="price">¥{{ equipment.price }}</span><span class="meta">{{ equipment.weight }}</span></div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.equipment-page{min-height:100vh;background:var(--color-bg);padding-bottom:120px}
.banner-section{width:100%;display:flex;align-items:center;justify-content:center}
.banner-image{width:100%;max-width:1920px;height:auto;aspect-ratio:1920/450;object-fit:cover}
.section-block{padding-top:var(--section-gap)}
.section-head{display:flex;justify-content:center;align-items:flex-end;padding:24px 0;margin-bottom:12px;border-bottom:1px solid var(--color-line)}
.section-head > div{text-align:center}
.section-head h2{font-size:var(--fs-h2);font-family:var(--font-display);color:var(--color-primary);margin:0}
.section-head p{font-size:var(--fs-body);color:var(--color-muted);margin:4px 0 0}
.equipment-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.equipment-card{height:440px;display:flex;flex-direction:column;padding:0;overflow:hidden;cursor:pointer;transition:transform var(--transition),box-shadow var(--transition)}
.equipment-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-hover)}
.image-wrap{position:relative;flex-shrink:0;background:linear-gradient(135deg, rgba(200,184,168,.24), rgba(248,245,240,.95));aspect-ratio:4/3}
.image-wrap img{width:100%;height:100%;object-fit:cover;transition:transform .35s ease}
.equipment-card:hover img{transform:scale(1.05)}
.quick-add{position:absolute;right:16px;bottom:16px;padding:10px 14px;border-radius:999px;background:rgba(58,40,27,.92);color:#fff;font-size:var(--fs-small);opacity:0;transform:translateY(8px);transition:opacity var(--transition),transform var(--transition)}
.equipment-card:hover .quick-add{opacity:1;transform:translateY(0)}
.content{flex:1;padding:var(--card-padding) var(--card-padding) var(--card-padding) 28px;display:flex;flex-direction:column;gap:12px}
.tag{display:inline-flex;width:fit-content;padding:4px 10px;border-radius:999px;background:rgba(200,184,168,.24);font-size:var(--fs-small);color:var(--color-primary)}
.name{font-size:var(--fs-h3);color:var(--color-primary);line-height:1.4}
.detail{color:var(--color-text);font-size:var(--fs-body);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;flex-shrink:0}
.footer{margin-top:auto;display:flex;justify-content:space-between;gap:12px;align-items:center}
.price{font-size:var(--fs-price);font-weight:700;color:var(--color-primary)}
.meta{font-size:var(--fs-small);color:var(--color-muted)}
</style>

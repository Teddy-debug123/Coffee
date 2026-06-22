<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { Close, Plus, ArrowRight } from '@element-plus/icons-vue'
import { origin } from '../api'
import NavBar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import CartSidebar from '../components/CartSidebar.vue'
import WorldMap from '../components/WorldMap.vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const selectedOrigin = ref(null)
const isModalOpen = ref(false)
const scrollY = ref(0)
const origins = ref([
  { id: 1, name: '耶加雪菲', nameEn: 'Yirgacheffe', x: 38, y: 15, origin: '埃塞俄比亚', description: '位于埃塞俄比亚西南部，海拔1800-2200米，以茉莉花和柑橘香气著称' },
  { id: 2, name: '肯尼亚AA', nameEn: 'Kenya AA', x: 42, y: 28, origin: '肯尼亚', description: '产自肯尼亚高原，海拔1500-1800米，黑醋栗与红酒般的酸度是其标志性特征' },
  { id: 3, name: '哥伦比亚慧兰', nameEn: 'Huila', x: 8, y: 50, origin: '哥伦比亚', description: '哥伦比亚优质产区，海拔1600-2000米，均衡柔和，坚果焦糖风味' },
  { id: 4, name: '巴西喜拉朵', nameEn: 'Cerrado', x: 5, y: 42, origin: '巴西', description: '巴西最大产区，海拔1000-1200米，醇厚饱满，巧克力风味' },
  { id: 5, name: '危地马拉安提瓜', nameEn: 'Antigua', x: 12, y: 55, origin: '危地马拉', description: '火山土壤产区，海拔1500-1700米，烟熏可可风味，层次丰富' },
  { id: 6, name: '印尼曼特宁', nameEn: 'Mandheling', x: 85, y: 40, origin: '印尼', description: '苏门答腊岛产区，海拔1100-1500米，草本香气，浓郁醇厚' },
  { id: 7, name: '云南普洱', nameEn: 'Yunnan', x: 72, y: 25, origin: '中国云南', description: '中国精品咖啡代表，海拔1300-1600米，红糖甜感，柔和花香' },
  { id: 8, name: '哥斯达黎加', nameEn: 'Tarrazu', x: 15, y: 52, origin: '哥斯达黎加', description: '塔拉珠产区，海拔1500-1800米，明亮酸度，水果风味丰富' }
])
const featuredOrigins = ref([
  { id: 1, originId: 1, name: '耶加雪菲', origin: '埃塞俄比亚', price: 68, weight: '100g', rating: 4.9, description: '花香浓郁，柑橘酸甜，蜂蜜余韵', image: '/picture/yejiaxuefei.png', category: 'single_bean', routeName: 'YirgacheffeDetail', uniqueBeanId: 1 },
  { id: 5, originId: 2, name: '肯尼亚AA', origin: '肯尼亚', price: 72, weight: '100g', rating: 4.8, description: '黑醋栗风味，明亮酸度，红酒般复杂', image: '/picture/kenniya.png', category: 'single_bean', routeName: 'KenyaAADetail', uniqueBeanId: 2 }
])
const rareOrigins = ref([
  { id: 9, originId: 6, name: '曼特宁', origin: '印尼', price: 46, weight: '100g', rating: 4.7, description: '草本香气，浓郁醇厚，低酸度', image: '/picture/mantening.png', category: 'single_bean', routeName: 'MandarinDetail', uniqueBeanId: 9 },
  { id: 4, originId: 5, name: '安提瓜', origin: '危地马拉', price: 62, weight: '100g', rating: 4.8, description: '火山土壤，烟熏风味，黑巧克力', image: '/picture/antigua.png', category: 'single_bean', routeName: 'AntiguaDetail', uniqueBeanId: 4 }
])
const blendOrigins = ref([
  { id: 2, originId: 3, name: '哥伦比亚蕙兰', origin: '哥伦比亚', price: 52, weight: '100g', rating: 4.6, description: '均衡柔和，坚果焦糖，日常优选', image: '/picture/antigua.png', category: 'single_bean', routeName: 'HuilanDetail', uniqueBeanId: 2 },
  { id: 3, originId: 4, name: '巴西桑托斯', origin: '巴西', price: 36, weight: '100g', rating: 4.5, description: '醇厚饱满，巧克力风味，性价比高', image: '/picture/mantening.png', category: 'single_bean', routeName: 'SantosDetail', uniqueBeanId: 3 },
  { id: 7, originId: 7, name: '哥斯达黎加', origin: '哥斯达黎加', price: 58, weight: '100g', rating: 4.6, description: '蜜饯甜感，柔和果汁，特色精品', image: '/picture/kenniya.png', category: 'single_bean', routeName: 'CostaRicaDetail', uniqueBeanId: 7 }
])
const handleOriginClick = (originItem) => { selectedOrigin.value = originItem; isModalOpen.value = true }
const closeModal = () => { isModalOpen.value = false; selectedOrigin.value = null }
const addToCart = async (product) => {
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
  cartStore.addItem({ id: product.id, name: product.name, price: product.price, origin: product.origin, image: product.image, weight: product.weight, category: 'coffee' })
}
const handleScroll = () => { scrollY.value = window.scrollY }
const loadOrigins = async () => {
  try {
    const data = await origin.getPoints()
    if (Array.isArray(data) && data.length > 0) {
      origins.value = data
    }
  } catch {}
}
const openProduct = (originItem) => {
  if (originItem.category === 'single_bean' && originItem.routeName && originItem.uniqueBeanId) {
    router.push({
      name: originItem.routeName,
      params: { beanId: originItem.uniqueBeanId }
    })
  } else if (originItem.id && originItem.name) {
    const matchedProduct = [...featuredOrigins.value, ...rareOrigins.value, ...blendOrigins.value].find(p => p.originId === originItem.id)
    if (matchedProduct && matchedProduct.routeName && matchedProduct.uniqueBeanId) {
      router.push({
        name: matchedProduct.routeName,
        params: { beanId: matchedProduct.uniqueBeanId }
      })
    } else {
      const firstProduct = [...featuredOrigins.value, ...rareOrigins.value, ...blendOrigins.value][0]
      if (firstProduct && firstProduct.routeName && firstProduct.uniqueBeanId) {
        router.push({
          name: firstProduct.routeName,
          params: { beanId: firstProduct.uniqueBeanId }
        })
      }
    }
  }
}
onMounted(() => { window.addEventListener('scroll', handleScroll); loadOrigins() })
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <div class="origin-map-container">
    <NavBar @toggleMenu="isMenuOpen = true" @toggleCart="isCartOpen = true" />
    <SideMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
    <CartSidebar :is-open="isCartOpen" @close="isCartOpen = false" />

    <section class="banner-section">
      <img src="/picture/slide-1.png" alt="Coffee Origins" class="banner-image" loading="lazy" />
    </section>

    <section class="map-featured-section">
      <div class="map-side" :style="{ transform: `translateY(${scrollY * 0.04}px)` }">
        <div class="map-container card">
          <WorldMap :origins="origins" @origin-click="handleOriginClick" />
        </div>
      </div>
      <div class="featured-side">
        <div class="section-header"><div><h2 class="section-title">当季主推产区</h2><p class="section-desc">精选本季最佳风味</p></div></div>
        <div class="featured-grid"><div v-for="item in featuredOrigins" :key="item.id" class="product-card card" @click="openProduct(item)"><div class="card-image"><img :src="item.image" :alt="item.name" loading="lazy" /></div><div class="card-content"><h3 class="card-title">{{ item.name }}</h3><p class="card-origin">{{ item.origin }}</p><p class="card-desc">{{ item.description }}</p><div class="card-footer"><div class="price"><span class="currency">¥</span><span class="amount">{{ item.price }}</span><span class="unit">/{{ item.weight }}</span></div><button class="add-cart-btn" @click.stop="addToCart(item)"><el-icon class="cart-icon"><Plus /></el-icon><span class="btn-text">加入购物车</span></button></div></div></div></div>
      </div>
    </section>

    <section class="container section-block"><div class="section-header"><div><h2 class="section-title">珍稀单一产地豆</h2><p class="section-desc">限量供应，品质卓越</p></div></div><div class="rare-list"><div v-for="item in rareOrigins" :key="item.id" class="rare-item card" @click="openProduct(item)"><div class="rare-image"><img :src="item.image" :alt="item.name" loading="lazy" /></div><div class="rare-info"><h3 class="rare-title">{{ item.name }}</h3><p class="rare-origin">{{ item.origin }}</p><p class="rare-desc">{{ item.description }}</p></div><div class="rare-action"><span class="rare-price">¥{{ item.price }}/{{ item.weight }}</span><button class="rare-btn" @click.stop="addToCart(item)">加入购物车</button></div></div></div></section>

    <section class="container section-block blend-section"><div class="section-header"><div><h2 class="section-title blend-section-title">经典拼配原料产地</h2><p class="section-desc">匠心调配，风味均衡</p></div></div><div class="blend-grid"><div v-for="(item, index) in blendOrigins" :key="item.id" class="blend-card card" :data-index="index" @click="openProduct(item)"><div class="blend-card-inner"><div class="blend-card-left"><div class="blend-card-image"><img :src="item.image" :alt="item.name" loading="lazy" /></div><div class="blend-card-info"><h3 class="blend-title">{{ item.name }}</h3><p class="blend-desc">{{ item.description }}</p><div class="blend-price"><span class="currency">¥</span><span class="amount">{{ item.price }}</span><span class="unit">/{{ item.weight }}</span></div></div></div><div class="blend-card-right"><span class="blend-origin-tag">{{ item.origin }}</span><button class="blend-select-btn" @click.stop="addToCart(item)">选购 <ArrowRight :size="16" /></button></div></div></div></div></section>

    <Transition name="modal"><div v-if="isModalOpen" class="modal-overlay" @click="closeModal"><div class="origin-modal card" @click.stop><button class="modal-close" @click="closeModal"><Close :size="20" /></button><div class="modal-header"><div class="origin-badge"></div><div class="origin-title-wrap"><h2 class="modal-title">{{ selectedOrigin?.name }}</h2><span class="modal-subtitle">{{ selectedOrigin?.nameEn }}</span></div></div><div class="modal-body"><p class="origin-desc">{{ selectedOrigin?.description }}</p><div class="origin-products"><div class="product-item" v-for="product in featuredOrigins.filter(p => p.originId === selectedOrigin?.id)" :key="product.id"><div class="product-thumb"><img :src="product.image" :alt="product.name" /></div><div class="product-info"><span>{{ product.name }}</span><span>¥{{ product.price }}/{{ product.weight }}</span></div><button class="product-add" @click="addToCart(product)"><Plus :size="14" /></button></div></div><button class="open-detail btn" @click="openProduct(selectedOrigin)">查看全部商品</button></div></div></div></Transition>
  </div>
</template>

<style scoped>
.origin-map-container{min-height:100vh;background:var(--color-bg);padding-bottom:120px}
.banner-section{width:100%;display:flex;align-items:center;justify-content:center}
.banner-image{width:100%;max-width:1920px;height:auto;aspect-ratio:1920/450;object-fit:cover}
.map-featured-section{display:grid;grid-template-columns:1fr 1fr;gap:32px;padding:40px var(--page-padding);max-width:1400px;margin:0 auto;align-items:start}
.map-side{display:flex;justify-content:flex-start;padding-top:82px;padding-left:20px}
.map-container{position:relative;width:750px;height:580px;overflow:hidden;background:var(--color-bg);margin:10px;border:10px solid #3A281B;border-radius:var(--radius-lg);box-shadow:var(--shadow-soft)}
.featured-side{display:flex;flex-direction:column;gap:24px}
.section-block{padding-top:var(--section-gap)}
.section-header{display:flex;justify-content:center;margin-bottom:24px}
.section-header > div{text-align:center}
.featured-grid,.blend-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.card-image{height:200px;overflow:hidden}
.card-image img,.rare-image img{width:100%;height:100%;object-fit:cover}
.product-card{cursor:pointer;transition:transform var(--transition),box-shadow var(--transition)}
.product-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-hover)}
.card-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:16px}
.add-cart-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:#fff;border:1.5px solid var(--color-primary);color:var(--color-primary);border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s ease}
.add-cart-btn:hover{background:var(--color-primary);color:#fff;transform:translateY(-1px);box-shadow:0 4px 12px rgba(58,40,27,.2)}
.add-cart-btn .cart-icon{font-size:14px}
.rare-list{display:flex;flex-direction:column;gap:16px}
.rare-item{display:flex;gap:18px;align-items:center;padding:var(--card-padding);cursor:pointer;transition:transform var(--transition),box-shadow var(--transition)}
.rare-item:hover{transform:translateY(-2px);box-shadow:var(--shadow-hover)}
.rare-image{width:88px;height:88px;flex-shrink:0;border-radius:12px;overflow:hidden}
.rare-info{flex:1}
.rare-action{display:flex;flex-direction:column;gap:10px;align-items:flex-end}
.blend-section { opacity: 0; transform: translateY(20px); animation: blendSectionFadeIn 0.8s ease forwards; }
@keyframes blendSectionFadeIn { to { opacity: 1; transform: translateY(0); } }
.blend-section-title { animation: titleFadeIn 0.6s ease forwards; }
@keyframes titleFadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.blend-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
.blend-card { padding: 0; cursor: pointer; transition: transform 0.3s ease-out, box-shadow 0.3s ease-out; opacity: 0; transform: translateY(20px); border: 1px solid rgba(184, 169, 153, 0.3); }
.blend-card:nth-child(1) { animation: blendCardSlideIn 0.5s ease 0.12s forwards; }
.blend-card:nth-child(2) { animation: blendCardSlideIn 0.5s ease 0.24s forwards; }
.blend-card:nth-child(3) { animation: blendCardSlideIn 0.5s ease 0.36s forwards; }
@keyframes blendCardSlideIn { to { opacity: 1; transform: translateY(0); } }
.blend-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(74, 60, 49, 0.15); }
.blend-card-inner { display: flex; align-items: center; padding: 20px; }
.blend-card-left { display: flex; gap: 16px; align-items: center; flex: 1; min-width: 0; }
.blend-card-image { width: 72px; height: 72px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0; background: linear-gradient(135deg, rgba(200,184,168,0.18), rgba(248,245,240,.9)); transition: transform 0.3s ease-out; }
.blend-card-image img { width: 100%; height: 100%; object-fit: cover; }
.blend-card:hover .blend-card-image { transform: scale(1.1); }
.blend-card-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.blend-title { font-size: 18px; font-weight: 600; color: #4A3C31; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.blend-desc { font-size: 13px; color: #B8A999; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.blend-price { display: flex; align-items: baseline; gap: 2px; }
.blend-price .currency { font-size: 14px; color: #4A3C31; font-weight: 600; }
.blend-price .amount { font-size: 20px; font-weight: 700; color: #4A3C31; font-family: 'SF Mono', monospace; }
.blend-price .unit { font-size: 12px; color: #7A6B5A; }
.blend-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; flex-shrink: 0; }
.blend-origin-tag { padding: 4px 12px; border-radius: 999px; background: rgba(200, 184, 168, 0.15); color: #7A6B5A; font-size: 12px; }
.blend-select-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; background: #fff; border: 1.5px solid #4A3C31; color: #4A3C31; border-radius: 8px; font-size: 14px; font-weight: 500; transition: all 0.3s ease-out; }
.blend-select-btn:hover { background: #4A3C31; color: #fff; transform: translateX(3px); box-shadow: 0 4px 12px rgba(74, 60, 49, 0.2); }
.rare-btn,.add-btn,.open-detail{background:var(--color-secondary);color:#fff;border-radius:999px;padding:10px 14px}
.modal-overlay{position:fixed;inset:0;background:rgba(45,31,20,.56);display:flex;align-items:center;justify-content:center;padding:20px;z-index:1000}
.origin-modal{max-width:520px;width:100%;padding:24px;position:relative}
.modal-header{display:flex;gap:14px;align-items:center;padding-right:48px}
.modal-close{position:absolute;top:16px;right:16px;background:rgba(58,40,27,.06);width:40px;height:40px;border-radius:999px}
.modal-body{padding-top:18px;color:var(--color-text)}
.origin-products{margin-top:16px;display:flex;flex-direction:column;gap:10px}
.product-item{display:flex;align-items:center;gap:12px;padding:12px;border-radius:var(--radius-sm);background:rgba(200,184,168,.12)}
.product-thumb{width:48px;height:48px;border-radius:8px;overflow:hidden;flex-shrink:0}
.product-thumb img{width:100%;height:100%;object-fit:cover}
.product-info{flex:1;display:flex;flex-direction:column;gap:4px}
.product-info span:first-child{font-size:var(--fs-body);color:var(--color-primary)}
.product-info span:last-child{font-size:var(--fs-small);color:var(--color-muted)}
.product-add{width:36px;height:36px;border-radius:50%;background:var(--color-secondary);color:#fff;display:grid;place-items:center}
@media (max-width:768px){.rare-item{flex-direction:column;align-items:flex-start}.rare-action{align-items:flex-start;width:100%}.map-container{aspect-ratio:auto;height:420px}}
</style>

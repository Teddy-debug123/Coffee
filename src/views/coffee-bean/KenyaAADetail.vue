<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Star, CaretLeft, CaretRight, ShoppingCart } from '@element-plus/icons-vue'
import NavBar from '../../components/NavBar.vue'
import SideMenu from '../../components/SideMenu.vue'
import CartSidebar from '../../components/CartSidebar.vue'
import { useCartStore } from '../../stores/cart'
import { useUserStore } from '../../stores/user'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const isLoading = ref(false)
const selectedWeight = ref('100g')
const currentImageIndex = ref(0)
const isImageModalOpen = ref(false)
const activeTab = ref('story')
const isAddingToCart = ref(false)

const productData = {
  name: '肯尼亚 AA',
  origin: '肯尼亚',
  category: '咖啡豆',
  rating: 4.8,
  reviews: 134,
  description: '黑醋栗风味，明亮酸度，红酒般复杂。',
  brewingGuide: '水温 93℃，粉水比 1:16，细粉慢萃，时长 2 分整。',
  notes: ['黑醋栗', '番茄', '黑莓', '蔗糖'],
  specs: ['100g', '250g'],
  prices: { '100g': 72, '250g': 138 },
  image: '/coffee-images/5.jpg',
  images: ['/coffee-images/5.jpg', '/coffee-images/5.jpg', '/coffee-images/5.jpg'],
  story: '肯尼亚涅里产区严格 AA 分级，双重水洗发酵，高海拔冷凉环境造就极致明亮果酸，酸度干净锐利，是果酸爱好者天花板单品。',
  process: '双重水洗单一产地',
  altitude: '1700-1900m',
  variety: 'SL28/SL34'
}

const flavorDescriptions = {
  '黑醋栗': '黑加仑的浓郁果香，酸度明亮',
  '番茄': '独特的番茄般明亮酸度，肯尼亚咖啡特征',
  '黑莓': '黑莓的酸甜果香，浓郁饱满',
  '蔗糖': '蔗糖的纯净甜味，口感清爽',
}

const specs = computed(() => productData.specs)
const selectedSpec = computed(() => specs.value.find(item => item === selectedWeight.value) || specs.value[0])
const price = computed(() => productData.prices[selectedSpec.value] || 0)
const images = computed(() => productData.images)
const currentImage = computed(() => images.value[currentImageIndex.value] || productData.image)

const filledStars = computed(() => Math.floor(productData.rating))
const hasHalfStar = computed(() => (productData.rating % 1) >= 0.5)
const emptyStars = computed(() => 5 - filledStars.value - (hasHalfStar.value ? 1 : 0))

const addToCart = async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login?redirect=' + encodeURIComponent(route.fullPath))
    return
  }
  if (isAddingToCart.value) return
  isAddingToCart.value = true
  await cartStore.addItem({ 
    id: route.params.beanId || 5, 
    name: productData.name, 
    price: price.value, 
    image: productData.image, 
    weight: selectedSpec.value, 
    category: productData.category, 
    origin: productData.origin 
  })
  ElMessage.success('已加入购物车')
  setTimeout(() => { isAddingToCart.value = false }, 600)
}

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length
}

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
}

const openImageModal = () => { isImageModalOpen.value = true }
const closeImageModal = () => { isImageModalOpen.value = false }

const tabs = [
  { key: 'story', label: '产品故事' },
  { key: 'brewing', label: '冲泡建议' },
  { key: 'info', label: '产品信息' }
]

const getTabContent = (key) => {
  switch (key) {
    case 'story': return productData.story
    case 'brewing': return productData.brewingGuide
    default: return ''
  }
}

watch(selectedWeight, () => {})
onMounted(() => { isLoading.value = false })
</script>

<template>
  <div class="detail-page">
    <NavBar @toggle-menu="isMenuOpen = true" @toggle-cart="isCartOpen = true" />
    <SideMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
    <CartSidebar :is-open="isCartOpen" @close="isCartOpen = false" />

    <section class="container detail-shell">
      <button class="back-btn" @click="router.back()">
        <ArrowLeft :size="18" />
        <span>返回</span>
      </button>

      <div class="detail-grid">
        <div class="image-box card">
          <div class="image-carousel" @click="openImageModal">
            <div class="carousel-main">
              <img :src="currentImage" :alt="productData.name" loading="lazy" class="carousel-image" />
              <div class="carousel-overlay">
                <span class="view-hint">点击查看大图</span>
              </div>
            </div>
            <button class="carousel-btn prev" @click.stop="prevImage">
              <CaretLeft :size="24" />
            </button>
            <button class="carousel-btn next" @click.stop="nextImage">
              <CaretRight :size="24" />
            </button>
            <div class="carousel-indicators">
              <span v-for="(img, index) in images" :key="index" class="indicator" :class="{ active: index === currentImageIndex }" @click.stop="currentImageIndex = index"></span>
            </div>
          </div>
        </div>

        <div class="info-box card">
          <p class="eyebrow">{{ productData.category }}</p>
          <div class="title-row">
            <h1 class="title">{{ productData.name }}</h1>
            <span v-if="productData.origin" class="origin-tag">{{ productData.origin }}</span>
          </div>

          <div v-if="productData.rating > 0" class="rating-row">
            <div class="stars">
              <Star v-for="n in filledStars" :key="'filled-' + n" :size="16" fill="#4A3C31" color="#4A3C31" />
              <span v-if="hasHalfStar" :key="'half'" class="half-star">
                <Star :size="16" fill="#4A3C31" color="#4A3C31" />
              </span>
              <Star v-for="n in emptyStars" :key="'empty-' + n" :size="16" color="#B8A999" />
            </div>
            <strong class="rating-value">{{ productData.rating }}</strong>
            <span class="reviews-count">{{ productData.reviews }} 条评价</span>
          </div>

          <p class="desc">{{ productData.description }}</p>

          <div class="section">
            <h3>规格选择</h3>
            <div class="specs">
              <button v-for="spec in specs" :key="spec" class="spec-btn" :class="{ active: selectedWeight === spec }" @click="selectedWeight = spec">
                {{ spec }}
              </button>
            </div>
          </div>

          <div class="section">
            <h3>风味关键词</h3>
            <div class="tags">
              <div v-for="note in productData.notes" :key="note" class="tag-wrapper">
                <span class="tag">{{ note }}</span>
                <span v-if="flavorDescriptions[note]" class="tag-tooltip">{{ flavorDescriptions[note] }}</span>
              </div>
            </div>
          </div>

          <div class="buy-row">
            <div class="price-wrap">
              <span class="price-label">售价</span>
              <span class="price">¥{{ price }}</span>
            </div>
            <div class="buy-actions">
              <button class="add-cart-btn" :class="{ adding: isAddingToCart }" @click="addToCart">
                <ShoppingCart :size="16" />
                <span>加入购物车</span>
              </button>
              <button class="buy-now-btn btn" @click="addToCart">立即购买</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container info-section">
      <div class="tabs-header">
        <button v-for="tab in tabs" :key="tab.key" class="tab-btn" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
          {{ tab.label }}
        </button>
      </div>
      <Transition name="tab-content" mode="out-in">
        <div v-if="activeTab === 'info'" key="info" class="info-grid">
          <div class="info-card card">
            <h3 class="card-title">产品信息</h3>
            <div class="info-list">
              <div class="info-item"><span class="info-label">类型</span><span class="info-value">{{ productData.process }}</span></div>
              <div class="info-item"><span class="info-label">规格</span><span class="info-value">{{ productData.variety }}</span></div>
              <div class="info-item"><span class="info-label">海拔</span><span class="info-value">{{ productData.altitude }}</span></div>
            </div>
          </div>
        </div>
        <div v-else key="content" class="tab-content-box card">
          <h3 class="card-title">{{ tabs.find(t => t.key === activeTab)?.label }}</h3>
          <p class="card-text">{{ getTabContent(activeTab) }}</p>
        </div>
      </Transition>
    </section>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isImageModalOpen" class="image-modal-overlay" @click="closeImageModal">
          <div class="image-modal-content" @click.stop>
            <button class="modal-close" @click="closeImageModal"><span>×</span></button>
            <img :src="currentImage" :alt="productData.name" class="modal-image" />
            <div class="modal-nav">
              <button class="modal-nav-btn" @click="prevImage"><CaretLeft :size="32" /></button>
              <button class="modal-nav-btn" @click="nextImage"><CaretRight :size="32" /></button>
            </div>
            <div class="modal-indicators">
              <span v-for="(img, index) in images" :key="index" class="indicator" :class="{ active: index === currentImageIndex }" @click="currentImageIndex = index"></span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.detail-page { min-height: 100vh; background: var(--color-bg); }
.detail-shell { padding-top: 120px; padding-bottom: 64px; }
.info-section { padding-bottom: 64px; }
.back-btn { margin-bottom: 20px; color: var(--color-muted); font-size: var(--fs-body); display: flex; align-items: center; gap: 8px; background: transparent; padding: 8px 0; transition: all 0.3s ease; }
.back-btn:hover { color: var(--color-primary); transform: translateX(-3px); }
.back-btn svg { transition: transform 0.3s ease; }
.back-btn:hover svg { transform: translateX(-2px); }
.detail-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 24px; align-items: start; }
.image-box { min-height: 560px; overflow: hidden; border-radius: var(--radius-lg); border: 1px solid var(--color-line); background: var(--color-surface); }
.image-carousel { position: relative; width: 100%; height: 100%; }
.carousel-main { position: relative; width: 100%; height: 100%; overflow: hidden; }
.carousel-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.carousel-main:hover .carousel-image { transform: scale(1.02); }
.carousel-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; background: linear-gradient(transparent, rgba(0,0,0,0.3)); opacity: 0; transition: opacity 0.3s ease; }
.carousel-main:hover .carousel-overlay { opacity: 1; }
.view-hint { color: rgba(255,255,255,0.8); font-size: 13px; }
.carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.8); border: 1px solid var(--color-line); display: flex; align-items: center; justify-content: center; color: var(--color-primary); opacity: 0; transition: all 0.3s ease; z-index: 10; }
.carousel-btn.prev { left: 16px; }
.carousel-btn.next { right: 16px; }
.image-carousel:hover .carousel-btn { opacity: 1; }
.carousel-btn:hover { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.carousel-indicators { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
.indicator { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s ease; }
.indicator.active { width: 24px; border-radius: 4px; background: #fff; }
.info-box { padding: 32px; display: flex; flex-direction: column; gap: 20px; border-radius: var(--radius-lg); border: 1px solid var(--color-line); background: var(--color-surface); animation: infoSlideIn 0.5s ease 0.2s forwards; opacity: 0; transform: translateY(20px); }
@keyframes infoSlideIn { to { opacity: 1; transform: translateY(0); } }
.eyebrow { font-size: var(--fs-small); letter-spacing: 0.22em; color: var(--color-muted); text-transform: uppercase; margin: 0; }
.title-row { display: flex; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
.title { font-size: var(--fs-h1); font-family: var(--font-display); color: var(--color-primary); line-height: 1.15; margin: 0; }
.origin-tag { padding: 4px 12px; border-radius: 999px; background: rgba(200, 184, 168, 0.15); color: #7A6B5A; font-size: 13px; margin-top: 8px; }
.rating-row { display: flex; gap: 10px; align-items: center; color: var(--color-muted); }
.stars { display: flex; gap: 2px; }
.half-star { position: relative; overflow: hidden; width: 10px; }
.rating-value { font-size: 20px; font-weight: 600; color: var(--color-primary); }
.reviews-count { font-size: 13px; color: var(--color-muted); }
.desc, .section p { line-height: 1.8; color: var(--color-text); font-size: var(--fs-body); margin: 0; }
.section { padding: 20px 0; border-top: 1px dashed var(--color-line); }
.section:first-of-type { border-top: none; }
.section h3 { font-size: var(--fs-h3); color: var(--color-primary); margin-bottom: 16px; }
.specs, .tags { display: flex; flex-wrap: wrap; gap: 10px; }
.spec-btn { padding: 12px 20px; border-radius: 999px; background: rgba(245, 240, 232, 0.8); border: 1.5px solid rgba(184, 169, 153, 0.4); color: var(--color-primary); font-size: var(--fs-body); font-weight: 500; transition: all 0.3s ease; }
.spec-btn:hover { border-color: var(--color-primary); background: rgba(200, 184, 168, 0.15); }
.spec-btn.active { background: #4A3C31; color: #fff; border-color: #4A3C31; transform: scale(1.02); }
.tag-wrapper { position: relative; }
.tag { display: inline-block; padding: 10px 18px; border-radius: 999px; background: rgba(200, 184, 168, 0.16); color: var(--color-primary); font-size: var(--fs-body); font-weight: 500; transition: all 0.3s ease; cursor: pointer; }
.tag:hover { background: rgba(200, 184, 168, 0.3); transform: translateY(-2px); }
.tag-tooltip { position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); padding: 10px 14px; background: rgba(74, 60, 49, 0.95); color: #fff; font-size: 12px; border-radius: 8px; white-space: nowrap; opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 100; }
.tag-tooltip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 6px solid transparent; border-top-color: rgba(74, 60, 49, 0.95); }
.tag-wrapper:hover .tag-tooltip { opacity: 1; visibility: visible; }
.buy-row { margin-top: auto; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding-top: 24px; border-top: 1px dashed var(--color-line); }
.price-wrap { display: flex; flex-direction: column; gap: 4px; }
.price-label { font-size: 13px; color: var(--color-muted); }
.price { font-size: 36px; font-weight: 700; color: var(--color-primary); font-family: 'SF Mono', monospace; }
.buy-actions { display: flex; gap: 12px; }
.add-cart-btn { display: flex; align-items: center; gap: 8px; padding: 14px 22px; background: rgba(245, 240, 232, 0.8); border: 1.5px solid var(--color-primary); color: var(--color-primary); font-size: var(--fs-body); font-weight: 500; border-radius: 12px; transition: all 0.3s ease; }
.add-cart-btn svg { width: 18px !important; height: 18px !important; }
.add-cart-btn:hover { background: rgba(74, 60, 49, 0.05); transform: translateY(-2px); }
.add-cart-btn.adding { animation: cartBounce 0.4s ease; }
@keyframes cartBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.95); } }
.buy-now-btn { padding: 14px 32px; background: #4A3C31; color: #fff; font-size: var(--fs-body); font-weight: 500; border-radius: 12px; transition: all 0.3s ease; }
.buy-now-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(74, 60, 49, 0.25); }
.tabs-header { display: flex; gap: 0; margin-bottom: 20px; background: var(--color-surface); padding: 6px; border-radius: var(--radius-lg); border: 1px solid var(--color-line); }
.tab-btn { flex: 1; padding: 14px 20px; background: transparent; color: var(--color-muted); font-size: var(--fs-body); font-weight: 500; border-radius: 10px; transition: all 0.3s ease; }
.tab-btn.active { background: #fff; color: var(--color-primary); box-shadow: 0 2px 8px rgba(74, 60, 49, 0.08); }
.info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
.tab-content-box, .info-card { padding: 28px; border-radius: var(--radius-lg); border: 1px solid var(--color-line); background: var(--color-surface); }
.card-title { font-size: var(--fs-h3); color: var(--color-primary); margin-bottom: 14px; }
.card-text { line-height: 1.8; color: var(--color-text); font-size: var(--fs-body); }
.info-list { display: flex; flex-direction: column; gap: 12px; }
.info-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dashed var(--color-line); }
.info-item:last-child { border-bottom: none; }
.info-label { font-size: var(--fs-body); color: var(--color-muted); }
.info-value { font-size: var(--fs-body); color: var(--color-primary); font-weight: 500; }
.tab-content-enter-active, .tab-content-leave-active { transition: all 0.3s ease; }
.tab-content-enter-from { opacity: 0; transform: translateY(10px); }
.tab-content-leave-to { opacity: 0; transform: translateY(-10px); }
.image-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.image-modal-content { position: relative; max-width: 90vw; max-height: 90vh; background: #fff; border-radius: var(--radius-lg); overflow: hidden; }
.modal-close { position: absolute; top: 16px; right: 16px; width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.5); color: #fff; font-size: 24px; display: flex; align-items: center; justify-content: center; z-index: 10; transition: all 0.3s ease; }
.modal-close:hover { background: rgba(0,0,0,0.7); }
.modal-image { max-width: 100%; max-height: 85vh; object-fit: contain; }
.modal-nav { position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); display: flex; justify-content: space-between; padding: 0 20px; }
.modal-nav-btn { width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.8); border: none; display: flex; align-items: center; justify-content: center; color: var(--color-primary); transition: all 0.3s ease; }
.modal-nav-btn:hover { background: #fff; transform: scale(1.1); }
.modal-indicators { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; }
.modal-indicators .indicator { background: rgba(255,255,255,0.4); }
.modal-indicators .indicator.active { background: #fff; }
@media (max-width: 960px) { .detail-grid { grid-template-columns: 1fr; } .image-box { min-height: 380px; } .info-grid { grid-template-columns: 1fr; } .info-box { padding: 24px; } .buy-row { flex-direction: column; align-items: stretch; } .buy-actions { width: 100%; } .add-cart-btn, .buy-now-btn { flex: 1; justify-content: center; } }
</style>
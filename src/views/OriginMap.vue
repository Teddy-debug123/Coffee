<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { Close, Plus, ArrowRight } from '@element-plus/icons-vue'
import { origin } from '../api'
import NavBar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import CartSidebar from '../components/CartSidebar.vue'

const router = useRouter()
const cartStore = useCartStore()

const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const selectedOrigin = ref(null)
const isModalOpen = ref(false)
const mapContainer = ref(null)
const scrollY = ref(0)
const isLoading = ref(true)

const origins = ref([
  {
    id: 1,
    name: '埃塞俄比亚',
    nameEn: 'Ethiopia',
    x: 28,
    y: 35,
    color: '#C4A35A',
    altitude: '1,500-2,200m',
    varieties: ['耶加雪菲', '西达摩', '哈拉尔'],
    flavors: ['柑橘', '花香', '蜂蜜', '红茶'],
    season: '11月-次年2月',
    roastLevel: '浅度烘焙',
    description: '咖啡的发源地，拥有最丰富的咖啡基因库。独特的花香和果香使其成为精品咖啡的代名词。'
  },
  {
    id: 2,
    name: '哥伦比亚',
    nameEn: 'Colombia',
    x: 22,
    y: 58,
    color: '#A67B5B',
    altitude: '1,300-1,800m',
    varieties: ['卡斯蒂略', '卡杜拉', '波旁'],
    flavors: ['坚果', '焦糖', '柑橘', '可可'],
    season: '9月-12月',
    roastLevel: '中度烘焙',
    description: '世界第二大咖啡生产国，以均衡的口感和温和的酸度著称，适合日常饮用。'
  },
  {
    id: 3,
    name: '危地马拉',
    nameEn: 'Guatemala',
    x: 20,
    y: 53,
    color: '#8B6914',
    altitude: '1,500-1,800m',
    varieties: ['波旁', '帕卡斯', '卡杜拉'],
    flavors: ['黑巧克力', '烟熏', '水果', '香料'],
    season: '11月-次年2月',
    roastLevel: '中深度烘焙',
    description: '火山土壤孕育出复杂风味，带有独特的烟熏和香料气息。'
  },
  {
    id: 4,
    name: '巴西',
    nameEn: 'Brazil',
    x: 28,
    y: 68,
    color: '#B8860B',
    altitude: '1,000-1,500m',
    varieties: ['喜拉朵', '波旁', '卡杜艾'],
    flavors: ['坚果', '巧克力', '焦糖', '柔和酸度'],
    season: '5月-9月',
    roastLevel: '中度烘焙',
    description: '世界最大的咖啡生产国，口感醇厚，带有浓郁的坚果和巧克力风味。'
  },
  {
    id: 5,
    name: '肯尼亚',
    nameEn: 'Kenya',
    x: 35,
    y: 42,
    color: '#CD853F',
    altitude: '1,700-2,100m',
    varieties: ['SL28', 'SL34', 'Ruiru11'],
    flavors: ['黑醋栗', '番茄', '红酒', '明亮酸度'],
    season: '10月-12月',
    roastLevel: '浅度烘焙',
    description: '以独特的黑醋栗风味和明亮酸度闻名，是非洲精品咖啡的代表。'
  },
  {
    id: 6,
    name: '印尼',
    nameEn: 'Indonesia',
    x: 72,
    y: 48,
    color: '#8B4513',
    altitude: '1,100-1,500m',
    varieties: ['曼特宁', '耶加', '罗布斯塔'],
    flavors: ['草本', '泥土', '雪松', '低酸度'],
    season: '6月-9月',
    roastLevel: '深度烘焙',
    description: '亚洲咖啡的代表，具有浓郁的草本和泥土风味，适合制作意式咖啡。'
  },
  {
    id: 7,
    name: '云南',
    nameEn: 'Yunnan',
    x: 62,
    y: 38,
    color: '#D2691E',
    altitude: '1,400-1,800m',
    varieties: ['卡蒂姆', '铁皮卡', '波旁'],
    flavors: ['坚果', '红糖', '柑橘', '柔和花香'],
    season: '10月-12月',
    roastLevel: '中度烘焙',
    description: '中国咖啡的主产区，高海拔种植带来丰富的层次感和柔和的酸度。'
  },
  {
    id: 8,
    name: '哥斯达黎加',
    nameEn: 'Costa Rica',
    x: 18,
    y: 56,
    color: '#CD5C5C',
    altitude: '1,200-1,700m',
    varieties: ['卡杜拉', '卡杜艾', '帕卡斯'],
    flavors: ['柑橘', '蜂蜜', '坚果', '明亮'],
    season: '12月-3月',
    roastLevel: '浅中度烘焙',
    description: '以严格的水洗处理法著称，口感干净，酸度明亮。'
  }
])

const featuredOrigins = ref([
  {
    id: 1,
    originId: 1,
    name: '耶加雪菲',
    origin: '埃塞俄比亚',
    price: 168,
    weight: '100g',
    rating: 4.9,
    description: '花香浓郁，柑橘酸甜，蜂蜜余韵'
  },
  {
    id: 2,
    originId: 5,
    name: '肯尼亚AA',
    origin: '肯尼亚',
    price: 188,
    weight: '100g',
    rating: 4.8,
    description: '黑醋栗风味，明亮酸度，红酒般复杂'
  }
])

const rareOrigins = ref([
  {
    id: 3,
    originId: 6,
    name: '曼特宁',
    origin: '印尼',
    price: 158,
    weight: '100g',
    rating: 4.7,
    description: '草本香气，浓郁醇厚，低酸度'
  },
  {
    id: 4,
    originId: 3,
    name: '安提瓜',
    origin: '危地马拉',
    price: 178,
    weight: '100g',
    rating: 4.8,
    description: '火山土壤，烟熏风味，黑巧克力'
  }
])

const blendOrigins = ref([
  {
    id: 5,
    originId: 2,
    name: '哥伦比亚慧兰',
    origin: '哥伦比亚',
    price: 128,
    weight: '200g',
    rating: 4.6,
    description: '均衡柔和，坚果焦糖，日常优选'
  },
  {
    id: 6,
    originId: 4,
    name: '巴西喜拉朵',
    origin: '巴西',
    price: 98,
    weight: '200g',
    rating: 4.5,
    description: '醇厚饱满，巧克力风味，性价比高'
  },
  {
    id: 7,
    originId: 7,
    name: '云南普洱',
    origin: '云南',
    price: 138,
    weight: '200g',
    rating: 4.6,
    description: '红糖甜感，柔和花香，国货精品'
  }
])

const activeOrigin = ref(null)

const handleOriginHover = (origin) => {
  activeOrigin.value = origin
}

const handleOriginLeave = () => {
  activeOrigin.value = null
}

const handleOriginClick = (origin) => {
  selectedOrigin.value = origin
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedOrigin.value = null
  }, 300)
}

const addToCart = (product) => {
  cartStore.addItem(product.id, 'bean', 1)
}

const handleScroll = () => {
  scrollY.value = window.scrollY
}

const navigateToHome = () => {
  router.push('/home')
}

const loadOrigins = async () => {
  try {
    const response = await origin.getPoints()
    if (response && response.data) {
      const detailedOrigins = []
      for (const point of response.data) {
        const detail = await origin.getDetail(point.id)
        if (detail && detail.data) {
          detailedOrigins.push({
            ...point,
            altitude: detail.data.altitude,
            varieties: detail.data.varieties || [],
            flavors: detail.data.flavors || [],
            season: detail.data.season,
            roastLevel: detail.data.roastLevel,
            description: detail.data.description
          })
        } else {
          detailedOrigins.push(point)
        }
      }
      origins.value = detailedOrigins
    }
  } catch (error) {
    console.error('Failed to load origins:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  loadOrigins()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="origin-map-container">
    <NavBar 
      @toggleMenu="isMenuOpen = !isMenuOpen" 
      @toggleCart="isCartOpen = !isCartOpen" 
    />
    
    <SideMenu :isOpen="isMenuOpen" />
    <CartSidebar :isOpen="isCartOpen" />

    <header class="map-header" :style="{ transform: `translateY(${scrollY * 0.1}px)` }">
      <div class="header-content">
        <h1 class="main-title">咖啡产地地图</h1>
        <p class="sub-title">探索全球精品咖啡的源头</p>
      </div>
    </header>

    <section class="map-section" :style="{ transform: `translateY(${scrollY * 0.05}px)` }">
      <div ref="mapContainer" class="map-container">
        <svg class="world-map" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:rgba(139, 115, 85, 0.3)" />
              <stop offset="50%" style="stop-color:rgba(212, 165, 116, 0.6)" />
              <stop offset="100%" style="stop-color:rgba(139, 115, 85, 0.3)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <radialGradient id="pointGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:white;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:white;stop-opacity:0" />
            </radialGradient>
          </defs>

          <path 
            class="map-outline"
            d="M18,25 Q20,22 22,24 L25,23 Q27,25 26,27 L24,29 Q22,28 21,30 L19,29 Q17,27 18,25 Z
               M25,28 Q28,26 30,28 L32,27 Q34,29 33,31 L31,32 Q29,31 28,33 L26,32 Q24,30 25,28 Z
               M35,30 Q38,28 40,30 L42,29 Q44,31 43,33 L41,34 Q39,33 38,35 L36,34 Q34,32 35,30 Z
               M55,35 Q58,33 60,35 L62,34 Q64,36 63,38 L61,39 Q59,38 58,40 L56,39 Q54,37 55,35 Z
               M70,40 Q73,38 75,40 L77,39 Q79,41 78,43 L76,44 Q74,43 73,45 L71,44 Q69,42 70,40 Z
               M80,45 Q83,43 85,45 L87,44 Q89,46 88,48 L86,49 Q84,48 83,50 L81,49 Q79,47 80,45 Z"
            fill="none"
            stroke="#8B7355"
            stroke-width="0.15"
            opacity="0.4"
          />

          <path 
            class="map-continent"
            d="M15,20 L20,18 L25,20 L30,18 L35,22 L32,28 L28,32 L22,30 L18,28 L15,24 Z"
            fill="none"
            stroke="#8B7355"
            stroke-width="0.2"
            opacity="0.3"
          />
          <path 
            class="map-continent"
            d="M15,50 L18,45 L22,48 L28,44 L32,47 L35,52 L30,58 L25,55 L20,58 L15,55 Z"
            fill="none"
            stroke="#8B7355"
            stroke-width="0.2"
            opacity="0.3"
          />
          <path 
            class="map-continent"
            d="M55,30 L65,28 L72,32 L75,38 L70,42 L65,40 L60,44 L55,40 L52,35 Z"
            fill="none"
            stroke="#8B7355"
            stroke-width="0.2"
            opacity="0.3"
          />
          <path 
            class="map-continent"
            d="M75,50 L85,48 L90,52 L92,58 L88,62 L82,60 L78,65 L72,60 L70,55 Z"
            fill="none"
            stroke="#8B7355"
            stroke-width="0.2"
            opacity="0.3"
          />

          <template v-for="origin in origins" :key="origin.id">
            <path 
              class="connection-line"
              :d="`M50,15 Q${origin.x},${origin.y * 0.5} ${origin.x},${origin.y - 2}`"
              fill="none"
              stroke="url(#lineGradient)"
              stroke-width="0.1"
              :class="{ active: activeOrigin?.id === origin.id }"
            />
            <circle 
              :cx="origin.x" 
              :cy="origin.y" 
              r="1"
              :fill="origin.color"
              :class="{ active: activeOrigin?.id === origin.id }"
              filter="url(#glow)"
              @mouseenter="handleOriginHover(origin)"
              @mouseleave="handleOriginLeave"
              @click="handleOriginClick(origin)"
              style="cursor: pointer;"
            />
            <circle 
              v-if="activeOrigin?.id === origin.id"
              :cx="origin.x" 
              :cy="origin.y" 
              r="2"
              fill="url(#pointGlow)"
              opacity="0.5"
            />
          </template>
        </svg>

        <div class="map-labels">
          <div 
            v-for="origin in origins" 
            :key="'label-' + origin.id"
            class="origin-label"
            :style="{ left: `${origin.x}%`, top: `${origin.y + 3}%` }"
          >
            <span class="label-name">{{ origin.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-section">
      <div class="section-header">
        <h2 class="section-title">当季主推产区</h2>
        <p class="section-desc">精选本季最佳风味</p>
      </div>
      <div class="featured-grid">
        <div 
          v-for="item in featuredOrigins" 
          :key="item.id"
          class="product-card featured-card"
        >
          <div class="card-image">
            <img :src="`https://neeko-copilot.bytedance.net/api/text_to_image?prompt=premium%20coffee%20beans%20${item.name}%20dark%20background&image_size=square`" :alt="item.name" />
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ item.name }}</h3>
            <p class="card-origin">{{ item.origin }}</p>
            <p class="card-desc">{{ item.description }}</p>
            <div class="card-footer">
              <div class="price">
                <span class="currency">¥</span>
                <span class="amount">{{ item.price }}</span>
                <span class="unit">/{{ item.weight }}</span>
              </div>
              <button class="add-btn" @click="addToCart(item)">
                <Plus :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="rare-section">
      <div class="section-header">
        <h2 class="section-title">珍稀单一产地豆</h2>
        <p class="section-desc">限量供应，品质卓越</p>
      </div>
      <div class="rare-list">
        <div 
          v-for="item in rareOrigins" 
          :key="item.id"
          class="rare-item"
        >
          <div class="rare-image">
            <img :src="`https://neeko-copilot.bytedance.net/api/text_to_image?prompt=rare%20coffee%20beans%20${item.name}%20elegant&image_size=square`" :alt="item.name" />
          </div>
          <div class="rare-info">
            <h3 class="rare-title">{{ item.name }}</h3>
            <p class="rare-origin">{{ item.origin }}</p>
            <p class="rare-desc">{{ item.description }}</p>
          </div>
          <div class="rare-action">
            <span class="rare-price">¥{{ item.price }}/{{ item.weight }}</span>
            <button class="rare-btn" @click="addToCart(item)">加入购物车</button>
          </div>
        </div>
      </div>
    </section>

    <section class="blend-section">
      <div class="section-header">
        <h2 class="section-title">经典拼配原料产地</h2>
        <p class="section-desc">匠心调配，风味均衡</p>
      </div>
      <div class="blend-grid">
        <div 
          v-for="item in blendOrigins" 
          :key="item.id"
          class="blend-card"
        >
          <div class="blend-header">
            <h3 class="blend-title">{{ item.name }}</h3>
            <span class="blend-origin">{{ item.origin }}</span>
          </div>
          <p class="blend-desc">{{ item.description }}</p>
          <div class="blend-footer">
            <span class="blend-price">¥{{ item.price }}/{{ item.weight }}</span>
            <button class="blend-btn" @click="addToCart(item)">
              选购
              <ArrowRight :size="16" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <footer class="page-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="brand-main">COFFEE</span>
          <span class="brand-sub">ONLINE</span>
        </div>
        <p class="footer-text">探索世界咖啡的无限可能</p>
        <p class="copyright">© 2024 Coffee Online. All rights reserved.</p>
      </div>
    </footer>

    <Transition name="modal">
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="origin-modal" @click.stop>
          <button class="modal-close" @click="closeModal">
            <Close :size="20" />
          </button>
          <div class="modal-header">
            <div class="origin-badge" :style="{ background: selectedOrigin?.color }"></div>
            <div class="origin-title-wrap">
              <h2 class="modal-title">{{ selectedOrigin?.name }}</h2>
              <span class="modal-subtitle">{{ selectedOrigin?.nameEn }}</span>
            </div>
          </div>
          <div class="modal-body">
            <p class="origin-desc">{{ selectedOrigin?.description }}</p>
            
            <div class="origin-stats">
              <div class="stat-item">
                <span class="stat-label">海拔</span>
                <span class="stat-value">{{ selectedOrigin?.altitude }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">采收季节</span>
                <span class="stat-value">{{ selectedOrigin?.season }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">烘焙等级</span>
                <span class="stat-value">{{ selectedOrigin?.roastLevel }}</span>
              </div>
            </div>

            <div class="origin-details">
              <div class="detail-section">
                <h4 class="detail-title">主要品种</h4>
                <div class="detail-tags">
                  <span 
                    v-for="variety in selectedOrigin?.varieties" 
                    :key="variety"
                    class="detail-tag"
                  >{{ variety }}</span>
                </div>
              </div>
              <div class="detail-section">
                <h4 class="detail-title">风味特征</h4>
                <div class="detail-tags">
                  <span 
                    v-for="flavor in selectedOrigin?.flavors" 
                    :key="flavor"
                    class="detail-tag flavor"
                  >{{ flavor }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.origin-map-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FAF8F5 0%, #F5F2EC 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.map-header {
  padding: 120px 2rem 4rem;
  text-align: center;
  transition: transform 0.3s ease-out;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.main-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 200;
  color: #2D1F14;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.sub-title {
  font-size: 1.1rem;
  color: #8B7355;
  font-weight: 400;
  letter-spacing: 0.1em;
}

.map-section {
  padding: 2rem;
  transition: transform 0.3s ease-out;
}

.map-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  height: 400px;
}

.world-map {
  width: 100%;
  height: 100%;
}

.map-outline {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.connection-line {
  transition: all 0.5s ease;
  stroke-dasharray: 2, 2;
  animation: flowLine 3s linear infinite;
}

.connection-line.active {
  stroke-width: 0.15;
  opacity: 1;
}

@keyframes flowLine {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -8; }
}

circle {
  transition: all 0.3s ease;
}

circle.active {
  transform: scale(1.5);
}

.map-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.origin-label {
  position: absolute;
  transform: translateX(-50%);
  pointer-events: none;
}

.label-name {
  font-size: 0.75rem;
  color: #5C4033;
  white-space: nowrap;
  opacity: 0.8;
}

.featured-section {
  padding: 4rem 2rem;
  background: #fff;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 300;
  color: #2D1F14;
  margin-bottom: 0.5rem;
}

.section-desc {
  font-size: 0.95rem;
  color: #8B7355;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s ease;
}

.featured-card {
  box-shadow: 0 4px 20px rgba(45, 31, 20, 0.08);
  border: 1px solid rgba(139, 115, 85, 0.1);
}

.featured-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(45, 31, 20, 0.12);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.product-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #2D1F14;
  margin-bottom: 0.25rem;
}

.card-origin {
  font-size: 0.85rem;
  color: #8B7355;
  margin-bottom: 0.75rem;
}

.card-desc {
  font-size: 0.9rem;
  color: #5C4033;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 0.9rem;
  color: #8B7355;
}

.amount {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2D1F14;
}

.unit {
  font-size: 0.8rem;
  color: #8B7355;
  margin-left: 0.25rem;
}

.add-btn {
  width: 40px;
  height: 40px;
  background: #2D1F14;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #3D2914;
  transform: scale(1.1);
}

.rare-section {
  padding: 4rem 2rem;
  background: linear-gradient(180deg, rgba(139, 115, 85, 0.05) 0%, rgba(139, 115, 85, 0.02) 100%);
}

.rare-list {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rare-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border-bottom: 1px solid rgba(139, 115, 85, 0.15);
  transition: all 0.3s ease;
}

.rare-item:hover {
  background: #fff;
  transform: translateX(8px);
}

.rare-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.rare-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rare-info {
  flex: 1;
}

.rare-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2D1F14;
  margin-bottom: 0.25rem;
}

.rare-origin {
  font-size: 0.8rem;
  color: #8B7355;
  margin-bottom: 0.5rem;
}

.rare-desc {
  font-size: 0.85rem;
  color: #5C4033;
  line-height: 1.5;
}

.rare-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.rare-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2D1F14;
}

.rare-btn {
  padding: 0.5rem 1.25rem;
  background: transparent;
  border: 1px solid #8B7355;
  color: #8B7355;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rare-btn:hover {
  background: #8B7355;
  color: #fff;
}

.blend-section {
  padding: 4rem 2rem;
}

.blend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.blend-card {
  padding: 2rem;
  text-align: center;
  border-top: 2px solid #8B7355;
  transition: all 0.3s ease;
}

.blend-card:hover {
  background: rgba(139, 115, 85, 0.03);
  transform: translateY(-4px);
}

.blend-header {
  margin-bottom: 1rem;
}

.blend-title {
  font-size: 1.15rem;
  font-weight: 500;
  color: #2D1F14;
  margin-bottom: 0.25rem;
}

.blend-origin {
  font-size: 0.8rem;
  color: #8B7355;
}

.blend-desc {
  font-size: 0.85rem;
  color: #5C4033;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.blend-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.blend-price {
  font-size: 1rem;
  font-weight: 600;
  color: #2D1F14;
}

.blend-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: transparent;
  border: none;
  color: #8B7355;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.blend-btn:hover {
  color: #2D1F14;
}

.page-footer {
  padding: 3rem 2rem;
  background: #2D1F14;
  text-align: center;
}

.footer-content {
  max-width: 600px;
  margin: 0 auto;
}

.footer-brand {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.brand-main {
  font-size: 1.25rem;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
}

.brand-sub {
  font-size: 0.875rem;
  font-weight: 500;
  color: #8B7355;
  letter-spacing: 0.2em;
}

.footer-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
}

.copyright {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 31, 20, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.origin-modal {
  background: #fff;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  transform: scale(0.9);
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .origin-modal,
.modal-leave-to .origin-modal {
  transform: scale(0.9);
}

.modal-enter-to .origin-modal,
.modal-leave-from .origin-modal {
  transform: scale(1);
  opacity: 1;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 50%;
  color: #5C4033;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 2rem 1rem;
}

.origin-badge {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.origin-title-wrap {
  display: flex;
  flex-direction: column;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 400;
  color: #2D1F14;
  margin-bottom: 0.25rem;
}

.modal-subtitle {
  font-size: 0.85rem;
  color: #8B7355;
  letter-spacing: 0.1em;
}

.modal-body {
  padding: 0 2rem 2rem;
}

.origin-desc {
  font-size: 0.95rem;
  color: #5C4033;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.origin-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(139, 115, 85, 0.05);
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #8B7355;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1rem;
  font-weight: 500;
  color: #2D1F14;
}

.origin-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: #8B7355;
  letter-spacing: 0.08em;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detail-tag {
  padding: 0.375rem 0.875rem;
  background: rgba(139, 115, 85, 0.1);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #5C4033;
}

.detail-tag.flavor {
  background: rgba(212, 165, 116, 0.15);
  color: #8B6914;
}

@media (max-width: 768px) {
  .map-header {
    padding: 100px 1rem 2rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .map-container {
    height: 300px;
  }

  .featured-grid {
    grid-template-columns: 1fr;
  }

  .rare-item {
    flex-direction: column;
    text-align: center;
  }

  .rare-action {
    align-items: center;
  }

  .blend-grid {
    grid-template-columns: 1fr;
  }

  .origin-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
